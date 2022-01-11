import { getSession } from "@auth0/nextjs-auth0";
import { Prisma, PrismaClient } from "@prisma/client";
import { createTRPCClient } from "@trpc/client";
import { httpLink } from "@trpc/client/links/httpLink";
import { compare, genSalt, hash } from "bcrypt";
import { CookieSerializeOptions, serialize } from "cookie";
import rateLimit from "express-rate-limit";
import { createSigner, createVerifier } from "fast-jwt";
import ms from "ms";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect, { Middleware } from "next-connect";
import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import path from "path";
import superjson from "superjson";
import { isProd } from "~/config";
import { AppRouter } from "~/server/routers/_app";
import ApiRequestGQL, { ApiRequest } from "~/types/ApiRequest";
import ApiResponse from "~/types/ApiResponse";
import DecodedPat from "~/types/DecodedPat";
import { getDeploymentUrl } from "./misc";

/* -------------------------------------------------------------------------- */
/*                                 Auth Utils                                 */
/* -------------------------------------------------------------------------- */

export const jwtSign = createSigner({
	key: async () => process.env.JWT_SECRET,
});

export const jwtVerify = createVerifier({
	key: async () => process.env.JWT_SECRET,
	maxAge: ms("12h"),
});

export const hashPassword = async (password: string) => {
	const salt = await genSalt(10);
	return await hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) => {
	return await compare(password, hash);
};

/* -------------------------------------------------------------------------- */
/*                                   Prisma                                   */
/* -------------------------------------------------------------------------- */

const options: Prisma.PrismaClientOptions = {};
if (!isProd && !!process.env.PRISMA_LOG)
	options.log = ["query", "info", `warn`, `error`];

if (!(global as any).prisma) (global as any).prisma = new PrismaClient(options);

export const prisma = (global as any).prisma as PrismaClient;

/* -------------------------------------------------------------------------- */
/*                                Next Connect                                */
/* -------------------------------------------------------------------------- */

export const createHandler = <Req = NextApiRequest, Res = NextApiResponse>() =>
	nextConnect<Req, Res>();

/* -------------------------------------------------------------------------- */
/*                                Cookie utils                                */
/* -------------------------------------------------------------------------- */

/**
 * This sets `cookie` on `res` object
 */
export const createSetCookie =
	(res: ApiResponse) =>
	(name: string, value: string, options: CookieSerializeOptions = {}) => {
		const stringValue =
			typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

		if (options?.maxAge) {
			options.expires = new Date(Date.now() + options?.maxAge);
		}

		res.setHeader("Set-Cookie", serialize(name, String(stringValue), options));

		return res;
	};

/**
 * Adds `cookie` function on `res.cookie` to set cookies for response
 */
export function withCookies<
	T extends NextApiRequest | ApiRequest | ApiRequestGQL,
	U,
>(handler: (req: T, res: ApiResponse) => U) {
	return (req: T, res: ApiResponse) => {
		res.setCookie = createSetCookie(res);
		res.removeCookie = (name: string) =>
			res.setCookie(name, "", { maxAge: -1, path: "/" });

		return handler(req, res);
	};
}

/* -------------------------------------------------------------------------- */
/*                                   Mailer                                   */
/* -------------------------------------------------------------------------- */

const mailerConfig: Record<string, SMTPTransport.Options> = {
	dev: {
		host: "mailhog",
		port: 1025,
	},
	prod: {},
};

export const mailer = createTransport(
	isProd ? mailerConfig.prod : mailerConfig.dev,
);

/* -------------------------------------------------------------------------- */
/*                              Public API Utils                              */
/* -------------------------------------------------------------------------- */

// PAT - Personal Access Token

export const jwtSignPat = createSigner({
	key: async () => process.env.JWT_SECRET_PAT,
});

export const createPat = async (id: string, scopes: string[]) => {
	return await jwtSignPat({
		sub: id,
		scopes,
	});
};

export const jwtVerifyPat = createVerifier({
	key: async () => process.env.JWT_SECRET_PAT,
});

export const patAuthMiddleware: Middleware<ApiRequestGQL, ApiResponse> = async (
	req,
	res,
	next,
) => {
	const auth = req.headers?.authorization;

	if (typeof auth !== "string") {
		res.status(400).send({ message: "Authorization header not found." });
		return;
	}

	const isMatching = /^Bearer\s+(.+)/.exec(auth);
	if (isMatching) {
		try {
			const token = auth.split(" ")[1].trim();
			const decoded: DecodedPat = await jwtVerifyPat(token);
			try {
				const pat = await prisma.accessToken.findUnique({
					where: {
						id: decoded.sub,
					},
					include: {
						User: true,
					},
				});

				if (!pat) res.status(500).send({ message: "Invalid token." });

				req.ctx = {
					decodedJwt: decoded,
					userId: pat?.User?.id,
				};
				next();
			} catch (err) {
				res.status(500).send({ message: "Invalid token." });
			}
		} catch (err) {
			res.status(400).send({ message: "Invalid token." });
		}
		return;
	} else {
		res.status(400).send({
			message: 'Invalid Authorization header format. Valid: "Bearer <token>"',
		});
	}
};

export const authMiddleware: Middleware<ApiRequest, NextApiResponse> = async (
	req,
	res,
	next,
) => {
	const session = getSession(req, res);

	if (!session?.user) {
		res.status(400).send("Unable to verify session.");
		return;
	}

	const auth0Id = session.user.sub;

	const user = await prisma.user.findUnique({
		where: {
			auth0Id,
		},
	});

	if (!user) {
		res.status(400).send("Unable to find user.");
		return;
	}

	req.ctx = { user };
	next();
};

// https://www.bannerbear.com/blog/ways-to-speed-up-puppeteer-screenshots/
export const chromiumArgs = [
	"--autoplay-policy=user-gesture-required",
	"--disable-background-networking",
	"--disable-background-timer-throttling",
	"--disable-backgrounding-occluded-windows",
	"--disable-breakpad",
	"--disable-client-side-phishing-detection",
	"--disable-component-update",
	"--disable-default-apps",
	"--disable-dev-shm-usage",
	"--disable-domain-reliability",
	"--disable-extensions",
	"--disable-features=AudioServiceOutOfProcess",
	"--disable-hang-monitor",
	"--disable-ipc-flooding-protection",
	"--disable-notifications",
	"--disable-offer-store-unmasked-wallet-cards",
	"--disable-popup-blocking",
	"--disable-print-preview",
	"--disable-prompt-on-repost",
	"--disable-renderer-backgrounding",
	"--disable-setuid-sandbox",
	"--disable-speech-api",
	"--disable-sync",
	"--hide-scrollbars",
	"--ignore-gpu-blacklist",
	"--metrics-recording-only",
	"--mute-audio",
	"--no-default-browser-check",
	"--no-first-run",
	"--no-pings",
	"--no-sandbox",
	"--no-zygote",
	"--password-store=basic",
	"--use-gl=swiftshader",
	"--use-mock-keychain",
];

export const createUploadMiddleware = (filenameSuffix: string) =>
	multer({
		storage: multer.diskStorage({
			destination: path.resolve(process.cwd(), "uploads"),
			filename: (req, file, cb) =>
				cb(
					null,
					`${(req as unknown as ApiRequest).ctx.user.id}-${filenameSuffix}`,
				),
		}),
	});

export const rateLimitMiddleware = rateLimit({
	windowMs: ms("10m"),
	max: 100,
});

export const trpcServerClient = createTRPCClient<AppRouter>({
	links: [
		httpLink({
			url: `${getDeploymentUrl()}/api/trpc`,
		}),
	],
	url: `${getDeploymentUrl()}/api/trpc`,
	transformer: superjson,
});

export const html = String.raw;

export const nc = () => nextConnect<NextApiRequest, NextApiResponse>();

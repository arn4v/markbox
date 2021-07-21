import { getSession } from "@auth0/nextjs-auth0";
import { Prisma, PrismaClient } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import { CookieSerializeOptions, serialize } from "cookie";
import { createSigner, createVerifier } from "fast-jwt";
import ms from "ms";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import nextConnect, { Middleware } from "next-connect";
import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { isProd } from "~/config";
import ApiRequestGQL from "~/types/ApiRequest";
import ApiResponse from "~/types/ApiResponse";
import DecodedPat from "~/types/DecodedPat";

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

if (!global.prisma) global.prisma = new PrismaClient(options);

export const prisma = global.prisma as PrismaClient;

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

		if ("maxAge" in options) {
			options.expires = new Date(Date.now() + options.maxAge);
		}

		res.setHeader("Set-Cookie", serialize(name, String(stringValue), options));

		return res;
	};

/**
 * Adds `cookie` function on `res.cookie` to set cookies for response
 */
export const withCookies =
	(handler: NextApiHandler) => (req: NextApiRequest, res: ApiResponse) => {
		res.setCookie = createSetCookie(res);
		res.removeCookie = (name: string) =>
			res.setCookie(name, "", { maxAge: -1, path: "/" });

		return handler(req, res);
	};

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
	const auth = req.headers.authorization;
	if (!auth)
		res.status(400).send({ message: "Authorization header not found." });
	const isMatching = /^Bearer\s+(.+)/.exec(auth);
	if (isMatching) {
		try {
			const token = auth.split(" ")[1].trim();
			const decoded: DecodedPat = await jwtVerifyPat(token);
			try {
				const { userId } = await prisma.accessToken.findUnique({
					where: {
						id: decoded.sub,
					},
					select: {
						userId: true,
					},
				});
				req.ctx = {
					decodedJwt: decoded,
					userId,
				};
				next();
			} catch (err) {
				res.status(500).send({ message: "Unable to get userId for token." });
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

export const authMiddleware = async (req, res, next) => {
	const session = getSession(req, res);

	if (!session.user) {
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

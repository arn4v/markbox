import ms from "ms";
import { Prisma, PrismaClient } from "@prisma/client";
import { createVerifier, createSigner } from "fast-jwt";
import { hash, genSalt, compare } from "bcrypt";
import { isProd } from "~/config";
import nextConnect from "next-connect";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { CookieSerializeOptions, serialize } from "cookie";
import ApiResponse from "~/types/ApiResponse";
import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

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

export const routeHandler = () =>
	nextConnect<NextApiRequest, NextApiResponse>();

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

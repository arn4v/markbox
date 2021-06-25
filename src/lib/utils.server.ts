import ms from "ms";
import Boom from "@hapi/boom";
import { Prisma, PrismaClient } from "@prisma/client";
import { createVerifier, createSigner } from "fast-jwt";
import { hash, genSalt, compare } from "bcrypt";
import { isProd } from "~/constants";
import nextConnect from "next-connect";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { CookieSerializeOptions, serialize } from "cookie";
import ApiResponse from "~/types/ApiResponse";

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
	nextConnect<NextApiRequest, NextApiResponse>({
		onError(e, req, res, next) {
			if (Boom.isBoom(e)) {
				res.status(e.output.payload.statusCode);
				res.json({
					error: e.output.payload.error,
					message: e.output.payload.message,
				});
			} else {
				res.status(500);
				res.json({
					message: "Unexpected error",
				});
				console.error(e);
				// unexcepted error
			}
		},
	});

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
const withCookies =
	(handler: NextApiHandler) => (req: NextApiRequest, res: ApiResponse) => {
		res.setCookie = createSetCookie(res);
		res.removeCookie = (name: string) =>
			res.setCookie(name, "", { maxAge: -1, path: "/" });

		return handler(req, res);
	};

export default withCookies;

export { Boom };

import { CookieSerializeOptions, serialize } from "cookie";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import ApiResponse from "~/types/ApiResponse";

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

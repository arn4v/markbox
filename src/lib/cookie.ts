import { CookieSerializeOptions, serialize } from "cookie";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

/**
 * This sets `cookie` on `res` object
 */
export const createSetCookie =
  (res: NextApiResponse) =>
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
  (handler: NextApiHandler) =>
  (
    req: NextApiRequest,
    res: NextApiResponse & { setCookie: ReturnType<typeof createSetCookie> },
  ) => {
    res.setCookie = createSetCookie(res);
    return handler(req, res);
  };

export default withCookies;

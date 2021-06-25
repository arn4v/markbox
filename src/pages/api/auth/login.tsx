import { NextApiRequest } from "next";
import { isProd } from "~/constants";
import withCookies, { prisma, routeHandler } from "~/lib/utils.server";

export default withCookies(
	routeHandler().post(async (req, res) => {
		const user = await prisma.user.findFirst({
			where: {
				email,
			},
		});
		if (user) {
			const isPasswordValid = await comparePassword(password, user.password);
			if (isPasswordValid) {
				const jwt = await jwtSign({ sub: user.id });
				ctx.res.setCookie("access_token", jwt, {
					path: "/",
					sameSite: isProd,
					secure: isProd,
					httpOnly: isProd,
					maxAge: ms("12h"),
				});
				return {
					code: "successful",
					message: "Successfully logged in.",
				};
			} else {
				return {
					code: "invalid_password",
					message: "Passwords don't match.",
				};
			}
		} else {
			return {
				code: "invalid_user",
				message: "User doesn't exist",
			};
		}
	}),
);

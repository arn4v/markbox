import ms from "ms";
import * as yup from "yup";
import { isProd } from "~/config";
import {
	comparePassword,
	jwtSign,
	prisma,
	routeHandler,
	withCookies
} from "~/lib/utils.server";
import ApiResponse from "~/types/ApiResponse";

const bodySchema = yup.object().shape({
	email: yup.string().email().required(),
	password: yup.string().required(),
});

const handler = routeHandler().post(async (req, res: ApiResponse) => {
	const { email, password } = req.body as { email: string; password: string };
	try {
		await bodySchema.validate(req.body);
		const user = await prisma.user.findFirst({
			where: {
				email,
			},
		});
		if (user) {
			const isPasswordValid = await comparePassword(password, user.password);
			if (isPasswordValid) {
				const jwt = await jwtSign({ sub: user.id });
				res.setCookie("access_token", jwt, {
					path: "/",
					sameSite: isProd,
					secure: isProd,
					httpOnly: isProd,
					maxAge: ms("12h"),
				});
				res.status(200).send({
					code: "successful",
					message: "Successfully logged in.",
				});
			} else {
				res.status(400).send({
					code: "invalid_password",
					message: "Passwords don't match.",
				});
			}
		} else {
			res.status(400).send({
				code: "invalid_user",
				message: "User doesn't exist",
			});
		}
	} catch (err) {
		res.status(400).send({
			code: "invalid_body",
			message: err.toString(),
		});
	}
});

export default withCookies(handler);

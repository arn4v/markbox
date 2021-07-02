import { NextApiRequest } from "next";
import * as yup from "yup";
import {
	hashPassword,
	prisma,
	routeHandler,
	withCookies
} from "~/lib/utils.server";

const bodySchema = yup.object().shape({
	email: yup.string().email().required(),
	password: yup.string().required(),
});

const passwordSchema = yup.string().min(6).max(16).required();

export default withCookies(
	routeHandler().post(async (req: NextApiRequest, res) => {
		const { email, password } = req.body as {
			email: string;
			password: string;
		};
		try {
			try {
				await bodySchema.validate(req.body);

				const user = await prisma.user.findUnique({
					where: {
						email,
					},
				});

				if (!user) {
					await passwordSchema.validate(password);
					const hashedPassword = await hashPassword(password);

					await prisma.user.create({
						data: {
							email,
							password: hashedPassword,
						},
					});

					res.status(200).send({
						code: "successful",
						message: "Successfully registered. Please log in.",
					});
				} else {
					res.status(409).send({
						code: "user_conflict",
						message: "User already exists. Please log in.",
					});
				}
			} catch (err) {
				res.status(400).send({
					code: "invalid_password",
					message: "Password must be between 6 and 16 characters.",
				});
			}
		} catch (err) {
			res.status(400).send({
				code: "invalid_body",
				message: err.toString(),
			});
		}
	}),
);

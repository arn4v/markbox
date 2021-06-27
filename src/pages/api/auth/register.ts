import { NextApiRequest } from "next";
import withCookies, {
	hashPassword,
	prisma,
	routeHandler,
} from "~/lib/utils.server";
import Joi from "joi";

const bodySchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

const passwordSchema = Joi.string().min(6).max(16).required();

export default withCookies(
	routeHandler().post(async (req: NextApiRequest, res) => {
		const { email, password } = req.body as { email: string; password: string };
		try {
			await bodySchema.validateAsync(req.body);

			const user = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (!user) {
				await passwordSchema.validateAsync(password);
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
				code: "invalid_body",
				message: err.toString(),
			});
		}
	}),
);

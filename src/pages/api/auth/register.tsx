import { NextApiRequest } from "next";
import withCookies, {
	Boom,
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
				throw Boom.conflict("User already exists.");
			}
		} catch (err) {
			throw Boom.badRequest(err.toString());
		}
	}),
);

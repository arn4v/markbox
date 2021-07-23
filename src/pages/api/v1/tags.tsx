import * as yup from "yup";
import {
	patAuthMiddleware,
	prisma,
	createHandler,
	withCookies,
} from "~/lib/utils.server";
import ApiRequestGQL from "~/types/ApiRequest";

interface PatchBody {
	name: string;
	new_name: string;
}

const PatchBodySchema = yup.object().shape({
	name: yup.string().required(),
	new_name: yup.string().required(),
});

const handler = createHandler<ApiRequestGQL>()
	.use(patAuthMiddleware)
	.patch(async (req, res) => {
		try {
			const body = (req.body
				? await PatchBodySchema.validate(req.body)
				: req.body) as unknown as PatchBody;
			const { id } = await prisma.tag.findFirst({
				where: {
					name: body.name,
					userId: req.ctx.userId,
				},
				select: {
					id: true,
				},
			});
			const updated = await prisma.tag.update({
				where: {
					id,
				},
				data: {
					name: body.new_name,
				},
				select: {
					id: true,
					name: true,
					createdAt: true,
					updatedAt: true,
				},
			});
			res.status(200).send({
				data: {
					...updated,
					createdAt: updated.createdAt.toISOString(),
					updatedAt: updated.updatedAt.toISOString(),
				},
			});
		} catch (err) {
			res.status(400).send({ message: err.toString() });
		}
	});

export default withCookies(handler);

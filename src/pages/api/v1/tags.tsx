import * as yup from "yup";
import { z } from "zod";
import {
	createHandler,
	patAuthMiddleware,
	prisma,
	rateLimitMiddleware,
	withCookies,
} from "~/lib/utils.server";
import ApiRequestGQL from "~/types/ApiRequest";

interface PatchBody {
	name: string;
	new_name: string;
}

const patchSchema = z.object({
	name: z.string(),
	new_name: z.string(),
});

type PatchSchema = z.infer<typeof patchSchema>;

const handler = createHandler<ApiRequestGQL>()
	.use(patAuthMiddleware)
	.use(rateLimitMiddleware)
	.patch(async (req, res) => {
		const body = (
			req.body ? await patchSchema.parseAsync(req.body) : req.body
		) as PatchBody;
		const tag = await prisma.tag.findFirst({
			where: {
				name: body.name,
				userId: req.ctx.userId,
			},
		});
		if (tag) {
			const { id } = tag;

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
		} else {
			res.status(400).send({ message: "Tag not found." });
		}
	});

export default withCookies(handler);

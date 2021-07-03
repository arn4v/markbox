import * as yup from "yup";
import {
	patAuthMiddleware,
	prisma,
	routeHandler,
	withCookies
} from "~/lib/utils.server";
import ApiRequest from "~/types/ApiRequest";

interface GetQuery {
	id?: string;
	title?: string;
	tags?: Array<{ id?: string; name?: string }>;
}

const GetQuerySchema = yup
	.object()
	.shape({
		id: yup.string(),
		title: yup.string(),
		tags: yup
			.array()
			.of(
				yup
					.mixed()
					.oneOf([
						yup.object().shape({ id: yup.string() }),
						yup.object().shape({ name: yup.string() }),
					]),
			),
	})
	.optional();

interface PostBody {
	title: string;
	url: string;
	tags: string[];
}

const PostBodySchema = yup.object().shape({
	title: yup.string().required(),
	url: yup.string().required(),
	tags: yup.array(yup.string()),
});

const handler = routeHandler<ApiRequest>()
	.use(patAuthMiddleware)
	.get(async (req, res) => {
		try {
			const query = (
				req.query ? await GetQuerySchema.validate(req.query) : req.query
			) as GetQuery;
			const items = await prisma.bookmark.findMany({
				where: {
					userId: req.ctx.userId,
					...(typeof query.title === "string"
						? {
								title: {
									equals: query.title,
								},
						  }
						: {}),
					...(Array.isArray(query?.tags) && query?.tags.length > 0
						? {
								tags: {
									some: {
										OR: query?.tags.map((item) => {
											if (item?.id) {
												return { id: item.id };
											}
											return { name: item.name, userId: req.ctx.userId };
										}),
									},
								},
						  }
						: {}),
				},
				select: {
					id: true,
					tags: {
						select: {
							id: true,
							name: true,
						},
					},
					title: true,
					createdAt: true,
					updatedAt: true,
				},
			});
			res.status(200).send({
				data: items.map((item) => {
					return {
						...item,
						createdAt: item.createdAt.toISOString(),
						updatedAt: item.updatedAt.toISOString(),
					};
				}),
			});
		} catch (err) {
			res.status(400).send(err);
		}
	})
	.post(async (req, res) => {
		try {
			const body = (await PostBodySchema.validate(req.body)) as PostBody;
			try {
				const tags: Record<string, unknown> = {};

				if (body.tags) {
					const existingTags = await prisma.tag.findMany({
						where: {
							userId: req.ctx.userId,
							AND: body.tags.map((item) => {
								return {
									name: item,
								};
							}),
						},
						select: {
							id: true,
							name: true,
						},
					});
					const existingTagsNames = existingTags.map((item) => item.name);
					tags.create = body.tags
						.filter((item) => {
							return existingTagsNames.indexOf(item) === -1;
						})
						.map((item) => {
							return {
								name: item,
								userId: req.ctx.userId,
							};
						});

					if (existingTags.length > 0) {
						tags.connect = existingTags.map((item) => ({ id: item.id }));
					}
				}

				const doesExist = await prisma.bookmark.findFirst({
					where: {
						title: body.title,
						userId: req.ctx.userId,
					},
					select: {
						id: true,
					},
				});

				if (!doesExist) {
					const created = await prisma.bookmark.create({
						data: {
							title: body.title,
							url: body.url,
							User: {
								connect: {
									id: req.ctx.userId,
								},
							},
							tags,
						},
						select: {
							id: true,
							title: true,
							url: true,
							tags: {
								select: {
									id: true,
									name: true,
								},
							},
							createdAt: true,
							updatedAt: true,
						},
					});

					res.status(200).send({
						data: {
							...created,
							createdAt: created.createdAt.toISOString(),
							updatedAt: created.updatedAt.toISOString(),
						},
					});
				} else {
					const updated = await prisma.bookmark.update({
						where: {
							id: doesExist.id,
						},
						data: {
							tags,
						},
						include: {
							tags: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					});
					res.status(200).send({
						data: {
							...updated,
							createdAt: updated.createdAt.toISOString(),
							updatedAt: updated.updatedAt.toISOString(),
						},
						message: `Bookmark with title "${updated.title}" already exists.`,
					});
				}
			} catch (err) {
				res
					.status(500)
					.send({ message: "Unable to add bookmark to database." });
			}
		} catch (err) {
			res.status(400).send(err);
		}
	})
	.patch(async (req, res) => {
		res.status(204).end();
	})
	.delete(async (req, res) => {
		res.status(204).end();
	});

export default withCookies(handler);

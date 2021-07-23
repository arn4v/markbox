import * as yup from "yup";
import {
	patAuthMiddleware,
	prisma,
	createHandler,
	withCookies,
} from "~/lib/utils.server";
import ApiRequestGQL from "~/types/ApiRequest";

interface GetBody {
	id?: string;
	title?: string;
	tags?: {
		AND?: string[];
		OR?: string[];
	};
}

const GetBodySchema = yup
	.object()
	.shape({
		id: yup.string(),
		title: yup.string(),
		tags: yup
			.object()
			.shape({
				AND: yup.array().of(yup.string()),
				OR: yup.array().of(yup.string()),
			})
			.test(
				"either AND or OR",
				"You can use only AND or OR, not both.",
				(obj) => {
					if (obj?.AND && obj?.OR) {
						return false;
					} else {
						return true;
					}
				},
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

interface DeleteQuery {
	id: string;
}

const DeleteQuerySchema = yup.object().shape({
	id: yup.string().required(),
});

const handler = createHandler<ApiRequestGQL>()
	.use(patAuthMiddleware)
	.get(async (req, res) => {
		try {
			const body = (
				req.body ? await GetBodySchema.validate(req.body) : req.body
			) as GetBody;
			const items = await prisma.bookmark.findMany({
				where: {
					userId: req.ctx.userId,
					...(typeof body.id === "string"
						? {
								id: {
									equals: body.id,
								},
						  }
						: {}),
					...(typeof body.title === "string"
						? {
								title: {
									equals: body.title,
								},
						  }
						: {}),
					...(Array.isArray(body?.tags?.AND) || Array.isArray(body?.tags?.OR)
						? {
								tags: {
									some: {
										...(body?.tags?.OR
											? {
													OR: body?.tags.OR.map((item) => {
														return { name: item, userId: req.ctx.userId };
													}),
											  }
											: {}),
										...(body?.tags?.AND
											? {
													AND: body?.tags.AND.map((item) => {
														return { name: item, userId: req.ctx.userId };
													}),
											  }
											: {}),
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
					url: true,
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
							OR: body.tags.map((item) => {
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
		try {
			const body = (req?.query
				? await DeleteQuerySchema.validate(req?.query)
				: req?.query) as unknown as DeleteQuery;
			const doesBookmarkExistForUser = await prisma.bookmark.findFirst({
				where: {
					id: body.id,
					userId: req.ctx.userId,
				},
			});
			if (doesBookmarkExistForUser) {
				const deleted = await prisma.bookmark.delete({
					where: {
						id: body.id,
					},
					select: {},
				});
				res.status(200).send({ message: "Successfully deleted bookmark." });
			} else {
				res.status(200).send({ message: "Invalid bookmark id." });
			}
		} catch (err) {
			res.status(400).send(err);
		}
	});

export default withCookies(handler);

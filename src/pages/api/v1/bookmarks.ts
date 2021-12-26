import { z } from "zod";
import {
	createHandler,
	patAuthMiddleware,
	prisma,
	rateLimitMiddleware,
	withCookies,
} from "~/lib/utils.server";
import ApiRequestGQL from "~/types/ApiRequest";

const GetBodySchema = z.object({
	id: z.string().optional(),
	title: z.string().optional(),
	tags: z
		.union([
			z.object({
				AND: z.array(z.string()),
			}),
			z.object({ OR: z.array(z.string()) }),
		])
		.optional(),
});

const PostBodySchema = z.object({
	title: z.string(),
	url: z.string(),
	tags: z.array(z.string()),
});

const DeleteQuerySchema = z.object({
	id: z.string(),
});

const handler = createHandler<ApiRequestGQL>()
	.use(patAuthMiddleware)
	.use(rateLimitMiddleware)
	.get(async (req, res) => {
		const body = await GetBodySchema.parseAsync(req.body);
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
				...(body?.tags &&
				(("AND" in body?.tags && Array.isArray(body?.tags?.AND)) ||
					("OR" in body?.tags && Array.isArray(body?.tags?.OR)))
					? {
							tags: {
								some: {
									...("OR" in body?.tags && Array.isArray(body?.tags?.OR)
										? {
												OR: body?.tags.OR.map((item) => {
													return { name: item, userId: req.ctx.userId };
												}),
										  }
										: {}),
									...("AND" in body?.tags && Array.isArray(body?.tags?.AND)
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
	})
	.post(async (req, res) => {
		try {
			const body = await PostBodySchema.parseAsync(req.body);
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
		const body = await DeleteQuerySchema.parseAsync(req?.query);
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
	});

export default withCookies(handler);

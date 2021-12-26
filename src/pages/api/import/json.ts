import { Bookmark, Tag } from "@prisma/client";
import { z } from "zod";
import { authMiddleware, createHandler, prisma } from "~/lib/utils.server";
import { ApiRequest } from "~/types/ApiRequest";

const getAllTagsForUser = async ({ userId }: { userId: string }) =>
	await prisma.tag.findMany({
		where: {
			userId,
		},
		select: {
			id: true,
			name: true,
		},
	});

const getAllBookmarksForUser = async ({ userId }: { userId: string }) =>
	await prisma.bookmark.findMany({
		where: {
			userId,
		},
		select: {
			id: true,
			title: true,
			description: true,
			url: true,
			tags: true,
		},
	});

const exportSchema = z.object({
	schema_version: z.number(),
	exported_at: z.string(),
	data: z.object({
		tags: z.array(z.string()),
		bookmarks: z.array(
			z.object({
				title: z.string(),
				description: z.string(),
				url: z.string(),
				tags: z.array(z.string()),
			}),
		),
	}),
});

const postBodySchema = z.object({
	data: exportSchema,
});

export default createHandler<ApiRequest>()
	.use(authMiddleware)
	.post(async (req, res) => {
		const body = await postBodySchema.parseAsync(req.body);
		const data = body?.data?.data;

		let tagsOuter = await prisma.tag.findMany({
			where: {
				User: {
					id: req.ctx.user.id,
				},
			},
		});

		let existingBookmarks = await prisma.bookmark.findMany({
			where: {
				User: {
					id: req.ctx.user.id,
				},
			},
		});

		{
			const transactions = data?.tags
				.filter((name) => {
					return (
						typeof tagsOuter.find(
							(existingTag) => existingTag.name === name,
						) === "undefined"
					);
				})
				.map((name) => {
					return prisma.tag.create({
						data: {
							name: name,
							userId: req.ctx.user.id,
						},
					});
				});

			await prisma.$transaction(transactions);
		}

		tagsOuter = await prisma.tag.findMany({
			where: {
				User: {
					id: req.ctx.user.id,
				},
			},
		});

		for (const { description, tags, title, url } of data?.bookmarks) {
			const tagsConnect = tags
				.map((item) => {
					const existing = tagsOuter.find(
						(existingTag) => existingTag.name === item,
					);
					return existing;
				})
				.filter((item) => !!item)
				.map((item) => ({
					id: item?.id,
				}));

			const tagsCreate = tags
				.filter(
					(item) => !tagsOuter.find((existingTag) => existingTag.name === item),
				)
				.map((name) => ({
					name,
				}));

			const existing = existingBookmarks.find((item) => item.url === url);

			if (existing) {
				await prisma.bookmark.update({
					where: existing ? { id: existing.id } : {},
					data: {
						title,
						url,
						description,
						tags: {
							connect: tagsConnect,
							create: tagsCreate,
						},
					},
				});
			} else {
				const { id } = await prisma.bookmark.create({
					data: {
						title,
						url,
						description,
						userId: req.ctx.user.id,
					},
				});
				await prisma.bookmark.update({
					where: { id },
					data: {
						tags: {
							connect: tagsConnect,
							create: tagsCreate,
						},
					},
				});
			}
		}

		res.status(204).end();
	});

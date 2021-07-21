import { authMiddleware, prisma, createHandler } from "~/lib/utils.server";
import { ApiRequest } from "~/types/ApiRequest";
import * as yup from "yup";

const tagsArraySchema = yup
	.array()
	.of(yup.object().shape({ name: yup.string().required() }))
	.required();

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

const exportSchema = yup.object().shape({
	exported_at: yup.string().required(),
	data: yup.object().shape({
		tags: tagsArraySchema,
		bookmarks: yup
			.array()
			.of(
				yup.object().shape({
					title: yup.string().required(),
					url: yup.string().required(),
					tags: tagsArraySchema,
				}),
			)
			.required(),
	}),
});

const postBodySchema = yup.object().shape({
	data: exportSchema.required(),
});

type Tag = { name: string };
type Bookmark = {
	title: string;
	url: string;
	description: string;
	tags: Tag[];
};

type PostBody = {
	data: {
		exported_at: string;
		data: {
			bookmarks: Bookmark[];
			tags: Tag[];
		};
	};
};

export default createHandler<ApiRequest>()
	.use(authMiddleware)
	.post(async (req, res) => {
		try {
			const {
				data: {
					data: { bookmarks, tags },
				},
			} = (await postBodySchema.validate(req.body)) as PostBody;
			{
				const existingTags = await getAllTagsForUser({
					userId: req.ctx.user.id,
				});
				await prisma.$transaction(
					tags
						.filter((item) => {
							return Boolean(
								existingTags.find(
									(existingTag) => existingTag.name === item.name,
								),
							);
						})
						.map(({ name }) =>
							prisma.tag.create({
								data: {
									name: name,
									User: { connect: { id: req.ctx.user.id } },
								},
							}),
						),
				);
			}
			const existingTags = await getAllTagsForUser({
				userId: req.ctx.user.id,
			});
			const existingBookmarks = await getAllBookmarksForUser({
				userId: req.ctx.user.id,
			});
			await prisma.$transaction(
				bookmarks.map(({ description, tags, title, url }) => {
					const tagsConnect = tags.map((item) => {
						const { id } = existingTags.find(
							(existingTag) => existingTag.name === item.name,
						);
						return { id };
					});
					const { id } = existingBookmarks.find((item) => item.url === url);
					return prisma.bookmark.upsert({
						where: {
							...(id ? { id } : {}),
						},
						create: {
							title,
							url,
							description,

							tags: {
								connect: tagsConnect,
							},
						},
						update: {
							title,
							url,
							description,
							tags: {
								connect: tagsConnect,
							},
						},
					});
				}),
			);
			res.status(204).end();
		} catch (err) {
			res.status(400).send(err);
		}
	});

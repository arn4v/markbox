import * as yup from "yup";
import { authMiddleware, createHandler, prisma } from "~/lib/utils.server";
import { ApiRequest } from "~/types/ApiRequest";

const tagsArraySchema = yup.array().of(yup.string()).required();

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
	schema_version: yup.number().required(),
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

type Bookmark = {
	title: string;
	url: string;
	description: string;
	tags: string[];
};

type PostBody = {
	data: {
		schema_version: number;
		exported_at: string;
		data: {
			tags: string[];
			bookmarks: Bookmark[];
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
				// Get all existing tags to only add new ones
				const existingTags = await getAllTagsForUser({
					userId: req.ctx.user.id,
				});

				const transactions = tags
					.filter((name) => {
						return (
							typeof existingTags.find(
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

			// Get all existing after adding non-existing tags
			const tagsData = await getAllTagsForUser({
				userId: req.ctx.user.id,
			});

			// Get all existing bookmarks to use in filtering
			const bookmarksData = await getAllBookmarksForUser({
				userId: req.ctx.user.id,
			});

			const transactions = bookmarks.map(
				({ description, tags, title, url }) => {
					const tagsToConnect = tags
						.map((item) => {
							return tagsData.find((existingTag) => existingTag.name === item);
						})
						.filter((item) => !!item)
						.map(({ id }) => ({ id }));

					const existing = bookmarksData.find((item) => item.url === url);

					const data = {
						title,
						url,
						description,
						...(tagsToConnect.length > 0
							? {
									tags: {
										connect: tagsToConnect,
									},
							  }
							: {}),
					};

					return !!existing
						? prisma.bookmark.update({
								where: { id: existing.id },
								data,
						  })
						: prisma.bookmark.create({
								// Code works but throws typescript error
								// @ts-ignore
								data: {
									...data,
									userId: req.ctx.user.id,
								},
						  });
				},
			);

			await prisma.$transaction(transactions);
			res.status(204).end();
		} catch (err) {
			res.status(400).send(err);
		}
	});

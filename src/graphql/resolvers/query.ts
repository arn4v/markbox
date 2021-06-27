import { pickKeys } from "~/lib/misc";
import GQLContext from "~/types/GQLContext";
import protectResolver from "../protect-resolver";
import { QueryResolvers, Tag } from "../types.generated";

const Query: QueryResolvers<GQLContext> = {
	async bookmark(_, { id }, { prisma, req, res }) {
		const userId = await protectResolver(req, res);
		const {
			id: _id,
			title,
			createdAt,
			updatedAt,
			url,
		} = await prisma.bookmark.findFirst({
			where: {
				id,
			},
		});
		return {
			id: _id,
			title,
			url,
			tags: [],
			createdAt: createdAt.toISOString(),
			updatedAt: updatedAt.toISOString(),
		};
	},
	async bookmarks(_, { tag }, { req, res, prisma }) {
		const userId = await protectResolver(req, res);
		const bookmarks = await prisma.bookmark.findMany({
			where: {
				userId,
				...(tag
					? {
							tags: {
								some: {
									name: tag.name,
									userId,
								},
							},
					  }
					: {}),
			},
			include: {
				tags: true,
			},
		});
		return bookmarks.map(({ id, url, title, createdAt, updatedAt, tags }) => ({
			id,
			url,
			title,
			tags: tags.map((item) => ({ id: item.id, name: item.name })),
			createdAt: createdAt.toISOString(),
			updatedAt: updatedAt.toISOString(),
		}));
	},
	async user(_, __, { req, res, prisma }) {
		const userId = await protectResolver(req, res);

		const { id, email, emailVerified, createdAt, updatedAt } =
			await prisma.user.findFirst({
				where: {
					id: userId,
				},
			});

		return {
			id,
			email,
			emailVerified,
			createdAt: createdAt.toISOString(),
			updatedAt: updatedAt.toISOString(),
		};
	},
	async tags(_, __, { req, res, prisma }): Promise<Tag[]> {
		const userId = await protectResolver(req, res);
		const tags = await prisma.tag.findMany({
			where: {
				userId,
			},
		});
		return tags.map((item) => pickKeys(item, "id", "name"));
	},
	async tag(_, { id }, { req, res, prisma }) {
		await protectResolver(req, res);
		return await prisma.tag.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				name: true,
			},
		});
	},
	async tagBookmarksCount(_, { id }, { prisma, req, res }) {
		const userId = await protectResolver(req, res);
		const count = await prisma.bookmark.count({
			where: {
				tags: {
					every: {
						id,
					},
				},
			},
		});
		return count;
	},
};

export default Query;

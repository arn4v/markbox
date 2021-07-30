import { Prisma } from "@prisma/client";
import { pickKeys } from "~/lib/misc";
import { SortBy } from "~/modules/dashboard/types";
import GQLContext from "~/types/GQLContext";
import protectResolver from "../protect-resolver";
import { QueryResolvers, Tag } from "../types.generated";

const Query: QueryResolvers<GQLContext> = {
	async bookmark(_, { id }, { prisma, req, res }) {
		await protectResolver(req, res);
		const {
			id: _id,
			title,
			description,
			createdAt,
			updatedAt,
			isFavourite,
			url,
			tags,
		} = await prisma.bookmark.findFirst({
			where: {
				id,
			},
			include: {
				tags: true,
			},
		});
		return {
			id: _id,
			title,
			description,
			url,
			isFavourite,
			tags,
			createdAt: createdAt.toISOString(),
			updatedAt: updatedAt.toISOString(),
		};
	},
	async bookmarks(_, { tag, sort, cursor }, { req, res, prisma }) {
		const userId = await protectResolver(req, res);
		let orderBy: Record<string, string> = {};
		switch (sort as SortBy) {
			case "created_at_asc": {
				orderBy.createdAt = "asc";
				break;
			}
			case "created_at_desc": {
				orderBy.createdAt = "desc";
				break;
			}
			case "updated_at_asc": {
				orderBy.updatedAt = "asc";
				break;
			}
			case "updated_at_desc": {
				orderBy.updatedAt = "desc";
				break;
			}
			default: {
				break;
			}
		}

		const bookmarks = (
			await prisma.bookmark.findMany({
				where: {
					User: {
						id: userId,
					},
					...(typeof tag?.name === "string"
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
				orderBy: orderBy,
				take: 50,
				...(typeof cursor === "string"
					? {
							cursor: {
								id: cursor,
							},
							skip: 1,
					  }
					: {}),
			})
		).map(
			({
				id,
				url,
				title,
				description,
				isFavourite,
				createdAt,
				updatedAt,
				tags,
			}) => ({
				id,
				url,
				title,
				description,
				isFavourite,
				tags: tags.map((item) => ({
					id: item.id,
					name: item.name,
					isPinned: item.isPinned,
				})),
				createdAt: createdAt.toISOString(),
				updatedAt: updatedAt.toISOString(),
			}),
		);

		return {
			data: bookmarks,
			...(typeof cursor === "string" ? { cursor } : {}),
			next_cursor: bookmarks[bookmarks.length - 1].id,
		};
	},
	async user(_, __, { req, res, prisma }) {
		const userId = await protectResolver(req, res);

		return await prisma.user
			.findUnique({
				where: {
					id: userId,
				},
				select: {
					id: true,
					name: true,
					email: true,
					emailVerified: true,
					createdAt: true,
					updatedAt: true,
				},
			})
			.then((user) => ({
				...user,
				createdAt: user.createdAt.toISOString(),
				updatedAt: user.updatedAt.toISOString(),
			}));
	},
	async tags(_, __, { req, res, prisma }): Promise<Tag[]> {
		const userId = await protectResolver(req, res);
		const tags = await prisma.tag.findMany({
			where: {
				userId,
			},
		});
		return tags.map((item) => pickKeys(item, "id", "name", "isPinned"));
	},
	async tag(_, { id }, { req, res, prisma }) {
		await protectResolver(req, res);
		return await prisma.tag.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				isPinned: true,
				name: true,
			},
		});
	},
	async token(_, { id }, { req, res, prisma }) {
		await protectResolver(req, res);
		const {
			id: _id,
			name,
			lastUsed,
			scopes,
		} = await prisma.accessToken.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				name: true,
				lastUsed: true,
				scopes: true,
			},
		});
		return {
			id: _id,
			name,
			scopes: scopes as Prisma.JsonArray as string[],
			lastUsed: lastUsed.toISOString(),
		};
	},
	async tokens(_, __, { req, res, prisma }) {
		const userId = await protectResolver(req, res);
		const _tokens = await prisma.accessToken.findMany({
			where: {
				userId,
			},
			select: {
				id: true,
				name: true,
				lastUsed: true,
				scopes: true,
			},
		});
		return _tokens.map((item) => {
			return {
				...item,
				scopes: item.scopes as string[],
				lastUsed: item.lastUsed.toISOString(),
			};
		});
	},
	async bookmarksCount(_, { tagName }, { req, res, prisma }) {
		const userId = await protectResolver(req, res);

		const count = await prisma.bookmark.count({
			where:
				typeof tagName === "string"
					? {
							tags: {
								some: {
									name: tagName,
									userId,
								},
							},
							userId,
					  }
					: {
							userId,
					  },
		});

		return count;
	},
};

export default Query;

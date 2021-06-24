import { pickKeys } from "~/lib/misc";
import prisma from "~/lib/prisma";
import GQLContext from "~/types/GQLContext";
import protectResolver from "../protect-resolver";
import { QueryResolvers, Tag } from "../types.generated";

const Query: QueryResolvers<GQLContext> = {
	async bookmark(_, { id }, ctx) {
		const userId = await protectResolver(ctx.req, ctx.res);
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
	async bookmarks(_, { tag }, ctx) {
		const userId = await protectResolver(ctx.req, ctx.res);
		const bookmarks = await prisma.bookmark.findMany({
			where: {
				userId,
				tags: {
					every: {
						id: tag,
					},
				},
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
	async user(_, __, ctx) {
		const userId = await protectResolver(ctx.req, ctx.res);
		const { id, email, emailVerified, createdAt, updatedAt } =
			await prisma.user.findUnique({
				where: {
					id: userId,
				},
			});
		return {
			createdAt: createdAt.toISOString(),
			email,
			emailVerified,
			id,
			updatedAt: updatedAt.toISOString(),
		};
	},
	async tags(_, __, { req, res }): Promise<Tag[]> {
		const userId = await protectResolver(req, res);
		const tags = await prisma.tag.findMany({
			where: {
				userId,
			},
		});
		return tags.map((item) => pickKeys(item, "id", "name"));
	},
};

export default Query;

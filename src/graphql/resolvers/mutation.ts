import { pickKeys } from "~/lib/misc";
import { jwtSignPat } from "~/lib/utils.server";
import GQLContext from "~/types/GQLContext";
import protectResolver from "../protect-resolver";
import { MutationResolvers } from "../types.generated";

const Mutation: MutationResolvers<GQLContext> = {
	async createBookmark(_, { input }, { req, res, prisma }) {
		const userId = await protectResolver(req, res);
		const { title, url } = input;

		const newBookmark = await prisma.bookmark.create({
			data: {
				title: title,
				url: url,
				tags: {
					create: input.tags
						.filter((item) => typeof item.name !== "undefined")
						.map((item) => ({ name: item.name, userId })),
					connect: input.tags
						.filter((item) => typeof item.id !== "undefined")
						.map((item) => ({ id: item.id })),
				},
				User: {
					connect: {
						id: userId,
					},
				},
			},
			include: {
				tags: true,
			},
		});

		return {
			id: newBookmark.id,
			title: newBookmark.title,
			url: newBookmark.url,
			tags: newBookmark.tags.map((item) => pickKeys(item, "id", "name")),
			createdAt: newBookmark.createdAt.toISOString(),
			updatedAt: newBookmark.updatedAt.toISOString(),
		};
	},
	async updateBookmark(_, { input }, { req, res, prisma }) {
		const userId = await protectResolver(req, res);
		const { id, title, url } = input;

		const _updated = await prisma.bookmark.update({
			where: {
				id,
			},
			data: {
				title,
				url,
				tags: {
					create: input.tags
						.filter((item) => typeof item.name !== "undefined")
						.map((item) => ({ name: item.name, userId })),
					connect: input.tags
						.filter((item) => typeof item.id !== "undefined")
						.map((item) => ({ id: item.id })),
				},
			},
			include: {
				tags: true,
			},
		});

		return {
			id: _updated.id,
			title: _updated.title,
			url: _updated.url,
			tags: _updated.tags.map((item) => pickKeys(item, "id", "name")),
			createdAt: _updated.createdAt.toISOString(),
			updatedAt: _updated.updatedAt.toISOString(),
		};
	},
	async deleteBookmark(_, { id }, { prisma, req, res }) {
		await protectResolver(req, res);

		/**
		 * Deleting a bookmark should also delete tags that were only
		 * associated with that one bookmark
		 *
		 * Currently prisma does not have support for referential actions
		 * Hence, we need to fetch tags associated with that bookmark
		 * Then filter tags to find orphan tags and delete them
		 */
		const tags = await prisma.tag.findMany({
			where: {
				bookmarks: {
					every: {
						id,
					},
				},
			},
			select: {
				id: true,
				bookmarks: {
					select: {
						id: true,
					},
				},
			},
		});

		const toDelete = tags.filter((item) => {
			if (item.bookmarks.length === 1 && item.bookmarks[0].id === id) {
				return true;
			} else {
				return false;
			}
		});

		const _bookmark = await prisma.bookmark.delete({
			where: {
				id,
			},
		});

		const _tags = await prisma.tag.deleteMany({
			where: {
				OR: toDelete.map(({ id }) => ({ id: { equals: id } })),
			},
		});

		return !!_bookmark && !!_tags;
	},
	async deleteTag(_, { id }, { req, res, prisma }) {
		await protectResolver(req, res);
		try {
			const deleted = await prisma.tag.delete({
				where: {
					id,
				},
			});
			return true;
		} catch (err) {
			return false;
		}
	},
	async renameTag(_, { input: { id, name } }, { prisma, req, res }) {
		await protectResolver(req, res);

		const tag = await prisma.tag.update({
			where: {
				id,
			},
			data: {
				name,
			},
			select: {
				id: true,
				name: true,
			},
		});

		return {
			id: tag.id,
			name: tag.name,
		};
	},
	async generateToken(_, { name, scopes }, { prisma, req, res }) {
		const userId = await protectResolver(req, res);
		const {
			id,
			name: _name,
			scopes: _scopes,
			lastUsed,
		} = await prisma.accessToken.create({
			data: {
				name,
				User: {
					connect: {
						id: userId,
					},
				},
			},
			select: {
				id: true,
				name: true,
				scopes: true,
				lastUsed: true,
			},
		});
		const token = await jwtSignPat({
			sub: id,
			scopes,
		});
		return {
			id,
			name,
			token,
			scopes: [],
			lastUsed: lastUsed.toISOString(),
		};
	},
	async deleteToken(_, { id }, { req, res, prisma }) {
		await protectResolver(req, res);
		try {
			await prisma.accessToken.delete({
				where: {
					id,
				},
				select: { id: true },
			});
			return true;
		} catch (err) {
			return false;
		}
	},
	async updateToken(_, { id, scopes }, { req, res, prisma }) {
		const userId = await protectResolver(req, res);
		const updated = await prisma.accessToken.update({
			data: {
				scopes,
			},
			where: { id },
			select: {
				id: true,
				name: true,
				scopes: true,
				lastUsed: true,
			},
		});
		return {
			id: updated.id,
			name: updated.name,
			scopes: updated.scopes as string[],
			lastUsed: updated.lastUsed.toISOString(),
		};
	},
};

export default Mutation;

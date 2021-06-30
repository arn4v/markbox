import GQLContext from "~/types/GQLContext";
import { MutationResolvers } from "../types.generated";
import { pickKeys } from "~/lib/misc";
import protectResolver from "../protect-resolver";
import { randomUUID } from "crypto";

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
		const deleted = await prisma.bookmark.delete({
			where: {
				id,
			},
		});
		return !!deleted;
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
	async generateApiKey(_, { name }, { prisma, req, res }) {
		const userId = await protectResolver(req, res);
		return await prisma.apiKey.create({
			data: {
				name,
				userId,
			},
		});
	},
};

export default Mutation;

import GQLContext from "~/types/GQLContext";
import { MutationResolvers } from "../types.generated";
import { omitKeys, pickKeys } from "~/lib/misc";
import protectResolver from "../protect-resolver";

const Mutation: MutationResolvers<GQLContext> = {
	async createBookmark(_, { input }, { req, res, prisma }) {
		const userId = await protectResolver(req, res);
		const { tags, title, url } = input;

		const newBookmark = await prisma.bookmark.create({
			data: {
				title: title,
				url: url,
				tags: {
					connectOrCreate: tags.map((item) => ({
						create: {
							name: item.name,
						},
						where: {
							id: item.id,
						},
					})),
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
		await protectResolver(req, res);
		const { id, title, tags, url } = input;

		const _updated = await prisma.bookmark.update({
			where: {
				id,
			},
			data: {
				title,
				url,
				tags: {
					create: tags
						.filter((item) => typeof item.name === "string")
						.map((item) => ({ name: item.name })),
					connect: tags
						.filter((item) => typeof item.id === "string")
						.map((item) => ({ id: item.id })),
				},
			},
			include: {
				tags: true,
			},
		});

		console.log(_updated);

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
};

export default Mutation;

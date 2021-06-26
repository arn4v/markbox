import GQLContext from "~/types/GQLContext";
import { MutationResolvers } from "../types.generated";
import { pickKeys } from "~/lib/misc";
import protectResolver from "../protect-resolver";
import { Tag } from "@prisma/client";

const Mutation: MutationResolvers<GQLContext> = {
	async createBookmark(_, { input }, { req, res, prisma }) {
		const userId = await protectResolver(req, res);
		const { title, url } = input;
		const tags: Tag[] = [];

		/**
		 *
		 * connectOrCreate does allow specifying userId
		 * So, when a tag is created using connectOrCreate it is not connected to the user
		 *
		 * To combat this, we first have to use findMany and Array.prototype.filter
		 * to get the existing tags connected to the user making the request
		 *
		 * After that, we have to check in a loop if a tag with that particular name already exists
		 * If it does, then we don't create a new tag
		 * If it doesn't, then we create a new tag
		 *
		 */

		const existingTags = (
			await prisma.tag.findMany({
				where: { AND: input.tags.map((item) => ({ name: item.name, userId })) },
			})
		).filter((item) => typeof item !== "undefined");

		for (const tag of input.tags) {
			// Find existing tag
			const existingTag = existingTags.find((item) => item.name === tag.name);
			if (!existingTag) {
				// If existing tag doesn't exist, create a new tag and push the object to the `tags` array
				tags.push(
					await prisma.tag.create({
						data: {
							name: tag.name,
							userId,
						},
					}),
				);
			} else {
				// If tag does exist, then push the prefetched tag to the `tags` array
				tags.push(existingTag);
			}
		}

		const newBookmark = await prisma.bookmark.create({
			data: {
				title: title,
				url: url,
				tags: {
					connect: tags.map((item) => ({ id: item.id })),
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
		const tags: Tag[] = [];

		const existingTags = (
			await prisma.tag.findMany({
				where: { AND: input.tags.map((item) => ({ name: item.name, userId })) },
			})
		).filter((item) => typeof item !== "undefined");

		for (const tag of input.tags) {
			const existingTag = existingTags.find((item) => item.name === tag.name);
			if (!existingTag) {
				tags.push(
					await prisma.tag.create({
						data: {
							name: tag.name,
							userId,
						},
					}),
				);
			} else {
				tags.push(existingTag);
			}
		}

		const _updated = await prisma.bookmark.update({
			where: {
				id,
			},
			data: {
				title,
				url,
				tags: {
					connect: tags.map((item) => ({ id: item.id })),
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
};

export default Mutation;

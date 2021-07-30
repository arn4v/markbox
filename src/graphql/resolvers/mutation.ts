import { Prisma } from "@prisma/client";
import { deleteOrphanTagsForUserId } from "~/lib/db";
import { createPat } from "~/lib/utils.server";
import GQLContext from "~/types/GQLContext";
import protectResolver from "../protect-resolver";
import { MutationResolvers } from "../types.generated";

const Mutation: MutationResolvers<GQLContext> = {
	async createBookmark(_, { input }, { req, res, prisma }) {
		const userId = await protectResolver(req, res);

		const {
			createdAt,
			description,
			id,
			isFavourite,
			tags,
			title,
			updatedAt,
			url,
		} = await prisma.bookmark.create({
			data: {
				...input,
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
			id,
			title,
			description,
			isFavourite,
			url,
			tags: tags,
			createdAt: createdAt.toISOString(),
			updatedAt: updatedAt.toISOString(),
		};
	},
	async updateBookmark(
		_,
		{
			input: { tags: inputTags, tagsDisconnect: inputTagsDisconnect, ...input },
		},
		{ req, res, prisma },
	) {
		const userId = await protectResolver(req, res);

		const {
			createdAt,
			description,
			id,
			isFavourite,
			tags,
			title,
			updatedAt,
			url,
		} = await prisma.bookmark.update({
			where: {
				id: input.id,
			},
			data: {
				...input,
				tags: {
					create:
						inputTags
							?.filter((item) => typeof item.name !== "undefined")
							.map((item) => ({ name: item.name, userId })) ?? [],
					connect:
						inputTags
							?.filter((item) => typeof item.id !== "undefined")
							.map((item) => ({ id: item.id })) ?? [],
					disconnect:
						inputTagsDisconnect
							?.filter((item) => typeof item.id !== "undefined")
							.map((item) => ({ id: item.id })) ?? [],
				},
			},
			include: {
				tags: true,
			},
		});

		await deleteOrphanTagsForUserId(prisma, userId);

		return {
			id,
			title,
			description,
			url,
			isFavourite,
			tags: tags,
			createdAt: createdAt.toISOString(),
			updatedAt: updatedAt.toISOString(),
		};
	},
	async deleteBookmark(_, { id }, { prisma, req, res }) {
		const userId = await protectResolver(req, res);

		const _bookmark = await prisma.bookmark.delete({
			where: {
				id,
			},
		});

		const _tags = await deleteOrphanTagsForUserId(prisma, userId);

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
			return Boolean(deleted);
		} catch (err) {
			return false;
		}
	},
	async renameTag(_, { input }, { prisma, req, res }) {
		await protectResolver(req, res);

		const { id, name, isPinned } = await prisma.tag.update({
			where: {
				id: input.id,
			},
			data: {
				name: input.name,
			},
		});

		return {
			id,
			name,
			isPinned,
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
		const token = await createPat(id, scopes);
		return {
			id,
			name,
			token,
			scopes: _scopes as Prisma.JsonArray as string[],
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
	async updateProfile(_, { input: { id, name } }, { prisma, req, res }) {
		const userId = await protectResolver(req, res);
		return !!(await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				name,
			},
		}));
	},
	async favouriteBookmark(_, { id, isFavourite }, { prisma, req, res }) {
		await protectResolver(req, res);
		return !!(await prisma.bookmark.update({
			where: {
				id,
			},
			data: {
				isFavourite,
			},
		}));
	},
	async pinTag(_, { id, isPinned }, { prisma, req, res }) {
		await protectResolver(req, res);
		return !!(await prisma.tag.update({
			where: {
				id,
			},
			data: {
				isPinned,
			},
		}));
	},
};

export default Mutation;

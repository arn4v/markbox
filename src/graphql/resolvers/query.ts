import { AuthenticationError } from "apollo-server-micro";
import { jwtVerify } from "~/lib/jwt";
import prisma from "~/lib/prisma";
import GQLContext from "~/types/GQLContext";
import protectResolver from "../protectedResolver";
import { QueryResolvers } from "../types.generated";

export default {
	async bookmark(_, { id }, ctx) {
		await protectResolver(ctx.req);
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
		};
	},
	async bookmarks(_, __, ctx) {
		const userId = await protectResolver(ctx.req);
		return (
			await prisma.bookmark.findMany({
				where: {
					userId,
				},
			})
		).map(({ id, url, title, createdAt, updatedAt }) => ({
			id,
			url,
			title,
			tags: [],
			createdAt: createdAt.toISOString(),
			updatedAt: updatedAt.toISOString(),
		}));
	},
	async user(_, __, ctx) {
		const userId = await protectResolver(ctx.req);
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
} as QueryResolvers<GQLContext>;

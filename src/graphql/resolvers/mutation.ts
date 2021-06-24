import { comparePassword, hashPassword } from "~/lib/password";
import GQLContext from "~/types/GQLContext";
import { MutationResolvers } from "../types.generated";
import prisma from "~/lib/prisma";
import { jwtSign } from "~/lib/jwt";
import ms from "ms";
import { isProd } from "~/constants";
import { omitKeys, pickKeys } from "~/lib/misc";
import protectResolver from "../protect-resolver";

const Mutation: MutationResolvers<GQLContext> = {
	async login(_, { email, password }, ctx) {
		const user = await prisma.user.findFirst({
			where: {
				email,
			},
		});
		if (user) {
			const isPasswordValid = await comparePassword(password, user.password);
			if (isPasswordValid) {
				const jwt = await jwtSign({ sub: user.id });
				ctx.res.setCookie("access_token", jwt, {
					path: "/",
					sameSite: isProd,
					secure: isProd,
					httpOnly: isProd,
					maxAge: ms("12h"),
				});
				return {
					code: "successful",
					message: "Successfully logged in.",
				};
			} else {
				return {
					code: "invalid_password",
					message: "Passwords don't match.",
				};
			}
		} else {
			return {
				code: "invalid_user",
				message: "User doesn't exist",
			};
		}
	},
	async register(_, { email, password }, ctx) {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (!user) {
			const hashedPassword = await hashPassword(password);

			await prisma.user.create({
				data: {
					email,
					password: hashedPassword,
				},
			});

			return {
				code: "successful",
				message: "Successfully registered. Please log in.",
			};
		} else {
			return {
				code: "conflict",
				message: "User already exists.",
			};
		}
	},
	async createBookmark(_, { input }, ctx) {
		const userId = await protectResolver(ctx.req, ctx.res);
		const { tags, title, url } = input;

		const newBookmark = await prisma.bookmark.create({
			data: {
				title: title,
				url: url,
				tags: {
					connectOrCreate: tags.map((item) => ({
						create: {
							name: item,
						},
						where: {},
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
	async updateBookmark(_, { id, input }, ctx) {
		await protectResolver(ctx.req, ctx.res);
		const { title, url } = input;

		const _updated = await prisma.bookmark.update({
			where: {
				id,
			},
			data: {
				title: title,
				url: url,
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
	async deleteBookmark(_, { id }, ctx) {
		await protectResolver(ctx.req, ctx.res);
		const deleted = await prisma.bookmark.delete({
			where: {
				id,
			},
		});
		return !!deleted;
	},
};

export default Mutation;

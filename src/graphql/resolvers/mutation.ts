import { comparePassword, hashPassword } from "~/lib/password";
import GQLContext from "~/types/GQLContext";
import { MutationResolvers } from "../types.generated";
import prisma from "~/lib/prisma";
import { jwtSign } from "~/lib/jwt";
import ms from "ms";
import { isProd } from "~/constants";

export default {
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
		const { tags, title, url } = input;

		const newBookmark = await prisma.bookmark.create({
			data: {
				title: title,
				url: url,
				tags: {
					create: tags.map((item) => ({ title: item })),
				},
			},
		});

		const newTags = await prisma.tag.findMany({
			where: {
				bookmarkId: newBookmark.id,
			},
		});

		return {
			id: newBookmark.id,
			title: newBookmark.title,
			url: newBookmark.url,
			tags: newTags.map((item) => item.title),
			createdAt: newBookmark.createdAt.toISOString(),
			updatedAt: newBookmark.updatedAt.toISOString(),
		};
	},
	async updateBookmark(_, { id, input }, ctx) {
		const { title, url } = input;

		const _updated = await prisma.bookmark.update({
			where: {
				id,
			},
			data: {
				title: title,
				url: url,
			},
		});

		const _tags = await prisma.tag.findMany({
			where: {
				bookmarkId: _updated.id,
			},
		});

		return {
			id: _updated.id,
			title: _updated.title,
			url: _updated.url,
			tags: _tags.map(({}) => ({})),
			createdAt: _updated.createdAt.toISOString(),
			updatedAt: _updated.updatedAt.toISOString(),
		};
	},
} as MutationResolvers<GQLContext>;

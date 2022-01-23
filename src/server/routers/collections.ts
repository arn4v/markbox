import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hashPassword } from "~/lib/utils.server";
import { sortBySchema } from "~/types";
import { createRouter } from "../createRouter";

export const collectionsRouter = createRouter()
	.query("all", {
		input: z.object({
			sort: sortBySchema,
		}),
		async resolve({ ctx, input }) {
			let orderBy: Record<string, string> = {};
			switch (input.sort) {
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
			return await ctx.prisma.collection.findMany({
				where: {
					userId: ctx?.user?.id as string,
				},
				include: {
					tags: true,
				},
				orderBy,
			});
		},
	})
	.query("byId", {
		input: z.string().uuid(),
		async resolve({ ctx, input }) {
			const data = await ctx.prisma.collection.findUnique({
				where: {
					id: input,
				},
				include: {
					tags: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			});

			if (!data || typeof data === "undefined")
				throw new TRPCError({ code: "NOT_FOUND" });

			return data;
		},
	})
	.query("tags", {
		input: z.string().uuid(),
		async resolve({ ctx, input }) {
			const data = await ctx.prisma.tag.findMany({
				where: {
					collectionId: input,
				},
			});

			if (!data || typeof data === "undefined")
				throw new TRPCError({ code: "NOT_FOUND" });

			return data;
		},
	})
	.query("bookmarks", {
		input: z.object({
			id: z.string().uuid(),
			sort: sortBySchema,
		}),
		async resolve({ ctx, input }) {
			let orderBy: Record<string, string> = {};
			switch (input.sort) {
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

			const data = await ctx.prisma.collection.findUnique({
				where: {
					id: input.id,
				},
				include: {
					tags: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			});

			if (data === null || typeof data === "undefined") {
				throw new TRPCError({ code: "NOT_FOUND" });
			} else {
				const bookmarks = await ctx.prisma.bookmark.findMany({
					where: {
						tags: {
							some: {
								OR: data?.tags.map(({ id }) => ({
									id,
								})),
							},
						},
					},
					orderBy,
					select: {
						id: true,
						tags: {
							select: {
								id: true,
								name: true,
							},
						},
						url: true,
						title: true,
						createdAt: true,
						updatedAt: true,
					},
				});

				return bookmarks;
			}
		},
	})
	.mutation("create", {
		input: z.object({
			name: z.string(),
			isPublic: z.boolean(),
			password: z.string().nullish(),
			tagsConnect: z.array(z.string().uuid()),
		}),
		async resolve({ ctx, input }) {
			return await ctx.prisma.collection.create({
				data: {
					name: input.name,
					isPublic: input.isPublic,
					tags: {
						connect: input.tagsConnect.map((id) => ({
							id,
						})),
					},
					User: {
						connect: {
							id: ctx?.user?.id,
						},
					},
					...(input?.password
						? {
								hashedPassword: await hashPassword(input?.password),
						  }
						: {}),
				},
			});
		},
	})
	.mutation("update", {
		input: z.object({
			id: z.string().uuid(),
			name: z.string(),
			isPublic: z.boolean(),
			tagsConnect: z.array(z.string().uuid()),
			tagsDisconnect: z.array(z.string().uuid()),
		}),
		async resolve({ ctx, input }) {
			return await ctx.prisma.collection.update({
				where: {
					id: input.id,
				},
				data: {
					name: input.name,
					isPublic: input.isPublic,
					tags: {
						connect: input.tagsConnect.map((id) => ({
							id,
						})),
						disconnect: input.tagsDisconnect.map((id) => ({
							id,
						})),
					},
				},
			});
		},
	})
	.mutation("delete", {
		input: z.string().uuid(),
		async resolve({ ctx, input }) {
			return await ctx.prisma.collection.delete({
				where: {
					id: input,
				},
			});
		},
	});

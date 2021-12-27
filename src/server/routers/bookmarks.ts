import { createRouter } from "../createRouter";

import { z } from "zod";
import { deleteOrphanTagsForUserId } from "~/lib/db";
import { SortBy } from "~/modules/dashboard/types";

const createOrUpdateBookmarkTagSchema = z.object({
	id: z.string().nullable(),
	name: z.string().nullable(),
});

export const bookmarksRouter = createRouter()
	.query("byId", {
		input: z.string().uuid(),
		async resolve({ ctx, input }) {
			return await ctx.prisma.bookmark.findUnique({
				where: {
					id: input,
				},
				include: {
					tags: true,
				},
			});
		},
	})
	.query("all", {
		input: z.object({
			tag: z.string().optional(),
			sort: z.string(),
			cursor: z.string().nullish(),
		}),
		async resolve({ ctx, input }) {
			const { cursor, sort, tag } = input;
			const userId = ctx?.user?.id as string;

			let orderBy: Record<string, string> = {};
			switch (sort as SortBy) {
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

			const bookmarks = await ctx.prisma.bookmark.findMany({
				where: {
					User: {
						id: userId,
					},
					...(typeof tag === "string"
						? {
								tags: {
									some: {
										name: tag,
										userId,
									},
								},
						  }
						: {}),
				},
				include: {
					tags: true,
				},
				orderBy: orderBy,
				take: 50,
				...(typeof cursor === "string"
					? {
							cursor: {
								id: cursor,
							},
							skip: 1,
					  }
					: {}),
			});

			return {
				data: bookmarks,
				...(typeof cursor === "string" ? { cursor } : {}),
				next_cursor: bookmarks[bookmarks.length - 1].id,
			};
		},
	})
	.query("count", {
		input: z.object({
			tagName: z.string().optional(),
		}),
		async resolve({ ctx, input }) {
			return await ctx.prisma.bookmark.count({
				where: {
					userId: ctx?.user?.id as string,
				},
			});
		},
	})
	.mutation("deleteById", {
		input: z.string().uuid(),
		async resolve({ ctx, input }) {},
	})
	.mutation("create", {
		input: z.object({
			title: z.string(),
			url: z.string().url(),
			description: z.string().optional().default(""),
			tagsCreate: z.array(z.string()).optional().default([]),
			tagsConnect: z.array(z.string().uuid()).optional().default([]),
		}),
		async resolve({ ctx, input: { tagsConnect, tagsCreate, ...input } }) {
			return await ctx.prisma.bookmark.create({
				data: {
					...input,
					tags: {
						create: tagsCreate.map((item) => ({
							name: item,
							userId: ctx?.user?.id as string,
						})),
						connect: tagsConnect.map((item) => ({ id: item })),
					},
					User: {
						connect: {
							id: ctx.user?.id as string,
						},
					},
				},
				include: {
					tags: true,
				},
			});
		},
	})
	.mutation("updateById", {
		input: z.object({
			id: z.string().uuid(),
			title: z.string().optional(),
			url: z.string().url().optional(),
			description: z.string().optional(),
			tagsCreate: z.array(z.string()).default([]),
			tagsConnect: z.array(z.string().uuid()).default([]),
			tagsDisconnect: z.array(z.string().uuid()).default([]),
		}),
		async resolve({
			ctx,
			input: { tagsConnect, tagsCreate, tagsDisconnect, ...input },
		}) {
			const data = await ctx.prisma.bookmark.update({
				where: {
					id: input.id,
				},
				data: {
					...input,
					tags: {
						create: tagsCreate?.map((item) => ({
							name: item,
							userId: ctx.user?.id as string,
						})),
						connect: tagsConnect?.map((item) => ({ id: item })),
						disconnect: tagsDisconnect?.map((item) => ({ id: item })),
					},
				},
				include: {
					tags: true,
				},
			});

			await deleteOrphanTagsForUserId(ctx.prisma, ctx.user?.id as string);

			return data;
		},
	})
	.mutation("favourite", {
		input: z.object({
			id: z.string().uuid(),
			isFavourite: z.boolean(),
		}),
		async resolve({ ctx, input: { id, isFavourite } }) {
			return !!(await ctx.prisma.bookmark.update({
				where: {
					id,
				},
				data: {
					isFavourite,
				},
			}));
		},
	});

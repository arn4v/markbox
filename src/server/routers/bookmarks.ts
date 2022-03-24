import { Tag } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";
import { z } from "zod";
import { deleteOrphanTagsForUserId } from "~/lib/db";
import { sortBySchema } from "~/types";
import { createRouter } from "../createRouter";

const createOrUpdateBookmarkTagSchema = z.object({
	id: z.string().nullable(),
	name: z.string().nullable(),
});

export const bookmarksRouter = createRouter()
	.query("byId", {
		input: z.string().uuid(),
		async resolve({ ctx, input }) {
			const data = await ctx.prisma.bookmark.findUnique({
				where: {
					id: input,
				},
				include: {
					tags: true,
				},
			});

			if (data === null || typeof data === "undefined")
				throw new TRPCError({ code: "NOT_FOUND" });

			return data;
		},
	})
	.query("all", {
		input: z.object({
			tags: z.array(z.string()).optional(),
			sort: sortBySchema,
			cursor: z.string().nullish(),
			query: z.string().optional(),
		}),
		async resolve({ ctx, input }) {
			const { cursor, sort, tags } = input;
			const userId = ctx?.user?.id as string;

			let orderBy: Record<string, string> = {};
			switch (sort) {
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
					...(tags && tags.length
						? {
								tags: {
									some: {
										OR: tags?.map((name) => ({ name })),
										userId,
									},
								},
						  }
						: {}),
					...(input.query
						? {
								OR: [
									{ title: { search: `*${input.query}*` } },
									{ url: { search: `*${input.query}*` } },
								],
						  }
						: {}),
				},
				include: {
					tags: true,
					_count: true,
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
			tags: z.array(z.string()).optional(),
			query: z.string().optional(),
		}),
		async resolve({ ctx, input }) {
			let tags: Pick<Tag, "id">[] = [];

			console.log("Tags", input?.tags);

			if (input?.tags) {
				tags.push(
					...(await ctx?.prisma.tag.findMany({
						where: {
							userId: ctx?.user?.id as string,
							OR: input?.tags.map((name) => ({ name })),
						},
						select: {
							id: true,
						},
					})),
				);
			}

			return await ctx.prisma.bookmark.count({
				where: {
					userId: ctx?.user?.id as string,
					...(input.query
						? {
								OR: [
									{ title: { search: `*${input.query}*` } },
									{ url: { search: `*${input.query}*` } },
								],
						  }
						: {}),
					...(tags?.length
						? {
								tags: {
									some: {
										OR: tags,
									},
								},
						  }
						: {}),
				},
			});
		},
	})
	.mutation("deleteById", {
		input: z.string().uuid(),
		async resolve({ ctx, input }) {
			return await ctx.prisma.bookmark.delete({
				where: {
					id: input,
				},
			});
		},
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
			const _tagsCreate = tagsCreate.map((item) => ({
				id: v4(),
				name: item,
				userId: ctx?.user?.id as string,
			}));
			const _tagsConnect = tagsConnect.map((item) => ({ id: item }));

			const data = await ctx.prisma.bookmark.create({
				data: {
					...input,
					tags: {
						create: _tagsCreate,
						connect: _tagsConnect,
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

			ctx.mixpanel.track_batch(
				_tagsCreate.map((item) => ({
					event: "Tag Created",
					properties: {
						distinct_id: ctx?.user?.id,
						id: item.id,
					},
				})),
			);

			return data;
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

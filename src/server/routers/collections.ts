import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { SortBy } from "~/modules/dashboard/types";
import { createRouter } from "../createRouter";

export const collectionsRouter = createRouter()
	.query("all", {
		input: z.object({
			sort: z.string(),
		}),
		async resolve({ ctx, input }) {
			let orderBy: Record<string, string> = {};
			switch (input.sort as SortBy) {
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
					...orderBy,
					userId: ctx?.user?.id as string,
				},
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
	.mutation("create", {
		input: z.object({
			name: z.string(),
			isPublic: z.boolean(),
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
					name: input.id,
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
	});

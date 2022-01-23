import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { sortBySchema } from "~/types";
import { createRouter } from "../createRouter";

export const publicRouter = createRouter().merge(
	"collections.",
	createRouter().query("byId", {
		input: z.object({
			id: z.string().uuid(),
			sort: sortBySchema.default("created_at_asc"),
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
					User: {
						select: {
							id: true,
							name: true,
						},
					},
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

				return {
					...data,
					bookmarks,
				};
			}
		},
	}),
);

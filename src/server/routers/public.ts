import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../createRouter";

export const publicRouter = createRouter().merge(
	"collections.",
	createRouter().query("byId", {
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

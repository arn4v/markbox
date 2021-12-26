import { z } from "zod";
import { createRouter } from "../createRouter";

export const tagsRouter = createRouter()
	.query("all", {
		async resolve({ ctx, input }) {
			return await ctx.prisma.tag.findMany({
				where: {
					userId: ctx?.user?.id as string,
				},
			});
		},
	})
	.query("byId", {
		input: z.string().uuid(),
		async resolve({ ctx, input }) {
			return await ctx.prisma.tag.findUnique({
				where: {
					id: input,
				},
				select: {
					id: true,
					isPinned: true,
					name: true,
				},
			});
		},
	})
	.mutation("rename", {
		input: z.object({
			id: z.string().uuid(),
			name: z.string(),
		}),
		async resolve({ ctx, input }) {
			return await ctx.prisma.tag.update({
				where: {
					id: input.id,
				},
				data: {
					name: input.name,
				},
			});
		},
	})
	.mutation("deleteById", {
		input: z.string().uuid(),
		async resolve({ ctx, input }) {
			const deleted = await ctx.prisma.tag.delete({
				where: {
					id: input,
				},
			});
			return Boolean(deleted);
		},
	})
	.mutation("pin", {
		input: z.object({
			id: z.string().uuid(),
			isPinned: z.boolean(),
		}),
		async resolve({ ctx, input }) {
			return !!(await ctx.prisma.tag.update({
				where: {
					id: input?.id,
				},
				data: {
					isPinned: input?.isPinned,
				},
			}));
		},
	});

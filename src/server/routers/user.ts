import { z } from "zod";
import { createRouter } from "../createRouter";

export const userRouter = createRouter()
	.query("me", {
		async resolve({ ctx }) {
			return await ctx.prisma.user.findUnique({
				where: {
					id: ctx?.user?.id as string,
				},
				select: {
					id: true,
					name: true,
					email: true,
					emailVerified: true,
					createdAt: true,
					updatedAt: true,
				},
			});
		},
	})
	.mutation("updateProfile", {
		input: z.object({
			id: z.string().uuid(),
			name: z.string(),
		}),
		async resolve({ ctx, input }) {
			return await ctx.prisma.user.update({
				where: {
					id: input?.id,
				},
				data: {
					name: input?.name,
				},
			});
		},
	});

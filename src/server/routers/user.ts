import { createRouter } from "../createRouter";

export const userRouter = createRouter().query("me", {
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
});

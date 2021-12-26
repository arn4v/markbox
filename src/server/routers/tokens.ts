import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createPat } from "~/lib/utils.server";
import { createRouter } from "../createRouter";

export const tokensRouter = createRouter()
	.query("all", {
		async resolve({ ctx, input }) {
			return await ctx.prisma.accessToken.findMany({
				where: {
					userId: ctx?.user?.id as string,
				},
				select: {
					id: true,
					name: true,
					lastUsed: true,
					scopes: true,
				},
			});
		},
	})
	.query("byId", {
		input: z.string().uuid(),
		async resolve({ ctx, input }) {
			return await ctx.prisma.accessToken.findUnique({
				where: {
					id: input,
				},
				select: {
					id: true,
					name: true,
					lastUsed: true,
					scopes: true,
				},
			});
		},
	})
	.mutation("generate", {
		input: z.object({
			name: z.string(),
			scopes: z.array(z.string()),
		}),
		async resolve({ ctx, input: { name, scopes } }) {
			const {
				id,
				name: _name,
				scopes: _scopes,
				lastUsed,
			} = await ctx.prisma.accessToken.create({
				data: {
					name,
					User: {
						connect: {
							id: ctx?.user?.id as string,
						},
					},
				},
				select: {
					id: true,
					name: true,
					scopes: true,
					lastUsed: true,
				},
			});

			const token = await createPat(id, scopes);

			return {
				id,
				name,
				token,
				scopes: _scopes as Prisma.JsonArray as string[],
				lastUsed: lastUsed.toISOString(),
			};
		},
	})
	.mutation("update", {
		input: z.object({
			id: z.string().uuid(),
			scopes: z.array(z.string()),
		}),
		async resolve({ ctx, input: { id, scopes } }) {
			const updated = await ctx.prisma.accessToken.update({
				data: {
					scopes,
				},
				where: { id },
				select: {
					id: true,
					name: true,
					scopes: true,
					lastUsed: true,
				},
			});

			return {
				id: updated.id,
				name: updated.name,
				scopes: updated.scopes as string[],
				lastUsed: updated.lastUsed,
			};
		},
	})
	.mutation("delete", {
		input: z.string().uuid(),
		async resolve({ ctx, input }) {
			try {
				await ctx.prisma.accessToken.delete({
					where: {
						id: input,
					},
					select: { id: true },
				});
				return true;
			} catch (err) {
				return false;
			}
		},
	});

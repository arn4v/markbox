import { TRPCError } from "@trpc/server";
import superjson from "superjson";
import { createRouter } from "../createRouter";
import { bookmarksRouter } from "./bookmarks";
import { tagsRouter } from "./tags";
import { tokensRouter } from "./tokens";
import { userRouter } from "./user";

export const appRouter = createRouter()
	.transformer(superjson)
	.middleware(async ({ ctx, next }) => {
		if (!ctx.session || !ctx?.user) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}

		return next();
	})
	.merge("bookmarks.", bookmarksRouter)
	.merge("tags.", tagsRouter)
	.merge("tokens.", tokensRouter)
	.merge("users.", userRouter);

export type AppRouter = typeof appRouter;

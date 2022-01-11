import superjson from "superjson";
import { createRouter } from "../createRouter";
import { trpcAuthMiddleware } from "../trpcMiddleware";
import { bookmarksRouter } from "./bookmarks";
import { collectionsRouter } from "./collections";
import { publicRouter } from "./public";
import { tagsRouter } from "./tags";
import { tokensRouter } from "./tokens";
import { userRouter } from "./user";
import { userDataRouter } from "./user-data";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("public.", publicRouter)
	.merge(
		createRouter()
			.middleware(trpcAuthMiddleware)
			.merge("bookmarks.", bookmarksRouter)
			.merge("tags.", tagsRouter)
			.merge("tokens.", tokensRouter)
			.merge("users.", userRouter)
			.merge("userdata.", userDataRouter)
			.merge("collections.", collectionsRouter),
	);

export type AppRouter = typeof appRouter;

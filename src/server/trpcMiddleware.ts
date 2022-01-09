import { TRPCError } from "@trpc/server";
import { MiddlewareFunction } from "@trpc/server/dist/declarations/src/internals/middlewares";
import { TrpcContext } from "./createContext";

export const trpcAuthMiddleware: MiddlewareFunction<
	TrpcContext,
	TrpcContext & {
		user: NonNullable<TrpcContext["user"]>;
		session: NonNullable<TrpcContext["session"]>;
	}
> = async ({ ctx, next }) => {
	if (!ctx?.session || !ctx?.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return next({
		ctx: {
			...ctx,
			user: ctx.user, // user value is known to be non-null now
			session: ctx.session,
			auth0User: ctx.auth0user,
		},
	});
};

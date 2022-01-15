import { getSession, Session, UserProfile } from "@auth0/nextjs-auth0";
import { User } from "@prisma/client";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { mixpanel, prisma } from "~/lib/utils.server";

export const createContext = async ({
	req,
	res,
}: trpcNext.CreateNextContextOptions) => {
	const ctx = {
		req,
		res,
		prisma,
		mixpanel: mixpanel,
		session: null as Session | null,
		auth0user: null as UserProfile | null,
		user: null as User | null,
	};

	const session = getSession(req, res);

	if (session) {
		ctx.session = session;

		const auth0user = session?.user as UserProfile;

		const user = await prisma.user.upsert({
			where: { email: auth0user?.email as string },
			create: {
				auth0Id: auth0user?.sub,
				name: auth0user?.name as string,
				email: auth0user?.email as string,
			},
			update: {
				auth0Id: session?.user?.sub,
			},
		});

		if (user) {
			ctx.user = user;
		}
	}

	return ctx;
};

export type TrpcContext = trpc.inferAsyncReturnType<typeof createContext>;

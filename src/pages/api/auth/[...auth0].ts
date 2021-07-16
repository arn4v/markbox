import { handleAuth, handleCallback, UserProfile } from "@auth0/nextjs-auth0";
import { isProd } from "~/config";
import { prisma } from "~/lib/utils.server";

export default handleAuth({
	async callback(req, res) {
		await handleCallback(req, res, {
			redirectUri: isProd
				? "https://bookmarky.io"
				: "http://localhost:3000" + "/dashboard",
			async afterCallback(req, res, session, options) {
				const user = session.user as UserProfile;
				await prisma.user.upsert({
					where: { email: session?.user?.email },
					create: {
						auth0Id: user?.sub,
						name: user?.name,
						email: user?.email,
					},
					update: {
						auth0Id: session?.user?.sub,
					},
				});
				return session;
			},
		});
	},
});

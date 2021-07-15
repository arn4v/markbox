import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import { isProd } from "~/config";
import { prisma } from "~/lib/utils.server";

export default handleAuth({
	async callback(req, res) {
		await handleCallback(req, res, {
			redirectUri: isProd
				? "https://bookmarky.io"
				: "http://localhost:3000" + "/dashboard",
			async afterCallback(req, res, session, options) {
				await prisma.user.upsert({
					where: { email: session?.user?.email },
					create: {
						id: session?.user?.sub,
						email: session?.user?.email,
					},
					update: {
						id: session?.user?.sub,
					},
				});
				return session;
			},
		});
	},
});

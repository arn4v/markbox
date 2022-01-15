import {
	handleAuth,
	handleCallback,
	handleLogin,
	UserProfile,
} from "@auth0/nextjs-auth0";
import { mixpanel, prisma } from "~/lib/utils.server";

export default handleAuth({
	async login(req, res) {
		await handleLogin(req, res, {
			returnTo: "/app",
		});
	},
	async callback(req, res) {
		await handleCallback(req, res, {
			async afterCallback(req, res, session, options) {
				const user = session.user as UserProfile;

				const dbUser = await prisma.user.upsert({
					where: { email: session?.user?.email },
					create: {
						auth0Id: user?.sub,
						name: user?.name as string,
						email: user?.email as string,
					},
					update: {
						auth0Id: session?.user?.sub,
					},
				});
				const createdAt = {
					date: dbUser.createdAt.getDate(),
					month: dbUser.createdAt.getMonth(),
					year: dbUser.createdAt.getFullYear(),
				};
				const today = new Date();

				mixpanel.people.set(dbUser?.id, {
					name: dbUser.name,
				});

				mixpanel.people.set_once(dbUser?.id, {
					email: dbUser.email,
					createdAt: dbUser.createdAt.toISOString(),
				});

				if (
					createdAt.date === today.getDate() &&
					createdAt.month === today.getMonth() &&
					createdAt.year === today.getFullYear()
				) {
					mixpanel.track("Signup", {
						distinct_id: dbUser?.id,
					});
				}

				mixpanel.track("Login", {
					distinct_id: dbUser?.id,
				});

				return session;
			},
		});
	},
});

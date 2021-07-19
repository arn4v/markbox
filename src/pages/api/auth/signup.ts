import { handleLogin } from "@auth0/nextjs-auth0";
import { NextApiHandler } from "next";

// eslint-disable-next-line import/no-anonymous-default-export
const handler: NextApiHandler = async (req, res) => {
	try {
		await handleLogin(req, res, {
			authorizationParams: {
				screen_hint: "signup", // this prompts the signup screen
			},
		});
	} catch (error) {
		console.error(error);
		res.status(error.status || 500).end(error.message);
	}
};

export default handler;

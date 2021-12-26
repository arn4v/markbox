import { handleLogin } from "@auth0/nextjs-auth0";
import { NextApiHandler } from "next";

// eslint-disable-next-line import/no-anonymous-default-export
const handler: NextApiHandler = async (req, res) => {
	await handleLogin(req, res, {
		authorizationParams: {
			screen_hint: "signup", // this prompts the signup screen
		},
	});
};

export default handler;

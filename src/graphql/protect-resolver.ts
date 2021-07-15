import { getSession, UserProfile } from "@auth0/nextjs-auth0";
import { AuthenticationError } from "apollo-server-micro";
import { NextApiRequest } from "next";
import ApiResponse from "~/types/ApiResponse";

export default async function protectResolver(
	req: NextApiRequest,
	res: ApiResponse,
): Promise<string> {
	const session = getSession(req, res);
	if (!session) {
		throw new AuthenticationError("Unable to authenticate.");
	}

	return (session.user as UserProfile).sub;
}

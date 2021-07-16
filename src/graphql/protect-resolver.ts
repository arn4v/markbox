import { getSession, UserProfile } from "@auth0/nextjs-auth0";
import { AuthenticationError } from "apollo-server-micro";
import { NextApiRequest } from "next";
import { prisma } from "~/lib/utils.server";
import ApiResponse from "~/types/ApiResponse";

export default async function protectResolver(
	req: NextApiRequest,
	res: ApiResponse,
): Promise<string> {
	const session = getSession(req, res);

	if (!session) {
		throw new AuthenticationError("Unable to authenticate.");
	}
	const auth0Id = session.user.sub;

	const user = await prisma.user.findUnique({
		where: {
			auth0Id,
		},
	});

	if (!user)
		throw new AuthenticationError(
			"Unable to find user in database. Try logging in again.",
		);

	return user.id;
}

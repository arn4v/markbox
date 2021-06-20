import { AuthenticationError } from "apollo-server-micro";
import { NextApiRequest } from "next";
import { jwtVerify } from "~/lib/jwt";

export default async function protectResolver(
	req: NextApiRequest,
): Promise<string> {
	const token = req.headers.authorization;
	if (!token) {
		throw new AuthenticationError("Authorization not found in headers.");
	} else {
		const isMatching = /^Bearer\s+(.+)/.test(token);
		if (isMatching) {
			const [_, signedJwt] = token.split(" ");
			try {
				const { sub } = await jwtVerify(signedJwt);
				if (sub) {
					return sub;
				} else {
					throw new AuthenticationError("Unable to decode jwt");
				}
			} catch (err) {
				throw new AuthenticationError(err.toString);
			}
		}
	}
}

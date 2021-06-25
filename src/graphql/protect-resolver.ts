import { AuthenticationError } from "apollo-server-micro";
import { NextApiRequest } from "next";
import { jwtVerify } from "~/lib/utils.server";
import ApiResponse from "~/types/ApiResponse";

export default async function protectResolver(
	req: NextApiRequest,
	res: ApiResponse,
): Promise<string> {
	const headerToken = req.headers.authorization;
	const cookieToken = req.cookies.access_token;
	let type: string;
	if (!cookieToken && !headerToken)
		throw new AuthenticationError(
			"Authorization not found in headers or access_token cookie not found.",
		);
	if (cookieToken) type = "cookie";
	if (headerToken) type = "header";

	switch (type) {
		case "header": {
			const isMatching = /^Bearer\s+(.+)/.exec(headerToken);
			if (isMatching) {
				const [_, signedJwt] = headerToken.split(" ");
				try {
					const { sub } = await jwtVerify(signedJwt);
					if (sub) {
						return sub;
					} else {
						throw new AuthenticationError("Unable to decode jwt");
					}
				} catch (err) {
					throw new AuthenticationError(err.toString());
				}
			} else {
				throw new AuthenticationError("Authorization header malformed.");
			}
		}
		case "cookie": {
			try {
				const { sub } = await jwtVerify(cookieToken);
				if (sub) {
					return sub;
				} else {
					throw new AuthenticationError("Unable to decode jwt");
				}
			} catch (err) {
				res.removeCookie("access_token")
				throw new AuthenticationError(err.toString());
			}
		}
	}
}

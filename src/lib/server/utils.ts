import { NextApiRequest } from "next"

export const getToken = async (req: NextApiRequest): Promise<string> => {
	return await new Promise((resolve, reject) => {
		if (
			typeof req.headers.authorization === "string" &&
			req.headers.authorization.length > 0 &&
			req.headers.authorization.includes("Bearer ")
		) {
			resolve(req.headers.authorization.replace("Bearer ", ""))
		} else {
			reject(new Error("No token in headers."))
		}
	})
}

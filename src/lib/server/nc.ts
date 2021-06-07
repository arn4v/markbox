import { NextApiRequest, NextApiResponse } from "next"
import nextConnect, { Middleware } from "next-connect"
import { jwtVerify } from "../auth/jwt"
import { getToken } from "./utils"

const nc = () => nextConnect<NextApiRequest, NextApiResponse>()

export const protectRoute: Middleware<NextApiRequest, NextApiResponse> = async (
	req,
	res,
	next
) => {
	const token = await getToken(req)
	if (token) {
		try {
			const payload = await jwtVerify(token)
			if (payload) {
				return next()
			}
			return next("Unable to verify token.")
		} catch (err) {
			return next(err)
		}
	} else {
		return next("No token found.")
	}
}

export default nc

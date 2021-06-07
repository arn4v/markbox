import { jwtVerify } from "~/lib/server/jwt"
import nc, { protectRoute } from "~/lib/server/nc"
import prisma from "~/lib/server/prisma"
import { getToken } from "~/lib/server/utils"

export default nc()
	.use(protectRoute)
	.get(async (req, res) => {
		const token = await getToken(req)
		const { sub } = await jwtVerify(token)
		try {
			const user = await prisma.user.findFirst({
				where: { id: sub },
			})
			if (user) {
				const { createdAt, updatedAt, hashedPassword, ..._user } = user
				res.status(200).send(_user)
			} else {
				res.status(404).send({ message: "User not found.", error: null })
			}
		} catch (err) {
			res.status(500).send({ error: err, message: "Unable to find user." })
		}
		return
	})

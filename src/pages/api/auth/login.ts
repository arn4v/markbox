import * as z from "zod"
import corsMiddleware from "~/lib/server/cors"
import { jwtSign } from "~/lib/server/jwt"
import nc from "~/lib/server/nc"
import { comparePassword } from "~/lib/server/password"
import prisma from "~/lib/server/prisma"

interface ILoginBody {
	email: string
	password: string
}

const Body = z.object({
	email: z.string().email(),
	password: z.string().min(6).max(16),
})

export default nc()
	.use(corsMiddleware)
	.post(async (req, res) => {
		try {
			const body = (await Body.parseAsync(req.body)) as ILoginBody
			const { email, password } = body
			try {
				const user = await prisma.user.findFirst({
					where: {
						email,
					},
				})
				if (user) {
					const isUserValid = await comparePassword(
						password,
						user.hashedPassword
					)
					if (isUserValid) {
						const token = await jwtSign({ sub: user.id, type: user.type })
						res.status(200).send({ token })
					} else {
						res.status(401).end()
					}
				} else {
					res.status(404).send({ message: "User not found." })
				}
			} catch (err) {
				res.status(404).send({ message: "User not found." })
			}
		} catch (err) {
			res.status(400).send({ message: "Invalid body." })
		}
	})

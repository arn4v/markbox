import * as z from "zod"
import corsMiddleware from "~/lib/server/cors"
import nc from "~/lib/server/nc"
import prisma from "~/lib/server/prisma"
import { User } from "@prisma/client"
import { findUserByEmail } from "~/lib/server/db"
import { hashPassword } from "~/lib/server/password"

interface IRegisterBody {
	displayName: string
	email: string
	password: string
}

const Body = z.object({
	displayName: z.string(),
	email: z.string().email(),
	password: z.string().min(6).max(16),
})

const createUser = async (
	user: Omit<
		User & { password: string },
		| "createdAt"
		| "updatedAt"
		| "emailVerified"
		| "id"
		| "role"
		| "hashedPassword"
		| "onboarded"
	>
) => {
	const hashedPassword = await hashPassword(user.password)
	delete user.password
	return await prisma.user.create({
		data: {
			...user,
			hashedPassword,
		},
	})
}

export default nc()
	.use(corsMiddleware)
	.post(async (req, res) => {
		const body = req.body as IRegisterBody
		try {
			await Body.parseAsync(body)
			const { displayName, email, password } = body
			try {
				const user = await findUserByEmail(email)
				if (user === null) {
					await createUser({
						displayName,
						email,
						password,
						type: "EMAIL",
					})
					res.status(204).end()
				} else {
					res.status(409).send({ message: "User already exists" })
				}
			} catch (err) {
				res.status(500).send({ message: "Unable to create user." })
			}
		} catch (err) {
			res.status(400).send({ message: err.toString() })
		}
		return
	})

import * as z from "zod"
import { compare, genSalt, hash } from "bcrypt"
import { findUserById } from "~/lib/server/db"
import { jwtVerify } from "~/lib/server/jwt"
import nc, { protectRoute } from "~/lib/server/nc"
import { hashPassword } from "~/lib/server/password"
import prisma from "~/lib/server/prisma"
import { getToken } from "~/lib/server/utils"

interface PostBody {
	token: string
	password: string
	confirmPassword: string
}

interface PutBody {
	email: string
	oldPassword: string
	newPassword: string
	confirmPassword: string
}

const PostBodySchema = z.object({
	token: z.string(),
	password: z.string().min(6).max(16),
	confirmPassword: z.string().min(6).max(16),
})

const PutBodySchema = z.object({
	email: z.string(),
	oldPassword: z.string().min(6).max(16),
	newPassword: z.string().min(6).max(16),
	confirmPassword: z.string().min(6).max(16),
})

export default nc()
	.post(async (req, res) => {
		const { token, confirmPassword, password } =
			(await PostBodySchema.parseAsync(req.body)) as PostBody
		if (password.trim() === confirmPassword.trim()) {
			try {
				const savedToken = await prisma.token.findFirst({ where: { token } })
				if (savedToken) {
					try {
						const user = await findUserById(savedToken.userId)
						if (user) {
							try {
								const hashedPassword = await hashPassword(password)
								await prisma.user.update({
									where: { id: user.id },
									data: { hashedPassword },
								})
								res.status(204).send({ message: "Updated user password." })
							} catch (err) {
								res.status(500).send({ message: "Unable to update user." })
							}
						} else {
							res
								.status(404)
								.send({ message: "Unable to find user in database." })
						}
					} catch (err) {
						res
							.status(500)
							.send({ message: "Unable to get user from database." })
					}
				} else {
					res.status(404).send({ message: "Unable to find token in database." })
				}
			} catch (err) {
				res.status(500).send({ message: "Unable to get token from database." })
			}
		} else {
			res
				.status(400)
				.send({ message: "password and confirmPassword don't match." })
		}
	})
	.use(protectRoute)
	.put(async (req, res) => {
		try {
			const token = await getToken(req)
			const { sub } = await jwtVerify(token)
			const { confirmPassword, newPassword, oldPassword } =
				(await PutBodySchema.parseAsync(req.body)) as PutBody
			if (oldPassword.trim() === newPassword.trim()) {
				res
					.status(400)
					.send({ message: "New password cannot be the same as old password." })
				return
			}
			if (newPassword.trim() === confirmPassword.trim()) {
				const salt = await genSalt(10)
				try {
					const user = await findUserById(sub)
					if (user) {
						const isPasswordValid = await compare(
							oldPassword,
							user.hashedPassword
						)
						if (isPasswordValid) {
							const hashedPassword = await hash(newPassword, salt)
							try {
								await prisma.user.update({
									where: { id: user.id },
									data: { hashedPassword },
								})
								res.status(204).end()
							} catch (err) {
								res.status(500).send({ message: "Unable to update user." })
							}
						} else {
							res.status(400).send({ message: "Invalid old password." })
						}
					} else {
						res.status(404).send({ message: "User not found." })
					}
				} catch {
					res
						.status(500)
						.send({ message: "Unable to find user. Server error." })
				}
			} else {
				res
					.status(400)
					.send({ message: "New password and confirmed password don't match." })
			}
		} catch (err) {
			res.status(400).send({ message: "Invalid body." })
		}
		return
	})

import { promisify } from "util"
import { randomBytes } from "crypto"
import * as z from "zod"
import { APP_DOMAIN, APP_HOST } from "~/constants"
import { add } from "date-fns"
import { findUserByEmail } from "~/lib/server/db"
import mailer from "~/lib/server/mailer"
import nc from "~/lib/server/nc"
import prisma from "~/lib/server/prisma"

const randomBytesPromise = promisify(randomBytes)

interface ForgotBody {
	email: string
}

const Body = z.object({
	email: z.string().email(),
})

export default nc().post(async (req, res) => {
	try {
		const { email } = (await Body.parseAsync(req.body)) as ForgotBody
		const token = (await randomBytesPromise(20)).toString("hex")
		const user = await findUserByEmail(email)
		if (user) {
			prisma.token.create({
				data: {
					userId: user.id,
					expiresAt: add(new Date(), {
						hours: 1,
					}),
					token: token,
					sentTo: email,
				},
			})
			await mailer.sendMail({
				to: email,
				from: `noreply@${APP_DOMAIN}`,
				text: `Open the following link to reset your password: ${APP_HOST}/reset/${token}`,
			})
			res.status(204).send({ message: "Successfully sent email." })
		} else {
			res.status(404).send({ message: "User not found." })
		}
	} catch (err) {
		res.status(500).send({ message: "Unable to send reset password email." })
	}
})

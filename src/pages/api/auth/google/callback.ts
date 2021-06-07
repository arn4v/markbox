import { APP_DOMAIN } from "~/constants"
import corsMiddleware from "~/lib/server/cors"
import { jwtSign } from "~/lib/server/jwt"
import nc from "~/lib/server/nc"
import { googleOauth2, CALLBACK_URI } from "~/lib/server/oauth"
import prisma from "~/lib/server/prisma"

const html = String.raw

const createUser = async (profile: {
	name: string
	email: string
	email_verified: boolean
}): Promise<Record<string, string>> => {
	const { id, type } = await prisma.user.create({
		data: {
			displayName: profile?.name,
			email: profile?.email,
			type: "GOOGLE",
			emailVerified: profile?.email_verified,
		},
	})
	return { sub: id, type }
}

export default nc()
	.use(corsMiddleware)
	.get(async (req, res) => {
		const code = req.query.code as string
		const result = await googleOauth2.getToken({
			code,
			redirect_uri: CALLBACK_URI,
			scope: "openid email profile",
		})

		let claims = {}

		const profile = await fetch(
			`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${result.token.access_token}`
		).then((res) => res.json())

		try {
			const user = await prisma.user.findFirst({
				where: { email: profile.email },
			})
			if (user) {
				claims = { sub: user.id, type: user.type }
			} else {
				claims = await createUser(profile)
			}
		} catch (error) {
			res.status(500).send({ error })
		}
		const token = await jwtSign(claims)
		res.status(200).send(html`
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<title>Login Successful</title>
				</head>
				<body>
					<h1>Authorized</h1>
					<p>You can close this window now</p>
					<script>
						let originUrl = window.location.origin
						if (window.location.hostname === "localhost") {
							originUrl = "${APP_DOMAIN}"
						}
						localStorage.setItem("access_token", "${token}")
						window.opener.postMessage("success", originUrl)
						window.close()
					</script>
				</body>
			</html>
		`)
	})

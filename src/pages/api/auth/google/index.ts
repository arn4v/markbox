import crypto from "crypto"
import util from "util"
import { APP_HOST } from "~/constants"
import corsMiddleware from "~/lib/server/cors"
import nc from "~/lib/server/nc"
import { googleOauth2 } from "~/lib/server/oauth"

const randomBytes = util.promisify(crypto.randomBytes)

export default nc()
	.use(corsMiddleware)
	.get(async (req, res) => {
		const state = (await randomBytes(10)).toString("hex")
		const authorizeUri = googleOauth2.authorizeURL({
			redirect_uri: APP_HOST + "/api/auth/google/callback",
			scope: "openid email profile",
			state,
		})
		res.redirect(authorizeUri)
	})

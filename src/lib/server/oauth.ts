import simpleOauth2 from "simple-oauth2"
import { APP_HOST } from "src/constants"

export const googleOauth2 = new simpleOauth2.AuthorizationCode({
	client: {
		id: process.env.GOOGLE_CLIENT_ID as string,
		secret: process.env.GOOGLE_CLIENT_SECRET as string,
	},
	auth: {
		authorizeHost: "https://accounts.google.com",
		authorizePath: "/o/oauth2/v2/auth",
		tokenHost: "https://www.googleapis.com",
		tokenPath: "/oauth2/v4/token",
	},
})

export const CALLBACK_URI = APP_HOST + "/api/auth/google/callback"

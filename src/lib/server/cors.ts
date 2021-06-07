import nextConnect from "next-connect"
import cors from "cors"
import { APP_DOMAIN } from "src/constants"

const corsMiddleware = nextConnect().use(
	cors({
		allowedHeaders: ["*"],
		origin: APP_DOMAIN,
	})
)

export default corsMiddleware

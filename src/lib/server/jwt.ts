import { createVerifier, createSigner } from "fast-jwt"

export const jwtSign = createSigner({
	key: async () => process.env.JWT_SECRET,
})

export const jwtVerify = createVerifier({
	key: async () => process.env.JWT_SECRET,
})

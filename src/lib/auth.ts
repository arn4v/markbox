import { hash, compare } from "bcrypt";
import { createVerifier, createSigner } from "fast-jwt";

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}

export const jwtSign = createSigner({
  key: async () => process.env.JWT_SECRET,
});

export const jwtVerify = createVerifier({
  key: async () => process.env.JWT_SECRET,
});

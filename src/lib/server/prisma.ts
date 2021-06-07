import { PrismaClient } from "@prisma/client"

if (!(global as any).prisma) (global as any).prisma = new PrismaClient()
const prisma = (global as any).prisma as PrismaClient

export default prisma

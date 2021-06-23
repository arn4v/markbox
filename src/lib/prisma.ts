import { Prisma, PrismaClient } from "@prisma/client";
import { isProd } from "~/constants";

if (!global.prisma) global.prisma = new PrismaClient();

export default global.prisma as PrismaClient;

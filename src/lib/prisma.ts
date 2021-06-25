import { Prisma, PrismaClient } from "@prisma/client";
import { isProd } from "~/constants";

const options: Prisma.PrismaClientOptions = {};
if (!isProd && !!process.env.PRISMA_LOG)
	options.log = ["query", "info", `warn`, `error`];

if (!global.prisma) global.prisma = new PrismaClient(options);

export default global.prisma as PrismaClient;

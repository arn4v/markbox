import { Prisma, PrismaClient } from "@prisma/client";
import { isProd } from "~/constants";

const options: Prisma.PrismaClientOptions = {};
if (!isProd) options.log = ["query", "info", `warn`, `error`];

if (!global.prisma) global.prisma = new PrismaClient(options);

export default global.prisma as PrismaClient;

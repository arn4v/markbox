import { PrismaClient } from "@prisma/client";

declare global {
	declare module NodeJS {
		interface Global {
			prisma: PrismaClient;
		}

		interface ProcessEnv {
			JWT_SECRET: string;
			PRISMA_LOG: string;
		}
	}
}

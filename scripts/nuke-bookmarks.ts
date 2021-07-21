import { PrismaClient } from "@prisma/client";

(async () => {
	const prisma = new PrismaClient();
	await prisma.bookmark.deleteMany();
	await prisma.$disconnect();
})();

import Prisma from "@prisma/client";

(async () => {
	const prisma = new Prisma.PrismaClient();
	await prisma.bookmark.deleteMany();
	await prisma.tag.deleteMany();
	await prisma.$disconnect();
})();

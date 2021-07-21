import { Prisma, PrismaClient } from "@prisma/client";

(async () => {
	const prisma = new PrismaClient();
	const modelNames = Prisma.dmmf.datamodel.models.map(
		(model) => model.name[0].toLowerCase() + model.name.slice(1),
	);
	await Promise.all(
		modelNames.map((modelName) => prisma[modelName].deleteMany()),
	);
	await prisma.$disconnect();
})();

/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import arg from "arg";
import dotenv from "dotenv";
import faker from "faker";

dotenv.config();
const args = arg({
	"--email": String,
	"-e": "--email",
});

if (!args["--email"]) {
	console.log("USAGE: node add-user.js --email <email>");
	process.exit(1);
} else {
	(async () => {
		const prisma = new PrismaClient();
		const { id: userId } = await prisma.user.findUnique({
			where: {
				email: args["--email"],
			},
		});
		await prisma.tag.createMany({
			data: Array.from(Array(12).keys()).map(() => {
				return { name: faker.random.word(), userId };
			}),
		});

		const tags = await prisma.tag.findMany({
			where: {
				User: {
					email: args["--email"],
				},
			},
		});

		const promises = [];
		for (const tag of tags) {
			promises.push(
				prisma.bookmark.create({
					data: {
						title: faker.random.words(faker.datatype.number(5)),
						url: faker.internet.url(),
						tags: {
							connect: {
								id: tag.id,
							},
						},
						User: {
							connect: {
								id: userId,
							},
						},
					},
				}),
			);
		}

		await prisma.$transaction(promises);

		await prisma.$disconnect();
	})();
}

"use strict";
import Prisma from "@prisma/client";
import faker from "@withshepherd/faker";
import arg from "arg";
import dotenv from "dotenv";

dotenv.config();
const args = arg({
	"--email": String,
	"-e": "--email",
});

if (!args["--email"]) {
	console.warn("USAGE: node add-user.js --email <email>");
	process.exit(1);
} else {
	(async () => {
		const prisma = new Prisma.PrismaClient();
		const user = await prisma.user.findUnique({
			where: {
				email: args["--email"],
			},
		});
		if (!user) console.warn("User doesn't exist");

		const { id: userId } = user;

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

		await prisma.$transaction(
			tags.reduce((acc, tag) => {
				return [
					...acc,
					...Array.from(Array(12).keys()).map(() =>
						prisma.bookmark.create({
							data: {
								title: faker.random.words(Math.floor(Math.random() * 11)),
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
					),
				];
			}, []),
		);

		await prisma.$disconnect();
	})();
}

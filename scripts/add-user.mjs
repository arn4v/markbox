/* eslint-disable */
import Prisma from "@prisma/client";
import { hashSync } from "bcrypt";
import arg from "arg";
import dotenv from "dotenv";

dotenv.config();
const args = arg({
	"--email": String,
	"--password": String,
	"-e": "--email",
	"-p": "--password",
});

if (!args["--email"] || !args["--password"]) {
	console.log("USAGE: node add-user.js --email <email> --password <password>");
	process.exit(1);
} else {
	const prisma = new Prisma.PrismaClient();

	await prisma.user.upsert({
		where: {
			email: args["--email"],
		},
		create: {
			email: args["--email"],
			password: hashSync(args["--password"], 10),
		},
		update: {},
		select: { email: true },
	});
	await prisma.$disconnect();
}

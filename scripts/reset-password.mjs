/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import arg from "arg";
import { hashSync } from "bcrypt";
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
	(async () => {
		const prisma = new PrismaClient();

		await prisma.user.update({
			where: {
				email: args["--email"],
			},
			data: {
				email: args["--email"],
				password: hashSync(args["--password"], 10),
			},
		});

		await prisma.$disconnect();
	})();
}

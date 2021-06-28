const { PrismaClient } = require("@prisma/client");
const { hashSync } = require("bcrypt");
const dotenv = require("dotenv");
const arg = require("arg");

dotenv.config();
const args = arg({
	"--email": String,
	"--password": String,
	"-e": "--email",
	"-p": "--password",
});

const prisma = new PrismaClient();

if (!args["--email"] || !args["--password"]) {
	console.log("USAGE: node add-user.js --email <email> --password <password>");
	process.exit(1);
}

(async () => {
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
})();

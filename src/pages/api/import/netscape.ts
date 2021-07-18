import { getSession } from "@auth0/nextjs-auth0";
import path from "path";
import { prisma, routeHandler } from "~/lib/utils.server";
import multer from "multer";
import { NextApiRequest } from "next";
import fs from "fs";
import { User } from "@prisma/client";

interface ApiRequest extends NextApiRequest {
	ctx: {
		user: User;
	};
}

const upload = multer({
	storage: multer.diskStorage({
		destination: path.resolve(process.cwd(), "uploads"),
		filename: (req, file, cb) =>
			cb(null, `${(req as unknown as ApiRequest).ctx.user.id}-bookmarks.html`),
	}),
});

export const config = {
	api: {
		bodyParser: false,
	},
};

export default routeHandler<ApiRequest>()
	.use(async (req, res, next) => {
		const session = getSession(req, res);

		if (!session.user) {
			res.status(400).send("Unable to verify session.");
			return;
		}

		const auth0Id = session.user.sub;

		const user = await prisma.user.findUnique({
			where: {
				auth0Id,
			},
		});

		if (!user) {
			res.status(400).send("Unable to find user.");
			return;
		}

		req.ctx = { user };
		next();
	})
	.use(upload.single("file"))
	.post(async (req, res) => {
		const bookmarks = fs.readFileSync(
			path.join(
				path.resolve(
					process.cwd(),
					`uploads/${req.ctx.user.id}-bookmarks.html`,
				),
			),
			{ encoding: "utf-8" },
		);
		console.log(bookmarks);

		res.status(204).end();
	});

import { sanitizeUrl } from "@braintree/sanitize-url";
import { BookmarkOrFolder } from "bookmarks-parser";
import cheerio from "cheerio";
import { format } from "date-fns";
import fs from "fs";
import path from "path";
import {
	authMiddleware,
	createHandler,
	createUploadMiddleware,
	prisma
} from "~/lib/utils.server";
import { ApiRequest } from "~/types/ApiRequest";

const upload = createUploadMiddleware("bookmarks.html");

export const config = {
	api: {
		bodyParser: false,
	},
};

const getBookmarksFromFolder = (data: BookmarkOrFolder): BookmarkOrFolder[] => {
	const bookmarks = [];

	for (const item of data.children) {
		if (item.type === "folder") {
			bookmarks.concat(getBookmarksFromFolder(item));
		} else {
			bookmarks.push(item);
		}
	}

	return bookmarks;
};

export default createHandler<ApiRequest>()
	.use(authMiddleware)
	.use(upload.single("file"))
	.post(async (req, res) => {
		const filePath = path.join(
			path.resolve(process.cwd()),
			`uploads/${req.ctx.user.id}-bookmarks.html`,
		);
		const raw = fs.readFileSync(filePath, { encoding: "utf-8" });

		try {
			const bookmarks = (() => {
				const bookmarks = [];
				const $ = cheerio.load(raw);
				$("dt > a").each((idx, el) => {
					const _el = $(el);
					bookmarks.push({
						title: _el.text(),
						url: _el.attr("href"),
					});
				});
				return bookmarks;
			})();

			const tagName = `Imported from browser ${format(
				new Date(),
				"d/MM/yyyy",
			)}`;
			let tag = await prisma.tag.findFirst({
				where: {
					name: tagName,
					userId: req.ctx.user.id,
				},
			});

			if (!tag) {
				tag = await prisma.tag.create({
					data: {
						name: tagName,
						userId: req.ctx.user.id,
					},
				});
			}

			const transactions = bookmarks
				.filter(
					(item) =>
						!item.url.toLowerCase().startsWith("javascript:") &&
						!item.url.toLowerCase().includes("about:blank"),
				)
				.map(({ title, url }) => {
					const sanitized = sanitizeUrl(url);
					return prisma.bookmark.create({
						data: {
							title: title.length > 1000 ? title.substr(0, 1000) : title,
							url:
								sanitized.length > 1000 ? sanitized.substr(0, 1000) : sanitized,
							User: {
								connect: {
									id: req.ctx.user.id,
								},
							},
							tags: {
								connect: {
									id: tag.id,
								},
							},
						},
					});
				});

			await prisma.$transaction(transactions);
			await fs.promises.unlink(filePath);

			res.status(204).end();
		} catch (err) {
			console.log(err);
			res.status(500).send({ error: err.toString() });
		}
	});

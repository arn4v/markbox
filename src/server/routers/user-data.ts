import { sanitizeUrl } from "@braintree/sanitize-url";
import cheerio from "cheerio";
import format from "date-fns/format";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { createRouter } from "../createRouter";

export const userDataRouter = createRouter()
	.mutation("import-json", {
		input: z.object({
			schema_version: z.number(),
			exported_at: z.string(),
			data: z.object({
				tags: z.array(z.string()),
				bookmarks: z.array(
					z.object({
						title: z.string(),
						description: z.string(),
						url: z.string(),
						tags: z.array(z.string()),
						createdAt: z.string(),
					}),
				),
			}),
		}),
		async resolve({ ctx, input }) {
			let tagsOuter = await ctx.prisma.tag.findMany({
				where: {
					User: {
						id: ctx.user?.id,
					},
				},
			});

			let existingBookmarks = await ctx.prisma.bookmark.findMany({
				where: {
					User: {
						id: ctx.user?.id as string,
					},
				},
			});

			{
				const transactions = input?.data?.tags
					.filter((name) => {
						return (
							typeof tagsOuter.find(
								(existingTag) => existingTag.name === name,
							) === "undefined"
						);
					})
					.map((name) => {
						return ctx.prisma.tag.create({
							data: {
								name: name,
								userId: ctx.user?.id as string,
							},
						});
					});

				await ctx.prisma.$transaction(transactions);
			}

			tagsOuter = await ctx.prisma.tag.findMany({
				where: {
					User: {
						id: ctx.user?.id as string,
					},
				},
			});

			const existingBookmarkTransactions = [];
			const newBookmarkTransactions = [];

			for (const { description, tags, title, url, createdAt } of input?.data
				?.bookmarks) {
				const tagsConnect = tags
					.map((item) => {
						const existing = tagsOuter.find(
							(existingTag) => existingTag.name === item,
						);
						return existing;
					})
					.filter((item) => !!item)
					.map((item) => ({
						id: item?.id,
					}));

				const tagsCreate = tags
					.filter(
						(item) =>
							!tagsOuter.find((existingTag) => existingTag.name === item),
					)
					.map((name) => ({
						name,
					}));

				const existing = existingBookmarks.find((item) => item.url === url);

				if (existing) {
					existingBookmarkTransactions.push(
						ctx.prisma.bookmark.update({
							where: existing ? { id: existing.id } : {},
							data: {
								title,
								url,
								description,
								tags: {
									connect: tagsConnect,
									create: tagsCreate,
								},
							},
						}),
					);
				} else {
					const id = uuid();
					newBookmarkTransactions.push(
						ctx.prisma.bookmark.create({
							data: {
								id,
								title,
								url,
								description,
								userId: ctx.user?.id as string,
								importedAt: new Date(),
								createdAt: new Date(createdAt),
							},
						}),
						ctx.prisma.bookmark.update({
							where: { id },
							data: {
								tags: {
									connect: tagsConnect,
									create: tagsCreate,
								},
							},
						}),
					);
				}
			}

			return await ctx.prisma.$transaction([
				...existingBookmarkTransactions,
				...newBookmarkTransactions,
			]);
		},
	})
	.mutation("export-json", {
		async resolve({ ctx }) {
			let [tagsData, bookmarksData] = await ctx.prisma.$transaction([
				ctx.prisma.tag.findMany({
					where: {
						userId: ctx?.user?.id as string,
					},
				}),
				ctx.prisma.bookmark.findMany({
					where: {
						userId: ctx?.user?.id as string,
					},
					include: {
						tags: {
							select: {
								name: true,
							},
						},
					},
				}),
			]);

			const tags = tagsData.map(({ name }) => name);
			const bookmarks = bookmarksData.map(
				({ title, url, tags, description, createdAt }) => ({
					title,
					url,
					tags: tags.map(({ name }) => name),
					description,
					createdAt: createdAt.toDateString(),
				}),
			);

			return {
				results: {
					schema_version: 1.1,
					exported_at: new Date().toISOString(),
					data: {
						tags: tags,
						bookmarks: bookmarks,
					},
				},
			};
		},
	})
	.mutation("import-netscape", {
		input: z.string(),
		async resolve({ input, ctx }) {
			const URL_FILTER_REGEX =
				/(chrome(-extension)?|about:blank|javascript:|edge(.*))(:\/\/)?/;

			const getBookmarksFromHtml = (raw: string) => {
				const bookmarks: Array<{ title: string; url: string }> = [];
				const $ = cheerio.load(raw);
				$("dt > a").each((idx, el) => {
					const _el = $(el);
					const title = _el.text();
					const url = sanitizeUrl(_el.attr("href"));

					if (!URL_FILTER_REGEX.test(url)) {
						bookmarks.push({
							title: title,
							url: url,
						});
					}
				});
				return bookmarks;
			};

			const bookmarks = getBookmarksFromHtml(input);

			const tagName = `Imported from browser ${format(
				new Date(),
				"d/MM/yyyy",
			)}`;
			let existingTag = await ctx.prisma.tag.findFirst({
				where: {
					name: tagName,
					userId: ctx.user?.id as string,
				},
			});

			if (!existingTag) {
				existingTag = await ctx.prisma.tag.create({
					data: {
						name: tagName,
						userId: ctx.user?.id as string,
					},
				});
			}

			const transactions = bookmarks.map(({ title, url }) => {
				return ctx.prisma.bookmark.create({
					data: {
						title: title.length > 1000 ? title.substr(0, 1000) : title,
						url: url.length > 1000 ? url.substr(0, 1000) : url,
						User: {
							connect: {
								id: ctx.user?.id as string,
							},
						},
						tags: {
							connect: {
								id: existingTag?.id,
							},
						},
					},
				});
			});

			return await ctx.prisma.$transaction(transactions);
		},
	})
	.mutation("export-html", {
		async resolve() {
			return null;
		},
	});

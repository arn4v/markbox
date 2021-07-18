import { authMiddleware, prisma, routeHandler } from "~/lib/utils.server";
import { ApiRequest } from "~/types/ApiRequest";

export default routeHandler<ApiRequest>()
	.use(authMiddleware)
	.get(async (req, res) => {
		const tags = (
			await prisma.tag.findMany({
				where: {
					userId: req.ctx.user.id,
				},
			})
		).map(({ name }) => name);
		const bookmarks = (
			await prisma.bookmark.findMany({
				where: {
					userId: req.ctx.user.id,
				},
				include: {
					tags: {
						select: {
							name: true,
						},
					},
				},
			})
		).map(({ title, url, tags, description }) => ({
			title,
			url,
			tags,
			description,
		}));

		res.status(200).send({
			results: {
				exported_at: new Date().toISOString(),
				data: {
					tags,
					bookmarks,
				},
			},
		});
	});

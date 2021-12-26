import { PrismaClient } from "@prisma/client";

/**
 * Deleting a bookmark should also delete tags that were only
 * associated with that one bookmark
 *
 * Currently prisma does not have support for referential actions
 * Hence, we need to fetch tags associated with that bookmark
 * Then filter tags to find orphan tags and delete them
 */
export async function deleteOrphanTagsForUserId(
	prisma: PrismaClient,
	userId: string,
) {
	const tags = await prisma.tag.findMany({
		where: {
			User: {
				id: userId,
			},
		},
		select: {
			id: true,
			bookmarks: {
				select: {
					id: true,
				},
			},
		},
	});

	const deleted = await prisma.tag.deleteMany({
		where: {
			OR: tags
				.filter((item) => {
					if (item.bookmarks.length === 0) {
						return true;
					} else {
						return false;
					}
				})
				.map(({ id }) => ({ id: { equals: id } })),
		},
	});

	return deleted;
}

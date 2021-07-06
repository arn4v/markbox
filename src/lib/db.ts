import { PrismaClient } from "@prisma/client";
import { prisma } from "./utils.server";

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

export const getBookmarkById = async ({ id }: { id: string }) => {
	const {
		id: _id,
		title,
		createdAt,
		updatedAt,
		url,
		tags,
	} = await prisma.bookmark.findFirst({
		where: {
			id,
		},
		include: {
			tags: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	return {
		id: _id,
		title,
		url,
		tags,
		createdAt: createdAt.toISOString(),
		updatedAt: updatedAt.toISOString(),
	};
};

import { useRouter } from "next/router";
import {
	useGetAllBookmarksQuery,
	useGetAllTagsQuery,
} from "~/graphql/types.generated";
import BookmarkCard from "./BookmarkCard";

export default function BookmarksGrid() {
	const router = useRouter();
	const { data } = useGetAllBookmarksQuery(
		router.query?.tag ? { tag: { name: router.query?.tag as string } } : {},
		{
			initialData: { bookmarks: [] },
		},
	);

	return (
		<div className="flex flex-col gap-4">
			{data?.bookmarks.map((item) => {
				return <BookmarkCard key={item.id} data={item} />;
			})}
		</div>
	);
}

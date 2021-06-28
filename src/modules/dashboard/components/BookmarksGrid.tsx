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
		<div className="h-full flex-grow flex p-4 lg:p-0 lg:pt-8 lg:pl-8 flex-col">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-6">
				{data?.bookmarks.map((item) => {
					return <BookmarkCard key={item.id} data={item} />;
				})}
			</div>
		</div>
	);
}

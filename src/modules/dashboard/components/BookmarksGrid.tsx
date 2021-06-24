import { useGetAllBookmarksQuery } from "~/graphql/types.generated";
import BookmarkCard from "./BookmarkCard";

export default function BookmarksGrid() {
	const { data } = useGetAllBookmarksQuery();

	return (
		<div className="">
			{data?.bookmarks.map((item) => {
				return <BookmarkCard key={item.id} data={item} />;
			})}
		</div>
	);
}

import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import {
	useGetAllBookmarksQuery,
	useGetAllTagsQuery,
} from "~/graphql/types.generated";
import BookmarkCard from "./BookmarkCard";
import { CreateBookmarkButton } from "./CreateBookmark";

export default function BookmarksGrid() {
	const router = useRouter();
	const { data, isLoading } = useGetAllBookmarksQuery(
		router.query?.tag ? { tag: { name: router.query?.tag as string } } : {},
		{
			initialData: { bookmarks: [] },
		},
	);

	if (isLoading)
		return (
			<div className="flex flex-col flex-grow h-full p-4 lg:p-0 lg:pt-8 lg:pl-8">
				<Spinner />
			</div>
		);

	return (
		<div className="flex flex-col flex-grow h-full p-4 lg:p-0 lg:pt-8 lg:pl-8">
			{data?.bookmarks.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-6">
					{data?.bookmarks.map((item) => {
						return <BookmarkCard key={item.id} data={item} />;
					})}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center gap-8 py-8 rounded-lg bg-blueGray-700">
					<span className="text-xl font-medium">
						You don't have any bookmarks yet.
					</span>
					<div>
						<CreateBookmarkButton className="block mx-auto bg-blueGray-600 hover:bg-blueGray-500" />
					</div>
				</div>
			)}
		</div>
	);
}

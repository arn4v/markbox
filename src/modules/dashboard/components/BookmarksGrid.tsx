import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import {
	useGetAllBookmarksQuery
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
		<div className="flex flex-col flex-grow h-full p-4 lg:p-0 lg:pt-8 lg:px-8 2xl:pr-0">
			{data?.bookmarks.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-6">
					{data?.bookmarks.map((item) => {
						return <BookmarkCard key={item.id} data={item} />;
					})}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center gap-8 py-8 bg-gray-100 rounded-lg dark:bg-gray-900 dark:text-white">
					<span className="text-xl font-medium">
						You don't have any bookmarks yet.
					</span>
					<div>
						<CreateBookmarkButton
							className="block gap-2 px-2 py-2 mx-auto text-white border-transparent rounded-lg dark:bg-gray-500 dark:hover:bg-gray-600"
							showText
						/>
					</div>
				</div>
			)}
		</div>
	);
}

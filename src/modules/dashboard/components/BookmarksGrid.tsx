import * as React from "react";
import Spinner from "~/components/Spinner";
import { useGetAllBookmarksQuery } from "~/graphql/types.generated";
import useDashboardStore from "../store";
import BookmarkCard from "./BookmarkCard";
import { CreateBookmarkButton } from "./CreateBookmark";

export default function BookmarksGrid() {
	const { tag } = useDashboardStore();
	const { data, isLoading } = useGetAllBookmarksQuery(
		tag !== "All" ? { tag: { name: tag } } : {},
	);

	if (isLoading)
		return (
			<div className="flex flex-col items-center justify-center flex-grow h-full p-4 lg:p-0 lg:pt-8 lg:pl-8 lg:ml-72">
				<Spinner />
			</div>
		);

	return (
		<div className="flex flex-col flex-grow h-full p-4 lg:p-0 lg:py-8 gap-6 lg:px-8 2xl:pr-0 lg:ml-72">
			{tag && tag !== "All" && (
				<div className="text-lg font-bold mt-2">Filtering by tag: {tag}</div>
			)}
			{data?.bookmarks.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-6">
					{data?.bookmarks.map((item) => {
						return <BookmarkCard key={item.id} data={item} />;
					})}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center gap-8 py-8 bg-gray-100 rounded-lg dark:bg-gray-900 dark:text-white">
					<span className="text-xl font-medium text-center">
						You don&apos;t have any bookmarks yet.
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

import * as React from "react";
import BookmarkCard from "./BookmarkCard";
import SortButton from "./SortButton";
import Spinner from "~/components/Spinner";
import clsx from "clsx";
import useDashboardStore from "../store";
import useFuse from "~/hooks/use-fuse";
import useInfiniteBookmarksQuery from "../use-infinite-bookmarks";
import { Bookmark } from "~/graphql/types.generated";
import { HiX } from "react-icons/hi";
import NoDataWarning from "./NoDataWarning";
import LoadMoreButton from "./LoadMoreButton";
import NoResultsWarning from "../NoResultsWarning";
import { useInView } from "react-intersection-observer";

const BookmarksGrid = (): JSX.Element => {
	const tag = useDashboardStore((state) => state.tag);
	const queryRef = React.useRef<HTMLInputElement>(null);
	const [query, setQuery] = React.useState<string>("");
	const { data, count, isLoading, fetchNextPage } = useInfiniteBookmarksQuery();
	const { result } = useFuse<Bookmark>({
		data: data ?? [],
		query,
		options: {
			keys: ["title", "tags.name"],
			shouldSort: true,
			location: 15,
		},
	});
	const { ref, inView } = useInView({});
	const [isNextPageLoading, setNextPageLoading] =
		React.useState<boolean>(false);

	const loadMore = React.useCallback(() => {
		setNextPageLoading(true);
		fetchNextPage();
	}, [fetchNextPage]);

	React.useEffect(() => {
		loadMore();
	}, [inView, loadMore]);

	if (isLoading)
		return (
			<div className="flex flex-col items-center justify-center flex-grow h-full p-4 lg:p-0 lg:pt-24 lg:pl-8 lg:ml-72">
				<Spinner />
			</div>
		);

	return (
		<div className="flex flex-col flex-grow h-full p-4 lg:p-0 lg:py-8 gap-6 lg:px-8 2xl:pr-0 lg:ml-72">
			<div className="flex space-x-4 lg:space-x-6 items-center">
				<div className="relative w-full">
					<input
						type="text"
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
						}}
						ref={queryRef}
						placeholder="Search bookmarks..."
						className={clsx([
							"border border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:caret-white dark:text-white flex group focus:ring-2 ring-offset-2 ring-offset-blue-600 overflow-hidden w-full",
						])}
						autoComplete="off"
					/>
					{query.length > 0 ? (
						<button
							className={clsx([
								"bg-transparent text-gray-500 px-2 absolute right-0 top-0 h-full",
							])}
							onClick={() => setQuery("")}
						>
							<HiX />
						</button>
					) : null}
				</div>
				<SortButton />
			</div>
			{tag && tag !== "All" && (
				<div className="text-lg font-bold mt-2">Filtering by tag: {tag}</div>
			)}
			{result?.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
					{result.map((data) => (
						<BookmarkCard key={data.id} data={data} />
					))}
					<LoadMoreButton
						ref={ref}
						onClick={loadMore}
						isLoading={isNextPageLoading}
						isHidden={data.length === result.length}
					/>
				</div>
			) : (
				<>
					<NoResultsWarning
						isVisible={data.length > 0 && result.length === 0}
					/>
					<NoDataWarning
						isVisible={!(data.length > 0 && result.length === 0)}
					/>
				</>
			)}
		</div>
	);
};

export default BookmarksGrid;

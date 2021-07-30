import clsx from "clsx";
import * as React from "react";
import { useInView } from "react-intersection-observer";
import Input from "~/components/Input";
import Spinner from "~/components/Spinner";
import { Bookmark } from "~/graphql/types.generated";
import useFuse from "~/hooks/use-fuse";
import useDashboardStore from "../store";
import useInfiniteBookmarksQuery from "../use-infinite-bookmarks";
import BookmarkCard from "./BookmarkCard";
import LoadMoreButton from "./LoadMoreButton";
import NoDataWarning from "./NoDataWarning";
import NoResultsWarning from "./NoResultsWarning";
import SortButton from "./SortButton";

const BookmarksGrid = (): JSX.Element => {
	const tag = useDashboardStore((state) => state.tag);
	const queryRef = React.useRef<HTMLInputElement>(null);
	const [query, setQuery] = React.useState<string>("");
	const { data, count, isLoading, fetchNextPage } = useInfiniteBookmarksQuery();
	const { result } = useFuse<Bookmark>({
		data: data,
		query,
		options: {
			keys: ["title", "url", "tags.name"],
		},
	});
	const { ref, inView } = useInView({});
	const [isNextPageLoading, setNextPageLoading] =
		React.useState<boolean>(false);

	const loadMore = React.useCallback(() => {
		const timer = setTimeout(() => setNextPageLoading(true), 500);
		fetchNextPage();
		return () => {
			clearTimeout(timer);
			setNextPageLoading(false);
		};
	}, [fetchNextPage]);

	React.useEffect(() => {
		loadMore();
		return () => setNextPageLoading(false);
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
				<Input
					type="text"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
					}}
					ref={queryRef}
					placeholder="Search bookmarks..."
					className={clsx([
						"rounded-md shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:caret-white dark:text-white flex group focus:ring-2 ring-offset-2 ring-offset-blue-600 overflow-hidden w-full focus:border-transparent",
					])}
					autoComplete="off"
					showClear
					onClear={() => setQuery("")}
				/>
				<SortButton />
			</div>
			{tag && tag !== "All" && (
				<div className="text-lg font-bold mt-2">Filtering by tag: {tag}</div>
			)}
			<div
				className={clsx("text-base font-medium", tag !== "All" && "-mt-4")}
				hidden={result.length > 0}
			>
				Showing <span className="font-bold">{count}</span> results
			</div>
			{result?.length > 0 ? (
				<ul
					data-test="bookmarks-list"
					className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6"
				>
					{result
						.sort((a, b) => {
							if (a.isFavourite && !b.isFavourite) return -1;
							return 0;
						})
						.map((data) => (
							<BookmarkCard key={data.id} data={data} />
						))}
					<LoadMoreButton
						ref={ref}
						onClick={loadMore}
						isLoading={isNextPageLoading}
						isHidden={count === data.length}
					/>
				</ul>
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

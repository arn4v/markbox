import clsx from "clsx";
import * as React from "react";
import { HiX } from "react-icons/hi";
import { useInfiniteQuery } from "react-query";
import Spinner from "~/components/Spinner";
import { fetcher } from "~/graphql/fetcher";
import {
	Bookmark,
	GetAllBookmarksQuery,
	GetAllBookmarksDocument,
	GetAllBookmarksQueryVariables,
} from "~/graphql/types.generated";
import useFuse from "~/hooks/use-fuse";
import useIntersectionObserver from "~/hooks/use-intersection-observer";
import { CreateBookmarkButton } from "../../common/components/Create";
import useDashboardStore from "../store";
import BookmarkCard from "./BookmarkCard";
import SortButton from "./SortButton";

const useInfiniteFetchBookmarks = () => {
	const { tag, sort } = useDashboardStore();

	const infiniteFetcher = React.useCallback(
		({ pageParam = null }) => {
			console.log(pageParam);
			return fetcher<GetAllBookmarksQuery, GetAllBookmarksQueryVariables>(
				GetAllBookmarksDocument,
				{
					sort,
					...(typeof pageParam === "string" ? { cursor: pageParam } : {}),
					...(tag !== "All" ? { tag: { name: tag } } : {}),
				},
			)();
		},
		[sort, tag],
	);

	const { data, ...infiniteQueryReturn } = useInfiniteQuery(
		["GetAllBookmarks", tag, sort],
		infiniteFetcher,
		{
			getPreviousPageParam: (previousPage) => previousPage.bookmarks.cursor,
			getNextPageParam: (lastPage) => lastPage.bookmarks.next_cursor,
		},
	);

	const bookmarks = React.useMemo(() => {
		return (
			data?.pages?.reduce((acc, cur) => {
				return acc.concat(cur.bookmarks.data);
			}, []) ?? []
		);
	}, [data]);

	return { data: bookmarks, ...infiniteQueryReturn };
};

const BookmarksGrid = (): JSX.Element => {
	const tag = useDashboardStore((state) => state.tag);
	const queryRef = React.useRef<HTMLInputElement>(null);
	const [query, setQuery] = React.useState<string>("");
	const { data, isLoading, fetchNextPage } = useInfiniteFetchBookmarks();
	const { result } = useFuse<Bookmark>({
		data: data,
		query,
		options: {
			keys: ["title", "tags.name"],
			shouldSort: true,
			location: 15,
		},
	});
	const loaderRef = React.useRef<HTMLDivElement>(null);

	useIntersectionObserver({
		root: null,
		target: loaderRef,
		rootMargin: "24px",
		onIntersect: React.useCallback(() => {
			fetchNextPage();
		}, [fetchNextPage]),
	});

	if (isLoading)
		return (
			<div className="flex flex-col items-center justify-center flex-grow h-full p-4 lg:p-0 lg:pt-8 lg:pl-8 lg:ml-72">
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
					<div
						ref={loaderRef}
						className="flex items-center justify-center col-span-2"
					>
						<Spinner className="text-black dark:text-white h-5 w-5" />
					</div>
				</div>
			) : data.length > 0 && result.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-8 py-8 bg-gray-100 rounded-lg dark:bg-gray-900 dark:text-white">
					<span className="text-lg font-medium text-center">
						Couldn&apos;t find any bookmarks with that query.
					</span>
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
};

export default BookmarksGrid;

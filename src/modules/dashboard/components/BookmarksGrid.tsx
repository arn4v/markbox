import clsx from "clsx";
import { useRouter } from "next/router";
import * as React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Badge from "~/components/Badge";
import { Input }  from "~/components/Input";
import Spinner from "~/components/Spinner";
import { useDebouncedValue } from "~/hooks/use-debounced-value";
import { InferQueryOutput, trpc } from "~/lib/trpc";
import { useStore } from "~/store";
import BookmarkCard from "./BookmarkCard";
import NoDataWarning from "./NoDataWarning";
import NoResultsWarning from "./NoResultsWarning";
import SortButton from "./SortButton";

type Bookmark = NonNullable<InferQueryOutput<"bookmarks.byId">>;

const BookmarksGrid = (): JSX.Element => {
	const router = useRouter();
	const tag = React.useMemo(() => {
		return (router.query?.tag as string) ?? "All";
	}, [router.query?.tag]);

	const sort = useStore((state) => state.sort.type);
	const queryRef = React.useRef<HTMLInputElement>(null);
	const [query, setQuery] = React.useState<string>("");
	const debouncedQuery = useDebouncedValue(query, 250);

	const { data: count, isLoading: isCountLoading } = trpc.useQuery([
		"bookmarks.count",
		{
			...(tag !== "All" ? { tagName: tag } : {}),
			...(debouncedQuery.length ? { query: debouncedQuery } : {}),
		},
	]);

	const {
		data: rawData,
		fetchNextPage,
		isLoading: isDataLoading,
	} = trpc.useInfiniteQuery(
		[
			"bookmarks.all",
			{
				...(tag !== "All" ? { tag: tag } : {}),
				...(debouncedQuery.length ? { query: debouncedQuery } : {}),
				sort,
			},
		],
		{
			getPreviousPageParam: (lastPage) => lastPage.cursor,
			getNextPageParam: (lastPage) => lastPage.next_cursor,
		},
	);

	const data = React.useMemo(() => {
		return rawData?.pages?.reduce((acc, cur) => {
			return [...acc, ...cur?.data];
		}, [] as Array<Bookmark>);
	}, [rawData]) as unknown as Array<Bookmark>;

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
			{isCountLoading || isDataLoading ? (
				<>
					<ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
						{Array.from(Array(5).keys()).map((_, idx) => (
							<li
								key={idx}
								className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg dark:bg-gray-900 dark:text-white h-auto"
							>
								<div className="flex flex-col items-start justify-center w-5/6 gap-1">
									<span className="text-xs bg-gray-400 text-gray-400 select-none animate-pulse rounded">
										Created on 26th January, 2022 at 4:58PM
									</span>
									<div className="w-5/6 text-sm font-medium break-words bg-gray-400 text-gray-400 select-none animate-pulse rounded">
										Placeholder Title
									</div>
									<div className="w-3/4 text-xs truncate whitespace-nowrap transition bg-gray-400 text-gray-400 select-none animate-pulse rounded">
										https://placeholder.com
									</div>
									<div className="flex gap-2 mt-1.5 flex-wrap">
										{Array.from(Array(2).keys()).map((_, idx) => {
											return (
												<Badge
													key={idx}
													title={"Tag"}
													className="dark:bg-gray-800 border dark:border-gray-600 border-gray-300 animate-pulse bg-gray-400 text-gray-400 select-none"
												/>
											);
										})}
									</div>
								</div>
							</li>
						))}
					</ul>
				</>
			) : (
				<>
					<div className="text-lg select-none font-bold mt-2">
						Filtering by tag: {tag}
					</div>
					<div
						className={clsx("text-base font-medium", tag !== "All" && "-mt-4")}
						hidden={!data || data?.length === 0}
					>
						Showing{" "}
						<span className="font-bold select-none">
							{query.length ? data.length : data?.length}
						</span>{" "}
						of{" "}
						<span className="font-bold">
							{query.length ? data?.length : count}
						</span>{" "}
						results
					</div>
					{data?.length > 0 ? (
						<InfiniteScroll
							data-test="bookmarks-list"
							dataLength={data?.length}
							hasMore={query.length ? false : data?.length < (count as number)}
							next={fetchNextPage}
							loader={
								<div className="w-full flex items-center justify-center pt-6 col-span-2">
									<Spinner className="text-black dark:text-white h-5 w-5" />
								</div>
							}
							className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6"
						>
							{data
								.sort((a, b) => {
									if (a.isFavourite && !b.isFavourite) return -1;
									return 0;
								})
								.map((data) => (
									<BookmarkCard key={data.id} data={data} />
								))}
						</InfiniteScroll>
					) : (
						<>
							{data?.length > 0 && data.length === 0 ? (
								<NoResultsWarning />
							) : (
								<NoDataWarning />
							)}
						</>
					)}
				</>
			)}
		</div>
	);
};

export default BookmarksGrid;

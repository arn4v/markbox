import clsx from "clsx";
import { useRouter } from "next/router";
import * as React from "react";
import { useInView } from "react-intersection-observer";
import Badge from "~/components/Badge";
import Input from "~/components/Input";
import useFuse from "~/hooks/use-fuse";
import { InferQueryOutput, trpc } from "~/lib/trpc";
import { useStore } from "~/store";
import BookmarkCard from "./BookmarkCard";
import LoadMoreButton from "./LoadMoreButton";
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
	const { isLoading, data: count } = trpc.useQuery([
		"bookmarks.count",
		tag === "All" ? {} : { tagName: tag },
	]);
	const { data: rawData, fetchNextPage } = trpc.useInfiniteQuery(
		["bookmarks.all", { ...(tag !== "All" ? { tag: tag } : {}), sort }],
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

	const { result } = useFuse({
		data: data ?? [],
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

	return (
		<div className="flex flex-col flex-grow h-full p-4 lg:p-0 lg:py-8 gap-6 lg:px-8 2xl:pr-0 lg:ml-72">
			<div className="flex space-x-4 lg:space-x-6 items-center">
				<Input
					type="text"
					value={query}
					disabled={isLoading}
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
			{isLoading ? (
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
						hidden={result.length === 0}
					>
						Showing <span className="font-bold select-none">X</span> of{" "}
						<span className="font-bold">X</span> results
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
							{count !== result?.length || count === data?.length ? null : (
								<LoadMoreButton
									ref={ref}
									onClick={loadMore}
									isLoading={isNextPageLoading}
								/>
							)}
						</ul>
					) : (
						<>
							{data?.length > 0 && result.length === 0 ? (
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

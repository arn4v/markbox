import clsx from "clsx";
import * as React from "react";
import { HiX } from "react-icons/hi";
import Spinner from "~/components/Spinner";
import { Bookmark, useGetAllBookmarksQuery } from "~/graphql/types.generated";
import useFuse from "~/hooks/use-fuse";
import { CreateBookmarkButton } from "../../common/components/Create";
import useDashboardStore from "../store";
import BookmarkCard from "./BookmarkCard";
import AutoSizer from "react-virtualized-auto-sizer";
import {
	VariableSizeGrid,
	VariableSizeList,
	FixedSizeList,
	FixedSizeGrid,
} from "react-window";

export default function BookmarksGrid() {
	const { tag } = useDashboardStore();
	const queryRef = React.useRef<HTMLInputElement>(null);
	const { data, isLoading } = useGetAllBookmarksQuery(
		tag !== "All" ? { tag: { name: tag } } : {},
		{
			initialData: {
				bookmarks: [],
			},
		},
	);
	const [query, setQuery] = React.useState<string>("");
	const { result } = useFuse<Bookmark>({
		data: data?.bookmarks,
		query,
		options: {
			keys: ["title", "tags.name"],
			shouldSort: true,
			location: 15,
		},
	});
	const [limit, setLimit] = React.useState(50);
	const observerRef = React.useRef<IntersectionObserver>(null);
	const loaderRef = React.useRef<HTMLDivElement>(null);

	// Use the IntersectionObserver API to watch for changes in the viewport.
	React.useEffect(() => {
		const handler: IntersectionObserverCallback = (entries) => {
			const target = entries[0];
			if (target.isIntersecting) {
				setLimit((prev) => prev + 50);
			}
		};

		if (!isLoading && !observerRef.current) {
			observerRef.current = new IntersectionObserver(handler, {
				root: document,
			});
			observerRef.current.observe(loaderRef.current);
		} else {
			return () => observerRef.current.disconnect();
		}
	}, [isLoading]);

	if (isLoading)
		return (
			<div className="flex flex-col items-center justify-center flex-grow h-full p-4 lg:p-0 lg:pt-8 lg:pl-8 lg:ml-72">
				<Spinner />
			</div>
		);

	return (
		<div className="flex flex-col flex-grow h-full p-4 lg:p-0 lg:py-8 gap-6 lg:px-8 2xl:pr-0 lg:ml-72">
			<div className="sticky top-0">
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
			</div>

			{tag && tag !== "All" && (
				<div className="text-lg font-bold mt-2">Filtering by tag: {tag}</div>
			)}
			{result?.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
					{result.splice(0, limit).map((item) => (
						<BookmarkCard key={item.id} data={item} />
					))}
				</div>
			) : (
				(() => {
					if (data.bookmarks.length > 0 && result.length === 0) {
						return (
							<div className="flex flex-col items-center justify-center gap-8 py-8 bg-gray-100 rounded-lg dark:bg-gray-900 dark:text-white">
								<span className="text-lg font-medium text-center">
									Couldn&apos;t find any bookmarks with that query.
								</span>
							</div>
						);
					}
					return (
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
					);
				})()
			)}
			<div ref={loaderRef} />
		</div>
	);
}

import React from "react";
import { useInfiniteQuery } from "react-query";
import { fetcher } from "~/graphql/fetcher";
import {
	Bookmark,
	GetAllBookmarksDocument,
	GetAllBookmarksQuery,
	GetAllBookmarksQueryVariables,
	useGetBookmarksCountQuery
} from "~/graphql/types.generated";
import useDashboardStore from "./store";

const useInfiniteBookmarksQuery = () => {
	const { tag, sort } = useDashboardStore();

	const { isLoading, data: countData } = useGetBookmarksCountQuery(
		tag === "All" ? {} : { tagName: tag },
	);

	const infiniteFetcher = React.useCallback(
		({ pageParam = null }) => {
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

	const {
		data,
		isLoading: _,
		refetch,
		...infiniteQueryReturn
	} = useInfiniteQuery(["GetAllBookmarks", tag, sort], infiniteFetcher, {
		getPreviousPageParam: (lastPage) => lastPage.bookmarks.cursor,
		getNextPageParam: (lastPage) => lastPage.bookmarks.next_cursor,
	});

	const bookmarks: Bookmark[] = React.useMemo(() => {
		const dataMap = {};

		if (data?.pages.length)
			for (const page of data?.pages) {
				page.bookmarks.data.forEach((data) => {
					dataMap[data.id] = data;
				});
			}

		return Object.values(dataMap);
	}, [data]);

	React.useEffect(() => {
		refetch();
	}, [refetch]);

	return {
		data: bookmarks,
		count: countData?.bookmarksCount,
		isLoading,
		...infiniteQueryReturn,
	};
};

export default useInfiniteBookmarksQuery;

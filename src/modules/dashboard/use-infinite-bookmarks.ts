import React from "react";
import { useInfiniteQuery } from "react-query";
import { fetcher } from "~/graphql/fetcher";
import {
	GetAllBookmarksQuery,
	GetAllBookmarksQueryVariables,
	GetAllBookmarksDocument,
	useGetBookmarksCountQuery,
	Bookmark,
} from "~/graphql/types.generated";
import useDashboardStore from "./store";

const useInfiniteBookmarksQuery = () => {
	const { tag, sort } = useDashboardStore();

	const countQueryVariables = React.useMemo(
		() => (tag === "All" ? {} : { tagName: tag }),
		[tag],
	);

	const { isLoading, data: countData } =
		useGetBookmarksCountQuery(countQueryVariables);

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
		return (
			data?.pages?.reduce((acc, cur) => {
				return acc.concat(cur.bookmarks.data);
			}, []) ?? []
		);
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

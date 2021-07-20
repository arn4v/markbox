import React from "react";
import { useInfiniteQuery } from "react-query";
import { fetcher } from "~/graphql/fetcher";
import {
	GetAllBookmarksQuery,
	GetAllBookmarksQueryVariables,
	GetAllBookmarksDocument,
	useGetBookmarksCountQuery,
} from "~/graphql/types.generated";
import useDashboardStore from "./store";

const useInfiniteBookmarksQuery = () => {
	const { tag, sort } = useDashboardStore();

	const [isLoading, setLoading] = React.useState(true);

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
		...infiniteQueryReturn
	} = useInfiniteQuery(["GetAllBookmarks", tag, sort], infiniteFetcher, {
		getNextPageParam: (lastPage) => lastPage.bookmarks.next_cursor,
	});

	useGetBookmarksCountQuery(
		{},
		{
			onSuccess() {
				setLoading(false);
			},
		},
	);

	const bookmarks = React.useMemo(() => {
		return (
			data?.pages?.reduce((acc, cur) => {
				return acc.concat(cur.bookmarks.data);
			}, []) ?? []
		);
	}, [data]);

	return { data: bookmarks, isLoading, ...infiniteQueryReturn };
};

export default useInfiniteBookmarksQuery;

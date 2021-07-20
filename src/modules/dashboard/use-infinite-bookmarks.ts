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

type OnSuccess = () => void;

const useInfiniteBookmarksQuery = ({
	onSuccess,
}: {
	onSuccess?: OnSuccess;
}) => {
	const { tag, sort } = useDashboardStore();
	// Total bookmarks count set by useGetBookmarksCountQuery
	const [count, setCount] = React.useState(0);

	const { isLoading } = useGetBookmarksCountQuery(
		{},
		{
			onSuccess(data) {
				setCount(data?.bookmarksCount);
			},
		},
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
		...infiniteQueryReturn
	} = useInfiniteQuery(["GetAllBookmarks", tag, sort], infiniteFetcher, {
		getNextPageParam: (lastPage) => lastPage.bookmarks.next_cursor,
		onSuccess(data) {
			if (!onSuccess) onSuccess();
		},
	});

	const bookmarks: Bookmark[] = React.useMemo(() => {
		return (
			data?.pages?.reduce((acc, cur) => {
				return acc.concat(cur.bookmarks.data);
			}, []) ?? []
		);
	}, [data]);

	return { data: bookmarks, count, isLoading, ...infiniteQueryReturn };
};

export default useInfiniteBookmarksQuery;

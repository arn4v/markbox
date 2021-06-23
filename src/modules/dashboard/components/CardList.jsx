import * as React from "react";
import { useGetBookmarkQuery } from "~/graphql/types.generated";
import BookmarkCard from "../BookmarkCard";

const CardList = React.memo(() => {
	const { data } = useGetBookmarkQuery();

	return (
		<>
			{Object.values(data).map((item) => {
				return <BookmarkCard key={item.id} id={item.id} />;
			})}
		</>
	);
});

export default CardList;

import * as React from "react";
import { useSelector } from "react-redux";
import { BookmarkCard } from "./BookmarkCard";

const CardList = React.memo(() => {
  const { loading, data } = useSelector((state) => state.bookmarks);

  if (loading) return null;

  return (
    <>
      {Object.values(data).map((item) => {
        return (
          <>
            <BookmarkCard key={item.id} id={item.id} />
          </>
        );
      })}
    </>
  );
});

export default CardList;

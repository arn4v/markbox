import * as React from "react";
import { useSelector } from "react-redux";
import BookmarkCard from "../BookmarkCard";

const CardList = React.memo(() => {
  const bookmarks = useSelector((state) => state.bookmarks);

  React.useEffect(() => {
    console.log("bmks", bookmarks);
  }, [bookmarks]);

  return (
    <>
      {Object.values(bookmarks).map((item) => {
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

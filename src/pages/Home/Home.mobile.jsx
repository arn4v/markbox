import * as React from "react";
import { useSelector } from "react-redux";
import { BookmarkCard } from "~/components/BookmarkCard";
import { AddButton } from "~/components/AddButton";
import { NavBar } from "~/components/NavBar";
import { SearchBar } from "~/components/SearchBar";
import { SettingsContainer } from "~/components/SettingsContainer";

const CardList = React.memo(() => {
  const { loading, data } = useSelector((state) => state.bookmarks);

  React.useEffect(() => {
    console.log(loading, data);
  }, [data, loading]);

  if (loading) return null;

  return (
    <>
      {Object.values(data).map((item) => {
        return (
          <>
            <BookmarkCard id={item.id} key={item.id} />
          </>
        );
      })}
    </>
  );
});

export function HomeMobile() {
  return (
    <>
      <div className="flex flex-col w-screen h-screen overflow-x-hidden lg:hidden bg-blueGray-800">
        <AddButton />
        <NavBar />
        <SettingsContainer />
        <div className="flex flex-col w-full gap-3 p-4">
          <SearchBar />
          <CardList />
        </div>
      </div>
    </>
  );
}

import * as React from "react";
import { useSelector } from "react-redux";
import { BookmarkCard } from "~/components/BookmarkCard";
import AddBookmarkButton from "~/components/AddBookmarkButton";
import { NavBar } from "~/components/NavBar";
import { SearchBar } from "~/components/SearchBar";
import { SettingsContainer } from "~/components/SettingsContainer";
import { AddSheet } from "~/components/AddSheet";
import { EditSheet } from "~/components/EditSheet";
import { FilterSheet } from "~/components/FilterSheet";
import { AnimatePresence } from "framer-motion";

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

export function HomeMobile() {
  const { add, edit, filter } = useSelector((s) => ({
    add: s.add,
    filter: s.filter,
    edit: s.edit,
  }));

  return (
    <>
      <AnimatePresence>
        <AddSheet />
        <FilterSheet />
        <EditSheet id={edit.id} />
      </AnimatePresence>
      <div className="flex flex-col w-screen h-screen overflow-x-hidden lg:hidden bg-blueGray-800">
        <AddBookmarkButton />
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

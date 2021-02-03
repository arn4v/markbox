import * as React from "react";
import { useSelector } from "react-redux";
import AddBookmarkButton from "~/components/AddBookmarkButton";
import { NavBar } from "~/components/NavBar";
import { SearchBar } from "~/components/SearchBar";
import { SettingsContainer } from "~/components/SettingsContainer";
import { AddSheet } from "~/components/AddSheet";
import { EditSheet } from "~/components/EditSheet";
import { FilterSheet } from "~/components/FilterSheet";
import { AnimatePresence } from "framer-motion";
import CardList from "~/components/CardList";

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

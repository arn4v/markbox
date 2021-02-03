import * as React from "react";
import { useSelector } from "react-redux";
import AddBookmarkButton from "~/components/mobile/add-button";
import { NavBar } from "~/components/mobile/navbar";
import { SearchBar } from "~/components/search-bar";
import { SettingsContainer } from "~/components/mobile/settings";
import { AddSheet } from "~/components/mobile/add-sheet";
import { EditSheet } from "~/components/mobile/edit-sheet";
import { FilterSheet } from "~/components/mobile/filter-sheet";
import { AnimatePresence } from "framer-motion";
import CardList from "~/components/mobile/card-list";

/**
 * @exports
 */
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

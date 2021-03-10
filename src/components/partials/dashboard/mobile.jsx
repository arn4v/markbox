import * as React from "react";
import { useSelector } from "react-redux";
import AddBookmarkButton from "~/components/mobile/AddButton";
import NavBar from "~/components/mobile/Navbar";
import SearchBar from "~/components/search-bar";
import SettingsContainer from "~/components/mobile/Settings";
import AddSheet from "~/components/mobile/AddSheet";
import EditSheet from "~/components/mobile/EditSheet";
import FilterSheet from "~/components/mobile/FilterSheet";
import CardList from "~/components/mobile/CardList";

/**
 * @exports
 */
export function HomeMobile() {
  return (
    <>
      <AddSheet />
      <FilterSheet />
      <EditSheet />
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

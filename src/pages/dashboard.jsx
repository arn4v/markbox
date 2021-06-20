import * as React from "react";

export default function HomePage() {
  return (
    <div className="h-screen w-screen dark:bg-blueGray-800 items-start justify-center hidden lg:flex">
      <Sidebar />
      <div className="w-2/4 h-full flex flex-col pt-12 px-6 gap-6">
        <SearchBar></SearchBar>
        <FilterContainer />
        <CardList />
      </div>
      <div className="w-1/4 h-full border-l border-blueGray-600 flex justify-start items-start pt-12 pl-6">
        <div className="flex flex-col gap-6 w-1/2">
          <input
            type="text"
            name="search"
            placeholder="Search tags"
            className="w-full placeholder-gray-500 text-gray-700 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

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

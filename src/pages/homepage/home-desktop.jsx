import { SearchBar } from "~/components/search-bar";
import { Logo } from "../../components/logo";
import CardList from "~/components/mobile/card-list";

export function HomeDesktop() {
  return (
    <>
      <div className="h-screen w-screen dark:bg-blueGray-800 items-start justify-center hidden lg:flex">
        <div className="w-1/4 h-full border-r border-blueGray-600 flex justify-end items-start pt-12 pr-6">
          <div className="flex flex-col gap-6 w-1/2">
            <Logo className="my-1.5" />
          </div>
        </div>
        <div className="w-2/4 h-full flex flex-col pt-12 px-6 gap-6">
          <SearchBar></SearchBar>
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
    </>
  );
}

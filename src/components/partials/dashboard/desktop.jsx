import * as React from "react";
import SearchBar from "~/components/search-bar";
import CardList from "~/components/mobile/CardList";
import Sidebar from "~/components/desktop/Sidebar";
import FilterContainer from "~/components/desktop/FilterContainer";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "~/store";
import { AnimatePresence, motion } from "framer-motion";

export function HomeDesktop() {
  const dispatch = useDispatch();
  const { show, action } = useSelector((s) => s.backdrop);
  const backdropAction = () => {
    action();
    dispatch({ type: actions.BACKDROP_HIDE });
  };
  return (
    <>
      <AnimatePresence exitBeforeEnter>
        {show && (
          <motion.div
            onClick={backdropAction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className="z-20 absolute h-screen w-screen overflow-hidden opacity-75 bg-black"></motion.div>
        )}
      </AnimatePresence>
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
    </>
  );
}

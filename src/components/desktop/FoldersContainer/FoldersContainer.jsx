import * as React from "react";
import { useSelector } from "react-redux";
import Folder from "../Folder";
import { AnimatePresence } from "framer-motion";
import AddFolder from "../AddFolder";
import clsx from "clsx";

const FoldersContainer = () => {
  const [show, setShow] = React.useState(false);
  const folders = useSelector((s) => s.folders);

  return (
    <>
      <div className="flex flex-col w-full gap-4">
        <div className="flex items-center justify-between">
          <span className="">Folders</span>
          <button
            onClick={() => setShow(!show)}
            className="px-2 py-1.5 text-sm uppercase rounded-full bg-blueGray-700 hover:bg-blueGray-600 transition duration-150 ease-in-out focus:outline-none dark:text-white">
            {show ? "Cancel" : "Edit"}
          </button>
        </div>
        <AnimatePresence>
          {show && <AddFolder />}
          {/* <Folder id="all" /> */}
          <div
            className={clsx(
              "flex flex-col gap-4",
              show && "border-b border-gray-500 pb-4",
            )}>
            {Object.values(folders).map((item, index) => {
              return (
                <>
                  <Folder
                    key={item.id}
                    id={item.id}
                    edit={show}
                    index={index}
                  />
                </>
              );
            })}
          </div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default FoldersContainer;
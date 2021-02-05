import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useOnClickOutside } from "~/hooks/onclick-outside";
import { actions } from "~/store";
import { v4 as uuid } from "uuid";
import { ADD } from "~/store/async";

export function AddFolder() {
  const [newFolder, setNewFolder] = React.useState("");
  const onChange = (e) => setNewFolder(e.target.value);
  const [add, setAdd] = React.useState(false);
  const ref = React.useRef(null);
  const dispatch = useDispatch();

  const showAdd = () => {
    dispatch({ type: actions.BACKDROP_SHOW, payload: () => setAdd(false) });
    setAdd(true);
  };

  const addFolder = () => {
    /** @type {Folder} */
    let data;
    data.id = uuid();
    data.title = newFolder;
    data.created = new Date();
    data.updated = new Date();
    dispatch(ADD("folders", data));
    dispatch({ type: actions.BACKDROP_HIDE, payload: () => setAdd(false) });
    setAdd(false);
  };

  const cancel = () => {
    setNewFolder("");
    dispatch({ type: actions.BACKDROP_HIDE, payload: () => setAdd(false) });
    setAdd(false);
  };

  useOnClickOutside(ref, cancel);

  return (
    <>
      <>
        <div
          ref={ref}
          className={clsx("relative overflow-hidden h-auto", add && "z-30")}>
          <motion.button
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            onClick={showAdd}
            className={clsx([
              "w-full items-center justify-center  flex px-2 py-1.5 transition duration-150 ease-in-out bg-blueGray-700 rounded-lg focus:outline-none",
              { "z-30": add, "hover:bg-blueGray-600": !add },
            ])}
            disabled={add}>
            Add folder
          </motion.button>
          <AnimatePresence>
            {add && (
              <>
                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute rounded-lg bg-blueGray-700 border border-blueGray-600 p-4 left-full ml-4 top-0 origin-top-right z-30">
                  <input
                    type="text"
                    placeholder="Folder title"
                    className="rounded-lg px-2 py-1.5 focus:ring focus:ring-emerald-400 transition duration-150 ease-in-out border-none"
                  />
                  <div className="flex mt-4 gap-12 justify-between">
                    <button
                      onClick={cancel}
                      className="w-full items-center justify-center hover:bg-blueGray-500 flex px-1.5 py-1 transition duration-150 ease-in-out bg-blueGray-600 rounded-lg focus:outline-none">
                      Cancel
                    </button>
                    <button
                      onClick={addFolder}
                      className="w-full items-center justify-center hover:bg-blueGray-500 flex px-1.5 py-1 transition duration-150 ease-in-out bg-blueGray-600 rounded-lg focus:outline-none">
                      Add folder
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </>
    </>
  );
}

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useOnClickOutside } from "~/hooks/onclick-outside";
import { actions } from "~/store";
import { v4 as uuid } from "uuid";
import { ADD } from "~/store/async";
import { Popup } from "./popup";

export function AddFolder() {
  const [newFolder, setNewFolder] = React.useState("");
  const onChange = (e) => setNewFolder(e.target.value);
  const [add, setAdd] = React.useState(false);
  const ref = React.useRef(null);
  const dispatch = useDispatch();

  const showAdd = () => {
    setAdd(true);
    dispatch({ type: actions.BACKDROP_SHOW, payload: () => setAdd(false) });
  };

  const addFolder = () => {
    /** @type {Folder} */
    let data = {};
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
      <div
        ref={ref}
        className={clsx("relative pb-4 border-b border-gray-500 h-auto")}>
        <AnimatePresence>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeIn", duration: 0.2 }}
            onClick={showAdd}
            className={clsx([
              "w-full items-center justify-center  flex px-2 py-1.5 transition duration-150 ease-in-out bg-blueGray-700 rounded-lg focus:outline-none box-border",
              { "z-30": add, "hover:bg-blueGray-600": !add },
            ])}
            disabled={add}>
            Add folder
          </motion.button>
        </AnimatePresence>
        <Popup show={add}>
          <input
            type="text"
            placeholder="Folder title"
            value={newFolder}
            onChange={onChange}
            className="rounded-lg dark:text-black px-2 py-1.5 focus:ring focus:ring-emerald-400 transition duration-150 ease-in-out border-none"
          />
          <div className="flex justify-between mt-4 gap-12">
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
        </Popup>
      </div>
    </>
  );
}

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useOnClickOutside } from "~/hooks/onclick-outside";
import { actions } from "~/store";

export function AddFolder() {
  const [newFolder, setNewFolder] = React.useState("");
  const onChange = (e) => setNewFolder(e.target.value);
  const [add, setAdd] = React.useState(false);
  const ref = React.useRef(null);
  const dispatch = useDispatch();

  useOnClickOutside(ref, () => setAdd(false));

  const showAdd = () => {
    dispatch({ type: actions.BACKDROP_SHOW, payload: () => setAdd(false) });
    setAdd(true);
  };

  return (
    <>
      <>
        <div ref={ref} className={clsx("relative", add && "z-30")}>
          <button
            onClick={showAdd}
            className={clsx([
              "w-full items-center justify-center  flex px-2 py-1.5 transition duration-150 ease-in-out bg-blueGray-700 rounded-lg focus:outline-none",
              { "z-30": add, "hover:bg-blueGray-600": !add },
            ])}
            disabled={add}>
            Add folder
          </button>
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
                    className="rounded-lg px-2 py-1.5"
                  />
                  <div className="flex mt-2 gap-12 justify-between">
                    <button className="text-sm w-full items-center justify-center hover:bg-blueGray-500 flex px-1.5 py-1 transition duration-150 ease-in-out bg-blueGray-600 rounded-lg">
                      Cancel
                    </button>
                    <button className="text-sm w-full items-center justify-center hover:bg-blueGray-500 flex px-1.5 py-1 transition duration-150 ease-in-out bg-blueGray-600 rounded-lg">
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

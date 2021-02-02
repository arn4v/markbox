import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "~/store";
import { AddForm } from "./AddForm";
import { motion, AnimatePresence } from "framer-motion";

export function AddSheet() {
  const show = useSelector((s) => s.add.show);
  const dispatch = useDispatch();
  const hideModal = () => {
    dispatch({ type: actions.ADD_HIDE });
  };
  return (
    <>
      <AnimatePresence>
        {show && (
          <div className="absolute flex w-screen h-screen">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
              onClick={hideModal}
              className="absolute z-20 w-full h-full bg-black"
            />
            {show && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ ease: "easeInOut", duration: 0.5 }}
                className="relative z-40 flex flex-col overflow-y-scroll py-6 bottom-sheet px-4 items-start justify-center w-full mt-auto rounded-t-lg h-4/6 bg-blueGray-700">
                <div className="grid w-4/5 grid-cols-6 mx-auto">
                  <div className="col-span-1"></div>
                  <div className="col-span-4 mx-auto mt-0 font-medium text-lg text-white">
                    Add
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      className="col-span-1 p-1 text-sm font-medium text-white uppercase rounded-full bg-blueGray-600 focus:outline-none"
                      onClick={hideModal}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <AddForm className="w-4/5 justify-between h-full mx-auto"></AddForm>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

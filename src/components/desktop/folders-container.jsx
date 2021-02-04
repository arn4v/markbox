import * as React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Folder } from "./folder";
import { getFirebase } from "~/lib/firebase";
import { useHistory } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AddFolder } from "./add-folder";

export function FoldersContainer() {
  const [show, setShow] = React.useState(false);
  const folders = useSelector((s) => s.folders);
  const { auth } = getFirebase();
  const history = useHistory();

  return (
    <>
      <div className="flex w-full flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="">Folders</span>
          <button
            onClick={() => setShow(!show)}
            className="bg-blueGray-700 px-2 text-sm uppercase p-0.5 hover:bg-blueGray-600 rounded-full transition duration-150 ease-in-out focus:outline-none dark:text-white">
            {show ? "Cancel" : "Edit"}
          </button>
        </div>
        {/* <Folder id="all" />
          {Object.values(folders).map((item) => {
            return <></>;
          })} */}
        <AnimatePresence exitBeforeEnter>
          {show && <AddFolder />}
        </AnimatePresence>
      </div>
    </>
  );
}

FoldersContainer.propTypes = {
  show: PropTypes.bool.isRequired,
};

import * as React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useOnClickOutside } from "~/hooks/onclick-outside";
import { HiTrash, HiPencil } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { DELETE, UPDATE } from "~/store/async";
import { Popup } from "./popup";
import { actions } from "~/store";
import StoreHelper from "~/lib/db";

/**
 * @param {Object} props
 * @param {string} props.id
 * @param {boolean} props.edit
 */
export function Folder(props) {
  const { id, edit: globalEdit } = props;
  const [title, setTitle] = React.useState("");
  const [showEdit, setEdit] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.folders[id]);
  const ref = React.useRef(null);
  const deleteRef = React.useRef(null);

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  const onChange = (e) => setTitle(e.target.value);
  const update = () => {
    let _data = data;
    _data.title = title;
    dispatch(UPDATE("folders", _data));
    setEdit(false);
  };

  const enterEditMode = () => {
    if (showDelete) setShowDelete(false);
    setEdit(true);
    dispatch({ type: actions.BACKDROP_SHOW, payload: () => setEdit(false) });
  };

  const exitEditMode = () => {
    setEdit(false);
    setTitle(data?.title);
    if (!showDelete) dispatch({ type: actions.BACKDROP_HIDE });
  };

  const enterDeleteMode = () => {
    if (showEdit) {
      setEdit(false);
      // dispatch({
      //   type: actions.BACKDROP_UPDATE_ACTION,
      //   action: () => setShowDelete(false),
      // });
    } else {
    }
    dispatch({
      type: actions.BACKDROP_SHOW,
      payload: () => setShowDelete(false),
    });

    setShowDelete(true);
  };

  const exitDeleteMode = () => {
    setShowDelete(false);
    if (!showEdit) dispatch({ type: actions.BACKDROP_HIDE });
  };

  const deleteFolder = () => {
    exitDeleteMode();
    dispatch(DELETE("folders", data.id));
  };

  const updateFolder = (e) => {
    e.preventDefault();
    let _data = data;
    _data.title = title;
    exitDeleteMode();
    dispatch(UPDATE("folders", _data));
  };

  React.useEffect(() => {
    if (data) setTitle(data?.title);
  }, [data]);

  useOnClickOutside(ref, () => {
    if (showEdit) exitEditMode();
    if (showDelete) exitDeleteMode();
  });

  return (
    <>
      <div ref={ref} className="relative">
        <div className="flex items-center justify-between gap-2">
          {globalEdit && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5 dark:text-white">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          )}
          <button
            className={clsx(
              [
                "w-full items-center justify-between dark:text-white lg:h-10 px-2 flex transition duration-150 ease-in-out bg-blueGray-700 rounded-lg focus:outline-none",
              ],
              (showEdit || showDelete) && "z-30",
              !globalEdit && "dark:hover:bg-blueGray-600",
            )}
            disabled={globalEdit}>
            <span>{data?.title}</span>
            <AnimatePresence>
              {globalEdit && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ ease: "easeInOut", duration: 0.2 }}
                  className={clsx([
                    "items-center flex justify-center gap-1.5",
                  ])}>
                  <>
                    <button
                      onClick={enterEditMode}
                      className="rounded-full p-1 dark:hover:bg-blueGray-600 duration-150 ease-in-out focus:outline-none"
                      disabled={showEdit}>
                      <HiPencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={enterDeleteMode}
                      className="rounded-full p-1 dark:hover:bg-blueGray-600 transition duration-150 ease-in-out focus:outline-none"
                      disabled={showDelete}>
                      <HiTrash className="h-4 w-4" />
                    </button>
                  </>
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
        <Popup show={showEdit}>
          <form onSubmit={updateFolder} className="flex flex-col gap-2">
            <input
              name="title"
              type="text"
              value={title}
              onChange={onChange}
              className="rounded-lg dark:text-black px-2 py-1.5"
            />
            <div className="flex justify-between gap-12">
              <button
                type="button"
                onClick={exitEditMode}
                className="w-full items-center justify-center hover:bg-blueGray-500 flex px-1.5 py-1 transition duration-150 ease-in-out bg-blueGray-600 rounded-lg focus:outline-none">
                Cancel
              </button>
              <button
                type="submit"
                className="w-full items-center justify-center hover:bg-blueGray-500 flex px-1.5 py-1 transition duration-150 ease-in-out bg-blueGray-600 rounded-lg focus:outline-none">
                Update
              </button>
            </div>
          </form>
        </Popup>
        <Popup show={showDelete}>
          <div className="flex items-center gap-4 justify-between">
            <button className="w-full items-center justify-center hover:bg-blueGray-500 flex px-1.5 py-1 transition duration-150 ease-in-out bg-blueGray-600 rounded-lg focus:outline-none">
              Cancel
            </button>
            <button
              onClick={deleteFolder}
              className="w-full items-center justify-center hover:bg-blueGray-500 flex px-1.5 py-1 transition duration-150 ease-in-out bg-blueGray-600 rounded-lg focus:outline-none">
              Delete
            </button>
          </div>
        </Popup>
      </div>
    </>
  );
}

Folder.propTypes = {
  id: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
};

import * as React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useOnClickOutside } from "~/hooks/onclick-outside";
import { HiTrash, HiPencil, HiCheck } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { UPDATE } from "~/store/async";

/**
 * @param {Object} props
 * @param {string} props.id
 * @param {bool} props.edit
 */
export function Folder(props) {
  const { id, edit: globalEdit } = props;
  const [title, setTitle] = React.useState("");
  const [edit, setEdit] = React.useState(false);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.folders[id]);
  const ref = React.useRef(null);

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  const onChange = (e) => setTitle(e.target.value);
  const cancelEdit = () => {
    setEdit(false);
    setTitle(data?.title);
  };
  const update = () => {
    let _data = data;
    _data.title = title;
    dispatch(UPDATE("folders", _data));
    setEdit(false);
  };

  React.useEffect(() => {
    setTitle(data?.title);
  }, [data]);

  useOnClickOutside(ref, () => {
    if (edit) cancelEdit();
  });

  return (
    <>
      <div ref={ref}>
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
              !globalEdit && "dark:hover:bg-blueGray-600",
            )}
            disabled={globalEdit}>
            {!edit ? (
              <span>{data?.title}</span>
            ) : (
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ease: "easeInOut", duration: 0.2 }}
                type="text"
                value={title}
                onChange={onChange}
                className="h-2/3 w-2/3 rounded border-none focus:ring-0 dark:text-black"
                autoFocus
              />
            )}
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
                  {!edit ? (
                    <>
                      <button
                        onClick={() => setEdit(true)}
                        className="rounded-full p-1 dark:hover:bg-blueGray-600 duration-150 ease-in-out">
                        <HiPencil className="h-4 w-4" />
                      </button>
                      <button className="rounded-full p-1 dark:hover:bg-blueGray-600 transition duration-150 ease-in-out">
                        <HiTrash className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={update}
                      className="rounded-full p-1 dark:hover:bg-blueGray-500 dark:bg-blueGray-600 duration-150 ease-in-out">
                      <HiCheck />
                    </button>
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </>
  );
}

Folder.propTypes = {
  id: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
};

import * as React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useOnClickOutside } from "~/hooks/onclick-outside";
import { HiTrash, HiPencil } from "react-icons/hi";

/**
 * @param {Object} props
 * @param {string} props.id
 */
export function Folder(props) {
  const [edit, setEdit] = React.useState(false);
  const dispatch = useDispatch();
  const { data, globalEdit } = useSelector((state) => ({
    globalEdit: state.folders.show,
    data: state.folders[props.id],
  }));
  const ref = React.useRef(null);

  useOnClickOutside(ref, () => {
    if (edit) setEdit(false);
  });

  return (
    <>
      <div ref={ref}>
        <div className="flex px-2 py-1.5 items-center justify-between dark:text-white dark:hover:bg-blueGray-600 dark:bg-blueGray-700">
          <span className="">{data?.title}</span>
          {globalEdit ? (
            <span className="items-center justify-center flex gap-2">
              <button className="">
                <HiPencil />
              </button>
              <button className="">
                <HiTrash />
              </button>
            </span>
          ) : (
            <span className="items-center justify-center flex"></span>
          )}
        </div>
      </div>
    </>
  );
}

Folder.propTypes = {
  id: PropTypes.string.isRequired,
};

import clsx from "clsx";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "~/store";
import { TagBadge } from "~/components/tag-badge";
import { AnimatePresence, motion } from "framer-motion";
import { DELETE } from "~/store/async";

const EditSheet = () => {
  const { show, data } = useSelector((state) => state.edit);
  const [state, setState] = React.useState({
    id: "",
    title: "",
    url: "",
    tags: {},
    toRead: false,
    newTag: "",
    newTags: {},
    newTagError: "",
    showDelete: false,
    showError: false,
  });
  const [showDelete, setShowDelete] = React.useState(false);
  const dispatch = useDispatch();
  const hideModal = () => dispatch({ type: actions.EDIT_HIDE });
  const showDeleteModal = () => setShowDelete(true);
  const hideDeleteModal = () => setShowDelete(false);
  const deleteBookmark = () => {
    dispatch(DELETE("bookmarks", state.id));
    hideDeleteModal();
    hideModal();
  };

  React.useEffect(() => {
    if (data) {
      setState((s) => ({ ...s, ...data }));
    }
  }, [data]);

  React.useState(() => {
    if (state.newTag.length === 0) setState((s) => ({ ...s, newTagError: "" }));
    if (
      Object.values(state.tags)
        .map((i) => i.title)
        .includes(state.newTag)
    )
      setState((s) => ({
        ...s,
        newTagError: "A tag by this name already exists",
      }));
    return false;
  }, [state.newTag]);

  const onChange = (e) => setState((s) => ({ ...s, newTag: e.target.value }));
  const addTag = (e) => setState((s) => ({ tags: { ...s.tags } }));
  const deleteTag = () => {};

  return (
    <>
      <AnimatePresence>
        {show && (
          <div className="absolute flex w-screen h-screen">
            {showDelete && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ ease: "easeInOut", duration: 0.3 }}
                  onClick={hideDeleteModal}
                  className="absolute h-full w-full z-40 flex items-center justify-center bg-black opacity-75"
                />
                {showDelete && (
                  <div className="absolute h-full w-full flex items-center justify-center">
                    <div className="z-50 rounded-lg w-2/3 h-1/5 bg-blueGray-700 flex flex-col gap-6 items-center justify-center text-gray-100 font-medium p-4">
                      Are you sure you want to delete this bookmark?
                      <div className="w-full flex justify-between items-center">
                        <button
                          type="button"
                          onClick={hideDeleteModal}
                          className="bg-blueGray-600 px-3 py-1.5 rounded-lg">
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={deleteBookmark}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg">
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
              onClick={hideModal}
              className="absolute z-20 w-full h-full bg-black"
            />
            {show && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "66%", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ ease: "easeInOut", duration: 0.5 }}
                className="relative z-30 flex flex-col overflow-y-scroll py-6 bottom-sheet px-4 items-start justify-center mt-auto w-full rounded-t-lg bg-blueGray-700">
                <div className="grid w-4/5 grid-cols-6 mx-auto">
                  <div className="col-span-1"></div>
                  <div className="col-span-4 mx-auto mt-0 text-lg font-medium text-white">
                    Edit
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
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="form-container px-4 justify-between h-5/6">
                  <div>
                    <label for="title" className="form-label">
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={state?.title}
                      required
                      className="input-sheet"
                    />
                  </div>
                  <div>
                    <label for="url" className="form-label">
                      URL
                    </label>
                    <input
                      id="url"
                      type="url"
                      className="input-sheet"
                      value={state?.url}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Tags</label>
                    <div className="flex flex-wrap gap-2 w-full my-2">
                      {Object.values(state.tags).map((item) => {
                        return (
                          <TagBadge
                            key={item.id}
                            title={item.title}
                            className={item.color}>
                            <button
                              className="rounded-full py-0.5 focus:outline-none flex"
                              type="button"
                              id={item.id}
                              onClick={deleteTag}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-3.5 h-3.5 text-white">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </TagBadge>
                        );
                      })}
                    </div>
                    {Object.keys(state.tags).length <= 10 && (
                      <div
                        className={clsx(
                          "flex items-center justify-between overflow-hidden bg-white rounded-md focus:ring focus:ring-emerald-400",
                          {
                            "ring ring-red-500":
                              state.newTag.length > 0 &&
                              this.newTagError !== undefined,
                            "ring ring-green-500":
                              state.newTag.length > 0 && !state.newTagError,
                          },
                        )}>
                        <input
                          id="tags"
                          type="text"
                          className="border-0 focus:ring-0"
                          value={state.newTag}
                          onChange={onChange}
                          maxLength="15"
                        />
                        <button
                          type="button"
                          className={clsx(
                            [
                              "h-full px-3 text-xs font-semibold uppercase focus:outline-none whitespace-nowrap",
                            ],

                            {
                              "text-gray-800": state.newTag.length > 0,
                              "text-gray-500": state.newTag.length === 0,
                            },
                          )}
                          onClick={addTag}
                          disabled={state.newTagError}>
                          Add tag
                        </button>
                      </div>
                    )}
                    {state.showError && (
                      <div className="flex bg-red-500 px-2 py-0.5 text-white text-sm font-medium rounded-md items-center justify-start mt-2">
                        {state.newTagError}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <label
                      for="toRead"
                      className="text-sm font-medium text-white uppercase">
                      To read?
                    </label>
                    <input
                      id="toRead"
                      type="checkbox"
                      v-model="toRead"
                      className="w-4 h-4 border-0 rounded text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div className="flex justify-between items-center w-full mt-2 pb-6">
                    <button
                      type="button"
                      className="px-4 py-2.5 text-sm font-medium text-white uppercase rounded-lg bg-red-500 focus:outline-none select-none"
                      onClick={showDeleteModal}>
                      Delete
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2.5 text-sm font-medium text-white uppercase rounded-lg bg-blueGray-600 focus:outline-none select-none">
                      Update
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EditSheet;

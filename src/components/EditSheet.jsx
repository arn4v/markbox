import clsx from "clsx";
import * as React from "react";
import { v4 as uuid } from "uuid";
import { useStore } from "~/store";
import { TagBadge } from "~/components/TagBadge";
import { motion } from "framer-motion";
import { HiPlusCircle, HiXCircle } from "react-icons/hi";
import { useDeleteBookmarkMutation } from "~/graphql/types.generated";
import { randomColor } from "~/lib/utils";
import Overlay from "./Overlay";

const initialState = {
  id: "",
  title: "",
  url: "",
  tags: {},
  toRead: false,
  showDelete: false,
  showError: false,
};

const EditSheet = () => {
  const [{ data }, hideEditSheet] = useStore((state) => [
    state.edit,
    state.actions.hideEditSheet,
  ]);
  const [state, setState] = React.useState(initialState);
  const [newTag, setNewTag] = React.useState("");
  const [newTagError, setNewTagError] = React.useState("");
  const [showDelete, setShowDelete] = React.useState(false);
  const [deleteBookmark] = useDeleteBookmarkMutation({
    variables: {
      id: data.id,
    },
    onCompleted: () => {
      deleteBookmark();
      hideDeleteModal();
      hideEditSheet();
    },
  });

  const hideDeleteModal = () => setShowDelete(false);

  React.useEffect(() => {
    if (data) {
      setState((s) => ({ ...s, ...data }));
    }
  }, [data]);

  React.useState(() => {
    if (newTag.length === 0) setNewTagError("");

    if (
      Object.values(state.tags)
        .map((i) => i.title)
        .includes(newTag)
    ) {
      setNewTagError("A tag by this name already exists");
    }
  }, [newTag]);

  const addTag = (e) => {
    if (!newTagError) {
      const id = uuid();
      const title = newTag;
      const color = randomColor(state.tags);
      const created = new Date();
      const tag = { id, title, color, created };
      setState((s) => ({ ...s, tags: { ...s.tags, [id]: tag } }));
      setNewTag("");
      setNewTagError("");
    } else {
      setState((s) => ({ ...s, showError: true }));
    }
  };

  const deleteTag = (id) => () =>
    setState((s) => {
      delete s.tags[id];
      return { ...s };
    });

  return (
    <div className="absolute flex w-screen h-screen">
      {showDelete && (
        <>
          <Overlay
            animationDuration={0.3}
            opacity={0.3}
            onClick={hideDeleteModal}
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
      <Overlay animationDuration={0.3} opacity={0.7} onClick={hideModal} />
      {show && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
          className="relative z-40 flex flex-col overflow-y-scroll py-6 bottom-sheet px-4 items-start justify-center w-full mt-auto rounded-t-lg h-4/6 bg-blueGray-700">
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
              <label htmlFor="title" className="form-label">
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
              <label htmlFor="url" className="form-label">
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
                        onClick={deleteTag(item.id)}>
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
                <div className="flex items-center gap-2">
                  <div
                    className={clsx(
                      "flex items-center justify-between overflow-hidden bg-white rounded-md focus:ring focus:ring-emerald-400 transition-all duration-100 ease-in-out",
                      newTag.length > 0 &&
                        !newTagError &&
                        "ring ring-green-400",
                      newTag.length > 0 &&
                        newTagError !== undefined &&
                        "ring ring-red-500",
                    )}>
                    <input
                      id="tags"
                      name="newTag"
                      type="text"
                      className="border-0 w-full bg-transparent focus:ring-0"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      maxLength="15"
                    />
                    {newTag.length > 0 && (
                      <button
                        className="mx-2 focus:outline-none"
                        onClick={() => {
                          setNewTag("");
                          setNewTagError("");
                        }}>
                        <HiXCircle className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className={clsx([
                      "h-full px-2 text-xs font-semibold uppercase focus:outline-none whitespace-nowrap",
                      {
                        "text-gray-800": newTag.length > 0,
                        "text-gray-500": newTag.length === 0,
                      },
                    ])}
                    onClick={addTag}
                    disabled={newTag.length === 0 || !!newTagError}>
                    <HiPlusCircle className="h-5 w-5 text-white" />
                  </button>
                </div>
              )}
              {state.showError && (
                <div className="flex bg-red-500 px-2 py-0.5 text-white text-sm font-medium rounded-md items-center justify-start mt-2">
                  {newTagError}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <label
                htmlFor="toRead"
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
                onClick={() => setShowDelete(true)}>
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
  );
};

export default EditSheet;

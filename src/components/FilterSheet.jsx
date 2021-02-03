import clsx from "clsx";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "~/store";
import { TagBadge } from "~/components/TagBadge";

export function FilterSheet() {
  const { id, title, url, tags, created, updated } = useSelector(
    (state) => state.filter.data,
  );
  const [state, setState] = React.useState({
    newTag: "",
    newTagError: undefined,
    showDelete: false,
    showError: false,
  });
  const [newTag, setNewTag] = React.useState("");
  const [newTagError, setNewTagError] = React.useState(undefined);
  const [showDelete, setShowDelete] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const dispatch = useDispatch();
  const hideModal = () => dispatch({ type: actions.FILTER_HIDE });
  const deleteTag = () => {};
  const addTag = () => {};
  //    onClick={() => setShowDelete(false)}
  return (
    <>
      <div className="absolute flex w-screen h-screen">
        <div
          onClick={hideModal}
          className="absolute z-20 w-full h-full bg-black opacity-50"></div>
        <div className="absolute h-full w-full z-40 flex items-center justify-center bg-black opacity-75"></div>
        <div className="absolute h-full w-full flex items-center justify-center">
          <div className="z-50 rounded-lg w-2/3 h-1/5 bg-blueGray-700 flex flex-col gap-6 items-center justify-center text-gray-100 font-medium p-4">
            Are you sure you want to delete this bookmark?
            <div className="w-full flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowError(false)}
                className="bg-blueGray-600 px-3 py-1.5 rounded-lg">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowError(false)}
                className="bg-red-500 text-white px-3 py-1.5 rounded-lg">
                Confirm
              </button>
            </div>
          </div>
        </div>

        <div className="bottom-sheet relative z-30 flex flex-col items-start justify-center w-full mt-auto rounded-t-lg h-4/6 overflow-y-scroll bg-blueGray-700">
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
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
                v-model="title"
                required="required"
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
                v-model="url"
                required="required"
                className="input-sheet"
              />
            </div>
            <div>
              <label className="form-label">Tags</label>
              <div className="flex flex-wrap gap-2 w-full my-2">
                {}
                <TagBadge
                  key="item.id"
                  title="item.title"
                  className="item.color">
                  <button
                    className="rounded-full py-0.5 focus:outline-none flex"
                    type="button"
                    id="item.id"
                    onClick={deleteTag}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-3.5 h-3.5 text-white">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </TagBadge>
              </div>
              {Object.keys(tags).length <= 10 && (
                <div
                  className={clsx(
                    "flex items-center justify-between overflow-hidden bg-white rounded-md focus:ring focus:ring-emerald-400",
                    {
                      "ring ring-red-500":
                        newTag.length > 0 && this.newTagError !== undefined,
                      "ring ring-green-500":
                        newTag.length > 0 && !this.newTagError,
                    },
                  )}>
                  <input
                    id="tags"
                    type="text"
                    className="border-0 focus:ring-0"
                    v-model="newTag"
                    maxlength="15"
                  />
                  <button
                    type="button"
                    className={clsx(
                      [
                        "h-full px-3 text-xs font-semibold uppercase focus:outline-none whitespace-nowrap",
                      ],

                      {
                        "text-gray-800": newTag.length > 0,
                        "text-gray-500": newTag.length === 0,
                      },
                    )}
                    onClick={addTag}
                    disabled={newTagError}>
                    Add tag
                  </button>
                </div>
              )}
              {showError &
              (
                <div className="flex bg-red-500 px-2 py-0.5 text-white text-sm font-medium rounded-md items-center justify-start mt-2">
                  {newTagError}
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
        </div>
      </div>
    </>
  );
}

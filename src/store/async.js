import StoreHelper from "~/lib/db";
import { actions } from ".";

export async function BOOKMARKS_FETCH(dispatch, getState) {
  const uid = getState().user.uid;
  const store = new StoreHelper(uid, true);
  let data = await store.run();
  data.bookmarks = Object.entries(data.bookmarks).reduce(
    (acc, [key, value]) => {
      value.created = value.created.toDate();
      value.updated = value.updated.toDate();
      acc[key] = value;
      return acc;
    },
    {},
  );
  dispatch({ type: actions.BOOKMARKS_UPDATE, payload: data.bookmarks });
}

/** @type {Record.<Schema, string>} */
const UPDATE_ACTIONS = {
  bookmarks: actions.BOOKMARKS_UPDATE,
  folders: actions.FOLDERS_UPDATE,
  tags: actions.TAGS_UPDATE,
};

/** @param {Schema | "all"} schema */
export function FETCH_UPDATE(schema) {
  return async (dispatch, getState) => {
    console.log(getState());
    const uid = getState().user.uid;
    if (uid) {
      const sh = new StoreHelper(uid, true);
      const doc = await sh.run();
      console.log("got doc", doc);
      if (schema === "all") {
        Object.entries(UPDATE_ACTIONS).forEach(([key, type]) => {
          dispatch({ type, payload: doc[key] });
        });
      } else {
        dispatch({ type: UPDATE_ACTIONS[schema], payload: doc[schema] });
      }
    }
  };
}

/**
 * @param {Schema} type
 * @param {Bookmark | Tag | Folder} data
 */
export function ADD(type, data) {
  return async (dispatch, getState) => {
    const uid = getState().user.uid;
    const sh = new StoreHelper(uid, true);
    sh.add(type, data);
    const doc = await sh.run();
    dispatch({ type: UPDATE_ACTIONS[type], payload: doc[type] });
  };
}

/**
 * @param {Schema} type
 * @param {Bookmark | Tag | Folder} data
 */
export function UPDATE(type, data) {
  return async (dispatch, getState) => {
    const uid = getState().user.uid;
    const sh = new StoreHelper(uid, true);
    sh.add(type, data);
    const doc = await sh.run();
    dispatch({ type: UPDATE_ACTIONS[type], payload: doc[type] });
  };
}

/**
 * @param {Schema} type
 * @param {string} id
 */
export function DELETE(type, id) {
  return async (dispatch, getState) => {
    const uid = getState().user.uid;
    const sh = new StoreHelper(uid, true);
    sh.delete(type, id);
    const doc = await sh.run();
    dispatch({ type: UPDATE_ACTIONS[type], payload: doc[type] });
  };
}

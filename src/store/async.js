import StoreHelper from "~/lib/db";
import { actions } from ".";
import firebase from "firebase/app";
import "firebase/firestore";

export async function BOOKMARKS_FETCH(dispatch, getState) {
  const uid = getState().user.uid;
  const store = new StoreHelper(uid, true);
  let data = await store.run();
  data.bookmarks = Object.entries(data.bookmarks).reduce(
    (acc, [key, value]) => {
      value.created = value.created.toDate().toDateString();
      value.updated = value.updated.toDate().toDateString();
      acc[key] = value;
      return acc;
    },
    {},
  );
  dispatch({ type: actions.BOOKMARKS_UPDATE, payload: data.bookmarks });
}

/** @param {Partial<Bookmark> & { id: string }} bookmark */
export function BOOKMARKS_UPDATE(bookmark) {
  return async (dispatch, getState) => {};
}

/** @param {Bookmark} bookmark */
export function BOOKMARKS_ADD(bookmark) {
  bookmark.created = firebase.firestore.Timestamp.fromDate(bookmark.created);
  bookmark.updated = firebase.firestore.Timestamp.fromDate(bookmark.updated);
  return async (dispatch, getState) => {
    const uid = getState().user.uid;
    const store = new StoreHelper(uid, true);
    await store.add("bookmarks", bookmark).run();
    dispatch(BOOKMARKS_FETCH);
  };
}

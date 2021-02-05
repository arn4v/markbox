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
      value.created = value.created.toDate();
      value.updated = value.updated.toDate();
      acc[key] = value;
      return acc;
    },
    {},
  );
  dispatch({ type: actions.BOOKMARKS_UPDATE, payload: data.bookmarks });
}

/**
 *
 * @param {Schema} type
 * @param {Bookmark | Tag | Folder} data
 * */
export function ADD(type, data) {
  data.created = firebase.firestore.Timestamp.fromDate(data.created);
  data.updated = firebase.firestore.Timestamp.fromDate(data.updated);
  return async (dispatch, getState) => {
    const uid = getState().user.uid;
    const store = new StoreHelper(uid, true);
    await store.add(type, data).run();
  };
}

/**
 *
 * @param {Schema} type
 * @param {Bookmark | Tag | Folder} data
 * */
export function UPDATE(type, data) {
  data.created = firebase.firestore.Timestamp.fromDate(data.created);
  data.updated = firebase.firestore.Timestamp.fromDate(data.updated);
  return async (dispatch, getState) => {
    const uid = getState().user.uid;
    const store = new StoreHelper(uid, true);
    await store.add(type, data).run();
  };
}

/**
 *
 * @param {Schema} type
 * @param {Bookmark | Tag | Folder} data
 * */
export function DELETE(type, data) {
  data.created = firebase.firestore.Timestamp.fromDate(data.created);
  data.updated = firebase.firestore.Timestamp.fromDate(data.updated);
  return async (dispatch, getState) => {
    const uid = getState().user.uid;
    const store = new StoreHelper(uid, true);
    await store.add(type, data).run();
  };
}

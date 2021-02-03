import { getUserDoc, addBookmark } from "~/lib/db";
import { actions } from ".";
import firebase from "firebase/app";
import "firebase/firestore";

export async function BOOKMARKS_FETCH(dispatch, getState) {
  const uid = getState().user.uid;
  let data = await getUserDoc(uid);
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

export function BOOKMARKS_ADD(bookmark) {
  bookmark.created = firebase.firestore.Timestamp.fromDate(bookmark.created);
  bookmark.updated = firebase.firestore.Timestamp.fromDate(bookmark.updated);
  return async (dispatch, getState) => {
    const uid = getState().user.uid;
    addBookmark(uid, bookmark);
    dispatch(BOOKMARKS_FETCH);
  };
}

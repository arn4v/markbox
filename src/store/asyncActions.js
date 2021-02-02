import { getUserDoc } from "~/lib/db";
import { actions } from ".";

export async function BOOKMARKS_FETCH(dispatch, getState) {
  const uid = getState().user.uid;
  const data = await getUserDoc(uid);
  dispatch({ type: actions.BOOKMARKS_UPDATE, payload: data.bookmarks });
}

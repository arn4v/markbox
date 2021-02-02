import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

export const actions = {
  AUTHENTICATE: "authenticate",
  USER_UPDATE: "user/update",
  LOGOUT: "logout",
  TAB_UPDATE: "tab/update",
  BOOKMARKS_FETCH: "bookmarks/fetch",
  BOOKMARKS_ADD: "bookmarks/add",
  BOOKMARKS_DELETE: "bookmarks/delete",
  BOOKMARKS_UPDATE: "bookmarks/update",
  EDIT_SHOW: "edit/show",
  EDIT_HIDE: "edit/hide",
  ADD_SHOW: "add/show",
  ADD_HIDE: "add/hide",
  USERDOC_UPDATE: "userdoc/update",
  FILTER_SHOW: "filter/show",
  FILTER_HIDE: "filter/hide",
};

const initialState = {
  add: { show: false },
  authenticated: false,
  bookmarks: { loading: true, error: undefined, data: undefined },
  edit: { show: false, data: undefined },
  filter: { show: false },
  settings: { show: false },
  tags: {},
  user: null,
  userDoc: null,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case actions.AUTHENTICATE: {
      return { ...state, authenticated: true, user: action.payload.user };
    }
    case actions.FILTER_SHOW: {
      return { ...state, filter: { show: true } };
    }
    case actions.FILTER_HIDE: {
      return { ...state, filter: { show: false } };
    }
    case actions.ADD_SHOW: {
      return { ...state, add: { show: true } };
    }
    case actions.ADD_HIDE: {
      return { ...state, add: { show: false } };
    }
    case actions.EDIT_SHOW: {
      return {
        ...state,
        edit: { show: true, data: state.bookmarks.data[action.payload] },
      };
    }
    case actions.EDIT_HIDE: {
      return { ...state, edit: { show: false, data: undefined } };
    }
    default:
      return state;
  }
}

export const store = createStore(rootReducer, applyMiddleware(thunk));

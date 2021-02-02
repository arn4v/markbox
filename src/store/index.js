import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

export const actions = {
  AUTHENTICATE: "authenticate",
  USER_UPDATE: "user/update",
  LOGOUT: "logout",
  TAB_UPDATE: "tab/update",
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
  SETTINGS_TOGGLE: "settings/toggle",
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
      state = { ...state, authenticated: true, user: action.payload.user };
      break;
    }
    case actions.FILTER_SHOW: {
      state = { ...state, filter: { show: true } };
      break;
    }
    case actions.FILTER_HIDE: {
      state = { ...state, filter: { show: false } };
      break;
    }
    case actions.ADD_SHOW: {
      state = { ...state, add: { show: true } };
      break;
    }
    case actions.ADD_HIDE: {
      state = { ...state, add: { show: false } };
      break;
    }
    case actions.EDIT_SHOW: {
      state = { ...state, edit: { show: true, data: action.payload } };
      break;
    }
    case actions.EDIT_HIDE: {
      state = { ...state, edit: { show: false, data: undefined } };
      break;
    }
    case actions.BOOKMARKS_UPDATE: {
      state = { ...state, bookmarks: { loading: false, data: action.payload } };
      break;
    }
    case actions.SETTINGS_TOGGLE: {
      state = { ...state, settings: { show: !state.settings.show } };
      break;
    }
    default:
      break;
  }
  return state;
}

export const store = createStore(rootReducer, applyMiddleware(thunk));

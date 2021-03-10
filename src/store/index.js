import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

export const actions = {
  ADD_HIDE: "add/hide",
  ADD_SHOW: "add/show",
  AUTHENTICATE: "authenticate",
  BACKDROP_HIDE: "backdrop/hide",
  BACKDROP_SHOW: "backdrop/show",
  BACKDROP_UPDATE_ACTION: "backdrop/updateAction",
  BOOKMARKS_ADD: "bookmarks/add",
  BOOKMARKS_DELETE: "bookmarks/delete",
  BOOKMARKS_UPDATE: "bookmarks/update",
  EDIT_HIDE: "edit/hide",
  EDIT_SHOW: "edit/show",
  FILTER_HIDE: "filter/hide",
  FILTER_SHOW: "filter/show",
  FOLDERS_UPDATE: "folders/update",
  LOGOUT: "logout",
  SEARCH_UPDATE: "search/update",
  SETTINGS_TOGGLE: "settings/toggle",
  TAB_UPDATE: "tab/update",
  TAGS_UPDATE: "tags/update",
  USERDOC_UPDATE: "userdoc/update",
  USER_UPDATE: "user/update",
};

const initialState = {
  add: { show: false },
  authenticated: false,
  backdrop: { show: false, action: () => undefined },
  bookmarks: {},
  edit: { show: false, data: undefined },
  filter: { show: false },
  folders: {},
  search: "",
  settings: { show: false },
  tags: {},
  user: {},
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case actions.AUTHENTICATE: {
      console.log(action);
      state = { ...state, authenticated: true, user: action.payload };
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
      state = { ...state, bookmarks: action.payload };
      break;
    }
    case actions.SETTINGS_TOGGLE: {
      state = { ...state, settings: { show: !state.settings.show } };
      break;
    }
    case actions.SEARCH_UPDATE: {
      state = { ...state, search: action.payload };
      break;
    }
    case actions.BACKDROP_SHOW: {
      state = {
        ...state,
        backdrop: { show: true, action: action.payload },
      };
      break;
    }
    case actions.BACKDROP_HIDE: {
      state = {
        ...state,
        backdrop: { show: false, action: () => {} },
      };
      break;
    }
    case actions.BACKDROP_UPDATE_ACTION: {
      state = {
        ...state,
        backdrop: { ...state.backdrop, action: action.payload },
      };
      break;
    }
    case actions.TAGS_UPDATE: {
      state = { ...state, tags: action.payload };
      break;
    }
    case actions.FOLDERS_UPDATE: {
      state = { ...state, folders: action.payload };
      break;
    }
    default:
      break;
  }
  return state;
}

export const store = createStore(rootReducer, applyMiddleware(thunk));

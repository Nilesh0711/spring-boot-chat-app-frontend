import {
  LOGIN,
  LOGOUT,
  REGISTER,
  REQ_USER,
  SEARCH_USER,
  UPDATE_USER,
} from "./ActionType";

const initialValue = {
  signUp: null,
  signIn: null,
  reqUser: null,
  searchUser: [],
  updateUser: null,
};

export const authReducer = (store = initialValue, { type, payload }) => {
  switch (type) {
    case REGISTER:
      return { ...store, signUp: payload };
    case LOGIN:
      return { ...store, signIn: payload };
    case REQ_USER:
      return { ...store, reqUser: payload };
    case SEARCH_USER:
      return { ...store, searchUser: payload };
    case UPDATE_USER:
      return { ...store, updateUser: payload };
    case LOGOUT:
      return { ...store, signUp: payload, signIn: payload };
    default:
      return store;
  }
};

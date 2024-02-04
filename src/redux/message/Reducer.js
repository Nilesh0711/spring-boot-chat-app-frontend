import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE } from "./ActionType";

const initialValue = {
  message: [],
  newMessage: null,
};

export const messageReducer = (store = initialValue, { type, payload }) => {
  switch (type) {
    case CREATE_NEW_MESSAGE:
      return { ...store, newMessage: payload };
    case GET_ALL_MESSAGE:
      return { ...store, message: payload };
    default:
      return store;
  }
};

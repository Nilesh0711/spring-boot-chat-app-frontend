import {
  CREATE_NEW_MESSAGE,
  DELETED_MESSAGE,
  GET_ALL_MESSAGE,
  UPDATED_MESSAGE,
} from "./ActionType";

const initialValue = {
  message: null,
  newMessage: null,
  updatedMessage: null,
  deletedMessage: null,
};

export const messageReducer = (store = initialValue, { type, payload }) => {
  switch (type) {
    case CREATE_NEW_MESSAGE:
      return { ...store, newMessage: payload };
    case GET_ALL_MESSAGE:
      return { ...store, message: payload };
    case UPDATED_MESSAGE:
      return { ...store, updatedMessage: payload };
    case DELETED_MESSAGE:
      return { ...store, deletedMessage: payload };
    default:
      return store;
  }
};

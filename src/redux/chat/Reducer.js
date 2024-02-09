import {
  CREATE_CHAT,
  CREATE_GROUP,
  GET_USERS_CHAT,
  UPDATED_LAST_CHAT_COUNT,
  UPDATED_LAST_CHAT_MESSAGE,
} from "./ActionType";

const initialValue = {
  chats: [],
  createdGroup: null,
  createdChat: null,
  updatedLastChatMessage: null,
  updatedLastChatCount: null,
};

export const chatReducer = (store = initialValue, { type, payload }) => {
  switch (type) {
    case CREATE_CHAT:
      return { ...store, createdChat: payload };

    case CREATE_GROUP:
      return { ...store, createdGroup: payload };

    case GET_USERS_CHAT:
      return { ...store, chats: payload };

    case UPDATED_LAST_CHAT_MESSAGE:
      return { ...store, updatedLastChatMessage: payload };

      case UPDATED_LAST_CHAT_COUNT:
        return { ...store, updatedLastChatCount: payload };

    default:
      return store;
  }
};

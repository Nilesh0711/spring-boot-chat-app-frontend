import { BASE_API_URL } from "../../config/api";
import {
  CREATE_CHAT,
  CREATE_GROUP,
  GET_USERS_CHAT,
  UPDATED_LAST_CHAT_COUNT,
  UPDATED_LAST_CHAT_MESSAGE,
} from "./ActionType";

export const createChat = (chatData) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/chat/single`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatData.token}`,
      },
      body: JSON.stringify(chatData.data),
    });

    const data = await res.json();
    console.log("CREATE_CHAT ACTION : ", data);

    dispatch({ type: CREATE_CHAT, payload: data });
  } catch (error) {
    console.log("CREATE_CHAT ACTION ERROR : ", error);
  }
};

export const createGroupChat = (chatData) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/chat/group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatData.token}`,
      },
      body: JSON.stringify(chatData.data),
    });

    const data = await res.json();
    console.log("CREATE_GROUP ACTION : ", data);

    dispatch({ type: CREATE_GROUP, payload: data });
  } catch (error) {
    console.log("CREATE_GROUP ACTION ERROR : ", error);
  }
};

export const getUserChat = (token) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/chat/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log("GET_USERS_CHAT ACTION : ", data);

    dispatch({ type: GET_USERS_CHAT, payload: data });
    return data;
  } catch (error) {
    console.log("GET_USERS_CHAT ACTION ERROR : ", error);
    return error;
  }
};

export const updateLastMessage =
  (newLastMessage) => async (dispatch) => {
    console.log("UPDATED_LAST_CHAT_MESSAGE ACTION : ", newLastMessage);
    dispatch({ type: UPDATED_LAST_CHAT_MESSAGE, payload: newLastMessage });
  };

export const updateMessageCount =
  (newLastMessage) => async (dispatch) => {
    console.log("UPDATED_LAST_CHAT_COUNT ACTION : ", newLastMessage);
    dispatch({ type: UPDATED_LAST_CHAT_COUNT, payload: newLastMessage });
  };

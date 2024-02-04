import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE } from "./ActionType";
import { BASE_API_URL } from "../../config/api";

export const createMessage = (messageData) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/message/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${messageData.token}`,
      },
      body: JSON.stringify(messageData.data),
    });

    const data = await res.json();
    console.log("CREATE_NEW_MESSAGE ACTION : ", data);

    dispatch({ type: CREATE_NEW_MESSAGE, payload: data });
  } catch (error) {
    console.log("CREATE_NEW_MESSAGE ACTION ERROR : ", error);
  }
};

export const getAllMessage = (reqData) => async (dispatch) => {
  try {
    const res = await fetch(
      `${BASE_API_URL}/api/message/chat/${reqData.chatId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${reqData.token}`,
        },
      }
    );

    const data = await res.json();
    console.log("GET_ALL_MESSAGE ACTION : ", data);

    dispatch({ type: GET_ALL_MESSAGE, payload: data });
  } catch (error) {
    console.log("GET_ALL_MESSAGE ACTION ERROR : ", error);
  }
};

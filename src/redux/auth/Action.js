import { BASE_API_URL } from "../../config/api";
import {
  LOGIN,
  LOGOUT,
  REGISTER,
  REQ_USER,
  SEARCH_USER,
  UPDATE_USER,
} from "./ActionType";

export const register = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (resData.jwt) localStorage.setItem("token", resData.jwt);
    console.log("REGISTER ACTION CALL ", resData);
    dispatch({
      type: REGISTER,
      payload: resData,
    });
    return resData;
  } catch (error) {
    console.log("REGISTER ACTION CALL ERROR: ", error);
    return error;
  }
};

export const login = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (resData.jwt) localStorage.setItem("token", resData.jwt);
    console.log("LOGIN ACTION CALL : ", resData);
    dispatch({
      type: LOGIN,
      payload: resData,
    });
    return resData;
  } catch (error) {
    console.log("LOGIN ACTION CALL ERROR: ", error);
    return error;
  }
};

export const currentUser = (token) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await res.json();
    console.log("REQ_USER ACTION CALL : ", resData);
    dispatch({
      type: REQ_USER,
      payload: resData,
    });
  } catch (error) {
    console.log("REQ_USER ACTION CALL ERROR: ", error);
  }
};

export const searchUser = (data) => async (dispatch) => {
  try {
    const res = await fetch(
      `${BASE_API_URL}/api/users/search/${data.keyword}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    const resData = await res.json();
    const searchUserArray = Array.isArray(resData) ? resData : [];
    console.log("SEARCH_USER ACTION CALL : ", searchUserArray);
    dispatch({
      type: SEARCH_USER,
      payload: searchUserArray,
    });
  } catch (error) {
    console.log("SEARCH_USER ACTION CALL ERROR: ", error);
  }
};

export const updateUser = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify(data.data),
    });
    const resData = await res.json();
    console.log("UPDATE_USER ACTION CALL : ", resData);
    dispatch({
      type: UPDATE_USER,
      payload: resData,
    });
  } catch (error) {
    console.log("UPDATE_USER ACTION CALL ERROR: ", error);
  }
};

export const logOutAction = () => async (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: LOGOUT, payload: null });
  dispatch({ type: REQ_USER, payload: null });
};

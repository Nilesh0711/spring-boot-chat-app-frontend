import SockJS from "sockjs-client";
import { over } from "stompjs";
import { getCookie } from "./cookie";
import { BASE_API_URL } from "./api";
const token = localStorage.getItem("token");

export const connect = () => {
  return new Promise((resolve, reject) => {
    const sock = new SockJS(`${BASE_API_URL}/ws`);
    const temp = over(sock);

    const header = {
      Authorization: `Bearer ${token}`,
      "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
    };

    temp.connect(
      header,
      () => {
        console.log("Connection established.");
        resolve({ temp, connected: true });
      },
      (error) => {
        console.log("Connection error:", error);
        reject(error);
      }
    );
  });
};

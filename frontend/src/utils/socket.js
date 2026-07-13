import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket;

// Creates (or reuses) a single socket connection for the session.
export const createSocketConnection = () => {
  if (!socket || socket.disconnected) {
    socket = io(BASE_URL, {
      withCredentials: true,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = undefined;
  }
};

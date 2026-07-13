import axios from "axios";
import { BASE_URL } from "./constants";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send the httpOnly JWT cookie on every request
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

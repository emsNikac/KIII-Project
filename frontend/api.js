import axios from "axios";

const API_URL =
  typeof window !== "undefined"
    ? "/api"
    : "http://backend:3000";

export const api = axios.create({
  baseURL: API_URL,
});

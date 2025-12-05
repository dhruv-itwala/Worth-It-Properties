// Frontend/src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3030/api/v1",
  withCredentials: true,
  timeout: 0,
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3030",
  withCredentials: true, // REQUIRED for cookies
  timeout: 15000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true; // ALWAYS SEND COOKIES
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — clearing any leftover tokens");
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Your API base URL from .env
});

api.interceptors.request.use((config) => {
  // Get token as a raw string from localStorage
  const token = localStorage.getItem("token");

  // Check if token exists and is valid
  if (token && token !== "undefined" && token !== "null") {
    // Set the Authorization header with Bearer token
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

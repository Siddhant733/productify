import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("❌ VITE_API_URL is not defined in .env");
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 🔹 Response interceptor (centralized error logging)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error.message;

    console.error("API Error:", message);

    return Promise.reject(error);
  }
);

export default api;
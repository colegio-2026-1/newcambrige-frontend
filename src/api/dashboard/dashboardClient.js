// src/api/dashboard/dashboardClient.js
// Cliente HTTP exclusivo del módulo Dashboard
import axios from "axios";

const dashboardClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

dashboardClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

dashboardClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem("access_token");
      window.location.replace("/?expired=true");
    }
    return Promise.reject(error);
  }
);

export default dashboardClient;

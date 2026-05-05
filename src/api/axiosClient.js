import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
    "Content-Type": "application/json",
    },
});

// Interceptor: agrega el token JWT a cada request automáticamente
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
}
    return config;
});

// Interceptor: maneja errores globales (ej: 401 = sesión expirada)
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
    }
    return Promise.reject(error);
    }
);

export default axiosClient;
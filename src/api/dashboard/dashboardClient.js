// src/api/dashboard/dashboardClient.js
// Cliente HTTP exclusivo para el módulo Dashboard — no modificar axiosClient.js del equipo
import axios from "axios";

const dashboardClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
});

// Adjunta el token en cada petición
dashboardClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Manejo de errores: sesión expirada
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

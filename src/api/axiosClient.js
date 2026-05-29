import axios from "axios";


const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
});

// Request interceptor
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";
        const detail = error.response?.data?.detail || "";

        // =========================
        // ENDPOINT DE LOGIN (/token)
        // =========================
        if (url.includes("/api/auth/token")) {
            if (status === 429) {
                const message = detail || "Demasiados intentos. Intenta nuevamente en 1 minuto.";
                // Guardar en sessionStorage (no hay redirección)
                sessionStorage.setItem("popupMessage", message);
                sessionStorage.setItem("popupType", "login-blocked");
                // Evento para mostrarlo sin recargar
                window.dispatchEvent(new CustomEvent("login-blocked", { detail: message }));
            }
            return Promise.reject(error);
        }

        // =========================
        // RESTO DE ENDPOINTS (protegidos) – sesión expirada
        // =========================
        if (status === 401) {
            localStorage.removeItem("access_token");
            // Redirigir a login con query param para mostrar popup
            window.location.replace("/?expired=true");
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
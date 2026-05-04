import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, getMeRequest } from "../../api/authService";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
        const data = await loginRequest(username, password);
        localStorage.setItem("access_token", data.access_token);

        const meResponse = await getMeRequest();
        setUser(meResponse.data);

        navigate("/dashboard");
    } catch (err) {
        setError(err.response?.data?.detail || "Error al iniciar sesión");
    } finally {
        setLoading(false);
    }
    };

    const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/login");
    };

    return { user, loading, error, login, logout };
};
// useAuth.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, getMeRequest } from "./authService";
import { allrolesuserRequest } from "../api/endpoints";

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const cached = sessionStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const [roles, setRoles] = useState(() => {
    const cached = sessionStorage.getItem("roles");
    return cached ? JSON.parse(cached) : [];
  });
  const [loadingRoles, setLoadingRoles] = useState(() => {
    // Si ya hay roles en caché, no cargamos
    return !sessionStorage.getItem("roles");
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionMessage, setSessionMessage] = useState("");
  const navigate = useNavigate();

  const fetchRoles = async (userId) => {
    if (!userId) {
      setRoles([]);
      setLoadingRoles(false);
      return;
    }
    try {
      setLoadingRoles(true);
      const response = await allrolesuserRequest(userId);
      const rolesData = response?.data || [];
      setRoles(rolesData);
      sessionStorage.setItem("roles", JSON.stringify(rolesData));
    } catch (err) {
      console.error("Error al obtener roles:", err);
      setRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginRequest(username, password);
      localStorage.setItem("access_token", data.access_token);
      const meResponse = await getMeRequest();
      const userData = meResponse.data;
      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
      await fetchRoles(userData.id_usuario);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.detail || "Error al iniciar sesión");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = (message = "") => {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("roles");
    setUser(null);
    setRoles([]);
    setLoadingRoles(true);
    if (message) setSessionMessage(message);
    navigate("/");
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoadingRoles(false);
      return;
    }
    // Si ya tenemos usuario y roles en caché, no llamamos a la API
    const cachedUser = sessionStorage.getItem("user");
    const cachedRoles = sessionStorage.getItem("roles");
    try {
      const meResponse = await getMeRequest();
      const userData = meResponse.data;
      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
      await fetchRoles(userData.id_usuario);
    } catch (err) {
      if (err.response?.status === 401) {
        logout(err.response?.data?.detail || "Sesión expirada por inactividad");
      } else {
        setLoadingRoles(false);
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    roles,
    loadingRoles,
    loading,
    error,
    login,
    logout,
    sessionMessage,
    setSessionMessage,
  };
};
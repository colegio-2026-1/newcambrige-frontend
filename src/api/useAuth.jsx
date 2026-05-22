import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  loginRequest,
  getMeRequest
} from "./authService";

export const useAuth = () => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [sessionMessage, setSessionMessage] =
    useState("");

  const navigate = useNavigate();

  // =========================
  // LOGIN
  // =========================
  const login = async (
    username,
    password
  ) => {

    setLoading(true);

    setError(null);

    try {

      const data = await loginRequest(
        username,
        password
      );

      // guardar token
      localStorage.setItem(
        "access_token",
        data.access_token
      );

      // obtener usuario
      const meResponse =
        await getMeRequest();

      setUser(meResponse.data);

      navigate("/home");

    } catch (err) {

      setError(
        err.response?.data?.detail ||
        "Error al iniciar sesión"
      );

      throw err;

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = (
    message = ""
  ) => {

    localStorage.removeItem(
      "access_token"
    );

    setUser(null);

    if (message) {
      setSessionMessage(message);
    }

    navigate("/");
  };

  // =========================
  // VALIDAR SESIÓN
  // =========================
  const checkAuth = async () => {

    const token =
      localStorage.getItem(
        "access_token"
      );

    // si no hay token
    if (!token) {
      return;
    }

    try {

      const meResponse =
        await getMeRequest();

      setUser(meResponse.data);

    } catch (err) {

      // sesión inválida
      if (
        err.response?.status === 401
      ) {

        logout(
          err.response?.data?.detail ||
          "Sesión expirada por inactividad"
        );
      }
    }
  };

  // =========================
  // AL CARGAR APP
  // =========================
  useEffect(() => {

    checkAuth();

  }, []);

  return {

    user,

    loading,

    error,

    login,

    logout,

    sessionMessage,

    setSessionMessage
  };
};
// src/api/authService.js

import axiosClient from "./axiosClient";

export const loginRequest = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await axiosClient.post("/api/auth/token", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
};

export const getMeRequest = () => axiosClient.get("/api/auth/me");
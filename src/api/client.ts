// ===============================
// src/api/client.ts
// ===============================

import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
//================================ ATTACH TOKEN==============================

// =============================== OPTIONAL TOKEN EXTRACTION ===============================


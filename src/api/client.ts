// src/api/client.ts

import axios from "axios";

/*
 * Vite environment variables are injected at BUILD TIME.
 *
 * The fallback ensures the app can still communicate with the
 * current Taxlator backend if VITE_API_BASE_URL was not supplied
 * during deployment.
 */
export const API_BASE =
	import.meta.env.VITE_API_BASE_URL ||
	"https://taxlator-backend-zxij.onrender.com";

export const api = axios.create({
	baseURL: API_BASE,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => Promise.reject(error),
);
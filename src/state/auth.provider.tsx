// src/state/auth.provider.tsx

import React, {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { api } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { AuthCtx } from "./auth.context";
import type { AuthContextValue } from "./auth.context";
import type {
	User,
	SignUpPayload,
	SignInPayload,
} from "../api/auth.types";

export function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const refresh = useCallback(async () => {
		setRefreshing(true);

		try {
			const { data } = await api.get(ENDPOINTS.me, {
				withCredentials: true,
			});

			setUser(data.user ?? null);
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	const value = useMemo<AuthContextValue>(() => {
		const authenticated = Boolean(user);

		return {
			user,
			loading: loading || refreshing,
			authenticated,

			async signup(payload: SignUpPayload) {
				const { data } = await api.post(
					ENDPOINTS.signup,
					payload,
					{
						withCredentials: true,
					},
				);

				return data;
			},

			async signin(payload: SignInPayload) {
				const { data } = await api.post(
					ENDPOINTS.signin,
					payload,
					{
						withCredentials: true,
					},
				);

				if (data?.token) {
					localStorage.setItem("token", data.token);
				}

				await refresh();

				return data;
			},

			/*
			 * The backend endpoint is still called /send-code,
			 * but the current backend sends a clickable verification LINK.
			 */
			async sendVerificationCode(payload: {
				email: string;
				redirectUrl?: string;
			}) {
				const { data } = await api.post(
					ENDPOINTS.sendVerificationCode,
					payload,
					{
						withCredentials: true,
					},
				);

				return data;
			},

			async signout() {
				try {
					await api.post(
						ENDPOINTS.signout,
						{},
						{
							withCredentials: true,
						},
					);
				} catch (error) {
					console.warn(
						"Signout request failed:",
						error,
					);
				} finally {
					setUser(null);
					localStorage.removeItem("token");
					window.location.href = "/signin";
				}
			},

			logout() {
				setUser(null);
				localStorage.removeItem("token");
				window.location.href = "/signin";
			},

			refresh,
		};
	}, [user, loading, refreshing, refresh]);

	return (
		<AuthCtx.Provider value={value}>
			{children}
		</AuthCtx.Provider>
	);
}
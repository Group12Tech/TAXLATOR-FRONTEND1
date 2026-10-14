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
	VerifyEmailPayload,
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

			// Re-sends the 6-digit email OTP (web).
			async resendOtp(payload: { email: string }) {
				const { data } = await api.post(
					ENDPOINTS.resendOtp,
					payload,
					{
						withCredentials: true,
					},
				);

				return data;
			},

			async verifyEmail(payload: VerifyEmailPayload) {
				const { data } = await api.post(
					ENDPOINTS.verifyEmail,
					payload,
					{
						withCredentials: true,
					},
				);

				// Backend sets the JWT cookie on success (user is now logged in).
				// Keep a token too if one is ever returned in the body.
				if (data?.token) {
					localStorage.setItem("token", data.token);
				}

				if (data?.user) {
					setUser(data.user);
				}

				// Re-sync with /api/auth/profile using the new cookie.
				await refresh();

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
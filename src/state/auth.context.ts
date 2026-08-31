// src/state/auth.context.ts

import { createContext } from "react";
import type { SignInPayload, SignUpPayload, User } from "../api/auth.types";
import type { AnyJson } from "../api/api.types";

export type AuthContextValue = {
	user: User | null;
	loading: boolean;
	authenticated: boolean;

	signin: (payload: SignInPayload) => Promise<AnyJson>;
	signup: (payload: SignUpPayload) => Promise<AnyJson>;

	sendVerificationCode: (payload: {
		email: string;
		redirectUrl?: string;
	}) => Promise<AnyJson>;

	signout: () => Promise<void>;
	logout: () => void;

	refresh: () => Promise<void>;
};

export const AuthCtx = createContext<AuthContextValue | null>(null);
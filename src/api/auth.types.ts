// src/api/types/auth.types.ts

// -----------------------------------------------------------
// ------------------------------ AUTH PAYLOADS ------------------------------
export interface SignUpPayload {
	fullName: string;
	email: string;
	password: string;
	confirmPassword: string;
	redirectUrl?: string;
}

export interface SignInPayload {
	email: string;
	password: string;
}

// ------------------------------ USER ------------------------------
export interface User {
	id: string;
	email: string;
	fullName: string; 
	createdAt: string;
	updatedAt: string;
}


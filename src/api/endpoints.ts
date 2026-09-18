// src/api/endpoints.ts

export const ENDPOINTS = {
	// ------------------------------ AUTH ------------------------------
	signup: "/api/auth/signup",

	// NOTE:
	// The backend route is still named /send-code,
	// but it now sends a clickable email verification LINK.
	sendVerificationCode: "/api/auth/send-code",

	signin: "/api/auth/signin",
	checkEmail: "/api/auth/check-email",
	me: "/api/auth/profile",
	changePassword: "/api/auth/change-password",
	forgotPassword: "/api/auth/forgot-password",
	resetPassword: "/api/auth/reset-password",
	signout: "/api/auth/signout",

	// ------------------------------ TAX ENDPOINTS ------------------------------

	// Public
	taxCalculatePublic: (taxType: string) =>
		`/api/tax/${taxType}/calculate`,

	// Public shortcut
	taxCalculate: (taxType: string) =>
		`/api/tax/${taxType}/calculate`,

	// Private
	taxCalculatePrivate: (taxType: string) =>
		`/api/tax/${taxType}/calculate/save`,

	// ------------------------------ VAT ENDPOINTS ------------------------------

	// Public
	vatCalculatePublic: "/api/vat/calculate",

	// Public shortcut
	vatCalculate: "/api/vat/calculate",

	// Private
	vatCalculatePrivate: "/api/vat/calculate/save",
};
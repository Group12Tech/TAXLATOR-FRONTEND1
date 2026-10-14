// src/api/endpoints.ts

export const ENDPOINTS = {
	// ------------------------------ AUTH ------------------------------
	signup: "/api/auth/signup",

	// WEB: re-sends the 6-digit email OTP (expires in 10 minutes).
	resendOtp: "/api/auth/resend-otp",

	// MOBILE ONLY (confirmation link) - do not use from the web app.
	// sendCode: "/api/auth/send-code",

	// Verifies the 6-digit OTP. Body: { email, otp }.
	// On success the backend sets the JWT cookie and logs the user in.
	verifyEmail: "/api/auth/verify-otp",

	signin: "/api/auth/signin",
	checkEmail: "/api/auth/check-email",
	me: "/api/auth/profile",
	changePassword: "/api/auth/change-password",
	forgotPassword: "/api/auth/forgot-password",
	// WEB: reset password using the emailed OTP.
	// (/api/auth/reset-password is the mobile token-link version.)
	resetPasswordOtp: "/api/auth/reset-password-otp",

	refresh: "/api/auth/refresh",
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
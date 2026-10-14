// ===============================
// src/routes/auth.routes.tsx
// ===============================

// ===============================
import { lazy } from "react";
import { Route } from "react-router-dom";
// ===============================

// =============================== LAZY LOADING ===============================
const SignIn = lazy(() => import("../pages/otherPages/SignIn"));
const SignUp = lazy(() => import("../pages/otherPages/SignUp"));
const ForgotPassword = lazy(() => import("../pages/otherPages/ForgotPassword"));
const VerifyEmail = lazy(() => import("../pages/otherPages/verifyEmail"));

// =============================== AUTH ROUTES ===============================
const AuthRoutes = [
	<Route key="/signin" path="/signin" element={<SignIn />} />,
	<Route key="/signup" path="/signup" element={<SignUp />} />,
	<Route key="/forgot-password" path="/forgot-password" element={<ForgotPassword />} />,
	<Route key="/verify-email" path="/verify-email" element={<VerifyEmail />} />,
];
// ===============================

export default AuthRoutes;
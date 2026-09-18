// ===============================
// src/routes/index.tsx
// ===============================

// ===============================
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PublicRoutes from "./public.routes";
import AuthRoutes from "./auth.routes";
import TaxRoutes from "./tax.routes";
import ProtectedRoutes from "./protected.routes";
import { Suspense } from "react";
// ===============================

// =============================== APP ROUTES COMPONENT ===============================
export default function AppRoutes() {
	const location = useLocation();

	return (
		<Suspense
			fallback={
				<div className="min-h-[60vh] flex items-center justify-center">
					<div className="w-8 h-8 border-4 border-brand-700 border-t-transparent rounded-full animate-spin" />
				</div>
			}
		>
			<Routes location={location} key={location.pathname}>
				{PublicRoutes}
				{AuthRoutes}
				{TaxRoutes}
				{ProtectedRoutes}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Suspense>
	);
}

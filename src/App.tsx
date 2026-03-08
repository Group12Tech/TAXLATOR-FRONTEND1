// ===============================
// src/App.tsx
// ===============================

// ===============================
import Shell from "./components/layouts/Shell";
import { useAuth } from "./state/useAuth";
import AppRoutes from "./routes";
// ===============================

// =============================== APP COMPONENT ===============================
export default function App() {
	const { loading } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-white">
				<div className="w-9 h-9 rounded bg-brand-700 text-white grid place-items-center font-bold animate-spin">
					T
				</div>
			</div>
		);
	}

	return (
		<Shell>
			<AppRoutes />
		</Shell>
	);
}

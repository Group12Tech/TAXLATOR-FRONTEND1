// ===============================
// src/App.tsx
// ===============================

import TaxlatorLogo from "./assets/images/TAX_LOGOs.png";
import Shell from "./components/layouts/Shell";
import { useAuth } from "./state/useAuth";
import AppRoutes from "./routes";

export default function App() {
	const { loading } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-white">
				<img
					src={TaxlatorLogo}
					alt="Taxlator Logo"
					className="h-28 w-auto animate-pulse"
				/>

				<p className="mt-6 text-slate-500 text-sm">
					Preparing your tax tools...
				</p>
			</div>
		);
	}

	return (
		<Shell>
			<AppRoutes />
		</Shell>
	);
}
// src/pages/otherPages/VerifyEmail.tsx

// ----------------------------------------------
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/useAuth";
import { api } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";

// ------------------------------------ Verify Email Page ------------------------------------
type VerifyState = { email?: string };
type ApiResponse = { success?: boolean; message?: string };

function isEmail(v: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function getErrorMessage(err: unknown) {
	return err instanceof Error
		? err.message
		: "Network error. Please try again.";
}

export default function VerifyEmail() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as VerifyState) || {};

	const auth = useAuth();

	const [email, setEmail] = useState(state.email || "");
	const [resending, setResending] = useState(false);
	const [cooldown, setCooldown] = useState(0);
	const [error, setError] = useState("");
	const [info, setInfo] = useState("");

	// Redirect immediately if user is already signed in
	useEffect(() => {
		if (auth.user) navigate("/calculate", { replace: true });
	}, [auth.user, navigate]);

	// Cooldown timer for resending
	useEffect(() => {
		if (!cooldown) return;
		const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
		return () => clearInterval(t);
	}, [cooldown]);

	// ------------------------------ Resend confirmation link -----------------------------
	const resend = async () => {
		setError("");
		setInfo("");

		const normalizedEmail = email.trim().toLowerCase();
		if (!isEmail(normalizedEmail)) {
			setError("Enter a valid email address.");
			return;
		}
		if (cooldown > 0) return;

		setResending(true);
		try {
			const { data } = await api.post<ApiResponse>(
				ENDPOINTS.sendVerificationLink,
				{
					email: normalizedEmail,
				},
			);

			if (!data.success) {
				setError(data.message || "Could not resend confirmation link.");
				return;
			}

			setInfo(data.message || "A new confirmation link has been sent to your email.");
			setCooldown(60);
		} catch (e: unknown) {
			setError(getErrorMessage(e));
		} finally {
			setResending(false);
		}
	};

	// ------------------------------ JSX -----------------------------
	return (
		<div className="bg-slate-200 min-h-[80vh] flex items-center justify-center px-4 py-10">
			<div className="w-full max-w-md bg-white rounded-2xl border shadow-soft overflow-hidden">
				<div className="p-6 border-b text-center">
					<div className="w-12 h-12 mx-auto rounded bg-brand-700 text-white grid place-items-center font-bold">
						T
					</div>
					<div className="mt-3 text-lg font-semibold">Check your email</div>
					<div className="text-xs text-slate-600">
						We&apos;ve sent a verification link to your email address.
						Click the Confirm My Email button in the email to activate your Taxlator account.
					</div>
				</div>

				<div className="p-6">
					{error && (
						<div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
							{error}
						</div>
					)}
					{info && (
						<div className="mb-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded p-2">
							{info}
						</div>
					)}

					<label className="text-xs font-semibold text-slate-700">Email</label>
					<input
						className="mt-1 w-full rounded border px-3 py-2 text-sm"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setError("");
							setInfo("");
						}}
						placeholder="Enter your email"
						required
					/>

					<button
						type="button"
						onClick={resend}
						disabled={resending || cooldown > 0}
						className="mt-5 w-full rounded bg-brand-800 text-white py-2.5 text-sm font-semibold hover:bg-brand-900 disabled:opacity-60"
					>
						{resending
							? "Sending..."
							: cooldown > 0
								? `Resend confirmation link (${cooldown}s)`
								: "Resend confirmation link"}
					</button>

					{/* ------------------- SMALL INPRINT MESSAGE AT THE BOTTOM------------------- */}
					<div className="mt-2 text-xs text-slate-600 text-center">
						Wrong email?{" "}
						<Link
							className="text-brand-800 font-semibold hover:text-brand-900"
							to="/signup"
						>
							Go back to sign up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

// src/pages/otherPages/verifyEmail.tsx

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/useAuth";

type VerifyState = {
	email?: string;
};

type ApiResponse = {
	success?: boolean;
	message?: string;
};

function isEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getErrorMessage(error: unknown) {
	if (error instanceof Error) {
		return error.message;
	}

	return "Network error. Please try again.";
}

export default function VerifyEmail() {
	const navigate = useNavigate();
	const location = useLocation();
	const auth = useAuth();

	const state = (location.state as VerifyState | null) ?? null;

	const [email, setEmail] = useState(state?.email ?? "");
	const [resending, setResending] = useState(false);
	const [cooldown, setCooldown] = useState(0);
	const [error, setError] = useState("");
	const [info, setInfo] = useState("");

	// If the account is already authenticated, take the user into Taxlator.
	useEffect(() => {
		if (auth.user) {
			navigate("/calculate", { replace: true });
		}
	}, [auth.user, navigate]);

	// Countdown used to prevent repeated verification emails.
	useEffect(() => {
		if (cooldown <= 0) {
			return;
		}

		const timer = window.setInterval(() => {
			setCooldown((current) => Math.max(current - 1, 0));
		}, 1000);

		return () => window.clearInterval(timer);
	}, [cooldown]);

	const resendVerificationEmail = async () => {
		setError("");
		setInfo("");

		const normalizedEmail = email.trim().toLowerCase();

		if (!isEmail(normalizedEmail)) {
			setError("Enter a valid email address.");
			return;
		}

		if (cooldown > 0 || resending) {
			return;
		}

		setResending(true);

		try {
			/*
			 * The backend still exposes /api/auth/send-code.
			 * Despite the old endpoint name, the current backend sends
			 * a clickable confirmation LINK, not a 6-digit code.
			 */
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/api/auth/send-code`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						email: normalizedEmail,
						redirectUrl: `${window.location.origin}/calculate`,
					}),
				},
			);

			const data = (await response.json().catch(() => ({}))) as ApiResponse;

			if (!response.ok || !data.success) {
				throw new Error(
					data.message || "Could not resend the verification email.",
				);
			}

			setInfo(
				data.message ||
					"A new verification link has been sent to your email.",
			);

			setCooldown(60);
		} catch (error: unknown) {
			setError(getErrorMessage(error));
		} finally {
			setResending(false);
		}
	};

	return (
		<div className="bg-slate-200 min-h-[80vh] flex items-center justify-center px-4 py-10">
			<div className="w-full max-w-md bg-white rounded-2xl border shadow-soft overflow-hidden">
				{/* Header */}
				<div className="p-6 border-b text-center">
					<div className="w-14 h-14 mx-auto rounded-xl bg-brand-700 text-white grid place-items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							className="w-7 h-7"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9Z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m4 7 8 6 8-6"
							/>
						</svg>
					</div>

					<div className="mt-4 text-xl font-semibold text-slate-900">
						Check your email
					</div>

					<div className="mt-2 text-sm text-slate-600 leading-6">
						We&apos;ve sent a verification link to your email address.
						Click the link in the email to activate your Taxlator
						account.
					</div>
				</div>

				<form
					className="p-6"
					onSubmit={(event) => {
						event.preventDefault();
						resendVerificationEmail();
					}}
				>
					{/* Error */}
					{error && (
						<div
							className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3"
							role="alert"
						>
							{error}
						</div>
					)}

					{/* Success / information */}
					{info && (
						<div
							className="mb-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-3"
							role="status"
						>
							{info}
						</div>
					)}

					{/* Email */}
					<label
						htmlFor="verification-email"
						className="text-xs font-semibold text-slate-700"
					>
						Email Address
					</label>

					<input
						id="verification-email"
						type="email"
						className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200"
						value={email}
						onChange={(event) => {
							setEmail(event.target.value);
							setError("");
							setInfo("");
						}}
						placeholder="Enter your email"
						autoComplete="email"
						required
					/>

					{/* Instructions */}
					<div className="mt-5 rounded-lg bg-slate-50 border border-slate-200 p-4">
						<div className="text-sm font-semibold text-slate-800">
							What to do next
						</div>

						<ol className="mt-2 space-y-2 text-xs text-slate-600">
							<li>
								<span className="font-semibold text-slate-800">1.</span>{" "}
								Open your email inbox.
							</li>
							<li>
								<span className="font-semibold text-slate-800">2.</span>{" "}
								Find the email from Taxlator.
							</li>
							<li>
								<span className="font-semibold text-slate-800">3.</span>{" "}
								Click <strong>Confirm My Email</strong>.
							</li>
							<li>
								<span className="font-semibold text-slate-800">4.</span>{" "}
								You&apos;ll be redirected back to Taxlator.
							</li>
						</ol>
					</div>

					{/* Resend */}
					<button
						type="submit"
						disabled={resending || cooldown > 0}
						className="mt-5 w-full rounded-lg bg-brand-800 text-white py-2.5 text-sm font-semibold hover:bg-brand-900 disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{resending
							? "Sending verification link..."
							: cooldown > 0
								? `Resend verification link (${cooldown}s)`
								: "Resend verification link"}
					</button>

					{/* Spam folder note */}
					<p className="mt-4 text-xs text-slate-500 text-center leading-5">
						Can&apos;t find the email? Check your spam or junk folder.
					</p>

					{/* Back to signup */}
					<div className="mt-4 text-xs text-slate-600 text-center">
						Wrong email?{" "}
						<Link
							className="text-brand-800 font-semibold hover:text-brand-900"
							to="/signup"
						>
							Go back to sign up
						</Link>
					</div>

					{/* Sign in */}
					<div className="mt-2 text-xs text-slate-600 text-center">
						Already verified?{" "}
						<Link
							className="text-brand-800 font-semibold hover:text-brand-900"
							to="/signin"
						>
							Sign in
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
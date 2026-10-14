// src/pages/otherPages/ForgotPassword.tsx
//
// Web password reset (2 steps):
//   1) POST /api/auth/forgot-password      { email }                     -> emails a 6-digit OTP
//   2) POST /api/auth/reset-password-otp   { email, otp, newPassword }   -> sets the new password
//
// NOTE: do NOT send the "x-client-type: mobile" header here, otherwise the
// backend sends the mobile token link instead of the OTP.

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { api } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import { getErrorMessage } from "../../api/getErrorMessage";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

function isEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ForgotPassword() {
	const navigate = useNavigate();

	const [step, setStep] = useState<"request" | "reset">("request");
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [busy, setBusy] = useState(false);
	const [cooldown, setCooldown] = useState(0);
	const [error, setError] = useState("");
	const [info, setInfo] = useState("");

	useEffect(() => {
		if (cooldown <= 0) return;
		const timer = window.setInterval(() => {
			setCooldown((c) => Math.max(c - 1, 0));
		}, 1000);
		return () => window.clearInterval(timer);
	}, [cooldown]);

	const normalizedEmail = email.trim().toLowerCase();

	// ---------------- Step 1: request the OTP ----------------
	const requestCode = async () => {
		setError("");
		setInfo("");

		if (!isEmail(normalizedEmail)) {
			setError("Enter a valid email address.");
			return;
		}

		if (busy || cooldown > 0) return;

		setBusy(true);
		try {
			const { data } = await api.post(ENDPOINTS.forgotPassword, {
				email: normalizedEmail,
			});

			// The backend replies 200 even if the account does not exist.
			setInfo(
				data?.message ||
					"If an account exists for this email, a reset code has been sent.",
			);
			setStep("reset");
			setCooldown(RESEND_COOLDOWN_SECONDS);
		} catch (err: unknown) {
			setError(getErrorMessage(err, "Could not send the reset code."));
		} finally {
			setBusy(false);
		}
	};

	// ---------------- Step 2: reset the password ----------------
	const resetPassword = async () => {
		setError("");
		setInfo("");

		if (otp.length !== OTP_LENGTH) {
			setError(`Enter the ${OTP_LENGTH}-digit code from your email.`);
			return;
		}
		if (newPassword.length < 8) {
			setError("Password must be at least 8 characters.");
			return;
		}
		if (newPassword !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setBusy(true);
		try {
			await api.post(ENDPOINTS.resetPasswordOtp, {
				email: normalizedEmail,
				otp,
				newPassword,
			});

			navigate("/signin", {
				replace: true,
				state: { email: normalizedEmail },
			});
		} catch (err: unknown) {
			// 400 = invalid/expired OTP, 429 = too many incorrect attempts
			setError(getErrorMessage(err, "Could not reset your password."));
		} finally {
			setBusy(false);
		}
	};

	const inputClass =
		"mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200";

	return (
		<div className="bg-slate-200 min-h-[80vh] flex items-center justify-center px-4 py-10">
			<div className="w-full max-w-md bg-white rounded-2xl border shadow-soft overflow-hidden">
				<div className="p-6 border-b text-center">
					<div className="text-xl font-semibold text-slate-900">
						{step === "request" ? "Forgot password?" : "Reset your password"}
					</div>
					<div className="mt-2 text-sm text-slate-600 leading-6">
						{step === "request"
							? "Enter your email and we'll send you a 6-digit reset code."
							: "Enter the 6-digit code we emailed you and choose a new password."}
					</div>
				</div>

				<form
					className="p-6"
					onSubmit={(e) => {
						e.preventDefault();
						if (step === "request") requestCode();
						else resetPassword();
					}}
				>
					{error && (
						<div
							className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3"
							role="alert"
						>
							{error}
						</div>
					)}
					{info && (
						<div
							className="mb-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-3"
							role="status"
						>
							{info}
						</div>
					)}

					<label
						htmlFor="reset-email"
						className="text-xs font-semibold text-slate-700"
					>
						Email Address
					</label>
					<input
						id="reset-email"
						type="email"
						className={inputClass}
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setError("");
						}}
						placeholder="Enter your email"
						autoComplete="email"
						disabled={step === "reset"}
						required
					/>

					{step === "reset" && (
						<>
							<label
								htmlFor="reset-otp"
								className="mt-4 block text-xs font-semibold text-slate-700"
							>
								Reset Code
							</label>
							<input
								id="reset-otp"
								type="text"
								inputMode="numeric"
								autoComplete="one-time-code"
								maxLength={OTP_LENGTH}
								className={`${inputClass} tracking-[0.5em] text-center text-lg font-semibold`}
								value={otp}
								onChange={(e) => {
									setOtp(e.target.value.replace(/\D/g, ""));
									setError("");
								}}
								placeholder="------"
								required
							/>

							<label
								htmlFor="reset-new-password"
								className="mt-4 block text-xs font-semibold text-slate-700"
							>
								New Password
							</label>
							<div className="relative">
								<input
									id="reset-new-password"
									type={showPassword ? "text" : "password"}
									className={inputClass}
									value={newPassword}
									onChange={(e) => {
										setNewPassword(e.target.value);
										setError("");
									}}
									placeholder="At least 8 characters"
									autoComplete="new-password"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword((p) => !p)}
									className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
									aria-label={
										showPassword ? "Hide password" : "Show password"
									}
								>
									{showPassword ? (
										<Eye className="h-4" />
									) : (
										<EyeOff className="h-4 text-blue-600" />
									)}
								</button>
							</div>

							<label
								htmlFor="reset-confirm-password"
								className="mt-4 block text-xs font-semibold text-slate-700"
							>
								Confirm New Password
							</label>
							<input
								id="reset-confirm-password"
								type={showPassword ? "text" : "password"}
								className={inputClass}
								value={confirmPassword}
								onChange={(e) => {
									setConfirmPassword(e.target.value);
									setError("");
								}}
								placeholder="Re-enter your new password"
								autoComplete="new-password"
								required
							/>
						</>
					)}

					<button
						type="submit"
						disabled={busy}
						className="mt-6 w-full rounded-lg bg-brand-800 text-white py-2.5 text-sm font-semibold hover:bg-brand-900 disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{step === "request"
							? busy
								? "Sending code..."
								: "Send reset code"
							: busy
								? "Resetting..."
								: "Reset password"}
					</button>

					{step === "reset" && (
						<button
							type="button"
							onClick={requestCode}
							disabled={busy || cooldown > 0}
							className="mt-3 w-full rounded-lg border py-2.5 text-sm font-semibold text-brand-800 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
						>
							{cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
						</button>
					)}

					<div className="mt-4 text-xs text-slate-600 text-center">
						Remembered it?{" "}
						<Link
							className="text-brand-800 font-semibold hover:text-brand-900"
							to="/signin"
						>
							Back to sign in
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
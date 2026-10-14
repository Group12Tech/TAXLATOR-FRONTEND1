// src/pages/otherPages/verifyEmail.tsx

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/useAuth";
import { getErrorMessage } from "../../api/getErrorMessage";

type VerifyState = {
	email?: string;
};

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

function isEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function VerifyEmail() {
	const navigate = useNavigate();
	const location = useLocation();
	const auth = useAuth();

	const state = (location.state as VerifyState | null) ?? null;

	const [email, setEmail] = useState(state?.email ?? "");
	const [digits, setDigits] = useState<string[]>(
		Array(CODE_LENGTH).fill(""),
	);
	const [verifying, setVerifying] = useState(false);
	const [resending, setResending] = useState(false);
	const [cooldown, setCooldown] = useState(0);
	const [error, setError] = useState("");
	const [info, setInfo] = useState("");

	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

	const code = digits.join("");

	// Already signed in -> go straight into the app.
	useEffect(() => {
		if (auth.user) {
			navigate("/calculate", { replace: true });
		}
	}, [auth.user, navigate]);

	// Resend cooldown timer.
	useEffect(() => {
		if (cooldown <= 0) return;

		const timer = window.setInterval(() => {
			setCooldown((current) => Math.max(current - 1, 0));
		}, 1000);

		return () => window.clearInterval(timer);
	}, [cooldown]);

	const handleDigitChange = (index: number, value: string) => {
		setError("");
		const cleaned = value.replace(/\D/g, "");

		// Handles typing, autofill and pasting several digits into one box.
		if (cleaned.length > 1) {
			const next = [...digits];
			cleaned
				.slice(0, CODE_LENGTH - index)
				.split("")
				.forEach((char, i) => {
					next[index + i] = char;
				});
			setDigits(next);
			const focusIndex = Math.min(index + cleaned.length, CODE_LENGTH - 1);
			inputRefs.current[focusIndex]?.focus();
			return;
		}

		const next = [...digits];
		next[index] = cleaned;
		setDigits(next);

		if (cleaned && index < CODE_LENGTH - 1) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (
		index: number,
		event: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (event.key === "Backspace" && !digits[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const verifyCode = async () => {
		setError("");
		setInfo("");

		const normalizedEmail = email.trim().toLowerCase();

		if (!isEmail(normalizedEmail)) {
			setError("Enter a valid email address.");
			return;
		}

		if (code.length !== CODE_LENGTH) {
			setError(`Enter the ${CODE_LENGTH}-digit code from your email.`);
			return;
		}

		setVerifying(true);

		try {
			await auth.verifyEmail({ email: normalizedEmail, otp: code });
			// Verified AND logged in (JWT cookie set) -> go into the app.
			navigate("/calculate", { replace: true });
		} catch (err: unknown) {
			setError(getErrorMessage(err, "Invalid or expired code."));
		} finally {
			setVerifying(false);
		}
	};

	const resendCode = async () => {
		setError("");
		setInfo("");

		const normalizedEmail = email.trim().toLowerCase();

		if (!isEmail(normalizedEmail)) {
			setError("Enter a valid email address.");
			return;
		}

		if (cooldown > 0 || resending) return;

		setResending(true);

		try {
			const data = (await auth.resendOtp({
				email: normalizedEmail,
			})) as { message?: string } | null;

			setInfo(data?.message || "A new code has been sent to your email.");
			setDigits(Array(CODE_LENGTH).fill(""));
			inputRefs.current[0]?.focus();
			setCooldown(RESEND_COOLDOWN_SECONDS);
		} catch (err: unknown) {
			setError(getErrorMessage(err, "Could not resend the code."));
		} finally {
			setResending(false);
		}
	};

	return (
		<div className="bg-slate-200 min-h-[80vh] flex items-center justify-center px-4 py-10">
			<div className="w-full max-w-md bg-white rounded-2xl border shadow-soft overflow-hidden">
				{/* Header */}
				<div className="p-6 border-b text-center">
					<div className="text-xl font-semibold text-slate-900">
						Verify your email
					</div>
					<div className="mt-2 text-sm text-slate-600 leading-6">
						We sent a {CODE_LENGTH}-digit code to your email address.
						Enter it below to activate your Taxlator account. The code
						expires in 10 minutes.
					</div>
				</div>

				<form
					className="p-6"
					onSubmit={(event) => {
						event.preventDefault();
						verifyCode();
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

					{/* OTP boxes */}
					<label className="mt-5 block text-xs font-semibold text-slate-700">
						Verification Code
					</label>
					<div className="mt-2 flex justify-between gap-1.5 sm:gap-2">
						{digits.map((digit, index) => (
							<input
								key={index}
								ref={(el) => {
									inputRefs.current[index] = el;
								}}
								type="text"
								inputMode="numeric"
								autoComplete={index === 0 ? "one-time-code" : "off"}
								maxLength={CODE_LENGTH}
								value={digit}
								onChange={(e) => handleDigitChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								onFocus={(e) => e.target.select()}
								aria-label={`Digit ${index + 1}`}
								className="min-w-0 flex-1 max-w-12 h-12 text-center text-lg font-semibold rounded-lg border outline-none focus:ring-2 focus:ring-brand-200"
							/>
						))}
					</div>

					<button
						type="submit"
						disabled={verifying || code.length !== CODE_LENGTH}
						className="mt-6 w-full rounded-lg bg-brand-800 text-white py-2.5 text-sm font-semibold hover:bg-brand-900 disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{verifying ? "Verifying..." : "Verify email"}
					</button>

					<button
						type="button"
						onClick={resendCode}
						disabled={resending || cooldown > 0}
						className="mt-3 w-full rounded-lg border py-2.5 text-sm font-semibold text-brand-800 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{resending
							? "Sending code..."
							: cooldown > 0
								? `Resend code (${cooldown}s)`
								: "Resend code"}
					</button>

					<p className="mt-4 text-xs text-slate-500 text-center leading-5">
						Can&apos;t find the email? Check your spam or junk folder.
					</p>

					<div className="mt-4 text-xs text-slate-600 text-center">
						Wrong email?{" "}
						<Link
							className="text-brand-800 font-semibold hover:text-brand-900"
							to="/signup"
						>
							Go back to sign up
						</Link>
					</div>

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
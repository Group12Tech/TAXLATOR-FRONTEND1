// src/pages/otherPages/verifyEmail.tsx

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";

type VerifyState = { email?: string };
type ApiResponse = { success?: boolean; message?: string };

function isEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getErrorMessage(error: unknown) {
	return error instanceof Error
		? error.message
		: "Network error. Please try again.";
}

/**
 * Email verification is link-based.
 *
 * The backend sends the actual confirmation link and verifies the token when
 * the user clicks that link. This page only tells the user to check their
 * inbox and provides a way to resend the link.
 */
export default function VerifyEmail() {
	const location = useLocation();
	const state = (location.state as VerifyState) || {};

	const [email, setEmail] = useState(state.email || "");
	const [resending, setResending] = useState(false);
	const [cooldown, setCooldown] = useState(0);
	const [error, setError] = useState("");
	const [info, setInfo] = useState("");

	useEffect(() => {
		if (!cooldown) return;

		const timer = window.setInterval(() => {
			setCooldown((seconds) => (seconds > 0 ? seconds - 1 : 0));
		}, 1000);

		return () => window.clearInterval(timer);
	}, [cooldown]);

	const resendVerificationLink = async () => {
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
			const { data } = await api.post<ApiResponse>(
				ENDPOINTS.sendVerificationLink,
				{
					email: normalizedEmail,
					// Tell the backend where to send the user after the link is used.
					redirectUrl: `${window.location.origin}/calculate`,
				},
			);

			if (!data.success) {
				setError(data.message || "Could not resend the confirmation link.");
				return;
			}

			setInfo(
				data.message ||
					"A new confirmation link has been sent to your email.",
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
				<div className="p-6 border-b text-center">
					<div className="w-12 h-12 mx-auto rounded bg-brand-700 text-white grid place-items-center font-bold">
						T
					</div>

					<div className="mt-4 text-lg font-semibold text-slate-900">
						Check your email
					</div>

					<div className="mt-2 text-sm text-slate-600 leading-6">
						We&apos;ve sent a verification link to your email address.
						Click the <strong>Confirm My Email</strong> button in the email to
						activate your Taxlator account.
					</div>
				</div>

				<div className="p-6">
					{error && (
						<div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
							{error}
						</div>
					)}

					{info && (
						<div className="mb-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded p-3">
							{info}
						</div>
					)}

					<label className="text-xs font-semibold text-slate-700">
						Email address
					</label>

					<input
						className="mt-1 w-full rounded border px-3 py-2.5 text-sm"
						value={email}
						onChange={(event) => {
							setEmail(event.target.value);
							setError("");
							setInfo("");
						}}
						placeholder="Enter your email"
						type="email"
						autoComplete="email"
						required
					/>

					<button
						type="button"
						onClick={resendVerificationLink}
						disabled={resending || cooldown > 0}
						className="mt-5 w-full rounded bg-brand-800 text-white py-2.5 text-sm font-semibold hover:bg-brand-900 disabled:opacity-60"
					>
						{resending
							? "Sending link..."
							: cooldown > 0
								? `Resend link (${cooldown}s)`
								: "Resend confirmation link"}
					</button>

					<div className="mt-4 text-xs text-slate-500 text-center leading-5">
						Didn&apos;t receive the email? Check your spam or junk folder, then
						try resending the link.
					</div>

					<div className="mt-4 text-xs text-slate-600 text-center">
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

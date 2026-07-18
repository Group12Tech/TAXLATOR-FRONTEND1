// src/pages/otherPages/SignUp.tsx

// ----------------------------------------------
// SignUp page component: handles user registration, password validation, and redirects to email verification.
// ----------------------------------------------
import TaxlatorLogo from "../../assets/images/TAX_LOGOs.png";
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../state/useAuth";
import { AxiosError } from "axios";
import MotionButton from "../../components/ui/buttons/MotionButton";
import inputStyles from "../../components/ui/inputs/InputStyles";
import FormButton from "../../components/ui/buttons/FormButton";
import PasswordHelper from "../../components/ui/inputs/PasswordHelper";
import { Eye, EyeOff } from "lucide-react";

// -------------------------------- SIGN UP COMPONENT --------------------------------
export default function SignUp() {
	const { signup } = useAuth(); 
	const navigate = useNavigate();
	const location = useLocation();

	// ------------------ Form state ------------------
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState(
		(location.state as { email?: string })?.email ?? "",
	);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [agree, setAgree] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [passwordFocused, setPasswordFocused] = useState(false);

	// ------------------ Form validation ------------------
	const hasNames = fullName.trim().length > 0;
	const hasValidPassword = password.length >= 8 && password === confirmPassword;
	const isFormValid =
		hasNames && email.trim().length > 0 && hasValidPassword && agree && !busy;

	// ------------------ Form submission ------------------
	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log("🔥 Form Submitted");
		setError("");

		if (!fullName.trim()) {
    setError("Full name is required.");
    return;
}

if (!email.trim()) {
    setError("Email is required.");
    return;
}

if (password.length < 8) {
    setError("Password must be at least 8 characters.");
    return;
}
if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
}
		if (!agree) {
			setError("You must agree to the Terms and Privacy Policy");
			return;
		}

		setBusy(true);
		try {
			// ✅ Signup via AuthProvider
			await signup({ fullName, email, password, confirmPassword });

			// ✅ Redirect to email verification page with pre-filled email
			navigate("/verify-email", { state: { email } });
		} catch (err: unknown) {
			if (err instanceof AxiosError) {
				const message =
    err.response?.data?.message ||
    err.response?.data?.error ||
    "Signup failed";

setError(message);
			} else if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Signup failed");
			}
		} finally {
			setBusy(false);
		}
	};

console.log({
    fullName,
    email,
    password,
    confirmPassword,
    agree,
    hasValidPassword,
    isFormValid,
    busy,
});
	// ------------------ JSX ------------------
	return (
		<div className="bg-slate-200 min-h-[80vh] w-full flex items-center justify-center px-4 py-10">
			<div className="w-full max-w-md bg-white rounded-2xl border shadow-soft overflow-hidden">
				<div className="p-6 text-center">
					<img
    src={TaxlatorLogo}
    alt="Taxlator Logo"
    className="h-11 w-auto"
/>
					<div className="mt-3 text-lg font-semibold">Sign Up</div>
					<div className="text-xs text-slate-500">
						Create your free Taxlator account
					</div>
				</div>

				<form className="p-5 overflow-x-hidden" onSubmit={onSubmit}>
					{/* Error message */}
					{error && (
						<div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
							{error}
						</div>
					)}

					{/* First & Last Name */}
					<label className="text-xs font-semibold text-slate-700 mb-1 block">
						Full Name
					</label>
					<input
						className={inputStyles.inputBase}
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						placeholder="Enter your first name"
						required
					/>

					{/* Email */}
					<label className="text-xs font-semibold text-slate-700 mt-4 mb-1 block">
						Email Address
					</label>
					<input
						type="email"
						className={inputStyles.inputBase}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your email address"
						required
					/>

					{/* Password */}
					<label className="text-xs font-semibold text-slate-700 mt-4 mb-1 block">
						Password
					</label>
					<div className="relative mt-1">
						<input
							type={showPassword ? "text" : "password"}
							className={inputStyles.inputBase}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onFocus={() => setPasswordFocused(true)}
							onBlur={() => setPasswordFocused(false)}
							placeholder="Enter your password"
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword((p) => !p)}
							className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
						>
							{
							  showPassword ? 
							  <Eye />
							   : 
							  <EyeOff className="h-4 text-blue-600"/>
							}
						</button>
					</div>
					<PasswordHelper visible={passwordFocused} />

					{/* Confirm Password */}
					<label className="text-xs font-semibold text-slate-700 mt-4 mb-1 block">
						Confirm Password
					</label>
					<div className="relative mt-1">
						<input
							type={showConfirmPassword ? "text" : "password"}
							className={inputStyles.inputBase}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="Confirm your password"
							required
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword((p) => !p)}
							className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
						>
							{
								showPassword ? 
								<Eye />
								   : 
								<EyeOff className="h-4 text-blue-600"/>
							}
						</button>
					</div>

					{/* Terms & Privacy */}
					<div className="mt-2 flex items-start gap-2 text-xs">
						<input
							type="checkbox"
							checked={agree}
							onChange={(e) => setAgree(e.target.checked)}
							className="mt-0.5 h-3.5 w-3.5"
						/>
						<p className="text-slate-500 text-center leading-relaxed">
							By clicking, you agree to our{" "}
							<Link
								to="/Terms_Conditions"
								className="text-brand-400 hover:text-black font-medium"
							>
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link
								to="/Privacy_Policy"
								className="text-brand-400 hover:text-black font-medium"
							>
								Privacy Policy
							</Link>
						</p>
					</div>

					{/* Submit button */}
					<MotionButton className="mt-7 w-full">
						<FormButton enabled={true} loading={busy}>
							{busy ? "Creating..." : "Sign Up"}
						</FormButton>
					</MotionButton>

					{/* Sign in link */}
					<div className="mt-4 text-xs text-slate-600 text-center">
						Already have an account?{" "}
						<Link to="/signin" className="text-brand-800 font-semibold">
							Sign in
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

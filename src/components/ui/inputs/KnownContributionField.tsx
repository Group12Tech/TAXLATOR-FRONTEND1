// ====================================
// src/components/ui/inputs/KnownContributionField.tsx
// ====================================

// ====================================
import clsx from "clsx";
import CurrencyInput from "./CurrencyInput";
// ====================================

// ==================================== TYPES ====================================
type KnownContributionFieldProps = {
	/** Field label, e.g. "Pension Contribution" */
	label: string;
	/** Text shown when the user selects "No", e.g. "Default: 8% of gross income" */
	defaultLabel: string;
	/** Whether the user knows their exact contribution amount */
	known: boolean;
	onKnownChange: (known: boolean) => void;
	/** Raw (unformatted) amount string, only used when known === true */
	amount: string;
	onAmountChange: (value: string) => void;
	/** Formats the raw amount string for display, e.g. adds thousands separators */
	formatAmount: (value: string) => string;
	/** Strips non-numeric characters from user input */
	sanitizeAmount: (value: string) => string;
};

// ==================================== COMPONENT ====================================
export default function KnownContributionField({
	label,
	defaultLabel,
	known,
	onKnownChange,
	amount,
	onAmountChange,
	formatAmount,
	sanitizeAmount,
}: KnownContributionFieldProps) {
	return (
		<div className="mt-3 rounded-lg border border-brand-200 p-4">
			<div className="text-xs font-medium text-slate-600">{label}</div>
			<div className="mt-1 text-xs text-slate-500">
				Do you know your {label.toLowerCase()}?
			</div>

			{/* ======================= Yes / No toggle =======================  */}
			<div className="mt-2 flex gap-2">
				<button
					type="button"
					onClick={() => onKnownChange(true)}
					aria-pressed={known}
					className={clsx(
						"rounded px-4 py-1.5 text-xs font-semibold border transition-colors",
						known
							? "bg-brand-800 text-white border-brand-800"
							: "bg-white text-slate-600 border-slate-300 hover:bg-slate-50",
					)}
				>
					Yes
				</button>
				<button
					type="button"
					onClick={() => onKnownChange(false)}
					aria-pressed={!known}
					className={clsx(
						"rounded px-4 py-1.5 text-xs font-semibold border transition-colors",
						!known
							? "bg-brand-800 text-white border-brand-800"
							: "bg-white text-slate-600 border-slate-300 hover:bg-slate-50",
					)}
				>
					No
				</button>
			</div>

			{/* ======================= Conditional content =======================  */}
			{known ? (
				<CurrencyInput
					id={`${label.replace(/\s+/g, "-").toLowerCase()}-amount`}
					label={`${label} Amount`}
					value={formatAmount(amount)}
					onChange={(v) => onAmountChange(sanitizeAmount(v))}
					containerClassName="mt-3"
				/>
			) : (
				<div className="mt-2 text-xs text-slate-500">{defaultLabel}</div>
			)}
		</div>
	);
}
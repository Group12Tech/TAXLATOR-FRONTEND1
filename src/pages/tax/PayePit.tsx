// ====================================
// src/pages/tax/PayePit.tsx
// ====================================

// ====================================
import { useMemo, useState } from "react";
import TaxPageLayout from "../../pages/tax/TaxPageLayout";
import { api } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import { useHistory } from "../../hooks/useHistory";
import { useAuth } from "../../state/useAuth";
import PayePitResultPanel from "./PayePitResultPanel";
import CalculateButton from "../../components/ui/buttons/CalculateButton";
import CurrencyInput from "../../components/ui/inputs/CurrencyInput";
import KnownContributionField from "../../components/ui/inputs/KnownContributionField";
import {
	parseNumber,
	formatNumber,
	onlyNumbers,
} from "../../utils/numberInput";
import type { ApiResponse } from "../../api/api.types";
import type { PayePitResponse } from "../../types/tax/payePit.types";
import { getErrorMessage } from "../../api/getErrorMessage";
import { isPayePitCalculationValid } from "../../utils/calculateButtonValidation";

// ====================================

// ==================================== PAYE/PIT UI PAGE =================================
export default function PayePit() {
	const { authenticated } = useAuth();
	const { addHistory } = useHistory();

	// ==================================== Form state
	const [grossAnnualIncome, setGrossAnnualIncome] = useState("");

	// Pension, NHIS, NHF each follow the same pattern:
	// "known" = user knows their actual contribution amount.
	// If known, the *Amount field is used; otherwise the statutory
	// default percentage (8% / 5% / 2.5%) is applied by the backend.
	const [pensionKnown, setPensionKnown] = useState(false);
	const [pensionAmount, setPensionAmount] = useState("");

	const [nhisKnown, setNhisKnown] = useState(false);
	const [nhisAmount, setNhisAmount] = useState("");

	const [nhfKnown, setNhfKnown] = useState(false);
	const [nhfAmount, setNhfAmount] = useState("");

	const [annualRent, setAnnualRent] = useState("");
	const [otherDeductions, setOtherDeductions] = useState("");

	// ==================================== Request state
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [result, setResult] = useState<PayePitResponse | null>(null);

	// ==================================== Derived numbers
	const grossAnnualIncomeNumber = useMemo(
		() => parseNumber(grossAnnualIncome),
		[grossAnnualIncome],
	);

	const rentNumber = useMemo(() => Math.min(parseNumber(annualRent), 500_000), [annualRent]);

	const otherDeductionsNumber = useMemo(
		() => parseNumber(otherDeductions),
		[otherDeductions],
	);

	const pensionAmountNumber = useMemo(
		() => parseNumber(pensionAmount),
		[pensionAmount],
	);
	const nhisAmountNumber = useMemo(() => parseNumber(nhisAmount), [nhisAmount]);
	const nhfAmountNumber = useMemo(() => parseNumber(nhfAmount), [nhfAmount]);

	// ==================================== Calculation
	async function calculate() {
		setError("");

		if (grossAnnualIncomeNumber <= 0) {
			setError("Gross annual income must be greater than 0");
			return;
		}

		setBusy(true);

		try {
			// ==================================== Payload construction
			// NOTE: field names for the *Amount values below are provisional —
			// confirm exact contract with backend before merging.
			const payload = {
				taxType: "PAYE/PIT",
				grossAnnualIncome: grossAnnualIncomeNumber,

				// Pension: send the actual amount if known, otherwise fall back
				// to the statutory default (8%) on the backend.
				payePitPensionContribution: !pensionKnown,
				pensionContributionAmount: pensionKnown
					? pensionAmountNumber
					: undefined,

				// NHIS: send the actual amount if known, otherwise fall back
				// to the statutory default (5%) on the backend.
				nationalHealthInsuranceScheme: !nhisKnown,
				nhisContributionAmount: nhisKnown ? nhisAmountNumber : undefined,

				// NHF: send the actual amount if known, otherwise fall back
				// to the statutory default (2.5%) on the backend.
				nationalHousingFund: !nhfKnown,
				nhfContributionAmount: nhfKnown ? nhfAmountNumber : undefined,

				rentRelief: rentNumber,
				otherDeductions: otherDeductionsNumber,
			};

			// ==================================== API call
			const response = await api.post<ApiResponse<PayePitResponse>>(
				ENDPOINTS.taxCalculate("payePit"),
				payload,
			);

			if (!response.data.success) {
				setError(response.data.message || "Calculation failed");
				return;
			}

			const dto = response.data.data;

			setResult(dto);

			// ==================================== Authenticated user history logging
			if (authenticated) {
				await addHistory({
					type: "PAYE",
					input: payload,
					result: dto,
				});
			}
		} catch (err: unknown) {
			setError(getErrorMessage(err, "PAYE/PIT calculation failed"));
		} finally {
			setBusy(false);
		}
	}

	// ==================================== Render
	return (
		<TaxPageLayout
			title="PAYE / PIT Calculator"
			subtitle="Calculate your personal income tax based on Nigerian Tax Law (PITA)"
			rightPanel={
				result ? (
					<PayePitResultPanel
						backendResult={result}
						isAuthenticated={authenticated}
						prefillEmail=""
					/>
				) : null
			}
		>
			{error && (
				<div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
					{error}
				</div>
			)}

			{/* ======================= Gross Annual Income=======================  */}
			<CurrencyInput
				id="grossAnnualIncome"
				label={
					<span>
						Gross Annual Income <span className="text-red-500">*</span>
					</span>
				}
				value={formatNumber(grossAnnualIncome)}
				onChange={(v) => setGrossAnnualIncome(onlyNumbers(v))}
			/>

			{/* ======================= Pension Contribution =======================  */}
			<KnownContributionField
				label="Pension Contribution"
				defaultLabel="Default: 8% of gross income"
				known={pensionKnown}
				onKnownChange={setPensionKnown}
				amount={pensionAmount}
				onAmountChange={setPensionAmount}
				formatAmount={formatNumber}
				sanitizeAmount={onlyNumbers}
			/>

			{/* ======================= National Health Insurance Scheme =======================  */}
			<KnownContributionField
				label="National Health Insurance Scheme"
				defaultLabel="Default: 5% of gross income"
				known={nhisKnown}
				onKnownChange={setNhisKnown}
				amount={nhisAmount}
				onAmountChange={setNhisAmount}
				formatAmount={formatNumber}
				sanitizeAmount={onlyNumbers}
			/>

			{/* ======================= National Housing Fund =======================  */}
			<KnownContributionField
				label="National Housing Fund"
				defaultLabel="Default: 2.5% of gross income"
				known={nhfKnown}
				onKnownChange={setNhfKnown}
				amount={nhfAmount}
				onAmountChange={setNhfAmount}
				formatAmount={formatNumber}
				sanitizeAmount={onlyNumbers}
			/>

			{/* ======================= Rent relief =======================  */}
			<CurrencyInput
				id="rentRelief"
				label="Rent Relief (Maximum ₦500,000)"
				value={formatNumber(annualRent)}
				onChange={(v) => {
				const sanitized = onlyNumbers(v);
				const amount = parseNumber(sanitized);
				setAnnualRent(amount > 500_000 ? "500000" : sanitized);
			}}
				containerClassName="my-3"
			/>

			{/* ======================= Other deductions =======================  */}
			<CurrencyInput
				id="otherDeductions"
				label="Other Deductions"
				value={formatNumber(otherDeductions)}
				onChange={(v) => setOtherDeductions(onlyNumbers(v))}
			/>

			{/* ======================= Proceed/calculate button =======================  */}
			<CalculateButton
				onClick={calculate}
				loading={busy}
				enabled={isPayePitCalculationValid({
					grossAnnualIncomeNumber,
					busy,
				})}
			/>
		</TaxPageLayout>
	);
}
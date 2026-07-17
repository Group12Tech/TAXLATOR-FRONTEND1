
import { useState } from "react";
import { calculatePayePit } from "../../api/tax";
import { AxiosError } from "axios";
import { useAuth } from "../../state/useAuth";



export default function PayeCalculator() {
	const { user } = useAuth();
	const [grossAnnualIncome, setGrossAnnualIncome] =
		useState("");

	const [loading, setLoading] = useState(false);

	const [error, setError] = useState("");

	const [result, setResult] =
    useState<Record<string, unknown> | null>(null);

	const onCalculate = async () => {

    const income = Number(grossAnnualIncome);

    if (isNaN(income) || income <= 0) {
        setError("Please enter a valid annual income.");
        return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
		

        const response = await calculatePayePit(
            {
                grossAnnualIncome: income,
                payePitPensionContribution: true,
                nationalHealthInsuranceScheme: false,
                nationalHousingFund: false,
                rentRelief: 0,
                otherDeductions: 0,
            },
            !!user
        );

        console.log(response);

        setResult(response);

    } catch (err) {

        if (err instanceof AxiosError) {
            setError(
                err.response?.data?.message ??
                "Calculation failed"
            );
        } else {
            setError("Calculation failed");
        }

    } finally {
        setLoading(false);
    }
};
	return (
		<div className="min-h-screen bg-slate-100 p-6">
			<div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
				<h1 className="text-2xl font-bold mb-6">
					PAYE/PIT Calculator
				</h1>

				<input
					type="number"
					value={grossAnnualIncome}
					onChange={(e) =>
						setGrossAnnualIncome(e.target.value)
					}
					placeholder="Enter gross annual income"
					className="w-full border rounded px-4 py-3"
				/>

				<button
					onClick={onCalculate}
					disabled={loading}
					className="mt-4 bg-blue-600 text-white px-5 py-3 rounded"
				>
					{loading
						? "Calculating..."
						: "Calculate Tax"}
				</button>

				{error && (
					<div className="mt-4 text-red-600">
						{error}
					</div>
				)}

				{result && (
					<div className="mt-6 bg-slate-50 rounded p-4">
						<h2 className="font-semibold mb-3">
							Result
						</h2>

						<pre className="text-sm overflow-auto">
							{JSON.stringify(
								result,
								null,
								2,
							)}
						</pre>
					</div>
				)}
			</div>
		</div>
	);
}

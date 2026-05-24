import { api } from "./client";
import { ENDPOINTS } from "./endpoints";

export type PayePitPayload = {
	grossAnnualIncome: number;
	payePitPensionContribution: boolean;
	nationalHealthInsuranceScheme: boolean;
	nationalHousingFund: boolean;
	rentRelief: number;
	otherDeductions: number;
	notes?: string;
};

export async function calculatePayePit(
	payload: PayePitPayload,
) {
	const { data } = await api.post(
		ENDPOINTS.taxCalculatePrivate("payePit"),
		payload,
		{
			withCredentials: true,
		}
	);

	return data;
}
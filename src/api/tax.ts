import { api } from "./client";
import { ENDPOINTS } from "./endpoints";

export interface PayePitPayload {
    grossAnnualIncome: number;
    payePitPensionContribution: boolean;
    nationalHealthInsuranceScheme: boolean;
    nationalHousingFund: boolean;
    rentRelief: number;
    otherDeductions: number;
    notes?: string;
}

export async function calculateTax<T>(
    taxType: "payePit" | "cit" | "freelancer",
    payload: T,
    save = false
) {
    const endpoint = save
        ? ENDPOINTS.taxCalculatePrivate(taxType)
        : ENDPOINTS.taxCalculatePublic(taxType);

    const { data } = await api.post(endpoint, payload);

    return data;
}

export async function calculateVAT<T>(payload: T) {
    const { data } = await api.post(
        ENDPOINTS.vatCalculate,
        payload
    );

    return data;
}

export async function calculatePayePit(
    payload: PayePitPayload,
    save = false
) {
    const endpoint = save
        ? ENDPOINTS.taxCalculatePrivate("payePit")
        : ENDPOINTS.taxCalculatePublic("payePit");

    const { data } = await api.post(endpoint, payload);

    return data;
}

export type CitPayload = {
    annualTurnover: number;
    taxableProfit: number;
    notes?: string;
};

export async function calculateCit(
    payload: CitPayload,
    save = false
) {
    const endpoint = save
        ? ENDPOINTS.taxCalculatePrivate("cit")
        : ENDPOINTS.taxCalculatePublic("cit");

    const { data } = await api.post(endpoint, payload);

    return data;
}
// src/api/types/index.ts

// -----------------------------------------------------------

// ------------------------------ TYPES INDEX ------------------------------
import{apiClient} from "./client";
import {endpoints} from "./endpoints";

export const loginUser = async (data: {
    email: string;
    password: string;
}) => {
    const response = await apiClient.post(endpoints.login, data);
    return response.data;
};

export const calculateTax = async (data: any) => {
    const response = await apiClient.post(endpoints.calculateTax, data);
    return response.data;
};

export * from "./auth.types";
export * from "./api.types";

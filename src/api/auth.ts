// src/api/auth.ts

import { api } from "./client";

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const registerUser = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  const { data } = await api.post("/api/auth/signup", payload);
  return data;
};


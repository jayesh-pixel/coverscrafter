/**
 * Bank Name API Client
 * Uses Next.js API proxy routes
 */

import { apiRequest } from "./client";

export interface BankNamePayload {
  bankname: string;
}

export interface BankName {
  _id: string;
  bankname: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create a new bank name (Admin/Superadmin/RM Admin only)
 */
export async function createBankName(
  payload: BankNamePayload,
  authToken: string
): Promise<BankName> {
  return apiRequest<BankName, BankNamePayload>({
    path: "/v1/bankname",
    method: "POST",
    authToken,
    body: payload,
  });
}

/**
 * Get all bank names
 */
export async function getBankNames(authToken: string): Promise<BankName[]> {
  return apiRequest<BankName[]>({
    path: "/v1/bankname",
    method: "GET",
    authToken,
  });
}

/**
 * Get a single bank name by ID
 */
export async function getBankName(
  id: string,
  authToken: string
): Promise<BankName> {
  return apiRequest<BankName>({
    path: `/v1/bankname/${id}`,
    method: "GET",
    authToken,
  });
}

/**
 * Update a bank name by ID (Admin/Superadmin/RM Admin only)
 */
export async function updateBankName(
  id: string,
  payload: BankNamePayload,
  authToken: string
): Promise<BankName> {
  return apiRequest<BankName, BankNamePayload>({
    path: `/v1/bankname/${id}`,
    method: "PUT",
    authToken,
    body: payload,
  });
}

/**
 * Delete a bank name by ID (Admin/Superadmin/RM Admin only)
 */
export async function deleteBankName(
  id: string,
  authToken: string
): Promise<void> {
  return apiRequest<void>({
    path: `/v1/bankname/${id}`,
    method: "DELETE",
    authToken,
  });
}

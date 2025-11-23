/**
 * Broker Name API Client
 * Uses Next.js API proxy routes
 */

import { apiRequest } from "./client";

export interface BrokerNamePayload {
  brokername: string;
}

export interface BrokerName {
  _id: string;
  brokername: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create a new broker name (Admin/Superadmin only)
 */
export async function createBrokerName(
  payload: BrokerNamePayload,
  authToken: string
): Promise<BrokerName> {
  return apiRequest<BrokerName, BrokerNamePayload>({
    path: "/v1/brokername",
    method: "POST",
    authToken,
    body: payload,
  });
}

/**
 * Get all broker names
 */
export async function getBrokerNames(authToken: string): Promise<BrokerName[]> {
  return apiRequest<BrokerName[]>({
    path: "/v1/brokername",
    method: "GET",
    authToken,
  });
}

/**
 * Get a single broker name by ID
 */
export async function getBrokerName(
  id: string,
  authToken: string
): Promise<BrokerName> {
  return apiRequest<BrokerName>({
    path: `/v1/brokername/${id}`,
    method: "GET",
    authToken,
  });
}

/**
 * Update a broker name by ID (Admin/Superadmin only)
 */
export async function updateBrokerName(
  id: string,
  payload: BrokerNamePayload,
  authToken: string
): Promise<BrokerName> {
  return apiRequest<BrokerName, BrokerNamePayload>({
    path: `/v1/brokername/${id}`,
    method: "PUT",
    authToken,
    body: payload,
  });
}

/**
 * Delete a broker name by ID (Admin/Superadmin only)
 */
export async function deleteBrokerName(
  id: string,
  authToken: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>({
    path: `/v1/brokername/${id}`,
    method: "DELETE",
    authToken,
  });
}

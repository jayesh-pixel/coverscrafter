/**
 * Broker Name API Client
 * Direct API calls to backend without proxy
 */

const API_BASE_URL = "https://instapolicy.coverscrafter.com";

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
  const response = await fetch(`${API_BASE_URL}/v1/brokername`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to create broker name: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all broker names
 */
export async function getBrokerNames(authToken: string): Promise<BrokerName[]> {
  const response = await fetch(`${API_BASE_URL}/v1/brokername`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to fetch broker names: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get a single broker name by ID
 */
export async function getBrokerName(
  id: string,
  authToken: string
): Promise<BrokerName> {
  const response = await fetch(`${API_BASE_URL}/v1/brokername/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to fetch broker name: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a broker name by ID (Admin/Superadmin only)
 */
export async function updateBrokerName(
  id: string,
  payload: BrokerNamePayload,
  authToken: string
): Promise<BrokerName> {
  const response = await fetch(`${API_BASE_URL}/v1/brokername/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to update broker name: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a broker name by ID (Admin/Superadmin only)
 */
export async function deleteBrokerName(
  id: string,
  authToken: string
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/v1/brokername/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to delete broker name: ${response.statusText}`);
  }

  return response.json();
}

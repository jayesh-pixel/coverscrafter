/**
 * Users API Client
 * Calls backend API directly
 */

import { apiRequest } from "./client";
import { API_BASE_URL } from "./config";

export interface UserProfile {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // Additional fields based on role
}

export interface RMUser extends UserProfile {
  empCode: string;
  joiningDate: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  contactNo: string;
  state: string;
  department: string;
  reportingOffice: string;
  reportingManager?: string;
  resigned: boolean;
  resignationDate?: string;
}

export interface AssociateUser extends UserProfile {
  associateCode: string;
  associatePanNo: string;
  associateAadharNo: string;
  contactPerson: string;
  contactNo: string;
  associateStateName: string;
  associateAddress: string;
  bpanNo: string;
  bpanName: string;
  accountNo: string;
  accountType: string;
  default: boolean;
  ifsc: string;
  bankName: string;
  stateName: string;
  branchName: string;
  bankAddress: string;
  isPos: boolean;
  posCode?: string;
  createdBy?: string;
}

/**
 * Get authenticated user profile
 */
export async function getUserProfile(authToken: string): Promise<UserProfile> {
  return apiRequest<UserProfile>({
    path: `${API_BASE_URL}/v1/users/profile`,
    method: "GET",
    authToken,
  });
}

/**
 * Get all users (Superadmin only)
 */
export async function getAllUsers(authToken: string): Promise<UserProfile[]> {
  return apiRequest<UserProfile[]>({
    path: `${API_BASE_URL}/v1/users`,
    method: "GET",
    authToken,
  });
}

/**
 * Get RM users
 */
export async function getRMUsers(authToken: string, id?: string, state?: string): Promise<RMUser[]> {
  const params = new URLSearchParams();
  if (id) params.append('id', id);
  if (state) params.append('state', state);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<RMUser[]>({
    path: `${API_BASE_URL}/v1/users/rm${query}`,
    method: "GET",
    authToken,
  });
}

/**
 * Get Associate users
 */
export async function getAssociateUsers(authToken: string, id?: string, userId?: string): Promise<AssociateUser[]> {
  const params = new URLSearchParams();
  if (id) params.append('id', id);
  if (userId) params.append('userId', userId);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<AssociateUser[]>({
    path: `${API_BASE_URL}/v1/users/associate${query}`,
    method: "GET",
    authToken,
  });
}

/**
 * Users API Client
 * Uses Next.js API proxy routes
 */

import { apiRequest } from "./client";

const API_BASE_URL = "/api";

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
    path: `${API_BASE_URL}/users/profile`,
    method: "GET",
    authToken,
  });
}

/**
 * Get all users (Superadmin only)
 */
export async function getAllUsers(authToken: string): Promise<UserProfile[]> {
  return apiRequest<UserProfile[]>({
    path: `${API_BASE_URL}/users`,
    method: "GET",
    authToken,
  });
}

/**
 * Get RM users
 */
export async function getRMUsers(authToken: string, id?: string): Promise<RMUser[]> {
  const query = id ? `?id=${encodeURIComponent(id)}` : "";
  return apiRequest<RMUser[]>({
    path: `${API_BASE_URL}/users/rm${query}`,
    method: "GET",
    authToken,
  });
}

/**
 * Get Associate users
 */
export async function getAssociateUsers(authToken: string, id?: string): Promise<AssociateUser[]> {
  const query = id ? `?id=${encodeURIComponent(id)}` : "";
  return apiRequest<AssociateUser[]>({
    path: `${API_BASE_URL}/users/associate${query}`,
    method: "GET",
    authToken,
  });
}

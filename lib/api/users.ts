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
  EmpCode: string;
  JoiningDate: string;
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  Dob: string;
  ContactNo: string;
  EmailID: string;
  WorkingOffice: string;
  Department: string;
  ReportingOffice: string;
  ReportingManager?: string;
  Resigned: boolean;
  ResignationDate?: string;
}

export interface AssociateUser extends UserProfile {
  AssociateCode: string;
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  Dob: string;
  ContactNo: string;
  EmailID: string;
  PanNo: string;
  AadharNo: string;
  BankName: string;
  BankAccountNo: string;
  BankIFSC: string;
  BankBranch: string;
  SettlementDueDate: string;
  BrokerCode: string;
  IsDeleted: boolean;
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

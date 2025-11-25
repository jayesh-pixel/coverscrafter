/**
 * Users API Client
 * Routes through Next.js API proxy
 */

import { apiRequest } from "./client";

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
    path: `/v1/profile`,
    method: "GET",
    authToken,
  });
}

/**
 * Get all users (Superadmin only)
 */
export async function getAllUsers(authToken: string): Promise<UserProfile[]> {
  return apiRequest<UserProfile[]>({
    path: `/v1/users`,
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
    path: `/v1/users/rm${query}`,
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
    path: `/v1/users/associate${query}`,
    method: "GET",
    authToken,
  });
}

/**
 * Get Admin users
 */
export async function getAdminUsers(authToken: string): Promise<UserProfile[]> {
  return apiRequest<UserProfile[]>({
    path: `/v1/users/admin`,
    method: "GET",
    authToken,
  });
}

/**
 * Update RM user
 */
export async function updateRMUser(
  id: string,
  data: Partial<{
    EmpCode: string;
    JoiningDate: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Dob: string;
    ContactNo: string;
    EmailID: string;
    State: string;
    Department: string;
    ReportingOffice: string;
    ReportingManager: string;
    Resigned: boolean;
    ResignationDate: string;
    status: string;
  }>,
  authToken: string
): Promise<{ message: string; user: any }> {
  return apiRequest<{ message: string; user: any }>({
    path: `/v1/users/rm/${id}`,
    method: "PUT",
    authToken,
    body: data,
  });
}

/**
 * Update Associate user
 */
export async function updateAssociateUser(
  id: string,
  data: Partial<{
    AssociateCode: string;
    AssociateName: string;
    AssociatePanNo: string;
    AssociateAadharNo: string;
    ContactPerson: string;
    ContactNo: string;
    AssociateEmailId: string;
    AssociateStateName: string;
    AssociateAddress: string;
    BPANNo: string;
    BPANName: string;
    AccountNo: string;
    AccountType: string;
    Default: boolean;
    IFSC: string;
    BankName: string;
    StateName: string;
    BranchName: string;
    BankAddress: string;
    isPos: boolean;
    PosCode: string;
    status: string;
  }>,
  authToken: string
): Promise<{ message: string; user: any }> {
  return apiRequest<{ message: string; user: any }>({
    path: `/v1/users/associate/${id}`,
    method: "PUT",
    authToken,
    body: data,
  });
}

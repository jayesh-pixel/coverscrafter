import { apiRequest } from "./client";
import { API_BASE_URL } from "./config";

export interface BusinessEntryPayload {
  brokerid: string;
  insuranceCompany: string;
  policyNumber: string;
  clientName: string;
  contactNumber: string;
  emailId: string;
  state: string;
  lineOfBusiness: string;
  product: string;
  subProduct: string;
  registrationNumber: string;
  policyIssueDate: string;
  policyStartDate: string;
  policyEndDate: string;
  policyTpEndDate: string;
  odPremium: string;
  tpPremium: string;
  netPremium: string;
  grossPremium: string;
  odPremiumPayin: string;
  tpPremiumPayin: string;
  netPremiumPayin: string;
  extraAmountPayin: string;
  odPremiumPayout: string;
  tpPremiumPayout: string;
  netPremiumPayout: string;
  extraAmountPayout: string;
  associateId: string;
  reportingFy: string;
  reportingMonth: string;
  rmState: string;
  rmId: string;
  paymentMode: string;
  chequeNumber?: string;
  chequeDate?: string;
  policyFile: string;
}

export interface BusinessEntry {
  _id: string;
  brokerid: string;
  insuranceCompany: string;
  policyNumber: string;
  clientName: string;
  contactNumber: string;
  emailId: string;
  state: string;
  lineOfBusiness: string;
  product: string;
  subProduct: string;
  registrationNumber: string;
  policyIssueDate: string;
  policyStartDate: string;
  policyEndDate: string;
  policyTpEndDate: string;
  odPremium: string;
  tpPremium: string;
  netPremium: string;
  grossPremium: string;
  odPremiumPayin: string;
  tpPremiumPayin: string;
  netPremiumPayin: string;
  extraAmountPayin: string;
  odPremiumPayout: string;
  tpPremiumPayout: string;
  netPremiumPayout: string;
  extraAmountPayout: string;
  odPremiumPayinAmt: string;
  tpPremiumPayinAmt: string;
  netPremiumPayinAmt: string;
  extraAmountPayinAmt: string;
  odPremiumPayoutAmt: string;
  tpPremiumPayoutAmt: string;
  netPremiumPayoutAmt: string;
  extraAmountPayoutAmt: string;
  totalPayin: string;
  totalPayout: string;
  netRevenue: string;
  associateId: string;
  reportingFy: string;
  reportingMonth: string;
  rmState: string;
  rmId: string;
  paymentMode: string;
  chequeNumber?: string;
  chequeDate?: string;
  policyFile: string;
  policyFileUrl?: string;
  brokerData?: {
    _id: string;
    brokername: string;
    isDeleted: boolean;
  };
  associateData?: {
    _id: string;
    associateCode: string;
    contactPerson: string;
    contactNo: string;
    email: string;
    associateStateName: string;
  };
  rmData?: {
    _id: string;
    empCode: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    state: string;
    department: string;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export async function createBusinessEntry(payload: BusinessEntryPayload, authToken: string) {
  return apiRequest<BusinessEntry, BusinessEntryPayload>({
    path: `${API_BASE_URL}/v1/businessentry`,
    method: "POST",
    body: payload,
    authToken,
  });
}

export async function getBusinessEntries(authToken: string) {
  return apiRequest<BusinessEntry[]>({
    path: `${API_BASE_URL}/v1/businessentry`,
    method: "GET",
    authToken,
  });
}

export async function getBusinessEntry(id: string, authToken: string) {
  return apiRequest<BusinessEntry>({
    path: `${API_BASE_URL}/v1/businessentry/${id}`,
    method: "GET",
    authToken,
  });
}

export async function updateBusinessEntry(id: string, payload: Partial<BusinessEntryPayload>, authToken: string) {
  return apiRequest<BusinessEntry, Partial<BusinessEntryPayload>>({
    path: `${API_BASE_URL}/v1/businessentry/${id}`,
    method: "PUT",
    body: payload,
    authToken,
  });
}

export async function deleteBusinessEntry(id: string, authToken: string) {
  return apiRequest<{ message: string }>({
    path: `${API_BASE_URL}/v1/businessentry/${id}`,
    method: "DELETE",
    authToken,
  });
}

export interface BulkUpdatePayload {
  updates: Array<{
    policyNumber: string;
    paymentdate?: string;
    utrno?: string;
    status?: string;
  }>;
}

export interface BulkUpdateResult {
  message: string;
  totalRecords: number;
  processed: number;
  successful: number;
  failed: number;
  results: Array<{
    policyNumber: string;
    status: string;
    message: string;
    updatedFields?: Record<string, any>;
  }>;
}

export async function bulkUpdateBusinessEntries(
  payload: BulkUpdatePayload,
  authToken: string
): Promise<BulkUpdateResult> {
  return apiRequest<BulkUpdateResult, BulkUpdatePayload>({
    path: `${API_BASE_URL}/v1/businessentry/bulk-update`,
    method: "POST",
    body: payload,
    authToken,
  });
}

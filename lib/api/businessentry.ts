import { apiRequest } from "./client";

export interface BusinessEntryPayload {
  brokerName: string;
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
  odPremium: number;
  tpPremium: number;
  netPremium: number;
  grossPremium: number;
  broker: string;
  reportingFy: string;
  reportingMonth: string;
  region: string;
  relationshipManager: string;
  paymentMode: "online" | "cheque";
  chequeNumber?: string;
  chequeDate?: string;
  supportingFileId?: string;
  supportingFileName?: string;
  supportingFileUrl?: string;
}

export interface BusinessEntry {
  _id: string;
  brokerName: string;
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
  odPremium: number;
  tpPremium: number;
  netPremium: number;
  grossPremium: number;
  broker: string;
  reportingFy: string;
  reportingMonth: string;
  region: string;
  relationshipManager: string;
  paymentMode: string;
  chequeNumber?: string;
  chequeDate?: string;
  supportingFileId?: string;
  supportingFileName?: string;
  supportingFileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export async function createBusinessEntry(payload: BusinessEntryPayload, authToken: string) {
  return apiRequest<BusinessEntry, BusinessEntryPayload>({
    path: "/api/businessentry",
    method: "POST",
    body: payload,
    authToken,
  });
}

export async function getBusinessEntries(authToken: string) {
  return apiRequest<BusinessEntry[]>({
    path: "/api/businessentry",
    method: "GET",
    authToken,
  });
}

export async function getBusinessEntry(id: string, authToken: string) {
  return apiRequest<BusinessEntry>({
    path: `/api/businessentry/${id}`,
    method: "GET",
    authToken,
  });
}

export async function updateBusinessEntry(id: string, payload: Partial<BusinessEntryPayload>, authToken: string) {
  return apiRequest<BusinessEntry, Partial<BusinessEntryPayload>>({
    path: `/api/businessentry/${id}`,
    method: "PUT",
    body: payload,
    authToken,
  });
}

export async function deleteBusinessEntry(id: string, authToken: string) {
  return apiRequest<{ message: string }>({
    path: `/api/businessentry/${id}`,
    method: "DELETE",
    authToken,
  });
}

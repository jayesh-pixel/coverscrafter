import { apiRequest } from "./client";

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
  associateId: string;
  reportingFy: string;
  reportingMonth: string;
  rmState: string;
  rmId: string;
  paymentMode: string;
  chequeNumber?: string;
  chequeDate?: string;
  policyFile: string;
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

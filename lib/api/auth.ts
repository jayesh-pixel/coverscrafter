import { apiRequest } from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  user: {
    _id: string;
    firebaseUid: string;
    email: string;
    name: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiRequest<LoginResponse, LoginPayload>({
    path: `/v1/auth/login`,
    method: "POST",
    body: payload,
  });
}

export interface RegisterRmPayload {
  EmpCode: string;
  JoiningDate: string;
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  Dob: string;
  ContactNo: string;
  EmailID: string;
  State: string;
  Department?: string;
  ReportingOffice?: string;
  ReportingManager?: string;
  Resigned?: boolean;
  ResignationDate?: string;
  Password: string;
}

export interface RegisterAssociatePayload {
  rmId: string;
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
  PosCode?: string;
  Password: string;
}

export async function registerRM(payload: RegisterRmPayload, authToken: string) {
  return apiRequest<unknown, RegisterRmPayload>({
    path: `/v1/auth/register_rm`,
    method: "POST",
    body: payload,
    authToken,
  });
}

export async function registerAssociate(payload: RegisterAssociatePayload, authToken: string) {
  return apiRequest<unknown, RegisterAssociatePayload>({
    path: `/v1/auth/register_associate`,
    method: "POST",
    body: payload,
    authToken,
  });
}

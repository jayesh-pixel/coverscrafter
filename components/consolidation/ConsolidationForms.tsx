'use client';

import { useState, useEffect } from "react";
import { FormSection, SelectField, TextField, SearchableSelectField } from "@/components/ui/forms";
import { registerAssociate, registerRM } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/config";
import { getValidAuthToken } from "@/lib/utils/storage";
import { getRMUsers, getAdminUsers, type RMUser } from "@/lib/api/users";
import { uploadDocument } from "@/lib/api/uploads";
import { getBankNames, type BankName } from "@/lib/api/bankname";

const workingOffices = [
  "--None--",
  "ANDRA PRADESH",
  "BIHAR",
  "CORPORATE OFFICE",
  "DELHI",
  "DELHI - 2",
  "GUJARAT",
  "GURGAON OFFICE",
  "MPCG",
  "MPCG - 2",
  "MUMBAI",
  "NAVI MUMBAI",
  "RAJASTHAN",
  "ROM",
  "UTTAR PRADESH",
  "WEST BENGAL",
];

const departments = [
  "--None--",
  "ACCOUNTS",
  "ADMINISTRATION",
  "HUMAN RESOURCE",
  "MANAGEMENT",
  "MARKETING",
  "OPERATIONS",
  "SALES & MARKETING",
];

const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const reportingOffices = indianStates;

const accountTypes = ["Savings", "Current", "Cash Credit"];

type RmFormState = {
  empCode: string;
  joiningDate: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  contactNumber: string;
  emailId: string;
  state: string;
  reportingManager: string;
  password: string;
};

const initialRmFormState: RmFormState = {
  empCode: "",
  joiningDate: "",
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  contactNumber: "",
  emailId: "",
  state: "",
  reportingManager: "",
  password: "",
};

type AssociateFormState = {
  rmId: string;
  brokerCode: string;
  brokerName: string;
  brokerPan: string;
  aadhaarNumber: string;
  contactPerson: string;
  contactNumber: string;
  contactEmail: string;
  brokerState: string;
  brokerAddress: string;
  beneficiaryPan: string;
  beneficiaryName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  accountType: string;
  ifscCode: string;
  bankName: string;
  bankState: string;
  branchName: string;
  branchAddress: string;
  posCode: string;
  password: string;
  gstCertificate: string;
  pancardDocument: string;
  cancelledCheque: string;
  aadharFront: string;
  aadharBack: string;
};

const initialAssociateFormState: AssociateFormState = {
  rmId: "",
  brokerCode: "",
  brokerName: "",
  brokerPan: "",
  aadhaarNumber: "",
  contactPerson: "",
  contactNumber: "",
  contactEmail: "",
  brokerState: "",
  brokerAddress: "",
  beneficiaryPan: "",
  beneficiaryName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  accountType: "",
  ifscCode: "",
  bankName: "",
  bankState: "",
  branchName: "",
  branchAddress: "",
  posCode: "",
  password: "",
  gstCertificate: "",
  pancardDocument: "",
  cancelledCheque: "",
  aadharFront: "",
  aadharBack: "",
};

export function RMForm({
  title = "Create RM",
  description,
}: {
  title?: string;
  description?: string;
}) {
  const [rmForm, setRmForm] = useState<RmFormState>(initialRmFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [adminOptions, setAdminOptions] = useState<{ label: string; value: string }[]>([]);

  const updateRmForm = (field: keyof RmFormState, value: string) => {
    setRmForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    // Set hardcoded admin option
    setAdminOptions([{ label: "Admin", value: "Admin" }]);
  }, []);

  const handleSubmit = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const token = await getValidAuthToken();
    if (!token) {
      setErrorMessage("You must be signed in to register an RM.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerRM(
        {
          EmpCode: rmForm.empCode,
          JoiningDate: rmForm.joiningDate,
          FirstName: rmForm.firstName,
          MiddleName: rmForm.middleName || undefined,
          LastName: rmForm.lastName,
          Dob: rmForm.dateOfBirth,
          ContactNo: rmForm.contactNumber,
          EmailID: rmForm.emailId,
          State: rmForm.state,
          ReportingManager: rmForm.reportingManager || undefined,
          Password: rmForm.password,
        },
        token,
      );

      setSuccessMessage("RM registered successfully.");
      setRmForm(initialRmFormState);
    } catch (error) {
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : (error.message || "Unable to register RM. Please verify the details.");
        setErrorMessage(fullError);
      } else {
        setErrorMessage("Something went wrong while registering the RM. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormSection
      title={title}
    >
      <div className="col-span-full space-y-4">        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              id="empCode"
              label="EmpCode"
              placeholder="EmpCode"
              required
              value={rmForm.empCode}
              onChange={(event) => updateRmForm("empCode", event.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              id="joiningDate"
              label="Joining Date"
              type="date"
              required
              value={rmForm.joiningDate}
              onChange={(event) => updateRmForm("joiningDate", event.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TextField
              id="firstName"
              label="First Name"
              placeholder="First Name"
              required
              value={rmForm.firstName}
              onChange={(event) => updateRmForm("firstName", event.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              id="middleName"
              label="Middle Name"
              placeholder="Middle Name"
              value={rmForm.middleName}
              onChange={(event) => updateRmForm("middleName", event.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              id="lastName"
              label="Last Name"
              placeholder="Last Name"
              required
              value={rmForm.lastName}
              onChange={(event) => updateRmForm("lastName", event.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              id="dateOfBirth"
              label="Date of Birth"
              type="date"
              required
              value={rmForm.dateOfBirth}
              onChange={(event) => updateRmForm("dateOfBirth", event.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              id="contactNumber"
              label="Contact No"
              placeholder="Contact Number"
              required
              value={rmForm.contactNumber}
              onChange={(event) => updateRmForm("contactNumber", event.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              id="emailId"
              label="Email ID"
              type="email"
              placeholder="email id"
              required
              value={rmForm.emailId}
              onChange={(event) => updateRmForm("emailId", event.target.value)}
              disabled={isSubmitting}
              autoComplete="email"
            />
            <TextField
              id="rmPassword"
              label="Password"
              type="password"
              placeholder="Temporary password"
              required
              value={rmForm.password}
              onChange={(event) => updateRmForm("password", event.target.value)}
              disabled={isSubmitting}
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <SearchableSelectField
              id="state"
              label="State"
              placeholder="--None--"
              required
              value={rmForm.state}
              onChange={(event) => updateRmForm("state", event.target.value)}
              disabled={isSubmitting}
              options={indianStates.map((state) => ({
                label: state,
                value: state,
              }))}
            />
            <SelectField
              id="reportingManager"
              label="Reporting Manager"
              placeholder="--Select Admin--"
              value={rmForm.reportingManager}
              onChange={(event) => updateRmForm("reportingManager", event.target.value)}
              disabled={isSubmitting}
              options={adminOptions}
            />
          </div>
        </div>

        {(errorMessage || successMessage) && (
          <div className="space-y-2">
            {errorMessage && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Saving RM..." : "Save RM Details"}
          </button>
        </div>
      </div>
    </FormSection>
  );
}

export function AssociateForm({
  contextLabel = "Associate Form Submission",
  title = "Create Associate",
  description,
}: {
  contextLabel?: string;
  title?: string;
  description?: string;
}) {
  const [showPrimaryDetails, setShowPrimaryDetails] = useState(true);
  const [showBankDetails, setShowBankDetails] = useState(true);
  const [isDefaultBank, setIsDefaultBank] = useState(true);
  const [posStatus, setposStatus] = useState<"yes" | "no" | "">("");
  const [associateForm, setAssociateForm] = useState<AssociateFormState>(initialAssociateFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rmOptions, setRmOptions] = useState<RMUser[]>([]);
  const [isLoadingRMs, setIsLoadingRMs] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState<string | null>(null);
  const [bankNames, setBankNames] = useState<BankName[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{
    gstCertificate: File | null;
    pancardDocument: File | null;
    cancelledCheque: File | null;
    aadharFront: File | null;
    aadharBack: File | null;
  }>({
    gstCertificate: null,
    pancardDocument: null,
    cancelledCheque: null,
    aadharFront: null,
    aadharBack: null,
  });

  const updateAssociateForm = (field: keyof AssociateFormState, value: string) => {
    setAssociateForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchRMs = async () => {
    const token = await getValidAuthToken();
    if (!token) return;

    setIsLoadingRMs(true);
    try {
      const rms = await getRMUsers(token);
      setRmOptions(rms);
    } catch (error) {
      console.error("Failed to fetch RMs", error);
      setRmOptions([]);
    } finally {
      setIsLoadingRMs(false);
    }
  };

  const fetchBanks = async () => {
    const token = await getValidAuthToken();
    if (!token) return;

    setIsLoadingBanks(true);
    try {
      const banks = await getBankNames(token);
      setBankNames(banks.filter(bank => !bank.isDeleted));
    } catch (error) {
      console.error("Failed to fetch bank names", error);
      setBankNames([]);
    } finally {
      setIsLoadingBanks(false);
    }
  };

  useEffect(() => {
    fetchRMs();
    fetchBanks();
  }, []);

  const handleposStatusChange = (value: "yes" | "no" | "") => {
    setposStatus(value);
    if (value !== "yes") {
      setAssociateForm((prev) => ({
        ...prev,
        posCode: "",
      }));
    }
  };

  const handleAssociateSubmit = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const token = await getValidAuthToken();
    if (!token) {
      setErrorMessage("You must be signed in to register an associate.");
      return;
    }

    // Validate account number match
    if (associateForm.accountNumber !== associateForm.confirmAccountNumber) {
      setErrorMessage("Account numbers do not match. Please verify and try again.");
      return;
    }

    // Validate required documents
    if (!selectedFiles.pancardDocument) {
      setErrorMessage("PAN Card document is required.");
      return;
    }
    if (!selectedFiles.cancelledCheque) {
      setErrorMessage("Cancelled Cheque is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload documents first
      let gstCertificateUrl = "";
      let pancardDocumentUrl = "";
      let cancelledChequeUrl = "";
      let aadharFrontUrl = "";
      let aadharBackUrl = "";

      if (selectedFiles.gstCertificate) {
        setIsUploadingDoc("gstCertificate");
        const response = await uploadDocument(selectedFiles.gstCertificate, token);
        gstCertificateUrl = response.id || response.downloadUrl || response.url || response.fileId || "";
      }

      setIsUploadingDoc("pancardDocument");
      const panResponse = await uploadDocument(selectedFiles.pancardDocument, token);
      pancardDocumentUrl = panResponse.id || panResponse.downloadUrl || panResponse.url || panResponse.fileId || "";

      setIsUploadingDoc("cancelledCheque");
      const chequeResponse = await uploadDocument(selectedFiles.cancelledCheque, token);
      cancelledChequeUrl = chequeResponse.id || chequeResponse.downloadUrl || chequeResponse.url || chequeResponse.fileId || "";

      if (selectedFiles.aadharFront) {
        setIsUploadingDoc("aadharFront");
        const aadharFrontResponse = await uploadDocument(selectedFiles.aadharFront, token);
        aadharFrontUrl = aadharFrontResponse.id || aadharFrontResponse.downloadUrl || aadharFrontResponse.url || aadharFrontResponse.fileId || "";
      }

      if (selectedFiles.aadharBack) {
        setIsUploadingDoc("aadharBack");
        const aadharBackResponse = await uploadDocument(selectedFiles.aadharBack, token);
        aadharBackUrl = aadharBackResponse.id || aadharBackResponse.downloadUrl || aadharBackResponse.url || aadharBackResponse.fileId || "";
      }

      setIsUploadingDoc(null);

      // Now submit the form with uploaded URLs
      await registerAssociate(
        {
          rmId: associateForm.rmId,
          AssociateCode: associateForm.brokerCode || null,
          AssociateName: associateForm.brokerName,
          AssociatePanNo: associateForm.brokerPan,
          AssociateAadharNo: associateForm.aadhaarNumber,
          ContactPerson: associateForm.contactPerson,
          ContactNo: associateForm.contactNumber,
          AssociateEmailId: associateForm.contactEmail,
          AssociateStateName: associateForm.brokerState,
          AssociateAddress: associateForm.brokerAddress,
          BPANNo: associateForm.beneficiaryPan,
          BPANName: associateForm.beneficiaryName,
          AccountNo: associateForm.accountNumber,
          AccountType: associateForm.accountType,
          Default: isDefaultBank,
          IFSC: associateForm.ifscCode,
          BankName: associateForm.bankName,
          StateName: associateForm.bankState,
          BranchName: associateForm.branchName,
          BankAddress: associateForm.branchAddress,
          isPos: posStatus === "yes",
          PosCode: posStatus === "yes" ? associateForm.posCode || undefined : undefined,
          Password: associateForm.password,
          documents: {
            gstCertificate: gstCertificateUrl,
            pancardDocument: pancardDocumentUrl,
            cancelledCheque: cancelledChequeUrl,
            aadharFront: aadharFrontUrl,
            aadharBack: aadharBackUrl,
          },
        },
        token,
      );

      console.log(contextLabel, "Associate registered successfully");
      setSuccessMessage("Associate registered successfully.");
      setAssociateForm(initialAssociateFormState);
      setSelectedFiles({
        gstCertificate: null,
        pancardDocument: null,
        cancelledCheque: null,
        aadharFront: null,
        aadharBack: null,
      });
      setposStatus("");
      setIsDefaultBank(true);
    } catch (error) {
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : (error.message || "Unable to register associate. Please check the details.");
        setErrorMessage(fullError);
      } else {
        setErrorMessage("Something went wrong while registering the associate. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormSection
      title={title}
    >
      <div className="col-span-full space-y-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPrimaryDetails((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-bold text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
            disabled={isSubmitting}
          >
            {showPrimaryDetails ? "−" : "+"}
          </button>
          <span className="text-sm font-semibold text-slate-700">Primary Details</span>
        </div>

        {showPrimaryDetails && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <SelectField
                id="rmId"
                label="Relationship Manager"
                placeholder={isLoadingRMs ? "Loading RMs..." : "--Select RM--"}
                required
                value={associateForm.rmId}
                onChange={(event) => updateAssociateForm("rmId", event.target.value)}
                options={rmOptions.map((rm) => ({
                  label: `${rm.firstName} ${rm.lastName} (${rm.empCode})`,
                  value: rm.firebaseUid,
                }))}
                disabled={isSubmitting || isLoadingRMs}
              />
              {/* <TextField
                id="associateCode"
                label="Associate Code"
                placeholder="Associate Code"
                required
                value={associateForm.brokerCode}
                onChange={(event) => updateAssociateForm("brokerCode", event.target.value)}
                disabled={isSubmitting}
              /> */}
              <TextField
                id="associateName"
                label="Associate Name"
                placeholder="Associate Name"
                required
                value={associateForm.brokerName}
                onChange={(event) => updateAssociateForm("brokerName", event.target.value)}
                disabled={isSubmitting}
              />
              <TextField
                id="brokerPan"
                label="PAN Number"
                placeholder="PAN Number"
                required
                value={associateForm.brokerPan}
                onChange={(event) => {
                  updateAssociateForm("brokerPan", event.target.value);
                  // Auto-fill password with PAN number if password is empty
                  if (!associateForm.password) {
                    updateAssociateForm("password", event.target.value);
                  }
                }}
                disabled={isSubmitting}
              />
              <TextField
                id="aadhaarNumber"
                label="AADHAR No"
                placeholder="AADHAR No"
                required
                value={associateForm.aadhaarNumber}
                onChange={(event) => updateAssociateForm("aadhaarNumber", event.target.value)}
                disabled={isSubmitting}
              />
              <TextField
                id="contactPerson"
                label="Contact Person"
                placeholder="Contact Person"
                required
                value={associateForm.contactPerson}
                onChange={(event) => updateAssociateForm("contactPerson", event.target.value)}
                disabled={isSubmitting}
              />
              <TextField
                id="contactNumber"
                label="Contact Number"
                placeholder="Contact Number"
                required
                value={associateForm.contactNumber}
                onChange={(event) => updateAssociateForm("contactNumber", event.target.value)}
                disabled={isSubmitting}
              />
              <TextField
                id="contactEmail"
                label="Email ID"
                type="email"
                placeholder="Email ID"
                required
                value={associateForm.contactEmail}
                onChange={(event) => updateAssociateForm("contactEmail", event.target.value)}
                autoComplete="email"
                disabled={isSubmitting}
              />
              <SelectField
                id="posStatus"
                label="Pos"
                placeholder="Select"
                required
                value={posStatus}
                onChange={(event) => handleposStatusChange(event.target.value as "yes" | "no" | "")}
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
                disabled={isSubmitting}
              />
              {posStatus === "yes" && (
                <TextField
                  id="posCode"
                  label="pos Code"
                  placeholder="pos Code"
                  required
                  value={associateForm.posCode}
                  onChange={(event) => updateAssociateForm("posCode", event.target.value)}
                  disabled={isSubmitting}
                />
              )}
              <SearchableSelectField
                id="brokerState"
                label="Broker State"
                placeholder="Select State"
                value={associateForm.brokerState}
                onChange={(event) => updateAssociateForm("brokerState", event.target.value)}
                options={indianStates.map((state) => ({
                  label: state,
                  value: state,
                }))}
                disabled={isSubmitting}
              />
              <TextField
                id="associatePassword"
                label="Password"
                type="password"
                placeholder="Temporary password"
                required
                value={associateForm.password}
                onChange={(event) => updateAssociateForm("password", event.target.value)}
                autoComplete="new-password"
                disabled={isSubmitting}
              />
              <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-slate-700">
                <span>Broker Communication Address</span>
                <textarea
                  id="brokerAddress"
                  placeholder="Broker Communication Address"
                  className="min-h-[100px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100"
                  value={associateForm.brokerAddress}
                  onChange={(event) => updateAssociateForm("brokerAddress", event.target.value)}
                  disabled={isSubmitting}
                />
              </label>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBankDetails((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-bold text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
            disabled={isSubmitting}
          >
            {showBankDetails ? "−" : "+"}
          </button>
          <span className="text-sm font-semibold text-slate-700">Bank Account Details</span>
        </div>

        {showBankDetails && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2">Bank Account Information</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <TextField
                id="beneficiaryPan"
                label="Beneficiary PAN Number"
                placeholder="Beneficiary PAN Number"
                required
                value={associateForm.beneficiaryPan}
                onChange={(event) => updateAssociateForm("beneficiaryPan", event.target.value)}
                disabled={isSubmitting}
              />
              <TextField
                id="beneficiaryName"
                label="Name as in Bank Account"
                placeholder="Name as in Bank Account"
                required
                value={associateForm.beneficiaryName}
                onChange={(event) => updateAssociateForm("beneficiaryName", event.target.value)}
                disabled={isSubmitting}
              />
              <TextField
                id="accountNumber"
                label="Account No"
                placeholder="Account No"
                type="password"
                required
                value={associateForm.accountNumber}
                onChange={(event) => updateAssociateForm("accountNumber", event.target.value)}
                disabled={isSubmitting}
              />
              <TextField
                id="confirmAccountNumber"
                label="Confirm Account No"
                placeholder="Re-enter Account No"
                type="text"
                required
                value={associateForm.confirmAccountNumber}
                onChange={(event) => updateAssociateForm("confirmAccountNumber", event.target.value)}
                disabled={isSubmitting}
                error={
                  associateForm.confirmAccountNumber && 
                  associateForm.accountNumber !== associateForm.confirmAccountNumber 
                    ? "Account numbers do not match" 
                    : undefined
                }
              />
              <SelectField
                id="accountType"
                label="Account Type"
                placeholder="Select Account Type"
                value={associateForm.accountType}
                onChange={(event) => updateAssociateForm("accountType", event.target.value)}
                options={accountTypes.map((type) => ({
                  label: type,
                  value: type,
                }))}
                disabled={isSubmitting}
              />
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isDefaultBank}
                  onChange={(event) => setIsDefaultBank(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
                  disabled={isSubmitting}
                />
                Select as Default
              </label>
              <TextField
                id="ifscCode"
                label="IFSC Code"
                placeholder="IFSC Code"
                required
                value={associateForm.ifscCode}
                onChange={(event) => updateAssociateForm("ifscCode", event.target.value)}
                disabled={isSubmitting}
              />
              <SearchableSelectField
                id="bankName"
                label="Bank Name"
                placeholder={isLoadingBanks ? "Loading banks..." : "Select Bank"}
                value={associateForm.bankName}
                onChange={(event) => updateAssociateForm("bankName", event.target.value)}
                options={bankNames.map((bank) => ({
                  label: bank.bankname,
                  value: bank.bankname,
                }))}
                disabled={isSubmitting || isLoadingBanks}
              />
              <SearchableSelectField
                id="bankState"
                label="Bank State"
                placeholder="Select State"
                value={associateForm.bankState}
                onChange={(event) => updateAssociateForm("bankState", event.target.value)}
                options={indianStates.map((state) => ({
                  label: state,
                  value: state,
                }))}
                disabled={isSubmitting}
              />
              <TextField
                id="branchName"
                label="Branch Name"
                placeholder="Branch Name"
                required
                value={associateForm.branchName}
                onChange={(event) => updateAssociateForm("branchName", event.target.value)}
                disabled={isSubmitting}
              />
              <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-slate-700">
                <span>Bank Branch Address</span>
                <textarea
                  id="branchAddress"
                  placeholder="Bank Branch Address"
                  className="min-h-[100px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100"
                  value={associateForm.branchAddress}
                  onChange={(event) => updateAssociateForm("branchAddress", event.target.value)}
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
              >
                Add Bank
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
              >
                Show Banking details
              </button>
            </div>

            <div className="h-40 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-400">
              Banking details table preview coming soon.
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-bold text-slate-600"
            disabled
          >
            📄
          </button>
          <span className="text-sm font-semibold text-slate-700">Document Uploads</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
              <span>GST Certificate</span>
              <input
                type="file"
                id="gstCertificate"
                accept=".pdf,.jpg,.jpeg,.png"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-1 file:text-xs file:font-semibold file:text-blue-600 hover:file:bg-blue-100"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setSelectedFiles(prev => ({ ...prev, gstCertificate: file }));
                  }
                }}
                disabled={isSubmitting}
              />
              {selectedFiles.gstCertificate && (
                <span className="text-xs text-emerald-600">✓ {selectedFiles.gstCertificate.name} selected</span>
              )}
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
              <span>PAN Card Document <span className="text-rose-500">*</span></span>
              <input
                type="file"
                id="pancardDocument"
                accept=".pdf,.jpg,.jpeg,.png"
                required
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-1 file:text-xs file:font-semibold file:text-blue-600 hover:file:bg-blue-100"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setSelectedFiles(prev => ({ ...prev, pancardDocument: file }));
                  }
                }}
                disabled={isSubmitting}
              />
              {selectedFiles.pancardDocument && (
                <span className="text-xs text-emerald-600">✓ {selectedFiles.pancardDocument.name} selected</span>
              )}
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
              <span>Cancelled Cheque <span className="text-rose-500">*</span></span>
              <input
                type="file"
                id="cancelledCheque"
                accept=".pdf,.jpg,.jpeg,.png"
                required
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-1 file:text-xs file:font-semibold file:text-blue-600 hover:file:bg-blue-100"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setSelectedFiles(prev => ({ ...prev, cancelledCheque: file }));
                  }
                }}
                disabled={isSubmitting}
              />
              {selectedFiles.cancelledCheque && (
                <span className="text-xs text-emerald-600">✓ {selectedFiles.cancelledCheque.name} selected</span>
              )}
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
              <span>Aadhar Front</span>
              <input
                type="file"
                id="aadharFront"
                accept=".pdf,.jpg,.jpeg,.png"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-1 file:text-xs file:font-semibold file:text-blue-600 hover:file:bg-blue-100"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setSelectedFiles(prev => ({ ...prev, aadharFront: file }));
                  }
                }}
                disabled={isSubmitting}
              />
              {selectedFiles.aadharFront && (
                <span className="text-xs text-emerald-600">✓ {selectedFiles.aadharFront.name} selected</span>
              )}
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
              <span>Aadhar Back</span>
              <input
                type="file"
                id="aadharBack"
                accept=".pdf,.jpg,.jpeg,.png"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-1 file:text-xs file:font-semibold file:text-blue-600 hover:file:bg-blue-100"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setSelectedFiles(prev => ({ ...prev, aadharBack: file }));
                  }
                }}
                disabled={isSubmitting}
              />
              {selectedFiles.aadharBack && (
                <span className="text-xs text-emerald-600">✓ {selectedFiles.aadharBack.name} selected</span>
              )}
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Accepted formats: PDF, JPG, JPEG, PNG (Max 5MB)
          </p>
        </div>

        {(errorMessage || successMessage) && (
          <div className="space-y-2">
            {errorMessage && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAssociateSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (isUploadingDoc ? `Uploading ${isUploadingDoc}...` : "Saving POS...") : "Save POS Details"}
          </button>
        </div>
      </div>
    </FormSection>
  );
}

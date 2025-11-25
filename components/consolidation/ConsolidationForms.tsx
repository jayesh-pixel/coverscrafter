'use client';

import { useState, useEffect } from "react";
import { FormSection, SelectField, TextField, SearchableSelectField } from "@/components/ui/forms";
import { registerAssociate, registerRM } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/config";
import { getValidAuthToken } from "@/lib/utils/storage";
import { getRMUsers, getAdminUsers, type RMUser } from "@/lib/api/users";

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

const bankNames = [
  "Axis Bank",
  "Bandhan Bank",
  "Bank of Baroda",
  "Bank of India",
  "Bank of Maharashtra",
  "Canara Bank",
  "Central Bank of India",
  "City Union Bank",
  "CSB Bank",
  "DCB Bank",
  "Dhanlaxmi Bank",
  "Federal Bank",
  "HDFC Bank",
  "ICICI Bank",
  "IDBI Bank",
  "IDFC First Bank",
  "Indian Bank",
  "Indian Overseas Bank",
  "IndusInd Bank",
  "Jammu & Kashmir Bank",
  "Karnataka Bank",
  "Karur Vysya Bank",
  "Kotak Mahindra Bank",
  "Lakshmi Vilas Bank",
  "Nainital Bank",
  "Punjab & Sind Bank",
  "Punjab National Bank",
  "RBL Bank",
  "South Indian Bank",
  "State Bank of India",
  "Tamilnad Mercantile Bank",
  "UCO Bank",
  "Union Bank of India",
  "Yes Bank",
];

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
  accountType: string;
  ifscCode: string;
  bankName: string;
  bankState: string;
  branchName: string;
  branchAddress: string;
  posCode: string;
  password: string;
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
  accountType: "",
  ifscCode: "",
  bankName: "",
  bankState: "",
  branchName: "",
  branchAddress: "",
  posCode: "",
  password: "",
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

  useEffect(() => {
    fetchRMs();
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

    setIsSubmitting(true);

    try {
      await registerAssociate(
        {
          rmId: associateForm.rmId,
          AssociateCode: associateForm.brokerCode,
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
        },
        token,
      );

      console.log(contextLabel, "Associate registered successfully");
      setSuccessMessage("Associate registered successfully.");
      setAssociateForm(initialAssociateFormState);
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
              <TextField
                id="associateCode"
                label="Associate Code"
                placeholder="Associate Code"
                required
                value={associateForm.brokerCode}
                onChange={(event) => updateAssociateForm("brokerCode", event.target.value)}
                disabled={isSubmitting}
              />
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
                onChange={(event) => updateAssociateForm("brokerPan", event.target.value)}
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
                required
                value={associateForm.accountNumber}
                onChange={(event) => updateAssociateForm("accountNumber", event.target.value)}
                disabled={isSubmitting}
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
                placeholder="Select Bank"
                value={associateForm.bankName}
                onChange={(event) => updateAssociateForm("bankName", event.target.value)}
                options={bankNames.map((bank) => ({
                  label: bank,
                  value: bank,
                }))}
                disabled={isSubmitting}
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
            {isSubmitting ? "Saving POS..." : "Save POS Details"}
          </button>
        </div>
      </div>
    </FormSection>
  );
}

'use client';

import { useState } from "react";
import { FormSection, SelectField, TextField } from "@/components/ui/forms";

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

const reportingOffices = workingOffices;

const indianStates = [
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Madhya Pradesh",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

const accountTypes = ["Savings", "Current", "Cash Credit"];

const bankNames = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank"];

type AssociateFormState = {
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
};

const initialAssociateFormState: AssociateFormState = {
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
};

export function RMForm() {
  const [isResigned, setIsResigned] = useState(false);

  return (
    <FormSection
      title="Create RM"
      description="Capture all employment information before assigning dealer consolidations."
    >
      <div className="col-span-full space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField id="empCode" label="EmpCode" placeholder="EmpCode" required />
            <TextField id="joiningDate" label="Joining Date" type="date" required />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TextField id="firstName" label="First Name" placeholder="First Name" required />
            <TextField id="middleName" label="Middle Name" placeholder="Middle Name" />
            <TextField id="lastName" label="Last Name" placeholder="Last Name" required />
            <TextField id="dateOfBirth" label="Date of Birth" type="date" required />
            <TextField id="contactNumber" label="Contact No" placeholder="Contact Number" required />
            <TextField id="emailId" label="Email ID" type="email" placeholder="email id" required />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SelectField
              id="workingOffice"
              label="Working Office"
              placeholder="--None--"
              required
              options={workingOffices.map((office) => ({
                label: office,
                value: office.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none",
              }))}
            />
            <SelectField
              id="department"
              label="Department"
              placeholder="--None--"
              required
              options={departments.map((dept) => ({
                label: dept,
                value: dept.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none",
              }))}
            />
            <SelectField
              id="reportingOffice"
              label="Reporting Office"
              placeholder="--None--"
              required
              options={reportingOffices.map((office) => ({
                label: office,
                value: office.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none",
              }))}
            />
            <SelectField id="reportingManager" label="Reporting Manager" placeholder="--None--" disabled options={[]} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isResigned}
                onChange={(event) => setIsResigned(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
              />
              Resigned
            </label>
            <TextField id="resignationDate" label="Resignation Date" type="date" disabled={!isResigned} required={isResigned} />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700">
            Save RM Details
          </button>
        </div>
      </div>
    </FormSection>
  );
}

export function AssociateForm({
  contextLabel = "Associate Form Submission",
}: {
  contextLabel?: string;
}) {
  const [showPrimaryDetails, setShowPrimaryDetails] = useState(true);
  const [showBankDetails, setShowBankDetails] = useState(true);
  const [isDefaultBank, setIsDefaultBank] = useState(true);
  const [posStatus, setposStatus] = useState<"yes" | "no" | "">("");
  const [associateForm, setAssociateForm] = useState<AssociateFormState>(initialAssociateFormState);

  const updateAssociateForm = (field: keyof AssociateFormState, value: string) => {
    setAssociateForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleposStatusChange = (value: "yes" | "no" | "") => {
    setposStatus(value);
    if (value !== "yes") {
      setAssociateForm((prev) => ({
        ...prev,
        posCode: "",
      }));
    }
  };

  const handleAssociateSubmit = () => {
    const payload = {
      ...associateForm,
      posStatus,
      isDefaultBank,
      posCode: posStatus === "yes" ? associateForm.posCode : "",
    };

    console.log(contextLabel, JSON.stringify(payload, null, 2));
  };

  return (
    <FormSection
      title="Create Associate (POS Entry)"
      description="Capture POS partner identity, documentation, and settlement preferences."
    >
      <div className="col-span-full space-y-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPrimaryDetails((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-bold text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
          >
            {showPrimaryDetails ? "−" : "+"}
          </button>
          <span className="text-sm font-semibold text-slate-700">Primary Details</span>
        </div>

        {showPrimaryDetails && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <TextField
                id="brokerCode"
                label="Broker Code"
                placeholder="Broker Code"
                required
                value={associateForm.brokerCode}
                onChange={(event) => updateAssociateForm("brokerCode", event.target.value)}
              />
              <TextField
                id="brokerName"
                label="Broker Name"
                placeholder="Broker Name"
                required
                value={associateForm.brokerName}
                onChange={(event) => updateAssociateForm("brokerName", event.target.value)}
              />
              <TextField
                id="brokerPan"
                label="PAN Number"
                placeholder="PAN Number"
                required
                value={associateForm.brokerPan}
                onChange={(event) => updateAssociateForm("brokerPan", event.target.value)}
              />
              <TextField
                id="aadhaarNumber"
                label="AADHAR No"
                placeholder="AADHAR No"
                required
                value={associateForm.aadhaarNumber}
                onChange={(event) => updateAssociateForm("aadhaarNumber", event.target.value)}
              />
              <TextField
                id="contactPerson"
                label="Contact Person"
                placeholder="Contact Person"
                required
                value={associateForm.contactPerson}
                onChange={(event) => updateAssociateForm("contactPerson", event.target.value)}
              />
              <TextField
                id="contactNumber"
                label="Contact Number"
                placeholder="Contact Number"
                required
                value={associateForm.contactNumber}
                onChange={(event) => updateAssociateForm("contactNumber", event.target.value)}
              />
              <TextField
                id="contactEmail"
                label="Email ID"
                type="email"
                placeholder="Email ID"
                required
                value={associateForm.contactEmail}
                onChange={(event) => updateAssociateForm("contactEmail", event.target.value)}
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
              />
              {posStatus === "yes" && (
                <TextField
                  id="posCode"
                  label="pos Code"
                  placeholder="pos Code"
                  required={posStatus === "yes"}
                  value={associateForm.posCode}
                  onChange={(event) => updateAssociateForm("posCode", event.target.value)}
                />
              )}
              <SelectField
                id="brokerState"
                label="Broker State"
                placeholder="Select State"
                value={associateForm.brokerState}
                onChange={(event) => updateAssociateForm("brokerState", event.target.value)}
                options={indianStates.map((state) => ({
                  label: state,
                  value: state,
                }))}
              />
              <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-slate-700">
                <span>Broker Communication Address</span>
                <textarea
                  id="brokerAddress"
                  placeholder="Broker Communication Address"
                  className="min-h-[100px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100"
                  value={associateForm.brokerAddress}
                  onChange={(event) => updateAssociateForm("brokerAddress", event.target.value)}
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
              />
              <TextField
                id="beneficiaryName"
                label="Name as in Bank Account"
                placeholder="Name as in Bank Account"
                required
                value={associateForm.beneficiaryName}
                onChange={(event) => updateAssociateForm("beneficiaryName", event.target.value)}
              />
              <TextField
                id="accountNumber"
                label="Account No"
                placeholder="Account No"
                required
                value={associateForm.accountNumber}
                onChange={(event) => updateAssociateForm("accountNumber", event.target.value)}
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
              />
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isDefaultBank}
                  onChange={(event) => setIsDefaultBank(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
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
              />
              <SelectField
                id="bankName"
                label="Bank Name"
                placeholder="Select Bank"
                value={associateForm.bankName}
                onChange={(event) => updateAssociateForm("bankName", event.target.value)}
                options={bankNames.map((bank) => ({
                  label: bank,
                  value: bank,
                }))}
              />
              <SelectField
                id="bankState"
                label="Bank State"
                placeholder="Select State"
                value={associateForm.bankState}
                onChange={(event) => updateAssociateForm("bankState", event.target.value)}
                options={indianStates.map((state) => ({
                  label: state,
                  value: state,
                }))}
              />
              <TextField
                id="branchName"
                label="Branch Name"
                placeholder="Branch Name"
                required
                value={associateForm.branchName}
                onChange={(event) => updateAssociateForm("branchName", event.target.value)}
              />
              <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-slate-700">
                <span>Bank Branch Address</span>
                <textarea
                  id="branchAddress"
                  placeholder="Bank Branch Address"
                  className="min-h-[100px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100"
                  value={associateForm.branchAddress}
                  onChange={(event) => updateAssociateForm("branchAddress", event.target.value)}
                />
              </label>
            </div>

            <div className="flex justify-center gap-3">
              <button className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-400 hover:text-blue-600">
                Add Bank
              </button>
              <button className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-400 hover:text-blue-600">
                Show Banking details
              </button>
            </div>

            <div className="h-40 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-400">
              Banking details table preview coming soon.
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAssociateSubmit}
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700"
          >
            Save POS Details
          </button>
        </div>
      </div>
    </FormSection>
  );
}

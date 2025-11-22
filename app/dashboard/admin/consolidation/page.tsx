"use client";

import Link from "next/link";
import { useState } from "react";
import { FileUploadField, FormSection, SelectField, TextField } from "@/components/ui/forms";

const tabs = [
  {
    value: "rm" as const,
    label: "Create RM",
    description: "Capture all employment information before assigning dealer consolidations.",
  },
  {
    value: "associate" as const,
    label: "Create Associate (POS Entry)",
    description: "Capture POS partner identity, documentation, and settlement preferences.",
  },
];

const workingOffices = ["--None--", "Mumbai Head Office", "Delhi Regional Office", "Bengaluru Shared Services"];
const departments = ["--None--", "Business Development", "Operations", "Finance", "Compliance"];
const reportingOffices = ["--None--", "North Zone", "West Zone", "South Zone"];
const reportingManagers = ["--None--", "Anita Verma", "Rahul Saxena", "Karan Oberoi", "Shruti Bhatt"];
const posStatuses = ["--None--", "Active", "Onboarding", "Inactive"];
const posCategories = ["--None--", "Motor", "Health", "Commercial", "Allied Services"];
const bankAccountTypes = ["--None--", "Savings", "Current", "Nodal"];
const settlementModes = ["--None--", "NEFT", "RTGS", "IMPS"];

export default function ConsolidationPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["value"]>("rm");
  const [isResigned, setIsResigned] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(true);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex flex-1 flex-col rounded-xl px-5 py-2.5 text-left transition-all duration-200 ${
                isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="text-sm font-semibold">{tab.label}</span>
              <span className={`text-xs ${isActive ? "text-blue-100" : "text-slate-400"}`}>{tab.description}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "rm" && (
        <FormSection title="Create RM" description="Capture all employment information before assigning dealer consolidations.">
          <TextField id="empCode" label="EmpCode" placeholder="Enter employee code" required />
          <TextField id="joiningDate" label="Joining Date" defaultValue="22-11-2025" placeholder="22-11-2025" required />
          <TextField id="firstName" label="First Name" placeholder="Enter first name" required />
          <TextField id="middleName" label="Middle Name" placeholder="Enter middle name" />
          <TextField id="lastName" label="Last Name" placeholder="Enter last name" required />
          <TextField id="dateOfBirth" label="Date of Birth" placeholder="dd-mm-yyyy" required />
          <TextField id="contactNumber" label="Contact No" type="tel" placeholder="Enter contact number" required />
          <TextField id="emailId" label="Email ID" type="email" placeholder="name@coverscrafter.com" required />
          <SelectField
            id="workingOffice"
            label="Working Office"
            required
            options={workingOffices.map((office) => ({ label: office, value: office.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none" }))}
          />
          <SelectField
            id="department"
            label="Department"
            required
            options={departments.map((dept) => ({ label: dept, value: dept.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none" }))}
          />
          <SelectField
            id="reportingOffice"
            label="Reporting Office"
            required
            options={reportingOffices.map((office) => ({ label: office, value: office.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none" }))}
          />
          <SelectField
            id="reportingManager"
            label="Reporting Manager"
            required
            options={reportingManagers.map((manager) => ({ label: manager, value: manager.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none" }))}
          />
          <label className="col-span-full flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 shadow-sm">
            <span>Resigned</span>
            <button
              type="button"
              onClick={() => setIsResigned((prev) => !prev)}
              className={`relative h-6 w-12 rounded-full transition ${isResigned ? "bg-rose-500" : "bg-slate-300"}`}
            >
              <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${isResigned ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </label>
          <TextField
            id="lastWorkingDate"
            label="Last Working Date"
            placeholder="dd-mm-yyyy"
            disabled={!isResigned}
            required={isResigned}
          />
          <div className="col-span-full flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Save Business</p>
              <p className="text-xs text-slate-500">Persist RM details to start mapping associates.</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard/admin/consolidation/list"
                className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700">
                Save Business
              </button>
            </div>
          </div>
        </FormSection>
      )}

      {activeTab === "associate" && (
        <FormSection title="Create Associate (POS Entry)" description="Capture POS partner identity, documentation, and settlement preferences.">
          <div className="col-span-full flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Details</span>
            <button type="button" className="text-xs font-semibold text-blue-600 transition hover:text-blue-700">
              POS Entry
            </button>
          </div>
          <TextField id="brokerCode" label="Broker Code" placeholder="Enter broker code" required />
          <TextField id="brokerName" label="Broker Name" placeholder="Enter broker name" required />
          <TextField id="panNumber" label="PAN Number" placeholder="Enter PAN number" required />
          <TextField id="panName" label="Name as in PAN" placeholder="Enter name as per PAN" required />
          <TextField id="aadhaarNumber" label="AADHAR Number" placeholder="Enter Aadhaar number" required />
          <TextField id="aadhaarName" label="Name as in AADHAR" placeholder="Enter name as per Aadhaar" required />
          <TextField id="contactPerson" label="Contact Person" placeholder="Enter contact person" required />
          <TextField id="contactPersonNumber" label="Contact Number" type="tel" placeholder="Enter contact number" required />
          <TextField id="contactEmail" label="Email ID" type="email" placeholder="Enter email" required />
          <SelectField
            id="posStatus"
            label="POS Status"
            required
            options={posStatuses.map((status) => ({ label: status, value: status.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none" }))}
          />
          <SelectField
            id="posCategory"
            label="Business Category"
            required
            options={posCategories.map((category) => ({ label: category, value: category.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none" }))}
          />
          <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-slate-700">
            <span>Broker Communication Address</span>
            <textarea
              id="brokerCommunicationAddress"
              placeholder="Enter full address"
              className="min-h-[100px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <div className="col-span-full flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bank Account Details</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowBankDetails((prev) => !prev)}
                className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
              >
                {showBankDetails ? "Hide Banking details" : "Show Banking details"}
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                Add Bank
              </button>
            </div>
          </div>

          {showBankDetails && (
            <>
              <TextField id="beneficiaryPan" label="Beneficiary PAN Number" placeholder="Enter beneficiary PAN" required />
              <TextField id="beneficiaryPanName" label="Name as in PAN" placeholder="Enter name as per PAN" required />
              <TextField id="bankAccountName" label="Name as in Bank Account" placeholder="Enter bank account name" required />
              <TextField id="accountNumber" label="Account Number" placeholder="Enter account number" required />
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-200" />
                Select as Default
              </label>
              <TextField id="ifscCode" label="IFSC Code" placeholder="Enter IFSC code" required />
              <SelectField
                id="bankAccountType"
                label="Account Type"
                required
                options={bankAccountTypes.map((type) => ({ label: type, value: type.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none" }))}
              />
              <SelectField
                id="settlementMode"
                label="Settlement Mode"
                required
                options={settlementModes.map((mode) => ({ label: mode, value: mode.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none" }))}
              />
              <TextField id="branchName" label="Branch Name" placeholder="Enter branch name" required />
              <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-slate-700">
                <span>Bank Branch Address</span>
                <textarea
                  id="bankBranchAddress"
                  placeholder="Enter branch address"
                  className="min-h-[100px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <FileUploadField id="bankProof" name="bankProof" label="Upload Bank Proof" />
            </>
          )}

          <div className="col-span-full flex flex-wrap items-center justify-end gap-3">
            <Link
              href="/dashboard/admin/consolidation/list"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700">
              Save POS Details
            </button>
          </div>
        </FormSection>
      )}
    </div>
  );
}

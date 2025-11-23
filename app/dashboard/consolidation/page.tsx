"use client";

import { useState } from "react";
import { FormSection, SelectField, TextField } from "@/components/ui/forms";

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

export default function ConsolidationPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["value"]>("rm");
  const [isResigned, setIsResigned] = useState(false);
  const [showPrimaryDetails, setShowPrimaryDetails] = useState(true);
  const [showBankDetails, setShowBankDetails] = useState(true);
  const [isDefaultBank, setIsDefaultBank] = useState(true);

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
      )}

      {activeTab === "associate" && (
        <FormSection title="Create Associate (POS Entry)" description="Capture POS partner identity, documentation, and settlement preferences.">
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
                  <TextField id="brokerCode" label="Broker Code" placeholder="Broker Code" required />
                  <TextField id="brokerName" label="Broker Name" placeholder="Broker Name" required />
                  <TextField id="brokerPan" label="PAN Number" placeholder="PAN Number" required />
                  <TextField id="panName" label="Name as in PAN" placeholder="Name as in PAN" required />
                  <TextField id="aadhaarNumber" label="AADHAR No" placeholder="AADHAR No" required />
                  <TextField id="aadhaarName" label="Name as in AADHAR" placeholder="Name as in AADHAR" required />
                  <TextField id="contactPerson" label="Contact Person" placeholder="Contact Person" required />
                  <TextField id="contactNumber" label="Contact Number" placeholder="Contact Number" required />
                  <TextField id="contactEmail" label="Email ID" type="email" placeholder="Email ID" required />
                  <SelectField id="brokerState" label="Broker State" placeholder="--None--" disabled options={[]} />
                  <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-slate-700">
                    <span>Broker Communication Address</span>
                    <textarea
                      id="brokerAddress"
                      placeholder="Broker Communication Address"
                      className="min-h-[100px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100"
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
                  <TextField id="beneficiaryPan" label="Beneficiary PAN Number" placeholder="Beneficiary PAN Number" required />
                  <TextField id="beneficiaryPanName" label="Name as in PAN" placeholder="Name as in PAN" required />
                  <TextField id="beneficiaryName" label="Name as in Bank Account" placeholder="Name as in Bank Account" required />
                  <TextField id="accountNumber" label="Account No" placeholder="Account No" required />
                  <SelectField id="accountType" label="Account Type" placeholder="--None--" disabled options={[]} />
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isDefaultBank}
                      onChange={(event) => setIsDefaultBank(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
                    />
                    Select as Default
                  </label>
                  <TextField id="ifscCode" label="IFSC Code" placeholder="IFSC Code" required />
                  <SelectField id="bankName" label="Bank Name" placeholder="--None--" disabled options={[]} />
                  <SelectField id="bankState" label="Bank State" placeholder="--None--" disabled options={[]} />
                  <TextField id="branchName" label="Branch Name" placeholder="Branch Name" required />
                  <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-slate-700">
                    <span>Bank Branch Address</span>
                    <textarea
                      id="branchAddress"
                      placeholder="Bank Branch Address"
                      className="min-h-[100px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100"
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
              <button className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700">
                Save POS Details
              </button>
            </div>
          </div>
        </FormSection>
      )}
    </div>
  );
}

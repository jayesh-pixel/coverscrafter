"use client";

import { useState } from "react";
import { FileUploadField, SelectField, TextField } from "@/components/ui/forms";

const lineOfBusinessOptions = ["--None--", "Motor", "Health", "Commercial", "Life"];
const productOptions = ["--None--", "Comprehensive", "Third Party", "Package", "Endorsement"];
const channelOptions = ["--None--", "Dealer", "Broker", "Direct", "Online"];
const reportingFyOptions = ["--None--", "FY 2024-25", "FY 2025-26", "FY 2026-27"];
const reportingMonthOptions = ["--None--", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];
const brokers = ["--None--", "Navnit Motors", "Metro Wheels", "Prime Mobility", "Skyline Riders"];

const defaultBusinessEntries = [
  {
    policyNumber: "POL-2025-0001",
    clientName: "Aravind Motors Pvt Ltd",
    registrationNumber: "MH12AB1234",
    reportingMonth: "October",
    reportingFy: "FY 2025-26",
    broker: "Metro Wheels",
    paymentMode: "Online",
    grossPremium: "₹85,000",
  },
  {
    policyNumber: "POL-2025-0007",
    clientName: "Shree Ganesh Logistics",
    registrationNumber: "DL01CD9876",
    reportingMonth: "September",
    reportingFy: "FY 2025-26",
    broker: "Prime Mobility",
    paymentMode: "Cheque",
    grossPremium: "₹1,25,000",
  },
  {
    policyNumber: "POL-2025-0012",
    clientName: "Vishal Enterprises",
    registrationNumber: "KA05EF5643",
    reportingMonth: "August",
    reportingFy: "FY 2025-26",
    broker: "Navnit Motors",
    paymentMode: "Online",
    grossPremium: "₹62,500",
  },
];

interface BusinessEntryManagerProps {
    title?: string;
    description?: string;
    initialShowForm?: boolean;
}

export default function BusinessEntryManager({ 
    title = "Business Entry", 
    description = "Capture policy level business for consolidation.",
    initialShowForm = false
}: BusinessEntryManagerProps) {
  const [paymentMode, setPaymentMode] = useState<"online" | "cheque">("online");
  const [showForm, setShowForm] = useState(initialShowForm);
  const [businessEntries] = useState(defaultBusinessEntries);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700"
            aria-expanded={showForm}
          >
            {showForm ? "Hide Business Entry" : "Create Business Entry"}
          </button>
        </header>

        {showForm && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SelectField
              id="lineOfBusiness"
              label="Line of Business"
              required
              options={lineOfBusinessOptions.map((option) => ({
                label: option,
                value: option.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none",
              }))}
            />
            <TextField id="policyNumber" label="Policy Number" placeholder="Enter policy number" required />
            <TextField id="clientName" label="Client Name" placeholder="Enter client name" required />
            <TextField id="contactNumber" label="Contact Number" type="tel" placeholder="Enter contact number" required />
            <TextField id="emailId" label="Email ID" type="email" placeholder="Enter email" required />
            <SelectField
              id="product"
              label="Product"
              required
              options={productOptions.map((option) => ({
                label: option,
                value: option.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none",
              }))}
            />
            <SelectField
              id="channel"
              label="Channel"
              required
              options={channelOptions.map((option) => ({
                label: option,
                value: option.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none",
              }))}
            />
            <SelectField
              id="subChannel"
              label="Sub Channel"
              required
              options={channelOptions.map((option) => ({
                label: option,
                value: option.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none",
              }))}
            />
            <TextField id="registrationNumber" label="Registration Number" placeholder="Enter vehicle registration" required />
            <TextField id="policyIssueDate" label="Policy Issue Date" type="date" required />
            <TextField id="policyStartDate" label="Policy Start Date" type="date" required />
            <TextField id="policyEndDate" label="Policy End Date" type="date" required />
            <TextField id="policyTpEndDate" label="Policy TP End Date" type="date" required />
            <TextField id="grossPremium" label="Gross Premium" type="number" placeholder="0" required />
            <TextField id="netPremium" label="Net Premium" type="number" placeholder="0" required />
            <TextField id="commissionAmount" label="Commission" type="number" placeholder="0" required />
            <TextField id="gstAmount" label="GST" type="number" placeholder="0" required />
            <SelectField
              id="reportingFy"
              label="Reporting FY"
              required
              options={reportingFyOptions.map((option) => ({
                label: option,
                value: option.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none",
              }))}
            />
            <SelectField
              id="reportingMonth"
              label="Reporting Month"
              required
              options={reportingMonthOptions.map((option) => ({
                label: option,
                value: option.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none",
              }))}
            />
            <SelectField
              id="broker"
              label="Select Broker"
              required
              options={brokers.map((option) => ({
                label: option,
                value: option.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "none",
              }))}
            />
            <div className="col-span-full flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 shadow-sm">
              <span>Payment Mode:</span>
              {[
                { label: "Online", value: "online" as const },
                { label: "Cheque", value: "cheque" as const },
              ].map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setPaymentMode(mode.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    paymentMode === mode.value
                      ? "border-blue-500 bg-blue-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <div className="col-span-full">
              <FileUploadField id="supportingFile" name="supportingFile" label="Supporting Document" />
            </div>
            <div className="col-span-full flex justify-end">
              <button className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700">
                Save Business
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-1 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Business Entries</h2>
          <p className="text-xs font-medium text-slate-500">Review captured policies alongside key consolidation attributes.</p>
        </header>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <input
              type="search"
              placeholder="Search by policy or client"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">⌕</span>
          </div>
          <div className="flex gap-2 text-sm font-medium text-slate-500">
            <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-blue-200 hover:text-blue-600">All</button>
            <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-blue-200 hover:text-blue-600">Online</button>
            <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-blue-200 hover:text-blue-600">Cheque</button>
          </div>
        </div>
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <table className="min-w-[1100px] divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Policy Number</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Client Name</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Registration</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Reporting FY</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Reporting Month</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Broker</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Payment Mode</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Gross Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {businessEntries.map((entry) => (
                <tr key={entry.policyNumber} className="transition hover:bg-blue-50/40">
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{entry.policyNumber}</span>
                      <span className="text-xs uppercase tracking-wide text-slate-400">{entry.registrationNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{entry.clientName}</td>
                  <td className="px-4 py-4 text-slate-600">{entry.registrationNumber}</td>
                  <td className="px-4 py-4 text-slate-600">{entry.reportingFy}</td>
                  <td className="px-4 py-4 text-slate-600">{entry.reportingMonth}</td>
                  <td className="px-4 py-4 text-slate-600">{entry.broker}</td>
                  <td className="px-4 py-4 text-slate-600">{entry.paymentMode}</td>
                  <td className="px-4 py-4 text-slate-600">{entry.grossPremium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

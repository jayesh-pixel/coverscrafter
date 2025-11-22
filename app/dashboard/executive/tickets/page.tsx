"use client";

import { useState } from "react";

export default function TicketsPage() {
  const [policyNumber, setPolicyNumber] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const tickets = [
    {
      status: "Work in Progress",
      createdOn: "07-11-2025 (18:24:25)",
      policyNumber: "2214033125P106711732",
      make: "Bajaj Auto Ltd",
      claimPaymentType: "Customer Reimbursement",
      chassisNumber: "MD2C21AX3RWF13484",
      model: "FREEDOM 125",
      claimsType: "Od Claim",
      updatedOn: "20-11-2025 (16:41:45)",
      dateOfLoss: "03-11-2025",
      customerName: "AMAN AMIR BAGWAN",
      claimNumber: "2214033125C051867001",
      vehicleNumber: "MH51E7492"
    },
    {
      status: "Work in Progress",
      createdOn: "26-09-2025 (18:24:18)",
      policyNumber: "2214033125P100307296",
      make: "Bajaj Auto Ltd",
      claimPaymentType: "Customer Reimbursement",
      chassisNumber: "MD2B54DX1SCL20593",
      model: "PULSAR",
      claimsType: "Od Claim",
      updatedOn: "12-11-2025 (13:05:55)",
      dateOfLoss: "24-09-2025",
      customerName: "SARJERAO SHANKAR BORGAVE",
      claimNumber: "2214033125C051428001",
      vehicleNumber: "MH51E0852"
    },
    {
      status: "Under Settlement",
      createdOn: "25-08-2025 (17:36:39)",
      policyNumber: "2214033124P117587002",
      make: "BAJAJ AUTO",
      claimPaymentType: "Customer Reimbursement",
      chassisNumber: "MD2B63AX0RWH32611",
      model: "PLATINA 100KS",
      claimsType: "Od Claim",
      updatedOn: "08-10-2025 (16:46:22)",
      dateOfLoss: "23-08-2025",
      customerName: "RAHUL KUMAR",
      claimNumber: "2214033124C048392001",
      vehicleNumber: "MH51D8234"
    }
  ];

  const tabs = [
    { name: "All", count: 9 },
    { name: "Document Pending", count: 0 },
    { name: "Surveyor Allocated", count: 0 },
    { name: "Work in Progress", count: 3 },
    { name: "Claim Settled", count: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Claims Tickets</h1>
        <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          Raise Claim
        </button>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="max-w-md">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Policy Number</label>
          <input
            type="text"
            placeholder="Search..."
            value={policyNumber}
            onChange={(e) => setPolicyNumber(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === tab.name
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.name} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tickets Cards */}
      <div className="space-y-4">
        {tickets.map((ticket, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Status Badge */}
            <div className="mb-4">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                ticket.status === "Work in Progress" 
                  ? "bg-yellow-100 text-yellow-700" 
                  : ticket.status === "Under Settlement"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {ticket.status}
              </span>
            </div>

            {/* Ticket Details Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-500">Created On</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.createdOn}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Policy Number</span>
                  <p className="text-sm font-medium text-blue-600">{ticket.policyNumber}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Make</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.make}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-500">Claim Payment Type</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.claimPaymentType}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Chassis Number</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.chassisNumber}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Model</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.model}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-500">Claims Type</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.claimsType}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Updated On</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.updatedOn}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Date of Loss</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.dateOfLoss}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-500">Customer Name</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.customerName}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Claim Number</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.claimNumber}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Vehicle Number</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.vehicleNumber}</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-4 flex justify-end">
              <button className="rounded-lg border border-blue-600 bg-white px-6 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

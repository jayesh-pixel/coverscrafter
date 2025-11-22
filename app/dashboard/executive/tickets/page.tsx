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

      {/* Tickets Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 whitespace-nowrap">Policy / Claim No</th>
                <th className="px-4 py-3 whitespace-nowrap">Customer / Vehicle</th>
                <th className="px-4 py-3 whitespace-nowrap">Make / Model</th>
                <th className="px-4 py-3 whitespace-nowrap">Dates</th>
                <th className="px-4 py-3 whitespace-nowrap">Type</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((ticket, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 align-top">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      ticket.status === "Work in Progress" 
                        ? "bg-yellow-100 text-yellow-700" 
                        : ticket.status === "Under Settlement"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-blue-600">{ticket.policyNumber}</span>
                      <span className="text-xs text-slate-500">{ticket.claimNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-slate-900">{ticket.customerName}</span>
                      <span className="text-xs text-slate-500">{ticket.vehicleNumber}</span>
                      <span className="text-xs text-slate-400">Chassis: {ticket.chassisNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-900">{ticket.make}</span>
                      <span className="text-xs text-slate-500">{ticket.model}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-slate-700">Created: {ticket.createdOn.split(' ')[0]}</span>
                      <span className="text-slate-500">Updated: {ticket.updatedOn.split(' ')[0]}</span>
                      <span className="text-slate-500">Loss: {ticket.dateOfLoss}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-900">{ticket.claimsType}</span>
                      <span className="text-xs text-slate-500">{ticket.claimPaymentType}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

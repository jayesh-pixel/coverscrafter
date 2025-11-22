"use client";

import { useState } from "react";

export default function FinanciersTicketsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const tickets = [
    {
      status: "Approved",
      createdOn: "16-10-2025 (11:09:40)",
      financierName: "SHRI BHAVESHWARI G B S S PAT SAN LTD",
      insurerName: "United India Insurance Company",
      pincode: "412209",
      city: "PUNE",
      state: "MAHARASHTRA",
      updatedOn: "18-10-2025 (11:54:12)",
      notes: ""
    },
    {
      status: "Rejected",
      createdOn: "14-08-2025 (12:25:11)",
      financierName: "KRUSHNAI MAHILA GBSS PAT SANSTHA MAYA.",
      insurerName: "ANIL DATTATRAY SAPAKAL",
      pincode: "416410",
      city: "SANGLI",
      state: "MAHARASHTRA",
      updatedOn: "25-08-2025 (12:10:19)",
      notes: "PLS SPECIFY WHICH INSURER IS IT TO BE ADDED?"
    }
  ];

  const tabs = [
    { name: "All", count: 2 },
    { name: "In Process", count: 0 },
    { name: "Insurer-Intimated", count: 0 },
    { name: "Approved", count: 1 },
    { name: "Rejected", count: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Financiers Tickets</h1>
        <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          New Financier
        </button>
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
                ticket.status === "Approved" 
                  ? "bg-green-100 text-green-700" 
                  : ticket.status === "Rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
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
                  <span className="text-xs text-slate-500">Financier Name</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.financierName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-500">Insurer Name</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.insurerName}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Pin code</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.pincode}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-500">City</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.city}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">State</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.state}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-500">Updated On</span>
                  <p className="text-sm font-medium text-slate-900">{ticket.updatedOn}</p>
                </div>
              </div>
            </div>

            {/* Notes for Rejected */}
            {ticket.notes && (
              <div className="mt-4 rounded-lg bg-red-50 p-4">
                <p className="text-xs font-semibold text-red-700">Document Requested</p>
                <p className="mt-1 text-sm text-red-600">{ticket.notes}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-4 flex justify-end">
              <button className="rounded-lg border border-blue-600 bg-white px-6 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No More Message */}
      <div className="py-8 text-center">
        <p className="text-sm text-slate-500">No more tickets to load.</p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function OwnerFinanciersTicketsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    { label: "All", count: 2 },
    { label: "In Process", count: 0 },
    { label: "Insurer-Intimated", count: 0 },
    { label: "Approved", count: 1 },
    { label: "Rejected", count: 1 },
  ];

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
      notes: null
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Financiers Tickets</h1>
        <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          New Financier
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.label
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label} ({tab.count})
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
                <th className="px-4 py-3 whitespace-nowrap">Financier Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Insurer Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Location</th>
                <th className="px-4 py-3 whitespace-nowrap">Dates</th>
                <th className="px-4 py-3 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((ticket, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 align-top">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      ticket.status === "Approved" 
                        ? "bg-green-100 text-green-700" 
                        : ticket.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="font-medium text-slate-900">{ticket.financierName}</span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="text-slate-700">{ticket.insurerName}</span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1 text-xs text-slate-600">
                      <span>{ticket.city}, {ticket.state}</span>
                      <span>{ticket.pincode}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-slate-700">Created: {ticket.createdOn.split(' ')[0]}</span>
                      <span className="text-slate-500">Updated: {ticket.updatedOn.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    {ticket.notes && (
                      <div className="max-w-xs rounded bg-red-50 px-2 py-1 text-xs text-red-600 border border-red-100">
                        {ticket.notes}
                      </div>
                    )}
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

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

      {/* Financier Cards */}
      <div className="space-y-4">
        {/* Approved Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-800">Approved</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Created On</div>
              <div className="text-sm font-medium text-slate-900">16-10-2025 (11:09:40)</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs font-semibold uppercase text-slate-500">Financier Name</div>
              <div className="text-sm font-medium text-slate-900">SHRI BHAVESHWARI G B S S PAT SAN LTD</div>
            </div>
            <div className="md:col-span-3">
              <div className="text-xs font-semibold uppercase text-slate-500">Insurer Name</div>
              <div className="text-sm font-medium text-slate-900">United India Insurance Company</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Pin code</div>
              <div className="text-sm font-medium text-slate-900">412209</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">City</div>
              <div className="text-sm font-medium text-slate-900">PUNE</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">State</div>
              <div className="text-sm font-medium text-slate-900">MAHARASHTRA</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Updated On</div>
              <div className="text-sm font-medium text-slate-900">18-10-2025 (11:54:12)</div>
            </div>
          </div>
        </div>

        {/* Rejected Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <span className="rounded-full bg-red-100 px-4 py-1 text-sm font-semibold text-red-800">Rejected</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Created On</div>
              <div className="text-sm font-medium text-slate-900">14-08-2025 (12:25:11)</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs font-semibold uppercase text-slate-500">Financier Name</div>
              <div className="text-sm font-medium text-slate-900">KRUSHNAI MAHILA GBSS PAT SANSTHA MAYA.</div>
            </div>
            <div className="md:col-span-3">
              <div className="text-xs font-semibold uppercase text-slate-500">Insurer Name</div>
              <div className="text-sm font-medium text-slate-900">ANIL DATTATRAY SAPAKAL</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Pin code</div>
              <div className="text-sm font-medium text-slate-900">416410</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">City</div>
              <div className="text-sm font-medium text-slate-900">SANGLI</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">State</div>
              <div className="text-sm font-medium text-slate-900">MAHARASHTRA</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Updated On</div>
              <div className="text-sm font-medium text-slate-900">25-08-2025 (12:10:19)</div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-red-50 p-3">
            <div className="text-sm font-semibold text-red-900">Document Requested</div>
            <div className="mt-1 text-sm text-red-800">PLS SPECIFY WHICH INSURER IS IT TO BE ADDED?</div>
          </div>
        </div>
      </div>
    </div>
  );
}

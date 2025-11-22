"use client";

import { useState } from "react";

export default function OwnerTicketsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    { label: "All", count: null },
    { label: "Requested", count: null },
    { label: "Insurer Intimated", count: null },
    { label: "Approved", count: null },
    { label: "Rejected", count: null },
    { label: "Request Cancelled", count: null },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tickets</h1>
          <p className="text-sm font-semibold text-red-600">Action Required: 2</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Insurance Number</label>
          <input type="text" placeholder="Search..." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Policy Holder Name</label>
          <input type="text" placeholder="Search..." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Chassis No.</label>
          <input type="text" placeholder="Search..." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Date Range</label>
          <input type="date" placeholder="Select Date..." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700" />
        </div>
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
            {tab.label}
            {tab.count !== null && ` (${tab.count})`}
          </button>
        ))}
      </div>

      {/* Ticket Cards */}
      <div className="space-y-3">
        {/* Ticket 1 - Approved */}
        <div className="rounded-lg border border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer Name</div>
              <div className="text-base font-bold text-slate-900">Nivruti Madhukar Koulavkar</div>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 shadow-sm">Approved</span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Insurance No.</div>
              <div className="text-xs text-slate-900">2214033125P111780895/001</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Insurance UID</div>
              <div className="text-xs text-slate-900">AI000359365</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Vehicle</div>
              <div className="text-xs text-slate-900">Bajaj Auto Ltd - PULSAR -NS125 UG WIDER TYRE ¿ JF51 - null</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Engine No.</div>
              <div className="text-xs text-slate-900">JEXCSG07208</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Chassis No.</div>
              <div className="text-xs text-slate-900">MD2B72BX4SCG38986</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Created By</div>
              <div className="text-xs text-slate-900">Badshah Bajaj</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Created On</div>
              <div className="text-xs text-slate-900">05 November 2025 at 11:52:34 pm</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Updated On</div>
              <div className="text-xs text-slate-900">06 November 2025 at 04:58:40 pm</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Ticket ID</div>
              <div className="text-xs text-slate-900">476-E-5137</div>
            </div>
          </div>

          <div className="mt-3 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 p-2.5 border border-blue-200">
            <div className="text-xs font-semibold text-slate-600">Insurer</div>
            <div className="text-sm font-semibold text-slate-900">United India Insurance Company</div>
            <div className="mt-1 text-xs text-slate-700"><span className="font-semibold">endorsement Reason:</span> Personal Details</div>
          </div>

          <div className="mt-3 flex justify-end">
            <button className="text-xs font-semibold text-blue-600 hover:underline">More Info.</button>
          </div>
        </div>

        {/* Ticket 2 - Insurer Intimated */}
        <div className="rounded-lg border border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer Name</div>
              <div className="text-base font-bold text-slate-900">NIKHIL ARUN SOUNDADE</div>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 shadow-sm">Insurer Intimated</span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Insurance No.</div>
              <div className="text-xs text-slate-900">2219043125P104694309</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Insurance UID</div>
              <div className="text-xs text-slate-900">AI000270572</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Vehicle</div>
              <div className="text-xs text-slate-900">Bajaj Auto Ltd - FREEDOM 125 - NG04 DISC LED</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Engine No.</div>
              <div className="text-xs text-slate-900">PFXWRF80517</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Chassis No.</div>
              <div className="text-xs text-slate-900">MD2C21AX3RWF20628</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Created By</div>
              <div className="text-xs text-slate-900">Badshah Bajaj</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Created On</div>
              <div className="text-xs text-slate-900">03 November 2025 at 09:23:37 pm</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Updated On</div>
              <div className="text-xs text-slate-900">10 November 2025 at 10:44:37 pm</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500">Ticket ID</div>
              <div className="text-xs text-slate-900">476-C-876</div>
            </div>
          </div>

          <div className="mt-3 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 p-2.5 border border-blue-200">
            <div className="text-xs font-semibold text-slate-600">Insurer</div>
            <div className="text-sm font-semibold text-slate-900">United India Insurance Company</div>
            <div className="mt-1 text-xs text-slate-700"><span className="font-semibold">cancellation Reason:</span> Vehicle Delivery cancels / Damage in Vehicle</div>
          </div>

          <div className="mt-3 flex justify-end">
            <button className="text-xs font-semibold text-blue-600 hover:underline">More Info.</button>
          </div>
        </div>
      </div>
    </div>
  );
}

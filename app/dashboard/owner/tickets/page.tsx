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

  const tickets = [
    {
      customerName: "Nivruti Madhukar Koulavkar",
      status: "Approved",
      insuranceNo: "2214033125P111780895/001",
      insuranceUid: "AI000359365",
      vehicle: "Bajaj Auto Ltd - PULSAR -NS125 UG WIDER TYRE ¿ JF51 - null",
      engineNo: "JEXCSG07208",
      chassisNo: "MD2B72BX4SCG38986",
      createdBy: "Badshah Bajaj",
      createdOn: "05 November 2025 at 11:52:34 pm",
      updatedOn: "06 November 2025 at 04:58:40 pm",
      ticketId: "476-E-5137",
      insurer: "United India Insurance Company",
      reasonLabel: "endorsement Reason",
      reason: "Personal Details"
    },
    {
      customerName: "NIKHIL ARUN SOUNDADE",
      status: "Insurer Intimated",
      insuranceNo: "2219043125P104694309",
      insuranceUid: "AI000270572",
      vehicle: "Bajaj Auto Ltd - FREEDOM 125 - NG04 DISC LED",
      engineNo: "PFXWRF80517",
      chassisNo: "MD2C21AX3RWF20628",
      createdBy: "Badshah Bajaj",
      createdOn: "03 November 2025 at 09:23:37 pm",
      updatedOn: "10 November 2025 at 10:44:37 pm",
      ticketId: "476-C-876",
      insurer: "United India Insurance Company",
      reasonLabel: "cancellation Reason",
      reason: "Vehicle Delivery cancels / Damage in Vehicle"
    }
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

      {/* Tickets Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 whitespace-nowrap">Customer Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Insurance Details</th>
                <th className="px-4 py-3 whitespace-nowrap">Vehicle Details</th>
                <th className="px-4 py-3 whitespace-nowrap">Dates</th>
                <th className="px-4 py-3 whitespace-nowrap">Insurer / Reason</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((ticket, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 align-top">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      ticket.status === "Approved" 
                        ? "bg-green-100 text-green-700" 
                        : ticket.status === "Insurer Intimated"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {ticket.status}
                    </span>
                    <div className="mt-1 text-xs text-slate-500">ID: {ticket.ticketId}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="font-medium text-slate-900">{ticket.customerName}</span>
                    <div className="text-xs text-slate-500">By: {ticket.createdBy}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="font-medium text-blue-600">{ticket.insuranceNo}</span>
                      <span className="text-slate-500">UID: {ticket.insuranceUid}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-slate-900 line-clamp-2 w-48" title={ticket.vehicle}>{ticket.vehicle}</span>
                      <span className="text-slate-500">Eng: {ticket.engineNo}</span>
                      <span className="text-slate-500">Chas: {ticket.chassisNo}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-slate-700">Created: {ticket.createdOn.split(' at ')[0]}</span>
                      <span className="text-slate-500">Updated: {ticket.updatedOn.split(' at ')[0]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="font-medium text-slate-900">{ticket.insurer}</span>
                      <span className="text-slate-500"><span className="font-semibold">{ticket.reasonLabel}:</span> {ticket.reason}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                      More Info
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

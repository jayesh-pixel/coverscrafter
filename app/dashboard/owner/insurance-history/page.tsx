"use client";

import { useState } from "react";

export default function OwnerInsuranceHistoryPage() {
  const [insuranceNumber, setInsuranceNumber] = useState("");
  const [policyHolderName, setPolicyHolderName] = useState("");
  const [chassisNo, setChassisNo] = useState("");
  const [executive, setExecutive] = useState("All");
  const [status, setStatus] = useState("All");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Insurance History</h1>
        <div className="flex gap-3">
          <button className="rounded-lg border border-green-600 bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
            Export
          </button>
          <button className="rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Insurance Number</label>
            <input
              type="text"
              placeholder="Search..."
              value={insuranceNumber}
              onChange={(e) => setInsuranceNumber(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Policy Holder Name</label>
            <input
              type="text"
              placeholder="Search..."
              value={policyHolderName}
              onChange={(e) => setPolicyHolderName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Chassis No.</label>
            <input
              type="text"
              placeholder="Search..."
              value={chassisNo}
              onChange={(e) => setChassisNo(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Executive</label>
            <select
              value={executive}
              onChange={(e) => setExecutive(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option>All</option>
              <option>Badshah Bajaj</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option>All</option>
              <option>In Process</option>
              <option>Active</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Date Range</label>
            <input
              type="date"
              placeholder="Select Date..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <table className="min-w-[1600px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">UID</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Insurance No.</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Date</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Time</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Insurer</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Risk Start Date</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Risk End Date</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Policy Holder Name</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Engine Number</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Chassis Number</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Vehicle Make - Model - Variant</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Body Type</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Payment Term</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Policy Type</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">New Vehicle</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Amount</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Payout Type</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Payout</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">TDS on Payout</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Payout after TDS</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Net Balance Deduction</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">User Name</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              <tr className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">AI000394002</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">--</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">22-11-2025</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">11:36:12</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">UNITED</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">22-11-2025</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">21-11-2026</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">Dhanaji Dasharath Powar</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">PFXWSG65670</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">MD2C21AXXSWG10378</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">Bajaj Auto Ltd - FREEDOM 125 - NG04 DISC LED</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">Bike</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">--</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">OD1TP5</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">Yes</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">₹ 7,397.00</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">Payout</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">--</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">--</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">--</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">₹ 5738.32</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">Badshah Bajaj</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm"><span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">In Process</span></td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-blue-600">View</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">AI000393302</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">2214033125P113350725</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">21-11-2025</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">12:23:33</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">UNITED</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">21-11-2025</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">20-11-2026</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">Imran Jahangir Khalifa</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">PFXWSH22509</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">MD2A76AX2SWH20489</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">Bajaj Auto Ltd - PLATINA 110 ES CBS BS-VI - null</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">Bike</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">Cut & Pay</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">OD1TP5</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">Yes</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">₹ 6,255.00</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">Payout</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">₹ 1,590.25</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">₹ 31.81</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">₹ 1,558.45</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">₹ 4696.55</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">Badshah Bajaj</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm"><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">Active</span></td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-blue-600">View</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

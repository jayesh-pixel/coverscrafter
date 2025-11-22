"use client";

import { useState } from "react";

export default function InsuranceHistoryPage() {
  const [insuranceNumber, setInsuranceNumber] = useState("");
  const [policyHolderName, setPolicyHolderName] = useState("");
  const [chassisNo, setChassisNo] = useState("");
  const [status, setStatus] = useState("All");

  const policies = [
    {
      uid: "AI000393302",
      insuranceNo: "2214033125P113350725",
      date: "21-11-2025",
      time: "12:23:33",
      insurer: "UNITED",
      riskStart: "21-11-2025",
      riskEnd: "20-11-2026",
      policyHolder: "Imran Jahangir Khalifa",
      engineNo: "PFXWSH22509",
      chassisNo: "MD2A76AX2SWH20489",
      vehicle: "Bajaj Auto Ltd - PLATINA 110 ES CBS BS-VI - null",
      bodyType: "Bike",
      policyType: "OD1TP5",
      newVehicle: "Yes",
      amount: "₹ 6,255.00",
      status: "Active"
    },
    {
      uid: "AI000393037",
      insuranceNo: "2214033125P113326065",
      date: "20-11-2025",
      time: "17:58:47",
      insurer: "UNITED",
      riskStart: "20-11-2025",
      riskEnd: "19-11-2026",
      policyHolder: "Hanmant Dattu Shinde",
      engineNo: "PFXWSE28393",
      chassisNo: "MD2B63AX9SWE31633",
      vehicle: "Bajaj Auto Ltd - PLATINA 100 - ALLOY ES BS6",
      bodyType: "Bike",
      policyType: "OD1TP5",
      newVehicle: "Yes",
      amount: "₹ 6,353.00",
      status: "Active"
    },
    {
      uid: "AI000392879",
      insuranceNo: "2214033125P113314820",
      date: "20-11-2025",
      time: "16:12:03",
      insurer: "UNITED",
      riskStart: "20-11-2025",
      riskEnd: "19-11-2026",
      policyHolder: "Varad Sandeepkumar Yadav",
      engineNo: "PDXCSG75810",
      chassisNo: "MD2B54DX9SCG72193",
      vehicle: "Bajaj Auto Ltd - PULSAR N 160 TD JR45 - null",
      bodyType: "Bike",
      policyType: "OD1TP5",
      newVehicle: "Yes",
      amount: "₹ 11,398.00",
      status: "Active"
    },
    {
      uid: "AI000392785",
      insuranceNo: "2214033125P113310109",
      date: "20-11-2025",
      time: "15:24:35",
      insurer: "UNITED",
      riskStart: "20-11-2025",
      riskEnd: "19-11-2026",
      policyHolder: "Sravan Anant Gurav",
      engineNo: "PFXWSF33465",
      chassisNo: "MD2B63AX7SWF33769",
      vehicle: "Bajaj Auto Ltd - PLATINA 100 - ALLOY ES BS6",
      bodyType: "Bike",
      policyType: "OD1TP5",
      newVehicle: "Yes",
      amount: "₹ 6,353.00",
      status: "Active"
    },
    {
      uid: "AI000392629",
      insuranceNo: "2214033125P113294955",
      date: "20-11-2025",
      time: "12:50:40",
      insurer: "UNITED",
      riskStart: "20-11-2025",
      riskEnd: "19-11-2026",
      policyHolder: "Popat Mahadev Yedake",
      engineNo: "DHXWSG60405",
      chassisNo: "MD2B68BX9SWG05342",
      vehicle: "Bajaj Auto Ltd - PULSAR 1",
      bodyType: "Bike",
      policyType: "OD1TP5",
      newVehicle: "Yes",
      amount: "₹ 7,500.00",
      status: "Active"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Insurance History</h1>
        <div className="flex gap-3">
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Export
          </button>
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option>All</option>
              <option>Active</option>
              <option>Expired</option>
              <option>Cancelled</option>
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
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">UID</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Insurance No.</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Date</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Time</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Insurer</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Risk Start Date</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Risk End Date</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Policy Holder Name</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Engine Number</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Chassis Number</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Vehicle Make - Model - Variant</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Body Type</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Policy Type</th>
                <th className="px-4 py-3 font-semibold text-slate-700">New Vehicle</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Amount</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {policies.map((policy) => (
                <tr key={policy.uid} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600">{policy.uid}</td>
                  <td className="px-4 py-3 font-medium text-blue-600">{policy.insuranceNo}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.date}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.time}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.insurer}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.riskStart}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.riskEnd}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{policy.policyHolder}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.engineNo}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.chassisNo}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.vehicle}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.bodyType}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.policyType}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.newVehicle}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{policy.amount}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-700">View</button>
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

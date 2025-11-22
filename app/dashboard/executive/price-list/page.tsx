"use client";

import { useState } from "react";

export default function PriceListPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const priceList = [
    {
      make: "BAJAJ AUTO",
      model: "AVENGER 160",
      variant: "STREET",
      exShowroom: "110447",
      idv: "104925",
      premium: "11388"
    },
    {
      make: "BAJAJ AUTO",
      model: "AVENGER 220",
      variant: "CRUISE",
      exShowroom: "135569",
      idv: "128791",
      premium: "11893"
    },
    {
      make: "BAJAJ AUTO",
      model: "AVENGER 220",
      variant: "STREET",
      exShowroom: "130932",
      idv: "124386",
      premium: "11850"
    },
    {
      make: "BAJAJ AUTO",
      model: "PULSAR 125",
      variant: "NEON DISC",
      exShowroom: "80180",
      idv: "76171",
      premium: "6557"
    },
    {
      make: "BAJAJ AUTO",
      model: "PULSAR 125",
      variant: "CARBON DISC SPLIT SEAT",
      exShowroom: "88027",
      idv: "83626",
      premium: "6707"
    },
    {
      make: "BAJAJ AUTO",
      model: "PULSAR 125",
      variant: "CARBON DISC SINGLE SEAT",
      exShowroom: "86251",
      idv: "81939",
      premium: "6673"
    },
    {
      make: "BAJAJ AUTO",
      model: "PULSAR NS 125",
      variant: "STD",
      exShowroom: "98045",
      idv: "93143",
      premium: "-"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Price List</h1>
        <div className="flex gap-3">
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Export
          </button>
          <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            Edit
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="max-w-md">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Search here</label>
          <input
            type="text"
            placeholder="Type to search!"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Note */}
      <div className="rounded-lg border-l-4 border-blue-600 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">NOTE :</span> The shown Target Premium is calculated considering addon Nil Depreciation is selected when creating Insurance (in Step 1: Get Premium).
        </p>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Make & Model</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Variant</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Ex-showroom</th>
                <th className="px-4 py-3 font-semibold text-slate-700">IDV</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Premium</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {priceList.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{item.make}</div>
                    <div className="text-slate-600">{item.model}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.variant}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{item.exShowroom}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{item.idv}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{item.premium}</td>
                  <td className="px-4 py-3">
                    <button className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700">
                      Issue Policy
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

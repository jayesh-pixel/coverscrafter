"use client";

import { useState } from "react";

const associates = [
  { id: 1, name: "Rahul Kumar", code: "POS-2024-001", status: "Active", mtdPremium: "₹1.2L", policies: 12 },
  { id: 2, name: "Priya Singh", code: "POS-2024-005", status: "Active", mtdPremium: "₹85K", policies: 8 },
  { id: 3, name: "Amit Sharma", code: "POS-2024-012", status: "Inactive", mtdPremium: "₹0", policies: 0 },
  { id: 4, name: "Sneha Gupta", code: "POS-2024-015", status: "Active", mtdPremium: "₹2.1L", policies: 18 },
];

export default function RMAssociatesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssociates = associates.filter(
    (assoc) =>
      assoc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assoc.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Associates</h1>
          <p className="text-sm text-slate-500">Manage and track your POS partners</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
          Add New Associate
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4">
          <input
            type="text"
            placeholder="Search by name or code..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Associate Name</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">MTD Premium</th>
                <th className="px-6 py-4">Policies (MTD)</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssociates.map((assoc) => (
                <tr key={assoc.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{assoc.name}</td>
                  <td className="px-6 py-4 text-slate-500">{assoc.code}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        assoc.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {assoc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{assoc.mtdPremium}</td>
                  <td className="px-6 py-4 text-slate-600">{assoc.policies}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-xs">View Details</button>
                  </td>
                </tr>
              ))}
              {filteredAssociates.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No associates found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

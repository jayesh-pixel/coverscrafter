"use client";

import { useState } from "react";

export default function WalletTransactionPage() {
  const [user, setUser] = useState("All");
  const [referenceId, setReferenceId] = useState("");
  const [description, setDescription] = useState("All");
  const [status, setStatus] = useState("All");
  const [dateRange, setDateRange] = useState("");

  const transactions = [
    {
      date: "22-11-2025",
      time: "11:36:12",
      username: "Badshah Bajaj",
      description: "Insurance Payout TDS",
      referenceId: "AI000394002",
      policyNo: "--",
      amount: "₹ 33.85",
      status: "Debit",
      closingBalance: "₹ 67131.63",
    },
    {
      date: "22-11-2025",
      time: "11:36:12",
      username: "Badshah Bajaj",
      description: "Insurance Payout",
      referenceId: "AI000394002",
      policyNo: "--",
      amount: "₹ 1,692.53",
      status: "Credit",
      closingBalance: "₹ 67165.48",
    },
    {
      date: "22-11-2025",
      time: "11:36:12",
      username: "Badshah Bajaj",
      description: "New Insurance Issuance",
      referenceId: "AI000394002",
      policyNo: "--",
      amount: "₹ 7,397.00",
      status: "Debit",
      closingBalance: "₹ 65472.95",
    },
    {
      date: "21-11-2025",
      time: "12:23:34",
      username: "Badshah Bajaj",
      description: "Insurance Payout TDS",
      referenceId: "AI000393302",
      policyNo: "2214033125P113350725",
      amount: "₹ 31.81",
      status: "Debit",
      closingBalance: "₹ 72869.95",
    },
    {
      date: "21-11-2025",
      time: "12:23:34",
      username: "Badshah Bajaj",
      description: "Insurance Payout",
      referenceId: "AI000393302",
      policyNo: "2214033125P113350725",
      amount: "₹ 1,590.25",
      status: "Credit",
      closingBalance: "₹ 72901.76",
    },
    {
      date: "21-11-2025",
      time: "12:23:34",
      username: "Badshah Bajaj",
      description: "New Insurance Issuance",
      referenceId: "AI000393302",
      policyNo: "2214033125P113350725",
      amount: "₹ 6,255.00",
      status: "Debit",
      closingBalance: "₹ 71311.51",
    },
    {
      date: "20-11-2025",
      time: "17:58:47",
      username: "Badshah Bajaj",
      description: "Insurance Payout TDS",
      referenceId: "AI000393037",
      policyNo: "2214033125P113326065",
      amount: "₹ 32.30",
      status: "Debit",
      closingBalance: "₹ 77566.51",
    },
    {
      date: "20-11-2025",
      time: "17:58:47",
      username: "Badshah Bajaj",
      description: "Insurance Payout",
      referenceId: "AI000393037",
      policyNo: "2214033125P113326065",
      amount: "₹ 1,615.17",
      status: "Credit",
      closingBalance: "₹ 77598.81",
    },
    {
      date: "20-11-2025",
      time: "17:58:47",
      username: "Badshah Bajaj",
      description: "New Insurance Issuance",
      referenceId: "AI000393037",
      policyNo: "2214033125P113326065",
      amount: "₹ 6,353.00",
      status: "Debit",
      closingBalance: "₹ 75983.64",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Wallet Transaction History</h1>
        <button className="rounded-lg border border-green-600 bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">User</label>
          <select
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          >
            <option>All</option>
            <option>Badshah Bajaj</option>
            <option>Irfan Bagwan</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Reference ID/Policy No</label>
          <input
            type="text"
            placeholder="Search"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
          <select
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          >
            <option>All</option>
            <option>Insurance Payout</option>
            <option>Insurance Payout TDS</option>
            <option>New Insurance Issuance</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          >
            <option>All</option>
            <option>Credit</option>
            <option>Debit</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Date Range</label>
          <input
            type="date"
            placeholder="Select Date"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Username</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Reference Id</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Policy No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{transaction.date}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{transaction.time}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{transaction.username}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{transaction.description}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{transaction.referenceId}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{transaction.policyNo}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{transaction.amount}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        transaction.status === "Credit"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-900">{transaction.closingBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

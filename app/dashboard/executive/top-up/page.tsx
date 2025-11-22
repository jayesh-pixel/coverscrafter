"use client";

import { useState } from "react";

export default function TopUpPage() {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const recentTransactions = [
    { id: "TXN001", date: "20-11-2025", time: "14:30:25", amount: "₹ 10,000", status: "Success", method: "UPI" },
    { id: "TXN002", date: "18-11-2025", time: "11:45:10", amount: "₹ 5,000", status: "Success", method: "Card" },
    { id: "TXN003", date: "15-11-2025", time: "09:20:55", amount: "₹ 15,000", status: "Success", method: "Net Banking" },
    { id: "TXN004", date: "12-11-2025", time: "16:15:30", amount: "₹ 8,000", status: "Failed", method: "UPI" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Wallet Top-Up</h1>
        <p className="mt-1 text-sm text-slate-600">Add funds to your wallet for seamless transactions</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="rounded-2xl border border-slate-200  from-blue-600 to-blue-700 p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-100">Current Wallet Balance</p>
            <p className="mt-2 text-4xl font-bold">₹ 12,450.00</p>
            <p className="mt-1 text-sm text-blue-100">Last updated: 22-11-2025 10:30 AM</p>
          </div>
          <div className="rounded-full bg-white/20 p-4">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Top-Up Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Add Funds</h2>
        
        <div className="mt-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Amount *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-3 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Quick Select</label>
            <div className="grid grid-cols-4 gap-3">
              {["1000", "5000", "10000", "25000"].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className="rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  ₹ {amt}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Payment Method *</label>
            <div className="grid gap-3 md:grid-cols-3">
              {["UPI", "Card", "Net Banking"].map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition ${
                    paymentMethod === method
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-slate-700">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Cancel
            </button>
            <button className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Transaction ID</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Date</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Time</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Amount</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Method</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-blue-600">{txn.id}</td>
                  <td className="px-4 py-3 text-slate-600">{txn.date}</td>
                  <td className="px-4 py-3 text-slate-600">{txn.time}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{txn.amount}</td>
                  <td className="px-4 py-3 text-slate-600">{txn.method}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      txn.status === "Success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {txn.status}
                    </span>
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

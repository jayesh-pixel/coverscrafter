"use client";

import { useMemo, useState } from "react";

const payoutSummary = [
  { month: "November-2025", netPayout: "₹3,03,122.24", claimedPayout: "₹3,03,122.24", unclaimedPayout: "₹0", canRaiseInvoice: true },
  { month: "October-2025", netPayout: "₹5,56,867.86", claimedPayout: "₹5,56,867.86", unclaimedPayout: "₹0", canRaiseInvoice: true },
  { month: "September-2025", netPayout: "₹1,70,958.69", claimedPayout: "₹1,70,958.69", unclaimedPayout: "₹0", canRaiseInvoice: true },
  { month: "August-2025", netPayout: "₹2,45,063.46", claimedPayout: "₹2,45,063.46", unclaimedPayout: "₹0", canRaiseInvoice: true },
  { month: "July-2025", netPayout: "₹1,88,090.55", claimedPayout: "₹1,88,090.55", unclaimedPayout: "₹0", canRaiseInvoice: true },
  { month: "June-2025", netPayout: "₹1,69,168.04", claimedPayout: "₹1,69,168.04", unclaimedPayout: "₹0", canRaiseInvoice: true },
  { month: "May-2025", netPayout: "₹2,45,765.99", claimedPayout: "₹2,45,765.99", unclaimedPayout: "₹0", canRaiseInvoice: true },
  { month: "April-2025", netPayout: "₹3,15,666.32", claimedPayout: "₹3,15,666.32", unclaimedPayout: "₹0", canRaiseInvoice: true },
  { month: "March-2025", netPayout: "₹1,91,054.62", claimedPayout: "₹1,91,054.62", unclaimedPayout: "₹0", canRaiseInvoice: true },
  { month: "February-2025", netPayout: "₹1,01,878.72", claimedPayout: "₹1,01,878.72", unclaimedPayout: "₹0", canRaiseInvoice: false }
];

export default function OwnerInvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSummary = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return payoutSummary;
    }

    return payoutSummary.filter((entry) => entry.month.toLowerCase().includes(query));
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
            <p className="text-sm text-slate-600">Review monthly payout summaries and raise invoices.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Export Summary
            </button>
            <button className="rounded-lg border border-blue-600 bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              Download Statement
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-md flex-1">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Search Month</label>
              <input
                type="text"
                placeholder="e.g. November-2025"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
              All payouts are fully claimed. Raise invoices to reconcile your monthly statements.
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Payout Summary</h2>
          </div>
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            <table className="min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Month-Year</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Net Payout</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Claimed Payout</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Unclaimed Payout</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Raise Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredSummary.map((entry) => (
                  <tr key={entry.month} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{entry.month}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">{entry.netPayout}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">{entry.claimedPayout}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">{entry.unclaimedPayout}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {entry.canRaiseInvoice ? (
                        <button className="rounded-lg border border-blue-600 bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700">
                          Raise Invoice
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">No action required</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredSummary.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-sm text-slate-500">
                      No payout records found for the selected month.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

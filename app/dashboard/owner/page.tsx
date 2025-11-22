"use client";

import { useState } from "react";

export default function OwnerDashboardPage() {
  const [timeline, setTimeline] = useState("Day");

  return (
    <div className="space-y-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-600">Owner Overview</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-slate-700">Timeline</label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option>Day</option>
                <option>Week</option>
                <option>Month</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-slate-700">Date Range</label>
              <input
                type="date"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Select Date..."
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Insurance (CUT & PAY) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-2 text-sm font-semibold text-slate-600">Insurance (CUT & PAY)</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-slate-900">0</div>
              <div className="text-sm font-semibold text-green-600">(100%)</div>
            </div>
          </div>

          {/* Total Business */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-2 text-sm font-semibold text-slate-600">Total Business</div>
            <div className="text-3xl font-bold text-slate-900">₹0/-</div>
          </div>

          {/* Total Payout */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-2 text-sm font-semibold text-slate-600">Total Payout</div>
            <div className="text-3xl font-bold text-slate-900">₹0/-</div>
          </div>

          {/* Endorsed & Cancelled */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-600">Endorsed</div>
                <div className="text-3xl font-bold text-slate-900">0</div>
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-600">Cancelled</div>
                <div className="text-3xl font-bold text-slate-900">0</div>
              </div>
            </div>
          </div>
        </div>

        {/* Policies Expiring Soon Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Policies Expiring soon</h2>
          </div>
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            <table className="min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Previous Policy Id</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Customer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Mobile Number</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">OD Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">TP Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Previous Policy Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2219043124P113488596</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">AUDUMBAR ARUN GAWADE</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">7666710021</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2025-11-24</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2029-11-24</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">OD1TP5</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2219043124P113698138</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">RUSHIKESH BALU KAMBALE</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">9112403182</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2025-11-27</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2029-11-27</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">OD1TP5</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2219043124P113706258</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">MARUTI TUKARAM CHAVAN</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">8530805077</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2025-11-27</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2029-11-27</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">OD1TP5</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">3397-05379014-000-00</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">OMKAR RAJARAM CHAVAN</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">8805050332</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2025-12-01</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2029-12-01</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">OD1TP5</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2214033124P114203166</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">CHANDRAKANT TATOBA KOLAPE</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">8806074167</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2025-12-06</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2029-12-06</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">OD1TP5</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2214033124P114248614</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">SUNITA SARJERAV KHOT</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">9226607736</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2025-12-08</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2029-12-08</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">OD1TP5</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2214033124P114253348</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">AKASHA SHANKAR NAIK</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">7666594548</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2025-12-08</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2029-12-08</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">OD1TP5</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2214033124P114402226</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">RANI DATTATRAY RUPNAR</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">8857091102</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2025-12-10</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">2029-12-10</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">OD1TP5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

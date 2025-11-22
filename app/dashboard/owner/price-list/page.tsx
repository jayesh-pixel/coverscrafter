"use client";

import { useState } from "react";

export default function OwnerPriceListPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Price List</h1>
        <div className="flex gap-3">
          <button className="rounded-lg border border-green-600 bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
            Export
          </button>
          <button className="rounded-lg border border-blue-600 bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            Edit
          </button>
        </div>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Type to search!"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700"
        />
      </div>

      {/* Note Banner */}
      <div className="rounded-lg bg-blue-100 p-4">
        <p className="text-sm font-semibold text-blue-900">
          <span className="font-bold">NOTE :</span> The shown Target Premium is calculated considering addon Nil Depreciation is selected when creating Insurance (in Step 1: Get Premium).
        </p>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Make & Model</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Variant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Ex-showroom</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">IDV</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Premium</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-900">BAJAJ AUTO</div>
                  <div className="text-sm text-slate-600">AVENGER 160</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">STREET</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">110447</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">104925</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">11388</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                    Issue Policy
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-900">BAJAJ AUTO</div>
                  <div className="text-sm text-slate-600">AVENGER 220</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">CRUISE</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">135569</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">128791</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">11893</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                    Issue Policy
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-900">BAJAJ AUTO</div>
                  <div className="text-sm text-slate-600">AVENGER 220</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">STREET</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">130932</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">124386</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">11850</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                    Issue Policy
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-900">BAJAJ AUTO</div>
                  <div className="text-sm text-slate-600">PULSAR 125</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">NEON DISC</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">80180</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">76171</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">6557</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                    Issue Policy
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-900">BAJAJ AUTO</div>
                  <div className="text-sm text-slate-600">PULSAR 125</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">CARBON DISC SPLIT SEAT</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">88027</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">83626</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">6707</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                    Issue Policy
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

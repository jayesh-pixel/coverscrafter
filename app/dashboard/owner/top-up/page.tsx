"use client";

export default function TopUpPage() {
  const payoutSummary = [
    {
      month: "November-2025",
      netPayout: "₹3,03,122.24",
      claimedPayout: "₹3,03,122.24",
      unclaimedPayout: "₹0",
    },
    {
      month: "October-2025",
      netPayout: "₹5,56,867.86",
      claimedPayout: "₹5,56,867.86",
      unclaimedPayout: "₹0",
    },
    {
      month: "September-2025",
      netPayout: "₹1,70,958.69",
      claimedPayout: "₹1,70,958.69",
      unclaimedPayout: "₹0",
    },
    {
      month: "August-2025",
      netPayout: "₹2,45,063.46",
      claimedPayout: "₹2,45,063.46",
      unclaimedPayout: "₹0",
    },
    {
      month: "July-2025",
      netPayout: "₹1,88,090.55",
      claimedPayout: "₹1,88,090.55",
      unclaimedPayout: "₹0",
    },
    {
      month: "June-2025",
      netPayout: "₹1,69,168.04",
      claimedPayout: "₹1,69,168.04",
      unclaimedPayout: "₹0",
    },
    {
      month: "May-2025",
      netPayout: "₹2,45,765.99",
      claimedPayout: "₹2,45,765.99",
      unclaimedPayout: "₹0",
    },
    {
      month: "April-2025",
      netPayout: "₹3,15,666.32",
      claimedPayout: "₹3,15,666.32",
      unclaimedPayout: "₹0",
    },
    {
      month: "March-2025",
      netPayout: "₹1,91,054.62",
      claimedPayout: "₹1,91,054.62",
      unclaimedPayout: "₹0",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Payout Summary</h1>
      </div>

      {/* Table */}
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <table className="min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Month-Year
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Net Payout
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Claimed Payout
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Unclaimed Payout
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Raise Invoice
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {payoutSummary.map((payout, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-900">
                    {payout.month}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{payout.netPayout}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{payout.claimedPayout}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{payout.unclaimedPayout}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <button className="rounded-lg border border-blue-600 bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700">
                      Raise Invoice
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

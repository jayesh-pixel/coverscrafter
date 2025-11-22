import Link from "next/link";

const dealers = [
  {
    name: "Metro Motors",
    code: "MD-001",
    city: "Mumbai",
    state: "Maharashtra",
    createdAt: "12 Sep 2025",
    status: "Active",
    walletSharing: "Yes",
    rm: "Priya Sharma",
    subDealers: 8,
  },
  {
    name: "Prime Wheels",
    code: "MD-002",
    city: "Bengaluru",
    state: "Karnataka",
    createdAt: "03 Aug 2025",
    status: "Onboarding",
    walletSharing: "No",
    rm: "Amit Rao",
    subDealers: 5,
  },
  {
    name: "Speed Auto",
    code: "MD-003",
    city: "Delhi",
    state: "Delhi",
    createdAt: "21 Jul 2025",
    status: "Pending Docs",
    walletSharing: "Yes",
    rm: "Divya Singh",
    subDealers: 3,
  },
  {
    name: "Skyline Riders",
    code: "MD-004",
    city: "Pune",
    state: "Maharashtra",
    createdAt: "11 Jun 2025",
    status: "Active",
    walletSharing: "Yes",
    rm: "Amit Rao",
    subDealers: 6,
  },
];

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Onboarding: "bg-blue-100 text-blue-700",
  "Pending Docs": "bg-amber-100 text-amber-700",
};

export default function DealersListPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-blue-600">Dealer registry</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Master Dealer List</h1>
          <p className="text-sm text-slate-500">Monitor wallet sharing, onboarding status, and RM assignments at a glance.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/dealers"
            className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
          >
            Create new dealer
          </Link>
          <button className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            Export CSV
          </button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <input
              type="search"
              placeholder="Search by dealer name or code"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">⌕</span>
          </div>
          <div className="flex gap-2 text-sm font-medium text-slate-500">
            <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-blue-200 hover:text-blue-600">All</button>
            <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-blue-200 hover:text-blue-600">Active</button>
            <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-blue-200 hover:text-blue-600">Pending</button>
          </div>
        </div>

        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <table className="min-w-[1100px] divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Dealer</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Location</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Wallet sharing</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Assigned RM</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Sub dealers</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dealers.map((dealer) => (
                <tr key={dealer.code} className="transition hover:bg-blue-50/40">
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{dealer.name}</span>
                      <span className="text-xs uppercase tracking-wide text-slate-400">{dealer.code}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {dealer.city}, {dealer.state}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[dealer.status] ?? "bg-slate-100 text-slate-600"}`}>
                      {dealer.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{dealer.walletSharing}</td>
                  <td className="px-4 py-4 text-slate-600">{dealer.rm}</td>
                  <td className="px-4 py-4 text-slate-600">{dealer.subDealers}</td>
                  <td className="px-4 py-4 text-slate-600">{dealer.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

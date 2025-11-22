import Link from "next/link";

const stats = [
  { label: "Active dealers", value: "128", trend: "+12 this week" },
  { label: "Pending KYCs", value: "14", trend: "3 require review" },
  { label: "Documents verified", value: "412", trend: "+38 files today" },
];

const worklist = [
  {
    title: "BAJAJ Auto East",
    status: "Awaiting GST doc",
    owner: "S. Garud",
    eta: "2h",
  },
  {
    title: "Metro Honda",
    status: "Banking check",
    owner: "A. Iyer",
    eta: "6h",
  },
  {
    title: "Swift Wheels",
    status: "RTO confirmation",
    owner: "D. Kumar",
    eta: "Today",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-3xl border border-transparent bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-3xl font-semibold text-slate-900">{stat.value}</span>
              <span className="text-xs font-medium text-emerald-500">{stat.trend}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <header className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-blue-500">Master Dealer</p>
              <h2 className="text-2xl font-semibold text-slate-900">Onboarding Workspace</h2>
              <p className="text-sm text-slate-500">Capture KYC, banking, and OEM preferences in one guided form.</p>
            </div>
            <Link
              href="/dashboard/dealers"
              className="inline-flex items-center justify-center rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400"
            >
              Create Master Dealer
            </Link>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">What you capture</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• Corporate and promoter details</li>
                <li>• Multi-role contacts (Owner, Executive)</li>
                <li>• Mandatory banking evidences</li>
                <li>• OEM preferences + RTO coverage</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-linear-to-br from-blue-500 to-indigo-500 p-6 text-white">
              <h3 className="text-lg font-semibold">Pre-checklist</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>✓ GST & PAN images</li>
                <li>✓ Cancelled cheque (high-res)</li>
                <li>✓ Owner + executive proof</li>
                <li>✓ City/State mapping from CRM</li>
              </ul>
            </div>
          </div>
        </article>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Today&apos;s worklist</h3>
          <p className="text-sm text-slate-500">Quick assist queue from onboarding logic.</p>
          <ul className="mt-6 space-y-4">
            {worklist.map((item) => (
              <li key={item.title} className="rounded-2xl border border-slate-100 p-4">
                <p className="text-base font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-amber-600">{item.status}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Owner: {item.owner}</span>
                  <span>ETA: {item.eta}</span>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}

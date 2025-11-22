"use client";

import Link from "next/link";

const stats = [
  { label: "Total Premium (MTD)", value: "₹12.5L", change: "+15%", trend: "up" },
  { label: "Active Associates", value: "8", change: "+2", trend: "up" },
  { label: "Policies Booked", value: "145", change: "+12%", trend: "up" },
  { label: "Pending Approvals", value: "3", change: "-1", trend: "down" },
];

const recentActivity = [
  { id: 1, desc: "New policy booked by Aarav Desai", time: "2 hours ago", amount: "₹25,000" },
  { id: 2, desc: "Associate Neha Kulkarni onboarded", time: "5 hours ago", amount: "-" },
  { id: 3, desc: "Claim payout processed for Client X", time: "1 day ago", amount: "₹1.2L" },
  { id: 4, desc: "Monthly consolidation report generated", time: "2 days ago", amount: "-" },
];

export default function RMOverviewPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
              <span className={`text-xs font-semibold ${stat.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <header className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Team Performance</h2>
            <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </header>
          <div className="h-64 w-full rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 text-sm">
            Chart Placeholder (Premium vs Target)
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <header className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <Link href="/dashboard/rm/business" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </header>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="relative mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500">
                  <div className="absolute -inset-1 animate-ping rounded-full bg-blue-400 opacity-20"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{activity.desc}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span>{activity.time}</span>
                    {activity.amount !== "-" && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{activity.amount}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

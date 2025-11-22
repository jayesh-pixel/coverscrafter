"use client";

import Link from "next/link";

const stats = [
  { label: "My Premium (MTD)", value: "₹4.2L", change: "+8%", trend: "up" },
  { label: "Policies Booked", value: "42", change: "+5%", trend: "up" },
  { label: "Commission Earned", value: "₹63K", change: "+10%", trend: "up" },
  { label: "Pending Entries", value: "1", change: "0", trend: "neutral" },
];

const recentActivity = [
  { id: 1, desc: "Policy #POL-2025-0012 approved", time: "1 hour ago", amount: "₹62,500" },
  { id: 2, desc: "New business entry created", time: "3 hours ago", amount: "₹85,000" },
  { id: 3, desc: "Commission payout received", time: "2 days ago", amount: "₹12,400" },
];

export default function AssociateOverviewPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
              <span className={`text-xs font-semibold ${stat.trend === "up" ? "text-emerald-600" : stat.trend === "down" ? "text-rose-600" : "text-slate-600"}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <header className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Performance Trend</h2>
            <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </header>
          <div className="h-64 w-full rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 text-sm">
            Chart Placeholder (Monthly Premium)
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <header className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Updates</h2>
            <Link href="/dashboard/associate/business" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </header>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="relative mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500">
                  <div className="absolute -inset-1 animate-ping rounded-full bg-emerald-400 opacity-20"></div>
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

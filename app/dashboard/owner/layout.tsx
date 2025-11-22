import OwnerSidebar from "@/components/layout/OwnerSidebar";
import { ReactNode } from "react";

export default function OwnerDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <OwnerSidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex flex-col gap-4 border-b border-slate-200 bg-white/90 px-6 py-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">CoversCrafter</p>
            <h1 className="text-2xl font-semibold text-slate-900">Owner Operations</h1>
            <p className="text-sm text-slate-500">Track cashflow, tickets, and insurer performance across the network.</p>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
            Portfolio stable
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}

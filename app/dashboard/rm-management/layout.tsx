import Sidebar, { ConsolidationIcon, NavItem } from "@/components/layout/Sidebar";
import { ReactNode } from "react";

const consolidationNavItems: NavItem[] = [
  {
    label: "rm/associate",
    href: "/dashboard/rm-management",
    icon: ConsolidationIcon,
    children: [
      { label: "Create rm/associate", href: "/dashboard/rm-management" },
      { label: "rm/associate List", href: "/dashboard/rm-management/list" },
      { label: "Business Entry", href: "/dashboard/rm-management/business" },
      { label: "Broker Registry", href: "/dashboard/rm-management/brokers" },
    ],
  },
];

export default function ConsolidationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar navItems={consolidationNavItems} />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex flex-col gap-4 border-b border-slate-200 bg-white/90 px-6 py-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">CoversCrafter</p>
            <h1 className="text-2xl font-semibold text-slate-900">Rm-management</h1>
            <p className="text-sm text-slate-500">Manage rm/associate entries and lists.</p>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
            All systems operational
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}

import { ReactNode } from "react";

export function PlaceholderPanel({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {children && <div className="mt-4">{children}</div>}
    </section>
  );
}

export function PlaceholderStatGrid({ items }: { items: Array<{ label: string; value: string; trend?: string }> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
          {item.trend && <p className="text-xs text-slate-500">{item.trend}</p>}
        </div>
      ))}
    </div>
  );
}

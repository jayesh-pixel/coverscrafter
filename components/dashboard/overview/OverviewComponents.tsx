"use client";

import { ReactNode } from "react";

export const palette = [
  "#2563eb",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
];

export const numberFormatter = new Intl.NumberFormat("en-IN");
export const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-blue-500">Overview</p>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}

export function PieChart({
  data,
}: {
  data: Array<{ label: string; value: number; color: string }>;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulative = 0;

  if (!total) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
        No data
      </div>
    );
  }

  return (
    <svg viewBox="0 0 120 120" className="h-48 w-48">
      {data.map((segment) => {
        const startAngle = (cumulative / total) * Math.PI * 2;
        cumulative += segment.value;
        const endAngle = (cumulative / total) * Math.PI * 2;
        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

        const radius = 55;
        const cx = 60;
        const cy = 60;

        const startX = cx + radius * Math.cos(startAngle);
        const startY = cy + radius * Math.sin(startAngle);
        const endX = cx + radius * Math.cos(endAngle);
        const endY = cy + radius * Math.sin(endAngle);

        const pathData = [
          `M ${cx} ${cy}`,
          `L ${startX} ${startY}`,
          `A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`,
          "Z",
        ].join(" ");

        const percentage = ((segment.value / total) * 100).toFixed(1);

        return (
          <path
            key={segment.label}
            d={pathData}
            fill={segment.color}
            stroke="white"
            strokeWidth={0.8}
            className="transition-opacity duration-200 hover:opacity-80"
          >
            <title>{`${segment.label}: ${segment.value} (${percentage}%)`}</title>
          </path>
        );
      })}
    </svg>
  );
}

export function Legend({
  items,
  valueFormatter = (value: number) => currencyFormatter.format(value),
  showDetails = false,
}: {
  items: Array<{ label: string; value: number; color: string; count?: number }>;
  valueFormatter?: (value: number) => string;
  showDetails?: boolean;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  return (
    <ul className="space-y-2 text-sm text-slate-700">
      {items.map((item) => (
        <li
          key={item.label}
          className="group relative flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex h-3 w-3 rounded-full transition-transform duration-200 group-hover:scale-125" style={{ backgroundColor: item.color }} />
            <div>
              <p className="font-medium text-slate-900">{item.label}</p>
              {!showDetails && <p className="text-xs text-slate-500">{item.count ?? 0} policies</p>}
            </div>
          </div>
          {!showDetails ? (
            <div className="text-right">
              <p className="font-semibold text-slate-900">{valueFormatter(item.value)}</p>
              <p className="text-[11px] text-slate-500">{((item.value / total) * 100).toFixed(1)}%</p>
            </div>
          ) : null}
          {showDetails && (
            <div className="absolute left-0 top-full z-10 mt-1 hidden w-full rounded-lg border border-slate-200 bg-white p-3 shadow-lg group-hover:block">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Policies:</span>
                  <span className="font-semibold text-slate-900">{item.count ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Value:</span>
                  <span className="font-semibold text-slate-900">{valueFormatter(item.value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Share:</span>
                  <span className="font-semibold text-slate-900">{((item.value / total) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function MiniBarChart({
  data,
  color,
  valueFormatter,
  emptyMessage,
}: {
  data: Array<{ label: string; value: number }>;
  color: string;
  valueFormatter: (value: number) => string;
  emptyMessage: string;
}) {
  if (!data.length) {
    return <p className="text-sm text-slate-500">{emptyMessage}</p>;
  }

  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="flex items-end gap-3">
      {data.map((item) => {
        const height = (item.value / maxValue) * 100;
        return (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2 text-xs text-slate-600">
            <div className="relative flex h-32 w-full items-end rounded-lg bg-slate-50">
              <div
                className="w-full rounded-lg"
                style={{ height: `${height}%`, backgroundColor: color }}
                title={`${item.label}: ${valueFormatter(item.value)}`}
              />
            </div>
            <span className="font-semibold text-slate-800">{valueFormatter(item.value)}</span>
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { HiChartBar, HiUserGroup } from "react-icons/hi2";
import { SectionCard, MetricCard, PieChart, MiniBarChart, palette, numberFormatter, currencyFormatter, IndiaHeatMap } from "@/components/dashboard/overview";
import { getBusinessEntries, type BusinessEntry } from "@/lib/api/businessentry";
import { getValidAuthToken } from "@/lib/utils/storage";

type DistributionItem = {
  label: string;
  value: number;
  count: number;
};

type MonthlyStat = {
  label: string;
  count: number;
  premium: number;
  revenue: number;
};

function parseAmount(value?: string) {
  if (!value) return 0;
  const cleaned = value.replace(/,/g, "");
  const amount = parseFloat(cleaned);
  return Number.isFinite(amount) ? amount : 0;
}

function derivePremium(entry: BusinessEntry) {
  const candidates = [entry.netPremium, entry.grossPremium, entry.totalPayin, entry.totalPayout];
  for (const candidate of candidates) {
    const amount = parseAmount(candidate as string | undefined);
    if (amount) return amount;
  }
  return 0;
}

function deriveRevenue(entry: BusinessEntry) {
  const revenue = parseAmount(entry.netRevenue);
  if (revenue) return revenue;

  const payin = parseAmount(entry.netPremiumPayin ?? entry.totalPayin);
  const payout = parseAmount(entry.netPremiumPayout ?? entry.totalPayout);
  if (payin || payout) return payin - payout;

  return derivePremium(entry);
}

function getEntryDate(entry: BusinessEntry) {
  const dateStr = entry.policyIssueDate || entry.policyStartDate || entry.createdAt;
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildDistribution(entries: BusinessEntry[], labelFn: (entry: BusinessEntry) => string): DistributionItem[] {
  const map = new Map<string, DistributionItem>();
  for (const entry of entries) {
    const label = labelFn(entry) || "Unmapped";
    const revenue = deriveRevenue(entry);
    const current = map.get(label) ?? { label, value: 0, count: 0 };
    current.value += revenue;
    current.count += 1;
    map.set(label, current);
  }
  return Array.from(map.values()).sort((a, b) => b.value - a.value || b.count - a.count);
}

function toPieData(items: DistributionItem[]) {
  if (!items.length) return [] as DistributionItem[];
  const top = items.slice(0, 5);
  const others = items.slice(5);
  const otherValue = others.reduce((sum, item) => sum + item.value, 0);
  const otherCount = others.reduce((sum, item) => sum + item.count, 0);
  const data = [...top];
  if (otherValue > 0) {
    data.push({ label: "Others", value: otherValue, count: otherCount });
  }
  return data;
}

export default function BusinessOverviewPage() {
  const [activeTab, setActiveTab] = useState<"business" | "breakdown" | "statistics">("business");
  const [breakdownTab, setBreakdownTab] = useState<"insurer" | "broker" | "state" | "rm" | "associate" | "product">("insurer");
  const [entries, setEntries] = useState<BusinessEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessMetric, setBusinessMetric] = useState<"revenue" | "count">("revenue");
  const [timeline, setTimeline] = useState<"day" | "week" | "month">("day");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loadEntries = async (withSpinner = true) => {
    try {
      if (withSpinner) setIsLoading(true);
      setError(null);
      const token = await getValidAuthToken();
      if (!token) {
        throw new Error("Session expired. Please sign in again.");
      }
      const data = await getBusinessEntries(token);
      setEntries(data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load business data.";
      setError(message);
    } finally {
      if (withSpinner) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadEntries(true);
  }, []);

  const filteredEntries = useMemo(() => {
    if (!startDate && !endDate) return entries;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return entries.filter((entry) => {
      const date = getEntryDate(entry);
      if (!date) return false;
      if (start && date < start) return false;
      if (end) {
        const endDay = new Date(end);
        endDay.setHours(23, 59, 59, 999);
        if (date > endDay) return false;
      }
      return true;
    });
  }, [entries, startDate, endDate]);

  const totals = useMemo(() => {
    const totalPolicies = filteredEntries.length;
    const totalPremium = filteredEntries.reduce((sum, entry) => sum + derivePremium(entry), 0);
    const totalRevenue = filteredEntries.reduce((sum, entry) => sum + deriveRevenue(entry), 0);
    const avgTicket = totalPolicies ? totalPremium / totalPolicies : 0;

    return {
      totalPolicies,
      totalPremium,
      totalRevenue,
      avgTicket,
    };
  }, [filteredEntries]);

  const timelineStats = useMemo<MonthlyStat[]>(() => {
    const map = new Map<string, MonthlyStat>();

    const getBucketKey = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      if (timeline === "day") {
        return { key: `${year}-${month + 1}-${day}`, label: date.toLocaleDateString("en-US", { day: "2-digit", month: "short" }) };
      }
      if (timeline === "week") {
        const weekStart = new Date(date);
        const dayOfWeek = (weekStart.getDay() + 6) % 7;
        weekStart.setDate(weekStart.getDate() - dayOfWeek);
        const label = `${weekStart.toLocaleDateString("en-US", { day: "2-digit", month: "short" })}`;
        return { key: `W-${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`, label: `Week of ${label}` };
      }
      return {
        key: `${year}-${month + 1}`,
        label: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      };
    };

    for (const entry of filteredEntries) {
      const date = getEntryDate(entry);
      if (!date) continue;
      const bucket = getBucketKey(date);
      const current = map.get(bucket.key) ?? { label: bucket.label, count: 0, premium: 0, revenue: 0 };
      current.count += 1;
      current.premium += derivePremium(entry);
      current.revenue += deriveRevenue(entry);
      map.set(bucket.key, current);
    }

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, value]) => value)
      .slice(-6);
  }, [filteredEntries, timeline]);

  const brokerDistribution = useMemo(() => buildDistribution(filteredEntries, (entry) => entry.brokerData?.brokername || entry.brokerid || "Unmapped Broker"), [filteredEntries]);
  const insurerDistribution = useMemo(() => buildDistribution(filteredEntries, (entry) => entry.insuranceCompany || "Unmapped Insurer"), [filteredEntries]);
  const stateDistribution = useMemo(() => buildDistribution(filteredEntries, (entry) => entry.state || "Unknown State"), [filteredEntries]);

  const brokerPie = useMemo(() => toPieData(brokerDistribution), [brokerDistribution]);
  const insurerPie = useMemo(() => toPieData(insurerDistribution), [insurerDistribution]);

  const topBrokers = brokerDistribution.slice(0, 5);
  const topInsurers = insurerDistribution.slice(0, 5);

  const stateHeatMapData = useMemo(() => {
    return stateDistribution.map(item => ({
      name: item.label,
      code: item.label.substring(0, 2).toUpperCase(),
      value: businessMetric === "count" ? item.count : item.value,
      count: item.count,
    }));
  }, [stateDistribution, businessMetric]);

  const refresh = async () => {
    setIsRefreshing(true);
    await loadEntries(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-blue-500">Dashboard</p>
          <h1 className="text-2xl font-semibold text-slate-900">Business Overview</h1>
          <p className="text-sm text-slate-500">Graphical snapshot of policies, revenue, and partner contribution.</p>
        </div>
        <button
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-60"
          disabled={isRefreshing}
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Policies" value={numberFormatter.format(totals.totalPolicies)} helper="Count of policies in the period" />
        <MetricCard label="Total Premium" value={currencyFormatter.format(totals.totalPremium)} helper="Summed net premium" />
        <MetricCard label="Net Revenue" value={currencyFormatter.format(totals.totalRevenue)} helper="Net of pay-in and pay-out" />
        <MetricCard label="Avg Ticket" value={currencyFormatter.format(totals.avgTicket || 0)} helper="Premium per policy" />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm max-w-xl">
        {[
          { value: "business" as const, label: "Business Statistics", icon: HiChartBar },
          { value: "breakdown" as const, label: "By Business", icon: HiUserGroup },
          { value: "statistics" as const, label: "Team Statistics", icon: HiUserGroup },
        ].map((tab) => {
          const isActive = activeTab === tab.value;
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "business" && (
        <>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-blue-600">Business in</label>
            <select
              value={businessMetric}
              onChange={(e) => setBusinessMetric(e.target.value as "revenue" | "count")}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="count">Numbers</option>
              <option value="revenue">Revenue</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-semibold text-blue-600">Date Range</label>
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left text-sm text-slate-800 shadow-sm outline-none hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {startDate && endDate
                  ? `${new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                  : "Select date range"}
              </button>
              {showDatePicker && (
                <div className="absolute left-0 top-full z-20 mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900">Select Date Range</h4>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setStartDate("");
                        setEndDate("");
                        setShowDatePicker(false);
                      }}
                      className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-blue-600">Timeline</label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value as "day" | "week" | "month")}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <SectionCard title="Overview" description="Activity metrics and business distribution.">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Bar Chart and Pie Charts */}
          <div className="space-y-6">
            {/* Bar Chart */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">
                {businessMetric === "count" ? "Number of Policies" : "Revenue"}
              </h3>
              <p className="mb-4 text-xs text-slate-500">Based on selected timeline and filters</p>
              <MiniBarChart
                data={timelineStats.map((item) => ({
                  label: item.label,
                  value: businessMetric === "count" ? item.count : item.revenue,
                }))}
                color={businessMetric === "count" ? "#2563eb" : "#10b981"}
                valueFormatter={businessMetric === "count" ? (v) => numberFormatter.format(v) : (v) => currencyFormatter.format(v)}
                emptyMessage={businessMetric === "count" ? "No policy activity captured yet." : "Revenue data will appear as soon as business entries arrive."}
              />
            </div>

            {/* Pie Charts */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">Business Distribution</h3>
                <p className="text-xs text-slate-500">By Broker and Insurer</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Broker</p>
                    <span className="text-[10px] text-slate-500">Top 5 + Others</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <PieChart
                      data={brokerPie.map((item, index) => ({
                        label: item.label,
                        value: businessMetric === "count" ? item.count : item.value,
                        color: palette[index % palette.length],
                      }))}
                    />
                    <div className="w-full space-y-1">
                      {brokerPie.map((item, index) => {
                        const totalValue = brokerPie.reduce((sum, i) => sum + (businessMetric === "count" ? i.count : i.value), 0);
                        const itemValue = businessMetric === "count" ? item.count : item.value;
                        const share = totalValue > 0 ? ((itemValue / totalValue) * 100).toFixed(1) : "0.0";
                        return (
                          <div
                            key={item.label}
                            className="group relative flex items-center gap-2 rounded-lg px-2 py-1 text-xs transition-colors hover:bg-slate-100"
                          >
                            <span
                              className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: palette[index % palette.length] }}
                            />
                            <span className="flex-1 truncate text-slate-700" title={item.label}>
                              {item.label}
                            </span>
                            <div className="pointer-events-none absolute left-0 top-full z-10 mt-1 hidden w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg group-hover:block">
                              <p className="mb-1 text-xs font-semibold text-slate-900">{item.label}</p>
                              <div className="space-y-0.5 text-[11px] text-slate-600">
                                <p>Policies: <span className="font-semibold text-slate-900">{numberFormatter.format(item.count)}</span></p>
                                <p>Value: <span className="font-semibold text-slate-900">{currencyFormatter.format(item.value)}</span></p>
                                <p>Share: <span className="font-semibold text-slate-900">{share}%</span></p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Insurer</p>
                    <span className="text-[10px] text-slate-500">Top 5 + Others</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <PieChart
                      data={insurerPie.map((item, index) => ({
                        label: item.label,
                        value: businessMetric === "count" ? item.count : item.value,
                        color: palette[index % palette.length],
                      }))}
                    />
                    <div className="w-full space-y-1">
                      {insurerPie.map((item, index) => {
                        const totalValue = insurerPie.reduce((sum, i) => sum + (businessMetric === "count" ? i.count : i.value), 0);
                        const itemValue = businessMetric === "count" ? item.count : item.value;
                        const share = totalValue > 0 ? ((itemValue / totalValue) * 100).toFixed(1) : "0.0";
                        return (
                          <div
                            key={item.label}
                            className="group relative flex items-center gap-2 rounded-lg px-2 py-1 text-xs transition-colors hover:bg-slate-100"
                          >
                            <span
                              className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: palette[index % palette.length] }}
                            />
                            <span className="flex-1 truncate text-slate-700" title={item.label}>
                              {item.label}
                            </span>
                            <div className="pointer-events-none absolute left-0 top-full z-10 mt-1 hidden w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg group-hover:block">
                              <p className="mb-1 text-xs font-semibold text-slate-900">{item.label}</p>
                              <div className="space-y-0.5 text-[11px] text-slate-600">
                                <p>Policies: <span className="font-semibold text-slate-900">{numberFormatter.format(item.count)}</span></p>
                                <p>Value: <span className="font-semibold text-slate-900">{currencyFormatter.format(item.value)}</span></p>
                                <p>Share: <span className="font-semibold text-slate-900">{share}%</span></p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Business by State</h3>
            <p className="mb-4 text-xs text-slate-500">Geographic distribution across India</p>
            <IndiaHeatMap
              data={stateHeatMapData}
              metric={businessMetric}
              valueFormatter={businessMetric === "count" ? (v) => numberFormatter.format(v) : (v) => currencyFormatter.format(v)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Top Contributors" description="Highest contribution based on selected metric.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Brokers</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {topBrokers.length === 0 && <li className="text-slate-500">Data will appear after entries are captured.</li>}
              {topBrokers.map((item, index) => (
                <li key={item.label} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold" style={{ backgroundColor: `${palette[index % palette.length]}15`, color: palette[index % palette.length] }}>
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-900">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{businessMetric === "count" ? numberFormatter.format(item.count) : currencyFormatter.format(item.value)}</p>
                    <p className="text-[11px] text-slate-500">{item.count} policies</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Insurers</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {topInsurers.length === 0 && <li className="text-slate-500">Data will appear after entries are captured.</li>}
              {topInsurers.map((item, index) => (
                <li key={item.label} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold" style={{ backgroundColor: `${palette[index % palette.length]}15`, color: palette[index % palette.length] }}>
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-900">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{businessMetric === "count" ? numberFormatter.format(item.count) : currencyFormatter.format(item.value)}</p>
                    <p className="text-[11px] text-slate-500">{item.count} policies</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      {isLoading && (
        <div className="space-y-3">
          <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      )}
        </>
      )}

      {activeTab === "breakdown" && (
        <div className="space-y-6">
          <SectionCard title="Business Breakdown" description="Detailed business distribution by category">
            {/* Sub-tabs for breakdown categories */}
            <div className="mb-6 flex flex-wrap gap-2">
              {[
                { value: "insurer" as const, label: "INSURER" },
                { value: "broker" as const, label: "BROKER" },
                { value: "state" as const, label: "STATE" },
                { value: "rm" as const, label: "RM" },
                { value: "associate" as const, label: "ASSOCIATE" },
                { value: "product" as const, label: "PRODUCT" },
              ].map((tab) => {
                const isActive = breakdownTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setBreakdownTab(tab.value)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Breakdown Table */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                        {breakdownTab === "insurer" && "Insurance Company"}
                        {breakdownTab === "broker" && "Broker Name"}
                        {breakdownTab === "state" && "State Name"}
                        {breakdownTab === "rm" && "RM Name"}
                        {breakdownTab === "associate" && "Associate Name"}
                        {breakdownTab === "product" && "Product Type"}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Policies</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Premium</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Revenue</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Share %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      let distribution: DistributionItem[] = [];
                      if (breakdownTab === "insurer") distribution = insurerDistribution;
                      else if (breakdownTab === "broker") distribution = brokerDistribution;
                      else if (breakdownTab === "state") distribution = stateDistribution;
                      else if (breakdownTab === "rm") {
                        distribution = buildDistribution(filteredEntries, (entry) => entry.rmData?.name || entry.rmid || "Unmapped RM");
                      } else if (breakdownTab === "associate") {
                        distribution = buildDistribution(filteredEntries, (entry) => entry.associateData?.name || entry.associateid || "Unmapped Associate");
                      } else if (breakdownTab === "product") {
                        distribution = buildDistribution(filteredEntries, (entry) => entry.productType || entry.insuranceType || "Unmapped Product");
                      }

                      const totalRevenue = distribution.reduce((sum, item) => sum + item.value, 0);
                      const totalPremium = filteredEntries.reduce((sum, entry) => sum + derivePremium(entry), 0);

                      return distribution.map((item, index) => {
                        const share = totalRevenue > 0 ? ((item.value / totalRevenue) * 100).toFixed(1) : "0.0";
                        const itemPremium = filteredEntries
                          .filter((entry) => {
                            if (breakdownTab === "insurer") return (entry.insuranceCompany || "Unmapped Insurer") === item.label;
                            if (breakdownTab === "broker") return (entry.brokerData?.brokername || entry.brokerid || "Unmapped Broker") === item.label;
                            if (breakdownTab === "state") return (entry.state || "Unknown State") === item.label;
                            if (breakdownTab === "rm") return (entry.rmData?.name || entry.rmid || "Unmapped RM") === item.label;
                            if (breakdownTab === "associate") return (entry.associateData?.name || entry.associateid || "Unmapped Associate") === item.label;
                            if (breakdownTab === "product") return (entry.productType || entry.insuranceType || "Unmapped Product") === item.label;
                            return false;
                          })
                          .reduce((sum, entry) => sum + derivePremium(entry), 0);

                        return (
                          <tr key={item.label} className="transition-colors hover:bg-white">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                                  {index + 1}
                                </span>
                                <span className="font-medium text-slate-900">{item.label}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">{numberFormatter.format(item.count)}</td>
                            <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">{currencyFormatter.format(itemPremium)}</td>
                            <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">{currencyFormatter.format(item.value)}</td>
                            <td className="px-4 py-3 text-right text-sm font-semibold text-blue-600">{share}%</td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === "statistics" && (
        <div className="space-y-8">
          {/* State Statistics */}
          <SectionCard title="States Statistics" description="Business distribution across states">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">State</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Policies</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Revenue</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Share %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stateDistribution.slice(0, 10).map((state, index) => {
                      const totalRevenue = stateDistribution.reduce((sum, s) => sum + s.value, 0);
                      const share = totalRevenue > 0 ? ((state.value / totalRevenue) * 100).toFixed(1) : "0.0";
                      return (
                        <tr key={state.label} className="transition-colors hover:bg-white">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                                {index + 1}
                              </span>
                              <span className="font-medium text-slate-900">{state.label}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">{numberFormatter.format(state.count)}</td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">{currencyFormatter.format(state.value)}</td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-blue-600">{share}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>

          {/* Top RMs */}
          <SectionCard title="Top RMs" description="Highest performing Relationship Managers">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-center py-12 text-slate-500">
                <p className="text-sm">RM performance data will appear here</p>
                <p className="text-xs mt-1">Based on business entries and team performance</p>
              </div>
            </div>
          </SectionCard>

          {/* Top Associates */}
          <SectionCard title="Top Associates" description="Highest performing Associates">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-center py-12 text-slate-500">
                <p className="text-sm">Associate performance data will appear here</p>
                <p className="text-xs mt-1">Based on business entries and individual contributions</p>
              </div>
            </div>
          </SectionCard>

          {/* Onboarding Associates */}
          <SectionCard title="Onboarding Associates" description="Recently joined team members">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-center py-12 text-slate-500">
                <p className="text-sm">Recent associate onboarding data will appear here</p>
                <p className="text-xs mt-1">Showing last 30 days of new associates</p>
              </div>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}

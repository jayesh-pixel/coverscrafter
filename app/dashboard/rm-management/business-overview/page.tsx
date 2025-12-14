"use client";

import { useEffect, useMemo, useState } from "react";
import { HiChartBar, HiUserGroup } from "react-icons/hi2";
import { SectionCard, MetricCard, PieChart, MiniBarChart, palette, numberFormatter, currencyFormatter, IndiaHeatMap } from "@/components/dashboard/overview";
import { getBusinessEntries, type BusinessEntry } from "@/lib/api/businessentry";
import { getRMUsers, getAssociateUsers, type RMUser, type AssociateUser } from "@/lib/api/users";
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

function buildDistribution(entries: BusinessEntry[], labelFn: (entry: BusinessEntry) => string, valueFn?: (entry: BusinessEntry) => number): DistributionItem[] {
  const map = new Map<string, DistributionItem>();
  const getValue = valueFn ?? deriveRevenue;
  for (const entry of entries) {
    const label = labelFn(entry) || "Unmapped";
    const revenue = getValue(entry);
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
  const [rmUsers, setRmUsers] = useState<RMUser[]>([]);
  const [associateUsers, setAssociateUsers] = useState<AssociateUser[]>([]);

  const loadEntries = async (withSpinner = true) => {
    try {
      if (withSpinner) setIsLoading(true);
      setError(null);
      const token = await getValidAuthToken();
      if (!token) {
        throw new Error("Session expired. Please sign in again.");
      }
      const [businessData, rmsData, associatesData] = await Promise.all([
        getBusinessEntries(token),
        getRMUsers(token),
        getAssociateUsers(token),
      ]);
      setEntries(businessData ?? []);
      setRmUsers(rmsData ?? []);
      setAssociateUsers(associatesData ?? []);
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
    
    // Calculate active associates (those with at least one business entry)
    const activeAssociatesSet = new Set(
      filteredEntries
        .filter(entry => entry.associateId)
        .map(entry => entry.associateId)
    );
    const activeAssociates = activeAssociatesSet.size;

    return {
      totalPolicies,
      totalPremium,
      totalRevenue,
      avgTicket,
      activeAssociates,
    };
  }, [filteredEntries]);

  const timelineStats = useMemo<MonthlyStat[]>(() => {
    const map = new Map<string, MonthlyStat>();

    const getBucketKey = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      if (timeline === "day") {
        return { key: `${year}-${month + 1}-${day}`, label: date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) };
      }
      if (timeline === "week") {
        const weekStart = new Date(date);
        const dayOfWeek = (weekStart.getDay() + 6) % 7;
        weekStart.setDate(weekStart.getDate() - dayOfWeek);
        const label = `${weekStart.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}`;
        return { key: `W-${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`, label: `Week of ${label}` };
      }
      return {
        key: `${year}-${month + 1}`,
        label: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
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

    // Get all entries sorted
    let result = Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, value]) => value);

    // Fill gaps with zero values for daily timeline
    if (timeline === "day" && result.length > 0) {
      const filled: MonthlyStat[] = [];
      const firstEntry = result[0];
      const lastEntry = result[result.length - 1];
      
      // Parse dates from keys
      const startDateStr = firstEntry.label;
      const endDate = new Date();

      // Create a map for quick lookup
      const resultMap = new Map(map);

      // Generate all dates from start to end
      const current = new Date(startDateStr);
      while (current <= endDate) {
        const year = current.getFullYear();
        const month = current.getMonth() + 1;
        const day = current.getDate();
        const key = `${year}-${month}-${day}`;
        const label = current.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

        if (resultMap.has(key)) {
          filled.push(resultMap.get(key)!);
        } else {
          filled.push({ label, count: 0, premium: 0, revenue: 0 });
        }

        current.setDate(current.getDate() + 1);
      }

      result = filled;
    }

    return result.slice(-30); // Show last 30 periods
  }, [filteredEntries, timeline]);

  // All distributions now use Net Premium (derivePremium) instead of Revenue
  const brokerDistribution = useMemo(() => buildDistribution(filteredEntries, (entry) => entry.brokerData?.brokername || entry.brokerid || "Unmapped Broker", derivePremium), [filteredEntries]);
  const insurerDistribution = useMemo(() => buildDistribution(filteredEntries, (entry) => entry.insuranceCompany || "Unmapped Insurer", derivePremium), [filteredEntries]);
  const stateDistribution = useMemo(() => buildDistribution(filteredEntries, (entry) => entry.state || "Unknown State", derivePremium), [filteredEntries]);

  const brokerPie = useMemo(() => toPieData(brokerDistribution), [brokerDistribution]);
  const insurerPie = useMemo(() => toPieData(insurerDistribution), [insurerDistribution]);

  const topBrokers = brokerDistribution.slice(0, 5);
  const topInsurers = insurerDistribution.slice(0, 5);

  // Build a state-level dataset that includes both revenue and net premium values.
  // For the map, when businessMetric === 'revenue', we want to show Net Premium (derived premium) instead of revenue.
  const stateHeatMapData = useMemo(() => {
    const map = new Map<string, { name: string; code: string; count: number; revenue: number; netPremium: number }>();

    for (const entry of filteredEntries) {
      const name = entry.state || "Unknown State";
      const key = name;
      const current = map.get(key) ?? { name, code: (name || "").substring(0, 2).toUpperCase(), count: 0, revenue: 0, netPremium: 0 };
      current.count += 1;
      current.revenue += deriveRevenue(entry);
      current.netPremium += derivePremium(entry);
      map.set(key, current);
    }

    return Array.from(map.values()).map(item => ({
      name: item.name,
      code: item.code,
      value: businessMetric === "count" ? item.count : item.netPremium,
      count: item.count,
      revenue: item.revenue,
      netPremium: item.netPremium,
    }));
  }, [filteredEntries, businessMetric]);

  const topRMs = useMemo(() => {
    const rmPerformance = new Map<string, { rm: RMUser; policies: number; revenue: number }>();
    
    filteredEntries.forEach((entry) => {
      if (entry.rmId && entry.rmData) {
        const rmData = entry.rmData as any;
        const rmName = rmData?.firstName ? `${rmData.firstName} ${rmData.lastName || ""}`.trim() : entry.rmId;
        const current = rmPerformance.get(entry.rmId) || { 
          rm: rmUsers.find(r => r._id === entry.rmId) || rmData as RMUser, 
          policies: 0, 
          revenue: 0 
        };
        current.policies += 1;
        current.revenue += derivePremium(entry);
        rmPerformance.set(entry.rmId, current);
      }
    });

    return Array.from(rmPerformance.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredEntries, rmUsers]);

  const topAssociates = useMemo(() => {
    const associatePerformance = new Map<string, { associate: AssociateUser; policies: number; revenue: number }>();
    
    filteredEntries.forEach((entry) => {
      if (entry.associateId && entry.associateData) {
        const associateData = entry.associateData as any;
        const current = associatePerformance.get(entry.associateId) || { 
          associate: associateUsers.find(a => a._id === entry.associateId) || associateData as AssociateUser, 
          policies: 0, 
          revenue: 0 
        };
        current.policies += 1;
        current.revenue += derivePremium(entry);
        associatePerformance.set(entry.associateId, current);
      }
    });

    return Array.from(associatePerformance.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredEntries, associateUsers]);

  const recentAssociates = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return associateUsers
      .filter((associate) => {
        const createdDate = new Date(associate.createdAt);
        return createdDate >= thirtyDaysAgo;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [associateUsers]);

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
        <MetricCard label="Avg Ticket" value={currencyFormatter.format(totals.avgTicket || 0)} helper="Premium per policy" />
        <MetricCard label="Active Associates" value={numberFormatter.format(totals.activeAssociates)} helper="Total Active Associates" />
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
        <div className="space-y-6">
          {/* Separate Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Policies Chart */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Number of Policies</h3>
              <p className="mb-4 text-xs text-slate-500">Based on selected timeline and filters</p>
              <div className="overflow-x-auto">
                <div className="min-w-full" style={{ height: "300px", display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap: "8px", paddingBottom: "30px", borderBottom: "1px solid #e2e8f0" }}>
                  {timelineStats.length === 0 ? (
                    <div className="flex w-full items-center justify-center text-slate-500">
                      <p className="text-xs">No data available</p>
                    </div>
                  ) : (
                    timelineStats.map((item, index) => (
                      <div key={index} className="flex flex-col items-center gap-2" style={{ flex: 1 }}>
                        <div
                          className="rounded-t bg-blue-500 transition-all hover:bg-blue-600"
                          style={{
                            width: "24px",
                            height: `${Math.max(10, (item.count / Math.max(...timelineStats.map(s => s.count))) * 240)}px`,
                            position: "relative",
                          }}
                          title={`${item.label}: ${numberFormatter.format(item.count)} policies`}
                        >
                          <span className="text-[9px] font-semibold text-slate-900 absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            {numberFormatter.format(item.count)}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-medium text-slate-700 mt-1 max-w-[60px] truncate" title={item.label}>
                            {item.label.split(',')[0]}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Net Premium Chart */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Net Premium</h3>
              <p className="mb-4 text-xs text-slate-500">Based on selected timeline and filters</p>
              <div className="overflow-x-auto">
                <div className="min-w-full" style={{ height: "300px", display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap: "8px", paddingBottom: "30px", borderBottom: "1px solid #e2e8f0" }}>
                  {timelineStats.length === 0 ? (
                    <div className="flex w-full items-center justify-center text-slate-500">
                      <p className="text-xs">No data available</p>
                    </div>
                  ) : (
                    timelineStats.map((item, index) => (
                      <div key={index} className="flex flex-col items-center gap-2" style={{ flex: 1 }}>
                        <div
                          className="rounded-t bg-amber-500 transition-all hover:bg-amber-600"
                          style={{
                            width: "24px",
                            height: `${Math.max(10, (item.premium / Math.max(...timelineStats.map(s => s.premium))) * 240)}px`,
                            position: "relative",
                          }}
                          title={`${item.label}: ${currencyFormatter.format(item.premium)}`}
                        >
                          <span className="text-[9px] font-semibold text-slate-900 absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            {currencyFormatter.format(item.premium)}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-medium text-slate-700 mt-1 max-w-[60px] truncate" title={item.label}>
                            {item.label.split(',')[0]}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
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
                      value: item.value,
                      color: palette[index % palette.length],
                    }))}
                  />
                  <div className="w-full space-y-1">
                    {brokerPie.map((item, index) => {
                      const totalValue = brokerPie.reduce((sum, i) => sum + i.value, 0);
                      const share = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : "0.0";
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
                              <p>Net Premium: <span className="font-semibold text-slate-900">{currencyFormatter.format(item.value)}</span></p>
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
                      value: item.value,
                      color: palette[index % palette.length],
                    }))}
                  />
                  <div className="w-full space-y-1">
                    {insurerPie.map((item, index) => {
                      const totalValue = insurerPie.reduce((sum, i) => sum + i.value, 0);
                      const share = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : "0.0";
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
                              <p>Net Premium: <span className="font-semibold text-slate-900">{currencyFormatter.format(item.value)}</span></p>
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

          {/* Map */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Business by State</h3>
            <p className="mb-4 text-xs text-slate-500">Geographic distribution across India</p>
            <IndiaHeatMap
              data={stateHeatMapData}
              metric={businessMetric}
              valueFormatter={businessMetric === "count"
                ? (v) => numberFormatter.format(v)
                : (v) => currencyFormatter.format(v)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Top Contributors" description="Highest contribution based on Net Premium.">
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
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Net Premium</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Net Premium</th>
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
                        distribution = buildDistribution(filteredEntries, (entry) => {
                          const rmData = entry.rmData as any;
                          return rmData?.firstName ? `${rmData.firstName} ${rmData.lastName || ""}`.trim() : entry.rmId || "Unmapped RM";
                        }, derivePremium);
                      } else if (breakdownTab === "associate") {
                        distribution = buildDistribution(filteredEntries, (entry) => {
                          const associateData = entry.associateData as any;
                          return associateData?.contactPerson || entry.associateId || "Unmapped Associate";
                        }, derivePremium);
                      } else if (breakdownTab === "product") {
                        distribution = buildDistribution(filteredEntries, (entry) => entry.product || "Unmapped Product", derivePremium);
                      }

                      const totalRevenue = distribution.reduce((sum, item) => sum + item.value, 0);
                      const totalPremium = filteredEntries.reduce((sum, entry) => sum + derivePremium(entry), 0);

                      return distribution.map((item, index) => {
                        const share = totalRevenue > 0 ? ((item.value / totalRevenue) * 100).toFixed(1) : "0.0";
                        // Net Premium calculation for this group
                        const itemNetPremium = filteredEntries
                          .filter((entry) => {
                            if (breakdownTab === "insurer") return (entry.insuranceCompany || "Unmapped Insurer") === item.label;
                            if (breakdownTab === "broker") return (entry.brokerData?.brokername || entry.brokerid || "Unmapped Broker") === item.label;
                            if (breakdownTab === "state") return (entry.state || "Unknown State") === item.label;
                            if (breakdownTab === "rm") {
                              const rmData = entry.rmData as any;
                              const rmName = rmData?.firstName ? `${rmData.firstName} ${rmData.lastName || ""}`.trim() : entry.rmId || "Unmapped RM";
                              return rmName === item.label;
                            }
                            if (breakdownTab === "associate") {
                              const associateData = entry.associateData as any;
                              const associateName = associateData?.contactPerson || entry.associateId || "Unmapped Associate";
                              return associateName === item.label;
                            }
                            if (breakdownTab === "product") return (entry.product || "Unmapped Product") === item.label;
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
                            <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">{currencyFormatter.format(itemNetPremium)}</td>
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
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Net Premium</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Share %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stateDistribution.slice(0, 10).map((state, index) => {
                      const totalPremium = stateDistribution.reduce((sum, s) => sum + s.value, 0);
                      const share = totalPremium > 0 ? ((state.value / totalPremium) * 100).toFixed(1) : "0.0";
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
              {topRMs.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p className="text-sm">No RM performance data available</p>
                  <p className="text-xs mt-1">Data will appear as business entries are recorded</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Rank</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">RM Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">State</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Policies</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Net Premium</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {topRMs.map((item, index) => (
                        <tr key={item.rm._id} className="transition-colors hover:bg-white">
                          <td className="px-4 py-3">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {item.rm.firstName} {item.rm.lastName}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{item.rm.state}</td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                            {numberFormatter.format(item.policies)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-blue-600">
                            {currencyFormatter.format(item.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Top Associates */}
          <SectionCard title="Top Associates" description="Highest performing Associates">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              {topAssociates.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p className="text-sm">No associate performance data available</p>
                  <p className="text-xs mt-1">Data will appear as business entries are recorded</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Rank</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Associate Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Code</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Policies</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Net Premium</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {topAssociates.map((item, index) => (
                        <tr key={item.associate._id} className="transition-colors hover:bg-white">
                          <td className="px-4 py-3">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {item.associate.name || item.associate.contactPerson}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{item.associate.associateCode}</td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                            {numberFormatter.format(item.policies)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-blue-600">
                            {currencyFormatter.format(item.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Onboarding Associates */}
          <SectionCard title="Onboarding Associates" description="Recently joined team members">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              {recentAssociates.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p className="text-sm">No recent onboarding data available</p>
                  <p className="text-xs mt-1">Showing associates who joined in the last 30 days</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Associate Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">State</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Contact</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Joined On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentAssociates.map((associate) => (
                        <tr key={associate._id} className="transition-colors hover:bg-white">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {associate.name || associate.contactPerson}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{associate.associateCode}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{associate.associateStateName}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{associate.contactNo}</td>
                          <td className="px-4 py-3 text-right text-sm text-slate-600">
                            {new Date(associate.createdAt).toLocaleDateString("en-US", { 
                              month: "short", 
                              day: "numeric", 
                              year: "numeric" 
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}

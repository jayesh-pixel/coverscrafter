"use client";

import React, { useState, useMemo, useEffect } from "react";
import { getBusinessEntries } from '@/lib/api/businessentry';
import { getValidAuthToken, getAuthSession } from '@/lib/utils/storage';
import { ApiError } from '@/lib/api/config';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { PieChart, Legend as CustomLegend, palette } from '@/components/dashboard/overview/OverviewComponents';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  ArcElement
);

export default function AssociateDashboardPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [timeline, setTimeline] = useState("Day");
  
  // State for business entries
  const [businessEntries, setBusinessEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for date range picker
  const [open, setOpen] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  
  // Format date for display
  const formatDateForDisplay = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: { size: 14, weight: "bold" as const },
          padding: 15,
        },
      },
      title: {
        display: false,
      },
      datalabels: {
        anchor: "center" as const,
        align: "center" as const,
        color: "#000000",
        font: { size: 11, weight: "bold" as const },
        formatter: (value: number) => '₹' + value.toLocaleString('en-IN'),
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
          font: { size: 12 },
          color: "#000000",
          autoSkip: true,
          maxTicksLimit: 8,
          autoSkipPadding: 20,
        },
        grid: {
          color: "#ffffff",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 12 },
          color: "#000000",
        },
      },
    },
  };

  const policyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: { size: 14, weight: "bold" as const },
          padding: 15,
        },
      },
      title: {
        display: true,
        text: "Number of Policies",
        font: { size: 18, weight: "bold" as const },
        padding: 20,
      },
      datalabels: {
        anchor: "center" as const,
        align: "center" as const,
        color: "#ffffff",
        font: { size: 12, weight: "bold" as const },
        formatter: (value: number) => value.toString(),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: { size: 12 },
          color: "#000000",
          autoSkip: true,
          maxTicksLimit: 6,
          autoSkipPadding: 15,
        },
        grid: {
          color: "#ffffff",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 12 },
          color: "#000000",
        },
        barPercentage: 0.1, // Makes bars extremely thin (10% of available space)
        categoryPercentage: 0.5, // Adds maximum spacing between bar groups
      },
    },
  };

  // Fetch business entries and calculate statistics
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = await getValidAuthToken();
        const session = getAuthSession();
        
        if (!token || !session?.user) {
          throw new Error('Not authenticated');
        }

        // Get business entries for current associate with date range
        const entries = await getBusinessEntries(token, {
          ...(dateFrom && { fromDate: dateFrom }),
          ...(dateTo && { toDate: dateTo }),
          associateId: (session.user as any)._id
        });

        setBusinessEntries(entries);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(
          err instanceof ApiError 
            ? err.message 
            : 'Failed to load data. Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dateFrom, dateTo]);

  // Calculate date range based on timeline
  const getDateRange = () => {
    const today = new Date();

    if (dateFrom && dateTo) {
      return {
        start: new Date(dateFrom),
        end: new Date(dateTo),
      };
    }

    // Default ranges based on timeline
    const start = new Date(today);
    
    if (timeline === "Day") {
      start.setDate(start.getDate() - 15); // Last 15 days
    } else if (timeline === "Week") {
      start.setDate(start.getDate() - 28); // Last 4 weeks (28 days)
    } else if (timeline === "Month") {
      start.setMonth(start.getMonth() - 3); // Last 3 months
    } else if (timeline === "Year") {
      start.setFullYear(start.getFullYear() - 2); // Last 2 years
    }

    return {
      start,
      end: today,
    };
  };

  // Generate chart data based on filters with optimization for large datasets
  const generateChartData = useMemo(() => {
    const dateRange = getDateRange();
    let entries = businessEntries.filter(entry => {
      const entryDate = new Date(entry.policyIssueDate);
      return entryDate >= dateRange.start && entryDate <= dateRange.end;
    });

    // Data optimization: if data exceeds 20k entries, implement sampling
    const MAX_DATA_POINTS = 20000;
    if (entries.length > MAX_DATA_POINTS) {
      const recentEntries = entries.slice(-5000);
      const olderEntries = entries.slice(0, entries.length - 5000);
      const sampleRate = Math.ceil(olderEntries.length / (MAX_DATA_POINTS - 5000));
      const sampledOlderEntries = olderEntries.filter((_, index) => index % sampleRate === 0);
      entries = [...sampledOlderEntries, ...recentEntries];
      console.log(`Data optimized: ${entries.length}/${businessEntries.length} entries displayed`);
    }

    // Group entries by date based on timeline
    const groupedData: Record<string, { payout: number; premium: number; policies: number; date: Date }> = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.policyIssueDate);
      let key: string;
      
      if (timeline === "Day") {
        key = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      } else if (timeline === "Week") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const monthName = weekStart.toLocaleDateString("en-GB", { month: "short" });
        key = `${weekStart.getDate()}-${weekEnd.getDate()} ${monthName}`;
      } else if (timeline === "Month") {
        key = date.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
      } else {
        key = date.getFullYear().toString();
      }
      
      if (!groupedData[key]) {
        groupedData[key] = { payout: 0, premium: 0, policies: 0, date };
      }
      
      groupedData[key].payout += parseFloat(entry.totalPayout || '0');
      groupedData[key].premium += parseFloat(entry.netPremium || '0');
      groupedData[key].policies += 1;
    });

    // Sort dates chronologically
    const sortedDates = Object.keys(groupedData).sort((a, b) => {
      return groupedData[a].date.getTime() - groupedData[b].date.getTime();
    });

    return {
      labels: sortedDates,
      payoutData: sortedDates.map(date => groupedData[date].payout),
      premiumData: sortedDates.map(date => groupedData[date].premium),
      policiesData: sortedDates.map(date => groupedData[date].policies),
    };
  }, [businessEntries, timeline, dateFrom, dateTo]);

  // Double Bar Chart Data (Net Premium & Total Payout)
  const doubleBarData = {
    labels: generateChartData.labels,
    datasets: [
      {
        label: "Net Premium",
        data: generateChartData.premiumData,
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: 1.5,
        borderRadius: 4,
      },
      {
        label: "Total Payout",
        data: generateChartData.payoutData,
        backgroundColor: "#10b981",
        borderColor: "#059669",
        borderWidth: 1.5,
        borderRadius: 4,
      },
    ],
  };

  // Single Bar Chart Data (Number of Policies)
  const singleBarData = {
    labels: generateChartData.labels,
    datasets: [
      {
        label: "No. of Policies",
        data: generateChartData.policiesData,
        backgroundColor: "rgba(168, 85, 247, 0.8)",
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 1.5,
        borderRadius: 4,
      },
    ],
  };

  // Pie Chart Data for Insurance Companies
  const insuranceCompanyData = useMemo(() => {
    const companyCounts: Record<string, number> = {};
    const companyPremiums: Record<string, number> = {};
    
    businessEntries.forEach(entry => {
      const company = entry.insuranceCompany || 'Unknown';
      companyCounts[company] = (companyCounts[company] || 0) + 1;
      companyPremiums[company] = (companyPremiums[company] || 0) + parseFloat(entry.netPremium || '0');
    });
    
    return Object.entries(companyCounts)
      .map(([company, count]) => ({
        label: company,
        value: companyPremiums[company],
        count: count,
        color: palette[Object.keys(companyCounts).indexOf(company) % palette.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 companies
  }, [businessEntries]);

  // Pie Chart Data for Products
  const productData = useMemo(() => {
    const productCounts: Record<string, number> = {};
    const productPremiums: Record<string, number> = {};
    
    businessEntries.forEach(entry => {
      const product = entry.product || 'Unknown';
      productCounts[product] = (productCounts[product] || 0) + 1;
      productPremiums[product] = (productPremiums[product] || 0) + parseFloat(entry.netPremium || '0');
    });
    
    return Object.entries(productCounts)
      .map(([product, count]) => ({
        label: product,
        value: productPremiums[product],
        count: count,
        color: palette[Object.keys(productCounts).indexOf(product) % palette.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 products
  }, [businessEntries]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="mx-auto max-w-screen-2xl px-6 py-8 space-y-8">
        {/* Header Section */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-500">Associate Dashboard</p>
            <h1 className="text-2xl font-semibold text-slate-900">Business Overview</h1>
            <p className="text-sm text-slate-500">
              Graphical snapshot of policies, revenue, and partner contribution.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-60"
          >
            Refresh
          </button>
        </header>

        
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Policies */}
          <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/50 px-6 py-5 shadow-lg shadow-blue-100/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-200/50">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-500/5 transition-transform duration-300 group-hover:scale-150"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Total Policies</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 transition-colors duration-300 group-hover:bg-blue-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              {isLoading ? (
                <div className="h-12 mt-2 bg-blue-100 rounded-xl animate-pulse"></div>
              ) : (
                <p className="mb-2 text-4xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600">
                  {businessEntries.length.toLocaleString("en-IN")}
                </p>
              )}
              <p className="text-sm text-slate-600">Total Count of Policies</p>
            </div>
          </div>

          {/* Total Premium */}
          <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 px-6 py-5 shadow-lg shadow-emerald-100/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-200/50">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/5 transition-transform duration-300 group-hover:scale-150"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Net Premium</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              {isLoading ? (
                <div className="h-12 mt-2 bg-emerald-100 rounded-xl animate-pulse"></div>
              ) : (
                <p className="mb-2 text-4xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-emerald-600">
                  ₹
                  {businessEntries
                    .reduce((sum, entry) => sum + Number.parseFloat(entry.netPremium || "0"), 0)
                    .toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </p>
              )}
              <p className="text-sm text-slate-600">Total Net Premium</p>
            </div>
          </div>

          {/* Insurance Companies */}
          <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-purple-50/50 px-6 py-5 shadow-lg shadow-purple-100/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-200/50">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-500/5 transition-transform duration-300 group-hover:scale-150"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">Insurers</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 transition-colors duration-300 group-hover:bg-purple-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              {isLoading ? (
                <div className="h-12 mt-2 bg-purple-100 rounded-xl animate-pulse"></div>
              ) : (
                <p className="mb-2 text-4xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-purple-600">
                  {new Set(businessEntries.map((entry) => entry.insuranceCompany).filter(Boolean)).size}
                </p>
              )}
              <p className="text-sm text-slate-600">Total Insurance Companies</p>
            </div>
          </div>

          {/* Avg Ticket */}
          <div className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-amber-50/50 px-6 py-5 shadow-lg shadow-amber-100/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-200/50">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/5 transition-transform duration-300 group-hover:scale-150"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Avg Ticket</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-colors duration-300 group-hover:bg-amber-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              {isLoading ? (
                <div className="h-12 mt-2 bg-amber-100 rounded-xl animate-pulse"></div>
              ) : businessEntries.length > 0 ? (
                <p className="mb-2 text-4xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-amber-600">
                  ₹
                  {(
                    businessEntries.reduce((sum, entry) => sum + Number.parseFloat(entry.netPremium || "0"), 0) /
                    businessEntries.length
                  ).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </p>
              ) : (
                <p className="mb-2 text-4xl font-bold text-slate-900">₹0</p>
              )}
              <p className="text-sm text-slate-600">Average Premium per Policy</p>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 flex gap-6 items-end">
          {/* Date Range */}
          <div className="flex-1 relative">
            <label className="text-sm font-semibold text-blue-600">Date Range</label>

            <div className="flex gap-2">
              <input
                readOnly
                onClick={() => setOpen(!open)}
                value={`${formatDateForDisplay(state[0].startDate)} to ${formatDateForDisplay(state[0].endDate)}`}
                placeholder="Select date range"
                className="flex-1 mt-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 cursor-pointer focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  const today = new Date();
                  const lastMonth = new Date(today);
                  lastMonth.setMonth(lastMonth.getMonth() - 1);
                  setState([{
                    startDate: lastMonth,
                    endDate: today,
                    key: 'selection'
                  }]);
                  setDateFrom(lastMonth.toISOString().split('T')[0]);
                  setDateTo(today.toISOString().split('T')[0]);
                }}
                className="mt-1 px-3 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                Clear
              </button>
            </div>

            {open && (
              <div className="absolute z-50 mt-2 shadow-lg rounded-xl overflow-hidden">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item: any) => {
                    setState([item.selection]);
                    setDateFrom(item.selection.startDate.toISOString().split('T')[0]);
                    setDateTo(item.selection.endDate.toISOString().split('T')[0]);
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={state}
                  rangeColors={["#2563eb"]}
                />
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="flex-1">
            <label className="text-sm font-semibold text-blue-600">Timeline</label>
            <select 
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full mt-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </select>
          </div>
        </div>

        {/* charts section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h3 className="text-2xl font-semibold text-slate-900">Business Overview</h3>
          </div>
          <div className="max-w-7xl mx-auto">
            
            {/* All charts in one grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
              {/* Double Bar Chart */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h4 className="text-lg font-semibold text-slate-900">Revenue & Premium </h4>
                </div>
                <div className="overflow-x-auto overflow-y-hidden">
                  <div className="min-w-full">
                    <div className="h-[500px]" style={{ minWidth: `${Math.max(600, generateChartData.labels.length * 140)}px` }}>
                      <Bar data={doubleBarData} options={chartOptions} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Single Bar Chart */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h4 className="text-lg font-semibold text-slate-900">Number of Policies</h4>
                </div>
                <div className="overflow-x-auto overflow-y-hidden">
                  <div className="min-w-full">
                    <div className="h-[500px]" style={{ minWidth: `${Math.max(600, generateChartData.labels.length * 140)}px` }}>
                      <Bar data={singleBarData} options={policyChartOptions} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Insurance Companies Pie Chart */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <h4 className="text-lg font-semibold text-slate-900">Insurance Companies Distribution</h4>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <PieChart data={insuranceCompanyData} />
                  </div>
                  <div className="flex-1 w-full">
                    <CustomLegend items={insuranceCompanyData} />
                  </div>
                </div>
              </div>

              {/* Products Pie Chart */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <h4 className="text-lg font-semibold text-slate-900">Products Distribution</h4>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <PieChart data={productData} />
                  </div>
                  <div className="flex-1 w-full">
                    <CustomLegend items={productData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Contributors Table */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Top Contributors
            </h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-50 to-indigo-50 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">
                Leading Insurance Companies
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-blue-100 text-slate-900 uppercase tracking-wider rounded-tl-lg">
                    Insurance Company
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-blue-100 text-slate-900 uppercase tracking-wider rounded-tr-lg">
                    No. of Policies
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {(() => {
                  const companyCounts = businessEntries.reduce((acc: Record<string, number>, entry) => {
                    const company = entry.insuranceCompany || 'Unknown';
                    acc[company] = (acc[company] || 0) + 1;
                    return acc;
                  }, {});
                  
                  const topCompanies = Object.entries(companyCounts)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 10);
                  
                  return topCompanies.length > 0 ? topCompanies.map(([company, count]) => (
                    <tr key={company} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                        {count}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-center text-sm text-slate-500">
                        No data available
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>

        {/* Business Details Table */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Business Details
            </h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700">
                Total Policies ({isLoading ? '...' : businessEntries.length})
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-slate-500">Loading business entries...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            ) : businessEntries.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-slate-500">No business entries found.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-100">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider rounded-tl-lg">
                      Client Name
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                      RM
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                      Insurance Company
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                      Registration Number
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                      Sub Product
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                      Policy Number
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                      Policy Issue Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                      Policy Start Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                      Policy End Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                      State
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-sm font-bold bg-linear-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider rounded-tr-lg">
                      Total Payout
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {businessEntries.map((entry) => (
                    <tr key={entry._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {entry.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {entry.rmData ? `${entry.rmData.firstName} ${entry.rmData.lastName}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {entry.insuranceCompany}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {entry.registrationNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {entry.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {entry.subProduct}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {entry.policyNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {entry.policyIssueDate ? formatDate(entry.policyIssueDate) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {entry.policyStartDate ? formatDate(entry.policyStartDate) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {entry.policyEndDate ? formatDate(entry.policyEndDate) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {entry.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-medium">
                        ₹{parseFloat(entry.totalPayout || '0').toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  {/* Total Payout Row */}
                  <tr className="bg-slate-50 font-semibold">
                    <td colSpan={11} className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                      Total Payout:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-bold">
                      ₹{businessEntries.reduce((total, entry) => total + parseFloat(entry.totalPayout || '0'), 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

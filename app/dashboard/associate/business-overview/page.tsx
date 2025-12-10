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
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
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
        anchor: "end" as const,
        align: "top" as const,
        color: "#000000",
        font: { size: 11, weight: "bold" as const },
        formatter: (value: number) => value.toFixed(2),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
          font: { size: 12 },
          color: "#000000",
        },
        grid: {
          color: "#e5e7eb",
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
          stepSize: 20,
          font: { size: 12 },
          color: "#000000",
        },
        grid: {
          color: "#e5e7eb",
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
        key = `Week ${Math.ceil((weekStart.getDate() / 7))}`;
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

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Policies */}
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">Total Policies</p>
            {isLoading ? (
              <div className="h-10 mt-2 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {businessEntries.length.toLocaleString('en-IN')}
              </p>
            )}
            <p className="text-xs text-slate-500">Total Count of Policies in the Period</p>
          </div>

          {/* Total Premium */}
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">Net Premium</p>
            {isLoading ? (
              <div className="h-10 mt-2 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                ₹{businessEntries
                  .reduce((sum, entry) => sum + parseFloat(entry.netPremium || '0'), 0)
                  .toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
            )}
            <p className="text-xs text-slate-500">Total Net Premium</p>
          </div>

          {/* Insurance Companies */}
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">Insurers</p>
            {isLoading ? (
              <div className="h-10 mt-2 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {new Set(
                  businessEntries
                    .map(entry => entry.insuranceCompany)
                    .filter(Boolean)
                ).size}
              </p>
            )}
            <p className="text-xs text-slate-500">Total Insurance Companies</p>
          </div>

          {/* Avg Ticket */}
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">Avg Ticket</p>
            {isLoading ? (
              <div className="h-10 mt-2 bg-slate-100 rounded animate-pulse"></div>
            ) : businessEntries.length > 0 ? (
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                ₹{(
                  businessEntries.reduce(
                    (sum, entry) => sum + parseFloat(entry.netPremium || '0'), 
                    0
                  ) / businessEntries.length
                ).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
            ) : (
              <p className="mt-2 text-2xl font-semibold text-slate-900">₹0</p>
            )}
            <p className="text-xs text-slate-500">Average Premium per Policy</p>
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
            </select>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-linear-to-br from-slate-50 to-slate-100 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Double Bar Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="h-[400px]">
                  <Bar data={doubleBarData} options={chartOptions} />
                </div>
              </div>

              {/* Single Bar Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="h-[400px]">
                  <Bar data={singleBarData} options={policyChartOptions} />
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

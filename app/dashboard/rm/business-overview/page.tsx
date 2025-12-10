"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { getAssociateUsers } from '@/lib/api/users';
import { getBusinessEntries } from '@/lib/api/businessentry';
import { getValidAuthToken, getAuthSession } from '@/lib/utils/storage';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { ApiError } from '@/lib/api/config';
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

interface AssociateWithStats {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  policies: number;
  netRevenue: number;
  netPremium: number;
  policyIssueDate?: string;
  totalPayout: number;
}

const Page = () => {
  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Format date for display in date picker
  const formatDateForDisplay = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [timeline, setTimeline] = useState("Day");
  const [open, setOpen] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  // State for data
  const [associates, setAssociates] = useState<AssociateWithStats[]>([]);
  const [associatesBusinessEntries, setAssociatesBusinessEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    let entries = associatesBusinessEntries.filter(entry => {
      const entryDate = new Date(entry.policyIssueDate);
      return entryDate >= dateRange.start && entryDate <= dateRange.end;
    });

    // Data optimization: if data exceeds 20k entries, implement sampling
    const MAX_DATA_POINTS = 20000;
    if (entries.length > MAX_DATA_POINTS) {
      // Sample data intelligently - keep recent entries and sample older ones
      const recentEntries = entries.slice(-5000); // Keep last 5000 entries
      const olderEntries = entries.slice(0, entries.length - 5000);
      
      // Sample older entries (take every nth entry)
      const sampleRate = Math.ceil(olderEntries.length / (MAX_DATA_POINTS - 5000));
      const sampledOlderEntries = olderEntries.filter((_, index) => index % sampleRate === 0);
      
      entries = [...sampledOlderEntries, ...recentEntries];
      
      console.log(`Data optimized: ${entries.length}/${associatesBusinessEntries.length} entries displayed`);
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

    // Sort dates chronologically using actual Date objects
    const sortedDates = Object.keys(groupedData).sort((a, b) => {
      return groupedData[a].date.getTime() - groupedData[b].date.getTime();
    });

    return {
      labels: sortedDates,
      payoutData: sortedDates.map(date => groupedData[date].payout),
      premiumData: sortedDates.map(date => groupedData[date].premium),
      policiesData: sortedDates.map(date => groupedData[date].policies),
      isDataOptimized: associatesBusinessEntries.length > MAX_DATA_POINTS,
      originalDataCount: associatesBusinessEntries.length,
      displayedDataCount: entries.length
    };
  }, [associatesBusinessEntries, timeline, dateFrom, dateTo]);

  // Double Bar Chart Data (Total Payout & Net Premium)
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
        backgroundColor: "rgba(168, 85, 247, 0.8)", // Purple
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 1.5,
        borderRadius: 4,
      },
    ],
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

  // Fetch all data
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

        // Get all associates for the current RM
        const associateUsers = await getAssociateUsers(token, undefined, (session.user as any)._id);

        // Fetch business entries for each associate and calculate stats
        const associatesWithStats = await Promise.all(
          associateUsers.map(async (associate) => {
            // Get business entries for this associate
            const businessEntries = await getBusinessEntries(token, {
              associateId: associate._id,
            });
            
            // Calculate total policies, total payout, and total net premium
            const totalPolicies = businessEntries.length;
            const totalPayout = businessEntries.reduce(
              (sum, entry) => sum + parseFloat(entry.totalPayout || '0'),
              0
            );
            const totalNetPremium = businessEntries.reduce(
              (sum, entry) => sum + parseFloat(entry.netPremium || '0'),
              0
            );
            
            // Find the most recent policy issue date
            const latestPolicy = [...businessEntries]
              .sort((a, b) => new Date(b.policyIssueDate).getTime() - new Date(a.policyIssueDate).getTime())[0];
            
            // Calculate if the most recent policy is within the last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const isActive = latestPolicy && new Date(latestPolicy.policyIssueDate) > thirtyDaysAgo;
            
            return {
              id: associate._id,
              name: associate.contactPerson || associate.email,
              status: isActive ? 'Active' as const : 'Inactive' as const,
              policies: totalPolicies,
              netRevenue: totalPayout,
              netPremium: totalNetPremium,
              policyIssueDate: latestPolicy?.policyIssueDate,
              totalPayout: totalPayout
            };
          })
        );
        
        setAssociates(associatesWithStats);
        
        // Fetch all business entries for the RM's associates
        const allBusinessEntries = await getBusinessEntries(token, {
          ...(dateFrom && { fromDate: dateFrom }),
          ...(dateTo && { toDate: dateTo })
        });
        
        // Filter business entries to show only those from the RM's associates
        const associateIds = associateUsers.map(associate => associate._id);
        const filteredBusinessEntries = allBusinessEntries.filter(entry => 
          associateIds.includes(entry.associateId)
        );
        
        setAssociatesBusinessEntries(filteredBusinessEntries);
      } catch (err) {
        console.error('Failed to fetch associates data:', err);
        setError(
          err instanceof ApiError 
            ? err.message 
            : 'Failed to load associates data. Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dateFrom, dateTo]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="mx-auto max-w-screen-2xl px-6 py-8 space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-500">RM Dashboard</p>
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
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {associatesBusinessEntries.length.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-500">Total Count of Policies in the Period</p>
          </div>

          {/* Total Premium */}
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">Net Premium</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              ₹{associatesBusinessEntries
                .reduce((sum, entry) => sum + parseFloat(entry.netPremium || '0'), 0)
                .toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500">Total Net Premium</p>
          </div>

          {/* Active Associates */}
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">Active Associates</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {associates.filter(a => a.status === 'Active').length}
            </p>
            <p className="text-xs text-slate-500">Active No. of Associates</p>
          </div>

          {/* Avg Ticket */}
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">Avg Ticket</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {associatesBusinessEntries.length > 0
                ? `₹${(
                    associatesBusinessEntries.reduce((sum, entry) => 
                      sum + parseFloat(entry.netPremium || '0'), 0
                    ) / associatesBusinessEntries.length
                  ).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
                : '₹0'}
            </p>
            <p className="text-xs text-slate-500">Average Premium per Policy</p>
          </div>
        </div>

        {/* Filters Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 flex gap-6 items-end">
          {/* Date Range */}
          <div className="flex-1 relative">
            <label className="text-sm font-semibold text-blue-600">Date Range</label>

            {/* Input */}
            <div className="flex gap-2">
              <input
                readOnly
                onClick={() => setOpen(!open)}
                value={`${formatDateForDisplay(state[0].startDate)} to ${formatDateForDisplay(
                  state[0].endDate
                )}`}
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

            {/* Date Picker Popup */}
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

        {/* Charts Section */}
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

        {/* Associates Overview */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl overflow-hidden">
          <div className="px-8 py-6 bg-linear-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <h3 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              My Associates Overview
            </h3>
            <p className="text-sm text-gray-500 mt-1">Track associate performance and status</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-blue-100 text-slate-900 uppercase tracking-wider rounded-tl-lg">
                    Associate Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-blue-100 text-slate-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-blue-100 text-slate-900 uppercase tracking-wider">
                    Policies
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-blue-100 text-slate-900 uppercase tracking-wider">
                    Total Payout
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-blue-100 text-slate-900 uppercase tracking-wider">
                    Net Premium
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-linear-to-r from-slate-100 to-blue-100 text-slate-900 uppercase tracking-wider rounded-tr-lg">
                    Policy Issued Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-slate-500">
                      Loading associates data...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : associates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-slate-500">
                      No associates found
                    </td>
                  </tr>
                ) : (
                  associates.map((associate) => (
                    <tr key={associate.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{associate.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          associate.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {associate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {associate.policies}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        ₹{associate.netRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        ₹{associate.netPremium.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {associate.policyIssueDate ? formatDate(associate.policyIssueDate) : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Associates Policies Details Table */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-slate-800">My Associates Policies Details</h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700">
                Total Policies ({isLoading ? '...' : associatesBusinessEntries.length})
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
            ) : associatesBusinessEntries.length === 0 ? (
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
                      Associate Name 
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
                    <th scope="col" className="px-6 py-4 text-right text-sm font-bold bg-linear-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                      Net Premium
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-sm font-bold bg-linear-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider rounded-tr-lg">
                      Total Payout
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {associatesBusinessEntries.map((entry) => (
                    <tr key={entry._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {entry.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {entry.associateData ? entry.associateData.contactPerson : 'N/A'}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium text-right">
                        ₹{parseFloat(entry.netPremium || '0').toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium text-right">
                        ₹{parseFloat(entry.totalPayout || '0').toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

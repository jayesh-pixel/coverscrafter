"use client"

import  { useState, useEffect, useMemo } from 'react'
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




type DateRangeState = {
  startDate: Date;
  endDate: Date;
  key: string;
};



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
  // Mock data - Replace with API calls in future
  const mockData = {
    dates: ["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024"],
    netPremium: [45, 78, 92, 65, 88, 110],
    totalPayout: [30, 55, 70, 50, 75, 95],
    policies: [120, 150, 180, 140, 200, 220],
  };

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

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
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
  const maxDate = new Date();

  // State for data
  const [associates, setAssociates] = useState<AssociateWithStats[]>([]);
  const [associatesBusinessEntries, setAssociatesBusinessEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate date range based on timeline
  const getDateRange = () => {
    const today = new Date();

    if (startDate && endDate) {
      return {
        start: new Date(startDate),
        end: new Date(endDate),
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
  }, [associatesBusinessEntries, timeline, startDate, endDate]);

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

  // Pie Chart Data for Insurance Companies
  const insuranceCompanyData = useMemo(() => {
    const companyCounts: Record<string, number> = {};
    const companyPremiums: Record<string, number> = {};
    
    associatesBusinessEntries.forEach(entry => {
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
  }, [associatesBusinessEntries]);

  // Pie Chart Data for Products
  const productData = useMemo(() => {
    const productCounts: Record<string, number> = {};
    const productPremiums: Record<string, number> = {};
    
    associatesBusinessEntries.forEach(entry => {
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
  }, [associatesBusinessEntries]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20,
      autoPadding: false
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        align: "start" as const,
        labels: {
          font: { size: 14, weight: "bold" as const },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle" as const,
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
          maxTicksLimit: 10,
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
    layout: {
      padding: 20,
      autoPadding: false
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        align: "start" as const,
        labels: {
          font: { size: 14, weight: "bold" as const },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle" as const,
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
          maxTicksLimit: 5,
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

        // Format dates for API
        const formatDateForApi = (date: Date | null) => {
          return date ? date.toISOString().split('T')[0] : '';
        };

        // Get all associates for the current RM
        const associateUsers = await getAssociateUsers(token, undefined, (session.user as any)._id);

        // Fetch business entries for each associate and calculate stats
        const associatesWithStats = await Promise.all(
          associateUsers.map(async (associate) => {
            // Get business entries for this associate
            const businessEntries = await getBusinessEntries(token, {
              associateId: associate._id,
              // Add date range filters if needed
              // fromDate: dateFrom,
              // toDate: dateTo
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
          fromDate: dateFrom || formatDateForApi(startDate),
          toDate: dateTo || formatDateForApi(endDate)
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
  }, [startDate, endDate, dateFrom, dateTo]);
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
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
                  {associatesBusinessEntries.length.toLocaleString("en-IN")}
                </p>
              )}
              <p className="text-sm text-slate-600">Total Count of Policies in the Period</p>
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
                  {associatesBusinessEntries
                    .reduce((sum, entry) => sum + Number.parseFloat(entry.netPremium || "0"), 0)
                    .toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </p>
              )}
              <p className="text-sm text-slate-600">Total Net Premium</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-purple-50/50 px-6 py-5 shadow-lg shadow-purple-100/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-200/50">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-500/5 transition-transform duration-300 group-hover:scale-150"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">Active Associates</p>
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              {isLoading ? (
                <div className="h-12 mt-2 bg-purple-100 rounded-xl animate-pulse"></div>
              ) : (
                <p className="mb-2 text-4xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-purple-600">
                  {associates.filter((a) => a.status === "Active").length}
                </p>
              )}
              <p className="text-sm text-slate-600">Active No. of Associates</p>
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
              ) : associatesBusinessEntries.length > 0 ? (
                <p className="mb-2 text-4xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-amber-600">
                  ₹
                  {(
                    associatesBusinessEntries.reduce(
                      (sum, entry) => sum + Number.parseFloat(entry.netPremium || "0"),
                      0,
                    ) / associatesBusinessEntries.length
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
              rangeColors={["#2563eb"]} // same blue highlight
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

        {/* Data Summary */}
       
      </div>
    </div>
 {/* Associates Overview */}
 <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
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
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-blue-100 text-slate-900 uppercase tracking-wider rounded-tl-lg">
                  Associate Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-blue-100 text-slate-900 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-blue-100 text-slate-900 uppercase tracking-wider">
                  Policies
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-blue-100 text-slate-900 uppercase tracking-wider">
                  Total Payout
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-blue-100 text-slate-900 uppercase tracking-wider">
                  Net Premium
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-blue-100 text-slate-900 uppercase tracking-wider rounded-tr-lg">
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
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider rounded-tl-lg">
                    Client Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                    Associate Name 
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                    Insurance Company
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                    Registration Number
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                    Sub Product
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                    Policy Number
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                    Policy Issue Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                    Policy Start Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                    Policy End Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                    State
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-sm font-bold bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider">
                    Net Premium
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-sm font-bold bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-900 uppercase tracking-wider rounded-tr-lg">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                      ₹{parseFloat(entry.netPremium || '0').toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
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
  )
}

export default Page




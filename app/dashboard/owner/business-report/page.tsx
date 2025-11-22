"use client";

export default function BusinessReportPage() {
  const reports = [
    {
      period: "October 2025",
      reportName: "Policy-Report-476_October_2025",
      startDate: "01 Oct 2025",
      endDate: "01 Nov 2025",
    },
    {
      period: "September 2025",
      reportName: "Policy-Report-476_September_2025",
      startDate: "01 Sept 2025",
      endDate: "01 Oct 2025",
    },
    {
      period: "August 2025",
      reportName: "Policy-Report-476_August_2025",
      startDate: "01 Aug 2025",
      endDate: "01 Sept 2025",
    },
    {
      period: "July 2025",
      reportName: "Policy-Report-476_July_2025",
      startDate: "01 Jul 2025",
      endDate: "01 Aug 2025",
    },
    {
      period: "June 2025",
      reportName: "Policy-Report-476_June_2025",
      startDate: "01 Jun 2025",
      endDate: "01 Jul 2025",
    },
    {
      period: "May 2025",
      reportName: "Policy-Report-476_May_2025",
      startDate: "01 May 2025",
      endDate: "01 Jun 2025",
    },
    {
      period: "April 2025",
      reportName: "Policy-Report-476_April_2025",
      startDate: "01 Apr 2025",
      endDate: "01 May 2025",
    },
    {
      period: "March 2025",
      reportName: "Policy-Report-476_March_2025",
      startDate: "01 Mar 2025",
      endDate: "01 Apr 2025",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Business Report</h1>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Period Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Report Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Start Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  End Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Download
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {reports.map((report, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-900">
                    {report.period}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{report.reportName}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{report.startDate}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{report.endDate}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <button className="flex items-center gap-2 rounded-lg border border-green-600 bg-green-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

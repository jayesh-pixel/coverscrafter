import Link from "next/link";

type AssociateRecord = {
  name: string;
  code: string;
  brokerCode: string;
  status: "Active" | "Inactive" | "Pending";
  contact: string;
  email: string;
};

type RelationshipManagerRecord = {
  name: string;
  empCode: string;
  office: string;
  department: string;
  reportingManager: string;
  status: "Active" | "Onboarding" | "Resigned";
  contact: string;
  email: string;
  joiningDate: string;
  associates: AssociateRecord[];
};

const relationshipManagers: RelationshipManagerRecord[] = [
  {
    name: "Priya Sharma",
    empCode: "RM-1021",
    office: "Mumbai Head Office",
    department: "Business Development",
    reportingManager: "Anita Verma",
    status: "Active",
    contact: "+91 99876 54321",
    email: "priya.sharma@coverscrafter.com",
    joiningDate: "22 Nov 2023",
    associates: [
      {
        name: "Aarav Desai",
        code: "POS-9001",
        brokerCode: "BRK-4561",
        status: "Active",
        contact: "+91 98765 10011",
        email: "aarav.desai@coverscrafter.com",
      },
      {
        name: "Neha Kulkarni",
        code: "POS-9002",
        brokerCode: "BRK-4562",
        status: "Pending",
        contact: "+91 91234 22011",
        email: "neha.kulkarni@coverscrafter.com",
      },
    ],
  },
  {
    name: "Rahul Mehta",
    empCode: "RM-1033",
    office: "Delhi Regional Office",
    department: "Operations",
    reportingManager: "Rahul Saxena",
    status: "Onboarding",
    contact: "+91 90909 87654",
    email: "rahul.mehta@coverscrafter.com",
    joiningDate: "01 Oct 2025",
    associates: [
      {
        name: "Kriti Sinha",
        code: "POS-9033",
        brokerCode: "BRK-4600",
        status: "Active",
        contact: "+91 90001 23456",
        email: "kriti.sinha@coverscrafter.com",
      },
    ],
  },
  {
    name: "Divya Singh",
    empCode: "RM-1004",
    office: "Bengaluru Shared Services",
    department: "Finance",
    reportingManager: "Shruti Bhatt",
    status: "Resigned",
    contact: "+91 99880 11223",
    email: "divya.singh@coverscrafter.com",
    joiningDate: "15 Jan 2022",
    associates: [
      {
        name: "Manoj Rao",
        code: "POS-9055",
        brokerCode: "BRK-4701",
        status: "Inactive",
        contact: "+91 90123 44556",
        email: "manoj.rao@coverscrafter.com",
      },
      {
        name: "Sneha Patel",
        code: "POS-9060",
        brokerCode: "BRK-4706",
        status: "Active",
        contact: "+91 98877 66554",
        email: "sneha.patel@coverscrafter.com",
      },
      {
        name: "Sameer Sheikh",
        code: "POS-9067",
        brokerCode: "BRK-4709",
        status: "Pending",
        contact: "+91 95500 33221",
        email: "sameer.sheikh@coverscrafter.com",
      },
    ],
  },
];

const statusStyles: Record<RelationshipManagerRecord["status"] | AssociateRecord["status"], string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Onboarding: "bg-blue-100 text-blue-700",
  Resigned: "bg-rose-100 text-rose-700",
  Inactive: "bg-slate-200 text-slate-700",
  Pending: "bg-amber-100 text-amber-700",
};

export default function ConsolidationListPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-blue-600">Consolidation desk</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">RM & Associate Registry</h1>
          <p className="text-sm text-slate-500">Monitor relationship managers and their mapped associates for consolidation workflows.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/consolidation"
            className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
          >
            Create RM / Associate
          </Link>
          <button className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            Export CSV
          </button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <input
              type="search"
              placeholder="Search by RM or associate"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">⌕</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-medium text-slate-500">
            <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-blue-200 hover:text-blue-600">All</button>
            <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-blue-200 hover:text-blue-600">Active</button>
            <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-blue-200 hover:text-blue-600">Onboarding</button>
            <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-blue-200 hover:text-blue-600">Resigned</button>
          </div>
        </div>

        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <table className="min-w-[1100px] divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Relationship Manager</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Emp Code</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Office</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Department</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Reporting Manager</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Contact</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Email</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {relationshipManagers.map((rm) => (
                <tr key={rm.empCode} className="transition hover:bg-blue-50/40">
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{rm.name}</span>
                      <span className="text-xs uppercase tracking-wide text-slate-400">Joined {rm.joiningDate}</span>
                      <span className="text-xs text-slate-400">{rm.associates.length} Associates linked</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{rm.empCode}</td>
                  <td className="px-4 py-4 text-slate-600">{rm.office}</td>
                  <td className="px-4 py-4 text-slate-600">{rm.department}</td>
                  <td className="px-4 py-4 text-slate-600">{rm.reportingManager}</td>
                  <td className="px-4 py-4 text-slate-600">{rm.contact}</td>
                  <td className="px-4 py-4 text-slate-600">{rm.email}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[rm.status]}`}>
                      {rm.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-2 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Associates mapped under each RM</h2>
          <p className="text-xs font-medium text-slate-500">Drill into POS associates directly from the parent RM list.</p>
        </header>
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <table className="min-w-[1000px] divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">RM</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Associate</th>
                <th className="px-4 py-3 font-semibold text-slate-600">POS Code</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Broker Code</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Contact</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {relationshipManagers.flatMap((rm) =>
                rm.associates.map((associate) => (
                  <tr key={`${rm.empCode}-${associate.code}`} className="transition hover:bg-blue-50/40">
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{rm.name}</span>
                        <span className="text-xs uppercase tracking-wide text-slate-400">{rm.empCode}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{associate.name}</td>
                    <td className="px-4 py-4 text-slate-600">{associate.code}</td>
                    <td className="px-4 py-4 text-slate-600">{associate.brokerCode}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[associate.status]}`}>
                        {associate.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{associate.contact}</td>
                    <td className="px-4 py-4 text-slate-600">{associate.email}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

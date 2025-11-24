"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRMUsers, getAssociateUsers, type RMUser, type AssociateUser } from "@/lib/api/users";
import { getAuthSession } from "@/lib/utils/storage";
import { ApiError } from "@/lib/api/config";

type AssociateRecord = {
  name: string;
  code: string;
  brokerCode: string;
  status: "Active" | "Inactive" | "Pending";
  contact: string;
  email: string;
};

type RelationshipManagerRecord = {
  _id: string;
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

const statusStyles: Record<RelationshipManagerRecord["status"] | AssociateRecord["status"], string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Onboarding: "bg-blue-100 text-blue-700",
  Resigned: "bg-rose-100 text-rose-700",
  Inactive: "bg-slate-200 text-slate-700",
  Pending: "bg-amber-100 text-amber-700",
};

export default function ConsolidationListPage() {
  const [relationshipManagers, setRelationshipManagers] = useState<RelationshipManagerRecord[]>([]);
  const [allAssociates, setAllAssociates] = useState<AssociateUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | RelationshipManagerRecord["status"]>("All");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const session = getAuthSession();
    if (!session?.token) {
      setError("Please sign in to view RM & Associates");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [rmUsers, associateUsers] = await Promise.all([
        getRMUsers(session.token),
        getAssociateUsers(session.token),
      ]);

      setAllAssociates(associateUsers);

      // Map RM users to RelationshipManagerRecord format
      const mappedRMs: RelationshipManagerRecord[] = rmUsers.map((rm) => {
        // Filter associates that belong to this RM (you may need to adjust based on your data structure)
        const rmAssociates = associateUsers
          .filter((assoc) => assoc.status !== "deleted")
          .map((assoc) => ({
            name: assoc.name,
            code: assoc.posCode || "N/A",
            brokerCode: assoc.associateCode,
            status: (assoc.status === "active" ? "Active" : assoc.status === "inactive" ? "Inactive" : "Pending") as AssociateRecord["status"],
            contact: assoc.contactNo,
            email: assoc.email,
          }));

        return {
          _id: rm._id,
          name: `${rm.firstName} ${rm.middleName || ""} ${rm.lastName}`.trim(),
          empCode: rm.empCode,
          office: rm.state,
          department: rm.department,
          reportingManager: rm.reportingManager || "N/A",
          status: rm.resigned ? "Resigned" : (rm.status === "active" ? "Active" : "Onboarding") as RelationshipManagerRecord["status"],
          contact: rm.contactNo,
          email: rm.email,
          joiningDate: new Date(rm.joiningDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          associates: rmAssociates,
        };
      });

      setRelationshipManagers(mappedRMs);
    } catch (error) {
      console.error("Failed to fetch RM & Associates:", error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to load data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRMs = relationshipManagers.filter((rm) => {
    const matchesSearch = 
      rm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rm.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rm.associates.some(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "All" || rm.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
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
            href="/dashboard/admin/consolidation"
            className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
          >
            Create RM / Associate
          </Link>
          <button className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            Export CSV
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <input
              type="search"
              placeholder="Search by RM or associate"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">⌕</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-medium text-slate-500">
            <button 
              onClick={() => setStatusFilter("All")}
              className={`rounded-full border px-4 py-2 transition ${statusFilter === "All" ? "border-blue-400 bg-blue-50 text-blue-600" : "border-slate-200 hover:border-blue-200 hover:text-blue-600"}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter("Active")}
              className={`rounded-full border px-4 py-2 transition ${statusFilter === "Active" ? "border-blue-400 bg-blue-50 text-blue-600" : "border-slate-200 hover:border-blue-200 hover:text-blue-600"}`}
            >
              Active
            </button>
            <button 
              onClick={() => setStatusFilter("Onboarding")}
              className={`rounded-full border px-4 py-2 transition ${statusFilter === "Onboarding" ? "border-blue-400 bg-blue-50 text-blue-600" : "border-slate-200 hover:border-blue-200 hover:text-blue-600"}`}
            >
              Onboarding
            </button>
            <button 
              onClick={() => setStatusFilter("Resigned")}
              className={`rounded-full border px-4 py-2 transition ${statusFilter === "Resigned" ? "border-blue-400 bg-blue-50 text-blue-600" : "border-slate-200 hover:border-blue-200 hover:text-blue-600"}`}
            >
              Resigned
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-slate-500">Loading RM & Associates...</p>
          </div>
        ) : filteredRMs.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-slate-500">No relationship managers found.</p>
          </div>
        ) : (
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
              {filteredRMs.map((rm) => (
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
        )}
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
              {filteredRMs.flatMap((rm) =>
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

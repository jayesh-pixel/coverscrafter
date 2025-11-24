"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRMUsers, getAssociateUsers, updateRMUser, updateAssociateUser, type RMUser, type AssociateUser } from "@/lib/api/users";
import { getAuthSession } from "@/lib/utils/storage";

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
  const [activeTab, setActiveTab] = useState<"rm" | "associate">("rm");
  const [relationshipManagers, setRelationshipManagers] = useState<RelationshipManagerRecord[]>([]);
  const [allAssociates, setAllAssociates] = useState<AssociateUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | RelationshipManagerRecord["status"]>("All");
  const [editingRM, setEditingRM] = useState<RelationshipManagerRecord | null>(null);
  const [editingAssociate, setEditingAssociate] = useState<AssociateUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      setError(error instanceof Error ? error.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRM = (rm: RelationshipManagerRecord) => {
    setEditingRM(rm);
    setEditingAssociate(null);
    setIsEditModalOpen(true);
  };

  const handleEditAssociate = (associate: AssociateUser) => {
    setEditingAssociate(associate);
    setEditingRM(null);
    setIsEditModalOpen(true);
  };

  const handleSaveRM = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingRM) return;

    const session = getAuthSession();
    if (!session?.token) {
      setError("Please sign in to update RM");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const data = {
        FirstName: formData.get("firstName") as string,
        MiddleName: formData.get("middleName") as string,
        LastName: formData.get("lastName") as string,
        ContactNo: formData.get("contactNo") as string,
        EmailID: formData.get("email") as string,
        State: formData.get("state") as string,
        Department: formData.get("department") as string,
        ReportingOffice: formData.get("reportingOffice") as string,
        ReportingManager: formData.get("reportingManager") as string,
        Resigned: formData.get("resigned") === "true",
        status: formData.get("status") as string,
      };

      await updateRMUser(editingRM._id, data, session.token);
      setSuccessMessage("RM updated successfully");
      setIsEditModalOpen(false);
      setEditingRM(null);
      await fetchData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to update RM:", error);
      setError(error instanceof Error ? error.message : "Failed to update RM");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAssociate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingAssociate) return;

    const session = getAuthSession();
    if (!session?.token) {
      setError("Please sign in to update Associate");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const data = {
        AssociateName: formData.get("name") as string,
        ContactNo: formData.get("contactNo") as string,
        AssociateEmailId: formData.get("email") as string,
        AssociateStateName: formData.get("stateName") as string,
        AssociateAddress: formData.get("address") as string,
        ContactPerson: formData.get("contactPerson") as string,
        PosCode: formData.get("posCode") as string,
        status: formData.get("status") as string,
      };

      await updateAssociateUser(editingAssociate._id, data, session.token);
      setSuccessMessage("Associate updated successfully");
      setIsEditModalOpen(false);
      setEditingAssociate(null);
      await fetchData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to update Associate:", error);
      setError(error instanceof Error ? error.message : "Failed to update Associate");
    } finally {
      setIsSaving(false);
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
      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
          {successMessage}
        </div>
      )}
      <header className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-blue-600">RM/Associate desk</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">RM & Associate Registry</h1>
          <p className="text-sm text-slate-500">Monitor relationship managers and their mapped associates.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/rm-management"
            className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
          >
            Create RM / Associate
          </Link>
          <button className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            Export CSV
          </button>
        </div>
      </header>

      <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm max-w-md">
        <button
          onClick={() => setActiveTab("rm")}
          className={`flex flex-1 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
            activeTab === "rm" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Relationship Managers
        </button>
        <button
          onClick={() => setActiveTab("associate")}
          className={`flex flex-1 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
            activeTab === "associate" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Associates
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      {activeTab === "rm" && (
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
                <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
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
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleEditRM(rm)}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
        </section>
      )}

      {activeTab === "associate" && (
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
                <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRMs.flatMap((rm) =>
                rm.associates.map((associate, index) => {
                  // Find the full associate object from allAssociates
                  const fullAssociate = allAssociates.find(a => a.associateCode === associate.brokerCode);
                  return (
                  <tr key={`${rm.empCode}-${associate.brokerCode}-${index}`} className="transition hover:bg-blue-50/40">
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
                    <td className="px-4 py-4">
                      {fullAssociate && (
                        <button
                          onClick={() => handleEditAssociate(fullAssociate)}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
        </section>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (editingRM || editingAssociate) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingRM(null);
                setEditingAssociate(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            <h2 className="mb-6 text-xl font-semibold text-slate-900">
              Edit {editingRM ? 'Relationship Manager' : 'Associate'}
            </h2>

            {editingRM && (
              <form onSubmit={handleSaveRM} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      defaultValue={editingRM.name.split(' ')[0]}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      defaultValue={editingRM.name.split(' ')[1] || ''}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      defaultValue={editingRM.name.split(' ').slice(-1)[0]}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Contact Number *</label>
                    <input
                      type="tel"
                      name="contactNo"
                      defaultValue={editingRM.contact}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingRM.email}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">State *</label>
                    <input
                      type="text"
                      name="state"
                      defaultValue={editingRM.office}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Department *</label>
                    <input
                      type="text"
                      name="department"
                      defaultValue={editingRM.department}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Reporting Office</label>
                    <input
                      type="text"
                      name="reportingOffice"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Reporting Manager</label>
                    <input
                      type="text"
                      name="reportingManager"
                      defaultValue={editingRM.reportingManager}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Status *</label>
                    <select
                      name="status"
                      defaultValue={editingRM.status === 'Active' ? 'active' : editingRM.status === 'Resigned' ? 'inactive' : 'active'}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Resigned</label>
                    <select
                      name="resigned"
                      defaultValue={editingRM.status === 'Resigned' ? 'true' : 'false'}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingRM(null);
                    }}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {editingAssociate && (
              <form onSubmit={handleSaveAssociate} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Associate Name *</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingAssociate.name}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Contact Person</label>
                    <input
                      type="text"
                      name="contactPerson"
                      defaultValue={editingAssociate.contactPerson}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Contact Number *</label>
                    <input
                      type="tel"
                      name="contactNo"
                      defaultValue={editingAssociate.contactNo}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingAssociate.email}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">State *</label>
                    <input
                      type="text"
                      name="stateName"
                      defaultValue={editingAssociate.associateStateName}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">POS Code</label>
                    <input
                      type="text"
                      name="posCode"
                      defaultValue={editingAssociate.posCode || ''}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Address</label>
                    <textarea
                      name="address"
                      defaultValue={editingAssociate.associateAddress}
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Status *</label>
                    <select
                      name="status"
                      defaultValue={editingAssociate.status}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingAssociate(null);
                    }}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

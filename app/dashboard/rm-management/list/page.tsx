"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRMUsers, getAssociateUsers, updateRMUser, updateAssociateUser, type RMUser, type AssociateUser } from "@/lib/api/users";
import { getValidAuthToken } from "@/lib/utils/storage";
import { ApiError } from "@/lib/api/config";

const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

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
  const [allRMs, setAllRMs] = useState<RMUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | RelationshipManagerRecord["status"]>("All");
  const [editingRM, setEditingRM] = useState<RelationshipManagerRecord | null>(null);
  const [editingAssociate, setEditingAssociate] = useState<AssociateUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [viewingAssociate, setViewingAssociate] = useState<AssociateUser | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [rmCurrentPage, setRmCurrentPage] = useState(1);
  const [associateCurrentPage, setAssociateCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleExportCredentials = (rm: RelationshipManagerRecord) => {
    // Find the full RM object from allRMs
    const fullRM = allRMs.find(r => r._id === rm._id);
    
    if (!fullRM) {
      setError("RM data not found");
      return;
    }

    // Create Excel data
    const excelData = [
      ['RM Credentials Export'],
      [''],
      ['Login Details'],
      ['Email', fullRM.email],
      ['Password', fullRM.password || 'Not Available'],
    ];

    // Convert to CSV
    const csv = excelData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RM_Credentials_${fullRM.empCode}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSuccessMessage(`Credentials exported for ${fullRM.firstName} ${fullRM.lastName}`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleExportAssociateCredentials = (associate: AssociateUser) => {
    // Create Excel data
    const excelData = [
      ['Associate Credentials Export'],
      [''],
      ['Login Details'],
      ['Email', associate.email],
      ['Password', associate.password || 'Not Available'],
    ];

    // Convert to CSV
    const csv = excelData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Associate_Credentials_${associate.associateCode}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSuccessMessage(`Credentials exported for ${associate.name}`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = await getValidAuthToken();
    if (!token) {
      setError("Please sign in to view RM & Associates");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [rmUsers, associateUsers] = await Promise.all([
        getRMUsers(token),
        getAssociateUsers(token),
      ]);

      setAllAssociates(associateUsers);
      setAllRMs(rmUsers);

      // Map RM users to RelationshipManagerRecord format
      const mappedRMs: RelationshipManagerRecord[] = rmUsers.map((rm) => {
        // Filter associates that belong to this RM based on createdBy field
        const rmAssociates = associateUsers
          .filter((assoc) => assoc.status !== "deleted" && assoc.createdBy === rm.firebaseUid)
          .map((assoc) => ({
            name: assoc.name,
            code: assoc.posCode || "N/A",
            brokerCode: assoc.associateCode,
            status: (assoc.status === "active" ? "Active" : assoc.status === "inactive" ? "Inactive" : "Pending") as AssociateRecord["status"],
            contact: assoc.contactNo === "null" ? "N/A" : assoc.contactNo,
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

  const handleViewAssociate = (associate: AssociateUser) => {
    setViewingAssociate(associate);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingAssociate(null);
  };

  const handleSaveRM = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingRM) return;

    const form = event.currentTarget;
    if (!form || !(form instanceof HTMLFormElement)) {
      setError("Form element not found");
      return;
    }

    const token = await getValidAuthToken();
    if (!token) {
      setError("Please sign in to update RM");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const formData = new FormData(form);
      const data = {
        FirstName: formData.get("firstName") as string,
        MiddleName: formData.get("middleName") as string,
        LastName: formData.get("lastName") as string,
        ContactNo: formData.get("contactNo") as string,
        EmailID: formData.get("email") as string,
        State: formData.get("state") as string,
        ReportingManager: formData.get("reportingManager") as string,
        status: formData.get("status") as string,
      };

      console.log('Updating RM with data:', data);
      const result = await updateRMUser(editingRM._id, data, token);
      console.log('Update result:', result);
      
      setSuccessMessage("RM updated successfully");
      setIsEditModalOpen(false);
      setEditingRM(null);
      await fetchData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to update RM:", error);
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : error.message;
        setError(fullError);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update RM");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAssociate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingAssociate) return;

    const form = event.currentTarget;
    if (!form || !(form instanceof HTMLFormElement)) {
      setError("Form element not found");
      return;
    }

    const token = await getValidAuthToken();
    if (!token) {
      setError("Please sign in to update Associate");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const formData = new FormData(form);
      const posCode = formData.get("posCode") as string;
      const selectedRmId = formData.get("createdBy") as string;
      
      // Find the selected RM to get firebaseUid
      const selectedRM = allRMs.find(rm => rm._id === selectedRmId);
      
      const data: any = {
        AssociateName: formData.get("name") as string,
        AssociatePanNo: formData.get("panNo") as string,
        AssociateAadharNo: formData.get("aadharNo") as string,
        ContactPerson: formData.get("contactPerson") as string,
        ContactNo: formData.get("contactNo") as string,
        AssociateEmailId: formData.get("email") as string,
        AssociateStateName: formData.get("stateName") as string,
        AssociateAddress: formData.get("address") as string,
        BPANNo: formData.get("bpanNo") as string,
        BPANName: formData.get("bpanName") as string,
        AccountNo: formData.get("accountNo") as string,
        AccountType: formData.get("accountType") as string,
        IFSC: formData.get("ifsc") as string,
        BankName: formData.get("bankName") as string,
        StateName: formData.get("bankStateName") as string,
        BranchName: formData.get("branchName") as string,
        BankAddress: formData.get("bankAddress") as string,
        status: formData.get("status") as string,
        rmId: selectedRM ? selectedRM.firebaseUid : selectedRmId, // Use firebaseUid in rmId field
      };
      
      // Only add PosCode if it has a value
      if (posCode && posCode.trim()) {
        data.PosCode = posCode.trim();
      }

      console.log('Updating associate with data:', data);
      const result = await updateAssociateUser(editingAssociate._id, data, token);
      console.log('Update result:', result);
      
      setSuccessMessage("Associate updated successfully");
      setIsEditModalOpen(false);
      setEditingAssociate(null);
      await fetchData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to update Associate:", error);
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : error.message;
        setError(fullError);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update Associate");
      }
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

  const filteredAssociates = allAssociates.filter((assoc) => {
    if (assoc.status === "deleted") return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      assoc.name.toLowerCase().includes(searchLower) ||
      assoc.associateCode.toLowerCase().includes(searchLower) ||
      assoc.email.toLowerCase().includes(searchLower) ||
      (assoc.posCode && assoc.posCode.toLowerCase().includes(searchLower)) ||
      (assoc.contactPerson && assoc.contactPerson.toLowerCase().includes(searchLower))
    );
  });

  // Pagination calculations
  const rmTotalPages = Math.ceil(filteredRMs.length / itemsPerPage);
  const rmStartIndex = (rmCurrentPage - 1) * itemsPerPage;
  const rmEndIndex = rmStartIndex + itemsPerPage;
  const paginatedRMs = filteredRMs.slice(rmStartIndex, rmEndIndex);

  const associateTotalPages = Math.ceil(filteredAssociates.length / itemsPerPage);
  const associateStartIndex = (associateCurrentPage - 1) * itemsPerPage;
  const associateEndIndex = associateStartIndex + itemsPerPage;
  const paginatedAssociates = filteredAssociates.slice(associateStartIndex, associateEndIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setRmCurrentPage(1);
    setAssociateCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Helper function to generate page numbers with ellipsis
  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };
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
          <>
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            <table className="min-w-[1100px] border-collapse text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Relationship Manager</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Emp Code</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Office</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Department</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Reporting Manager</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Contact</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Email</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Status</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRMs.map((rm) => (
                <tr key={rm.empCode} className="transition hover:bg-blue-50/40">
                  <td className="border border-slate-300 px-4 py-3 bg-white">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{rm.name}</span>
                      <span className="text-xs uppercase tracking-wide text-slate-400">Joined {rm.joiningDate}</span>
                      <span className="text-xs text-slate-400">{rm.associates.length} Associates linked</span>
                    </div>
                  </td>
                  <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{rm.empCode}</td>
                  <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{rm.office}</td>
                  <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{rm.department}</td>
                  <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{rm.reportingManager}</td>
                  <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{rm.contact}</td>
                  <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{rm.email}</td>
                  <td className="border border-slate-300 px-4 py-3 bg-white">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[rm.status]}`}>
                      {rm.status}
                    </span>
                  </td>
                  <td className="border border-slate-300 px-4 py-3 bg-white">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditRM(rm)}
                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleExportCredentials(rm)}
                        className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100"
                      >
                        Export
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          
          {/* Pagination */}
          {rmTotalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 mt-4">
              <div className="text-sm text-slate-500">
                Showing {rmStartIndex + 1} to {Math.min(rmEndIndex, filteredRMs.length)} of {filteredRMs.length} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRmCurrentPage(p => Math.max(1, p - 1))}
                  disabled={rmCurrentPage === 1}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {getPageNumbers(rmCurrentPage, rmTotalPages).map((page, index) => (
                  typeof page === 'number' ? (
                    <button
                      key={page}
                      onClick={() => setRmCurrentPage(page)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                        rmCurrentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={`ellipsis-${index}`} className="px-2 py-1.5 text-slate-400">
                      {page}
                    </span>
                  )
                ))}
                <button
                  onClick={() => setRmCurrentPage(p => Math.min(rmTotalPages, p + 1))}
                  disabled={rmCurrentPage === rmTotalPages}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          </>
        )}
        </section>
      )}

      {activeTab === "associate" && (
        <section className="mx-auto w-full max-w-6xl space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-2 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">All Associates</h2>
          <p className="text-xs font-medium text-slate-500">Complete list of all associates in the system.</p>
        </header>
        
        {/* Search Box for Associates */}
        <div className="relative w-full max-w-sm">
          <input
            type="search"
            placeholder="Search by name, code, or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">⌕</span>
        </div>
        
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <table className="min-w-[1000px] border-collapse text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Associate</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Associate Code</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">POS Code</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Status</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Contact</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Email</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">State</th>
                <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssociates.map((associate) => (
                  <tr key={associate._id} className="transition hover:bg-blue-50/40">
                    <td className="border border-slate-300 px-4 py-3 bg-white">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{associate.name}</span>
                        <span className="text-xs text-slate-400">{associate.contactPerson}</span>
                      </div>
                    </td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{associate.associateCode}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{associate.posCode || 'N/A'}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        associate.status === "active" ? "bg-emerald-100 text-emerald-700" : 
                        associate.status === "inactive" ? "bg-slate-200 text-slate-700" : 
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {associate.status === "active" ? "Active" : associate.status === "inactive" ? "Inactive" : "Pending"}
                      </span>
                    </td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">
                      {associate.contactNo === "null" ? "N/A" : associate.contactNo}
                    </td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{associate.email}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{associate.associateStateName || 'N/A'}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewAssociate(associate)}
                          className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditAssociate(associate)}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleExportAssociateCredentials(associate)}
                          className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600 transition hover:bg-green-100"
                          title="Export Credentials"
                        >
                          Export
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {associateTotalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 mt-4">
            <div className="text-sm text-slate-500">
              Showing {associateStartIndex + 1} to {Math.min(associateEndIndex, filteredAssociates.length)} of {filteredAssociates.length} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setAssociateCurrentPage(p => Math.max(1, p - 1))}
                disabled={associateCurrentPage === 1}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {getPageNumbers(associateCurrentPage, associateTotalPages).map((page, index) => (
                typeof page === 'number' ? (
                  <button
                    key={page}
                    onClick={() => setAssociateCurrentPage(page)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      associateCurrentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={`ellipsis-${index}`} className="px-2 py-1.5 text-slate-400">
                    {page}
                  </span>
                )
              ))}
              <button
                onClick={() => setAssociateCurrentPage(p => Math.min(associateTotalPages, p + 1))}
                disabled={associateCurrentPage === associateTotalPages}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
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
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="grid gap-4 md:grid-cols-3">
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
                        defaultValue={editingRM.name.split(' ').length > 2 ? editingRM.name.split(' ').slice(1, -1).join(' ') : ''}
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
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">State *</label>
                      <select
                        name="state"
                        defaultValue={editingRM.office}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">--Select State--</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Reporting Manager</label>
                      <input
                        type="text"
                        name="reportingManager"
                        defaultValue={editingRM.reportingManager !== 'N/A' ? editingRM.reportingManager : ''}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Status *</label>
                      <select
                        name="status"
                        defaultValue={editingRM.status === 'Active' ? 'active' : 'inactive'}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
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
                <h3 className="text-sm font-semibold text-slate-700">Primary Details</h3>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                      <label className="block text-sm font-medium text-slate-700">PAN Number *</label>
                      <input
                        type="text"
                        name="panNo"
                        defaultValue={editingAssociate.associatePanNo}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">AADHAR No *</label>
                      <input
                        type="text"
                        name="aadharNo"
                        defaultValue={editingAssociate.associateAadharNo}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Contact Person *</label>
                      <input
                        type="text"
                        name="contactPerson"
                        defaultValue={editingAssociate.contactPerson}
                        required
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
                      <label className="block text-sm font-medium text-slate-700">POS Code</label>
                      <input
                        type="text"
                        name="posCode"
                        defaultValue={editingAssociate.posCode || ''}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">State *</label>
                      <select
                        name="stateName"
                        defaultValue={editingAssociate.associateStateName}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">--Select State--</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
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
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Relationship Manager *</label>
                      <select
                        name="createdBy"
                        defaultValue={editingAssociate.createdBy || ''}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">--Select RM--</option>
                        {allRMs.map((rm) => (
                          <option key={rm._id} value={rm._id}>
                            {rm.firstName} {rm.lastName} ({rm.empCode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-slate-700">Broker Communication Address</label>
                      <textarea
                        name="address"
                        defaultValue={editingAssociate.associateAddress}
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-700">Bank Account Details</h3>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Beneficiary PAN Number *</label>
                      <input
                        type="text"
                        name="bpanNo"
                        defaultValue={editingAssociate.bpanNo}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Name as in Bank Account *</label>
                      <input
                        type="text"
                        name="bpanName"
                        defaultValue={editingAssociate.bpanName}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Account No *</label>
                      <input
                        type="text"
                        name="accountNo"
                        defaultValue={editingAssociate.accountNo}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Account Type *</label>
                      <select
                        name="accountType"
                        defaultValue={editingAssociate.accountType}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                        <option value="Cash Credit">Cash Credit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">IFSC Code *</label>
                      <input
                        type="text"
                        name="ifsc"
                        defaultValue={editingAssociate.ifsc}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Bank Name *</label>
                      <input
                        type="text"
                        name="bankName"
                        defaultValue={editingAssociate.bankName}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Bank State *</label>
                      <select
                        name="bankStateName"
                        defaultValue={editingAssociate.stateName}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">--Select State--</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Branch Name *</label>
                      <input
                        type="text"
                        name="branchName"
                        defaultValue={editingAssociate.branchName}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-slate-700">Bank Branch Address</label>
                      <textarea
                        name="bankAddress"
                        defaultValue={editingAssociate.bankAddress}
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
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

      {/* View Associate Details Modal */}
      {isViewModalOpen && viewingAssociate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0">
              <h2 className="text-xl font-semibold text-slate-900">Associate Details</h2>
              <button
                onClick={handleCloseViewModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">Basic Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-slate-500">Associate Name</label>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{viewingAssociate.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Associate Code</label>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{viewingAssociate.associateCode}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Contact Person</label>
                      <p className="mt-1 text-sm text-slate-900">{viewingAssociate.contactPerson}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Contact Number</label>
                      <p className="mt-1 text-sm text-slate-900">{viewingAssociate.contactNo}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Email</label>
                      <p className="mt-1 text-sm text-slate-900">{viewingAssociate.email}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Status</label>
                      <p className="mt-1">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          viewingAssociate.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {viewingAssociate.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">PAN Number</label>
                      <p className="mt-1 text-sm text-slate-900">{viewingAssociate.associatePanNo}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Aadhar Number</label>
                      <p className="mt-1 text-sm text-slate-900">{viewingAssociate.associateAadharNo}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">State</label>
                      <p className="mt-1 text-sm text-slate-900">{viewingAssociate.associateStateName || '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-slate-500">Address</label>
                      <p className="mt-1 text-sm text-slate-900">{viewingAssociate.associateAddress}</p>
                    </div>
                    {viewingAssociate.isPos && (
                      <div>
                        <label className="text-xs font-medium text-slate-500">POS Code</label>
                        <p className="mt-1 text-sm text-slate-900">{viewingAssociate.posCode || '-'}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bank Details */}
                <div className="rounded-2xl border border-slate-200 bg-blue-50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">Bank Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-slate-500">Bank Name</label>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{viewingAssociate.bankName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Account Number</label>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{viewingAssociate.accountNo}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">IFSC Code</label>
                      <p className="mt-1 text-sm text-slate-900">{viewingAssociate.ifsc}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Account Type</label>
                      <p className="mt-1 text-sm text-slate-900">{viewingAssociate.accountType}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Branch Name</label>
                      <p className="mt-1 text-sm text-slate-900">{viewingAssociate.branchName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Branch State</label>
                      <p className="mt-1 text-sm text-slate-900">{viewingAssociate.stateName}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-slate-500">Bank Address</label>
                      <p className="mt-1 text-sm text-slate-900">{viewingAssociate.bankAddress}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Beneficiary PAN</label>
                      <p className="mt-1 text-sm text-slate-900">{viewingAssociate.bpanNo}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Beneficiary Name</label>
                      <p className="mt-1 text-sm text-slate-900">{viewingAssociate.bpanName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Default Account</label>
                      <p className="mt-1">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          viewingAssociate.default ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {viewingAssociate.default ? "Yes" : "No"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">System Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-slate-500">Created At</label>
                      <p className="mt-1 text-sm text-slate-900">
                        {new Date(viewingAssociate.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Last Updated</label>
                      <p className="mt-1 text-sm text-slate-900">
                        {new Date(viewingAssociate.updatedAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 shrink-0">
              <button
                onClick={handleCloseViewModal}
                className="rounded-xl border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAssociateUsers, type AssociateUser } from "@/lib/api/users";
import { getValidAuthToken, getAuthSession } from "@/lib/utils/storage";
import { ApiError } from "@/lib/api/config";

export default function RMAssociatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [associates, setAssociates] = useState<AssociateUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssociate, setSelectedAssociate] = useState<AssociateUser | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchAssociates = async () => {
      const token = await getValidAuthToken();
      const session = getAuthSession();
      if (!token || !session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch associates created by the logged-in user (RM)
        const data = await getAssociateUsers(token, undefined, (session.user as any)._id);
        setAssociates(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch associates:", error);
        if (error instanceof ApiError) {
          setError(error.message);
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load associates");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssociates();
  }, []);

  const filteredAssociates = associates.filter(
    (assoc) =>
      assoc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assoc.posCode || assoc.associateCode).toLowerCase().includes(searchTerm.toLowerCase()) ||
      assoc.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assoc.contactNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (associate: AssociateUser) => {
    setSelectedAssociate(associate);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedAssociate(null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Associates</h1>
          <p className="text-sm text-slate-500">Manage and track your POS partners</p>
        </div>
        {/* <Link 
          href="/dashboard/rm/associates/create"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Add New Associate
        </Link> */}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4">
          <input
            type="text"
            placeholder="Search by name or code..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 px-6 py-3 text-xs font-semibold uppercase text-slate-700 bg-slate-50">Associate Name</th>
                <th className="border border-slate-300 px-6 py-3 text-xs font-semibold uppercase text-slate-700 bg-slate-50">Associate Code</th>
                <th className="border border-slate-300 px-6 py-3 text-xs font-semibold uppercase text-slate-700 bg-slate-50">Contact Person</th>
                <th className="border border-slate-300 px-6 py-3 text-xs font-semibold uppercase text-slate-700 bg-slate-50">Contact Number</th>
                <th className="border border-slate-300 px-6 py-3 text-xs font-semibold uppercase text-slate-700 bg-slate-50">Email</th>
                <th className="border border-slate-300 px-6 py-3 text-xs font-semibold uppercase text-slate-700 bg-slate-50">State</th>
                <th className="border border-slate-300 px-6 py-3 text-xs font-semibold uppercase text-slate-700 bg-slate-50">Status</th>
                <th className="border border-slate-300 px-6 py-3 text-right text-xs font-semibold uppercase text-slate-700 bg-slate-50">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="border border-slate-300 px-6 py-3 bg-white text-center text-slate-500">
                    Loading associates...
                  </td>
                </tr>
              ) : filteredAssociates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="border border-slate-300 px-6 py-3 bg-white text-center text-slate-500">
                    No associates found matching your search.
                  </td>
                </tr>
              ) : (
                filteredAssociates.map((assoc) => (
                  <tr key={assoc._id} className="hover:bg-slate-50">
                    <td className="border border-slate-300 px-6 py-3 bg-white font-medium text-slate-900">{assoc.name}</td>
                    <td className="border border-slate-300 px-6 py-3 bg-white text-slate-500">{assoc.associateCode}</td>
                    <td className="border border-slate-300 px-6 py-3 bg-white text-slate-600">{assoc.contactPerson}</td>
                    <td className="border border-slate-300 px-6 py-3 bg-white text-slate-600">{assoc.contactNo}</td>
                    <td className="border border-slate-300 px-6 py-3 bg-white text-slate-600">{assoc.email}</td>
                    <td className="border border-slate-300 px-6 py-3 bg-white text-slate-600">{assoc.associateStateName || '-'}</td>
                    <td className="border border-slate-300 px-6 py-3 bg-white">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          assoc.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {assoc.status}
                      </span>
                    </td>
                    <td className="border border-slate-300 px-6 py-3 bg-white text-right">
                      <button 
                        onClick={() => handleViewDetails(assoc)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-xs"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Associate Details Modal */}
      {isDetailModalOpen && selectedAssociate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0">
              <h2 className="text-xl font-semibold text-slate-900">Associate Details</h2>
              <button
                onClick={handleCloseModal}
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
                      <p className="mt-1 text-sm font-semibold text-slate-900">{selectedAssociate.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Associate Code</label>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{selectedAssociate.associateCode}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Contact Person</label>
                      <p className="mt-1 text-sm text-slate-900">{selectedAssociate.contactPerson}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Contact Number</label>
                      <p className="mt-1 text-sm text-slate-900">{selectedAssociate.contactNo}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Email</label>
                      <p className="mt-1 text-sm text-slate-900">{selectedAssociate.email}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Status</label>
                      <p className="mt-1">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          selectedAssociate.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {selectedAssociate.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">PAN Number</label>
                      <p className="mt-1 text-sm text-slate-900">{selectedAssociate.associatePanNo}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Aadhar Number</label>
                      <p className="mt-1 text-sm text-slate-900">{selectedAssociate.associateAadharNo}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">State</label>
                      <p className="mt-1 text-sm text-slate-900">{selectedAssociate.associateStateName || '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-slate-500">Address</label>
                      <p className="mt-1 text-sm text-slate-900">{selectedAssociate.associateAddress}</p>
                    </div>
                    {selectedAssociate.isPos && (
                      <div>
                        <label className="text-xs font-medium text-slate-500">POS Code</label>
                        <p className="mt-1 text-sm text-slate-900">{selectedAssociate.posCode || '-'}</p>
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
                      <p className="mt-1 text-sm font-semibold text-slate-900">{selectedAssociate.bankName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Account Number</label>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{selectedAssociate.accountNo}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">IFSC Code</label>
                      <p className="mt-1 text-sm text-slate-900">{selectedAssociate.ifsc}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Account Type</label>
                      <p className="mt-1 text-sm text-slate-900">{selectedAssociate.accountType}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Branch Name</label>
                      <p className="mt-1 text-sm text-slate-900">{selectedAssociate.branchName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Branch State</label>
                      <p className="mt-1 text-sm text-slate-900">{selectedAssociate.stateName}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-slate-500">Bank Address</label>
                      <p className="mt-1 text-sm text-slate-900">{selectedAssociate.bankAddress}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Beneficiary PAN</label>
                      <p className="mt-1 text-sm text-slate-900">{selectedAssociate.bpanNo}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Beneficiary Name</label>
                      <p className="mt-1 text-sm text-slate-900">{selectedAssociate.bpanName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Default Account</label>
                      <p className="mt-1">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          selectedAssociate.default ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {selectedAssociate.default ? "Yes" : "No"}
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
                        {new Date(selectedAssociate.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Last Updated</label>
                      <p className="mt-1 text-sm text-slate-900">
                        {new Date(selectedAssociate.updatedAt).toLocaleString('en-IN', {
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
                onClick={handleCloseModal}
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

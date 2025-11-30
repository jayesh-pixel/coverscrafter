"use client";

import { useEffect, useState } from "react";
import { getAuthSession, getValidAuthToken } from "@/lib/utils/storage";
import { getUserProfile } from "@/lib/api/users";

export default function AssociateProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getValidAuthToken();
      if (!token) {
        setError("You must be signed in to view profile");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getUserProfile(token);
        setProfile(data);
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <p className="text-sm text-rose-600">{error || "Profile not found"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
      </div>

      {/* Personal Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Personal Information</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Associate Code</label>
            <p className="text-sm text-slate-900">{profile.associateCode || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Name</label>
            <p className="text-sm text-slate-900">{profile.name || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <p className="text-sm text-slate-900">{profile.email || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Contact Number</label>
            <p className="text-sm text-slate-900">{profile.contactNo || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Contact Person</label>
            <p className="text-sm text-slate-900">{profile.contactPerson || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">PAN Number</label>
            <p className="text-sm text-slate-900">{profile.associatePanNo || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Aadhar Number</label>
            <p className="text-sm text-slate-900">{profile.associateAadharNo || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">State</label>
            <p className="text-sm text-slate-900">{profile.associateStateName || "N/A"}</p>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-700">Address</label>
            <p className="text-sm text-slate-900">{profile.associateAddress || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Bank Details</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Beneficiary PAN</label>
            <p className="text-sm text-slate-900">{profile.bpanNo || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Beneficiary Name</label>
            <p className="text-sm text-slate-900">{profile.bpanName || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Account Number</label>
            <p className="text-sm text-slate-900">{profile.accountNo || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Account Type</label>
            <p className="text-sm text-slate-900">{profile.accountType || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">IFSC Code</label>
            <p className="text-sm text-slate-900">{profile.ifsc || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Bank Name</label>
            <p className="text-sm text-slate-900">{profile.bankName || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Default Account</label>
            <p className="text-sm text-slate-900">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                profile.default ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {profile.default ? "Yes" : "No"}
              </span>
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
            <p className="text-sm text-slate-900">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                profile.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {profile.status || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

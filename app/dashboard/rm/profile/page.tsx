"use client";

import { useEffect, useState } from "react";
import { getAuthSession, getValidAuthToken } from "@/lib/utils/storage";
import { getUserProfile } from "@/lib/api/users";

export default function RMProfilePage() {
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
            <label className="mb-1 block text-sm font-semibold text-slate-700">Employee Code</label>
            <p className="text-sm text-slate-900">{profile.empCode || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Full Name</label>
            <p className="text-sm text-slate-900">
              {[profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ") || profile.name || "N/A"}
            </p>
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
            <label className="mb-1 block text-sm font-semibold text-slate-700">Date of Birth</label>
            <p className="text-sm text-slate-900">
              {profile.dob ? new Date(profile.dob).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Joining Date</label>
            <p className="text-sm text-slate-900">
              {profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Work Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Work Information</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Role</label>
            <p className="text-sm text-slate-900">{profile.role || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">State</label>
            <p className="text-sm text-slate-900">{profile.state || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Department</label>
            <p className="text-sm text-slate-900">{profile.department || "N/A"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Reporting Office</label>
            <p className="text-sm text-slate-900">{profile.reportingOffice || "N/A"}</p>
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
          {profile.resigned && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Resignation Date</label>
              <p className="text-sm text-slate-900">
                {profile.resignationDate ? new Date(profile.resignationDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

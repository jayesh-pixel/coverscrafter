"use client";

import { BankNameManager } from "@/components/bank/BankNameManager";

export default function BankManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Bank Name Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Add, edit, and manage bank names for associate onboarding
          </p>
        </header>

        <BankNameManager />
      </div>
    </div>
  );
}

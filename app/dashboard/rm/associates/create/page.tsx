"use client";

import { AssociateForm } from "@/components/consolidation/ConsolidationForms";
import Link from "next/link";

export default function CreateAssociatePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/rm/associates"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-blue-400 hover:text-blue-600"
        >
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Register New Associate</h1>
          <p className="text-sm text-slate-500">Onboard a new POS partner to your network</p>
        </div>
      </div>

      <AssociateForm 
        title="Associate Registration" 
        description="Fill in the details to register a new associate under your management."
      />
    </div>
  );
}

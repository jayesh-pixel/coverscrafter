"use client";

import { useState } from "react";
import { AssociateForm, RMForm } from "@/components/consolidation/ConsolidationForms";
import { SectionCard } from "@/components/dashboard/overview";

export default function RmManagementPage() {
  const [showCreate, setShowCreate] = useState(true);
  const [createTab, setCreateTab] = useState<"rm" | "associate">("rm");

  return (
    <div className="space-y-8">
      {showCreate && (
        <SectionCard title="Create RM / Associate" description="Quickly onboard team members without leaving the dashboard.">
          <div className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 shadow-sm max-w-xl">
            {[
              { value: "rm" as const, label: "Create RM" },
              { value: "associate" as const, label: "Create Associate" },
            ].map((tab) => {
              const isActive = createTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setCreateTab(tab.value)}
                  className={`flex flex-1 flex-col rounded-xl px-5 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                    isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {createTab === "rm" && <RMForm />}
            {createTab === "associate" && <AssociateForm />}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

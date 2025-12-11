
"use client";

import { useState } from "react";
import { AssociateForm, RMForm } from "@/components/consolidation/ConsolidationForms";

const tabs = [
  {
    value: "rm" as const,
    label: "Create RM",
  },
  {
    value: "associate" as const,
    label: "Create Associate",
  },
];

export default function ConsolidationPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["value"]>("rm");

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm max-w-md">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex flex-1 flex-col rounded-xl px-5 py-2.5 text-left transition-all duration-200 ${
                isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="text-sm font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "rm" && <RMForm />}

      {activeTab === "associate" && <AssociateForm />}
    </div>
  );
}



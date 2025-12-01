"use client";

import { FormEvent, useMemo, useState } from "react";
import { FormSection, TextField } from "@/components/ui/forms";
import BrokerNameManager from "@/components/broker/BrokerNameManager";
import { BankNameManager } from "@/components/bank/BankNameManager";

interface BrokerRegistryProps {
  title?: string;
  description?: string;
  initialBrokers?: Array<{ id: number; name: string; createdAt: string }>;
}

const defaultBrokers: Array<{ id: number; name: string; createdAt: string }> = [];

export default function BrokerRegistry({
  title = "Broker & Bank Directory",
  description = "Manage broker and bank records to reuse across consolidation workflows.",
  initialBrokers = defaultBrokers,
}: BrokerRegistryProps) {
  const [activeTab, setActiveTab] = useState<"broker" | "bank">("broker");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <FormSection title={title} description={description}>
        <div className="col-span-full">
          <div className="mb-6 flex gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("broker")}
              className={`px-4 py-2 text-sm font-semibold transition ${
                activeTab === "broker"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Broker Names
            </button>
            <button
              onClick={() => setActiveTab("bank")}
              className={`px-4 py-2 text-sm font-semibold transition ${
                activeTab === "bank"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bank Names
            </button>
          </div>

          {activeTab === "broker" && <BrokerNameManager />}
          {activeTab === "bank" && <BankNameManager />}
        </div>
      </FormSection>
    </div>
  );
}

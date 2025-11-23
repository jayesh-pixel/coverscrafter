"use client";

import { FormEvent, useMemo, useState } from "react";
import { FormSection, TextField } from "@/components/ui/forms";

interface BrokerRegistryProps {
  title?: string;
  description?: string;
  initialBrokers?: Array<{ id: number; name: string; createdAt: string }>;
}

const defaultBrokers: Array<{ id: number; name: string; createdAt: string }> = [];

export default function BrokerRegistry({
  title = "Broker Directory",
  description = "Maintain broker records to reuse across consolidation workflows.",
  initialBrokers = defaultBrokers,
}: BrokerRegistryProps) {
  const [brokers, setBrokers] = useState(initialBrokers);
  const [brokerName, setBrokerName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredBrokers = useMemo(() => {
    if (!searchTerm.trim()) {
      return brokers;
    }
    const query = searchTerm.toLowerCase();
    return brokers.filter((broker) => broker.name.toLowerCase().includes(query));
  }, [brokers, searchTerm]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = brokerName.trim();
    if (!trimmedName) {
      return;
    }

    setBrokers((previous) => [
      {
        id: previous.length + 1,
        name: trimmedName,
        createdAt: new Date().toISOString(),
      },
      ...previous,
    ]);

    setBrokerName("");
    setShowAddForm(false);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <FormSection title={title} description={description}>
        <div className="col-span-full grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <TextField
            id="brokerSearch"
            label="Search"
            placeholder="Filter brokers"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <div className="flex items-end justify-end">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(true);
                setBrokerName("");
              }}
              className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 md:w-auto"
            >
              + Add Broker
            </button>
          </div>
        </div>

        <div className="col-span-full overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Broker Name</th>
                <th className="px-4 py-3 font-semibold">Added On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredBrokers.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-400" colSpan={3}>
                    No brokers captured yet.
                  </td>
                </tr>
              ) : (
                filteredBrokers.map((broker) => (
                  <tr key={broker.id} className="transition hover:bg-blue-50/40">
                    <td className="px-4 py-3 text-slate-500">{broker.id}</td>
                    <td className="px-4 py-3 text-slate-700">{broker.name}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(broker.createdAt).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </FormSection>

      {showAddForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Add Broker</h3>
                <p className="text-xs font-medium text-slate-500">Capture the broker name to make it available for consolidation.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setBrokerName("");
                }}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close add broker form"
              >
                ✕
              </button>
            </header>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <TextField
                id="modalBrokerName"
                label="Broker Name"
                placeholder="Enter broker name"
                required
                autoFocus
                value={brokerName}
                onChange={(event) => setBrokerName(event.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setBrokerName("");
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/30 transition hover:bg-blue-700"
                >
                  Save Broker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

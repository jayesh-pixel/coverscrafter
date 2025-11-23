"use client";

import { FormEvent, useEffect, useState } from "react";
import { TextField } from "@/components/ui/forms";
import {
  createBrokerName,
  getBrokerNames,
  updateBrokerName,
  deleteBrokerName,
  type BrokerName,
} from "@/lib/api/brokername";
import { getAuthSession } from "@/lib/utils/storage";

interface BrokerNameManagerProps {
  title?: string;
  description?: string;
}

export default function BrokerNameManager({
  title = "Broker Name Management",
  description = "Manage broker names for the platform (Admin/Superadmin only).",
}: BrokerNameManagerProps) {
  const [brokerNames, setBrokerNames] = useState<BrokerName[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchBrokerNames = async () => {
    const session = getAuthSession();
    if (!session?.token) return;

    setIsLoading(true);
    try {
      const names = await getBrokerNames(session.token);
      setBrokerNames(names.filter((b) => !b.isDeleted));
    } catch (error) {
      console.error("Failed to fetch broker names", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to load broker names");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokerNames();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const session = getAuthSession();
    if (!session?.token) {
      setErrorMessage("You must be signed in to create a broker name.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const brokername = formData.get("brokername") as string;

    if (!brokername?.trim()) {
      setErrorMessage("Broker name cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createBrokerName({ brokername }, session.token);
      setSuccessMessage("Broker name created successfully.");
      event.currentTarget.reset();
      fetchBrokerNames();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create broker name");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (broker: BrokerName) => {
    setEditingId(broker._id);
    setEditValue(broker.brokername);
  };

  const handleUpdate = async (id: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const session = getAuthSession();
    if (!session?.token) {
      setErrorMessage("You must be signed in to update a broker name.");
      return;
    }

    if (!editValue?.trim()) {
      setErrorMessage("Broker name cannot be empty.");
      return;
    }

    try {
      await updateBrokerName(id, { brokername: editValue }, session.token);
      setSuccessMessage("Broker name updated successfully.");
      setEditingId(null);
      fetchBrokerNames();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update broker name");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this broker name?")) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    const session = getAuthSession();
    if (!session?.token) {
      setErrorMessage("You must be signed in to delete a broker name.");
      return;
    }

    try {
      await deleteBrokerName(id, session.token);
      setSuccessMessage("Broker name deleted successfully.");
      fetchBrokerNames();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete broker name");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        {(errorMessage || successMessage) && (
          <div className="mb-6 space-y-2">
            {errorMessage && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <TextField
                name="brokername"
                label="Broker Name"
                placeholder="Enter broker name"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Adding..." : "Add Broker"}
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60">
        <h3 className="mb-4 text-xl font-bold text-slate-800">Existing Broker Names</h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-slate-500">Loading broker names...</p>
          </div>
        ) : brokerNames.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-slate-500">No broker names found. Add your first broker name above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {brokerNames.map((broker) => (
              <div
                key={broker._id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:bg-slate-100"
              >
                {editingId === broker._id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                ) : (
                  <span className="text-sm font-semibold text-slate-800">{broker.brokername}</span>
                )}

                <div className="ml-4 flex gap-2">
                  {editingId === broker._id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(broker._id)}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg bg-slate-400 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(broker)}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(broker._id)}
                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-rose-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

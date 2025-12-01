"use client";

import { useState, useEffect } from "react";
import { createBankName, getBankNames, updateBankName, deleteBankName, type BankName } from "@/lib/api/bankname";
import { getValidAuthToken } from "@/lib/utils/storage";
import { ApiError } from "@/lib/api/config";

export function BankNameManager() {
  const [bankNames, setBankNames] = useState<BankName[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newBankName, setNewBankName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const fetchBankNames = async () => {
    const token = await getValidAuthToken();
    if (!token) {
      setError("Please sign in to view bank names");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getBankNames(token);
      setBankNames(data.filter(bank => !bank.isDeleted));
    } catch (error) {
      console.error("Failed to fetch bank names:", error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Failed to load bank names");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBankNames();
  }, []);

  const handleCreate = async () => {
    if (!newBankName.trim()) {
      setError("Please enter a bank name");
      return;
    }

    const token = await getValidAuthToken();
    if (!token) {
      setError("Please sign in to create a bank name");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await createBankName({ bankname: newBankName.trim() }, token);
      setSuccessMessage("Bank name created successfully");
      setNewBankName("");
      await fetchBankNames();
    } catch (error) {
      console.error("Failed to create bank name:", error);
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : error.message;
        setError(fullError);
      } else {
        setError("Failed to create bank name");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) {
      setError("Please enter a bank name");
      return;
    }

    const token = await getValidAuthToken();
    if (!token) {
      setError("Please sign in to update bank name");
      return;
    }

    setError(null);
    setSuccessMessage(null);

    try {
      await updateBankName(id, { bankname: editingName.trim() }, token);
      setSuccessMessage("Bank name updated successfully");
      setEditingId(null);
      setEditingName("");
      await fetchBankNames();
    } catch (error) {
      console.error("Failed to update bank name:", error);
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : error.message;
        setError(fullError);
      } else {
        setError("Failed to update bank name");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bank name?")) {
      return;
    }

    const token = await getValidAuthToken();
    if (!token) {
      setError("Please sign in to delete bank name");
      return;
    }

    setError(null);
    setSuccessMessage(null);

    try {
      await deleteBankName(id, token);
      setSuccessMessage("Bank name deleted successfully");
      await fetchBankNames();
    } catch (error) {
      console.error("Failed to delete bank name:", error);
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : error.message;
        setError(fullError);
      } else {
        setError("Failed to delete bank name");
      }
    }
  };

  const startEdit = (bank: BankName) => {
    setEditingId(bank._id);
    setEditingName(bank.bankname);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Add New Bank Name</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter bank name"
            value={newBankName}
            onChange={(e) => setNewBankName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreate();
              }
            }}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            disabled={isSubmitting}
          />
          <button
            onClick={handleCreate}
            disabled={isSubmitting || !newBankName.trim()}
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Adding..." : "Add Bank"}
          </button>
        </div>
      </div>

      {(error || successMessage) && (
        <div className="space-y-2">
          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Bank Names List</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-slate-500">Loading bank names...</p>
          </div>
        ) : bankNames.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-slate-500">No bank names found. Add one above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bankNames.map((bank) => (
              <div
                key={bank._id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:bg-slate-100"
              >
                {editingId === bank._id ? (
                  <div className="flex flex-1 gap-3">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUpdate(bank._id);
                        } else if (e.key === "Escape") {
                          cancelEdit();
                        }
                      }}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(bank._id)}
                        className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{bank.bankname}</p>
                      <p className="text-xs text-slate-500">
                        Created: {new Date(bank.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(bank)}
                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bank._id)}
                        className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

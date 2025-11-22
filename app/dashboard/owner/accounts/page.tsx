"use client";

import { useState } from "react";

export default function AccountsPage() {
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountCategory, setAccountCategory] = useState("");
  const [bankIFSC, setBankIFSC] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [bankPincode, setBankPincode] = useState("");
  const [bankCity, setBankCity] = useState("");
  const [bankState, setBankState] = useState("");
  const [gstCompliance, setGstCompliance] = useState("Yes");
  const [panNo, setPanNo] = useState("");
  const [panFile, setPanFile] = useState<File | null>(null);
  const [bankDocType, setBankDocType] = useState("Cancelled Cheque");
  const [bankDocFile, setBankDocFile] = useState<File | null>(null);

  const accounts = [
    {
      accountNo: "32948243371",
      accountType: "PRIMARY",
      bankIFSC: "SBIN0000384",
      bankName: "State Bank of India",
      accountCategory: "CURRENT",
      accountStatus: "Approved",
      gstCompliance: "YES",
    },
  ];

  const handleReset = () => {
    setAccountName("");
    setAccountNumber("");
    setAccountCategory("");
    setBankIFSC("");
    setBankName("");
    setBankAddress("");
    setBankPincode("");
    setBankCity("");
    setBankState("");
    setGstCompliance("Yes");
    setPanNo("");
    setPanFile(null);
    setBankDocType("Cancelled Cheque");
    setBankDocFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
        <button
          onClick={handleReset}
          className="rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Reset
        </button>
      </div>

      {/* Account Details Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">Account Details</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Account Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Account Category <span className="text-red-500">*</span>
            </label>
            <select
              value={accountCategory}
              onChange={(e) => setAccountCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
            >
              <option value="">Choose Account Category</option>
              <option value="CURRENT">Current</option>
              <option value="SAVINGS">Savings</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Bank IFSC <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Account Name"
              value={bankIFSC}
              onChange={(e) => setBankIFSC(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter IFSC Code First"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
              disabled={!bankIFSC}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Bank Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter bank address"
              value={bankAddress}
              onChange={(e) => setBankAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Bank Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter pincode"
              value={bankPincode}
              onChange={(e) => setBankPincode(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Bank City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter pincode first"
              value={bankCity}
              onChange={(e) => setBankCity(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
              disabled={!bankPincode}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Bank State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter pincode first"
              value={bankState}
              onChange={(e) => setBankState(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
              disabled={!bankPincode}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              GST Compliance <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Yes"
                  checked={gstCompliance === "Yes"}
                  onChange={(e) => setGstCompliance(e.target.value)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="No"
                  checked={gstCompliance === "No"}
                  onChange={(e) => setGstCompliance(e.target.value)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              PAN No. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter PAN Number"
              value={panNo}
              onChange={(e) => setPanNo(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Upload PAN <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              onChange={(e) => setPanFile(e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Choose Bank Document Type <span className="text-red-500">*</span>
            </label>
            <select
              value={bankDocType}
              onChange={(e) => setBankDocType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
            >
              <option>Cancelled Cheque</option>
              <option>Bank Statement</option>
              <option>Passbook</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Upload Bank Document <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              onChange={(e) => setBankDocFile(e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
            />
          </div>
        </div>
        <div className="mt-6">
          <button className="rounded-lg border border-blue-600 bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            Add
          </button>
        </div>
      </div>

      {/* Account List */}
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <h2 className="text-lg font-semibold text-slate-900">Your Account List</h2>
        </div>
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <table className="min-w-[1000px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Account No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Account Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Bank IFSC
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Bank Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Account Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Account Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  GST Compliance
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  View details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {accounts.map((account, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{account.accountNo}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                      {account.accountType}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{account.bankIFSC}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{account.bankName}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{account.accountCategory}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      {account.accountStatus}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{account.gstCompliance}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <button className="text-blue-600 hover:text-blue-800">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

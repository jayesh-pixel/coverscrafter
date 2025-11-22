"use client";

import { useState } from "react";

export default function CreateInsurancePage() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [openStep, setOpenStep] = useState<number | null>(1);
  const [registrationType, setRegistrationType] = useState("Private");
  const [newVehicle, setNewVehicle] = useState("Yes");
  const [coverage, setCoverage] = useState("Bundled - 1 Year OD + 5 Year TP");
  const [isHandicapped, setIsHandicapped] = useState("No");
  const [customerType, setCustomerType] = useState("Individual");

  const handleStepComplete = (stepNumber: number) => {
    setCompletedSteps([...completedSteps, stepNumber]);
    setOpenStep(stepNumber + 1);
  };

  const isStepAccessible = (stepNumber: number) => {
    if (stepNumber === 1) return true;
    return completedSteps.includes(stepNumber - 1);
  };

  const toggleStep = (stepNumber: number) => {
    if (isStepAccessible(stepNumber)) {
      setOpenStep(openStep === stepNumber ? null : stepNumber);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Create & Renew Insurance</h1>

      {/* Step 1: Policy Quote */}
      <div className={`overflow-hidden rounded-xl border-2 transition ${
        completedSteps.includes(1) 
          ? "border-green-500 bg-green-50" 
          : openStep === 1
          ? "border-blue-600 bg-white"
          : "border-slate-300 bg-white"
      }`}>
        <button
          onClick={() => toggleStep(1)}
          className="flex w-full items-center justify-between p-4 text-left transition hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              completedSteps.includes(1) 
                ? "bg-green-500 text-white" 
                : openStep === 1
                ? "bg-blue-600 text-white"
                : "bg-slate-300 text-white"
            }`}>
              {completedSteps.includes(1) ? "✓" : "1"}
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">Policy Quote</div>
              <div className="text-sm text-slate-600">Coverage & vehicle details</div>
            </div>
          </div>
          <svg
            className={`h-6 w-6 text-slate-600 transition-transform ${openStep === 1 ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {openStep === 1 && (
          <div className="space-y-6 border-t border-slate-200 p-6">
            {/* Coverage Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Coverage Details</h2>
              
              <div className="mt-6 space-y-6">
                {/* Registration Type */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Registration Type *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="registrationType" value="Private" checked={registrationType === "Private"} onChange={(e) => setRegistrationType(e.target.value)} className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-slate-700">Private</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="registrationType" value="Commercial" checked={registrationType === "Commercial"} onChange={(e) => setRegistrationType(e.target.value)} className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-slate-700">Commercial</span>
                    </label>
                  </div>
                </div>

                {/* New Vehicle */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">New Vehicle *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="newVehicle" value="Yes" checked={newVehicle === "Yes"} onChange={(e) => setNewVehicle(e.target.value)} className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-slate-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="newVehicle" value="No" checked={newVehicle === "No"} onChange={(e) => setNewVehicle(e.target.value)} className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-slate-700">No</span>
                    </label>
                  </div>
                </div>

                {/* Vehicle Invoice Upload */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Vehicle Invoice (Auto-fill the details - Optional)</label>
                  <input type="file" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>

                {/* Coverage */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Coverage *</label>
                  <select value={coverage} onChange={(e) => setCoverage(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
                    <option>Bundled - 1 Year OD + 5 Year TP</option>
                    <option>Standalone OD</option>
                    <option>Standalone TP</option>
                  </select>
                </div>

                {/* Risk Start Date */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Risk Start Date *</label>
                  <input type="date" defaultValue="2025-11-22" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>

                {/* Is Handicapped */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Is Handicapped?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="handicapped" value="Yes" checked={isHandicapped === "Yes"} onChange={(e) => setIsHandicapped(e.target.value)} className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-slate-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="handicapped" value="No" checked={isHandicapped === "No"} onChange={(e) => setIsHandicapped(e.target.value)} className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-slate-700">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Vehicle Details</h2>
              
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Make *</label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
                    <option>Choose here</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Model *</label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
                    <option>Choose here</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Variant *</label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
                    <option>Choose here</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Registration date *</label>
                  <input type="date" defaultValue="2025-11-22" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Manufacturing Year *</label>
                  <input type="number" defaultValue="2025" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">RTO *</label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
                    <option>MH09, KOLHAPUR, MAHARASHTRA</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-end">
              <button onClick={() => handleStepComplete(1)} className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                Continue to KYC
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: KYC Verification */}
      <div className={`overflow-hidden rounded-xl border-2 transition ${
        !isStepAccessible(2)
          ? "border-slate-200 bg-slate-50 opacity-50"
          : completedSteps.includes(2) 
          ? "border-green-500 bg-green-50" 
          : openStep === 2
          ? "border-blue-600 bg-white"
          : "border-slate-300 bg-white"
      }`}>
        <button
          onClick={() => toggleStep(2)}
          disabled={!isStepAccessible(2)}
          className={`flex w-full items-center justify-between p-4 text-left transition ${
            isStepAccessible(2) ? "hover:bg-slate-50" : "cursor-not-allowed"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              !isStepAccessible(2)
                ? "bg-slate-300 text-white"
                : completedSteps.includes(2) 
                ? "bg-green-500 text-white" 
                : openStep === 2
                ? "bg-blue-600 text-white"
                : "bg-slate-400 text-white"
            }`}>
              {completedSteps.includes(2) ? "✓" : "2"}
            </div>
            <div>
              <div className={`text-lg font-semibold ${isStepAccessible(2) ? "text-slate-900" : "text-slate-500"}`}>KYC Verification</div>
              <div className="text-sm text-slate-600">Customer verification</div>
            </div>
          </div>
          <svg
            className={`h-6 w-6 text-slate-600 transition-transform ${openStep === 2 ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {openStep === 2 && isStepAccessible(2) && (
          <div className="space-y-6 border-t border-slate-200 p-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Customer Details - KYC Verification</h2>
              
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Customer Type *</label>
                  <select value={customerType} onChange={(e) => setCustomerType(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
                    <option>Individual</option>
                    <option>Corporate</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Pincode *</label>
                  <input type="text" placeholder="XXXXXXX" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">State *</label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
                    <option value="">Select State</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">City *</label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
                    <option value="">Select City</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end">
              <button onClick={() => handleStepComplete(2)} className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                Continue to Details
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step 3: Detail Form */}
      <div className={`overflow-hidden rounded-xl border-2 transition ${
        !isStepAccessible(3)
          ? "border-slate-200 bg-slate-50 opacity-50"
          : completedSteps.includes(3) 
          ? "border-green-500 bg-green-50" 
          : openStep === 3
          ? "border-blue-600 bg-white"
          : "border-slate-300 bg-white"
      }`}>
        <button
          onClick={() => toggleStep(3)}
          disabled={!isStepAccessible(3)}
          className={`flex w-full items-center justify-between p-4 text-left transition ${
            isStepAccessible(3) ? "hover:bg-slate-50" : "cursor-not-allowed"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              !isStepAccessible(3)
                ? "bg-slate-300 text-white"
                : completedSteps.includes(3) 
                ? "bg-green-500 text-white" 
                : openStep === 3
                ? "bg-blue-600 text-white"
                : "bg-slate-400 text-white"
            }`}>
              {completedSteps.includes(3) ? "✓" : "3"}
            </div>
            <div>
              <div className={`text-lg font-semibold ${isStepAccessible(3) ? "text-slate-900" : "text-slate-500"}`}>Detail Form</div>
              <div className="text-sm text-slate-600">Final submission</div>
            </div>
          </div>
          <svg
            className={`h-6 w-6 text-slate-600 transition-transform ${openStep === 3 ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {openStep === 3 && isStepAccessible(3) && (
          <div className="space-y-6 border-t border-slate-200 p-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Add Ons & Final Details</h2>
              
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {["Nil Depreciation", "Engine Protect", "Consumables", "Key Protect", "Return To Invoice", "Electrical Accessories", "Non-Electrical Accessories", "PA For Unnamed Passenger"].map((addon) => (
                  <label key={addon} className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded text-blue-600" />
                    <span className="text-sm text-slate-700">{addon}</span>
                  </label>
                ))}
              </div>

              {/* IDV */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">IDV *</label>
                <input type="text" placeholder="Enter idv" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700" />
              </div>
            </div>

            {/* Final Button */}
            <div className="flex justify-end">
              <button className="rounded-lg bg-green-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-green-700">
                Get Premium
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

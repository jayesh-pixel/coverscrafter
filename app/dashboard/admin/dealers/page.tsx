"use client";

import Link from "next/link";
import { useState } from "react";
import { FileUploadField, FormSection, SelectField, TextField } from "@/components/ui/forms";

const distributors = ["Navnit Motors", "Metro Wheels", "Prime Mobility"];
const services = ["Two Wheeler", "Four Wheeler", "Insurance Renewals", "Accessories"];
const subServices = ["Two Wheeler", "Four Wheeler", "Insurance Renewals", "Accessories"];
const virtualRms = ["Priya Sharma", "Amit Rao", "Divya Singh"];
const rtos = ["Mumbai Central", "Delhi South", "Bengaluru East"];
const states = ["Maharashtra", "Karnataka", "Delhi", "Gujarat"];
const cities = ["Mumbai", "Pune", "Bengaluru", "New Delhi", "Ahmedabad"];
const makes = ["BAJAJ AUTO", "HONDA", "TVS", "YAMAHA", "SUZUKI"];
const masterDealers = ["Metro Motors - MD001", "Prime Wheels - MD002", "Speed Auto - MD003"];

export default function DealersPage() {
  const [activeTab, setActiveTab] = useState<"master" | "sub">("master");

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {[
          { label: "Master Dealer", description: "Primary entity onboarding", value: "master" as const },
          { label: "Sub Dealer", description: "Linked to a master", value: "sub" as const },
        ].map((type) => (
          <button
            key={type.label}
            onClick={() => setActiveTab(type.value)}
            className={`flex flex-1 flex-col rounded-xl px-5 py-2.5 text-left transition-all duration-200 ${
              activeTab === type.value
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="text-sm font-semibold">{type.label}</span>
            <span className={`text-xs ${activeTab === type.value ? "text-blue-100" : "text-slate-400"}`}>
              {type.description}
            </span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {activeTab === "master" && (
          <>
          <FormSection title="Master Dealer Details" description="Capture legal entity and registration inputs.">
        <TextField id="dealershipName" label="Dealership Name" placeholder="Enter Name" required />
        <TextField id="legalName" label="Legal Name" placeholder="Enter Legal Name" required />
        <TextField id="email" label="Email" type="email" placeholder="Enter Email" required />
        <TextField id="mobile" label="Mobile" type="tel" placeholder="Enter Mobile" required hint="Please enter a valid 10-digit mobile number." />
        <SelectField
          id="distributor"
          label="Distributor"
          options={distributors.map((distributor) => ({ label: distributor, value: distributor.toLowerCase().replace(/\s+/g, "-") }))}
          required
        />
        <SelectField
          id="rto"
          label="RTO"
          options={rtos.map((rto) => ({ label: rto, value: rto.toLowerCase().replace(/\s+/g, "-") }))}
          required
        />
        <TextField id="pincode" label="PINCODE" placeholder="Enter Pincode" required hint="Please enter a valid 6-digit pincode." />
        <SelectField id="city" label="City" options={cities.map((city) => ({ label: city, value: city.toLowerCase().replace(/\s+/g, "-") }))} required />
        <SelectField id="state" label="State" options={states.map((state) => ({ label: state, value: state.toLowerCase() }))} required />
        <SelectField id="salesPerson" label="Sales Person" options={virtualRms.map((rm) => ({ label: rm, value: rm.toLowerCase().replace(/\s+/g, "-") }))} required />
        <SelectField id="virtualRm" label="Virtual RM" options={virtualRms.map((rm) => ({ label: rm, value: rm.toLowerCase().replace(/\s+/g, "-") }))} required />
        <SelectField id="dealershipServices" label="Dealership Services" options={services.map((service) => ({ label: service, value: service.toLowerCase().replace(/\s+/g, "-") }))} required />
        <TextField id="address" label="Address" placeholder="Enter Address" required />
      </FormSection>

      <FormSection title="Key Contacts" description="Owner and executive level contacts for escalation.">
        <TextField id="ownerName" label="Dealership Owner Name" required />
        <TextField id="ownerEmail" label="Dealership Owner Email" type="email" required />
        <TextField id="ownerMobile" label="Dealership Owner Mobile" type="tel" required />
        <TextField id="executiveName" label="Dealership Executive Name" required />
        <TextField id="executiveEmail" label="Dealership Executive Email" type="email" required />
        <TextField id="executiveMobile" label="Dealership Executive Mobile" type="tel" required />
      </FormSection>

      <FormSection title="Registrations" description="Capture all statutory numbers and documents.">
        <TextField id="gstin" label="GSTIN" placeholder="Enter GSTIN" required />
        <TextField id="pancardNo" label="Pancard No." placeholder="Enter PAN" required />
        <FileUploadField id="gstCertificate" name="gstCertificate" label="GST Certificate" required />
        <FileUploadField id="pancardDocument" name="pancardDocument" label="Pancard" required />
        <FileUploadField id="cancelledCheque" name="cancelledCheque" label="Cancelled Cheque" required />
      </FormSection>

      <FormSection title="OEM Preferences" description="Select makes you will sell." actions={<button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50">Manage catalog</button>}>
        <div className="lg:col-span-3">
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {makes.map((make) => (
              <label key={make} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-200" />
                {make}
              </label>
            ))}
          </div>
        </div>
      </FormSection>
          </>
        )}

        {activeTab === "sub" && (
          <>
          <FormSection title="Sub Dealer Details" description="Capture sub-dealership legal entity and registration inputs.">
            <TextField id="subDealershipName" label="Dealership Name" placeholder="Enter Name" required />
            <TextField id="subLegalName" label="Legal Name" placeholder="Enter Legal Name" required />
            <TextField id="subEmail" label="Email" type="email" placeholder="Enter Email" required />
            <TextField id="subMobile" label="Mobile" type="tel" placeholder="Enter Mobile" required hint="Please enter a valid 10-digit mobile number." />
            <TextField id="masterDealerCode" label="Master Dealer Name & Code" placeholder="Enter Master Dealer Name & Code" required />
            <div className="lg:col-span-3">
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">
                <span>
                  Wallet Sharing
                  <span className="ml-1 text-rose-500">*</span>
                </span>
                <div className="flex gap-3">
                  {["Yes", "No"].map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50">
                      <input type="radio" name="walletSharing" value={option.toLowerCase()} className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-200" />
                      {option}
                    </label>
                  ))}
                </div>
              </label>
            </div>
            <SelectField
              id="subDistributor"
              label="Distributor"
              options={distributors.map((distributor) => ({ label: distributor, value: distributor.toLowerCase().replace(/\s+/g, "-") }))}
            />
            <SelectField
              id="subRto"
              label="RTO"
              options={rtos.map((rto) => ({ label: rto, value: rto.toLowerCase().replace(/\s+/g, "-") }))}
              required
            />
            <TextField id="subPincode" label="PINCODE" placeholder="Enter Pincode" required hint="Please enter a valid 6-digit pincode." />
            <SelectField id="subCity" label="City" options={cities.map((city) => ({ label: city, value: city.toLowerCase().replace(/\s+/g, "-") }))} required />
            <SelectField id="subState" label="State" options={states.map((state) => ({ label: state, value: state.toLowerCase() }))} required />
            <SelectField id="subSalesPerson" label="Sales Person" options={virtualRms.map((rm) => ({ label: rm, value: rm.toLowerCase().replace(/\s+/g, "-") }))} required />
            <SelectField id="subVirtualRm" label="Virtual RM" options={virtualRms.map((rm) => ({ label: rm, value: rm.toLowerCase().replace(/\s+/g, "-") }))} />
            <SelectField id="subDealershipServices" label="Sub Dealership Services" options={subServices.map((service) => ({ label: service, value: service.toLowerCase().replace(/\s+/g, "-") }))} required />
            <TextField id="subAddress" label="Address" placeholder="Enter Address" required />
          </FormSection>

          <FormSection title="Sub Dealership Contacts" description="Owner and executive level contacts for escalation.">
            <TextField id="subOwnerName" label="Sub Dealership Owner Name" required />
            <TextField id="subOwnerEmail" label="Sub Dealership Owner Email" type="email" required />
            <TextField id="subOwnerMobile" label="Sub Dealership Owner Mobile" type="tel" required />
            <TextField id="subExecutiveName" label="Sub Dealership Executive Name" required />
            <TextField id="subExecutiveEmail" label="Sub Dealership Executive Email" type="email" required />
            <TextField id="subExecutiveMobile" label="Sub Dealership Executive Mobile" type="tel" required />
          </FormSection>

          <FormSection title="Sub Dealership Registrations" description="Capture all statutory numbers and documents.">
            <TextField id="subGstin" label="GSTIN" placeholder="Enter GSTIN" required />
            <TextField id="subPancardNo" label="Pancard No." placeholder="Enter PAN" required />
            <FileUploadField id="subGstCertificate" name="subGstCertificate" label="GST Certificate" required />
            <FileUploadField id="subPancardDocument" name="subPancardDocument" label="Pancard" required />
            <FileUploadField id="subCancelledCheque" name="subCancelledCheque" label="Cancelled Cheque" required />
          </FormSection>
            </>
          )}

      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-lg font-bold text-slate-900">Ready to submit?</p>
          <p className="mt-1 text-xs font-medium text-slate-500">We will run validations before sending this dealer to underwriting.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50">
            Cancel
          </Link>
          <button className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition-all hover:bg-blue-700">
            Submit onboarding
          </button>
        </div>
      </div>
        </div>
    </div>
  );
}

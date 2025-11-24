"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FileUploadField, SelectField, TextField } from "@/components/ui/forms";
import { createBusinessEntry, getBusinessEntries, type BusinessEntry } from "@/lib/api/businessentry";
import { getBrokerNames, type BrokerName } from "@/lib/api/brokername";
import { uploadDocument, type UploadResponse } from "@/lib/api/uploads";
import { ApiError } from "@/lib/api/config";
import { getAuthSession } from "@/lib/utils/storage";
import { getRMUsers, getAssociateUsers, type RMUser, type AssociateUser } from "@/lib/api/users";

const insuranceCompanies = [
  "Acko General Insurance",
  "Aditya Birla Health Insurance Co. Ltd.",
  "Aditya Birla Sun Life Insurance Co. Ltd.",
  "Aegis Covenant Private Limited",
  "Agriculture Insurance Co. of India Ltd.",
  "Apollo Munich Health Insurance Co. Ltd.",
  "Bajaj Allianz General Insurance Co. Ltd.",
  "Bajaj Allianz Life Insurance Company Limited",
  "Bharti Axa General Insurance Co. Ltd.",
  "Bharti AXA Life Insurance Co.Ltd",
  "CARE HEALTH INSURANCE LIMITED",
  "Cholamandalam MS General Insurance Co. Ltd.",
  "DHFL General Insurance Limited",
  "Director of Agriculture, Gandhinagar",
  "Edelweiss General Insurance Company Limited",
  "EDELWEISS TOKIO LIFE INSURANCE COMPANY LIMITED",
  "Export Credit Guarantee Corporation of India Ltd.",
  "Future Generali India Insurance Co. Ltd.",
  "Go Digit General Insurance Limited",
  "HDFC ERGO General Insurance Co. Ltd.",
  "HDFC Life Insurance Company Limited",
  "ICICI Lombard General Insurance Co. Ltd.",
  "ICICI Prudential Life Insurance Co. Ltd.",
  "IFFCO Tokio General Insurance Co. Ltd.",
  "INDIAFIRST LIFE INSURANCE COMPANY LTD",
  "Kotak Mahindra General Insurance Co. Ltd.",
  "Kotak Mahindra Life Insurance Co.Ltd",
  "L & T General Insurance Co. Ltd.",
  "LIBERTY GENERAL INSURANCE LIMITED",
  "Life Insurance Corporation of India",
  "Magma HDI General Insurance Co. Ltd.",
  "ManipalCigna Health Insurance Company Limited",
  "Max Bupa Health Insurance Company Ltd.",
  "Max New York Life Insurance Co.",
  "National Insurance Co. Ltd.",
  "PNB METLIFE INDIA INSURANCE COMPANY LTD",
  "Raheja QBE General Insurance Co. Ltd.",
  "Reliance General Insurance Co. Ltd.",
  "Royal Sundaram General Insurance Co. Limited.",
  "SBI General Insurance Co. Ltd",
  "Shriram General Insurance Co. Ltd.",
  "Star Health and Allied Insurance Co. Ltd.",
  "Tata AIG General Insurance Co. Ltd.",
  "The New India Assurance Co. Ltd.",
  "The Oriental Insurance Co. Ltd.",
  "United India Insurance Co. Ltd.",
  "Universal Sompo General Insurance Co. Ltd.",
  "ZURICH KOTAK GENERAL INSURANCE COMPANY (INDIA) LIMITED",
];

const stateOptions = [
  "ANDHRA PRADESH",
  "ANDAMAN & NICOBAR",
  "ARUNACHAL PRADESH",
  "ASSAM",
  "BIHAR",
  "CHANDIGARH",
  "DAMAN AND DIU",
  "DADRA AND NAGAR HAVELI",
  "GOA",
  "GUJARAT",
  "HARYANA",
  "HIMACHAL PRADESH",
  "JHARKHAND",
  "JAMMU AND KASHMIR",
  "KARNATAKA",
  "KERALA",
  "LAKSHDWEEP",
  "MAHARASHTRA",
  "MANIPUR",
  "MEGHALAYA",
  "MIZORAM",
  "MADHYA PRADESH",
  "NAGALAND",
  "DELHI",
  "ORISSA",
  "PONDICHERRY",
  "PUNJAB",
  "RAJASTHAN",
  "SIKKIM",
  "TAMIL NADU",
  "TRIPURA",
  "TELANGANA",
  "UTTAR PRADESH",
  "CHHATTISGARH",
  "WEST BENGAL",
  "UTTARAKHAND",
];

const lineOfBusinessOptions = [
  "Aviation Insurance",
  "ENGINEERING Insurance",
  "FIRE Insurance",
  "HEALTH & PA Insurance",
  "LIABILITY Insurance",
  "Life Insurance",
  "MARINE & HULL Insurance",
  "Miscellaneous Insurance",
  "MOTOR Insurance",
];

const productOptions = [
  "AVIATION - HULL ALL RISKS POLICY SCHEDULE",
  "Aviation Loss of Licence Insurance Policy",
  "Aviation Personal Accident Insurance policy",
];

const subProductOptions = ["Retail Business", "Corporate Business"];

const regionOptions = [...stateOptions];

const reportingFyOptions = ["2025-26"];
const reportingMonthOptions = ["November"];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;


interface BusinessEntryManagerProps {
    title?: string;
    description?: string;
    initialShowForm?: boolean;
}

export default function BusinessEntryManager({ 
    title = "Business Entry", 
    description = "Capture policy level business for consolidation.",
    initialShowForm = false
}: BusinessEntryManagerProps) {
  const [paymentMode, setPaymentMode] = useState<"Online" | "Cheque" | "Cash">("Online");
  const [showForm, setShowForm] = useState(initialShowForm);
  const [businessEntries, setBusinessEntries] = useState<BusinessEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [brokerOptions, setBrokerOptions] = useState<BrokerName[]>([]);
  const [isLoadingBrokers, setIsLoadingBrokers] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadResponse | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [rmOptions, setRmOptions] = useState<RMUser[]>([]);
  const [associateOptions, setAssociateOptions] = useState<AssociateUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedRmId, setSelectedRmId] = useState<string>("");
  const [selectedAssociateId, setSelectedAssociateId] = useState<string>("");
  const [allAssociates, setAllAssociates] = useState<AssociateUser[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [allRMs, setAllRMs] = useState<RMUser[]>([]);

  const fetchEntries = async () => {
    const session = getAuthSession();
    if (!session?.token) return;

    setIsLoading(true);
    try {
      const entries = await getBusinessEntries(session.token);
      setBusinessEntries(entries);
    } catch (error) {
      console.error("Failed to fetch business entries", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBrokerOptions = async () => {
    const session = getAuthSession();
    if (!session?.token) return;

    setIsLoadingBrokers(true);
    try {
      const brokers = await getBrokerNames(session.token);
      setBrokerOptions(brokers.filter((broker) => !broker.isDeleted));
    } catch (error) {
      console.error("Failed to fetch broker names", error);
      setBrokerOptions([]);
    } finally {
      setIsLoadingBrokers(false);
    }
  };

  const fetchUsers = async () => {
    const session = getAuthSession();
    if (!session?.token) return;

    setIsLoadingUsers(true);
    try {
      const associates = await getAssociateUsers(session.token);
      setAllAssociates(associates);
      setAssociateOptions([]); // Initially empty until RM is selected
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchRMsByState = async (state: string) => {
    const session = getAuthSession();
    if (!session?.token) return;

    setIsLoadingUsers(true);
    try {
      // Convert "TAMIL NADU" to "Tamil Nadu" format
      const formattedState = state
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const rms = await getRMUsers(session.token, undefined, formattedState);
      setRmOptions(rms);
    } catch (error) {
      console.error("Failed to fetch RMs for state", error);
      setRmOptions([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchBrokerOptions();
    fetchUsers();
  }, []);

  const extractUploadMeta = (upload: UploadResponse | null): { id?: string; name?: string; url?: string } => {
    if (!upload) {
      return {};
    }

    const nestedData = upload.data && typeof upload.data === "object" ? (upload.data as Record<string, unknown>) : undefined;

    const id =
      (upload.id as string | undefined) ??
      (upload.fileId as string | undefined) ??
      (nestedData?.id as string | undefined) ??
      (nestedData?.fileId as string | undefined);

    const name =
      (upload.fileName as string | undefined) ??
      (upload.name as string | undefined) ??
      (upload.originalName as string | undefined) ??
      (nestedData?.fileName as string | undefined) ??
      (nestedData?.name as string | undefined) ??
      (nestedData?.originalName as string | undefined);

    const url =
      (upload.downloadUrl as string | undefined) ??
      (upload.url as string | undefined) ??
      (nestedData?.downloadUrl as string | undefined) ??
      (nestedData?.url as string | undefined);

    return { id, name, url };
  };

  const uploadMeta = extractUploadMeta(uploadedFile);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setUploadError(null);
    setUploadedFile(null);

    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError("File exceeds the 10 MB limit.");
      event.target.value = "";
      return;
    }

    const session = getAuthSession();
    if (!session?.token) {
      setUploadError("You must be signed in to upload documents.");
      event.target.value = "";
      return;
    }

    setIsUploadingFile(true);

    try {
      const response = await uploadDocument(file, session.token);
      setUploadedFile(response);
    } catch (error) {
      console.error("Failed to upload file", error);
      if (error instanceof ApiError) {
        setUploadError(error.message || "Unable to upload document. Please try again.");
      } else {
        setUploadError("Something went wrong while uploading. Please try again.");
      }
      event.target.value = "";
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleRemoveUploadedFile = () => {
    setUploadedFile(null);
    setUploadError(null);
    setFileInputKey((previous) => previous + 1);
  };

  const handleRmChange = async (rmId: string) => {
    setSelectedRmId(rmId);
    setSelectedAssociateId("");
    setAssociateOptions([]);
    
    if (!rmId) return;
    
    const session = getAuthSession();
    if (!session?.token) return;
    
    setIsLoadingUsers(true);
    try {
      // Fetch associates created by the selected RM
      const associates = await getAssociateUsers(session.token, undefined, rmId);
      setAssociateOptions(associates);
    } catch (error) {
      console.error("Failed to fetch associates for RM", error);
      setAssociateOptions([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleAssociateChange = (associateId: string) => {
    setSelectedAssociateId(associateId);
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedRmId("");
    setSelectedAssociateId("");
    setAssociateOptions([]);
    
    // Fetch RMs by selected state from API
    fetchRMsByState(state);
  };

  const handleBusinessSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const session = getAuthSession();
    if (!session?.token) {
      setErrorMessage("You must be signed in to create a business entry.");
      return;
    }

    if (isUploadingFile) {
      setErrorMessage("Please wait for the document upload to complete before saving.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string | number> = {};

    formData.forEach((value, key) => {
      if (!(value instanceof File)) {
        payload[key] = value as string;
      }
    });

    payload.paymentMode = paymentMode;
    payload.odPremium = (payload.odPremium as string) || "0";
    payload.tpPremium = (payload.tpPremium as string) || "0";
    payload.netPremium = (payload.netPremium as string) || "0";
    payload.grossPremium = (payload.grossPremium as string) || "0";
    payload.odPremiumPayin = (payload.odPremiumPayin as string) || "0";
    payload.tpPremiumPayin = (payload.tpPremiumPayin as string) || "0";
    payload.netPremiumPayin = (payload.netPremiumPayin as string) || "0";
    payload.extraAmountPayin = (payload.extraAmountPayin as string) || "0";
    payload.odPremiumPayout = (payload.odPremiumPayout as string) || "0";
    payload.tpPremiumPayout = (payload.tpPremiumPayout as string) || "0";
    payload.netPremiumPayout = (payload.netPremiumPayout as string) || "0";
    payload.extraAmountPayout = (payload.extraAmountPayout as string) || "0";

    if (uploadMeta.id) {
      payload.policyFile = uploadMeta.id;
    } else {
      payload.policyFile = "";
    }

    setIsSubmitting(true);

    try {
      await createBusinessEntry(payload as any, session.token);
      setSuccessMessage("Business entry created successfully.");
      event.currentTarget.reset();
      setPaymentMode("Online");
      setSelectedState("");
      setSelectedRmId("");
      setSelectedAssociateId("");
      setRmOptions([]);
      setAssociateOptions([]);
      setUploadedFile(null);
      setUploadError(null);
      setFileInputKey((previous) => previous + 1);
      fetchEntries();
      setTimeout(() => setShowForm(false), 1500);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message || "Unable to create business entry. Please verify the details.");
      } else {
        setErrorMessage("Something went wrong while creating the business entry. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700"
            aria-expanded={showForm}
          >
            {showForm ? "Hide Business Entry" : "Create Business Entry"}
          </button>
        </header>

        {showForm && (
          <form className="space-y-6" onSubmit={handleBusinessSubmit}>
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <SelectField
                  id="brokerid"
                  label="Broker Name"
                  required
                  placeholder={
                    isLoadingBrokers
                      ? "Loading brokers..."
                      : brokerOptions.length === 0
                      ? "No brokers found"
                      : "--Select Broker--"
                  }
                  options={brokerOptions.map((broker) => ({
                    label: broker.brokername,
                    value: broker._id,
                  }))}
                  disabled={isLoadingBrokers || brokerOptions.length === 0}
                  hint={
                    !isLoadingBrokers && brokerOptions.length === 0
                      ? "Add brokers in the Broker Directory before creating entries."
                      : undefined
                  }
                />
                <SelectField
                  id="insuranceCompany"
                  label="Insurance Company"
                  required
                  placeholder="--None--"
                  options={insuranceCompanies.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                />
                <TextField id="policyNumber" label="Policy Number" placeholder="Policy Number" required />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <TextField id="clientName" label="Client Name" placeholder="Client Name" required />
                <TextField id="contactNumber" label="Contact Number" type="tel" placeholder="Contact Number" required />
                <TextField id="emailId" label="Email ID" type="email" placeholder="email id" required />
                <SelectField
                  id="state"
                  label="State"
                  required
                  placeholder="--None--"
                  options={stateOptions.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SelectField
                  id="lineOfBusiness"
                  label="Line of Business"
                  required
                  placeholder="--None--"
                  options={lineOfBusinessOptions.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                />
                <SelectField
                  id="product"
                  label="Product"
                  required
                  placeholder="--None--"
                  options={productOptions.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                />
                <SelectField
                  id="subProduct"
                  label="Sub Product"
                  required
                  placeholder="--None--"
                  options={subProductOptions.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                />
                <TextField id="registrationNumber" label="Registration Number" placeholder="Registration Number" required />
                <TextField id="policyIssueDate" label="Policy Issue Date" type="date" required />
                <TextField id="policyStartDate" label="Policy Start Date" type="date" required />
                <TextField id="policyEndDate" label="Policy End Date" type="date" required />
                <TextField id="policyTpEndDate" label="Policy TP End Date" type="date" required />
                <TextField id="odPremium" label="OD Premium" type="number" placeholder="0" required />
                <TextField id="tpPremium" label="TP Premium" type="number" placeholder="0" required />
                <TextField id="netPremium" label="Net Premium" type="number" placeholder="0" required />
                <TextField id="grossPremium" label="Gross Premium" type="number" placeholder="0" required />
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <SelectField
                  id="rmState"
                  label="RM State"
                  required
                  placeholder="--Select State--"
                  options={stateOptions.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                  onChange={(e) => handleStateChange(e.target.value)}
                  value={selectedState}
                />
                <SelectField
                  id="rmId"
                  label="Relationship Manager"
                  required
                  placeholder={!selectedState ? "Select State first" : isLoadingUsers ? "Loading..." : "--Select RM--"}
                  options={rmOptions.map((rm) => ({
                    label: `${rm.firstName} ${rm.lastName} (${rm.empCode})`,
                    value: rm._id,
                  }))}
                  onChange={(e) => handleRmChange(e.target.value)}
                  value={selectedRmId}
                  disabled={!selectedState}
                />
                <SelectField
                  id="associateId"
                  label="Associate"
                  required
                  placeholder={!selectedRmId ? "Select RM first" : isLoadingUsers ? "Loading..." : "--Select Associate--"}
                  options={associateOptions.map((assoc) => ({
                    label: `${assoc.name} (${assoc.associateCode})`,
                    value: assoc._id,
                  }))}
                  onChange={(e) => handleAssociateChange(e.target.value)}
                  value={selectedAssociateId}
                  disabled={!selectedRmId}
                />
                <SelectField
                  id="reportingFy"
                  label="Reporting FY"
                  required
                  placeholder="--None--"
                  options={reportingFyOptions.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                />
                <SelectField
                  id="reportingMonth"
                  label="Reporting Month"
                  required
                  placeholder="--None--"
                  options={reportingMonthOptions.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                />
              </div>

              {selectedAssociateId && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <TextField id="odPremiumPayin" label="OD Premium Payin" type="number" placeholder="0" required />
                <TextField id="tpPremiumPayin" label="TP Premium Payin" type="number" placeholder="0" required />
                <TextField id="netPremiumPayin" label="Net Premium Payin" type="number" placeholder="0" required />
                <TextField id="extraAmountPayin" label="Extra Amount Payin" type="number" placeholder="0" required />
                <TextField id="odPremiumPayout" label="OD Premium Payout" type="number" placeholder="0" required />
                <TextField id="tpPremiumPayout" label="TP Premium Payout" type="number" placeholder="0" required />
                <TextField id="netPremiumPayout" label="Net Premium Payout" type="number" placeholder="0" required />
                <TextField id="extraAmountPayout" label="Extra Amount Payout" type="number" placeholder="0" required />
              </div>
              )}
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Payment Mode</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="Online"
                        checked={paymentMode === "Online"}
                        onChange={() => setPaymentMode("Online")}
                        className="h-4 w-4 text-blue-600"
                      />
                      Online
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="Cheque"
                        checked={paymentMode === "Cheque"}
                        onChange={() => setPaymentMode("Cheque")}
                        className="h-4 w-4 text-blue-600"
                      />
                      Cheque
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="Cash"
                        checked={paymentMode === "Cash"}
                        onChange={() => setPaymentMode("Cash")}
                        className="h-4 w-4 text-blue-600"
                      />
                      Cash
                    </label>
                  </div>
                </div>
                <div className="grid w-full max-w-sm gap-4 md:grid-cols-2">
                  {paymentMode === "Cheque" && (
                    <>
                      <TextField id="chequeNumber" label="Cheque Number" placeholder="Enter cheque number" required />
                      <TextField id="chequeDate" label="Cheque Date" type="date" required />
                    </>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FileUploadField
                  key={fileInputKey}
                  id="supportingFile"
                  name="supportingFile"
                  label="File"
                  hint="Upload supporting document (max 10 MB)."
                  onChange={handleFileChange}
                  disabled={isUploadingFile}
                  error={uploadError || undefined}
                />
                <div className="col-span-full space-y-2 text-xs text-slate-600">
                  {isUploadingFile && <p className="rounded-xl bg-slate-100 px-3 py-2 text-slate-500">Uploading document...</p>}
                  {uploadedFile && !isUploadingFile && !uploadError && (
                    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
                      <span className="font-semibold">{uploadMeta.name ?? "Document uploaded"}</span>
                      {uploadMeta.url && (
                        <a
                          href={uploadMeta.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={handleRemoveUploadedFile}
                        className="text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {(errorMessage || successMessage) && (
                <div className="space-y-2">
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

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingFile}
                  className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : isUploadingFile ? "Uploading..." : "Save Business"}
                </button>
              </div>
            </div>
          </form>
        )}
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-1 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Business Entries</h2>
          <p className="text-xs font-medium text-slate-500">Review captured policies alongside key consolidation attributes.</p>
        </header>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <input
              type="search"
              placeholder="Search by policy or client"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">⌕</span>
          </div>
          <div className="flex gap-2 text-sm font-medium text-slate-500">
            <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-blue-200 hover:text-blue-600">All</button>
            <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-blue-200 hover:text-blue-600">Online</button>
            <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-blue-200 hover:text-blue-600">Cheque</button>
          </div>
        </div>
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-slate-500">Loading business entries...</p>
            </div>
          ) : businessEntries.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-slate-500">No business entries found. Create your first entry above.</p>
            </div>
          ) : (
            <table className="min-w-[1100px] divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-600">Policy Number</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Client Name</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Insurance Company</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Broker</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">RM</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Associate</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Payment Mode</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Total Payin</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Total Payout</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Net Revenue</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {businessEntries.map((entry) => {
                  const broker = brokerOptions.find(b => b._id === entry.brokerid);
                  const rmName = entry.rmData 
                    ? `${entry.rmData.firstName} ${entry.rmData.middleName || ''} ${entry.rmData.lastName}`.trim()
                    : 'N/A';
                  const associateName = entry.associateData?.contactPerson || 'N/A';
                  return (
                  <tr key={entry._id} className="transition hover:bg-blue-50/40">
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{entry.policyNumber}</span>
                        <span className="text-xs uppercase tracking-wide text-slate-400">{entry.registrationNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{entry.clientName}</td>
                    <td className="px-4 py-4 text-slate-600">{entry.insuranceCompany}</td>
                    <td className="px-4 py-4 text-slate-600">{broker?.brokername || entry.brokerData?.brokername || entry.brokerid}</td>
                    <td className="px-4 py-4 text-slate-600">{rmName}</td>
                    <td className="px-4 py-4 text-slate-600">{associateName}</td>
                    <td className="px-4 py-4 text-slate-600">{entry.paymentMode}</td>
                    <td className="px-4 py-4 text-slate-600">₹{Number(entry.totalPayin).toLocaleString()}</td>
                    <td className="px-4 py-4 text-slate-600">₹{Number(entry.totalPayout).toLocaleString()}</td>
                    <td className="px-4 py-4 text-slate-600">₹{Number(entry.netRevenue).toLocaleString()}</td>
                    <td className="px-4 py-4 text-slate-600">{new Date(entry.createdAt).toLocaleDateString()}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

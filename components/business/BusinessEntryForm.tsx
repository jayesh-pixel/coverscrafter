"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { SelectField, TextField } from "@/components/ui/forms";
import { getAssociateUsers, getRMUsers, getUserProfile, type AssociateUser, type RMUser } from "@/lib/api/users";
import { getValidAuthToken, getAuthSession } from "@/lib/utils/storage";
import { uploadDocument, type UploadResponse } from "@/lib/api/uploads";
import { ApiError } from "@/lib/api/config";
import type { BrokerName } from "@/lib/api/brokername";
import type { BusinessEntry } from "@/lib/api/businessentry";

const insuranceCompanies = [
  "Acko General Insurance",
  "Aditya Birla Health Insurance Co. Ltd.",
  "Aditya Birla Sun Life Insurance Co. Ltd.",
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

const productsByLineOfBusiness: Record<string, string[]> = {
  "Aviation Insurance": [
    "AVIATION - HULL ALL RISKS POLICY SCHEDULE",
    "Aviation Loss of Licence Insurance Policy",
    "Aviation Personal Accident Insurance policy",
  ],
  "ENGINEERING Insurance": [
    "Boilers & Pressure Plants Policy",
    "Contractor's All Risk Policy",
    "Contractor's Plant and Machinery Policy",
    "Electronic Equipment Policy",
    "Erection All Risks Policy",
    "Machinery Breakdown Policy",
    "Portable Electronic Equipment Insurance Policy",
  ],
  "FIRE Insurance": [
    "Standard Fire & Special Perils Policy",
    "Fire Loss Of Profit Insurance Policy",
    "Industrial All Risk Policy",
  ],
  "HEALTH & PA Insurance": [
    "Family Floater Health Policy",
    "Individual Health Policy",
    "Group Health Policy",
    "Group Personal Accident Policy",
    "Personal Accident Policy",
    "Corona Kavach (individual Health) Policy",
    "Corona Kavach (Family Health) Policy",
  ],
  "LIABILITY Insurance": [
    "Commercial General Liability Policy",
    "Cyber Liability",
    "Directors & Officers Liability",
    "Workmen Compensation Policy",
    "Lift Policy",
    "Professional Indemnity Policy",
    "Public Liability Policy",
    "Public Liability Industrial Risk Policy",
    "LIABILITY All Others",
    "CLINICAL TRAIL INSURANCE",
  ],
  "Life Insurance": [
    "Group Term Life Policy",
    "Life Insurance Policy",
    "Term Life Policy",
  ],
  "MARINE & HULL Insurance": [
    "Marine Policy",
    "Marine-Hull Policy",
  ],
  "Miscellaneous Insurance": [
    "Travel Insurance Policy",
    "All Risk Policy",
    "Burglary Policy",
    "Business Shield Policy",
    "Business Suraksha Classic Policy",
    "Event Policy",
    "Fidelity Guarantee Policy",
    "House Hold Package Policy",
    "Jeweler's Shop Package Policy",
    "Money Insurance Policy",
    "Office Package Policy",
    "Package Policy",
    "Shopkeeper Package Policy",
    "Society Insurance Policy",
    "Stock Broker Insurance Policy",
    "Trade Credit Insurance Policy",
    "Miscellanious Others",
    "Live Stock Insurance",
    "Plate Glass Insurance Policy",
  ],
  "MOTOR Insurance": [
    "GCV Vehicle Liability Policy",
    "GCV Vehicle Package Policy",
    "Misc. D Vehicle Liability Policy",
    "Misc. D Vehicle Package Policy",
    "Passenger Carrying Vehicle Liability Policy",
    "Passenger Carrying Vehicle Package Policy",
    "Private Car Liability Policy",
    "Private Car Package Policy",
    "Two Wheeler Liability Policy",
    "Two Wheeler Package Policy",
    "Two Wheeler OD Policy",
    "Private Car OD Policy",
    "CPA Policy",
  ],
};

const subProductByProduct: Record<string, string[]> = {
  "GCV Vehicle Liability Policy": [
    "Three Wheeler",
    "GVW 12000 - 20000 kgs",
    "GVW 20000 - 40000 kgs",
    "GVW 2500 - 3500 kgs",
    "GVW 3500 - 7500 kgs",
    "GVW 7500 - 12000 kgs",
    "GVW exceeding 40000 kgs",
    "GVW Up to 2500 kgs",
  ],
  "GCV Vehicle Package Policy": [
    "Three Wheeler",
    "GVW 12000 - 20000 kgs",
    "GVW 20000 - 40000 kgs",
    "GVW 2500 - 3500 kgs",
    "GVW 3500 - 7500 kgs",
    "GVW 7500 - 12000 kgs",
    "GVW exceeding 40000 kgs",
    "GVW Up to 2500 kgs",
  ],
  "Misc. D Vehicle Liability Policy": [
    "Miscellaneous Vehicle",
    "JCB",
    "Tractor",
  ],
  "Misc. D Vehicle Package Policy": [
    "Miscellaneous Vehicle",
    "JCB",
    "Tractor",
  ],
  "Passenger Carrying Vehicle Liability Policy": [
    "PCV - CONTRACT BUS",
    "PCV - Others",
    "PCV - School Bus",
    "PCV - STAFF BUS",
    "PCV - Taxi",
    "PCV - Taxi (T-Permit)",
    "PCV - Three Wheeler",
    "Electric Vehicle",
  ],
  "Passenger Carrying Vehicle Package Policy": [
    "PCV - CONTRACT BUS",
    "PCV - Others",
    "PCV - School Bus",
    "PCV - STAFF BUS",
    "PCV - Taxi",
    "PCV - Taxi (T-Permit)",
    "PCV - Three Wheeler",
    "Electric Vehicle",
  ],
  "Private Car Liability Policy": [
    "Four Wheeler",
    "High-End",
  ],
  "Private Car Package Policy": [
    "Four Wheeler",
    "High-End",
  ],
  "Private Car OD Policy": [
    "Four Wheeler",
    "High-End",
  ],
  "Two Wheeler Liability Policy": [
    "Two Wheeler",
    "Bike",
    "Scooter",
  ],
  "Two Wheeler Package Policy": [
    "Two Wheeler",
    "Bike",
    "Scooter",
  ],
  "Two Wheeler OD Policy": [
    "Two Wheeler",
    "Bike",
    "Scooter",
  ],
};

const getCurrentFY = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  const fyStartYear = currentMonth < 3 ? currentYear - 1 : currentYear;
  
  const fyOptions = [];
  for (let i = 0; i < 6; i++) {
    const startYear = fyStartYear + i;
    const endYear = startYear + 1;
    fyOptions.push(`${startYear}-${endYear.toString().slice(-2)}`);
  }
  return fyOptions;
};

const getCurrentAndFutureMonths = () => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = new Date().getMonth();
  return months.slice(currentMonth);
};

const reportingFyOptions = getCurrentFY();
const reportingMonthOptions = getCurrentAndFutureMonths();

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

interface BusinessEntryFormProps {
  mode: "create" | "edit";
  editEntry?: BusinessEntry | null;
  brokerOptions: BrokerName[];
  isLoadingBrokers: boolean;
  allRMs: RMUser[];
  allAssociates: AssociateUser[];
  onSubmit: (payload: any, uploadedFile: UploadResponse | null) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
  userRole: string;
}

export default function BusinessEntryForm({
  mode,
  editEntry,
  brokerOptions,
  isLoadingBrokers,
  allRMs,
  allAssociates,
  onSubmit,
  onCancel,
  isSubmitting,
  userRole,
}: BusinessEntryFormProps) {
  const [paymentMode, setPaymentMode] = useState<"Online" | "Cheque" | "Cash">("Online");
  const [payoutMode, setPayoutMode] = useState<"cut&pay" | "fullpay">("fullpay");
  const [selectedLineOfBusiness, setSelectedLineOfBusiness] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<UploadResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [rmOptions, setRmOptions] = useState<RMUser[]>([]);
  const [associateOptions, setAssociateOptions] = useState<AssociateUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedRmId, setSelectedRmId] = useState<string>("");
  const [selectedAssociateId, setSelectedAssociateId] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [odPremium, setOdPremium] = useState<string>("");
  const [tpPremium, setTpPremium] = useState<string>("");
  const [netPremium, setNetPremium] = useState<string>("");
  const [grossPremium, setGrossPremium] = useState<string>("");
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getToken = async (): Promise<string | null> => {
    return await getValidAuthToken();
  };

  const fetchRMsByState = async (state: string) => {
    const token = await getToken();
    if (!token) return;

    setIsLoadingUsers(true);
    try {
      const formattedState = state
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const rms = await getRMUsers(token, undefined, formattedState);
      setRmOptions(rms);
    } catch (error) {
      console.error("Failed to fetch RMs for state", error);
      setRmOptions([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Initialize form with edit data
  useEffect(() => {
    if (mode === "edit" && editEntry) {
      setPaymentMode((editEntry.paymentMode as any) || "Online");
      setPayoutMode((editEntry.payoutMode as any) || "fullpay");
      setSelectedLineOfBusiness(editEntry.lineOfBusiness || "");
      setSelectedProduct(editEntry.product || "");
      setSelectedState(editEntry.state || "");
      setSelectedRmId(editEntry.rmId || "");
      setSelectedAssociateId(editEntry.associateId || "");
      setOdPremium(editEntry.odPremium?.toString() || "");
      setTpPremium(editEntry.tpPremium?.toString() || "");
      setNetPremium(editEntry.netPremium?.toString() || "");
      setGrossPremium(editEntry.grossPremium?.toString() || "");
      setIsNewVehicle(editEntry.isNewVehicle || false);

      // Fetch RMs for the state
      if (editEntry.state) {
        fetchRMsByState(editEntry.state);
      }

      // Fetch associates for the RM
      if (editEntry.rmId) {
        const rm = allRMs.find(r => r._id === editEntry.rmId);
        if (rm?.firebaseUid) {
          const associates = allAssociates.filter(a => a.createdBy === rm.firebaseUid);
          setAssociateOptions(associates);
        }
      }
    }
  }, [mode, editEntry, allRMs, allAssociates]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null);
    setSelectedFile(null);
    setUploadedFile(null);

    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError("File exceeds the 10 MB limit.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveUploadedFile = () => {
    setSelectedFile(null);
    setUploadedFile(null);
    setUploadError(null);
    setFileInputKey((previous) => previous + 1);
  };

  const handleRmChange = async (rmId: string) => {
    setSelectedRmId(rmId);
    setSelectedAssociateId("");
    setAssociateOptions([]);
    
    if (!rmId) {
      setSelectedState("");
      return;
    }
    
    const selectedRm = allRMs.find(rm => rm._id === rmId);
    if (selectedRm?.state) {
      const formattedState = selectedRm.state.toUpperCase();
      setSelectedState(formattedState);
    }
    
    const token = await getToken();
    if (!token) return;
    
    const rm = allRMs.find(r => r._id === rmId);
    if (!rm?.firebaseUid) {
      setAssociateOptions([]);
      return;
    }
    
    setIsLoadingUsers(true);
    try {
      const allAssocs = await getAssociateUsers(token);
      const associates = allAssocs.filter(a => a.createdBy === rm.firebaseUid);
      setAssociateOptions(associates);
    } catch (error) {
      console.error("Failed to fetch associates for RM", error);
      setAssociateOptions([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedRmId("");
    setSelectedAssociateId("");
    setAssociateOptions([]);
    fetchRMsByState(state);
  };

  const handleOdPremiumChange = (value: string) => {
    setOdPremium(value);
    const od = parseFloat(value) || 0;
    const tp = parseFloat(tpPremium) || 0;
    const net = od + tp;
    setNetPremium(net.toFixed(2));
  };

  const handleTpPremiumChange = (value: string) => {
    setTpPremium(value);
    const od = parseFloat(odPremium) || 0;
    const tp = parseFloat(value) || 0;
    const net = od + tp;
    setNetPremium(net.toFixed(2));
  };

  const extractUploadMeta = (upload: UploadResponse | null): { id?: string; name?: string; url?: string } => {
    if (!upload) return {};

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

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const form = event.currentTarget;
    if (!form) {
      setErrorMessage("Form element not found.");
      return;
    }
    
    setErrorMessage(null);

    const token = await getToken();
    if (!token) {
      setErrorMessage("You must be signed in.");
      return;
    }

    // For create mode, upload file
    let uploadResponse: UploadResponse | null = null;
    if (mode === "create") {
      if (!selectedFile) {
        setErrorMessage("Please select a policy document before saving.");
        return;
      }

      setIsUploadingFile(true);
      try {
        uploadResponse = await uploadDocument(selectedFile, token);
        setUploadedFile(uploadResponse);
      } catch (error) {
        console.error("Failed to upload file", error);
        if (error instanceof ApiError) {
          const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : error.message;
          setErrorMessage(fullError);
        } else {
          setErrorMessage("Something went wrong while uploading. Please try again.");
        }
        setIsUploadingFile(false);
        return;
      } finally {
        setIsUploadingFile(false);
      }

      const uploadMeta = extractUploadMeta(uploadResponse);
      if (!uploadMeta.id) {
        setErrorMessage("File upload failed. Please try again.");
        return;
      }
    }

    const formElements = form.elements as any;
    
    const payload: Record<string, string | number | boolean> = {
      brokerid: formElements.brokerid?.value || '',
      insuranceCompany: formElements.insuranceCompany?.value || '',
      policyNumber: formElements.policyNumber?.value || '',
      clientName: formElements.clientName?.value || '',
      contactNumber: formElements.contactNumber?.value || '',
      emailId: formElements.emailId?.value || '',
      state: formElements.state?.value || '',
      lineOfBusiness: formElements.lineOfBusiness?.value || '',
      product: formElements.product?.value || '',
      subProduct: formElements.subProduct?.value || '',
      policyIssueDate: formElements.policyIssueDate?.value || '',
      policyStartDate: formElements.policyStartDate?.value || '',
      policyEndDate: formElements.policyEndDate?.value || '',
      policyTpEndDate: formElements.policyTpEndDate?.value || '',
      rmId: formElements.rmId?.value || '',
      rmState: formElements.rmState?.value || '',
      associateId: formElements.associateId?.value || '',
      reportingFy: formElements.reportingFy?.value || '',
      reportingMonth: formElements.reportingMonth?.value || '',
    };

    payload.isNewVehicle = isNewVehicle;
    if (isNewVehicle) {
      payload.registrationNumber = 'NEW';
    } else {
      payload.registrationNumber = formElements.registrationNumber?.value || '';
    }

    if (selectedAssociateId && userRole !== 'rm' && userRole !== 'associate') {
      payload.odPremiumPayin = formElements.odPremiumPayin?.value || '0';
      payload.tpPremiumPayin = formElements.tpPremiumPayin?.value || '0';
      payload.netPremiumPayin = formElements.netPremiumPayin?.value || '0';
      payload.extraAmountPayin = formElements.extraAmountPayin?.value || '0';
      payload.odPremiumPayout = formElements.odPremiumPayout?.value || '0';
      payload.tpPremiumPayout = formElements.tpPremiumPayout?.value || '0';
      payload.netPremiumPayout = formElements.netPremiumPayout?.value || '0';
      payload.extraAmountPayout = formElements.extraAmountPayout?.value || '0';
    }

    if (paymentMode === "Cheque") {
      payload.chequeNumber = formElements.chequeNumber?.value || '';
      payload.chequeDate = formElements.chequeDate?.value || '';
    }

    payload.paymentMode = paymentMode;
    payload.payoutMode = payoutMode;
    
    if (payoutMode === "cut&pay") {
      payload.status = "Paid";
      payload.utrno = "cut&pay";
      payload.paymentdate = new Date().toISOString().split('T')[0];
    } else if (mode === "edit") {
      // For edit mode, include existing payment fields
      payload.status = formElements.status?.value || '';
      payload.utrno = formElements.utrno?.value || '';
      payload.paymentdate = formElements.paymentdate?.value || '';
    }
    
    payload.odPremium = odPremium || "0";
    payload.tpPremium = tpPremium || "0";
    payload.netPremium = netPremium || "0";
    payload.grossPremium = grossPremium || "0";

    if (mode === "create" && uploadResponse) {
      const uploadMeta = extractUploadMeta(uploadResponse);
      if (uploadMeta.id) {
        payload.policyFile = uploadMeta.id;
      }
    }

    await onSubmit(payload, uploadResponse);
  };

  const uploadMeta = extractUploadMeta(uploadedFile);

  return (
    <form className="space-y-6" onSubmit={handleFormSubmit}>
      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {errorMessage}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SelectField
            id="brokerid"
            label="Broker Name"
            required
            defaultValue={mode === "edit" ? editEntry?.brokerid : undefined}
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
            defaultValue={mode === "edit" ? editEntry?.insuranceCompany : undefined}
            placeholder="--None--"
            options={insuranceCompanies.map((option) => ({
              label: option,
              value: option,
            }))}
          />
          <TextField 
            id="policyNumber" 
            label="Policy Number" 
            placeholder="Policy Number" 
            required 
            defaultValue={mode === "edit" ? editEntry?.policyNumber : undefined}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TextField 
            id="clientName" 
            label="Client Name" 
            placeholder="Client Name" 
            required 
            defaultValue={mode === "edit" ? editEntry?.clientName : undefined}
          />
          <TextField 
            id="contactNumber" 
            label="Contact Number" 
            type="tel" 
            placeholder="Contact Number" 
            required 
            defaultValue={mode === "edit" ? editEntry?.contactNumber : undefined}
          />
          <TextField 
            id="emailId" 
            label="Email ID" 
            type="email" 
            placeholder="email id" 
            required 
            defaultValue={mode === "edit" ? editEntry?.emailId : undefined}
          />
          <SelectField
            id="state"
            label="State"
            required
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            placeholder="--None--"
            options={stateOptions.map((option) => ({
              label: option,
              value: option,
            }))}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SelectField
            id="lineOfBusiness"
            label="Line of Business"
            required
            value={selectedLineOfBusiness}
            onChange={(e) => {
              setSelectedLineOfBusiness(e.target.value);
              setSelectedProduct("");
            }}
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
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            placeholder="--None--"
            options={
              selectedLineOfBusiness && productsByLineOfBusiness[selectedLineOfBusiness]
                ? productsByLineOfBusiness[selectedLineOfBusiness].map((option) => ({
                    label: option,
                    value: option,
                  }))
                : []
            }
            disabled={!selectedLineOfBusiness}
          />
          <SelectField
            id="subProduct"
            label="Sub Product"
            placeholder="--None--"
            defaultValue={mode === "edit" ? editEntry?.subProduct : undefined}
            options={
              selectedProduct && subProductByProduct[selectedProduct]
                ? subProductByProduct[selectedProduct].map((option) => ({
                    label: option,
                    value: option,
                  }))
                : []
            }
            disabled={!selectedProduct}
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isNewVehicle"
              checked={isNewVehicle}
              onChange={(e) => setIsNewVehicle(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isNewVehicle" className="text-sm font-medium text-slate-700">
              New Vehicle (No Registration)
            </label>
          </div>
          {!isNewVehicle && (
            <TextField
              id="registrationNumber"
              label="Registration Number"
              placeholder="Registration Number"
              defaultValue={mode === "edit" && !editEntry?.isNewVehicle ? editEntry?.registrationNumber : undefined}
            />
          )}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TextField
            id="policyIssueDate"
            label="Policy Issue Date"
            type="date"
            required
            defaultValue={mode === "edit" && editEntry?.policyIssueDate ? new Date(editEntry.policyIssueDate).toISOString().split('T')[0] : undefined}
          />
          <TextField
            id="policyStartDate"
            label="Policy Start Date"
            type="date"
            required
            defaultValue={mode === "edit" && editEntry?.policyStartDate ? new Date(editEntry.policyStartDate).toISOString().split('T')[0] : undefined}
          />
          <TextField
            id="policyEndDate"
            label="Policy End Date"
            type="date"
            required
            defaultValue={mode === "edit" && editEntry?.policyEndDate ? new Date(editEntry.policyEndDate).toISOString().split('T')[0] : undefined}
          />
          <TextField
            id="policyTpEndDate"
            label="Policy TP End Date"
            type="date"
            defaultValue={mode === "edit" && editEntry?.policyTpEndDate ? new Date(editEntry.policyTpEndDate).toISOString().split('T')[0] : undefined}
          />
        </div>
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <h3 className="text-base font-semibold text-slate-900">Premium Details</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TextField
            id="odPremium"
            label="OD Premium"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={odPremium}
            onChange={(e) => handleOdPremiumChange(e.target.value)}
          />
          <TextField
            id="tpPremium"
            label="TP Premium"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={tpPremium}
            onChange={(e) => handleTpPremiumChange(e.target.value)}
          />
          <TextField
            id="netPremium"
            label="Net Premium"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={netPremium}
            onChange={(e) => setNetPremium(e.target.value)}
          />
          <TextField
            id="grossPremium"
            label="Gross Premium"
            type="number"
            step="0.01"
            placeholder="0.00"
            required
            value={grossPremium}
            onChange={(e) => setGrossPremium(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Payment Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMode"
                  value="Online"
                  checked={paymentMode === "Online"}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Online</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMode"
                  value="Cheque"
                  checked={paymentMode === "Cheque"}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Cheque</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMode"
                  value="Cash"
                  checked={paymentMode === "Cash"}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Cash</span>
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Payout Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payoutMode"
                  value="fullpay"
                  checked={payoutMode === "fullpay"}
                  onChange={(e) => setPayoutMode(e.target.value as any)}
                  className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Full Pay</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payoutMode"
                  value="cut&pay"
                  checked={payoutMode === "cut&pay"}
                  onChange={(e) => setPayoutMode(e.target.value as any)}
                  className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Cut & Pay</span>
              </label>
            </div>
          </div>
        </div>

        {paymentMode === "Cheque" && (
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              id="chequeNumber"
              label="Cheque Number"
              placeholder="Cheque Number"
              defaultValue={mode === "edit" ? editEntry?.chequeNumber : undefined}
            />
            <TextField
              id="chequeDate"
              label="Cheque Date"
              type="date"
              defaultValue={mode === "edit" && editEntry?.chequeDate ? new Date(editEntry.chequeDate).toISOString().split('T')[0] : undefined}
            />
          </div>
        )}

        {payoutMode === "cut&pay" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TextField
              id="utrno"
              label="UTR Number"
              value="cut&pay"
              disabled
              required
            />
            <div className="md:col-span-2 lg:col-span-1">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Payment Status:</span> Paid<br />
                  <span className="font-semibold">Payment Date:</span> {new Date().toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          </div>
        )}

        {mode === "edit" && payoutMode !== "cut&pay" && (
          <div className="grid gap-4 md:grid-cols-3">
            <TextField
              id="status"
              label="Payment Status"
              placeholder="Status"
              defaultValue={editEntry?.status}
            />
            <TextField
              id="utrno"
              label="UTR Number"
              placeholder="UTR Number"
              defaultValue={editEntry?.utrno}
            />
            <TextField
              id="paymentdate"
              label="Payment Date"
              type="date"
              defaultValue={editEntry?.paymentdate ? new Date(editEntry.paymentdate).toISOString().split('T')[0] : undefined}
            />
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <h3 className="text-base font-semibold text-slate-900">RM & Associate Assignment</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField
            id="rmState"
            label="RM State"
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            placeholder="--Select State--"
            options={stateOptions.map((option) => ({
              label: option,
              value: option,
            }))}
          />
          <SelectField
            id="rmId"
            label="RM Name"
            value={selectedRmId}
            onChange={(e) => handleRmChange(e.target.value)}
            placeholder={isLoadingUsers ? "Loading RMs..." : "--Select RM--"}
            options={rmOptions.map((rm) => ({
              label: rm.name,
              value: rm._id,
            }))}
            disabled={!selectedState || isLoadingUsers}
          />
          <SelectField
            id="associateId"
            label="Associate Name"
            value={selectedAssociateId}
            onChange={(e) => setSelectedAssociateId(e.target.value)}
            placeholder={isLoadingUsers ? "Loading Associates..." : "--Select Associate--"}
            options={associateOptions.map((assoc) => ({
              label: assoc.name,
              value: assoc._id,
            }))}
            disabled={!selectedRmId || isLoadingUsers}
          />
        </div>

        {selectedAssociateId && userRole !== 'rm' && userRole !== 'associate' && (
          <>
            <h4 className="mt-6 text-sm font-semibold text-slate-900">Pay-In Details</h4>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <TextField
                id="odPremiumPayin"
                label="OD Premium (Pay-In)"
                type="number"
                step="0.01"
                placeholder="0.00"
                defaultValue={mode === "edit" ? editEntry?.odPremiumPayin?.toString() : "0"}
              />
              <TextField
                id="tpPremiumPayin"
                label="TP Premium (Pay-In)"
                type="number"
                step="0.01"
                placeholder="0.00"
                defaultValue={mode === "edit" ? editEntry?.tpPremiumPayin?.toString() : "0"}
              />
              <TextField
                id="netPremiumPayin"
                label="Net Premium (Pay-In)"
                type="number"
                step="0.01"
                placeholder="0.00"
                defaultValue={mode === "edit" ? editEntry?.netPremiumPayin?.toString() : "0"}
              />
              <TextField
                id="extraAmountPayin"
                label="Extra Amount (Pay-In)"
                type="number"
                step="0.01"
                placeholder="0.00"
                defaultValue={mode === "edit" ? editEntry?.extraAmountPayin?.toString() : "0"}
              />
            </div>

            <h4 className="mt-6 text-sm font-semibold text-slate-900">Pay-Out Details</h4>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <TextField
                id="odPremiumPayout"
                label="OD Premium (Pay-Out)"
                type="number"
                step="0.01"
                placeholder="0.00"
                defaultValue={mode === "edit" ? editEntry?.odPremiumPayout?.toString() : "0"}
              />
              <TextField
                id="tpPremiumPayout"
                label="TP Premium (Pay-Out)"
                type="number"
                step="0.01"
                placeholder="0.00"
                defaultValue={mode === "edit" ? editEntry?.tpPremiumPayout?.toString() : "0"}
              />
              <TextField
                id="netPremiumPayout"
                label="Net Premium (Pay-Out)"
                type="number"
                step="0.01"
                placeholder="0.00"
                defaultValue={mode === "edit" ? editEntry?.netPremiumPayout?.toString() : "0"}
              />
              <TextField
                id="extraAmountPayout"
                label="Extra Amount (Pay-Out)"
                type="number"
                step="0.01"
                placeholder="0.00"
                defaultValue={mode === "edit" ? editEntry?.extraAmountPayout?.toString() : "0"}
              />
            </div>
          </>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            id="reportingFy"
            label="Reporting FY"
            required
            defaultValue={mode === "edit" ? editEntry?.reportingFy : undefined}
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
            defaultValue={mode === "edit" ? editEntry?.reportingMonth : undefined}
            placeholder="--None--"
            options={reportingMonthOptions.map((option) => ({
              label: option,
              value: option,
            }))}
          />
        </div>
      </div>

      {mode === "create" && (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h3 className="mb-4 text-base font-semibold text-slate-900">Policy Document Upload</h3>
          
          <div className="space-y-3">
            <label htmlFor="policyFile" className="block text-sm font-medium text-slate-700">
              Upload Policy File <span className="text-rose-500">*</span>
            </label>
            <input
              key={fileInputKey}
              id="policyFile"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-slate-500">
              Supported formats: PDF, JPG, PNG (Max size: 10 MB)
            </p>

            {uploadError && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                {uploadError}
              </div>
            )}

            {selectedFile && !uploadError && (
              <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-emerald-900">{selectedFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveUploadedFile}
                  className="rounded-lg p-1 text-emerald-600 transition hover:bg-emerald-100"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            disabled={isSubmitting || isUploadingFile}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting || isUploadingFile}
        >
          {isSubmitting || isUploadingFile
            ? mode === "create" 
              ? "Creating..." 
              : "Updating..."
            : mode === "create"
            ? "Create Business Entry"
            : "Update Business Entry"}
        </button>
      </div>
    </form>
  );
}

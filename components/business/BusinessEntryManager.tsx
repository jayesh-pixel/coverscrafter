"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FileUploadField, SelectField, TextField } from "@/components/ui/forms";
import { createBusinessEntry, getBusinessEntries, bulkUpdateBusinessEntries, exportBusinessEntries, updateBusinessEntry, deleteBusinessEntry, type BusinessEntry, type BulkUpdatePayload } from "@/lib/api/businessentry";
import { getBrokerNames, type BrokerName } from "@/lib/api/brokername";
import { uploadDocument, type UploadResponse } from "@/lib/api/uploads";
import { ApiError, API_BASE_URL } from "@/lib/api/config";
import { getAuthSession, getValidAuthToken } from "@/lib/utils/storage";
import { getRMUsers, getAssociateUsers, getUserProfile, type RMUser, type AssociateUser } from "@/lib/api/users";

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

const regionOptions = [...stateOptions];

// Generate reporting FY options dynamically based on current year
const getCurrentFY = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11
  
  // If we're in Jan-Mar, FY starts from previous year
  const fyStartYear = currentMonth < 3 ? currentYear - 1 : currentYear;
  
  const fyOptions = [];
  for (let i = 0; i < 6; i++) {
    const startYear = fyStartYear + i;
    const endYear = startYear + 1;
    fyOptions.push(`${startYear}-${endYear.toString().slice(-2)}`);
  }
  return fyOptions;
};

// Generate reporting month options dynamically from current month onwards
const getCurrentAndFutureMonths = () => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = new Date().getMonth(); // 0-11
  return months.slice(currentMonth);
};

const reportingFyOptions = getCurrentFY();
const reportingMonthOptions = getCurrentAndFutureMonths();

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
  // Helper to get valid token
  const getToken = async (): Promise<string | null> => {
    return await getValidAuthToken();
  };

  const [paymentMode, setPaymentMode] = useState<"Online" | "Cheque" | "Cash">("Online");
  const [payoutMode, setPayoutMode] = useState<"cut&pay" | "fullpay">("fullpay");
  const [showForm, setShowForm] = useState(initialShowForm);
  const [businessEntries, setBusinessEntries] = useState<BusinessEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedLineOfBusiness, setSelectedLineOfBusiness] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [brokerOptions, setBrokerOptions] = useState<BrokerName[]>([]);
  const [isLoadingBrokers, setIsLoadingBrokers] = useState(false);
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
  const [allAssociates, setAllAssociates] = useState<AssociateUser[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [allRMs, setAllRMs] = useState<RMUser[]>([]);
  const [isRmAutoFilled, setIsRmAutoFilled] = useState(false);
  const [isAssociateAutoFilled, setIsAssociateAutoFilled] = useState(false);
  const [odPremium, setOdPremium] = useState<string>("");
  const [tpPremium, setTpPremium] = useState<string>("");
  const [netPremium, setNetPremium] = useState<string>("");
  const [grossPremium, setGrossPremium] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [viewFileUrl, setViewFileUrl] = useState<string | null>(null);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [fileBlob, setFileBlob] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [bulkUpdateFile, setBulkUpdateFile] = useState<File | null>(null);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [bulkUpdateResult, setBulkUpdateResult] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState({
    policyNumber: "",
    brokerid: "",
    clientName: "",
    contactNumber: "",
    emailId: "",
    state: "",
    registrationNumber: "",
    rmId: "",
    utrno: "",
    associateId: "",
    dateField: "",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BusinessEntry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdatingEntry, setIsUpdatingEntry] = useState(false);
  const [deletingEntry, setDeletingEntry] = useState<BusinessEntry | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingEntry, setIsDeletingEntry] = useState(false);
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds default
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

  const fetchEntries = async (filterParams?: Record<string, string>) => {
    const token = await getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      // Build query params from filters
      let url = `${API_BASE_URL}/v1/businessentry`;
      if (filterParams) {
        const params = new URLSearchParams();
        Object.entries(filterParams).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch entries');
      const entries = await response.json();
      setBusinessEntries(entries);
    } catch (error) {
      console.error("Failed to fetch business entries", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBrokerOptions = async () => {
    const token = await getToken();
    if (!token) return;

    setIsLoadingBrokers(true);
    try {
      const brokers = await getBrokerNames(token);
      setBrokerOptions(brokers.filter((broker) => !broker.isDeleted));
    } catch (error) {
      console.error("Failed to fetch broker names", error);
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : error.message;
        setErrorMessage(fullError);
      }
      setBrokerOptions([]);
    } finally {
      setIsLoadingBrokers(false);
    }
  };

  const fetchUsers = async () => {
    const token = await getToken();
    if (!token) return;

    setIsLoadingUsers(true);
    try {
      const [associates, rms] = await Promise.all([
        getAssociateUsers(token),
        getRMUsers(token)
      ]);
      setAllAssociates(associates);
      setAllRMs(rms);
      setAssociateOptions([]); // Initially empty until RM is selected
    } catch (error) {
      console.error("Failed to fetch users", error);
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : error.message;
        setErrorMessage(fullError);
      }
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const autoFillUserData = async () => {
    const token = await getToken();
    const session = getAuthSession();
    if (!token || !session?.user) return;

    const userRole = session.user.role;
    const userId = session.user._id;

    try {
      // If logged in as RM
      if (userRole === 'rm') {
        // Fetch user profile to get RM details
        const profile = await getUserProfile(token);
        if (profile.state) {
          // Auto-select state and fetch RMs
          const formattedState = profile.state.toUpperCase();
          setSelectedState(formattedState);
          await fetchRMsByState(formattedState);
          
          // Auto-select current RM
          setSelectedRmId(userId);
          setIsRmAutoFilled(true);
          
          // Fetch associates for this RM
          const associates = await getAssociateUsers(token, undefined, userId);
          setAssociateOptions(associates);
        }
      }
      // If logged in as Associate
      else if (userRole === 'associate') {
        // Fetch user profile to get associate details
        const profile = await getUserProfile(token);
        
        // If associate has createdBy field, that's the RM
        if (profile.createdBy && profile.state) {
          // Auto-select state
          const formattedState = profile.state.toUpperCase();
          setSelectedState(formattedState);
          await fetchRMsByState(formattedState);
          
          // Auto-select RM
          setSelectedRmId(profile.createdBy);
          setIsRmAutoFilled(true);
          
          // Fetch associates for this RM
          const associates = await getAssociateUsers(token, undefined, profile.createdBy);
          setAssociateOptions(associates);
          
          // Auto-select current associate
          setSelectedAssociateId(userId);
          setIsAssociateAutoFilled(true);
        }
      }
    } catch (error) {
      console.error("Failed to auto-fill user data", error);
    }
  };

  const fetchRMsByState = async (state: string) => {
    const token = await getToken();
    if (!token) return;

    setIsLoadingUsers(true);
    try {
      // Convert "TAMIL NADU" to "Tamil Nadu" format
      const formattedState = state
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const rms = await getRMUsers(token, undefined, formattedState);
      setRmOptions(rms);
    } catch (error) {
      console.error("Failed to fetch RMs for state", error);
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : error.message;
        setErrorMessage(fullError);
      }
      setRmOptions([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    const session = getAuthSession();
    if (session?.user?.role) {
      setUserRole(session.user.role);
    }
    fetchEntries();
    fetchBrokerOptions();
    fetchUsers();
    autoFillUserData();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      // Don't auto-refresh if any modal is open to avoid interrupting user
      if (!isEditModalOpen && !isDeleteModalOpen && !showBulkUpdateModal && !isFileDialogOpen) {
        fetchEntries();
        setLastRefreshTime(new Date());
      }
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, isEditModalOpen, isDeleteModalOpen, showBulkUpdateModal, isFileDialogOpen]);

  const handleManualRefresh = async () => {
    await fetchEntries();
    setLastRefreshTime(new Date());
  };

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setUploadError(null);
    setSelectedFile(null);
    setUploadedFile(null);

    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError("File exceeds the 10 MB limit.");
      event.target.value = "";
      return;
    }

    // Just store the file, don't upload yet
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
    
    // Auto-fill state from selected RM
    const selectedRm = allRMs.find(rm => rm._id === rmId);
    console.log('Selected RM:', selectedRm);
    console.log('RM State:', selectedRm?.state);
    
    if (selectedRm?.state) {
      // Convert state to match the format in stateOptions (UPPERCASE)
      const formattedState = selectedRm.state.toUpperCase();
      console.log('Setting state to:', formattedState);
      setSelectedState(formattedState);
    }
    
    const token = await getToken();
    if (!token) return;
    
    setIsLoadingUsers(true);
    try {
      // Fetch associates created by the selected RM
      const associates = await getAssociateUsers(token, undefined, rmId);
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

  const handleViewFile = async (fileUrl: string) => {
    const token = await getToken();
    if (!token) {
      setErrorMessage("You must be signed in to view files.");
      return;
    }
    
    setIsFileDialogOpen(true);
    setIsLoadingFile(true);
    setFileBlob(null);
    
    try {
      // Fetch file with authentication token
      const response = await fetch(`https://instapolicy.coverscrafter.com${fileUrl}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setFileBlob(blobUrl);
      setViewFileUrl(`https://instapolicy.coverscrafter.com${fileUrl}`);
    } catch (error) {
      console.error('Error fetching file:', error);
      setErrorMessage('Failed to load file. Please try again.');
      setIsFileDialogOpen(false);
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleCloseFileDialog = () => {
    setIsFileDialogOpen(false);
    setViewFileUrl(null);
    if (fileBlob) {
      URL.revokeObjectURL(fileBlob);
      setFileBlob(null);
    }
  };

  const handleBulkUpdateFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBulkUpdateFile(file);
      setBulkUpdateResult(null);
    }
  };

  const handleDownloadSample = () => {
    // Create sample Excel data with proper format
    const sampleData = [
      ['Policy Number', 'Payment Date', 'UTR Number', 'Status'],
      ['1234567', '24-11-2025', 'UTR1234567890', 'Paid'],
      ['7890123', '25-11-2025', 'UTR0987654321', 'Pending'],
    ];

    // Convert to CSV format with proper separators
    const csv = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payment_status_sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBulkUpdate = async () => {
    if (!bulkUpdateFile) {
      setErrorMessage('Please select a file to upload');
      return;
    }

    const token = await getToken();
    if (!token) {
      setErrorMessage('You must be signed in to update payment status');
      return;
    }

    setIsBulkUpdating(true);
    setErrorMessage(null);
    setBulkUpdateResult(null);

    try {
      // Read the file
      const text = await bulkUpdateFile.text();
      // Split by newlines and remove empty lines and carriage returns
      const lines = text.split(/\r?\n/).filter(line => line.trim());
      
      console.log('Total lines:', lines.length);
      console.log('First few lines:', lines.slice(0, 3));
      
      // Detect delimiter (comma or tab)
      const firstDataLine = lines[1] || '';
      const delimiter = firstDataLine.includes('\t') ? '\t' : ',';
      console.log('Detected delimiter:', delimiter === '\t' ? 'TAB' : 'COMMA');
      
      // Skip header row and parse data
      const updates = lines.slice(1).map((line, index) => {
        // Split by delimiter and trim each value, also remove quotes if present
        const values = line.split(delimiter).map(s => s.trim().replace(/^["']|["']$/g, ''));
        const [policyNumber, paymentdate, utrno, status] = values;
        
        console.log(`Row ${index + 1} raw values:`, values);
        console.log(`Row ${index + 1}:`, { policyNumber, paymentdate, utrno, status });
        
        // Parse and format date to YYYY-MM-DD if provided
        let formattedDate: string | undefined;
        if (paymentdate && paymentdate.trim()) {
          try {
            // Handle multiple date formats
            let date: Date;
            
            // Try DD-MM-YYYY format (e.g., 24-11-2025)
            if (/^\d{2}-\d{2}-\d{4}$/.test(paymentdate)) {
              const [day, month, year] = paymentdate.split('-');
              date = new Date(`${year}-${month}-${day}`);
            } 
            // Try MM/DD/YYYY format
            else if (/^\d{2}\/\d{2}\/\d{4}$/.test(paymentdate)) {
              date = new Date(paymentdate);
            }
            // Try YYYY-MM-DD format
            else if (/^\d{4}-\d{2}-\d{2}$/.test(paymentdate)) {
              date = new Date(paymentdate);
            }
            // Default parsing
            else {
              date = new Date(paymentdate);
            }
            
            if (!isNaN(date.getTime())) {
              // Format as YYYY-MM-DD
              formattedDate = date.toISOString().split('T')[0];
              console.log(`Date parsed: ${paymentdate} -> ${formattedDate}`);
            } else {
              console.error('Invalid date after parsing:', paymentdate);
            }
          } catch (e) {
            console.error('Invalid date format:', paymentdate, e);
          }
        }
        
        const updateData: {
          policyNumber: string;
          paymentdate?: string;
          utrno?: string;
          status?: string;
        } = {
          policyNumber: policyNumber?.trim() || '',
        };
        
        // Only add fields if they have values
        if (formattedDate) {
          updateData.paymentdate = formattedDate;
        }
        if (utrno && utrno.trim()) {
          updateData.utrno = utrno.trim();
        }
        if (status && status.trim()) {
          updateData.status = status.trim();
        }
        
        console.log('Parsed data:', updateData);
        return updateData;
      }).filter(u => u.policyNumber); // Filter out empty rows

      console.log('Total valid updates:', updates.length);
      console.log('Updates to send:', JSON.stringify(updates, null, 2));

      if (updates.length === 0) {
        setErrorMessage('No valid records found in the file');
        setIsBulkUpdating(false);
        return;
      }

      // Call bulk update API
      const result = await bulkUpdateBusinessEntries({ updates }, token);
      console.log('Bulk update result:', result);
      setBulkUpdateResult(result);
      setSuccessMessage(`Successfully updated ${result.successful} out of ${result.totalRecords} records`);
      
      // Refresh entries
      await fetchEntries();
      
      // Reset file input
      setBulkUpdateFile(null);
    } catch (error) {
      console.error('Bulk update failed:', error);
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : error.message;
        setErrorMessage(fullError);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Failed to update payment status');
      }
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const activeFilters: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) activeFilters[key] = value;
    });
    fetchEntries(activeFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      policyNumber: "",
      brokerid: "",
      clientName: "",
      contactNumber: "",
      emailId: "",
      state: "",
      registrationNumber: "",
      rmId: "",
      utrno: "",
      associateId: "",
      dateField: "",
      startDate: "",
      endDate: "",
    });
    fetchEntries();
  };

  const handleExport = async () => {
    const token = await getToken();
    if (!token) {
      setErrorMessage('You must be signed in to export data');
      return;
    }

    setIsExporting(true);
    setErrorMessage(null);

    try {
      // Build active filters
      const activeFilters: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) activeFilters[key] = value;
      });

      // Call export API
      const blob = await exportBusinessEntries(token, activeFilters);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `business-entries-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccessMessage('Business entries exported successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setErrorMessage('Failed to export business entries. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleEditEntry = (entry: BusinessEntry) => {
    setEditingEntry(entry);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingEntry(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteEntry = (entry: BusinessEntry) => {
    setDeletingEntry(entry);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeletingEntry(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingEntry) return;

    const token = await getToken();
    if (!token) {
      setErrorMessage('You must be signed in to delete business entry');
      return;
    }

    setIsDeletingEntry(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteBusinessEntry(deletingEntry._id, token);
      
      setSuccessMessage('Business entry deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Refresh entries list
      await fetchEntries();
      
      // Close modal
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Delete failed:', error);
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : error.message;
        setErrorMessage(fullError);
      } else {
        setErrorMessage('Failed to delete business entry. Please try again.');
      }
    } finally {
      setIsDeletingEntry(false);
    }
  };

  const handleUpdateEntry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingEntry) return;

    const token = await getToken();
    if (!token) {
      setErrorMessage('You must be signed in to update business entry');
      return;
    }

    setIsUpdatingEntry(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      
      const updatePayload: any = {};
      
      // Only include changed fields
      formData.forEach((value, key) => {
        if (value && value !== '') {
          updatePayload[key] = value;
        }
      });

      await updateBusinessEntry(editingEntry._id, updatePayload, token);
      
      setSuccessMessage('Business entry updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Refresh entries list
      await fetchEntries();
      
      // Close modal
      handleCloseEditModal();
    } catch (error) {
      console.error('Update failed:', error);
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : error.message;
        setErrorMessage(fullError);
      } else {
        setErrorMessage('Failed to update business entry. Please try again.');
      }
    } finally {
      setIsUpdatingEntry(false);
    }
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
    
    // Capture form element immediately before any async operations
    const form = event.currentTarget;
    if (!form) {
      setErrorMessage("Form element not found.");
      return;
    }
    
    setErrorMessage(null);
    setSuccessMessage(null);

    const token = await getToken();
    if (!token) {
      setErrorMessage("You must be signed in to create a business entry.");
      return;
    }

    // Check if file is selected
    if (!selectedFile) {
      setErrorMessage("Please select a policy document before saving.");
      return;
    }

    // Upload the file now
    setIsUploadingFile(true);
    let uploadResponse: UploadResponse;
    
    try {
      uploadResponse = await uploadDocument(selectedFile, token);
      setUploadedFile(uploadResponse);
    } catch (error) {
      console.error("Failed to upload file", error);
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : (error.message || "Unable to upload document. Please try again.");
        setErrorMessage(fullError);
      } else {
        setErrorMessage("Something went wrong while uploading. Please try again.");
      }
      setIsUploadingFile(false);
      return;
    } finally {
      setIsUploadingFile(false);
    }

    // Extract upload metadata
    const uploadMeta = extractUploadMeta(uploadResponse);
    if (!uploadMeta.id) {
      setErrorMessage("File upload failed. Please try again.");
      return;
    }

    // Extract values from form elements
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

    // Add isNewVehicle flag and registrationNumber conditionally
    payload.isNewVehicle = isNewVehicle;
    if (!isNewVehicle) {
      payload.registrationNumber = formElements.registrationNumber?.value || '';
    }

    // Add payin/payout fields if associate is selected and user is admin
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

    // Add cheque details if payment mode is Cheque
    if (paymentMode === "Cheque") {
      payload.chequeNumber = formElements.chequeNumber?.value || '';
      payload.chequeDate = formElements.chequeDate?.value || '';
    }

    payload.paymentMode = paymentMode;
    payload.payoutMode = payoutMode;
    
    // Add payment details if cut&pay is selected
    if (payoutMode === "cut&pay") {
      payload.status = "Paid";
      payload.utrno = "cut&pay";
      payload.paymentdate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
    }
    
    payload.odPremium = odPremium || "0";
    payload.tpPremium = tpPremium || "0";
    payload.netPremium = netPremium || "0";
    payload.grossPremium = grossPremium || "0";

    if (uploadMeta.id) {
      payload.policyFile = uploadMeta.id;
    } else {
      payload.policyFile = "";
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await createBusinessEntry(payload as any, token);
      
      // Reset form
      form.reset();
      setPaymentMode("Online");
      setPayoutMode("fullpay");
      setSelectedState("");
      setSelectedRmId("");
      setSelectedAssociateId("");
      setSelectedLineOfBusiness("");
      setSelectedProduct("");
      setOdPremium("");
      setTpPremium("");
      setNetPremium("");
      setGrossPremium("");
      setIsNewVehicle(false);
      setRmOptions([]);
      setAssociateOptions([]);
      setSelectedFile(null);
      setUploadedFile(null);
      setUploadError(null);
      setFileInputKey((previous) => previous + 1);
      
      // Refresh entries list
      await fetchEntries();
      
      setSuccessMessage("Business entry created successfully.");
      
      // Keep form open so user can see success message
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      if (error instanceof ApiError) {
        const fullError = error.serverMsg ? `${error.message}: ${error.serverMsg}` : (error.message || "Unable to create business entry. Please verify the details.");
        setErrorMessage(fullError);
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
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isLoading}
                className="rounded-lg px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
                title="Refresh now"
              >
                🔄 {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
              <div className="h-4 w-px bg-slate-300"></div>
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-slate-300"
                />
                Auto ({refreshInterval / 1000}s)
              </label>
            </div>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-100 disabled:opacity-50"
            >
              {isExporting ? 'Exporting...' : '📊 Export to Excel'}
            </button>
            {userRole !== 'rm' && userRole !== 'associate' && (
              <button
                type="button"
                onClick={() => setShowBulkUpdateModal(true)}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-600 shadow-sm transition hover:bg-emerald-100"
              >
                Import Payment Status
              </button>
            )}
            {userRole !== 'associate' && (
              <button
                type="button"
                onClick={() => setShowForm((prev) => !prev)}
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700"
                aria-expanded={showForm}
              >
                {showForm ? "Hide Business Entry" : "Create Business Entry"}
              </button>
            )}
          </div>
        </header>

        {showForm && userRole !== 'associate' && (
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
                  onChange={(e) => setSelectedLineOfBusiness(e.target.value)}
                  value={selectedLineOfBusiness}
                />
                <SelectField
                  id="product"
                  label="Product"
                  required
                  placeholder={!selectedLineOfBusiness ? "Select Line of Business first" : "--None--"}
                  options={(selectedLineOfBusiness ? productsByLineOfBusiness[selectedLineOfBusiness] || [] : []).map((option) => ({
                    label: option,
                    value: option,
                  }))}
                  disabled={!selectedLineOfBusiness}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  value={selectedProduct}
                />
                <SelectField
                  id="subProduct"
                  label="Sub Product"
                  required
                  placeholder="--None--"
                  options={(subProductByProduct[selectedProduct] || []).map((option) => ({
                    label: option,
                    value: option,
                  }))}
                />
                <div className="col-span-full">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Vehicle Type*</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="vehicleType"
                        value="existing"
                        checked={!isNewVehicle}
                        onChange={() => setIsNewVehicle(false)}
                        className="h-4 w-4 text-blue-600"
                        required
                      />
                      Existing Vehicle
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="vehicleType"
                        value="new"
                        checked={isNewVehicle}
                        onChange={() => setIsNewVehicle(true)}
                        className="h-4 w-4 text-blue-600"
                      />
                      New Vehicle
                    </label>
                  </div>
                </div>
                {!isNewVehicle && (
                  <TextField 
                    id="registrationNumber" 
                    label="Registration Number" 
                    placeholder="e.g., MH-47-BH-1645" 
                    required 
                    hint="Format: MH-47-BH-1645, MH-04-A-007, or 23BH9646G"
                  />
                )}
                <TextField id="policyIssueDate" label="Policy Issue Date" type="date" required />
                <TextField id="policyStartDate" label="Policy Start Date" type="date" required />
                <TextField id="policyEndDate" label="Policy End Date" type="date" required />
                <TextField id="policyTpEndDate" label="Policy TP End Date" type="date" required />
                <TextField 
                  id="odPremium" 
                  label="OD Premium" 
                  type="number" 
                  placeholder="0" 
                  required 
                  value={odPremium}
                  onChange={(e) => handleOdPremiumChange(e.target.value)}
                />
                <TextField 
                  id="tpPremium" 
                  label="TP Premium" 
                  type="number" 
                  placeholder="0" 
                  required 
                  value={tpPremium}
                  onChange={(e) => handleTpPremiumChange(e.target.value)}
                />
                <TextField 
                  id="netPremium" 
                  label="Net Premium" 
                  type="number" 
                  placeholder="0" 
                  required 
                  value={netPremium}
                  disabled
                />
                <TextField 
                  id="grossPremium" 
                  label="Gross Premium" 
                  type="number" 
                  placeholder="0" 
                  required 
                  value={grossPremium}
                  onChange={(e) => setGrossPremium(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <SelectField
                  id="rmId"
                  label="Relationship Manager"
                  required
                  placeholder={isLoadingUsers ? "Loading..." : "--Select RM--"}
                  options={allRMs.map((rm) => ({
                    label: `${rm.firstName} ${rm.lastName} (${rm.empCode})`,
                    value: rm._id,
                  }))}
                  onChange={(e) => handleRmChange(e.target.value)}
                  value={selectedRmId}
                  disabled={isRmAutoFilled}
                />
                <SelectField
                  id="rmState"
                  label="RM State"
                  required
                  placeholder="--Select RM first--"
                  options={stateOptions.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  disabled={isRmAutoFilled}
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
                  disabled={!selectedRmId || isAssociateAutoFilled}
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

              {selectedAssociateId && userRole !== 'rm' && userRole !== 'associate' && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <TextField id="odPremiumPayin" label="OD  Payin (%)" type="number" placeholder="0" min="0" max="100" required />
                <TextField id="tpPremiumPayin" label="TP  Payin (%)" type="number" placeholder="0" min="0" max="100" required />
                <TextField id="netPremiumPayin" label="Net  Payin (%)" type="number" placeholder="0" min="0" max="100" required />
                <TextField id="extraAmountPayin" label="Extra Amount Payin" type="number" placeholder="0" required />
                <TextField id="odPremiumPayout" label="OD  Payout (%)" type="number" placeholder="0" min="0" max="100" required />
                <TextField id="tpPremiumPayout" label="TP  Payout (%)" type="number" placeholder="0" min="0" max="100" required />
                <TextField id="netPremiumPayout" label="Net  Payout (%)" type="number" placeholder="0" min="0" max="100" required />
                <TextField id="extraAmountPayout" label="Extra Amount Payout" type="number" placeholder="0" required />
              </div>
              )}
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Payment Mode*</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="Online"
                        checked={paymentMode === "Online"}
                        onChange={() => setPaymentMode("Online")}
                        className="h-4 w-4 text-blue-600"
                        required
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
                
                <div>
                  <p className="text-sm font-semibold text-slate-700">Payout Mode*</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payoutMode"
                        value="fullpay"
                        checked={payoutMode === "fullpay"}
                        onChange={() => setPayoutMode("fullpay")}
                        className="h-4 w-4 text-blue-600"
                        required
                      />
                      Full Pay
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payoutMode"
                        value="cut&pay"
                        checked={payoutMode === "cut&pay"}
                        onChange={() => setPayoutMode("cut&pay")}
                        className="h-4 w-4 text-blue-600"
                      />
                      Cut & Pay
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paymentMode === "Cheque" && (
                  <>
                    <TextField id="chequeNumber" label="Cheque Number" placeholder="Enter cheque number" required />
                    <TextField id="chequeDate" label="Cheque Date" type="date" required />
                  </>
                )}
                
                {payoutMode === "cut&pay" && (
                  <>
                    <TextField 
                      id="utrno" 
                      label="UTR Number" 
                      placeholder="cut&pay" 
                      value="cut&pay"
                      disabled
                      required 
                    />
                    <div className="md:col-span-2 lg:col-span-1">
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Payment Status:</span> Paid<br />
                        <span className="font-semibold">Payment Date:</span> {new Date().toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FileUploadField
                  key={fileInputKey}
                  id="supportingFile"
                  name="supportingFile"
                  label="Policy Upload*"
                  hint="File will be uploaded when you submit the form (max 10 MB)."
                  onChange={handleFileChange}
                  disabled={isUploadingFile}
                  error={uploadError || undefined}
                />
                <div className="col-span-full space-y-2 text-xs text-slate-600">
                  {isUploadingFile && <p className="rounded-xl bg-slate-100 px-3 py-2 text-slate-500">Uploading document...</p>}
                  {selectedFile && !isUploadingFile && !uploadError && (
                    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
                      <span className="font-semibold">{selectedFile.name}</span>
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
              value={filters.policyNumber}
              onChange={(e) => handleFilterChange('policyNumber', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">⌕</span>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-full border px-4 py-2 transition ${
                showFilters ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
              }`}
            >
              🔍 Filters
            </button>
            <button
              onClick={handleApplyFilters}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-600 transition hover:bg-emerald-100"
            >
              Apply
            </button>
            <button
              onClick={handleClearFilters}
              className="rounded-full border border-slate-200 px-4 py-2 text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Advanced Filters</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-slate-700">Broker</label>
                <select
                  value={filters.brokerid}
                  onChange={(e) => handleFilterChange('brokerid', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All Brokers</option>
                  {brokerOptions.map(broker => (
                    <option key={broker._id} value={broker._id}>{broker.brokername}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Client Name</label>
                <input
                  type="text"
                  value={filters.clientName}
                  onChange={(e) => handleFilterChange('clientName', e.target.value)}
                  placeholder="Search client name"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Contact Number</label>
                <input
                  type="text"
                  value={filters.contactNumber}
                  onChange={(e) => handleFilterChange('contactNumber', e.target.value)}
                  placeholder="Contact number"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Email ID</label>
                <input
                  type="email"
                  value={filters.emailId}
                  onChange={(e) => handleFilterChange('emailId', e.target.value)}
                  placeholder="Email address"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">State</label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All States</option>
                  {stateOptions.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Registration Number</label>
                <input
                  type="text"
                  value={filters.registrationNumber}
                  onChange={(e) => handleFilterChange('registrationNumber', e.target.value)}
                  placeholder="Registration number"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Relationship Manager</label>
                <select
                  value={filters.rmId}
                  onChange={(e) => handleFilterChange('rmId', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All RMs</option>
                  {allRMs.map(rm => (
                    <option key={rm._id} value={rm._id}>{`${rm.firstName} ${rm.lastName} (${rm.empCode})`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Associate</label>
                <select
                  value={filters.associateId}
                  onChange={(e) => handleFilterChange('associateId', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All Associates</option>
                  {allAssociates.map(assoc => (
                    <option key={assoc._id} value={assoc._id}>{`${assoc.name} (${assoc.associateCode})`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">UTR Number</label>
                <input
                  type="text"
                  value={filters.utrno}
                  onChange={(e) => handleFilterChange('utrno', e.target.value)}
                  placeholder="UTR number"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Date Field</label>
                <select
                  value={filters.dateField}
                  onChange={(e) => handleFilterChange('dateField', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Date Field</option>
                  <option value="policyIssueDate">Policy Issue Date</option>
                  <option value="policyStartDate">Policy Start Date</option>
                  <option value="policyEndDate">Policy End Date</option>
                  <option value="policyTpEndDate">Policy TP End Date</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  disabled={!filters.dateField}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  disabled={!filters.dateField}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>
            </div>
          </div>
        )}
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
            <table className="min-w-[2000px] border-collapse text-left text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Policy Number</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Registration Number</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Client Name</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Contact Number</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Email</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">State</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Insurance Company</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Broker</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Line of Business</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Product</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Sub Product</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Policy Issue Date</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Policy Start Date</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Policy End Date</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Policy TP End Date</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">OD Premium</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">TP Premium</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Net Premium</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Gross Premium</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">RM State</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">RM</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Associate</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Reporting FY</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Reporting Month</th>
                  {userRole !== 'rm' && userRole !== 'associate' && (
                  <>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">OD  Payin</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">TP  Payin</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Net  Payin</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Extra Amount Payin</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">OD  Payout</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">TP  Payout</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Net  Payout</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Extra Amount Payout</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Total Payin</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Total Payout</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Net Revenue</th>
                  </>
                  )}
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Payment Mode</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Cheque Number</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Payment Status</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">UTR Number</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Payment Date</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Policy File</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Created By</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Created At</th>
                  <th className="border border-slate-300 px-4 py-3 font-semibold text-slate-700 bg-slate-50">Actions</th>
                </tr>
              </thead>
              <tbody>
                {businessEntries.map((entry) => {
                  const broker = brokerOptions.find(b => b._id === entry.brokerid);
                  const rmName = entry.rmData 
                    ? `${entry.rmData.firstName || ''} ${entry.rmData.middleName || ''} ${entry.rmData.lastName || ''}`.trim()
                    : '';
                  const associateName = entry.associateData?.contactPerson || '';
                  const createdByEmail = (entry as any).createdByData?.email || '';
                  
                  return (
                  <tr key={entry._id} className="transition hover:bg-blue-50/40">
                    <td className="border border-slate-300 px-4 py-3 bg-white">
                      <span className="font-semibold text-slate-900">{entry.policyNumber || ''}</span>
                    </td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-xs uppercase tracking-wide text-slate-600">{entry.registrationNumber || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.clientName || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.contactNumber || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.emailId || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.state || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.insuranceCompany || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{broker?.brokername || entry.brokerData?.brokername || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.lineOfBusiness || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.product || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.subProduct || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.policyIssueDate ? new Date(entry.policyIssueDate).toLocaleDateString() : ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.policyStartDate ? new Date(entry.policyStartDate).toLocaleDateString() : ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.policyEndDate ? new Date(entry.policyEndDate).toLocaleDateString() : ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.policyTpEndDate ? new Date(entry.policyTpEndDate).toLocaleDateString() : ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.odPremium || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.tpPremium || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.netPremium || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.grossPremium || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.rmState || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{rmName}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{associateName}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.reportingFy || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.reportingMonth || ''}</td>
                    {userRole !== 'rm' && userRole !== 'associate' && (
                    <>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.odPremiumPayinAmt || entry.odPremiumPayin || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.tpPremiumPayinAmt || entry.tpPremiumPayin || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.netPremiumPayinAmt || entry.netPremiumPayin || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.extraAmountPayinAmt || entry.extraAmountPayin || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.odPremiumPayoutAmt || entry.odPremiumPayout || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.tpPremiumPayoutAmt || entry.tpPremiumPayout || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.netPremiumPayoutAmt || entry.netPremiumPayout || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.extraAmountPayoutAmt || entry.extraAmountPayout || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.totalPayin ? `₹${Number(entry.totalPayin).toLocaleString()}` : ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.totalPayout ? `₹${Number(entry.totalPayout).toLocaleString()}` : ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.netRevenue ? `₹${Number(entry.netRevenue).toLocaleString()}` : ''}</td>
                    </>
                    )}
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.paymentMode || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.chequeNumber || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        entry.status === 'completed' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : entry.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {entry.status || 'pending'}
                      </span>
                    </td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.utrno || ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.paymentdate ? new Date(entry.paymentdate).toLocaleDateString() : ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">
                      {entry.policyFileUrl ? (
                        <button
                          onClick={() => handleViewFile(entry.policyFileUrl!)}
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          View
                        </button>
                      ) : ''}
                    </td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{createdByEmail}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white text-slate-600">{entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : ''}</td>
                    <td className="border border-slate-300 px-4 py-3 bg-white">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry)}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* File Viewer Dialog */}
      {isFileDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0">
              <h3 className="text-lg font-semibold text-slate-900">Policy Document</h3>
              <button
                onClick={handleCloseFileDialog}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {isLoadingFile ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="mt-4 text-sm text-slate-600">Loading file...</p>
                  </div>
                </div>
              ) : fileBlob ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-700">File URL:</p>
                    <p className="mt-1 break-all text-xs text-slate-600">{viewFileUrl}</p>
                    <p className="mt-2 text-xs text-emerald-600">✓ Authenticated with Bearer token</p>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={fileBlob}
                      download
                      className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700"
                    >
                      Download File
                    </a>
                    <button
                      onClick={() => {
                        if (viewFileUrl) {
                          navigator.clipboard.writeText(viewFileUrl);
                          alert('URL copied to clipboard!');
                        }
                      }}
                      className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Copy URL
                    </button>
                  </div>
                  <div className="h-[500px] overflow-hidden rounded-lg border border-slate-200">
                    <iframe
                      src={fileBlob}
                      className="h-full w-full"
                      title="Policy Document"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-center text-slate-500">No file to display</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Update Modal */}
      {showBulkUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0">
              <h2 className="text-xl font-semibold text-slate-900">Import Payment Status</h2>
              <button
                onClick={() => {
                  setShowBulkUpdateModal(false);
                  setBulkUpdateFile(null);
                  setBulkUpdateResult(null);
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              <div className="space-y-6">
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-900">Instructions:</p>
                  <ul className="mt-2 space-y-1 text-sm text-blue-700">
                    <li>• Download the sample file to see the required format</li>
                    <li>• Fill in Policy Number, Payment Date, UTR Number, and Status</li>
                    <li>• Upload the completed CSV/Excel file</li>
                    <li>• The system will update matching policy numbers</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadSample}
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    📥 Download Sample File
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Upload File</label>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleBulkUpdateFileChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  {bulkUpdateFile && (
                    <p className="mt-2 text-sm text-emerald-600">✓ Selected: {bulkUpdateFile.name}</p>
                  )}
                </div>

                {bulkUpdateResult && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-900">Update Results:</h3>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-blue-100 p-3">
                        <p className="text-xs text-blue-700">Total Records</p>
                        <p className="text-xl font-bold text-blue-900">{bulkUpdateResult.totalRecords}</p>
                      </div>
                      <div className="rounded-lg bg-emerald-100 p-3">
                        <p className="text-xs text-emerald-700">Successful</p>
                        <p className="text-xl font-bold text-emerald-900">{bulkUpdateResult.successful}</p>
                      </div>
                      <div className="rounded-lg bg-rose-100 p-3">
                        <p className="text-xs text-rose-700">Failed</p>
                        <p className="text-xl font-bold text-rose-900">{bulkUpdateResult.failed}</p>
                      </div>
                      <div className="rounded-lg bg-amber-100 p-3">
                        <p className="text-xs text-amber-700">Processed</p>
                        <p className="text-xl font-bold text-amber-900">{bulkUpdateResult.processed}</p>
                      </div>
                    </div>
                    {bulkUpdateResult.results && bulkUpdateResult.results.length > 0 && (
                      <div className="mt-4 max-h-40 overflow-y-auto">
                        <p className="text-xs font-semibold text-slate-700">Detailed Results:</p>
                        <div className="mt-2 space-y-1">
                          {bulkUpdateResult.results.map((result: any, index: number) => (
                            <div
                              key={index}
                              className={`rounded px-2 py-1 text-xs ${
                                result.status === 'success'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              <span className="font-semibold">{result.policyNumber}:</span> {result.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowBulkUpdateModal(false);
                  setBulkUpdateFile(null);
                  setBulkUpdateResult(null);
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleBulkUpdate}
                disabled={!bulkUpdateFile || isBulkUpdating}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isBulkUpdating ? 'Updating...' : 'Update Payment Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0">
              <h2 className="text-xl font-semibold text-slate-900">Edit Business Entry</h2>
              <button
                onClick={handleCloseEditModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              <form onSubmit={handleUpdateEntry} className="space-y-6">
                {/* Warning message if payment is completed */}
                {editingEntry.status === 'Paid' && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      <span className="font-semibold">Payment Completed - Editing Disabled</span>
                    </div>
                    <p className="mt-1 text-amber-700">This entry cannot be edited because the payment status is marked as "Paid".</p>
                  </div>
                )}

                {/* Broker & Insurance Details */}
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                  <h3 className="mb-4 text-sm font-semibold text-slate-900">Policy Information</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <SelectField
                      id="brokerid"
                      name="brokerid"
                      label="Broker Name"
                      placeholder="--Select Broker--"
                      options={brokerOptions.map((broker) => ({
                        label: broker.brokername,
                        value: broker._id,
                      }))}
                      defaultValue={editingEntry.brokerid}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <SelectField
                      id="insuranceCompany"
                      name="insuranceCompany"
                      label="Insurance Company"
                      placeholder="--None--"
                      options={insuranceCompanies.map((option) => ({
                        label: option,
                        value: option,
                      }))}
                      defaultValue={editingEntry.insuranceCompany}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <TextField 
                      id="policyNumber"
                      name="policyNumber"
                      label="Policy Number" 
                      placeholder="Policy Number"
                      defaultValue={editingEntry.policyNumber}
                      disabled={editingEntry.status === 'Paid'}
                    />
                  </div>
                </div>

                {/* Client Details */}
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                  <h3 className="mb-4 text-sm font-semibold text-slate-900">Client Details</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <TextField 
                      id="clientName"
                      name="clientName"
                      label="Client Name" 
                      placeholder="Client Name"
                      defaultValue={editingEntry.clientName}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <TextField 
                      id="contactNumber"
                      name="contactNumber"
                      label="Contact Number" 
                      type="tel" 
                      placeholder="Contact Number"
                      defaultValue={editingEntry.contactNumber}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <TextField 
                      id="emailId"
                      name="emailId"
                      label="Email ID" 
                      type="email" 
                      placeholder="email id"
                      defaultValue={editingEntry.emailId}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <SelectField
                      id="state"
                      name="state"
                      label="State"
                      placeholder="--None--"
                      options={stateOptions.map((option) => ({
                        label: option,
                        value: option,
                      }))}
                      defaultValue={editingEntry.state}
                      disabled={editingEntry.status === 'Paid'}
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                  <h3 className="mb-4 text-sm font-semibold text-slate-900">Product & Policy Details</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SelectField
                      id="lineOfBusiness"
                      name="lineOfBusiness"
                      label="Line of Business"
                      placeholder="--None--"
                      options={lineOfBusinessOptions.map((option) => ({
                        label: option,
                        value: option,
                      }))}
                      defaultValue={editingEntry.lineOfBusiness}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <TextField 
                      id="product"
                      name="product"
                      label="Product" 
                      placeholder="Product"
                      defaultValue={editingEntry.product}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <TextField 
                      id="subProduct"
                      name="subProduct"
                      label="Sub Product" 
                      placeholder="Sub Product"
                      defaultValue={editingEntry.subProduct}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <TextField 
                      id="registrationNumber"
                      name="registrationNumber"
                      label="Registration Number" 
                      placeholder="Registration Number"
                      defaultValue={editingEntry.registrationNumber}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <TextField 
                      id="policyIssueDate"
                      name="policyIssueDate"
                      label="Policy Issue Date" 
                      type="date"
                      defaultValue={editingEntry.policyIssueDate ? new Date(editingEntry.policyIssueDate).toISOString().split('T')[0] : ''}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <TextField 
                      id="policyStartDate"
                      name="policyStartDate"
                      label="Policy Start Date" 
                      type="date"
                      defaultValue={editingEntry.policyStartDate ? new Date(editingEntry.policyStartDate).toISOString().split('T')[0] : ''}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <TextField 
                      id="policyEndDate"
                      name="policyEndDate"
                      label="Policy End Date" 
                      type="date"
                      defaultValue={editingEntry.policyEndDate ? new Date(editingEntry.policyEndDate).toISOString().split('T')[0] : ''}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <TextField 
                      id="policyTpEndDate"
                      name="policyTpEndDate"
                      label="Policy TP End Date" 
                      type="date"
                      defaultValue={editingEntry.policyTpEndDate ? new Date(editingEntry.policyTpEndDate).toISOString().split('T')[0] : ''}
                      disabled={editingEntry.status === 'Paid'}
                    />
                  </div>
                </div>

                {/* Premium Details */}
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                  <h3 className="mb-4 text-sm font-semibold text-slate-900">Premium Details</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <TextField 
                      id="odPremium"
                      name="odPremium"
                      label="OD Premium" 
                      type="number" 
                      placeholder="0"
                      defaultValue={editingEntry.odPremium}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <TextField 
                      id="tpPremium"
                      name="tpPremium"
                      label="TP Premium" 
                      type="number" 
                      placeholder="0"
                      defaultValue={editingEntry.tpPremium}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <TextField 
                      id="netPremium"
                      name="netPremium"
                      label="Net Premium" 
                      type="number" 
                      placeholder="0"
                      defaultValue={editingEntry.netPremium}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <TextField 
                      id="grossPremium"
                      name="grossPremium"
                      label="Gross Premium" 
                      type="number" 
                      placeholder="0"
                      defaultValue={editingEntry.grossPremium}
                      disabled={editingEntry.status === 'Paid'}
                    />
                  </div>
                </div>

                {/* RM & Associate Details */}
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                  <h3 className="mb-4 text-sm font-semibold text-slate-900">Team Assignment</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <SelectField
                      id="rmId"
                      name="rmId"
                      label="Relationship Manager"
                      placeholder="--Select RM--"
                      options={allRMs.map((rm) => ({
                        label: `${rm.firstName} ${rm.lastName} (${rm.empCode})`,
                        value: rm._id,
                      }))}
                      defaultValue={editingEntry.rmId}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <SelectField
                      id="rmState"
                      name="rmState"
                      label="RM State"
                      placeholder="--None--"
                      options={stateOptions.map((option) => ({
                        label: option,
                        value: option,
                      }))}
                      defaultValue={editingEntry.rmState}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <SelectField
                      id="associateId"
                      name="associateId"
                      label="Associate"
                      placeholder="--Select Associate--"
                      options={allAssociates.map((assoc) => ({
                        label: `${assoc.name} (${assoc.associateCode})`,
                        value: assoc._id,
                      }))}
                      defaultValue={editingEntry.associateId}
                      disabled={editingEntry.status === 'Paid'}
                    />
                  </div>
                </div>

                {/* Reporting Details */}
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                  <h3 className="mb-4 text-sm font-semibold text-slate-900">Reporting Period</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <SelectField
                      id="reportingFy"
                      name="reportingFy"
                      label="Reporting FY"
                      placeholder="--None--"
                      options={reportingFyOptions.map((option) => ({
                        label: option,
                        value: option,
                      }))}
                      defaultValue={editingEntry.reportingFy}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <SelectField
                      id="reportingMonth"
                      name="reportingMonth"
                      label="Reporting Month"
                      placeholder="--None--"
                      options={reportingMonthOptions.map((option) => ({
                        label: option,
                        value: option,
                      }))}
                      defaultValue={editingEntry.reportingMonth}
                      disabled={editingEntry.status === 'Paid'}
                    />
                  </div>
                </div>

                {/* Payin/Payout Details - Only show for admin users when associate is selected */}
                {editingEntry.associateId && userRole !== 'rm' && userRole !== 'associate' && (
                  <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                    <h3 className="mb-4 text-sm font-semibold text-slate-900">Commission Structure</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <TextField 
                        id="odPremiumPayin" 
                        name="odPremiumPayin"
                        label="OD Payin (%)" 
                        type="number" 
                        placeholder="0" 
                        min="0" 
                        max="100"
                        defaultValue={editingEntry.odPremiumPayin}
                        disabled={editingEntry.status === 'Paid'}
                      />
                      <TextField 
                        id="tpPremiumPayin" 
                        name="tpPremiumPayin"
                        label="TP Payin (%)" 
                        type="number" 
                        placeholder="0" 
                        min="0" 
                        max="100"
                        defaultValue={editingEntry.tpPremiumPayin}
                        disabled={editingEntry.status === 'Paid'}
                      />
                      <TextField 
                        id="netPremiumPayin" 
                        name="netPremiumPayin"
                        label="Net Payin (%)" 
                        type="number" 
                        placeholder="0" 
                        min="0" 
                        max="100"
                        defaultValue={editingEntry.netPremiumPayin}
                        disabled={editingEntry.status === 'Paid'}
                      />
                      <TextField 
                        id="extraAmountPayin" 
                        name="extraAmountPayin"
                        label="Extra Amount Payin" 
                        type="number" 
                        placeholder="0"
                        defaultValue={editingEntry.extraAmountPayin}
                        disabled={editingEntry.status === 'Paid'}
                      />
                      <TextField 
                        id="odPremiumPayout" 
                        name="odPremiumPayout"
                        label="OD Payout (%)" 
                        type="number" 
                        placeholder="0" 
                        min="0" 
                        max="100"
                        defaultValue={editingEntry.odPremiumPayout}
                        disabled={editingEntry.status === 'Paid'}
                      />
                      <TextField 
                        id="tpPremiumPayout" 
                        name="tpPremiumPayout"
                        label="TP Payout (%)" 
                        type="number" 
                        placeholder="0" 
                        min="0" 
                        max="100"
                        defaultValue={editingEntry.tpPremiumPayout}
                        disabled={editingEntry.status === 'Paid'}
                      />
                      <TextField 
                        id="netPremiumPayout" 
                        name="netPremiumPayout"
                        label="Net Payout (%)" 
                        type="number" 
                        placeholder="0" 
                        min="0" 
                        max="100"
                        defaultValue={editingEntry.netPremiumPayout}
                        disabled={editingEntry.status === 'Paid'}
                      />
                      <TextField 
                        id="extraAmountPayout" 
                        name="extraAmountPayout"
                        label="Extra Amount Payout" 
                        type="number" 
                        placeholder="0"
                        defaultValue={editingEntry.extraAmountPayout}
                        disabled={editingEntry.status === 'Paid'}
                      />
                    </div>
                  </div>
                )}

                {/* Payment Details */}
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                  <h3 className="mb-4 text-sm font-semibold text-slate-900">Payment Details</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <TextField 
                      id="utrno"
                      name="utrno"
                      label="UTR Number" 
                      placeholder="UTR Number"
                      defaultValue={editingEntry.utrno}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <TextField 
                      id="paymentdate"
                      name="paymentdate"
                      label="Payment Date" 
                      type="date"
                      defaultValue={editingEntry.paymentdate ? new Date(editingEntry.paymentdate).toISOString().split('T')[0] : ''}
                      disabled={editingEntry.status === 'Paid'}
                    />
                    <SelectField
                      id="status"
                      name="status"
                      label="Payment Status"
                      placeholder="--None--"
                      options={[
                        { label: 'Paid', value: 'Paid' },
                        { label: 'Pending', value: 'Pending' },
                      ]}
                      defaultValue={editingEntry.status}
                      disabled={editingEntry.status === 'Paid'}
                    />
                  </div>
                </div>

                {(errorMessage || successMessage) && (
                  <div className={`rounded-xl p-4 text-sm ${
                    errorMessage ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}>
                    {errorMessage || successMessage}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {editingEntry.status === 'Paid' ? 'Close' : 'Cancel'}
                  </button>
                  {editingEntry.status !== 'Paid' && (
                    <button
                      type="submit"
                      disabled={isUpdatingEntry}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isUpdatingEntry ? 'Updating...' : 'Update Entry'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-red-100 p-2">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Delete Business Entry</h3>
                  <p className="text-sm text-slate-500">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6 rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-700">
                  Are you sure you want to delete this business entry?
                </p>
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <p><strong>Policy Number:</strong> {deletingEntry.policyNumber}</p>
                  <p><strong>Client Name:</strong> {deletingEntry.clientName}</p>
                  <p><strong>Insurance Company:</strong> {deletingEntry.insuranceCompany}</p>
                </div>
              </div>

              {errorMessage && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  disabled={isDeletingEntry}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeletingEntry}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeletingEntry ? 'Deleting...' : 'Delete Entry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

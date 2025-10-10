import { DetailJob, JobDetails } from "@/types/job";

// Mock job detail data - in a real app this would come from an API
export const MOCK_JOB_DETAIL: DetailJob = {
  id: "1",
  clientFirstName: "",
  clientLastName: "",
  clientTitle: "",
  clientOrganization: "",
  clientAddress: "",
  clientPhone: "",
  clientEmail: "",
  propertyName: "",
  propertyAddress: "",
  propertyType: "",
  intendedUse: "",
  assetCondition: "",
  notes: "",
  jobNumber: "CAL250080 - Parkview Apartments, 15-Unit MF 12945 101 St Edmonton AB",
  status: "submitted",
  createdAt: new Date("2023-03-04").toISOString(),
  files: [
    {
      id: "1",
      fileName: "Floor Plan.pdf",
      filePath: "/storage/job_documents/1/floor_plan.pdf",
      fileType: "application/pdf",
      fileSize: 1024000,
    },
    {
      id: "2",
      fileName: "Property Photos.zip",
      filePath: "/storage/job_documents/1/photos.zip",
      fileType: "application/zip",
      fileSize: 5240000,
    },
  ],
};

// Mock job details data
export const MOCK_JOB_DETAILS: JobDetails = {
  // Section 2: LOE Quote Preparation
  propertyRightsAppraised: null,
  valuationPremises: null,
  scopeOfWork: null,
  reportType: null,
  paymentTerms: null,
  appraisalFee: null,
  disbursementPercentage: null,
  retainerAmount: null,
  
  // Section 3A: Organizing Client Docs
  yearBuilt: null,
  buildingSize: null,
  numberOfUnits: null,
  
  // Section 3B: Pulling Property Info
  zoningClassification: null,
  zoneAbbreviation: null,
  landUseDesignation: null,
};

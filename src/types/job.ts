
export type JobStatus = 
  | "submitted" 
  | "in_progress" 
  | "loe_pending"
  | "loe_sent"
  | "loe_signed"
  | "contract_generated"
  | "paid"
  | "active" 
  | "completed";

export interface JobFile {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  file?: File; // Added optional file property for uploads
}

export interface JobSubmission {
  id: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  clientTitle?: string;
  clientOrganization?: string;
  clientAddress?: string;
  propertyAddress: string;
  propertyName?: string;
  propertyType?: string; // Legacy single-select (keep for backwards compatibility)
  propertyTypes?: string[]; // New multi-select array
  intendedUse?: string;
  assetCondition?: string;
  notes?: string;
  // Property Contact fields
  propertyContactFirstName?: string;
  propertyContactLastName?: string;
  propertyContactEmail?: string;
  propertyContactPhone?: string;
  sameAsClientContact?: boolean;
  status: JobStatus;
  createdAt: string;
  jobNumber?: string;
  clickupTaskId?: string; // ClickUp task ID for this job
  clickupTaskUrl?: string; // Direct link to ClickUp task
  files?: JobFile[]; // Files property for uploads
}

export interface DetailJob extends JobSubmission {
  files?: JobFile[];
  clickup_task_id?: string; // Database naming convention
  clickup_task_url?: string; // Database naming convention
}

export interface JobDetails {
  // Section 2: LOE Quote Preparation
  jobNumber?: string;
  valcreJobId?: string; // Changed to string to handle PENDING values
  valcre_job_id?: string; // Alternative naming for database field
  docusealSubmissionId?: string; // DocuSeal submission ID
  docuseal_submission_id?: string; // Alternative naming for database field
  propertyRightsAppraised?: string;
  valuationPremises?: string;
  deliveryDate?: string;
  scopeOfWork?: string;
  specialInstructions?: string;
  reportType?: string;
  paymentTerms?: string;
  appraisalFee?: number;
  retainerAmount?: string;
  disbursementPercentage?: string;
  internalComments?: string;
  
  // Section 3A: Organizing Client Docs
  yearBuilt?: string;
  buildingSize?: string;
  legalDescription?: string;
  numberOfUnits?: number;
  parkingSpaces?: number;
  
  // Section 3B: Pulling Property Info - Research
  zoningClassification?: string;
  zoneAbbreviation?: string;
  landUseDesignation?: string;
  floodZone?: string;
  utilities?: string;
  parcelNumber?: string;
  usableLandSf?: number;
  usableLandAcres?: number;
  grossLandSf?: number;
  grossLandAcres?: number;
  assessedValue?: number;
  taxes?: number;
  assessmentYear?: string;
  landAssessmentValue?: number;
  improvedAssessmentValue?: number;
  totalAssessmentValue?: number;
}

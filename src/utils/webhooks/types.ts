
// Common webhook data types
export interface WebhookData {
  jobId: string;
  supabaseId: string; // Add this field
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    title?: string;
    organization?: string;
    address?: string;
  };
  propertyInfo: {
    name?: string;
    address: string;
    type: string;
    intendedUse?: string;
    assetCondition?: string;
    notes?: string;
  };
  files: {
    name: string;
    type: string;
    size: number;
    path: string;
  }[];
  timestamp?: string;
}

export interface ValcreWebhookData {
  jobId: string;
  action: 'send_to_valcre';
  formData: {
    clientName: string;
    propertyAddress: string;
    clientEmail: string;
    clientPhone: string;
    organizationName?: string;
    propertyType?: string;
    intendedUse?: string;
    [key: string]: any;
  };
  timestamp?: string;
}

export interface PandadocWebhookData {
  jobId: string;
  action: 'send_to_pandadoc';
  formData: {
    clientName: string;
    propertyAddress: string;
    clientEmail: string;
    clientPhone: string;
    organizationName?: string;
    propertyType?: string;
    intendedUse?: string;
    assetCondition?: string;
    notes?: string;
    [key: string]: any;
  };
  timestamp?: string;
}

export interface ContractWebhookData {
  jobId: string;
  action: 'generate_contract';
  loeData: {
    jobNumber: string;
    propertyRightsAppraised: string;
    valuationPremises: string;
    deliveryDate: string;
    scopeOfWork: string;
    specialInstructions?: string;
    reportType: string;
    paymentTerms: string;
    appraisalFee: number;
    retainerAmount: string;
    disbursementPercentage: string;
    [key: string]: any;
  };
  timestamp?: string;
}

export interface FinalDataWebhookData {
  jobId: string;
  action: 'send_final_data';
  jobNumber: string;
  completeData: {
    // ALL job details from all sections
    [key: string]: any;
  };
  timestamp?: string;
}

export interface GoogleFolderData {
  jobId: string;
  jobNumber: string;
  clientName: string;
  propertyAddress: string;
  timestamp?: string;
}

export interface UpdateJobStatusData {
  jobId: string;
  status: string;
  jobNumber?: string;
  timestamp?: string;
}

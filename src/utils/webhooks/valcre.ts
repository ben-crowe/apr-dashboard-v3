import { ValcreWebhookData, FinalDataWebhookData, PandadocWebhookData } from './types';
import { createClickUpTask, updateClickUpWithValcreJob } from './clickup';
import { supabase } from '@/integrations/supabase/client';

// Field mapping for Valcre sync - prevents silent failures when field names differ
const VALCRE_FIELD_MAP: Record<string, string> = {
  notes: 'clientComments', // Our internal 'notes' maps to Valcre's 'clientComments'
  // Add other field mappings as needed
};

// Helper function to map intended use values
function mapIntendedUse(value: string): string {
  const mapping: Record<string, string> = {
    'Purchase': 'Acquisition/Disposition',
    'Sale': 'Acquisition/Disposition',
    'Financing': 'Financing',
    'Refinancing': 'Financing',
    'Insurance': 'Financing',  // Changed from invalid 'Financial Reporting'
    'Tax Appeal': 'Dispute Resolution',
    'Estate Planning': 'Estate Planning',
    'Internal': 'Decision-Making/Internal',
    'Legal': 'Litigation',
    'Financing/Refinancing': 'Financing',  // Handle combined value
    'Acquisition': 'Acquisition/Disposition',
    'Disposition': 'Acquisition/Disposition',
    'Litigation': 'Litigation'
  };
  return mapping[value] || 'Financing';
}

// Helper function to parse city and province from address
function parseAddress(address: string): { street: string; city: string; province: string } {
  // Default values for Alberta
  let result = {
    street: address,
    city: 'Calgary',
    province: 'AB'
  };

  // Try to parse the address
  // Format expected: "123 Main St, Calgary, AB T2P 1A1" or "123 Main St Calgary AB"
  const parts = address.split(',').map(s => s.trim());

  if (parts.length >= 2) {
    result.street = parts[0];

    // Check if last part contains province and postal code
    const lastPart = parts[parts.length - 1];
    const provinceMatch = lastPart.match(/\b(AB|BC|SK|MB|ON|QC|NB|NS|PE|NL|YT|NT|NU)\b/i);

    if (provinceMatch) {
      result.province = provinceMatch[1].toUpperCase();
      // The part before the province is the city
      if (parts.length === 3) {
        result.city = parts[1];
      } else if (parts.length === 2) {
        // Extract city from the last part (before province)
        const cityPart = lastPart.substring(0, provinceMatch.index).trim();
        if (cityPart) result.city = cityPart;
      }
    } else if (parts.length >= 2) {
      // No province found, assume second part is city
      result.city = parts[1];
    }
  }

  return result;
}

// Function to send data to Valcre via Vercel serverless function
export const sendToValcre = async (data: ValcreWebhookData): Promise<{success: boolean; jobNumber?: string; jobId?: number; error?: string}> => {
  try {
    console.log('Sending data to Valcre:', data);

    // Handle different data structures - UI sends flat structure, form sends nested formData
    const formData = data.formData || data; // Support both structures

    // Check if this is a sync operation (updating existing job) vs. initial creation
    const isSyncOperation = data.updateType === 'loe_details' && data.jobId;

    // For sync operations, we don't need client/property parsing - just update LOE fields
    if (isSyncOperation) {
      console.log('🔄 LOE Sync Operation detected - updating existing Valcre job:', data.jobNumber);

      // Build minimal payload for LOE updates only
      const syncPayload: any = {
        jobId: data.jobId,
        jobNumber: data.jobNumber,
        updateType: 'loe_details'
      };

      // Add only the LOE fields that can be updated
      if (formData.appraisalFee !== undefined) syncPayload.AppraisalFee = formData.appraisalFee;
      if (formData.retainerAmount) {
        // Parse retainerAmount - remove $ and convert to number
        const cleanRetainer = String(formData.retainerAmount).replace(/[$,]/g, '');
        syncPayload.Retainer = parseFloat(cleanRetainer) || 0;
      }
      if (formData.deliveryDate) syncPayload.DeliveryDate = formData.deliveryDate;
      if (formData.paymentTerms) syncPayload.PaymentTerms = formData.paymentTerms;
      if (formData.intendedUse) syncPayload.intendedUse = formData.intendedUse;
      if (formData.scopeOfWork) syncPayload.ScopeOfWork = formData.scopeOfWork;
      if (formData.valuationPremises) syncPayload.valuationPremises = formData.valuationPremises;
      if (formData.propertyRightsAppraised) syncPayload.propertyRightsAppraised = formData.propertyRightsAppraised;
      if (formData.reportType) syncPayload.reportType = formData.reportType;
      
      // Handle property types (convert array to comma-separated string for Valcre)
      if (formData.propertyTypes && formData.propertyTypes.length > 0) {
        syncPayload.PropertyType = formData.propertyTypes.join(', ');
        syncPayload.PropertyTypeEnum = formData.propertyTypes.join(', ');
      }
      
      // Handle property name updates
      if (formData.propertyName) {
        syncPayload.Name = formData.propertyName;
      }

      // Map comments to separate fields (matching job creation path)
      // Client comments go to ClientComments field (client-visible in Valcre)
      if (formData.notes || formData.clientComments) {
        syncPayload.ClientComments = formData.clientComments || formData.notes || '';
      }
      
      // Appraiser comments go to Comments field (general/internal comments in Valcre)
      if (formData.appraiserComments) {
        syncPayload.InternalComments = formData.appraiserComments;
      }

      // Delivery and Payment comments (new custom Valcre fields)
      if (formData.deliveryComments) {
        syncPayload.deliveryComments = formData.deliveryComments;
      }
      if (formData.paymentComments) {
        syncPayload.paymentComments = formData.paymentComments;
      }

      // Property Contact (Nov 18 fix - was missing from LOE sync path)
      // Only include if property contact fields are provided and different from client
      if (formData.propertyContactEmail && formData.propertyContactEmail !== formData.clientEmail) {
        syncPayload.PropertyContact = {
          FirstName: formData.propertyContactFirstName,
          LastName: formData.propertyContactLastName,
          Company: formData.clientOrganization || 'Direct Client',
          Email: formData.propertyContactEmail,
          PhoneNumber: formData.propertyContactPhone,
          Title: 'Property Manager',
          AddressStreet: formData.propertyAddress
        };
      }

      if (formData.paymentTerms) syncPayload.PaymentTerms = formData.paymentTerms;
      // REMOVED: disbursementPercentage - legacy field no longer used (client is now independent appraiser)

      console.log('📤 Sync payload prepared:', syncPayload);

      // Use Vercel serverless function endpoint
      const endpoint = '/api/valcre';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobData: syncPayload }),
      });

      const responseText = await response.text();
      console.log('API response status:', response.status);
      console.log('API response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', e);
        return { success: false, error: 'Invalid response from server' };
      }

      if (result.success) {
        console.log('✅ LOE details synced to Valcre successfully');
        return {
          success: true,
          jobNumber: data.jobNumber,
          jobId: data.jobId
        };
      } else {
        console.error('❌ LOE sync failed:', result);
        return {
          success: false,
          error: result.error || 'Failed to sync LOE details to Valcre'
        };
      }
    }

    // =========================
    // INITIAL JOB CREATION PATH
    // =========================
    console.log('🆕 Job Creation Operation detected');

    // Defensive check for clientName before parsing
    if (!formData.clientName) {
      console.error('❌ Missing required field: clientName');
      return { success: false, error: 'Client name is required for job creation' };
    }

    const [firstName, ...lastNameParts] = formData.clientName.split(' ');
    const lastName = lastNameParts.join(' ') || 'Client';

    // Defensive check for propertyAddress before parsing
    if (!formData.propertyAddress) {
      console.error('❌ Missing required field: propertyAddress');
      return { success: false, error: 'Property address is required for job creation' };
    }

    // Parse the property address to extract street, city, and province
    const addressParts = parseAddress(formData.propertyAddress);

    // Build complete job data with all mapped fields for entity creation
    const jobData: any = {
      // Core Job Information
      Name: formData.propertyName || 'Unnamed Property',
      Status: 'Lead',
      OwnerId: 7095,

      // Client fields (for display in Valcre file explorer)
      ClientName: formData.clientName,
      ClientEmail: formData.clientEmail,
      ClientPhone: formData.clientPhone,
      ClientCompany: formData.clientOrganization || formData.organizationName || 'Direct Client',

      // Property address for parsing
      PropertyAddress: formData.propertyAddress,

      // Property fields (will be used for Property entity)
      // Support both legacy single-select and new multi-select
      // NOTE: Valcre PropertyType field only accepts SINGLE value (enum), not comma-separated
      // For multi-select, send only the FIRST property type to PropertyType
      // Send full comma-separated list to PropertyTypeEnum for the Types field
      PropertyType: (() => {
        const value = formData.propertyTypes && formData.propertyTypes.length > 0
          ? formData.propertyTypes[0]  // Multi-select: use FIRST value only
          : formData.propertyType || 'Commercial'; // Legacy single-select
        console.log('🔥 PropertyType being sent to Valcre:', value, 'from propertyTypes:', formData.propertyTypes);
        return value;
      })(),
      PropertyTypeEnum: formData.propertyTypes && formData.propertyTypes.length > 0
        ? formData.propertyTypes.join(', ')  // Multi-select for Types field (supports comma-separated)
        : formData.propertyType || 'Commercial',  // Legacy single-select
      PropertySubtype: formData.propertySubtype || '',
      BuildingSize: formData.buildingSize || formData.sizeSF || 0,
      NumberOfUnits: formData.numberOfUnits || formData.buildingsCount || 1,
      ParkingSpaces: formData.parkingSpaces || formData.parkingSpacesCount || 0,
      ZoningClassification: formData.zoningClassification || formData.zoning || '',
      ZoneAbbreviation: formData.zoneAbbreviation || formData.zoningName || '',
      LandUseDesignation: formData.landUseDesignation || formData.proposedLandUse || '',
      FloodZone: formData.floodZone || formData.siteFloodZone || '',
      Utilities: formData.utilities || '',
      UsableLandSf: formData.usableLandSf || formData.buildableArea || 0,
      GrossLandSf: formData.grossLandSf || 0,
      EnvironmentalPhase1: formData.environmentalPhase1 || formData.environmentalIssues || '',
      // REMOVED: Notes field - was polluting Property.OffSiteImprovements with client comments
      // formData.notes (Additional Information) should stay dashboard-only or go to ClientComments
      AssetCondition: formData.assetCondition || formData.investmentGrade || '',
      AssetQuality: formData.assetQuality || formData.qualitativeCondition || '',
      MarketArea: formData.marketArea || formData.market || '',
      Submarket: formData.submarket || formData.submarketName || '',
      LegalDescription: formData.legalDescription || '',

      // Parcel information
      ParcelNumber: formData.parcelNumber || '',

      // Assessment information
      AssessmentYear: formData.assessmentYear || new Date().getFullYear(),
      LandAssessmentValue: formData.landAssessmentValue || 0,
      ImprovedAssessmentValue: formData.improvedAssessmentValue || 0,
      Taxes: formData.taxes || 0,

      // Job-specific fields
      AppraisalFee: formData.appraisalFee || 0,
      Retainer: formData.retainerAmount
        ? parseFloat(String(formData.retainerAmount).replace(/[$,]/g, ''))
        : 0,
      DeliveryDate: formData.deliveryDate || formData.dueDate || null,

      // ========== CRITICAL ENUM FIELDS ==========
      // These go directly to Valcre Job entity - must use camelCase from dashboard
      intendedUse: formData.intendedUse || 'Financing',
      reportType: formData.reportType || 'Appraisal Report',
      propertyRightsAppraised: formData.propertyRightsAppraised || 'Fee Simple Interest',
      valuationPremises: formData.valuationPremises || 'As-Is',
      analysisLevel: formData.analysisLevel || 'Comprehensive',

      // Building information (Section 3A)
      YearBuilt: formData.yearBuilt || 0,
      GrossBuildingAreaSf: formData.grossBuildingAreaSf || 0,
      NetRentableAreaSf: formData.netRentableAreaSf || 0,

      // Include update type if present (for sync operations)
      updateType: data.updateType,
      jobId: data.jobId,
      jobNumber: data.jobNumber
    };

    // Map client comments to ClientComments field (client-visible in Valcre)
    if (formData.notes || formData.clientComments) {
      jobData.ClientComments = formData.clientComments || formData.notes || '';
    }

    // Map appraiser comments to Comments field (general/internal comments in Valcre)
    if (formData.appraiserComments) {
      jobData.Comments = formData.appraiserComments;
    }

    // Only include PropertyContact if property contact fields are actually provided
    // Don't send PropertyContact with client fallbacks - that causes duplication
    if (formData.propertyContactEmail && formData.propertyContactEmail !== formData.clientEmail) {
      jobData.PropertyContact = {
        FirstName: formData.propertyContactFirstName,
        LastName: formData.propertyContactLastName,
        Company: formData.clientOrganization || formData.organizationName || 'Direct Client',
        Email: formData.propertyContactEmail,
        PhoneNumber: formData.propertyContactPhone,
        Title: formData.clientTitle || 'Property Manager',
        AddressStreet: formData.propertyAddress
      };
    }

    // Use Vercel serverless function endpoint
    // For production deployment on Vercel
    const endpoint = '/api/valcre';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobData }),
    });

    const responseText = await response.text();
    console.log('API response status:', response.status);
    console.log('API response:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', e);
      return { success: false, error: 'Invalid response from server' };
    }

    if (result.success && result.jobNumber) {
      console.log('Valcre job created successfully:', result.jobNumber, 'ID:', result.jobId);

      // Create ClickUp task NOW that we have the Valcre job number
      try {
        // Get the full job details for ClickUp
        const { data: job } = await supabase
          .from('job_submissions')
          .select('*')
          .eq('id', data.jobId)
          .single();

        if (job) {
          // Check if ClickUp task already exists (created on form submission)
          if (job.clickup_task_id) {
            // Update existing ClickUp task with VAL number
            console.log('Updating existing ClickUp task with VAL number:', result.jobNumber);
            const updateResult = await updateClickUpWithValcreJob(
              job.clickup_task_id,
              result.jobNumber,
              job
            );

            if (updateResult.success) {
              console.log('ClickUp task updated with VAL number');
            } else {
              console.warn('Failed to update ClickUp task:', updateResult.error);
            }
          } else {
            // DISABLED: Automatic ClickUp task creation - now manual only via button
            console.log('ClickUp task not created automatically - use button when ready');
          }

          // Always update job with Valcre number
          await supabase
            .from('job_submissions')
            .update({ job_number: result.jobNumber })
            .eq('id', data.jobId);
        }
      } catch (error) {
        console.error('Failed to handle ClickUp task:', error);
      }

      return {
        success: true,
        jobNumber: result.jobNumber,
        jobId: result.jobId
      };
    } else {
      console.error('Valcre job creation failed:', result);
      return {
        success: false,
        error: result.error || 'Failed to create job in Valcre'
      };
    }
  } catch (error: any) {
    console.error('Error calling Valcre API:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
};

// Add this function after line 139 - helper for updating existing ClickUp tasks
export async function updateExistingClickUpTask(jobId: string, calNumber: string) {
  try {
    // Get job with ClickUp info
    const { data: job } = await supabase
      .from('job_submissions')
      .select('*')
      .eq('id', jobId)
      .single();

    if (job?.clickup_task_id && !job.job_number) {
      // Update existing ClickUp task with CAL number
      await updateClickUpWithValcreJob(
        job.clickup_task_id,
        calNumber,
        undefined,
        job.propertyName,
        job.propertyAddress
      );

      console.log('✅ Updated existing ClickUp task with CAL number');
    }
  } catch (error) {
    console.error('Failed to update existing ClickUp task:', error);
  }
}

// Function to send data to Pandadoc via n8n
export const sendToPandadoc = async (data: PandadocWebhookData): Promise<{success: boolean; jobNumber?: string}> => {
  const webhookUrl = 'https://crowestudio.app.n8n.cloud/webhook-test/8d0a9dec-3ed2-40aa-829c-a317c553420a';

  try {
    console.log('Sending data to Pandadoc webhook:', data);

    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }

    // Make the actual API call to the webhook URL
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // For demonstration, generate a mock job number
    const mockJobNumber = `PD-${Date.now().toString().slice(-6)}`;

    // For demonstration, return success with the mock job number
    return {
      success: true,
      jobNumber: mockJobNumber
    };
  } catch (error) {
    console.error('Pandadoc webhook error:', error);
    return { success: false };
  }
};

// Function to send final data to Valcre via n8n
export const sendFinalDataToValcre = async (data: FinalDataWebhookData): Promise<boolean> => {
  const webhookUrl = process.env.N8N_VALCRE_FINAL_WEBHOOK_URL || 'https://placeholder-n8n-valcre-final-webhook.com';

  try {
    console.log('Sending final data to Valcre webhook:', data);

    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }

    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demonstration, return success
    return true;
  } catch (error) {
    console.error('Final data Valcre webhook error:', error);
    return false;
  }
};

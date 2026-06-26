import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useReportBuilderStore } from '../store/reportBuilderStore';

/**
 * Field mapping from job data to Home Tab field IDs in the Report Builder.
 * Maps database fields to their corresponding report builder store field IDs.
 */
interface JobDataMapping {
  fieldId: string;
  getValue: (jobData: JobData, loeData: LoeData | null, propertyData: PropertyData | null) => string | undefined;
}

interface JobData {
  id: string;
  job_number?: string;
  status: string;
  client_first_name: string;
  client_last_name: string;
  client_email: string;
  client_phone: string;
  client_organization?: string;
  client_address?: string;
  property_name?: string;
  property_address: string;
  property_type?: string;
  property_types?: string[];
  intended_use?: string;
  valuation_premises?: string;
  notes?: string;
  property_contact_first_name?: string;
  property_contact_last_name?: string;
  property_contact_email?: string;
  property_contact_phone?: string;
}

interface LoeData {
  job_number?: string;
  valcre_job_id?: string;
  report_type?: string;
  property_rights_appraised?: string;
  scope_of_work?: string;
  delivery_date?: string;
  // V4 Slice 3 — section-2 valuation cascade (verified columns on job_loe_details).
  // Pushed into the report builder as LABELS (headings), all-sync. No lossy transform.
  // NOTE: tenancy is NOT on job_loe_details — it lives on job_property_info (mapped via propertyData).
  status_of_improvements?: string;
  value_scenarios?: string;
  approaches_to_value?: string;
  value_timeframe?: string;
}

interface PropertyData {
  property_name?: string;
  legal_description?: string;
  year_built?: string;
  building_size?: string;
  number_of_units?: number;
  zoning_classification?: string;
  tenancy?: string;
}

/**
 * Parses an address string into components (street, city, province, postal).
 * Handles common Canadian address formats.
 */
function parseAddress(address: string | undefined): {
  street: string;
  city: string;
  province: string;
  postal: string;
} {
  if (!address) {
    return { street: '', city: '', province: '', postal: '' };
  }

  // Try to parse common address formats
  // Format: "Street, City, Province PostalCode" or "Street, City, Province, PostalCode"
  const parts = address.split(',').map(p => p.trim());

  if (parts.length >= 3) {
    // Street is first part
    const street = parts[0];
    // City is second part
    const city = parts[1];
    // Province and postal may be in third part together or separate
    const lastPart = parts.slice(2).join(' ').trim();

    // Try to extract postal code (Canadian format: A1A 1A1)
    const postalMatch = lastPart.match(/([A-Z]\d[A-Z]\s?\d[A-Z]\d)/i);
    const postal = postalMatch ? postalMatch[1].toUpperCase() : '';

    // Province is what remains after removing postal code
    const province = lastPart.replace(/[A-Z]\d[A-Z]\s?\d[A-Z]\d/i, '').trim();

    return { street, city, province, postal };
  } else if (parts.length === 2) {
    // Street, City format
    return { street: parts[0], city: parts[1], province: '', postal: '' };
  } else {
    // Just street
    return { street: address, city: '', province: '', postal: '' };
  }
}

/**
 * Field mappings from job data to Home Tab fields.
 * Based on the field registry in /src/features/report-builder/schema/fieldRegistry.ts
 */
const fieldMappings: JobDataMapping[] = [
  // Job Setup (canonical IDs from loe-prep section)
  {
    fieldId: 'job-number',
    getValue: (job, loe) => loe?.valcre_job_id || job.job_number || job.id,
  },
  {
    fieldId: 'report-date',
    getValue: () => new Date().toISOString().split('T')[0], // Today's date
  },

  // Client Information (canonical IDs from client-intake section)
  {
    fieldId: 'client-first-name',
    getValue: (job) => job.client_first_name,
  },
  {
    fieldId: 'client-last-name',
    getValue: (job) => job.client_last_name,
  },
  {
    fieldId: 'client-email',
    getValue: (job) => job.client_email,
  },
  {
    fieldId: 'client-phone',
    getValue: (job) => job.client_phone,
  },
  {
    fieldId: 'client-company-name',
    getValue: (job) => job.client_organization,
  },
  {
    fieldId: 'client-organization-address',
    getValue: (job) => parseAddress(job.client_address).street,
  },
  {
    fieldId: 'client-city',
    getValue: (job) => parseAddress(job.client_address).city,
  },
  {
    fieldId: 'client-province',
    getValue: (job) => parseAddress(job.client_address).province,
  },
  {
    fieldId: 'client-postal',
    getValue: (job) => parseAddress(job.client_address).postal,
  },

  // Property Information (canonical IDs from client-intake section)
  {
    fieldId: 'property-name',
    getValue: (job, _loe, property) => property?.property_name || job.property_name,
  },
  {
    fieldId: 'property-address',
    getValue: (job) => parseAddress(job.property_address).street,
  },
  {
    fieldId: 'property-type',
    getValue: (job) => {
      // Map job property type to Report Builder options
      // Property types can be array or single value
      const propertyType = Array.isArray(job.property_types)
        ? job.property_types[0]
        : job.property_type;

      // Map to closest Report Builder option
      const typeMap: Record<string, string> = {
        'Multi-Family': 'Multi-Family',
        'Multifamily': 'Multi-Family',
        'Office': 'Office',
        'Retail': 'Retail',
        'Industrial': 'Industrial',
        'Mixed-Use': 'Mixed-Use',
        'Land': 'Land',
        'Hospitality': 'Hospitality',
        'Hotel': 'Hospitality',
        'Special Purpose': 'Special Purpose',
        'Single-Family': 'Multi-Family', // Closest match
        'Agriculture': 'Land', // Closest match
      };
      return propertyType ? (typeMap[propertyType] || propertyType) : undefined;
    },
  },
  {
    fieldId: 'legal-description',
    getValue: (_job, _loe, property) => property?.legal_description,
  },

  // Assignment Details (canonical IDs from loe-prep section)
  {
    fieldId: 'report-type',
    getValue: (_job, loe) => loe?.report_type,
  },
  {
    fieldId: 'interest-appraised',
    getValue: (_job, loe) => loe?.property_rights_appraised,
  },
  {
    fieldId: 'authorized-use',
    getValue: (job) => job.intended_use,
  },
  {
    fieldId: 'scope-of-work',
    getValue: (_job, loe) => loe?.scope_of_work,
  },

  // V4 Slice 3 — Section-2 valuation cascade → report builder (LABELS/headings, all-sync).
  // Same scenarios as V3, one source of truth. Raw passthrough — NO lossy transform
  // (the property-type typeMap collapse above is the anti-pattern; do not repeat it).
  // ('Tenancy' IS mapped below — its source is job_property_info.tenancy, which this hook already
  //  fetches as propertyData; the earlier "no source" note checked only loe/submissions, not property_info.)
  {
    // Status of Improvements → report 'status-of-improvements'. FIX 4 wired this previously-missing
    // mapping. Registry home: 'status-of-improvements' in fieldRegistry.ts (it DOES exist — the prior
    // "no report field id" note was stale). Source = job_loe_details.status_of_improvements.
    fieldId: 'status-of-improvements',
    getValue: (_job, loe) => loe?.status_of_improvements,
  },
  {
    // Value scenario label(s), e.g. "As Stabilized" / "As-Is, As If Complete & Stabilized".
    fieldId: 'value-scenarios',
    getValue: (_job, loe) => loe?.value_scenarios,
  },
  {
    fieldId: 'approaches-to-value',
    getValue: (_job, loe) => loe?.approaches_to_value,
  },
  {
    fieldId: 'value-timeframe',
    getValue: (_job, loe) => loe?.value_timeframe,
  },
  {
    // Tenancy → report 'tenancy'. Source = job_property_info.tenancy (fetched as propertyData).
    fieldId: 'tenancy',
    getValue: (_job, _loe, property) => property?.tenancy,
  },

  // Subject Property Contact (canonical IDs from client-intake section)
  {
    fieldId: 'contact-first-name',
    getValue: (job) => job.property_contact_first_name,
  },
  {
    fieldId: 'contact-last-name',
    getValue: (job) => job.property_contact_last_name,
  },
  {
    fieldId: 'contact-phone',
    getValue: (job) => job.property_contact_phone,
  },
  {
    fieldId: 'contact-email',
    getValue: (job) => job.property_contact_email,
  },
];

/**
 * Hook to load job data from Supabase and populate Report Builder Home Tab fields.
 *
 * @param jobId - The UUID of the job to load
 * @returns Loading state and any error that occurred
 */
export function useLoadJobIntoReport(jobId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFieldValue = useReportBuilderStore((state) => state.updateFieldValue);
  const initializeMockData = useReportBuilderStore((state) => state.initializeMockData);

  useEffect(() => {
    // Skip if no jobId provided
    if (!jobId) {
      return;
    }

    const loadJobData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('useLoadJobIntoReport: Loading job data for:', jobId);

        // Initialize the report builder store first if empty
        const currentSections = useReportBuilderStore.getState().sections;
        if (currentSections.length === 0) {
          console.log('useLoadJobIntoReport: Initializing store with mock data first');
          initializeMockData();
          // Small delay to ensure store is initialized
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Fetch job submission data
        const { data: jobData, error: jobError } = await supabase
          .from('job_submissions')
          .select('*')
          .eq('id', jobId)
          .single();

        if (jobError) {
          throw new Error(`Failed to fetch job: ${jobError.message}`);
        }

        if (!jobData) {
          throw new Error('Job not found');
        }

        console.log('useLoadJobIntoReport: Fetched job data:', jobData);

        // Fetch LOE details
        const { data: loeData, error: loeError } = await supabase
          .from('job_loe_details')
          .select('*')
          .eq('job_id', jobId)
          .maybeSingle();

        if (loeError) {
          console.warn('useLoadJobIntoReport: Error fetching LOE details:', loeError);
        }

        console.log('useLoadJobIntoReport: Fetched LOE data:', loeData);

        // Fetch property info
        const { data: propertyData, error: propertyError } = await supabase
          .from('job_property_info')
          .select('*')
          .eq('job_id', jobId)
          .maybeSingle();

        if (propertyError) {
          console.warn('useLoadJobIntoReport: Error fetching property info:', propertyError);
        }

        console.log('useLoadJobIntoReport: Fetched property data:', propertyData);

        // Apply field mappings to populate Home Tab
        let fieldsUpdated = 0;
        for (const mapping of fieldMappings) {
          const value = mapping.getValue(jobData as JobData, loeData as LoeData | null, propertyData as PropertyData | null);
          if (value !== undefined && value !== null && value !== '') {
            console.log(`useLoadJobIntoReport: Setting ${mapping.fieldId} = "${value}"`);
            updateFieldValue(mapping.fieldId, value);
            fieldsUpdated++;
          }
        }

        console.log(`useLoadJobIntoReport: Successfully populated ${fieldsUpdated} fields from job data`);

        // Regenerate preview after loading data
        const generatePreview = useReportBuilderStore.getState().generatePreview;
        generatePreview();

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error loading job data';
        console.error('useLoadJobIntoReport: Error:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobData();
  }, [jobId, updateFieldValue, initializeMockData]);

  return { isLoading, error };
}

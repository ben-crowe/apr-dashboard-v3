
import { useState, useEffect } from "react";
import { DetailJob, JobDetails, JobFile } from "@/types/job";
import { MOCK_JOB_DETAIL, MOCK_JOB_DETAILS } from "@/data/mockJobData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useJobData(jobId: string) {
  const [job, setJob] = useState<DetailJob | null>(null);
  const [jobDetails, setJobDetails] = useState<JobDetails>({});
  const [isLoading, setIsLoading] = useState(true);

  // Expose fetchJobDetail as a function that can be called externally
  const fetchJobDetail = async () => {
    try {
      setIsLoading(true);

      // Fetch job from Supabase
      const { data: jobData, error: jobError } = await supabase
        .from('job_submissions')
        .select('*')
        .eq('id', jobId)
        .single();

        if (jobError) {
          if (jobError.code === 'PGRST116') {
            console.log("Job not found in Supabase, checking localStorage");
            // Job not found in Supabase, let's check localStorage
            const savedJobsJSON = localStorage.getItem('appraisal_jobs');
            const savedJobs = savedJobsJSON ? JSON.parse(savedJobsJSON) : [];
            const localJob = savedJobs.find((j: any) => j.id === jobId);

            if (localJob) {
              setJob(localJob);
            } else {
              // If not found in localStorage either, use mock data
              console.log("Using mock data as fallback");
              setJob(MOCK_JOB_DETAIL);
              setJobDetails(MOCK_JOB_DETAILS);
            }
          } else {
            throw jobError;
          }
        } else if (jobData) {
          // Transform job data to match DetailJob type
          const transformedJob: DetailJob = {
            id: jobData.id,
            clientFirstName: jobData.client_first_name,
            clientLastName: jobData.client_last_name,
            clientEmail: jobData.client_email,
            clientPhone: jobData.client_phone,
            clientTitle: jobData.client_title || undefined,
            clientOrganization: jobData.client_organization || undefined,
            clientAddress: jobData.client_address || undefined,
            propertyName: jobData.property_name || undefined,
            propertyAddress: jobData.property_address,
            propertyType: jobData.property_type || undefined,
            propertyTypes: jobData.property_types || undefined, // Multi-select array
            intendedUse: jobData.intended_use || undefined,
            assetCondition: jobData.asset_condition || undefined,
            valuationPremises: jobData.valuation_premises || undefined,
            notes: jobData.notes || undefined,
            // Property contact fields - NO fallback to client (prevents duplication)
            propertyContactFirstName: jobData.property_contact_first_name || undefined,
            propertyContactLastName: jobData.property_contact_last_name || undefined,
            propertyContactEmail: jobData.property_contact_email || undefined,
            propertyContactPhone: jobData.property_contact_phone || undefined,
            sameAsClientContact: jobData.same_as_client_contact || undefined,
            status: jobData.status as any,
            jobNumber: jobData.job_number || undefined,
            clickup_task_id: jobData.clickup_task_id || undefined,
            clickup_task_url: jobData.clickup_task_url || undefined,
            createdAt: jobData.created_at
          };

          // Fetch files associated with this job
          const { data: fileData, error: fileError } = await supabase
            .from('job_files')
            .select('*')
            .eq('job_id', jobId);

          if (!fileError && fileData && fileData.length > 0) {
            console.log("✅ Found files for job:", fileData);

            // Transform file data
            const files: JobFile[] = fileData.map(file => ({
              id: file.id,
              fileName: file.file_name,
              filePath: file.file_path,
              fileType: file.file_type,
              fileSize: file.file_size
            }));

            transformedJob.files = files;
            console.log("✅ Transformed files attached to job:", transformedJob.files);
          } else {
            console.log("⚠️ No files found for job. Error:", fileError, "Data:", fileData);
          }

          console.log("📋 Final job object with files:", transformedJob);

          setJob(transformedJob);

          // Fetch LOE details
          console.log('🔍 Fetching LOE details for job_id:', jobId);
          const { data: loeData, error: loeError } = await supabase
            .from('job_loe_details')
            .select('*')
            .eq('job_id', jobId)
            .maybeSingle();

          console.log('📋 LOE data received:', loeData);
          if (loeData?.job_number) {
            console.log('✅ VAL Number found in LOE details:', loeData.job_number);
            // Update the job object with the VAL number from LOE details
            // This ensures the detail view title shows the VAL number
            transformedJob.jobNumber = loeData.job_number;
            console.log('✅ Updated job.jobNumber for detail view:', transformedJob.jobNumber);
          } else {
            console.log('⚠️ NO VAL Number in LOE details');
          }

          // Fetch property info
          const { data: propertyData, error: propertyError } = await supabase
            .from('job_property_info')
            .select('*')
            .eq('job_id', jobId)
            .maybeSingle();

          // Combine into one jobDetails object
          const combinedDetails: JobDetails = {};

          if (loeData) {
            Object.assign(combinedDetails, {
              jobNumber: loeData.job_number,  // Fix: get job_number from loeData, not jobData
              valcreJobId: loeData.valcre_job_id,  // Also add the valcre job ID
              propertyRightsAppraised: loeData.property_rights_appraised,
              valuationPremises: loeData.valuation_premises,
              deliveryDate: loeData.delivery_date,
              scopeOfWork: loeData.scope_of_work,
              specialInstructions: loeData.special_instructions,
              reportType: loeData.report_type,
              paymentTerms: loeData.payment_terms,
              appraisalFee: loeData.appraisal_fee,
              retainerAmount: loeData.retainer_amount,
              disbursementPercentage: loeData.disbursement_percentage,
              internalComments: loeData.internal_comments,
              appraiserComments: loeData.internal_comments,  // FIX: Alias for component compatibility (Nov 18)
              deliveryComments: loeData.delivery_comments,  // FIX: Add delivery comments (Nov 18 - regression fix)
              paymentComments: loeData.payment_comments  // FIX: Add payment comments (Nov 18 - regression fix)
            });
          }

          if (propertyData) {
            Object.assign(combinedDetails, {
              yearBuilt: propertyData.year_built,
              buildingSize: propertyData.building_size,
              legalDescription: propertyData.legal_description,
              numberOfUnits: propertyData.number_of_units,
              parkingSpaces: propertyData.parking_spaces,
              zoningClassification: propertyData.zoning_classification,
              zoneAbbreviation: propertyData.zone_abbreviation,
              landUseDesignation: propertyData.land_use_designation,
              floodZone: propertyData.flood_zone,
              utilities: propertyData.utilities,
              parcelNumber: propertyData.parcel_number,
              usableLandSf: propertyData.usable_land_sf,
              usableLandAcres: propertyData.usable_land_acres,
              grossLandSf: propertyData.gross_land_sf,
              grossLandAcres: propertyData.gross_land_acres,
              assessedValue: propertyData.assessed_value,
              taxes: propertyData.taxes,
              assessmentYear: propertyData.assessment_year,
              landAssessmentValue: propertyData.land_assessment_value,
              improvedAssessmentValue: propertyData.improved_assessment_value,
              totalAssessmentValue: propertyData.total_assessment_value
            });
          }

          if (Object.keys(combinedDetails).length === 0) {
            // If no details found in Supabase, use mock data as fallback
            setJobDetails(MOCK_JOB_DETAILS);
          } else {
            setJobDetails(combinedDetails);
          }

          // Update job state with any changes from LOE data (like VAL number)
          // This ensures the detail view reflects the latest job number
          setJob(transformedJob);
        } else {
          // No data returned
          console.log("Job not found, using mock data");
          setJob(MOCK_JOB_DETAIL);
          setJobDetails(MOCK_JOB_DETAILS);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to load job details. Please try again.");

        // Fall back to mock data
        setJob(MOCK_JOB_DETAIL);
        setJobDetails(MOCK_JOB_DETAILS);
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchJobDetail();
  }, [jobId]);

  return {
    job,
    setJob,
    jobDetails,
    setJobDetails,
    isLoading,
    refetchJobData: fetchJobDetail  // Expose refetch function
  };
}


import { useState, useCallback } from "react";
import { JobDetails } from "@/types/job";
import { debounce } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useSaveJobDetails(jobId: string) {
  const [isSaving, setIsSaving] = useState(false);

  // Create a debounced version of the save function
  const debouncedSave = useCallback(
    debounce(async (details: JobDetails) => {
      setIsSaving(true);
      try {
        // Determine which tables need updating based on the fields
        const loeFields = [
          'jobNumber', 'valcreJobId',  // Add these critical fields!
          'propertyRightsAppraised', 'valuationPremises', 'deliveryDate', 
          'scopeOfWork', 'specialInstructions', 'reportType', 
          'paymentTerms', 'appraisalFee', 'retainerAmount', 
          'disbursementPercentage', 'internalComments'
        ];
        
        const propertyInfoFields = [
          'yearBuilt', 'buildingSize', 'legalDescription', 
          'numberOfUnits', 'parkingSpaces', 'zoningClassification', 
          'zoneAbbreviation', 'landUseDesignation', 'floodZone', 
          'utilities', 'parcelNumber', 'usableLandSf', 
          'usableLandAcres', 'grossLandSf', 'grossLandAcres', 
          'assessedValue', 'taxes', 'assessmentYear', 
          'landAssessmentValue', 'improvedAssessmentValue', 'totalAssessmentValue'
        ];
        
        // Check if we need to update job_loe_details
        const loeDetailsToUpdate: any = {};
        let hasLoeUpdates = false;
        
        for (const field of loeFields) {
          if (field in details) {
            const snakeField = field
              .replace(/([A-Z])/g, '_$1')
              .toLowerCase();
            loeDetailsToUpdate[snakeField] = details[field as keyof JobDetails];
            hasLoeUpdates = true;
          }
        }
        
        // Check if we need to update job_property_info
        const propertyInfoToUpdate: any = {};
        let hasPropertyUpdates = false;
        
        for (const field of propertyInfoFields) {
          if (field in details) {
            const snakeField = field
              .replace(/([A-Z])/g, '_$1')
              .toLowerCase();
            propertyInfoToUpdate[snakeField] = details[field as keyof JobDetails];
            hasPropertyUpdates = true;
          }
        }
        
        // Also check for jobNumber in the main job table
        if (details.jobNumber) {
          const { error: jobError } = await supabase
            .from('job_submissions')
            .update({ job_number: details.jobNumber })
            .eq('id', jobId);
          
          if (jobError) throw jobError;
        }
        
        // Update LOE details if needed
        if (hasLoeUpdates) {
          // Check if a record already exists
          const { data: existingLoe } = await supabase
            .from('job_loe_details')
            .select('id')
            .eq('job_id', jobId)
            .maybeSingle();
          
          if (existingLoe) {
            // Update existing record
            const { error } = await supabase
              .from('job_loe_details')
              .update(loeDetailsToUpdate)
              .eq('job_id', jobId);
            
            if (error) throw error;
          } else {
            // Insert new record
            const { error } = await supabase
              .from('job_loe_details')
              .insert({
                job_id: jobId,
                ...loeDetailsToUpdate
              });
            
            if (error) throw error;
          }
        }
        
        // Update property info if needed
        if (hasPropertyUpdates) {
          // Check if a record already exists
          const { data: existingProperty } = await supabase
            .from('job_property_info')
            .select('id')
            .eq('job_id', jobId)
            .maybeSingle();
          
          if (existingProperty) {
            // Update existing record
            const { error } = await supabase
              .from('job_property_info')
              .update(propertyInfoToUpdate)
              .eq('job_id', jobId);
            
            if (error) throw error;
          } else {
            // Insert new record
            const { error } = await supabase
              .from('job_property_info')
              .insert({
                job_id: jobId,
                ...propertyInfoToUpdate
              });
            
            if (error) throw error;
          }
        }
        
        // Show a success toast only for the first save
        if (isSaving) {
          toast.success("Changes saved");
        }
      } catch (error) {
        console.error("Error saving job details:", error);
        toast.error("Failed to save changes");
      } finally {
        setIsSaving(false);
      }
    }, 500),
    [jobId]
  );

  return {
    isSaving,
    debouncedSave
  };
}

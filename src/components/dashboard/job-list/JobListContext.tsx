
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { debounce } from "@/lib/utils";
import { JobSubmission, JobStatus } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";

interface JobListContextProps {
  jobs: JobSubmission[];
  filteredJobs: JobSubmission[];
  searchQuery: string;
  statusFilter: string;
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  refetchJobs: () => void;
}

const JobListContext = createContext<JobListContextProps | undefined>(undefined);

export const useJobList = () => {
  const context = useContext(JobListContext);
  if (!context) {
    throw new Error("useJobList must be used within a JobListProvider");
  }
  return context;
};

export const JobListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<JobSubmission[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching jobs from Supabase...");
        
        const { data: supabaseJobs, error } = await supabase
          .from('job_submissions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        console.log("Supabase jobs:", supabaseJobs);
        
        // Debug: Check what fields are actually in the database
        if (supabaseJobs && supabaseJobs.length > 0) {
          console.log("🔍 Latest job from database:", {
            id: supabaseJobs[0].id,
            property_type: supabaseJobs[0].property_type,
            intended_use: supabaseJobs[0].intended_use,
            asset_condition: supabaseJobs[0].asset_condition,
            property_name: supabaseJobs[0].property_name,
            full_record: supabaseJobs[0]
          });
        }
        
        // Helper function to clean quoted strings
        const cleanQuotedString = (value: string | null | undefined): string | undefined => {
          if (!value) return undefined;
          // Remove surrounding quotes if they exist
          if (typeof value === 'string' && value.startsWith("'") && value.endsWith("'")) {
            return value.slice(1, -1);
          }
          return value;
        };

        // Transform Supabase data to match JobSubmission type
        const transformedJobs: JobSubmission[] = supabaseJobs.map(job => ({
          id: job.id,
          clientFirstName: job.client_first_name,
          clientLastName: job.client_last_name,
          clientEmail: job.client_email,
          clientPhone: job.client_phone,
          clientTitle: job.client_title || undefined,
          clientOrganization: job.client_organization || undefined,
          clientAddress: job.client_address || undefined,
          propertyName: job.property_name || undefined,
          propertyAddress: job.property_address,
          propertyType: cleanQuotedString(job.property_type),
          intendedUse: cleanQuotedString(job.intended_use),
          assetCondition: cleanQuotedString(job.asset_condition),
          notes: job.notes || undefined,
          // Property Contact fields (optional - defaults to client contact if empty)
          propertyContactFirstName: job.property_contact_first_name || undefined,
          propertyContactLastName: job.property_contact_last_name || undefined,
          propertyContactEmail: job.property_contact_email || undefined,
          propertyContactPhone: job.property_contact_phone || undefined,
          // Validate and cast status to ensure it's one of the JobStatus values
          status: validateJobStatus(job.status),
          createdAt: job.created_at,
          jobNumber: job.job_number || undefined
        }));
        
        setJobs(transformedJobs);
        setFilteredJobs(transformedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs. Please try again.");
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Helper function to validate and cast status to JobStatus type
  const validateJobStatus = (status: string): JobStatus => {
    const validStatuses: JobStatus[] = ["submitted", "in_progress", "loe_pending", "completed"];
    
    if (validStatuses.includes(status as JobStatus)) {
      return status as JobStatus;
    }
    
    // Default to "submitted" if the status is not valid
    console.warn(`Invalid job status: ${status}, defaulting to "submitted"`);
    return "submitted";
  };

  const debouncedSearch = debounce((query: string) => {
    let result = [...jobs];

    // Apply search filter
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (job) =>
          job.propertyAddress.toLowerCase().includes(q) ||
          (job.propertyName && job.propertyName.toLowerCase().includes(q)) ||
          `${job.clientFirstName} ${job.clientLastName}`
            .toLowerCase()
            .includes(q) ||
          (job.propertyType && job.propertyType.toLowerCase().includes(q))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((job) => job.status === statusFilter);
    }

    setFilteredJobs(result);
  }, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, jobs, statusFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const refetchJobs = async () => {
    try {
      setIsLoading(true);
      console.log("Refetching jobs from Supabase...");
      
      const { data: supabaseJobs, error } = await supabase
        .from('job_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform Supabase data to match JobSubmission type
      const transformedJobs: JobSubmission[] = supabaseJobs.map(job => ({
        id: job.id,
        clientFirstName: job.client_first_name,
        clientLastName: job.client_last_name,
        clientEmail: job.client_email,
        clientPhone: job.client_phone,
        clientTitle: job.client_title || undefined,
        clientOrganization: job.client_organization || undefined,
        clientAddress: job.client_address || undefined,
        propertyName: job.property_name || undefined,
        propertyAddress: job.property_address,
        propertyType: job.property_type || undefined,
        intendedUse: job.intended_use || undefined,
        assetCondition: job.asset_condition || undefined,
        notes: job.notes || undefined,
        status: validateJobStatus(job.status),
        createdAt: job.created_at,
        jobNumber: job.job_number || undefined
      }));
      
      setJobs(transformedJobs);
      setFilteredJobs(transformedJobs);
    } catch (error) {
      console.error("Error refetching jobs:", error);
      toast.error("Failed to refresh jobs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    jobs,
    filteredJobs,
    searchQuery,
    statusFilter,
    isLoading,
    setSearchQuery,
    setStatusFilter,
    handleSearchChange,
    refetchJobs,
  };

  return <JobListContext.Provider value={value}>{children}</JobListContext.Provider>;
};

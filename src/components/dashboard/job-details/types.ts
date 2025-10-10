
import { DetailJob, JobDetails } from "@/types/job";

export interface SectionProps {
  job: DetailJob;
  jobDetails?: JobDetails;
  onUpdateJob?: (updates: Partial<DetailJob>) => void;
  onUpdateDetails?: (details: Partial<JobDetails>) => void;
  refetchJobData?: () => Promise<void>;
}

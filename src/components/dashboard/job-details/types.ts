
import { DetailJob, JobDetails } from "@/types/job";

export interface SectionProps {
  job: DetailJob;
  jobDetails?: JobDetails;
  onUpdateJob?: (updates: Partial<DetailJob>) => void;
  onUpdateDetails?: (details: Partial<JobDetails>) => void;
  refetchJobData?: () => Promise<void>;
  // True once "Fill with Test Data" was pressed for this job (demo mode). Holds the cascade-derived
  // cluster empty until a scenario is picked. A real job (never filled) derives normally.
  testFilled?: boolean;
}

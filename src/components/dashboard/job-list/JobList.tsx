
import React from "react";
import JobListItem from "@/components/dashboard/JobListItem";
import { JobListLoading, JobListEmpty } from "./JobListStates";
import JobListHeader from "./JobListHeader";
import { JobSubmission } from "@/types/job";
import { useJobList } from "./JobListContext";

interface JobListProps {
  jobs: JobSubmission[];
  isLoading: boolean;
  onSelectJob: (jobId: string) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, isLoading, onSelectJob }) => {
  const { refetchJobs } = useJobList();
  if (isLoading) {
    return <JobListLoading />;
  }

  if (jobs.length === 0) {
    return <JobListEmpty />;
  }

  return (
    <>
      <JobListHeader />
      <div className="border border-border/50 rounded-md bg-card divide-y divide-border/30">
        {jobs.map((job) => (
          <JobListItem
            key={job.id}
            job={job}
            onSelect={() => onSelectJob(job.id)}
            onDelete={() => refetchJobs()}
          />
        ))}
      </div>
    </>
  );
};

export default JobList;

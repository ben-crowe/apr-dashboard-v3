
import React from "react";
import JobSearch from "./job-list/JobSearch";
import StatusFilter from "./job-list/StatusFilter";
import JobList from "./job-list/JobList";
import JobListTitle from "./job-list/JobListTitle";
import { JobListProvider, useJobList } from "./job-list/JobListContext";

interface JobListViewProps {
  onSelectJob: (jobId: string) => void;
}

// Inner component that uses the context
const JobListViewContent: React.FC<JobListViewProps> = ({ onSelectJob }) => {
  const { filteredJobs, isLoading, searchQuery, statusFilter, handleSearchChange, setStatusFilter } = useJobList();

  return (
    <div className="space-y-4">
      <JobListTitle onSelectJob={onSelectJob} />

      <div className="flex flex-col sm:flex-row gap-3">
        <JobSearch 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        <StatusFilter
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      <JobList
        jobs={filteredJobs}
        isLoading={isLoading}
        onSelectJob={onSelectJob}
      />
    </div>
  );
};

// Wrapper component that provides the context
const JobListView: React.FC<JobListViewProps> = ({ onSelectJob }) => {
  return (
    <JobListProvider>
      <JobListViewContent onSelectJob={onSelectJob} />
    </JobListProvider>
  );
};

export default JobListView;

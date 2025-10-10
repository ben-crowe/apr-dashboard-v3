import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import JobListView from "@/components/dashboard/JobListView";
import JobDetailView from "@/components/dashboard/JobDetailView";
import { useToast } from "@/hooks/use-toast";
import AppraisalTable from "@/components/dashboard/AppraisalTable";
import { JobListProvider, useJobList } from "@/components/dashboard/job-list/JobListContext";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const jobIdFromUrl = searchParams.get('jobId');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobIdFromUrl);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const { toast } = useToast();

  // Update selectedJobId when URL param changes
  useEffect(() => {
    if (jobIdFromUrl) {
      setSelectedJobId(jobIdFromUrl);
    }
  }, [jobIdFromUrl]);

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const handleBackToList = () => {
    setSelectedJobId(null);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'table' : 'list');
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in bento-shadow">
        {selectedJobId ? (
          <JobDetailView jobId={selectedJobId} onBack={handleBackToList} />
        ) : (
          <JobListProvider>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Appraisal Submissions</h1>
                <button 
                  onClick={toggleViewMode}
                  className="px-3 py-1 rounded bg-primary text-primary-foreground text-sm"
                >
                  Switch to {viewMode === 'list' ? 'Table' : 'List'} View
                </button>
              </div>
              
              {viewMode === 'list' ? (
                <JobListViewContent onSelectJob={handleSelectJob} />
              ) : (
                <AppraisalTableWrapper onSelectJob={handleSelectJob} />
              )}
            </div>
          </JobListProvider>
        )}
      </div>
    </DashboardLayout>
  );
};

// Inner component that uses JobList context
const JobListViewContent: React.FC<{ onSelectJob: (jobId: string) => void }> = ({ onSelectJob }) => {
  // We don't need to use JobListProvider here since JobListView already provides it internally
  return <JobListView onSelectJob={onSelectJob} />;
};

// Wrapper to access JobList context
const AppraisalTableWrapper: React.FC<{ onSelectJob: (jobId: string) => void }> = ({ onSelectJob }) => {
  const { filteredJobs, isLoading } = useJobList();
  
  return (
    <AppraisalTable 
      jobs={filteredJobs} 
      isLoading={isLoading} 
      onSelectJob={onSelectJob} 
    />
  );
};

export default Dashboard;

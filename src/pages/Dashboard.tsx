import React, { useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import JobListView from "@/components/dashboard/JobListView";
import JobDetailView from "@/components/dashboard/JobDetailView";
import AppraisalTable from "@/components/dashboard/AppraisalTable";
import { JobListProvider, useJobList } from "@/components/dashboard/job-list/JobListContext";

// Job List Route Component
const JobListRoute = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');

  const handleSelectJob = (jobId: string) => {
    navigate(`/dashboard/job/${jobId}`);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'table' : 'list');
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in bento-shadow">
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
      </div>
    </DashboardLayout>
  );
};

// Job Detail Route Component
const JobDetailRoute = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  const handleBackToList = () => {
    navigate('/dashboard');
  };

  if (!jobId) {
    navigate('/dashboard');
    return null;
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in bento-shadow">
        <JobDetailView jobId={jobId} onBack={handleBackToList} />
      </div>
    </DashboardLayout>
  );
};

// Inner component that uses JobList context
const JobListViewContent: React.FC<{ onSelectJob: (jobId: string) => void }> = ({ onSelectJob }) => {
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

// Main Dashboard Component with Nested Routes
const Dashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<JobListRoute />} />
      <Route path="/job/:jobId" element={<JobDetailRoute />} />
    </Routes>
  );
};

export default Dashboard;

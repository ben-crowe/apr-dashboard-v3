import React, { useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import JobListView from "@/components/dashboard/JobListView";
import JobDetailView from "@/components/dashboard/JobDetailView";
import AppraisalTable from "@/components/dashboard/AppraisalTable";
import { JobListProvider, useJobList } from "@/components/dashboard/job-list/JobListContext";
import MockReportBuilder from "./MockReportBuilder";

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
      <div className="animate-fade-in bento-shadow p-6">
        <JobListProvider>
          <div className="space-y-6">
            {/* OAuth removed - using personal API token */}

            <div>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Appraisal Submissions</h1>
                <button
                  onClick={toggleViewMode}
                  className="px-2.5 py-1.5 rounded-md border border-slate-400/50 dark:border-slate-700/50 bg-transparent text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-500/60 dark:hover:border-slate-600/60 text-sm font-normal transition-colors"
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

// Job Report Route Component - Opens Report Builder with job data pre-filled
const JobReportRoute = () => {
  const { jobId } = useParams<{ jobId: string }>();

  if (!jobId) {
    return null;
  }

  // MockReportBuilder will use the jobId from URL params via useLoadJobIntoReport hook
  return <MockReportBuilder jobId={jobId} />;
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
      <Route path="/job/:jobId/report" element={<JobReportRoute />} />
    </Routes>
  );
};

export default Dashboard;

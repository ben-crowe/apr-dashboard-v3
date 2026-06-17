import React, { useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import JobListView from "@/components/dashboard/JobListView";
import JobDetailView from "@/components/dashboard/JobDetailView";
import AppraisalTable from "@/components/dashboard/AppraisalTable";
import { JobListProvider, useJobList } from "@/components/dashboard/job-list/JobListContext";
import JobReportBuilder from "./JobReportBuilder";

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
              <div className="mb-4">
                <h1 className="text-2xl font-bold">Appraisal Submissions</h1>
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

// Job Report Route Component - Opens Report Builder with job data pre-filled + persistent.
// V4 Slice 1: symlink removed, report-builder consolidated, persistence wired.
const JobReportRoute = () => {
  const { jobId } = useParams<{ jobId: string }>();

  if (!jobId) {
    return null;
  }

  return <JobReportBuilder />;
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

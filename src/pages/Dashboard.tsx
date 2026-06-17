import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import JobListView from "@/components/dashboard/JobListView";
import JobDetailView from "@/components/dashboard/JobDetailView";
import AppraisalTable from "@/components/dashboard/AppraisalTable";
import { JobListProvider, useJobList } from "@/components/dashboard/job-list/JobListContext";
import JobReportBuilder from "./JobReportBuilder";
import { isV4Enabled } from "@/lib/featureFlags";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

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
              <div className="mb-4 flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">Appraisal Submissions</h1>
                {/* Easy top-level entry into the SEPARATE V4 report builder for review.
                    Gated: our V4-lit build only, never Chris's client build. */}
                {isV4Enabled() && (
                  <Button onClick={() => navigate('/mock-builder')} className="shrink-0">
                    <FileText className="mr-2 h-4 w-4" />
                    Open Report Builder
                  </Button>
                )}
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
      {/* V4 GATE — the report builder route is registered ONLY when VITE_V4_ENABLED='true'.
          In the client build it's unregistered, so a direct hit to /dashboard/job/:id/report
          matches nothing and the builder never mounts. */}
      {isV4Enabled() && (
        <Route path="/job/:jobId/report" element={<JobReportRoute />} />
      )}
      {/* Catch-all: any unmatched nested path (incl. /job/:id/report when V4 is OFF and the
          route above is unregistered) redirects cleanly to the dashboard — never a blank page. */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default Dashboard;

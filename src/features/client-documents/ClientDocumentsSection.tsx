// Client Documents (S3) — dashboard job-context wrapper around the reusable S3FolderBuckets.
//
// Keeps the job-picking / standalone / no-job logic OUT of the reusable core (KR6): the core
// takes only a jobId; this wrapper resolves which job to show.
//   - Entered from a job (Create Report route) -> currentJobId is set -> show THAT job's folders.
//   - Standalone /test-input -> a job picker + a no-job empty state.

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { S3FolderBuckets } from './S3FolderBuckets';

interface JobOption {
  id: string;
  job_number: string | null;
  property_name: string | null;
  sharepoint_folder_url: string | null;
}

export function ClientDocumentsSection({ currentJobId }: { currentJobId: string | null }) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(currentJobId);
  const [jobs, setJobs] = useState<JobOption[]>([]);
  const [currentJob, setCurrentJob] = useState<JobOption | null>(null);

  // When the tab was entered from a job, that job wins and no picker is shown.
  const effectiveJobId = currentJobId ?? selectedJobId;

  // Fetch the current job's row (for its stored SharePoint parent URL) when driven by a job.
  useEffect(() => {
    if (!currentJobId) return;
    let cancelled = false;
    void supabase
      .from('job_submissions')
      .select('id, job_number, property_name, sharepoint_folder_url')
      .eq('id', currentJobId)
      .single()
      .then(({ data }) => {
        if (!cancelled && data) setCurrentJob(data as JobOption);
      });
    return () => {
      cancelled = true;
    };
  }, [currentJobId]);

  // Standalone: load a job list for the picker (only jobs that have a Valcre number).
  useEffect(() => {
    if (currentJobId) return;
    let cancelled = false;
    void supabase
      .from('job_submissions')
      .select('id, job_number, property_name, sharepoint_folder_url')
      .not('job_number', 'is', null)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!cancelled && data) setJobs(data as JobOption[]);
      });
    return () => {
      cancelled = true;
    };
  }, [currentJobId]);

  const sharepointFolderUrl = useMemo(() => {
    if (currentJobId) return currentJob?.sharepoint_folder_url ?? null;
    return jobs.find((j) => j.id === selectedJobId)?.sharepoint_folder_url ?? null;
  }, [currentJobId, currentJob, jobs, selectedJobId]);

  return (
    <div
      id="section-client-documents"
      className="rounded-lg overflow-hidden mb-2 p-4"
      style={{ backgroundColor: '#2a2a2a', border: '1px solid #4b5563' }}
    >
      <h2 className="text-lg font-semibold text-white">S3 — Client Documents</h2>
      <p className="mt-1 text-sm text-gray-400">
        The job’s SharePoint folder buckets. Drop a file on a bucket to upload it there (max 4 MB).
      </p>

      {/* Standalone job picker — hidden when the tab was entered from a job. */}
      {!currentJobId && (
        <div className="mt-3 flex items-center gap-2">
          <label className="text-sm text-gray-300">Job:</label>
          <select
            className="bg-[#1f1f1f] text-white text-sm rounded border border-gray-600 px-2 py-1"
            value={selectedJobId ?? ''}
            onChange={(e) => setSelectedJobId(e.target.value || null)}
          >
            <option value="">Select a job…</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.job_number} — {j.property_name ?? 'Unnamed'}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-3">
        {effectiveJobId ? (
          <S3FolderBuckets jobId={effectiveJobId} sharepointFolderUrl={sharepointFolderUrl} />
        ) : (
          <div className="p-6 text-sm text-gray-400">
            Select a job above to see its Client Documents folders.
          </div>
        )}
      </div>
    </div>
  );
}

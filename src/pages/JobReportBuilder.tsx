import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MockReportBuilder from './MockReportBuilder';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import {
  loadReportBuilderData,
  useReportBuilderAutosave,
} from '@/features/report-builder/hooks/useSaveReportBuilderData';

// ─── V4 Slice 1: in-dashboard report builder, job-scoped + persistent ───────────
// Route /dashboard/job/:jobId/report. Renders the report builder for a specific job,
// rehydrates any saved report_builder_data over the initialized form, then arms
// debounced autosave. A never-saved job hydrates to a clean form (no crash).
// Spec: docs/Architecture/SPEC-V4-slice1-unlock-persist.md

export default function JobReportBuilder() {
  const { jobId } = useParams<{ jobId: string }>();
  const [hydrated, setHydrated] = useState(false);

  // Autosave is armed ONLY after hydration — so the rehydration writes below don't
  // trigger an immediate save, and we never overwrite saved data with a blank form.
  useReportBuilderAutosave(jobId, hydrated);

  useEffect(() => {
    if (!jobId) {
      setHydrated(true);
      return;
    }
    let cancelled = false;
    let attempts = 0;

    (async () => {
      const { data } = await loadReportBuilderData(jobId);

      // Wait for MockReportBuilder to finish its own mock-data init (sections present),
      // then apply saved values on top. Zero-row jobs (data === null) just stay clean.
      const apply = () => {
        if (cancelled) return;
        const store = useReportBuilderStore.getState();
        if (store.sections.length === 0 && attempts < 30) {
          attempts += 1;
          setTimeout(apply, 100);
          return;
        }
        if (data) {
          for (const [fieldId, value] of Object.entries(data)) {
            store.updateFieldValue(fieldId, value);
          }
          // updateFieldValue flips isDirty — clear it so the load isn't treated as an edit.
          useReportBuilderStore.setState({ isDirty: false });
          store.generatePreview();
        }
        setHydrated(true);
      };
      apply();
    })();

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  return <MockReportBuilder jobId={jobId} />;
}

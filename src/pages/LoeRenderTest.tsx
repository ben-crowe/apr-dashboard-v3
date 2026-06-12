// RENDER-ONLY harness (QA) — renders the REAL generateLOEHTML output for a job, no send.
// Loads the job via the same useJobData hook the dashboard uses (faithful shape), calls
// the production generateLOEHTML, and exposes the full HTML on window.__LOE_HTML for capture.
// Route: /loe-render?jobId=<uuid>
import React, { useEffect, useState } from 'react';
import { useJobData } from '@/hooks/useJobData';
import { generateLOEHTML } from '@/utils/loe/generateLOE';

declare global {
  interface Window { __LOE_HTML?: string; __LOE_STATUS?: string; }
}

export default function LoeRenderTest() {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get('jobId') || '';
  const { job, jobDetails, isLoading } = useJobData(jobId);
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    window.__LOE_STATUS = 'loading';
    if (isLoading || !job) return;
    (async () => {
      try {
        const rendered = await generateLOEHTML(job as any, jobDetails as any);
        setHtml(rendered);
        window.__LOE_HTML = rendered;
        window.__LOE_STATUS = 'ready:' + rendered.length;
      } catch (e: any) {
        window.__LOE_STATUS = 'error:' + (e?.message || String(e));
      }
    })();
  }, [isLoading, job, jobDetails]);

  return (
    <div>
      <div id="loe-status" data-status={window.__LOE_STATUS || ''} style={{ position: 'fixed', top: 0, left: 0, background: '#111', color: '#0f0', font: '11px monospace', padding: '2px 6px', zIndex: 9999 }}>
        job={jobId} loading={String(isLoading)} bytes={html.length}
      </div>
      <div id="loe-doc" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

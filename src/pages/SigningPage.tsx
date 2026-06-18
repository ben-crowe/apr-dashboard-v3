import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DocusealForm } from '@docuseal/react';
import { supabase } from '@/integrations/supabase/client';
import {
  loadActivePopupTemplate,
  resolvePopupTokens,
  POPUP_SEED_BODY,
} from '@/utils/loe/popupTemplate';

export function SigningPage() {
  const { id } = useParams<{ id: string }>();
  const [docusealSlug, setDocusealSlug] = useState<string>('');
  const [jobId, setJobId] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [signed, setSigned] = useState(false);
  // INV-0/INV-3/INV-4: the post-sign screen renders the ACTIVE saved popup (token-resolved).
  // Falls back to the code seed if no active row resolves — the signed screen is never blank.
  const [popupHtml, setPopupHtml] = useState<string>('');

  useEffect(() => {
    loadSigningData();
  }, [id]);

  /**
   * Resolve the post-sign screen: the ACTIVE saved popup (DB) → token-resolved HTML.
   * No active row (or a DB error) → the code seed, also token-resolved. Never blank (INV-3).
   * Tokens resolve at SIGN time, here, from the signed submission + its job (INV-4).
   */
  const resolveActivePopup = async (name: string, jId: string) => {
    let ctx: { clientName?: string; propertyAddress?: string; jobNumber?: string } = { clientName: name };
    if (jId) {
      const { data: job } = await supabase
        .from('job_submissions')
        .select('*')
        .eq('id', jId)
        .maybeSingle();
      if (job) {
        ctx = {
          clientName: name,
          propertyAddress: (job as Record<string, unknown>).property_address as string | undefined,
          jobNumber: (job as Record<string, unknown>).job_number as string | undefined,
        };
      }
    }
    const active = await loadActivePopupTemplate();
    const baseHtml = active?.body_html ?? POPUP_SEED_BODY;
    setPopupHtml(resolvePopupTokens(baseHtml, ctx));
  };

  const loadSigningData = async () => {
    try {
      // Get the submission data from database
      const { data, error } = await supabase
        .from('loe_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error('Submission not found');
      }

      // Check if already signed
      if (data.status === 'signed') {
        setJobId(data.job_id || '');
        setClientName(data.client_name || '');
        setSigned(true);
        setLoading(false);
        // Reopening an already-signed link → render the active popup (token-resolved).
        void resolveActivePopup(data.client_name || '', data.job_id || '');
        return;
      }

      // Set the data for display
      setJobId(data.job_id || '');
      setDocusealSlug(data.docuseal_slug);
      setClientName(data.client_name);
      setLoading(false);
    } catch (error: any) {
      console.error('Error loading signing data:', error);
      setError(error.message || 'Failed to load document');
      setLoading(false);
    }
  };

  const handleSigningComplete = async () => {
    setSigned(true);
    // Render the active popup as the post-sign screen (token-resolved); never blank (INV-0/3/4).
    void resolveActivePopup(clientName, jobId);
    const signedAt = new Date().toISOString();
    // Mark the signing record itself signed
    await supabase
      .from('loe_submissions')
      .update({ status: 'signed', signed_at: signedAt })
      .eq('id', id);
    // Backup status-advance: flip the linked DASHBOARD job to "signed" directly, so the
    // dashboard reflects the signature even if the DocuSeal webhook doesn't fire. The webhook
    // (when registered) still does the heavier ClickUp / SharePoint / payment work.
    if (jobId) {
      await supabase.from('job_submissions').update({ status: 'loe_signed' }).eq('id', jobId);
      await supabase
        .from('job_loe_details')
        .update({ signed_at: signedAt, job_status: 'loe_signed' })
        .eq('job_id', jobId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg">Loading your Letter of Engagement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (signed) {
    // INV-0: the post-sign screen IS the ACTIVE saved popup (DB-driven, token-resolved),
    // rendered standalone in a full-height iframe — the same way the email previews render.
    // popupHtml is resolved by resolveActivePopup() and is never blank (INV-3 fallback to
    // the code seed). While it resolves on the very first paint, show the seed token-resolved
    // so there is no flash of blank.
    const srcDoc = popupHtml || resolvePopupTokens(POPUP_SEED_BODY, { clientName });
    return (
      <iframe
        srcDoc={srcDoc}
        title="Signing complete"
        sandbox="allow-same-origin"
        style={{ border: 'none', width: '100%', height: '100vh', display: 'block' }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Valta branding */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-[#2c5aa0]">VALTA</span>
              <span className="ml-2 text-lg">Property Valuations</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">

          {/* DocuSeal Signature Widget — shows the full paginated document + signature block (no separate HTML copy) */}
          <div className="p-8">
            <h3 className="text-lg font-semibold mb-4">
              Please review and sign your Letter of Engagement below
            </h3>

            <DocusealForm
              src={`https://docuseal.com/s/${docusealSlug}`}
              onComplete={handleSigningComplete}
              style={{ 
                width: '100%',
                minHeight: '400px',
                border: 'none'
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Valta Property Valuations Ltd. All rights reserved.</p>
          <p className="mt-2">
            Questions? Call us at (403) 555-0100 or email info@valta.ca
          </p>
        </footer>
      </div>
    </div>
  );
}
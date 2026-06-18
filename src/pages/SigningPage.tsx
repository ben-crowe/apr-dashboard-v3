import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DocusealForm } from '@docuseal/react';
import { supabase } from '@/integrations/supabase/client';

export function SigningPage() {
  const { id } = useParams<{ id: string }>();
  const [docusealSlug, setDocusealSlug] = useState<string>('');
  const [jobId, setJobId] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    loadSigningData();
  }, [id]);

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
        setSigned(true);
        setLoading(false);
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
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
            <p className="text-lg text-gray-600">
              Your Letter of Engagement has been successfully signed.
            </p>
            <p className="text-gray-500 mt-4">
              You will receive a copy of the signed document via email shortly.
            </p>
          </div>
        </div>
      </div>
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
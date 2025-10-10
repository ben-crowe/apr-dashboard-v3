import React, { useState } from 'react';
import { generateAndSendLOE } from '@/utils/loe/generateLOE';
import { DetailJob, JobDetails } from '@/types/job';
import { Button } from '@/components/ui/button';

export default function TestLOE() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sendTestLOE = async () => {
    setLoading(true);
    
    // Pre-filled test data - same structure as real form
    const testJob: DetailJob = {
      id: 'test-' + Date.now(),
      jobNumber: 'TEST-' + Date.now().toString().slice(-6),
      clientFirstName: 'Test',
      clientLastName: 'Client',
      clientEmail: 'bc@crowestudio.com', // Your email for testing
      clientPhone: '403-555-0123',
      clientOrganization: 'Test Company Inc.',
      clientTitle: 'CEO',
      clientAddress: '123 Test Street, Calgary, AB T2P 1A1',
      propertyAddress: '456 Property Ave, Calgary, AB T3A 2B3',
      propertyType: 'Commercial',
      intendedUse: 'Financing',
      notes: 'This is a test LOE for DocuSeal integration',
      status: 'submitted',
      createdAt: new Date().toISOString()
    };

    const testJobDetails: JobDetails = {
      jobNumber: 'VAL' + Date.now().toString().slice(-6),
      appraisalFee: 5000,
      scopeOfWork: 'Full Appraisal',
      valuationPremises: 'Market Value',
      propertyRightsAppraised: 'Fee Simple',
      reportType: 'Full Narrative Report',
      deliveryDate: '15 business days',
      paymentTerms: 'Net 30 days',
      retainerAmount: '50%',
      specialInstructions: 'Test LOE - please ignore'
    };

    try {
      console.log('🚀 Sending test LOE with pre-filled data...');
      const result = await generateAndSendLOE(testJob, testJobDetails);
      setResult(result);
      console.log('✅ Test LOE sent!', result);
    } catch (error) {
      console.error('❌ Error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Test LOE Sender</h1>
      
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>What this does:</strong></p>
        <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
          <li>Sends a pre-filled LOE to bc@crowestudio.com</li>
          <li>Uses the SAME template (1730610) as production</li>
          <li>Uses the SAME code as production</li>
          <li>Just skips the form filling part!</li>
        </ul>
      </div>

      <Button 
        onClick={sendTestLOE} 
        disabled={loading}
        style={{ width: '100%', padding: '12px' }}
      >
        {loading ? 'Sending Test LOE...' : 'Send Test LOE (Pre-filled)'}
      </Button>

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: result.error ? '#fee' : '#efe', borderRadius: '8px' }}>
          {result.error ? (
            <div>
              <strong>Error:</strong> {result.error}
            </div>
          ) : (
            <div>
              <strong>Success!</strong><br/>
              Signing Link: <a href={result.signingLink} target="_blank">{result.signingLink}</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
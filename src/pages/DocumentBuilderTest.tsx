import React, { useState } from 'react';
import { DocumentEditor, JobData } from '../components/DocumentBuilder/DocumentEditor';
import '../components/DocumentBuilder/styles/editor.css';

// Mock job data for testing
const mockJobData: JobData = {
  id: 'test-job-001',
  dateCreated: '2025-09-06',
  jobNumber: 'CAL2401',
  
  // Client Info
  clientName: 'John Smith',
  clientEmail: 'john.smith@example.com',
  clientPhone: '(403) 555-0123',
  companyName: 'Capital Holdings LLC',
  clientAddress: '456 Tower Road SW, Calgary, AB T2T 4H8',
  clientTitle: 'VP of Real Estate',
  
  // Property Details
  propertyAddress: '123 Main Street, Calgary, AB T2P 1J9',
  propertyType: 'Residential Single Family',
  notes: 'Unit 205, Corner lot with mountain views',
  
  // Valuation Details
  intendedUse: 'Mortgage Financing',
  requestedValue: 'Market Value',
  propertyRights: 'Fee Simple',
  reportType: 'Narrative Report',
  appraisalFee: '2500',
  retainerAmount: '1250',
  paymentTerms: 'Due on Receipt',
  scopeOfWork: 'The scope of work includes a complete interior and exterior inspection of the subject property, analysis of comparable sales within the neighborhood, and application of the Cost and Direct Comparison approaches to value.',
  reportDelivery: '7-10 business days from inspection date'
};

const DocumentBuilderTest: React.FC = () => {
  const [savedContent, setSavedContent] = useState<string>('');
  const [showSavedAlert, setShowSavedAlert] = useState(false);
  
  const handleSave = async (html: string, metadata: any) => {
    console.log('Saving document:', { html, metadata });
    setSavedContent(html);
    setShowSavedAlert(true);
    
    // Simulate async save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Hide alert after 3 seconds
    setTimeout(() => setShowSavedAlert(false), 3000);
  };
  
  const handleSend = (html: string) => {
    console.log('Sending to DocuSeal:', html);
    alert('Document would be sent to DocuSeal!\n\nCheck console for HTML output.');
  };
  
  return (
    <div className="document-builder-test-page">
      {/* Success Alert */}
      {showSavedAlert && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Document saved successfully!
        </div>
      )}
      
      {/* Test Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-lg font-semibold text-blue-900">Document Builder Test Page</h1>
          <p className="text-sm text-blue-700">
            Testing standalone component with mock data. Try editing text, inserting fields, and switching templates.
          </p>
        </div>
      </div>
      
      {/* Document Editor */}
      <DocumentEditor
        jobData={mockJobData}
        documentType="LOE"
        onSave={handleSave}
        onSend={handleSend}
      />
      
      {/* Debug Panel (Optional) */}
      {savedContent && (
        <details className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 max-h-48 overflow-auto">
          <summary className="cursor-pointer font-semibold text-gray-700">
            Debug: Last Saved Content (click to expand)
          </summary>
          <pre className="mt-2 text-xs text-gray-600 overflow-auto">
            {savedContent}
          </pre>
        </details>
      )}
    </div>
  );
};

export default DocumentBuilderTest;
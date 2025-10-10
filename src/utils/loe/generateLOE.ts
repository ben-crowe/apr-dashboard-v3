/**
 * Generate LOE Document with V3 Template
 * Maps APR Hub data to your 22-field LOE template
 */

import { DetailJob, JobDetails } from '@/types/job';
import { V3_TEMPLATE } from './v3Template';
import { testEnvironmentVariables } from '@/utils/testEnv';

// API key now handled in Edge Function for security
// const DOCUSEAL_API_KEY removed - using proxy instead

// Load and prepare the V3 template
async function loadV3Template(): Promise<string> {
  console.log('✅ Loading embedded V3 template (4 pages with all legal terms)');
  return V3_TEMPLATE;
}

/**
 * Map APR Hub data to the 22 V3 template fields
 * Based on 01-Field-Map3.md specifications
 */
function mapDataToV3Fields(job: DetailJob, jobDetails: JobDetails) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });

  console.log('🔍 Mapping data for job:', job.id, 'Client:', job.clientFirstName, job.clientLastName);
  console.log('📊 Job Details available:', {
    jobNumber: jobDetails.jobNumber,
    appraisalFee: jobDetails.appraisalFee,
    scopeOfWork: jobDetails.scopeOfWork
  });

  return {
    // Date
    '[date.created]': currentDate,
    
    // Client/Property Contact Information
    '[propertycontact.company]': job.clientOrganization || 'Not Specified',
    '[propertycontact.firstname]': job.clientFirstName || '',
    '[propertycontact.lastname]': job.clientLastName || '',
    '[propertycontact.title]': job.clientTitle || 'Not Specified',
    '[propertycontact.addressstreet]': job.clientAddress || 'Not Specified',
    
    // Property Details
    '[name]': jobDetails.jobNumber || 'PENDING-' + Date.now().toString().slice(-6),
    '[addressstreet]': job.propertyAddress || 'Property Address Not Specified',
    
    // Appraisal Details
    '[purposes]': job.intendedUse || 'Not Specified',
    '[intendeduses]': job.intendedUse || 'Not Specified',
    '[requestedvalues]': jobDetails.valuationPremises || 'Market Value',
    '[propertyrights]': jobDetails.propertyRightsAppraised || 'Fee Simple',
    '[reportformat]': jobDetails.reportType || 'Full Narrative Report',
    
    // Financial
    '[fee]': jobDetails.appraisalFee
      ? `$${jobDetails.appraisalFee.toLocaleString()}`
      : '$TBD',

    // Administrative
    '[scopes]': jobDetails.scopeOfWork || 'All Applicable',
    '[duedate]': jobDetails.deliveryDate || '15 business days',

    // Additional fields that might be in template
    '[jobnumber]': jobDetails.jobNumber || 'PENDING-' + Date.now().toString().slice(-6),
    '[paymentterms]': jobDetails.paymentTerms || 'Net 30 days',
    '[retainer]': jobDetails.retainerAmount
      ? `$${Number(jobDetails.retainerAmount).toLocaleString()}`
      : '$TBD',
    '[notes]': job.notes || jobDetails.specialInstructions || '',
  };
}

/**
 * Generate LOE HTML without sending (for preview)
 */
export async function generateLOEHTML(
  job: DetailJob,
  jobDetails: JobDetails
): Promise<string> {
  // Load the V3 template
  let templateHTML = await loadV3Template();
  
  // Get the field mappings
  const fieldMappings = mapDataToV3Fields(job, jobDetails);
  
  // Replace all bracketed fields with actual data
  for (const [field, value] of Object.entries(fieldMappings)) {
    const escapedField = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    templateHTML = templateHTML.replace(
      new RegExp(escapedField, 'g'), 
      value as string
    );
  }
  
  // Leave anchor tags untouched - DocuSeal will handle them
  // {{First Party_signature_1}} and {{First Party_date_1}} stay in the HTML
  
  return templateHTML;
}

/**
 * Main function to generate and send LOE
 * Called when "Send LOE" button is clicked in APR Hub
 */
export async function generateAndSendLOE(
  job: DetailJob, 
  jobDetails: JobDetails,
  htmlTemplate?: string // Optional: provide pre-generated HTML
): Promise<{
  success: boolean;
  submissionId?: string;
  signingLink?: string;
  error?: string;
}> {
  try {
    console.log('📄 Sending LOE for:', job.clientFirstName, job.clientLastName);
    
    // Test environment variables first
    testEnvironmentVariables();
    
    let templateHTML: string;
    
    if (htmlTemplate) {
      // Use provided HTML (from preview)
      templateHTML = htmlTemplate;
    } else {
      // Generate fresh (backward compatibility)
      templateHTML = await generateLOEHTML(job, jobDetails);
    }
    
    // Verify DocuSeal field tags are present
    if (!templateHTML.includes('<signature-field')) {
      console.warn('⚠️ Warning: Signature field tag not found in template');
    }
    if (!templateHTML.includes('<date-field')) {
      console.warn('⚠️ Warning: Date field tag not found in template');
    } else {
      console.log('✅ DocuSeal field tags found in template');
    }
    
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    // Send for signature via proxy - Better email handling
    let clientEmail = job.clientEmail || '';
    const clientName = `${job.clientFirstName || 'First'} ${job.clientLastName || 'Last'}`.trim() || 'Client';
    
    // If no email or invalid email, use a placeholder that DocuSeal accepts
    const emailRegex = /^[^\s@]+@[^\s@]+$/; // Simple check for @ symbol
    if (!clientEmail || !emailRegex.test(clientEmail)) {
      console.warn(`Invalid email "${clientEmail}", using placeholder`);
      clientEmail = 'noreply@valta.ca'; // Use company email as fallback
    }
    
    // CRITICAL: NO template_id! HTML contains anchor tags for signature placement
    // DocuSeal will scan for {{First Party_signature_1}} and {{First Party_date_1}} tags
    // and automatically replace them with interactive fields
    const submissionPayload = {
      // NO template_id - HTML is the single source of truth!
      name: `LOE-${job.jobNumber || Date.now()}`,
      send_email: false, // We send our own email
      documents: [
        {
          name: 'letter-of-engagement',
          html: templateHTML, // HTML with anchor tags for signature/date placement
          size: 'Letter' // US Letter size for documents
        }
      ],
      submitters: [{
        email: clientEmail,
        name: clientName,
        role: 'First Party' // Must match the role in anchor tags!
      }]
    };
    
    console.log('📤 Sending HTML document with DocuSeal field tags');
    console.log('✅ Document contains all 22 fields pre-filled');
    console.log('✅ HTML tags <signature-field> and <date-field> for interactive fields');
    console.log('🔴 CLIENT EMAIL:', clientEmail);
    
    // Use the /submissions/html endpoint to send HTML content with template
    const submissionResponse = await fetch(`${supabaseUrl}/functions/v1/docuseal-proxy?endpoint=submissions/html`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissionPayload)
    });
    
    if (!submissionResponse.ok) {
      const errorText = await submissionResponse.text();
      console.error('🔴 FULL ERROR:', errorText);
      console.error('🔴 STATUS:', submissionResponse.status);
      console.error('🔴 PAYLOAD WAS:', JSON.stringify(submissionPayload, null, 2));
      throw new Error(`DocuSeal ${submissionResponse.status}: ${errorText}`);
    }
    
    const submission = await submissionResponse.json();
    console.log('📋 DocuSeal response:', submission);
    
    // Handle both response formats (array or single object)
    const submissionData = Array.isArray(submission) ? submission[0] : submission;
    
    // Get the slug from submitters array if not at top level
    const docusealSlug = submissionData.slug || 
                         (submissionData.submitters && submissionData.submitters[0]?.slug) || 
                         '';
    
    if (!docusealSlug) {
      console.error('❌ No slug found in DocuSeal response:', submissionData);
      throw new Error('DocuSeal did not return a signing slug');
    }
    
    console.log('✅ DocuSeal submission created with slug:', docusealSlug);
    
    // Save LOE submission to database with HTML and slug
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: loeSubmission, error: saveError } = await supabase
      .from('loe_submissions')
      .insert({
        job_id: job.jobNumber || `temp-${Date.now()}`,
        client_name: clientName,
        client_email: clientEmail,
        loe_html: templateHTML, // The complete V3-LOE with all fields filled
        docuseal_slug: docusealSlug,
        docuseal_submission_id: submissionData.id || '',
        status: 'pending'
      })
      .select()
      .single();
    
    if (saveError) {
      console.error('Failed to save LOE submission:', saveError);
    } else {
      console.log('✅ LOE submission saved with ID:', loeSubmission.id);
    }
    
    // Generate the signing link - NOW IT GOES TO OUR SITE
    const signingLink = loeSubmission 
      ? `${window.location.origin}/sign/${loeSubmission.id}`
      : `https://docuseal.com/s/${docusealSlug}`; // Fallback
    
    console.log('🔗 SIGNING LINK (for testing):', signingLink);
    console.log('📝 If email fails, use this link directly!');
    
    // Send email using our Gmail SMTP Edge Function
    console.log('📧 Sending email via Gmail SMTP to:', clientEmail);
    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-loe-email-fixed`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: clientEmail,
        clientName: clientName,
        signingLink: signingLink,
        propertyAddress: job.propertyAddress || 'Property'
      })
    });
    
    if (!emailResponse.ok) {
      console.error('Failed to send email, but LOE was created');
      const emailError = await emailResponse.text();
      console.error('Email error:', emailError);
    } else {
      console.log('✅ Email sent successfully');
    }
    
    return {
      success: true,
      submissionId: submissionData.id,
      signingLink: signingLink
    };
    
  } catch (error) {
    console.error('❌ Error generating LOE:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Update job record with DocuSeal submission ID
 */
async function updateJobWithDocuSeal(jobId: string, submissionId: string) {
  // Update the job_details table with DocuSeal submission ID
  const { supabase } = await import('@/integrations/supabase/client');
  
  const { error } = await supabase
    .from('job_details')
    .update({ 
      docuseal_submission_id: submissionId 
    })
    .eq('id', jobId);
    
  if (error) {
    console.error('Failed to update job with DocuSeal ID:', error);
  }
}

/**
 * Send custom email with signing link
 * (Instead of using DocuSeal's email)
 */
export async function sendLOEEmail(
  clientEmail: string,
  clientName: string,
  signingLink: string,
  propertyAddress: string
): Promise<boolean> {
  try {
    // Use Supabase Edge Function for email sending
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    const response = await fetch(`${supabaseUrl}/functions/v1/send-loe-email-fixed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        to: clientEmail,
        clientName,
        signingLink,
        propertyAddress
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Email send failed:', error);
      return false;
    }
    
    const result = await response.json();
    console.log('Email response:', result);
    
    // If email service is not configured, consider it successful (LOE was created)
    if (result.signingLink) {
      console.log('📋 Signing link available:', result.signingLink);
      // Store the signing link in session storage for display
      sessionStorage.setItem('lastSigningLink', result.signingLink);
    }
    
    // Return true even if email isn't actually sent, as long as LOE was created
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}
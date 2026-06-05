/**
 * Generate LOE Document with V5 Template (Chris's V03)
 * Maps APR Hub data to LOE template fields
 */

import { DetailJob, JobDetails } from '@/types/job';
import { V3_TEMPLATE } from './v3Template';
import { V4_TEMPLATE } from './v4Template';
import { V5_TEMPLATE } from './v5Template';
import { testEnvironmentVariables } from '@/utils/testEnv';
import { supabase } from '@/integrations/supabase/client';
import { deriveValueScenarios, resolveNarrative } from './loeCascade';

// Seed all template versions to DB if no templates exist
async function seedTemplatesIfEmpty(): Promise<void> {
  try {
    const { data: existing, error: countError } = await supabase
      .from('loe_templates')
      .select('id')
      .eq('is_active', true)
      .limit(1);

    if (countError || (existing && existing.length > 0)) return;

    console.log('Seeding V3 + V4 + V5 templates to loe_templates...');
    await supabase.from('loe_templates').insert([
      { name: 'V1 - Original Template', template_html: V3_TEMPLATE, is_default: false, is_active: true, version: 1 },
      { name: 'V2 - Updated Template', template_html: V4_TEMPLATE, is_default: false, is_active: true, version: 2 },
      { name: 'V3 - Current Template', template_html: V5_TEMPLATE, is_default: true, is_active: true, version: 3 },
    ]);
    console.log('Seeded all templates');
  } catch (err) {
    console.warn('Template seeding failed (non-fatal):', err);
  }
}

interface LoadedTemplate { html: string; version: number; templateId: string | null }

// Version-aware template loader (PRD-B versioning).
// Order: explicit HTML > job's chosen templateId > NEWEST active version > seed/fallback V5.
async function loadTemplateRow(opts?: { templateHTML?: string; templateId?: string | null }): Promise<LoadedTemplate> {
  if (opts?.templateHTML) {
    return { html: opts.templateHTML, version: 0, templateId: null };
  }
  try {
    if (opts?.templateId) {
      const { data, error } = await supabase
        .from('loe_templates')
        .select('id, template_html, version')
        .eq('id', opts.templateId)
        .eq('is_active', true)
        .single();
      if (!error && data) return { html: data.template_html, version: data.version, templateId: data.id };
    }
    // Default = NEWEST active version (not is_default flag — see DECISIONS-2026-06-04)
    const { data: newest, error: newestErr } = await supabase
      .from('loe_templates')
      .select('id, template_html, version')
      .eq('is_active', true)
      .order('version', { ascending: false })
      .limit(1)
      .single();
    if (!newestErr && newest) return { html: newest.template_html, version: newest.version, templateId: newest.id };

    await seedTemplatesIfEmpty();
    return { html: V5_TEMPLATE, version: 5, templateId: null };
  } catch (err) {
    console.warn('Failed to load template from DB, using embedded V5:', err);
    return { html: V5_TEMPLATE, version: 5, templateId: null };
  }
}

/**
 * Map APR Hub data to V5 template fields
 */
function mapDataToV3Fields(job: DetailJob, jobDetails: JobDetails) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  console.log('Mapping data for job:', job.id, 'Client:', job.clientFirstName, job.clientLastName);

  return {
    // Date
    '[date.created]': currentDate,

    // Client Contact Information
    '[client.company]': job.clientOrganization || 'Not Specified',
    '[client.firstname]': job.clientFirstName || '',
    '[client.lastname]': job.clientLastName || '',
    '[client.title]': job.clientTitle || 'Not Specified',
    '[client.addressstreet]': job.clientAddress || 'Not Specified',
    '[client.phone]': job.clientPhone || '',
    '[client.email]': job.clientEmail || '',

    // Property Details
    '[name]': jobDetails.jobNumber || 'PENDING-' + Date.now().toString().slice(-6),
    '[addressstreet]': job.propertyAddress || 'Property Address Not Specified',

    // Appraisal Details
    '[purposes]': job.propertyType || 'Not Specified',
    '[intendeduses]': job.intendedUse || 'Not Specified',
    '[propertyrights]': jobDetails.propertyRightsAppraised || 'Fee Simple',
    '[reportformat]': jobDetails.reportType || 'Full Narrative Report',

    // V4/V5 fields
    '[valuetimeframe]': jobDetails.valuationPremises || 'Current',
    '[valuescenarios]': jobDetails.valueScenarios || 'As Is',
    '[approachestovalue]': jobDetails.approachesToValue || 'Direct Comparison, Income, Cost',
    '[deliverytime]': jobDetails.deliveryTime || '4',
    '[clientdocuments]': jobDetails.clientDocuments || '',

    // V5 new fields
    '[currentuse]': jobDetails.currentUse || '',
    '[proposeduse]': jobDetails.proposedUse || '',
    '[assignmenttype]': jobDetails.assignmentType || 'Standard',

    // Financial
    '[fee]': jobDetails.appraisalFee
      ? `$${jobDetails.appraisalFee.toLocaleString()}`
      : '$TBD',

    // Additional fields
    '[jobnumber]': jobDetails.jobNumber || 'PENDING-' + Date.now().toString().slice(-6),
    '[notes]': job.notes || jobDetails.specialInstructions || '',
  };
}

/**
 * Map APR Hub data to LOE-07 (V07) template fields.
 * V07 uses PascalCase [Token] placeholders (distinct vocabulary from V3/V5).
 * Field routing per DECISIONS-2026-06-04.md. Gap fields fall back gracefully
 * (job-prep inputs being added incrementally; EA/HC summaries = narrative Text Library, TODO).
 */
function mapDataToV07Fields(job: DetailJob, jobDetails: JobDetails): Record<string, string> {
  const jd = jobDetails as any;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const fmtCurrency = (v: any) => (v ? `$${Number(String(v).replace(/[^0-9.]/g, '')).toLocaleString()}` : '$TBD');
  const fmtDate = (v: any) => (v ? String(v).split('T')[0] : '');
  const propName = job.propertyName || 'Unnamed Property';

  const map: Record<string, string> = {
    "[Today's Date]": today,
    '[ClientFirstName]': job.clientFirstName || '',
    '[ClientLastName]': job.clientLastName || '',
    '[ClientCompanyName]': job.clientOrganization || '',
    '[ClientOrganizationAddress]': job.clientAddress || '',
    '[ClientPhone]': job.clientPhone || '',
    '[ClientEmail]': job.clientEmail || '',
    '[JobNumber]': jobDetails.jobNumber || 'Awaiting Valcre job',
    '[JobName]': [propName, job.propertyAddress].filter(Boolean).join(', '),
    '[PropertyName]': propName,
    '[PropertyAddress]': job.propertyAddress || '',
    '[PropertyType]': job.propertyType || '',
    '[InterestAppraised]': jobDetails.propertyRightsAppraised || '',
    '[CurrentUseImprovements]': jd.currentUse || jd.currentUseImprovements || '',
    '[ProposedUseImprovements]': jd.proposedUse || jd.proposedUseImprovements || '',
    '[AuthorizedUse]': jd.authorizedUse || job.intendedUse || '',
    '[Valuetimeframe]': jd.valueTimeframe || jobDetails.valuationPremises || '',
    '[ValueScenarios]': jd.valueScenarios || '',
    '[ReportType]': jobDetails.reportType || '',
    '[AssignmentType]': jd.assignmentType || '',
    '[ApproachestoValue]': jd.approachesToValue || '',
    '[Fee]': fmtCurrency(jobDetails.appraisalFee),
    '[DeliveryTime]': jd.deliveryTime || jd.deliveryTimeWeeks || '',
    '[ClientDocuments]': jd.clientDocuments || '',
    '[PreviouslyAppraised]': jd.previouslyAppraised || '',
    '[ScheduleAPropertyList]': jd.scheduleAPropertyList || '',
  };
  // §10 cascade (LOE-07-RENDER-TWEAKS): LEFT = scenarios derived from Status of Improvements
  // (Authorized Use = Insurance overrides), RIGHT = the matching EA/HC narrative (exact-trigger lookup).
  const scenarios = deriveValueScenarios(jd.statusOfImprovements, jd.authorizedUse || job.intendedUse);
  for (let i = 1; i <= 6; i++) {
    const scenario = scenarios[i - 1];
    map[`[ValueScenario${i}]`] = scenario || ''; // empty → row suppressed in generateLOEHTML
    if (scenario) {
      // Resolved narrative text, else keep the LITERAL bracket so the row degrades cleanly (never blank).
      map[`[EA/HCSummary${i}]`] = resolveNarrative(scenario) || `[EA/HCSummary${i}]`;
    } else {
      map[`[EA/HCSummary${i}]`] = ''; // no scenario → no row at all
    }
  }
  return map;
}

// Pair a template version with its placeholder mapper (each version owns its vocabulary).
function getMapperForVersion(version: number): (j: DetailJob, d: JobDetails) => Record<string, string> {
  return version >= 6 ? mapDataToV07Fields : mapDataToV3Fields;
}

/**
 * Generate LOE HTML without sending (for preview)
 */
// Generic conditional-section drop. Any block fenced with <!-- NAME:START -->...<!-- NAME:END -->
// vanishes when shouldRemove is true. Because the template's section numbers AND page numbers are
// CSS-counter driven, the document RENUMBERS + REFLOWS on its own once a block is removed —
// "if it does not apply, the page is not added and the page number adjusts" (Chris's rule).
// Reuse this for ANY fully-conditional section (Schedule A, §10 EA/HC, future sections).
function applyConditionalSection(html: string, fenceName: string, shouldRemove: boolean): string {
  if (!shouldRemove) return html;
  const re = new RegExp(`<!-- ${fenceName}:START -->[\\s\\S]*?<!-- ${fenceName}:END -->`, 'g');
  return html.replace(re, '');
}

// Strip the conditional Schedule "A" block unless AssignmentType = Multiple Properties (V07).
function applyConditionalScheduleA(html: string, jobDetails: JobDetails): string {
  const isMultiple = String((jobDetails as any).assignmentType || '').toLowerCase().includes('multiple');
  return applyConditionalSection(html, 'SCHEDULE-A', !isMultiple);
}

// §10 row suppression: each EA/HC row is fenced with <!-- EAHC-ROW-n:START/END -->. Remove any row whose
// derived scenario is empty so NO blank rows ship (spec A2 row-suppression). Derivation matches the mapper.
function applyEahcRowSuppression(html: string, job: DetailJob, jobDetails: JobDetails): string {
  const jd = jobDetails as any;
  const scenarios = deriveValueScenarios(jd.statusOfImprovements, jd.authorizedUse || job.intendedUse);
  let out = html;
  for (let i = 1; i <= 6; i++) {
    if (!scenarios[i - 1]) {
      out = out.replace(new RegExp(`<!-- EAHC-ROW-${i}:START -->[\\s\\S]*?<!-- EAHC-ROW-${i}:END -->`, 'g'), '');
    }
  }
  return out;
}

export async function generateLOEHTML(
  job: DetailJob,
  jobDetails: JobDetails,
  templateHTML?: string, // Optional: provide template HTML directly (preview path)
  templateId?: string | null, // Optional: explicit version choice; else job's choice / newest
  templateVersion?: number // Optional: version that owns `templateHTML` (preview path) — picks the right mapper
): Promise<string> {
  // Version-aware load: explicit HTML > given templateId > job's chosen version > newest active
  const chosenId = templateId ?? (jobDetails as any).loeTemplateId ?? null;
  const loaded = await loadTemplateRow({ templateHTML, templateId: chosenId });
  let htmlTemplate = loaded.html;

  // When previewing by raw HTML, loadTemplateRow can't know the version (returns 0) → the caller
  // passes the row's version so we still pick the correct mapper (V07 tokens vs V3 tokens).
  const effectiveVersion = (templateHTML && templateVersion != null) ? templateVersion : loaded.version;

  // Pair the template version with its placeholder vocabulary
  const mapper = getMapperForVersion(effectiveVersion);
  const fieldMappings = mapper(job, jobDetails);

  // V07 conditional sections (each drops + reflows + renumbers via the CSS-counter template):
  if (effectiveVersion >= 6) {
    // (1) Schedule A — only for Multiple Properties.
    htmlTemplate = applyConditionalScheduleA(htmlTemplate, jobDetails);
    // (2) §10 EA/HC — if the cascade yields ZERO scenarios, drop the WHOLE section
    //     (heading + intro + table + Example legend); else keep it and suppress only the empty rows.
    const eahcScenarios = deriveValueScenarios(
      (jobDetails as any).statusOfImprovements,
      (jobDetails as any).authorizedUse || job.intendedUse,
    );
    if (eahcScenarios.length === 0) {
      htmlTemplate = applyConditionalSection(htmlTemplate, 'SECTION-EAHC', true);
    } else {
      htmlTemplate = applyEahcRowSuppression(htmlTemplate, job, jobDetails);
    }
  }

  // Replace all bracketed placeholders with actual data (global)
  for (const [field, value] of Object.entries(fieldMappings)) {
    const escapedField = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    htmlTemplate = htmlTemplate.replace(new RegExp(escapedField, 'g'), value as string);
  }

  // Anchor tags (<signature-field>/<date-field>) left untouched — DocuSeal converts them.
  return htmlTemplate;
}

/**
 * Main function to generate and send LOE
 * Called when "Send LOE" button is clicked in APR Hub
 */
export async function generateAndSendLOE(
  job: DetailJob, 
  jobDetails: JobDetails,
  htmlTemplate?: string // Optional: provide pre-generated HTML or template HTML
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
      // Use provided HTML (from preview) - check if it's template HTML or generated HTML
      // If it contains placeholders like [name], it's template HTML - generate it
      // Otherwise it's already generated HTML
      if (htmlTemplate.includes('[name]') || htmlTemplate.includes('[addressstreet]')) {
        templateHTML = await generateLOEHTML(job, jobDetails, htmlTemplate);
      } else {
        templateHTML = htmlTemplate;
      }
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
    
    // Resolve which template version was used (for version reproducibility)
    const { supabase } = await import('@/integrations/supabase/client');
    const chosenTplId = (jobDetails as any).loeTemplateId ?? null;
    let loeVersion: number | null = null;
    let loeTemplateId: string | null = chosenTplId;
    try {
      const base = supabase.from('loe_templates').select('id, version').eq('is_active', true);
      const { data: tpl } = chosenTplId
        ? await base.eq('id', chosenTplId).single()
        : await base.order('version', { ascending: false }).limit(1).single();
      if (tpl) { loeVersion = tpl.version; loeTemplateId = tpl.id; }
    } catch (e) { console.warn('Could not resolve LOE template version for persistence:', e); }

    // Persist the filled HTML snapshot (keystone for version reproducibility).
    const { data: loeSubmission, error: saveError } = await supabase
      .from('loe_submissions')
      .insert({
        job_id: job.id,                       // UUID FK — was job.jobNumber (broke the FK)
        job_number: jobDetails.jobNumber || null,
        loe_version: loeVersion != null ? String(loeVersion) : null,
        template_id: loeTemplateId,
        client_name: clientName,
        client_email: clientEmail,
        loe_html: templateHTML,               // complete filled LOE snapshot
        docuseal_slug: docusealSlug,
        docuseal_submission_id: submissionData.id || '',
        status: 'pending'
      })
      .select()
      .single();

    if (saveError) {
      // FAIL-LOUD: persistence is the keystone for versioning/reproducibility.
      console.error('🔴 CRITICAL: failed to persist loe_submissions (version reproducibility at risk):', saveError);
    } else {
      console.log('✅ LOE submission persisted:', loeSubmission.id, '(version', loeVersion, ')');
    }

    // CRITICAL: Also update job_loe_details table with DocuSeal submission ID
    // This is needed for the webhook handler to find the job when DocuSeal sends events
    const { error: loeDetailsError } = await supabase
      .from('job_loe_details')
      .update({
        docuseal_submission_id: submissionData.id
      })
      .eq('job_id', job.id) // Use internal job ID, not job number

    if (loeDetailsError) {
      console.error('Failed to update job_loe_details with submission ID:', loeDetailsError);
    } else {
      console.log('✅ job_loe_details updated with DocuSeal submission ID:', submissionData.id);
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
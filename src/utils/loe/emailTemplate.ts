/**
 * LOE send-email template system — the editable email cover-note that carries the
 * signing link to the client.
 *
 * TWO separate objects (this separation is what enforces "editing one send never
 * changes the default"):
 *   - email_templates    — settings-scoped MANAGED DEFAULT (one source of truth: subject + body).
 *                          Freely editable (a low-stakes cover note, NOT gated like the legal
 *                          contract). Safety net = reset-to-seed.
 *   - job_email_instances — job-scoped PER-SEND instance (mirrors job_contracts). Editing an
 *                          instance never touches the default row.
 *
 * MERGE TOKENS (visible in the editor, hard-locked):
 *   {{first_name}} {{last_name}} {{job_number}} {{property_address}}  resolve at EDIT time (job_submissions)
 *   {{signing_link}}                                                  resolves at SEND time only
 *                                                                     (the DocuSeal send produces it;
 *                                                                      it does not exist before send)
 *
 * The SEED below is the verbatim snapshot of the current hardcoded email in
 * supabase/functions/send-loe-email-fixed/index.ts (captured 2026-06-14, BEFORE the body
 * was lifted out of the function). It lives in CODE so reset-to-seed is always real and
 * immutable — a bad overwrite of the default can never be permanent.
 */
import { supabase } from "@/integrations/supabase/client";

export const EMAIL_MERGE_TOKENS = [
  { token: '{{first_name}}',       label: 'First name',       resolvesAt: 'edit' as const },
  { token: '{{last_name}}',        label: 'Last name',        resolvesAt: 'edit' as const },
  { token: '{{job_number}}',       label: 'Job number',       resolvesAt: 'edit' as const },
  { token: '{{property_address}}', label: 'Property address', resolvesAt: 'edit' as const },
  { token: '{{signing_link}}',     label: 'Signing link',     resolvesAt: 'send' as const },
];

/** The immutable recoverable seed — verbatim current email (subject + body). */
export const EMAIL_SEED_SUBJECT = 'Letter of Engagement - Ready for Signature';

export const EMAIL_SEED_BODY = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; color: #333;">
<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
<p>Hi {{first_name}},</p>
<p>Your Letter of Engagement for the property appraisal at {{property_address}} is ready for your review and signature.</p>
<p><a href="{{signing_link}}" style="background-color: #1a73e8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Review &amp; Sign Document</a></p>
<p>What happens next:</p>
<ul>
<li>Review the Letter of Engagement carefully</li>
<li>Sign the document electronically</li>
<li>You'll receive a copy for your records</li>
<li>We'll begin work on your appraisal immediately</li>
</ul>
<p>If you have any questions, please don't hesitate to contact us.</p>
<p>Best regards,</p>
<p><strong>Client Services Team</strong><br>
Valta Property Valuations Ltd.<br>
#300-4838 Richard Road SW, Calgary, AB T3E 6L1<br>
office: 587-801-5151 | email: clientcare@valta.ca | web: www.valta.ca</p>
</div>
</body>
</html>`;

export const DEFAULT_EMAIL_TEMPLATE_NAME = 'Default LOE Email';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailInstance {
  id: string;
  job_id: string;
  contract_id: string | null;
  recipient_email: string | null;
  subject: string;
  body_html: string;
  state: 'draft' | 'sent';
  docuseal_submission_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Load the managed default email template. Self-heals: if no default row exists yet
 * (fresh DB / migration seed missing), it seeds one from the code constant so the send
 * step always has a default to open on.
 */
export async function loadDefaultEmailTemplate(): Promise<EmailTemplate | null> {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('is_default', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('loadDefaultEmailTemplate failed:', error);
    return null;
  }
  if (data) return data as EmailTemplate;

  // Self-heal: seed the default from the code constant.
  const { data: seeded, error: seedErr } = await supabase
    .from('email_templates')
    .insert({
      name: DEFAULT_EMAIL_TEMPLATE_NAME,
      subject: EMAIL_SEED_SUBJECT,
      body_html: EMAIL_SEED_BODY,
      is_default: true,
    })
    .select('*')
    .single();
  if (seedErr) {
    console.error('loadDefaultEmailTemplate seed failed:', seedErr);
    return null;
  }
  return seeded as EmailTemplate;
}

/** Overwrite the managed default (Set Default). Never touches any per-send instance. */
export async function saveDefaultEmailTemplate(
  subject: string,
  bodyHtml: string,
): Promise<{ success: boolean; error?: string }> {
  const existing = await loadDefaultEmailTemplate();
  if (!existing) return { success: false, error: 'No default template row to update' };
  const { error } = await supabase
    .from('email_templates')
    .update({ subject, body_html: bodyHtml, updated_at: new Date().toISOString() })
    .eq('id', existing.id);
  return error ? { success: false, error: error.message } : { success: true };
}

/** Reset-to-seed: restore the managed default to the verbatim original (code constant). */
export async function resetDefaultEmailTemplateToSeed(): Promise<{ success: boolean; error?: string }> {
  return saveDefaultEmailTemplate(EMAIL_SEED_SUBJECT, EMAIL_SEED_BODY);
}

/** All per-send email instances for a job, newest first. */
export async function loadJobEmailInstances(jobId: string): Promise<EmailInstance[]> {
  if (!jobId) return [];
  const { data, error } = await supabase
    .from('job_email_instances')
    .select('*')
    .eq('job_id', jobId)
    .order('updated_at', { ascending: false });
  if (error) {
    console.error('loadJobEmailInstances failed:', error);
    return [];
  }
  return (data || []) as EmailInstance[];
}

export interface SaveEmailInstanceInput {
  id?: string;
  jobId: string;
  contractId?: string | null;
  recipientEmail?: string | null;
  subject: string;
  bodyHtml: string;
  state?: 'draft' | 'sent';
  docusealSubmissionId?: string | null;
}

/** Insert a new per-send email instance, or update one in place when `id` is given. */
export async function saveJobEmailInstance(
  input: SaveEmailInstanceInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const row: Record<string, unknown> = {
    job_id: input.jobId,
    contract_id: input.contractId ?? null,
    recipient_email: input.recipientEmail ?? null,
    subject: input.subject,
    body_html: input.bodyHtml,
    state: input.state ?? 'draft',
    docuseal_submission_id: input.docusealSubmissionId ?? null,
    updated_at: new Date().toISOString(),
  };
  if (input.id) {
    const { error } = await supabase.from('job_email_instances').update(row).eq('id', input.id);
    if (error) return { success: false, error: error.message };
    return { success: true, id: input.id };
  }
  const { data, error } = await supabase
    .from('job_email_instances')
    .insert(row)
    .select('id')
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, id: (data as { id: string } | null)?.id };
}

/**
 * Resolve EDIT-time tokens (everything except {{signing_link}}). Leaves {{signing_link}}
 * intact as a labelled placeholder — it only resolves at send.
 */
export function resolveEditTimeTokens(
  text: string,
  ctx: { firstName?: string; lastName?: string; jobNumber?: string; propertyAddress?: string },
): string {
  return text
    .replaceAll('{{first_name}}', ctx.firstName || '')
    .replaceAll('{{last_name}}', ctx.lastName || '')
    .replaceAll('{{job_number}}', ctx.jobNumber || '')
    .replaceAll('{{property_address}}', ctx.propertyAddress || 'your property');
}

/** Resolve the SEND-time {{signing_link}} token (the link only exists after the DocuSeal send). */
export function resolveSigningLink(text: string, signingLink: string): string {
  return text.replaceAll('{{signing_link}}', signingLink);
}

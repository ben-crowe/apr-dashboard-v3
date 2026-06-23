// Supabase Edge Function for DocuSeal Webhook
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { jobFolderInputs } from '../_shared/graph.ts'
import { fetchListFields, buildHubCustomFields, applyTaskFields } from '../_shared/clickup-fields.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ClickUp Configuration
const CLICKUP_API_TOKEN = Deno.env.get('CLICKUP_API_TOKEN') || 'pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY'

interface DocuSealWebhookPayload {
  event_type: 'submission.completed' | 'submission.created';
  data: {
    id: string;
    status: string;
    email: string;
    created_at: string;
    completed_at?: string;
    submitters?: Array<{
      name?: string;
      email?: string;
    }>;
    documents?: Array<{
      id: string;
      name: string;
      url: string;
    }>;
    submission_events?: Array<{
      event_type: string;
      event_timestamp: string;
    }>;
    metadata?: {
      job_id?: string;
      clickup_task_id?: string;
    };
  };
}

// Push the LOE Sent / LOE Signed DATE custom fields onto the ClickUp task.
//
// FIX B/C/D (2026-06-23, fullstack-dev): the old version rewrote the task DESCRIPTION with a
// "▸ LOE Sent / ▸ LOE Signed" text line. That was wrong on three counts:
//   - The dedicated LOE Sent / LOE Signed DATE custom fields were left EMPTY (they were never pushed)
//     — the timestamp only ever landed in the description text (Fix B).
//   - Writing the plain `description` field alongside `markdown_description` on the PUT flattened the
//     "[Quick Link](url)" markdown links in the body to plain text (Fix C).
//   - The "LOE Signed: <date> by <name>" line duplicated data the dedicated field now owns (Fix D).
//
// The fix: stop touching the description entirely. Resolve the LOE Sent / LOE Signed custom fields
// byName against the task's OWN list (works on BC test list now + Valta after replication) and push
// the timestamp via the per-field endpoint. buildHubCustomFields encodes date fields as unix-ms and
// set-replaces, so it's idempotent. The freshly-written loe_sent_at / signed_at are read from the DB
// row we just updated (passed in via the `job` object).
async function pushClickUpLOEDateFields(
  taskId: string,
  job: any
): Promise<void> {
  console.log(`Pushing LOE date custom fields to ClickUp task ${taskId}`)

  // Discover the task's list so we can resolve fields byName on whichever list it lives on.
  const getTaskResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': CLICKUP_API_TOKEN,
      'Content-Type': 'application/json'
    }
  })

  if (!getTaskResponse.ok) {
    throw new Error(`Failed to fetch ClickUp task: ${getTaskResponse.status}`)
  }

  const existingTask = await getTaskResponse.json()
  const listId = existingTask?.list?.id
  if (!listId) {
    console.log('ℹ️ No list id on task — skipping LOE date field push')
    return
  }

  const listFields = await fetchListFields(CLICKUP_API_TOKEN, listId)
  // Build the full hub field set from the fresh job row, then narrow to ONLY the two LOE date
  // fields — we don't want the webhook to re-touch every field on a sign event, just the dates.
  const allFields = buildHubCustomFields(job, listFields)
  const loeDateFields = allFields.filter(f => f.name === 'LOE Sent' || f.name === 'LOE Signed')

  if (!loeDateFields.length) {
    console.log('ℹ️ No LOE Sent/Signed columns on list', listId, '— nothing to push')
    return
  }

  const result = await applyTaskFields(CLICKUP_API_TOKEN, taskId, loeDateFields)
  console.log(`✅ LOE date fields pushed: set=${result.set} verified=${result.verified}/${result.total}`)
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: DocuSealWebhookPayload = await req.json()
    console.log('DocuSeal webhook received:', payload.event_type)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Handle submission.created event (Stage 2.5: LOE Sent)
    if (payload.event_type === 'submission.created') {
      const submissionId = payload.data.id
      console.log('LOE sent, submission ID:', submissionId)

      // Try to find job by submission_id first (production DocuSeal)
      let loeDetails = null
      let findError = null

      // First attempt: Look up by docuseal_submission_id
      const { data: loeBySubmission, error: err1 } = await supabase
        .from('job_loe_details')
        .select('job_id, clickup_task_id')
        .eq('docuseal_submission_id', submissionId)
        .single()

      if (loeBySubmission) {
        loeDetails = loeBySubmission
        console.log('Found job by docuseal_submission_id:', loeDetails.job_id)
      } else if (payload.data.metadata?.job_id) {
        // Second attempt: Use metadata.job_id (test mode)
        console.log('Trying metadata.job_id:', payload.data.metadata.job_id)
        const { data: loeByMetadata, error: err2 } = await supabase
          .from('job_loe_details')
          .select('job_id, clickup_task_id')
          .eq('job_id', payload.data.metadata.job_id)
          .single()

        if (loeByMetadata) {
          loeDetails = loeByMetadata
          console.log('Found job by metadata.job_id:', loeDetails.job_id)

          // Update the docuseal_submission_id now that we know it
          await supabase
            .from('job_loe_details')
            .update({ docuseal_submission_id: submissionId })
            .eq('job_id', loeDetails.job_id)
        } else {
          findError = err2
        }
      } else {
        findError = err1
      }

      if (findError || !loeDetails) {
        console.error('Could not find job for submission:', submissionId)
        // Don't fail - just log and continue
        return new Response(
          JSON.stringify({ success: true, message: 'Job not found, skipping ClickUp update' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }

      // Update LOE sent timestamp in database.
      // NOTE (Ben 2026-06-19): the Delivery Date auto-set/lock was REMOVED — Delivery Date is now a
      // live "today + deliveryTime weeks" estimate computed in the dashboard, not derived from
      // loe_sent_at. We still stamp loe_sent_at (used elsewhere); we no longer write delivery_date here.
      const sentAt = payload.data.created_at || new Date().toISOString()
      const { error: updateError } = await supabase
        .from('job_loe_details')
        .update({
          loe_sent_at: sentAt
        })
        .eq('job_id', loeDetails.job_id)

      if (updateError) {
        console.error('Error updating loe_sent_at:', updateError)
      }

      // Push the LOE Sent DATE custom field onto the ClickUp task (Fix B). Re-fetch the FRESH job row
      // so buildHubCustomFields sees the just-written loe_sent_at. No description rewrite (Fix C/D).
      if (loeDetails.clickup_task_id) {
        try {
          const { data: job } = await supabase
            .from('job_submissions')
            .select('*, job_loe_details(*), job_property_info(*)')
            .eq('id', loeDetails.job_id)
            .single()
          if (job) {
            await pushClickUpLOEDateFields(loeDetails.clickup_task_id, job)
          }
        } catch (clickupError) {
          console.error('Failed to push LOE Sent field to ClickUp:', clickupError)
          // Don't fail the webhook - DB update is more important
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'LOE sent timestamp recorded',
          jobId: loeDetails.job_id
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Handle submission.completed event (Stage 3: LOE Signed)
    if (payload.event_type === 'submission.completed') {
      const submissionId = payload.data.id
      const signedDocument = payload.data.documents?.[0]

      console.log('Document signed, submission ID:', submissionId)

      // Try to find job by submission_id first (production DocuSeal)
      let loeDetails = null
      let findError = null

      // First attempt: Look up by docuseal_submission_id
      const { data: loeBySubmission, error: err1 } = await supabase
        .from('job_loe_details')
        .select('job_id, clickup_task_id')
        .eq('docuseal_submission_id', submissionId)
        .single()

      if (loeBySubmission) {
        loeDetails = loeBySubmission
        console.log('Found job by docuseal_submission_id:', loeDetails.job_id)
      } else if (payload.data.metadata?.job_id) {
        // Second attempt: Use metadata.job_id (test mode)
        console.log('Trying metadata.job_id:', payload.data.metadata.job_id)
        const { data: loeByMetadata, error: err2 } = await supabase
          .from('job_loe_details')
          .select('job_id, clickup_task_id')
          .eq('job_id', payload.data.metadata.job_id)
          .single()

        if (loeByMetadata) {
          loeDetails = loeByMetadata
          console.log('Found job by metadata.job_id:', loeDetails.job_id)

          // Update the docuseal_submission_id now that we know it
          await supabase
            .from('job_loe_details')
            .update({ docuseal_submission_id: submissionId })
            .eq('job_id', loeDetails.job_id)
        } else {
          findError = err2
        }
      } else {
        findError = err1
      }

      if (findError || !loeDetails) {
        console.error('Could not find job for submission:', submissionId)
        return new Response(
          JSON.stringify({ error: 'Job not found for submission' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }

      const jobId = loeDetails.job_id
      console.log('Found job ID:', jobId)

      // Update job status to LOE Signed
      const { error: updateError } = await supabase
        .from('job_submissions')
        .update({
          status: 'loe_signed',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)

      if (updateError) {
        console.error('Error updating job status:', updateError)
        throw updateError
      }

      // Store the signed document URL if available
      if (signedDocument) {
        const { error: docError } = await supabase
          .from('job_loe_details')
          .update({
            signed_document_url: signedDocument.url,
            signed_at: payload.data.completed_at || new Date().toISOString()
          })
          .eq('job_id', jobId)

        if (docError) {
          console.error('Error storing signed document:', docError)
        }

        // Promote the matching saved CONTRACT row to 'signed' and attach the executed PDF URL,
        // matched by docuseal_submission_id (the key the signed event carries). This is what flips
        // the LOE "Saved Documents" row from SENT to SIGNED and lets Open show the signed copy
        // instead of the pre-send draft HTML. No-op-safe if no contract row carries this submission.
        const { error: contractSignError } = await supabase
          .from('job_contracts')
          .update({
            state: 'signed',
            signed_document_url: signedDocument.url,
            updated_at: new Date().toISOString()
          })
          .eq('docuseal_submission_id', submissionId)

        if (contractSignError) {
          console.error('Error marking contract signed:', contractSignError)
        }

        // Also store in job_files table for our file management system
        const { error: fileError } = await supabase
          .from('job_files')
          .insert({
            job_id: jobId,
            file_name: signedDocument.name || 'Signed LOE Agreement',
            file_type: 'application/pdf',
            storage_path: signedDocument.url,
            category: 'signed_agreement',
            is_client_visible: true
          })

        if (fileError) {
          console.error('Error storing file record:', fileError)
        }
      }

      // Mirror the signed LOE one-way into the job's SharePoint billing folder.
      // Supabase stays the system of record; only this finalized PDF pushes across.
      // No-ops cleanly (503) until the Entra app secrets exist. Never fails the webhook.
      if (signedDocument?.url) {
        try {
          const { data: jobRow } = await supabase
            .from('job_submissions')
            .select('job_number, property_name, property_address, created_at')
            .eq('id', jobId)
            .single()

          if (jobRow?.job_number) {
            const { jobNumber, propertyDescription, year } = jobFolderInputs(jobRow)
            const spRes = await fetch(`${supabaseUrl}/functions/v1/upload-loe-to-sharepoint`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'apikey': supabaseServiceKey,
              },
              body: JSON.stringify({ jobNumber, propertyDescription, year, pdfUrl: signedDocument.url }),
            })
            if (spRes.status === 503) {
              console.log('SharePoint LOE upload skipped — Entra app not configured yet')
            } else if (!spRes.ok) {
              console.error('SharePoint LOE upload failed:', spRes.status, await spRes.text())
            } else {
              console.log('Signed LOE mirrored to SharePoint billing folder')
            }
          }
        } catch (spError) {
          console.error('SharePoint upload error (non-fatal):', spError)
        }
      }

      // QuickBooks Trigger-1 (LOE signed -> create + send invoice).
      // No-ops cleanly (503) until the Intuit account exists. Never fails the webhook.
      try {
        const { data: jobRow } = await supabase
          .from('job_submissions')
          .select('client_first_name, client_last_name, client_email, client_organization, job_number')
          .eq('id', jobId)
          .single()
        const { data: loeRow } = await supabase
          .from('job_loe_details')
          .select('appraisal_fee')
          .eq('job_id', jobId)
          .single()

        const amount = Number(loeRow?.appraisal_fee) || 0
        const email = jobRow?.client_email || undefined
        const displayName = jobRow?.client_organization
          || `${jobRow?.client_first_name ?? ''} ${jobRow?.client_last_name ?? ''}`.trim()

        if (amount > 0 && displayName) {
          const qboHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
          }
          const custRes = await fetch(`${supabaseUrl}/functions/v1/qbo-create-customer`, {
            method: 'POST', headers: qboHeaders, body: JSON.stringify({ displayName, email }),
          })
          if (custRes.status === 503) {
            console.log('QBO invoice skipped — Intuit app not configured yet')
          } else if (custRes.ok) {
            const { customerId } = await custRes.json()
            const invRes = await fetch(`${supabaseUrl}/functions/v1/qbo-create-invoice`, {
              method: 'POST', headers: qboHeaders,
              body: JSON.stringify({ customerId, amount, billEmail: email, description: `Appraisal services - ${jobRow?.job_number ?? jobId}` }),
            })
            if (invRes.ok) {
              const { invoiceId } = await invRes.json()
              await fetch(`${supabaseUrl}/functions/v1/qbo-send-invoice`, {
                method: 'POST', headers: qboHeaders, body: JSON.stringify({ invoiceId, sendTo: email }),
              })
              console.log('QBO invoice created + sent:', invoiceId)
            } else {
              console.error('QBO create-invoice failed:', invRes.status)
            }
          } else {
            console.error('QBO create-customer failed:', custRes.status)
          }
        }
      } catch (qboError) {
        console.error('QBO Trigger-1 error (non-fatal):', qboError)
      }

      // Push the LOE Signed DATE custom field onto the ClickUp task (Fix B). Re-fetch the FRESH job
      // row so buildHubCustomFields sees the just-written signed_at. No description rewrite (Fix C/D) —
      // the dedicated LOE Signed field is the clean home for the timestamp; the signer name stays on
      // the signed document + job_files record, not duplicated into the card body.
      if (loeDetails.clickup_task_id) {
        try {
          const { data: job } = await supabase
            .from('job_submissions')
            .select('*, job_loe_details(*), job_property_info(*)')
            .eq('id', jobId)
            .single()
          if (job) {
            await pushClickUpLOEDateFields(loeDetails.clickup_task_id, job)
          }
        } catch (clickupError) {
          console.error('Failed to push LOE Signed field to ClickUp:', clickupError)
          // Don't fail the webhook
        }
      }

      console.log('Successfully processed signed document for job:', jobId)

      // TODO: Trigger payment flow (GHL integration)

      return new Response(
        JSON.stringify({
          success: true,
          jobId: jobId,
          status: 'loe_signed',
          signerName: payload.data.submitters?.[0]?.name || 'Client'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // For other event types, just acknowledge receipt
    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error: any) {
    console.error('Error processing DocuSeal webhook:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

/* To deploy:
1. Run: supabase functions deploy docuseal-webhook
2. Configure webhook URL in DocuSeal: https://[project-ref].supabase.co/functions/v1/docuseal-webhook
3. Select events: submission.created, submission.completed
*/

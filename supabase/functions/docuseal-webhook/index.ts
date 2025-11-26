// Supabase Edge Function for DocuSeal Webhook
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ClickUp Configuration
const CLICKUP_API_TOKEN = Deno.env.get('CLICKUP_API_TOKEN') || 'pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU'

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

// Helper function to format timestamp for ClickUp
const formatTimestamp = (dateStr: string): string => {
  const date = new Date(dateStr)

  // Format as YY.MM.DD / H:MM AM/PM
  const year = String(date.getFullYear()).slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12

  return `${year}.${month}.${day} / ${hours}:${minutes} ${ampm}`
}

// Update ClickUp task with LOE status (Stage 2.5 & 3)
async function updateClickUpLOEStatus(
  taskId: string,
  eventType: 'sent' | 'signed',
  timestamp: string,
  signerName?: string
): Promise<void> {
  console.log(`Updating ClickUp task ${taskId} with LOE ${eventType} status`)

  // Fetch existing task
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
  const existingDescription = existingTask.markdown_description || existingTask.description || ''

  // Format the timestamp
  const formattedTime = formatTimestamp(timestamp)

  let updatedDescription = existingDescription

  if (eventType === 'sent') {
    // Stage 2.5: Replace blank LOE Sent line with actual timestamp
    const sentLine = `  ▸ LOE Sent:   ${formattedTime}`

    // Replace blank LOE Sent line
    if (existingDescription.includes('▸ LOE Sent:')) {
      updatedDescription = existingDescription.replace(
        /  ▸ LOE Sent:\s+$/m,
        sentLine
      )
    } else {
      // Fallback: Insert after "Received Date:" line if not found
      if (existingDescription.includes('Received Date:')) {
        updatedDescription = existingDescription.replace(
          /(Received Date:.*?\n)/,
          `$1${sentLine}\n`
        )
      } else {
        // Fallback: add at top
        updatedDescription = `${sentLine}\n\n${existingDescription}`
      }
    }
  } else if (eventType === 'signed') {
    // Stage 3: Replace blank LOE Signed line with actual timestamp and signer name
    const signedLine = `  ▸ LOE Signed: ${formattedTime} by ${signerName || 'Client'}`

    // Replace blank LOE Signed line
    if (existingDescription.includes('▸ LOE Signed:')) {
      updatedDescription = existingDescription.replace(
        /  ▸ LOE Signed:\s+$/m,
        signedLine
      )
    } else {
      // Fallback: Insert after "LOE Sent" line if not found
      if (existingDescription.includes('▸ LOE Sent:')) {
        updatedDescription = existingDescription.replace(
          /(  ▸ LOE Sent:.*?\n)/,
          `$1${signedLine}\n`
        )
      } else {
        // If no "LOE Sent" line, add both after Received Date
        const sentLine = `  ▸ LOE Sent:   ${formattedTime}`
        if (existingDescription.includes('Received Date:')) {
          updatedDescription = existingDescription.replace(
            /(Received Date:.*?\n)/,
            `$1${sentLine}\n${signedLine}\n`
          )
        } else {
          updatedDescription = `${signedLine}\n\n${existingDescription}`
        }
      }
    }
  }

  // Update task
  const updateResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
    method: 'PUT',
    headers: {
      'Authorization': CLICKUP_API_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: updatedDescription, // Plain description (fallback)
      markdown_description: updatedDescription // Markdown description (preferred)
    })
  })

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text()
    throw new Error(`Failed to update ClickUp task: ${updateResponse.status} - ${errorText}`)
  }

  console.log(`✅ ClickUp task updated with LOE ${eventType} status`)
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

      // Update LOE sent timestamp in database
      const { error: updateError } = await supabase
        .from('job_loe_details')
        .update({
          loe_sent_at: payload.data.created_at || new Date().toISOString()
        })
        .eq('job_id', loeDetails.job_id)

      if (updateError) {
        console.error('Error updating loe_sent_at:', updateError)
      }

      // Update ClickUp task with LOE Sent timestamp
      if (loeDetails.clickup_task_id) {
        try {
          await updateClickUpLOEStatus(
            loeDetails.clickup_task_id,
            'sent',
            payload.data.created_at || new Date().toISOString()
          )
        } catch (clickupError) {
          console.error('Failed to update ClickUp:', clickupError)
          // Don't fail the webhook - DocuSeal update is more important
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

      // Extract signer name from submitters
      const signerName = payload.data.submitters?.[0]?.name || 'Client'

      // Update ClickUp task with LOE Signed timestamp
      if (loeDetails.clickup_task_id) {
        try {
          await updateClickUpLOEStatus(
            loeDetails.clickup_task_id,
            'signed',
            payload.data.completed_at || new Date().toISOString(),
            signerName
          )
        } catch (clickupError) {
          console.error('Failed to update ClickUp:', clickupError)
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
          signerName: signerName
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

// Supabase Edge Function for DocuSeal Webhook
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DocuSealWebhookPayload {
  event_type: 'submission.completed' | 'submission.created';
  data: {
    id: string;
    status: string;
    email: string;
    created_at: string;
    completed_at?: string;
    documents?: Array<{
      id: string;
      name: string;
      url: string;
    }>;
    submission_events?: Array<{
      event_type: string;
      event_timestamp: string;
    }>;
  };
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

    if (payload.event_type === 'submission.completed') {
      // Document has been signed
      const submissionId = payload.data.id
      const signedDocument = payload.data.documents?.[0]
      
      console.log('Document signed, submission ID:', submissionId)
      
      // Find the job with this DocuSeal submission ID
      const { data: jobDetails, error: findError } = await supabase
        .from('job_details')
        .select('job_id')
        .eq('docuseal_submission_id', submissionId)
        .single()
      
      if (findError || !jobDetails) {
        console.error('Could not find job for submission:', submissionId)
        return new Response(
          JSON.stringify({ error: 'Job not found for submission' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }
      
      const jobId = jobDetails.job_id
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
          .from('job_details')
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
      
      console.log('Successfully processed signed document for job:', jobId)
      
      // TODO: Trigger payment flow (GHL integration)
      // This would be the next step in the workflow
      
      return new Response(
        JSON.stringify({ 
          success: true,
          jobId: jobId,
          status: 'loe_signed'
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
3. Select event: submission.completed
*/
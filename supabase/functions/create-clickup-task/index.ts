// Supabase Edge Function for ClickUp Task Creation
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ClickUp Configuration - Updated with correct API token from client docs (Nov 4, 2025)
const CLICKUP_API_TOKEN = Deno.env.get('CLICKUP_API_TOKEN') || 'pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU'
const CLICKUP_LIST_ID = Deno.env.get('CLICKUP_LIST_ID') || '901402094744' // Chris's list in Valta workspace
const CLICKUP_TEMPLATE_ID = 't-86b3exqe8' // LOE New Template 2025.01.09
const CLICKUP_WORKSPACE_ID = '9014181018' // Valta workspace

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { jobId } = await req.json()
    
    if (!jobId) {
      throw new Error('Job ID is required')
    }

    console.log('Creating ClickUp task for job:', jobId)

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch job details from database
    const { data: job, error: jobError } = await supabase
      .from('job_submissions')
      .select('*, job_loe_details(*), job_property_info(*)')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      throw new Error(`Failed to fetch job: ${jobError?.message || 'Job not found'}`)
    }

    // Idempotency check: If task already exists, return existing task info
    if (job.clickup_task_id) {
      console.log('✅ Task already exists, returning existing task:', job.clickup_task_id)
      return new Response(
        JSON.stringify({
          success: true,
          taskId: job.clickup_task_id,
          taskUrl: job.clickup_task_url,
          alreadyExists: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Build task name using the Valcre CAL number if available
    // Format: "CAL250137 - Property Name, Street, City"
    // NO client name, province, or postal code in the task name
    const valcreJobNumber = job.job_number || job.valcre_job_id || 'PENDING'
    const propertyName = job.property_name || job.propertyName || 'Property'
    const propertyAddress = job.property_address || job.propertyAddress || 'Unknown Address'

    // Parse address to remove province and postal code
    // Expected format: "123 Main St, Calgary, AB T2P 1A1" -> "123 Main St, Calgary"
    const parseShortAddress = (addr: string): string => {
      const parts = addr.split(',').map(s => s.trim())
      if (parts.length >= 2) {
        // Take first part (street) and second part (city), drop rest
        return `${parts[0]}, ${parts[1]}`
      }
      return addr // Fallback to full address if can't parse
    }

    const taskName = `${valcreJobNumber} - ${propertyName}, ${parseShortAddress(propertyAddress)}`

    console.log('Task name:', taskName)
    
    // Use production URL for APR Dashboard with direct job link
    const hubUrl = 'https://apr-dashboard-v2.vercel.app'
    const jobUrl = `${hubUrl}/dashboard?jobId=${job.id}`

    // Create task with template
    const clickupResponse = await fetch(`https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`, {
      method: 'POST',
      headers: {
        'Authorization': CLICKUP_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: taskName,
        markdown_description: `📍 **NEW JOB ARRIVED - [View in APR Hub](${jobUrl})**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Client:** ${job.client_first_name || job.clientFirstName} ${job.client_last_name || job.clientLastName}
Organization: ${job.client_organization || job.clientOrganization || 'N/A'}
Email: ${job.client_email || job.clientEmail}
Phone: ${job.client_phone || job.clientPhone || 'N/A'}

Property Type: ${job.property_type || job.propertyType || 'N/A'}
Intended Use: ${job.intended_use || job.intendedUse || 'N/A'}
Asset Condition: ${job.asset_condition || job.assetCondition || 'N/A'}

Notes: ${job.notes || job.additionalComments || 'No notes'}`,
        priority: 3, // Normal priority (1=urgent, 2=high, 3=normal, 4=low)
        status: 'to do', // Put in "to do" status (default open status)
        template_id: CLICKUP_TEMPLATE_ID, // This will add the 9 subtasks
        notify_all: false
      })
    })

    if (!clickupResponse.ok) {
      const errorText = await clickupResponse.text()
      console.error('ClickUp API error:', errorText)
      throw new Error(`ClickUp API error: ${clickupResponse.status}`)
    }

    const clickupTask = await clickupResponse.json()
    console.log('ClickUp task created:', clickupTask.id)

    // Update job_submissions with ClickUp task ID and URL
    const { error: updateError } = await supabase
      .from('job_submissions')
      .update({
        clickup_task_id: clickupTask.id,
        clickup_task_url: clickupTask.url
      })
      .eq('id', jobId)

    if (updateError) {
      console.error('Failed to update job_submissions with ClickUp task ID:', updateError)
      throw new Error('Failed to save ClickUp task to job_submissions')
    }

    // Also update job_loe_details with ClickUp task data (CRITICAL for button state persistence)
    const { error: loeUpdateError } = await supabase
      .from('job_loe_details')
      .upsert({
        job_id: jobId,
        clickup_task_id: clickupTask.id,
        clickup_task_url: clickupTask.url
      }, {
        onConflict: 'job_id'
      })

    if (loeUpdateError) {
      console.error('Failed to update job_loe_details with ClickUp task ID:', loeUpdateError)
      throw new Error('Failed to save ClickUp task to LOE details')
    }

    console.log('✅ ClickUp task saved successfully to both tables')

    return new Response(
      JSON.stringify({ 
        success: true, 
        taskId: clickupTask.id,
        taskName: taskName,
        taskUrl: clickupTask.url
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error creating ClickUp task:', error)
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
// Supabase Edge Function for ClickUp Task Creation
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ClickUp Configuration - Environment Detection and Switching
// Supports both dev (BC workspace) and production (Valta workspace)

// Environment detection
const CLICKUP_ENV = Deno.env.get('CLICKUP_ENV') || 'dev'

// Development configuration (BC Workspace)
const DEV_CONFIG = {
  listId: Deno.env.get('CLICKUP_LIST_ID') || '901706896375', // New Submission - BC Workspace (Dev.Projects)
  workspaceId: '8555561', // BC Workspace (Development)
  templateId: null // Skip template for Dev testing
}

// Production configuration (Valta Workspace)
const PROD_CONFIG = {
  listId: '901402094744', // Chris's list in Valta
  workspaceId: '9014181018', // Valta workspace
  templateId: 't-86b3exqe8', // LOE New Template 2025.01.09
  priority: 4 // Low priority (hides in collapsed section)
}

// Select configuration based on environment
const config = CLICKUP_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG

// Use config values throughout the function
const CLICKUP_LIST_ID = config.listId
const CLICKUP_WORKSPACE_ID = config.workspaceId
const CLICKUP_TEMPLATE_ID = config.templateId

// Log active environment for debugging
console.log('🔧 ClickUp Environment:', CLICKUP_ENV)
console.log('🔧 Using workspace:', CLICKUP_WORKSPACE_ID)
console.log('🔧 Using list ID:', CLICKUP_LIST_ID)

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { jobId, userId } = await req.json()

    if (!jobId) {
      throw new Error('Job ID is required')
    }

    console.log('Creating ClickUp task for job:', jobId)

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get OAuth access token from database - try OAuth first for workspace
    let CLICKUP_API_TOKEN: string | null = null

    console.log('🔍 Looking up OAuth token for workspace:', CLICKUP_WORKSPACE_ID)
    const { data: connection, error: connectionError } = await supabase
      .from('clickup_connections')
      .select('access_token')
      .eq('workspace_id', CLICKUP_WORKSPACE_ID)
      .limit(1)
      .single()

    if (!connectionError && connection?.access_token) {
      CLICKUP_API_TOKEN = connection.access_token
      console.log('✅ Using OAuth token from database')
    } else {
      console.log('⚠️ No OAuth connection found, will fall back to env var')
    }

    // Fall back to environment variable token if no OAuth connection
    if (!CLICKUP_API_TOKEN) {
      const envToken = CLICKUP_ENV === 'production' 
        ? Deno.env.get('CLICKUP_API_TOKEN_VALTA')
        : Deno.env.get('CLICKUP_API_TOKEN') || 'pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY'
      CLICKUP_API_TOKEN = envToken
      console.log('🔧 Using fallback token from environment variable')
    }

    console.log('🔍 Token check:', {
      environment: CLICKUP_ENV,
      hasOAuthToken: !!CLICKUP_API_TOKEN && CLICKUP_API_TOKEN !== Deno.env.get('CLICKUP_API_TOKEN'),
      tokenPrefix: CLICKUP_API_TOKEN ? CLICKUP_API_TOKEN.substring(0, 12) : 'none',
      listId: CLICKUP_LIST_ID,
      workspaceId: CLICKUP_WORKSPACE_ID
    })

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
    // Format: "PENDING - Property Name, Street, City"
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
    const hubUrl = 'https://apr-dashboard-v3.vercel.app'
    const jobUrl = `${hubUrl}/dashboard/job/${job.id}`

    // Format submission date/time as YY.MM.DD / H:MM AM/PM
    const submissionDate = new Date(job.created_at)
    const year = String(submissionDate.getFullYear()).slice(-2)
    const month = String(submissionDate.getMonth() + 1).padStart(2, '0')
    const day = String(submissionDate.getDate()).padStart(2, '0')
    let hours = submissionDate.getHours()
    const minutes = String(submissionDate.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    const formattedDateTime = `${year}.${month}.${day} / ${hours}:${minutes} ${ampm}`

    // Determine label based on source
    const jobSource = job.source || 'webform' // Default to webform for backward compatibility
    let sourceLabel = 'New Client Request Received'
    if (jobSource === 'manual') {
      sourceLabel = 'Job Created Manually'
    } else if (jobSource === 'api') {
      sourceLabel = 'Job Created via API'
    } else if (jobSource === 'import') {
      sourceLabel = 'Job Imported'
    } else if (jobSource === 'crm') {
      sourceLabel = 'Job Created via CRM'
    }

    // Build task description with new format (Stage 1)
    const description = `📍 **NEW APPRAISAL REQUEST:** [APR Dashboard](${jobUrl})
📍 **VALCRE JOB NUMBER:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**${sourceLabel}:**  ${formattedDateTime}
▸ LOE Sent:
▸ LOE Signed:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**CLIENT INFORMATION**
• Name:    ${job.client_first_name || job.clientFirstName || ''} ${job.client_last_name || job.clientLastName || ''}
• Org:     ${job.client_organization || job.clientOrganization || ''}
• Email:   ${job.client_email || job.clientEmail || ''}
• Phone:   ${job.client_phone || job.clientPhone || ''}

**PROPERTY INFORMATION**
• Property:  ${propertyName || ''}
• Address:   ${propertyAddress || ''}
• Type:      ${job.property_type || job.propertyType || ''}
• Use:       ${job.intended_use || job.intendedUse || ''}
• Condition: ${job.asset_condition || job.assetCondition || ''}
• Premise:   ${job.valuation_premises || job.valuationPremises || ''}

**PROPERTY CONTACT**
• Name:  ${job.property_contact_first_name || job.propertyContactFirstName || ''} ${job.property_contact_last_name || job.propertyContactLastName || ''}
• Email: ${job.property_contact_email || job.propertyContactEmail || ''}
• Phone: ${job.property_contact_phone || job.propertyContactPhone || ''}

**CLIENT COMMENTS**
• ${job.notes || job.additionalComments || ''}`

    // Build task payload (conditionally include template_id)
    // CRITICAL: Use ONLY markdown_description field for clickable links to work
    // ClickUp processes markdown [text](url) syntax in markdown_description field
    const taskPayload: any = {
      name: taskName,
      markdown_description: description,
      priority: config.priority || null, // Use config priority (4=low for production, null for dev)
      status: 'to do', // Put in "to do" status (default open status)
      notify_all: false
    }

    // Only include template_id if it's set (Production uses template, Dev may skip)
    if (CLICKUP_TEMPLATE_ID) {
      taskPayload.template_id = CLICKUP_TEMPLATE_ID
    }

    // Create task with or without template
    const clickupResponse = await fetch(`https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`, {
      method: 'POST',
      headers: {
        'Authorization': CLICKUP_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskPayload)
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

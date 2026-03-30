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

// ClickUp Custom Field IDs — per-list (Valta production)
// Fetched 2026-03-30 via GET /api/v2/list/901402094744/field
const VALTA_CUSTOM_FIELD_IDS: Record<string, string> = {
  jobNumber:          'f2ea22ec-519d-458c-bcb5-753987673cd0',
  clientName:         '5f6e2e64-e5e6-4813-aeda-fa670093d024',
  clientTitle:        '85fdaf24-e43b-4b24-82f5-17c6e7fc37cd',
  clientOrganization: '65ebb5d0-6f75-41e8-a1d4-7acbfe056bd6',
  clientAddress:      '783add3d-2750-497e-9c7c-34db10386433',
  clientPhone:        'ec2175d8-8e77-4159-83b2-2893e1df1423',
  clientEmail:        '27ce749d-10a1-4156-befc-72fc49ded05d',
  propertyName:       '19f3541a-9ec6-4121-9629-da6d46727100',
  propertyAddress:    '24eac8e4-7f41-447b-827e-9091a5865218',
  propertyType:       '8afec821-c806-4c66-8a4d-9ffeb3321323',
  propertySubtype:    '75e40c0c-9152-431e-9f4e-09cd5b43790a',
  stateOfImprovements:'50fc4268-b555-4f21-8734-379ba8709fa8',
  statusOfImprovements:'34d2fa85-b62d-40cc-925a-48f767e6e0d3',
  intendedUse:        'd879f9bc-797d-44e4-a4a4-50b01dcb755b',
  interestAppraised:  '6499e6a2-9a4d-406f-9387-178ded86d6a8',
  reportType:         '9712f537-cffa-4779-9bbf-5fb6e2275933',
  paymentTerms:       '5cc27228-1686-4cff-8e92-9c6861f3b544',
  zoningStatus:       '0654ea5e-c4cd-4ed0-82e9-3bf213ae8600',
  desktopReport:      '34204fa5-872b-4227-b446-10f056a1a6ee',
  fee:                'f7ebc840-da7f-48fc-864d-e3b60f8ff0fa',
  retainer:           'a40716f8-3f19-4051-b71e-23ca08ed88de',
  deliveryDate:       'e1a3b51c-e8cd-40bc-ab15-f6eae99ddbd7',
  notes:              '5a1ed0aa-ecb5-48d3-9919-565da2c4a76b',
  comments:           'e1e15216-d3c8-42ea-a978-aea442d78fec',
  valcreLink:         '4d555148-c2a8-4d39-b475-80821d5c6058',
  dashboardLink:      'de43430c-e269-4d36-92e8-504b26a4cd57', // APR Dashboard Link (dev list)
  inspectionDate:     '5a745535-f90f-4b62-be29-5d2df8abb453',
  dateReceived:       '84f34dd2-2a22-4d2a-a3f6-89a631a00fe4',
  dateContractCreated:'387d8f85-fe24-472c-bc27-c63939e6b45f',
}

// Use config values throughout the function
const CLICKUP_LIST_ID = config.listId
const CLICKUP_WORKSPACE_ID = config.workspaceId
const CLICKUP_TEMPLATE_ID = config.templateId

// Log active environment for debugging (v3)
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
      
      // Validate token format
      if (!CLICKUP_API_TOKEN || !CLICKUP_API_TOKEN.startsWith('pk_')) {
        throw new Error('Invalid ClickUp API token format - must start with pk_')
      }
      if (CLICKUP_API_TOKEN.length < 40) {
        throw new Error('Invalid ClickUp API token - too short')
      }
    }

    console.log('🔍 Token check:', {
      environment: CLICKUP_ENV,
      hasOAuthToken: !!CLICKUP_API_TOKEN && CLICKUP_API_TOKEN !== Deno.env.get('CLICKUP_API_TOKEN'),
      tokenPrefix: CLICKUP_API_TOKEN ? CLICKUP_API_TOKEN.substring(0, 12) : 'none',
      tokenLength: CLICKUP_API_TOKEN ? CLICKUP_API_TOKEN.length : 0,
      envVarValta: Deno.env.get('CLICKUP_API_TOKEN_VALTA') ? 'SET' : 'NOT SET',
      envVarValtaPrefix: Deno.env.get('CLICKUP_API_TOKEN_VALTA')?.substring(0, 12),
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

    // Build task description — MUST match production format from src/utils/webhooks/clickup.ts
    const clientName = `${job.client_first_name || ''} ${job.client_last_name || ''}`.trim()
    const notesLine = job.notes ? `\n**Notes:** ${job.notes}` : ''
    const description = `📍 **NEW JOB ARRIVED - [View in APR Hub](${jobUrl})**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Client:** ${clientName}
**Property:** ${propertyAddress}
**Type:** ${job.property_type || job.propertyType || ''}
**Intended Use:** ${job.intended_use || job.intendedUse || ''}${notesLine}`

    // Build custom_fields array for Valta production
    // Maps Supabase job data to ClickUp custom field IDs
    const customFields: Array<{id: string, value: any}> = []
    const F = VALTA_CUSTOM_FIELD_IDS

    // Helper: add field if value exists
    const addField = (fieldId: string | undefined, value: any) => {
      if (fieldId && value !== undefined && value !== null && value !== '') {
        customFields.push({ id: fieldId, value })
      }
    }

    // Get LOE details (joined via select)
    const loe = Array.isArray(job.job_loe_details) ? job.job_loe_details[0] : job.job_loe_details
    const propInfo = Array.isArray(job.job_property_info) ? job.job_property_info[0] : job.job_property_info

    // Client fields
    const clientFullName = `${job.client_first_name || ''} ${job.client_last_name || ''}`.trim()
    addField(F.clientName, clientFullName)
    addField(F.clientTitle, job.client_title)
    addField(F.clientOrganization, job.client_organization)
    addField(F.clientAddress, job.client_address)
    addField(F.clientPhone, job.client_phone)
    addField(F.clientEmail, job.client_email)

    // Property fields
    addField(F.propertyName, job.property_name)
    addField(F.propertyAddress, job.property_address)
    addField(F.propertyType, job.property_type)

    // Appraisal fields (from job_loe_details)
    addField(F.intendedUse, job.intended_use)
    if (loe) {
      addField(F.reportType, loe.report_type)
      addField(F.interestAppraised, loe.property_rights_appraised)
      addField(F.paymentTerms, loe.payment_terms)
      addField(F.deliveryDate, loe.delivery_date)
      // Fee: ClickUp currency fields store in cents
      if (loe.appraisal_fee) {
        addField(F.fee, loe.appraisal_fee * 100)
      }
      if (loe.retainer_amount) {
        addField(F.retainer, parseFloat(String(loe.retainer_amount).replace(/[$,]/g, '')))
      }
    }

    // Property info fields (from job_property_info — VALTA fields)
    if (propInfo) {
      addField(F.propertySubtype, propInfo.property_subtype)
      addField(F.stateOfImprovements, propInfo.state_of_improvements)
      addField(F.statusOfImprovements, propInfo.status_of_improvements)
      addField(F.zoningStatus, propInfo.zoning_status)
      addField(F.desktopReport, propInfo.desktop_report)
    }

    // Job number and links
    addField(F.jobNumber, valcreJobNumber !== 'PENDING' ? valcreJobNumber : undefined)
    addField(F.dashboardLink, jobUrl)
    if (job.job_number) {
      addField(F.valcreLink, `https://app.valcre.com`)
    }

    // Notes
    addField(F.notes, job.notes)
    addField(F.dateReceived, new Date(job.created_at).getTime())

    console.log(`📋 Custom fields to populate: ${customFields.length}`)

    // Build task payload
    // CRITICAL: Use ONLY markdown_description field for clickable links to work
    // ClickUp processes markdown [text](url) syntax in markdown_description field
    const taskPayload: any = {
      name: taskName,
      markdown_description: description,
      priority: config.priority || null, // Use config priority (4=low for production, null for dev)
      status: 'to do', // Put in "to do" status (default open status)
      notify_all: false,
      tags: ['NEW ARRIVAL', 'APR Hub'],
      custom_fields: customFields.length > 0 ? customFields : undefined,
    }

    // Determine API endpoint - use template endpoint if template_id is set
    // IMPORTANT: Creating from template uses a DIFFERENT endpoint than regular task creation
    // Template endpoint: POST /list/{list_id}/taskTemplate/{template_id}
    // Regular endpoint:  POST /list/{list_id}/task
    let clickupApiUrl: string
    if (CLICKUP_TEMPLATE_ID) {
      clickupApiUrl = `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/taskTemplate/${CLICKUP_TEMPLATE_ID}`
      console.log('📋 Creating task FROM TEMPLATE:', CLICKUP_TEMPLATE_ID)
    } else {
      clickupApiUrl = `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`
      console.log('📋 Creating task WITHOUT template')
    }

    // Create task with or without template
    console.log('🔑 Making ClickUp API call with token prefix:', CLICKUP_API_TOKEN?.substring(0, 15))
    console.log('🔗 API URL:', clickupApiUrl)
    const clickupResponse = await fetch(clickupApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': CLICKUP_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskPayload)
    })
    console.log('📡 ClickUp API response status:', clickupResponse.status)

    if (!clickupResponse.ok) {
      const errorText = await clickupResponse.text()
      console.error('❌ ClickUp API error response:', errorText)
      console.error('❌ ClickUp API status:', clickupResponse.status)
      console.error('❌ Token used (first 20 chars):', CLICKUP_API_TOKEN?.substring(0, 20))
      console.error('❌ List ID:', CLICKUP_LIST_ID)
      console.error('❌ Workspace ID:', CLICKUP_WORKSPACE_ID)
      
      // Parse error for better messaging
      let errorMessage = `ClickUp API error: ${clickupResponse.status}`
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.err) {
          errorMessage = `ClickUp API error: ${clickupResponse.status} - ${errorJson.err}`
        }
      } catch (e) {
        // Not JSON, use text as-is
        errorMessage = `ClickUp API error: ${clickupResponse.status} - ${errorText.substring(0, 200)}`
      }
      
      throw new Error(errorMessage)
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

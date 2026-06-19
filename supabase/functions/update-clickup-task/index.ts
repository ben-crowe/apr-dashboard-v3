// Supabase Edge Function for ClickUp Task Update (Stage 2: LOE Section)
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { fetchListFields, buildHubCustomFields, applyTaskFields } from '../_shared/clickup-fields.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ClickUp Configuration - Environment Detection and Switching
// Supports both dev (BC workspace) and production (Valta workspace)

// Environment detection
// PINNED TO DEV 2026-06-04 (react-spec, CoArch-directed): MUST mirror create-clickup-task, which is
// also pinned to 'dev'. The global CLICKUP_ENV secret is 'production' on this project, but the Stage-1
// task is CREATED on the BC workspace (8555561 / list 901706896375). Stage-2 must update that SAME
// task, so it must read the SAME BC workspace + token create used. Following the global secret sent
// update to the Valta workspace (9014181018) and a stale Valta OAuth token → 401. Pinning to dev makes
// create + update consistent. Chris's prod flow is untouched (this fn only ran against the BC card).
// To restore env-driven behavior, revert to: Deno.env.get('CLICKUP_ENV') || 'dev'.
const CLICKUP_ENV = 'dev'

// Development configuration (BC Workspace)
const DEV_CONFIG = {
  workspaceId: '8555561' // BC Workspace (Development)
}

// Production configuration (Valta Workspace)
const PROD_CONFIG = {
  workspaceId: '9014181018', // Valta workspace
  priority: 4 // Low priority (hides in collapsed section)
}

// Select configuration based on environment
const config = CLICKUP_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG

// Use config values throughout the function
const CLICKUP_WORKSPACE_ID = config.workspaceId

// Log active environment for debugging
console.log('🔧 ClickUp Environment:', CLICKUP_ENV)
console.log('🔧 Using workspace:', CLICKUP_WORKSPACE_ID)

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

    console.log('Updating ClickUp task with LOE details for job:', jobId)

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
      // No hardcoded token fallbacks — stale literals caused 401s twice (2026-06-03). Read from secrets only.
      // Mirrors create-clickup-task exactly so Stage-1 + Stage-2 use the identical token source.
      const envToken = CLICKUP_ENV === 'production'
        ? Deno.env.get('CLICKUP_API_TOKEN_VALTA')
        : Deno.env.get('CLICKUP_API_TOKEN')
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

    // Fetch job, LOE details, and property info from database.
    // job_property_info is required so resolver fields sourced only from it (Property Subtype,
    // State of Improvements) sync on UPDATE, not just on create.
    const { data: job, error: jobError } = await supabase
      .from('job_submissions')
      .select('*, job_loe_details(*), job_property_info(*)')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      throw new Error(`Failed to fetch job: ${jobError?.message || 'Job not found'}`)
    }

    // Get ClickUp task ID
    const taskId = job.clickup_task_id || job.job_loe_details?.[0]?.clickup_task_id

    if (!taskId) {
      throw new Error('ClickUp task ID not found for this job')
    }

    console.log('Fetching existing ClickUp task:', taskId)

    // Fetch existing task from ClickUp — we need the task's list.id for custom-field resolution
    const getTaskResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': CLICKUP_API_TOKEN,
        'Content-Type': 'application/json'
      }
    })

    if (!getTaskResponse.ok) {
      const errorText = await getTaskResponse.text()
      console.error('ClickUp GET API error:', errorText)
      throw new Error(`Failed to fetch ClickUp task: ${getTaskResponse.status}`)
    }

    const existingTask = await getTaskResponse.json()

    console.log('Existing task retrieved, building updated description')

    // Extract LOE details (support both direct and nested format)
    const loeDetails = job.job_loe_details?.[0] || job.job_loe_details || {}

    // Use production URL for APR Dashboard with direct job link
    const hubUrl = 'https://apr-dashboard-v3.vercel.app'
    const jobUrl = `${hubUrl}/dashboard/job/${job.id}`

    // Valcre job number for task name
    const valcreJobNumber = loeDetails.job_number || job.job_number || 'PENDING'

    // LEAN 2-LINE description — mirrors create-clickup-task exactly (card redesign 2026-06-11).
    // No LOE block in the description. All field data goes to CUSTOM FIELDS below.
    const valcreLink = loeDetails.valcre_job_id
      ? `[Quick Link](https://app.valcre.com/job/edit/${loeDetails.valcre_job_id}#job)`
      : 'Quick Link'
    const combinedDescription = `📍 **NEW APPRAISAL REQUEST** — [Quick Link](${jobUrl})
📍 **VALCRE JOB:** ${valcreLink}`

    // Debug logging
    console.log('=== DEBUG INFO ===')
    console.log('VAL Number:', valcreJobNumber)
    console.log('Valcre Job ID:', loeDetails.valcre_job_id)
    console.log('Description built (lean):', combinedDescription)
    console.log('==================')

    // Update task name from PENDING to VAL number
    const propertyName = job.property_name || job.propertyName || 'Property'
    const propertyAddress = job.property_address || job.propertyAddress || 'Unknown Address'

    const parseShortAddress = (addr: string): string => {
      const parts = addr.split(',').map(s => s.trim())
      if (parts.length >= 2) {
        return `${parts[0]}, ${parts[1]}`
      }
      return addr
    }

    const updatedTaskName = `${valcreJobNumber} - ${propertyName}, ${parseShortAddress(propertyAddress)}`

    // UPDATE task to ClickUp
    // CRITICAL: Use ONLY markdown_description field for clickable links to work
    // ClickUp processes markdown [text](url) syntax in markdown_description field
    const updatePayload: any = {
      name: updatedTaskName,
      markdown_description: combinedDescription
    }

    // Add priority for production (Low = 4)
    if (config.priority) {
      updatePayload.priority = config.priority
    }

    console.log('Updating ClickUp task with payload:', JSON.stringify(updatePayload, null, 2))

    const updateResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': CLICKUP_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatePayload)
    })

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error('ClickUp UPDATE API error:', errorText)
      throw new Error(`Failed to update ClickUp task: ${updateResponse.status}`)
    }

    const updatedTask = await updateResponse.json()
    console.log('✅ ClickUp task updated successfully:', updatedTask.id)

    // READBACK VERIFY (HTTP 200 ≠ persisted) — re-GET the task and confirm our description
    // actually landed. Exact-match on the description we sent; header marker as a softer fallback.
    let verified = false
    try {
      const verifyResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
        method: 'GET',
        headers: { 'Authorization': CLICKUP_API_TOKEN, 'Content-Type': 'application/json' }
      })
      if (verifyResponse.ok) {
        const verifyTask = await verifyResponse.json()
        const liveDesc = verifyTask.markdown_description || verifyTask.description || ''
        verified = liveDesc.trim() === combinedDescription.trim()
          || liveDesc.includes('NEW APPRAISAL REQUEST')
      } else {
        console.warn('Readback GET non-200:', verifyResponse.status)
      }
    } catch (e) {
      console.warn('Readback verify failed (non-fatal):', e?.message || e)
    }
    console.log('🔁 Readback verified:', verified)

    // Populate the JOB-HUB custom fields from FRESH job data (set-replaces — no dup). Resolve byName
    // against the task's OWN list, so it works on the mirror now and on Valta after replication. Non-fatal.
    let customFields = { set: 0, failed: 0, verified: 0, total: 0 }
    try {
      const listId = existingTask?.list?.id
      if (listId) {
        const listFields = await fetchListFields(CLICKUP_API_TOKEN, listId)
        const hubFields = buildHubCustomFields(job, listFields)
        if (hubFields.length) {
          customFields = await applyTaskFields(CLICKUP_API_TOKEN, taskId, hubFields)
        }
      } else {
        console.log('ℹ️ No list id on task — skipping custom-field population')
      }
    } catch (cfErr) {
      console.error('Custom-field population failed (non-fatal):', (cfErr as any)?.message || cfErr)
    }

    return new Response(
      JSON.stringify({
        success: true,
        verified,
        customFields,
        taskId: updatedTask.id,
        taskName: updatedTaskName,
        taskUrl: updatedTask.url || `https://app.clickup.com/t/${taskId}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error updating ClickUp task:', error)
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

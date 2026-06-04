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

    // Fetch job and LOE details from database
    const { data: job, error: jobError } = await supabase
      .from('job_submissions')
      .select('*, job_loe_details(*)')
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

    // Fetch existing task from ClickUp to preserve Stage 1 data
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
    const existingDescription = existingTask.markdown_description || existingTask.description || ''

    console.log('Existing task retrieved, building updated description')

    // Extract LOE details (support both direct and nested format)
    const loeDetails = job.job_loe_details?.[0] || job.job_loe_details || {}

    // Use production URL for APR Dashboard with direct job link
    const hubUrl = 'https://apr-dashboard-v3.vercel.app'
    const jobUrl = `${hubUrl}/dashboard/job/${job.id}`

    // Build Valcre job URL only if Valcre job actually exists
    const valcreJobNumber = loeDetails.job_number || job.job_number || 'PENDING'
    const valcreJobUrl = loeDetails.valcre_job_id
      ? `https://app.valcre.com/job/edit/${loeDetails.valcre_job_id}#job`
      : null

    // Format delivery date
    // Format date as YY.MM.DD
    const formatDate = (dateStr: string | null) => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      const year = String(date.getFullYear()).slice(-2)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}.${month}.${day}`
    }

    // Format currency
    const formatCurrency = (amount: number | null) => {
      if (!amount) return ''
      return `${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    }

    // Extract ONLY Stage 1 content (everything before the first LOE section)
    // Look for the Section 2 divider to properly separate Stage 1 from Stage 2
    const stage1Match = existingDescription.match(/([\s\S]*?)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\s*\n\s*LOE QUOTE/)
    const stage1Content = stage1Match ? stage1Match[1].trim() : existingDescription.trim()

    // Update top links section with actual Valcre job link and fix APR Dashboard link
    let updatedStage1 = stage1Content

    // Fix APR Dashboard link
    // NOTE: ClickUp strips **bold** markers when processing markdown_description
    // So we match the processed text (without bold markers)
    updatedStage1 = updatedStage1.replace(
      /📍 NEW APPRAISAL REQUEST:[^\n]*/,
      `📍 **NEW APPRAISAL REQUEST:** [APR Dashboard](${jobUrl})`
    )

    // Replace Valcre Job Number line with link
    // Handle multiple formats: with/without bold, with/without existing number
    if (valcreJobUrl) {
      console.log('🔍 Before replacement - Stage 1 VALCRE line:', updatedStage1.split('\n').find(l => l.includes('VALCRE JOB NUMBER')) || 'NOT FOUND')
      
      // Pattern 1: With bold markers (original format) - no number yet
      updatedStage1 = updatedStage1.replace(
        /📍 \*\*VALCRE JOB NUMBER:\*\*\s*$/m,
        `📍 **VALCRE JOB NUMBER:** [${valcreJobNumber}](${valcreJobUrl})`
      )
      // Pattern 2: Without bold markers - no number yet
      updatedStage1 = updatedStage1.replace(
        /📍 VALCRE JOB NUMBER:\s*$/m,
        `📍 **VALCRE JOB NUMBER:** [${valcreJobNumber}](${valcreJobUrl})`
      )
      // Pattern 3: Already has number but no link (most common case after Stage 2 runs)
      updatedStage1 = updatedStage1.replace(
        /📍 VALCRE JOB NUMBER:\s*[^\n]*/,
        `📍 **VALCRE JOB NUMBER:** [${valcreJobNumber}](${valcreJobUrl})`
      )
      // Pattern 4: With bold but has number already
      updatedStage1 = updatedStage1.replace(
        /📍 \*\*VALCRE JOB NUMBER:\*\*\s*[^\n]*/,
        `📍 **VALCRE JOB NUMBER:** [${valcreJobNumber}](${valcreJobUrl})`
      )
      
      console.log('🔍 After replacement - Stage 1 VALCRE line:', updatedStage1.split('\n').find(l => l.includes('VALCRE JOB NUMBER')) || 'NOT FOUND')
      console.log('✅ Valcre link added to Stage 1')
      console.log('🔍 Link in description:', updatedStage1.includes(valcreJobUrl) ? 'YES' : 'NO')
    } else {
      console.log('⚠️ No Valcre job URL - valcre_job_id:', loeDetails.valcre_job_id, 'job_number:', valcreJobNumber)
    }

    // Build Stage 2 LOE section
    const stage2Section = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**LOE QUOTE & VALUATION DETAILS**

**PROPERTY VALUATION**
• Property Rights:  ${loeDetails.property_rights_appraised || ''}
• Scope of Work:    ${loeDetails.scope_of_work || ''}
• Report Type:      ${loeDetails.report_type || ''}

**FINANCIAL DETAILS**
• Appraisal Fee:    ${formatCurrency(loeDetails.appraisal_fee)}
• Retainer Amount:  ${formatCurrency(loeDetails.retainer_amount)}
• Delivery Date:    ${formatDate(loeDetails.delivery_date)}
• Payment Terms:    ${loeDetails.payment_terms || ''}
${loeDetails.internal_comments || loeDetails.delivery_comments || loeDetails.payment_comments || loeDetails.client_comments ? `
**APPRAISER NOTES**` : ''}${loeDetails.internal_comments ? `
• ${loeDetails.internal_comments}` : ''}${loeDetails.delivery_comments ? `
• ${loeDetails.delivery_comments}` : ''}${loeDetails.payment_comments ? `
• ${loeDetails.payment_comments}` : ''}${loeDetails.client_comments ? `
• ${loeDetails.client_comments}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

    // Combine Stage 1 (updated) + Stage 2 (new)
    const combinedDescription = updatedStage1 + stage2Section

    // Debug logging
    console.log('=== DEBUG INFO ===')
    console.log('VAL Number:', valcreJobNumber)
    console.log('VAL URL:', valcreJobUrl)
    console.log('Stage 1 content (first 300 chars):', updatedStage1.substring(0, 300))
    console.log('Does Stage 1 contain VAL number?', updatedStage1.includes(valcreJobNumber))
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
          || liveDesc.includes('LOE QUOTE & VALUATION DETAILS')
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

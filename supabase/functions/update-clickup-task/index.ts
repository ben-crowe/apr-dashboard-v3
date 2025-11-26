// Supabase Edge Function for ClickUp Task Update (Stage 2: LOE Section)
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ClickUp Configuration - DEVELOPMENT ENVIRONMENT (Ben's test workspace)
const CLICKUP_API_TOKEN = Deno.env.get('CLICKUP_API_TOKEN') || 'pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU'

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

    console.log('Updating ClickUp task with LOE details for job:', jobId)

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

    // Build Valcre job URL if we have a job number
    const valcreJobNumber = loeDetails.job_number || job.job_number || 'PENDING'
    const valcreJobUrl = valcreJobNumber !== 'PENDING'
      ? `https://app.valcre.com/jobs/${loeDetails.valcre_job_id || ''}`
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

    // Extract Stage 1 data from existing description (everything before "⏳ Waiting for LOE")
    const stage1Match = existingDescription.match(/([\s\S]*?)⏳ Waiting for LOE/i)
    const stage1Content = stage1Match ? stage1Match[1].trim() : existingDescription

    // Update top links section with actual Valcre job link
    let updatedStage1 = stage1Content

    // Replace blank Valcre Job Number with actual job number and link
    if (valcreJobUrl) {
      updatedStage1 = updatedStage1.replace(
        /📍 \*\*VALCRE JOB NUMBER:\*\*\s+/,
        `📍 **VALCRE JOB NUMBER:**     [${valcreJobNumber}](${valcreJobUrl})`
      )
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

    // PATCH task to ClickUp
    const updatePayload = {
      name: updatedTaskName,
      description: combinedDescription, // Plain description (fallback)
      markdown_description: combinedDescription // Markdown description (preferred)
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

    return new Response(
      JSON.stringify({
        success: true,
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

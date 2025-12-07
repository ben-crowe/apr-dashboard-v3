// Temporary test function to fetch ClickUp task content
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CLICKUP_API_TOKEN = Deno.env.get('CLICKUP_API_TOKEN') || 'pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { taskId } = await req.json()

    if (!taskId) {
      throw new Error('Task ID is required')
    }

    const response = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': CLICKUP_API_TOKEN,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`ClickUp API error: ${errorText}`)
    }

    const task = await response.json()

    // Extract just the relevant parts - use description field (not markdown_description)
    const description = task.description || task.markdown_description || ''
    const valLine = description.split('\n').find((line: string) => line.includes('VALCRE JOB NUMBER')) || 'NOT FOUND'
    const hasCorrectUrl = description.includes('job/edit/') && description.includes('#job')

    return new Response(
      JSON.stringify({
        success: true,
        taskName: task.name,
        valLine,
        hasCorrectUrl,
        fullDescription: description.substring(0, 1000),
        descriptionLength: description.length || 0,
        actualDescription: task.description?.substring(0, 800)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
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

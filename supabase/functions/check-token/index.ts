// Check what CLICKUP_API_TOKEN is available
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const CLICKUP_API_TOKEN = Deno.env.get('CLICKUP_API_TOKEN') || 'pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU'

  return new Response(
    JSON.stringify({
      tokenExists: !!Deno.env.get('CLICKUP_API_TOKEN'),
      tokenPrefix: CLICKUP_API_TOKEN.substring(0, 12),
      isDevToken: CLICKUP_API_TOKEN.startsWith('pk_63967834'),
      isProdToken: CLICKUP_API_TOKEN.startsWith('pk_10791838')
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    }
  )
})

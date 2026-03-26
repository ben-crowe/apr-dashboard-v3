import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const CLICKUP_ENV = Deno.env.get('CLICKUP_ENV') || 'dev'
  const CLICKUP_WORKSPACE_ID = CLICKUP_ENV === 'production' ? '9014181018' : '8555561'

  let CLICKUP_API_TOKEN: string | null = null

  // Try OAuth first
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: connection, error: connectionError } = await supabase
    .from('clickup_connections')
    .select('access_token')
    .eq('workspace_id', CLICKUP_WORKSPACE_ID)
    .limit(1)
    .single()

  if (!connectionError && connection?.access_token) {
    CLICKUP_API_TOKEN = connection.access_token
  }

  // Fallback to env var
  if (!CLICKUP_API_TOKEN) {
    const envToken = CLICKUP_ENV === 'production' 
      ? Deno.env.get('CLICKUP_API_TOKEN_VALTA')
      : Deno.env.get('CLICKUP_API_TOKEN') || 'pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY'
    CLICKUP_API_TOKEN = envToken
  }

  return new Response(
    JSON.stringify({
      env: CLICKUP_ENV,
      workspaceId: CLICKUP_WORKSPACE_ID,
      oauthError: connectionError?.message,
      oauthFound: !!connection,
      tokenSet: !!CLICKUP_API_TOKEN,
      tokenPrefix: CLICKUP_API_TOKEN?.substring(0, 20),
      tokenLength: CLICKUP_API_TOKEN?.length
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
})

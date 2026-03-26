Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const clickupEnv = Deno.env.get('CLICKUP_ENV')
  const valtaToken = Deno.env.get('CLICKUP_API_TOKEN_VALTA')

  return new Response(
    JSON.stringify({
      clickupEnv,
      valtaTokenSet: !!valtaToken,
      valtaTokenPrefix: valtaToken?.substring(0, 15)
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
})

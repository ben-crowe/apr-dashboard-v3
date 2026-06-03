Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const clickupEnv = Deno.env.get('CLICKUP_ENV')
  const clickupListId = Deno.env.get('CLICKUP_LIST_ID')
  const valtaToken = Deno.env.get('CLICKUP_API_TOKEN_VALTA')

  // Replicate create-clickup-task list-resolution logic EXACTLY
  const DEV_LIST = clickupListId || '901706896375'
  const PROD_LIST = '901402094744'
  const resolvedListId = clickupEnv === 'production' ? PROD_LIST : DEV_LIST

  return new Response(
    JSON.stringify({
      clickupEnv: clickupEnv ?? '(unset → defaults to dev)',
      clickupListIdSecret: clickupListId ?? '(unset → DEV falls back to 901706896375)',
      resolvedListId,
      willHitChrisProd: resolvedListId === PROD_LIST,
      isBensTestList: resolvedListId === '901706896375',
      valtaTokenSet: !!valtaToken,
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
})

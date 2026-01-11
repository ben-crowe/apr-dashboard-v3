// Supabase Edge Function for ClickUp OAuth Authorization
// Generates authorization URL and redirects user to ClickUp
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// OAuth Configuration
const CLICKUP_CLIENT_ID = Deno.env.get('CLICKUP_CLIENT_ID') || ''
const CLICKUP_REDIRECT_URI = Deno.env.get('CLICKUP_REDIRECT_URI') || 'https://apr-dashboard-v3.vercel.app'

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate client ID
    if (!CLICKUP_CLIENT_ID) {
      throw new Error('ClickUp OAuth client ID not configured')
    }

    // Get user ID from request (should be authenticated)
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('Authorization header required')
    }

    // Generate state token for CSRF protection
    const state = crypto.randomUUID()

    // Build authorization URL
    const authUrl = new URL('https://app.clickup.com/api')
    authUrl.searchParams.set('client_id', CLICKUP_CLIENT_ID)
    authUrl.searchParams.set('redirect_uri', CLICKUP_REDIRECT_URI)
    authUrl.searchParams.set('state', state)

    // Return authorization URL (frontend will redirect user)
    return new Response(
      JSON.stringify({
        success: true,
        authorizationUrl: authUrl.toString(),
        state: state,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('OAuth authorization error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

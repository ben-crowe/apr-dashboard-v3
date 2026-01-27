// Supabase Edge Function for ClickUp OAuth Callback
// Exchanges authorization code for access token and stores it
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// OAuth Configuration
const CLICKUP_CLIENT_ID = Deno.env.get('CLICKUP_CLIENT_ID') || ''
const CLICKUP_CLIENT_SECRET = Deno.env.get('CLICKUP_CLIENT_SECRET') || ''
const CLICKUP_REDIRECT_URI = Deno.env.get('CLICKUP_REDIRECT_URI') || 'https://apr-dashboard-v3.vercel.app'

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate credentials
    if (!CLICKUP_CLIENT_ID || !CLICKUP_CLIENT_SECRET) {
      throw new Error('ClickUp OAuth credentials not configured')
    }

    const { code, state, userId } = await req.json()

    if (!code) {
      throw new Error('Authorization code is required')
    }

    if (!userId) {
      throw new Error('User ID is required')
    }

    console.log('Exchanging authorization code for access token...')

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.clickup.com/api/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLICKUP_CLIENT_ID,
        client_secret: CLICKUP_CLIENT_SECRET,
        code: code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('ClickUp token exchange error:', errorText)
      throw new Error(`Failed to exchange authorization code: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    if (!accessToken) {
      throw new Error('No access token received from ClickUp')
    }

    console.log('Access token received, fetching authorized workspaces...')

    // Get authorized workspaces (teams)
    const teamsResponse = await fetch('https://api.clickup.com/api/v2/team', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!teamsResponse.ok) {
      const errorText = await teamsResponse.text()
      console.error('ClickUp teams fetch error:', errorText)
      throw new Error(`Failed to fetch authorized workspaces: ${teamsResponse.status}`)
    }

    const teamsData = await teamsResponse.json()
    const workspaces = teamsData.teams || []

    console.log(`Found ${workspaces.length} authorized workspace(s)`)

    // Get Supabase client with Service Role (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Store access token for each authorized workspace
    const connectionPromises = workspaces.map(async (workspace: any) => {
      console.log(`Storing connection for workspace ${workspace.id} (${workspace.name})`)

      const { data, error } = await supabase
        .from('clickup_connections')
        .upsert({
          user_id: userId,
          workspace_id: workspace.id,
          access_token: accessToken, // In production, encrypt this
          authorized_workspaces: workspaces.map((w: any) => ({
            id: w.id,
            name: w.name,
          })),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,workspace_id',
        })
        .select()

      if (error) {
        console.error(`Failed to store connection for workspace ${workspace.id}:`, error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        throw error
      }

      console.log(`✅ Stored connection for workspace ${workspace.id}`)

      return {
        workspaceId: workspace.id,
        workspaceName: workspace.name,
      }
    })

    const connections = await Promise.all(connectionPromises)

    console.log('✅ OAuth callback completed successfully')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully connected to ClickUp',
        workspaces: connections,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('OAuth callback error:', error)
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

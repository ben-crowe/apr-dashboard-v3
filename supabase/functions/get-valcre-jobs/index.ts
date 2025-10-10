import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchTerm, limit = 10, offset = 0 } = await req.json()
    
    console.log('Getting Valcre jobs with params:', { searchTerm, limit, offset });

    // Get OAuth token first
    const tokenFormData = new FormData();
    tokenFormData.append('grant_type', 'password');
    tokenFormData.append('username', Deno.env.get('VALCRE_USERNAME') || '');
    tokenFormData.append('password', Deno.env.get('VALCRE_PASSWORD') || '');

    console.log('Authenticating with Valcre...');
    const tokenResponse = await fetch('https://auth.valcre.com/oauth/token', {
      method: 'POST',
      body: tokenFormData
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Authentication failed:', errorText);
      throw new Error(`Authentication failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Authentication successful');

    // Construct query params for job search
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });
    
    if (searchTerm) {
      queryParams.append('search', searchTerm);
    }

    // Get jobs from Valcre
    const jobsResponse = await fetch(
      `https://public-api.valcre.com/api/v1.1/jobs?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const responseText = await jobsResponse.text();
    console.log('Valcre jobs response status:', jobsResponse.status);
    console.log('Valcre jobs raw response:', responseText);

    if (!jobsResponse.ok) {
      console.error('Failed to get jobs:', responseText);
      return new Response(
        JSON.stringify({ error: 'Failed to get jobs', details: responseText }),
        { 
          status: jobsResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    let jobs;
    try {
      jobs = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('Failed to parse jobs response:', parseErr);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid response from Valcre API', 
          details: parseErr.message 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Jobs retrieved successfully:', jobs);

    return new Response(
      JSON.stringify({ 
        success: true, 
        jobs: jobs,
        count: Array.isArray(jobs) ? jobs.length : (jobs.data ? jobs.data.length : 0)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})
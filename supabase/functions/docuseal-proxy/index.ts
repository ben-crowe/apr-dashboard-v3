import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const endpoint = url.searchParams.get('endpoint')
    
    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Missing endpoint parameter' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const body = await req.json()
    
    // DocuSeal API key - Updated Sept 7, 2025
    const DOCUSEAL_API_KEY = Deno.env.get('DOCUSEAL_API_KEY') || '9jnCPmKv5FfnokxJBnn4ij1tPgsQPEqqXASs2MSyaRN'
    
    console.log(`Proxying request to DocuSeal: ${endpoint}`)
    
    // Make request to DocuSeal
    const docusealResponse = await fetch(`https://api.docuseal.com/${endpoint}`, {
      method: 'POST',
      headers: {
        'X-Auth-Token': DOCUSEAL_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    const responseData = await docusealResponse.json()
    
    if (!docusealResponse.ok) {
      console.error('DocuSeal error:', responseData)
      console.error('Request body was:', body)
      console.error('Endpoint was:', endpoint)
      
      // Provide more detailed error information
      let errorMessage = 'DocuSeal API error';
      if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.errors) {
        errorMessage = Object.entries(responseData.errors)
          .map(([field, errors]) => `${field}: ${errors}`)
          .join(', ');
      } else if (responseData.message) {
        errorMessage = responseData.message;
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: responseData,
          status: docusealResponse.status,
          request: body // Include what we sent for debugging
        }),
        { 
          status: docusealResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    console.log('DocuSeal response success')
    
    return new Response(
      JSON.stringify(responseData),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('Error in docuseal-proxy:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Proxy error',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
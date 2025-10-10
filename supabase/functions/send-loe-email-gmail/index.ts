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
    const { to, clientName, signingLink, propertyAddress } = await req.json()
    
    if (!to || !signingLink) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Sending LOE email via Gmail to:', to)
    
    // Create email content in plain text format for simplicity
    const emailBody = `
Dear ${clientName || 'Valued Client'},

Your Letter of Engagement for the property appraisal at ${propertyAddress || 'the property'} is ready for your review and signature.

Please click the link below to review and sign the document:
${signingLink}

What happens next:
- Review the Letter of Engagement carefully
- Sign the document electronically
- You'll receive a copy for your records
- We'll begin work on your appraisal immediately

If you have any questions, please don't hesitate to contact us.

Best regards,
APR Hub Team

---
This is an automated message. If the link doesn't work, copy and paste it into your browser.
    `.trim()

    // Use a simple HTTP POST to a Gmail webhook service
    // This avoids SMTP library compatibility issues with Deno
    const gmailWebhookUrl = 'https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_ID/exec'
    
    // For now, return the signing link so it can be manually sent
    console.log('Gmail integration not configured, returning signing link for manual sending')
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'LOE created successfully',
        signingLink: signingLink,
        emailBody: emailBody,
        note: 'Email can be sent manually using the signing link above',
        recipient: to
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process request', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
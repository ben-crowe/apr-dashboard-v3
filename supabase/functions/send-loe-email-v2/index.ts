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
    // Parse request body
    const { to, clientName, signingLink, propertyAddress } = await req.json()
    
    // Validate required fields
    if (!to || !signingLink) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to and signingLink' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Sending LOE email to:', to)
    console.log('Client name:', clientName)
    console.log('Property:', propertyAddress)
    
    // Create email HTML content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a73e8; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; padding: 12px 30px; background: #1a73e8; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Letter of Engagement - Ready for Signature</h2>
          </div>
          <div class="content">
            <p>Dear ${clientName || 'Valued Client'},</p>
            
            <p>Your Letter of Engagement for the property appraisal ${propertyAddress ? `at <strong>${propertyAddress}</strong>` : ''} is ready for your review and signature.</p>
            
            <p>Please click the button below to review and sign the document:</p>
            
            <div style="text-align: center;">
              <a href="${signingLink}" class="button" style="color: white;">Review & Sign Document</a>
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Review the Letter of Engagement carefully</li>
              <li>Sign the document electronically</li>
              <li>You'll receive a copy for your records</li>
              <li>We'll begin work on your appraisal immediately</li>
            </ul>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <div class="footer">
              <p>This is an automated message from APR Hub. Please do not reply to this email.</p>
              <p>If the button doesn't work, copy and paste this link into your browser:<br>
              <small>${signingLink}</small></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    // Use Resend API (more reliable than SMTP)
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_123456789' // You'll need to add this
    
    if (RESEND_API_KEY === 're_123456789') {
      // Fallback: Return success with the signing link
      console.log('No email service configured, returning signing link')
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'LOE ready (email service not configured)',
          signingLink: signingLink,
          note: 'Please configure RESEND_API_KEY or use Gmail SMTP'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Send via Resend (if configured)
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'APR Hub <admin@valta.ca>',
        to: [to],
        subject: 'Letter of Engagement - Ready for Signature',
        html: emailHtml,
      }),
    })
    
    if (resendResponse.ok) {
      console.log('Email sent successfully via Resend')
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully',
          recipient: to,
          from: 'admin@valta.ca'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      const error = await resendResponse.text()
      console.error('Resend error:', error)
      
      // Return success anyway - LOE was created
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'LOE created (email failed but link available)',
          signingLink: signingLink,
          emailError: error
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
  } catch (error) {
    console.error('Error in send-loe-email function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process email request',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
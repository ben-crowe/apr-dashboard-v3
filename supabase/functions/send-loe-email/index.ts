import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

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
    
    // For now, we'll use a simple email service
    // In production, you'd integrate with SendGrid, Resend, or another service
    
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

    // Send actual email using Gmail SMTP
    console.log('Sending email via Gmail SMTP...')
    
    try {
      const client = new SmtpClient()
      
      // Connect to Gmail SMTP
      await client.connectTLS({
        hostname: "smtp.gmail.com",
        port: 465,
        username: Deno.env.get('GMAIL_USERNAME') || "admin@valta.ca",
        password: Deno.env.get('GMAIL_APP_PASSWORD') || "spusouthiyfmesdj", // App-specific password
      })
      
      // Send the email
      await client.send({
        from: "APR Hub <admin@valta.ca>",
        to: to,
        subject: "Letter of Engagement - Ready for Signature",
        content: "Please view this email in HTML",
        html: emailHtml,
      })
      
      await client.close()
      
      console.log('Email sent successfully to:', to)
      
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
    } catch (smtpError) {
      console.error('SMTP error:', smtpError)
      
      // Fallback response even if email fails
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Email sending failed, but LOE was created',
          error: smtpError.message,
          recipient: to
        }),
        { 
          status: 200, // Still return 200 to not break the flow
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
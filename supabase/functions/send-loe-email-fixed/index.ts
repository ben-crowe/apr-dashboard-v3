import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';

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
        JSON.stringify({ error: 'Missing required fields: to and signingLink' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Sending LOE email to:', to)
    
    // Use Resend API - clean HTML emails without encoding issues
    // Updated Nov 18, 2025 - New Resend account for admin@valta.ca
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_T2VGRdd3_CqZuH9XCBrjxJuNPyQwykHJp';
    
    const emailHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; color: #333;">
<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
<p>Hi ${clientName || 'Valued Client'},</p>
<p>Your Letter of Engagement for the property appraisal at ${propertyAddress || 'your property'} is ready for your review and signature.</p>
<p><a href="${signingLink}" style="background-color: #1a73e8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Review & Sign Document</a></p>
<p>What happens next:</p>
<ul>
<li>Review the Letter of Engagement carefully</li>
<li>Sign the document electronically</li>
<li>You'll receive a copy for your records</li>
<li>We'll begin work on your appraisal immediately</li>
</ul>
<p>If you have any questions, please don't hesitate to contact us.</p>
<p>Best regards,</p>
<p><strong>Client Services Team</strong><br>
Valta Property Valuations Ltd.<br>
#300-4838 Richard Road SW, Calgary, AB T3E 6L1<br>
office: 587-801-5151 | email: clientcare@valta.ca | web: www.valta.ca</p>
</div>
</body>
</html>`;

    // Send via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Valta Appraisals <admin@valta.ca>', // Updated Nov 18 - valta.ca verified sender
        to: [to],
        subject: 'Letter of Engagement - Ready for Signature',
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await response.json();
    console.log('Email sent successfully via Resend:', data.id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        recipient: to,
        emailId: data.id
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('Error in send-loe-email function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
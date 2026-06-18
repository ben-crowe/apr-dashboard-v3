import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';
import { graphConfigured, graphSendMail } from '../_shared/graph.ts';

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // `subject` + `bodyHtml` are OPTIONAL composed overrides from the editable ② Email step.
    // When present, they ARE the email (already merged for names/job#); we only resolve the
    // {{signing_link}} token here (it can't exist before the send). When absent, we fall back
    // to the verbatim hardcoded seed below (TestLOE / default path) — nothing else changes.
    const { to, clientName, signingLink, propertyAddress, subject: subjectOverride, bodyHtml } = await req.json()

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
    // Updated Jan 8, 2026 - Using bc@crowestudio.com Resend account for testing
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_G2kzpzLs_BYcHQSapaKbNosgRvGYpT7e8';
    
    // Send to actual recipient (no redirect needed - using bc@crowestudio.com Resend account)
    const actualRecipient = to;
    console.log(`📧 Sending LOE email to: ${actualRecipient}`);
    
    // VERBATIM SEED — the fallback email used when no composed override is sent. Kept in sync
    // with src/utils/loe/emailTemplate.ts (EMAIL_SEED_*). The editable ② Email step lifts this
    // out into the email_templates default; this stays as the no-override fallback.
    const seedHtml = `<!DOCTYPE html>
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

    // Composed override wins. Resolve the send-time {{signing_link}} token into it (belt-and-
    // suspenders — the client also substitutes before sending). Otherwise use the verbatim seed.
    const emailHtml = (typeof bodyHtml === 'string' && bodyHtml.trim())
      ? bodyHtml.split('{{signing_link}}').join(signingLink)
      : seedHtml;

    const subject = (typeof subjectOverride === 'string' && subjectOverride.trim())
      ? subjectOverride.split('{{signing_link}}').join(signingLink)
      : 'Letter of Engagement - Ready for Signature';

    // PRODUCTION transport: Microsoft Graph sendMail from a valta.ca mailbox.
    // GATED on an EXPLICIT GRAPH_SEND_MAILBOX — NOT just graphConfigured(). The Graph app
    // secrets exist for SharePoint, but email stays on the Resend/crowestudio test path until
    // a real valta.ca sending mailbox is deliberately set (Ben: production-only, later).
    const graphMailbox = Deno.env.get('GRAPH_SEND_MAILBOX');
    if (graphConfigured() && graphMailbox) {
      const mailbox = graphMailbox;
      // Sender DISPLAY name (cosmetic) — settable via the GRAPH_SEND_NAME secret so the wording
      // can change without a code deploy. Falls back to a sensible default.
      const fromName = Deno.env.get('GRAPH_SEND_NAME') || 'Valta Appraisals';
      await graphSendMail({ mailbox, fromName, to: actualRecipient, subject, html: emailHtml });
      console.log('Email sent successfully via Microsoft Graph from:', `${fromName} <${mailbox}>`);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email sent successfully',
          recipient: actualRecipient,
          transport: 'graph',
          sender: mailbox,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fallback transport: Resend (test path, sandbox sender → bc@crowestudio.com).
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Valta Appraisals <onboarding@resend.dev>', // Sandbox domain - works for testing to bc@crowestudio.com
        to: [actualRecipient], // Send to actual recipient
        subject,
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
        recipient: actualRecipient,
        transport: 'resend',
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
        details: (error as Error).message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
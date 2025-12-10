import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * Generate PDF from HTML using Gotenberg
 *
 * Gotenberg is a Docker-powered stateless API for PDF generation.
 * Deploy with: docker run -p 3000:3000 gotenberg/gotenberg:8
 *
 * For production, set GOTENBERG_URL env var to your deployed instance.
 */
serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { html, filename = "document.pdf" } = await req.json();

    if (!html) {
      return new Response(JSON.stringify({ error: "Missing html parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Gotenberg URL - default to local Docker, override with env var for production
    const GOTENBERG_URL =
      Deno.env.get("GOTENBERG_URL") || "http://host.docker.internal:3001";

    console.log(`Generating PDF via Gotenberg at: ${GOTENBERG_URL}`);

    // Create FormData with HTML file
    const formData = new FormData();

    // Create HTML blob and append as file
    const htmlBlob = new Blob([html], { type: "text/html" });
    formData.append("files", htmlBlob, "index.html");

    // PDF options - margins set to 0, CSS handles all spacing
    formData.append("paperWidth", "8.5");
    formData.append("paperHeight", "11");
    formData.append("marginTop", "0");       // CSS handles padding
    formData.append("marginBottom", "0");    // CSS handles padding
    formData.append("marginLeft", "0");      // CSS handles padding
    formData.append("marginRight", "0");     // CSS handles padding
    formData.append("printBackground", "true");
    formData.append("preferCssPageSize", "true");

    // Call Gotenberg's Chromium HTML conversion endpoint
    const response = await fetch(
      `${GOTENBERG_URL}/forms/chromium/convert/html`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gotenberg error:", response.status, errorText);

      return new Response(
        JSON.stringify({
          error: "PDF generation failed",
          details: errorText,
          status: response.status,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get PDF binary
    const pdfBuffer = await response.arrayBuffer();

    console.log(`PDF generated successfully: ${pdfBuffer.byteLength} bytes`);

    // Return PDF as binary with appropriate headers
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Error in generate-pdf:", error);

    // Check if it's a connection error (Gotenberg not running)
    if (
      error.message?.includes("connection") ||
      error.message?.includes("ECONNREFUSED")
    ) {
      return new Response(
        JSON.stringify({
          error: "PDF service unavailable",
          details:
            "Gotenberg service is not running. Start with: docker run -p 3000:3000 gotenberg/gotenberg:8",
          message: error.message,
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        error: "PDF generation error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

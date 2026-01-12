#!/bin/bash
# Email Endpoint API Tests
# Tests all email sending endpoints without needing browser/Playwright

set -e

SUPABASE_URL="https://ngovnamnjmexdpjtcnky.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ"

echo "=========================================="
echo "APR Dashboard - Email Endpoint API Tests"
echo "=========================================="
echo ""

# Test 1: LOE Email Edge Function
echo "Test 1: LOE Email Edge Function"
echo "Endpoint: /functions/v1/send-loe-email-fixed"
echo "Method: POST"
echo ""

LOE_PAYLOAD=$(cat <<'EOF'
{
  "to": "test@example.com",
  "clientName": "Thomas Perez",
  "signingLink": "https://apr-dashboard-v3.vercel.app/sign/test-loe-id",
  "propertyAddress": "Westside Mall, 10 Quarry Park Blvd SE Suite 300"
}
EOF
)

echo "Sending LOE email test..."
LOE_RESPONSE=$(curl -s -X POST \
  "$SUPABASE_URL/functions/v1/send-loe-email-fixed" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "$LOE_PAYLOAD" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$LOE_RESPONSE" | tail -n1)
BODY=$(echo "$LOE_RESPONSE" | head -n-1)

echo "HTTP Status: $HTTP_CODE"
echo "Response: $BODY"
echo ""

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ LOE Email Endpoint: SUCCESS"
else
  echo "❌ LOE Email Endpoint: FAILED (HTTP $HTTP_CODE)"
fi

echo ""
echo "=========================================="
echo "Test 2: DocuSeal Proxy Edge Function"
echo "Endpoint: /functions/v1/docuseal-proxy"
echo "Method: POST"
echo ""

DOCUSEAL_PAYLOAD=$(cat <<'EOF'
{
  "name": "LOE-TEST-20251020",
  "send_email": false,
  "documents": [
    {
      "name": "test-loe",
      "html": "<html><body><h1>Test LOE</h1><signature-field></signature-field><date-field></date-field></body></html>",
      "size": "Letter"
    }
  ],
  "submitters": [
    {
      "email": "test@example.com",
      "name": "Test Client",
      "role": "First Party"
    }
  ]
}
EOF
)

echo "Sending DocuSeal proxy test..."
DOCUSEAL_RESPONSE=$(curl -s -X POST \
  "$SUPABASE_URL/functions/v1/docuseal-proxy?endpoint=submissions/html" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "$DOCUSEAL_PAYLOAD" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$DOCUSEAL_RESPONSE" | tail -n1)
BODY=$(echo "$DOCUSEAL_RESPONSE" | head -n-1)

echo "HTTP Status: $HTTP_CODE"
echo "Response: $BODY"
echo ""

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
  echo "✅ DocuSeal Proxy Endpoint: SUCCESS"
else
  echo "❌ DocuSeal Proxy Endpoint: FAILED (HTTP $HTTP_CODE)"
fi

echo ""
echo "=========================================="
echo "Test 3: Verify Environment Variables"
echo "Checking if Supabase can reach Edge Functions"
echo ""

echo "Testing Supabase connectivity..."
HEALTH_RESPONSE=$(curl -s -X GET \
  "$SUPABASE_URL/functions/v1/send-loe-email-fixed" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" -eq 405 ] || [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ Supabase Edge Function Infrastructure: REACHABLE"
else
  echo "❌ Supabase Edge Function Infrastructure: UNREACHABLE (HTTP $HTTP_CODE)"
fi

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo "All API tests completed. Check above for any failures."
echo ""
echo "To test in production:"
echo "curl -X POST https://apr-dashboard-v3-f3r95r5xl-ben-crowes-projects-5903f03d.vercel.app/api/send-email \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"to\": \"your-email@example.com\", \"subject\": \"Test\", \"body\": \"Test email\"}'"

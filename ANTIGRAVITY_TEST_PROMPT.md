# ClickUp Task Update Verification Test

## PROBLEM STATEMENT
The `update-clickup-task` Supabase Edge Function is supposed to:
1. Add a clickable VAL job number to line 2: `📍 **VALCRE JOB NUMBER:** [VAL251033](valcre-url)`
2. Add Section 2 (LOE Quote & Valuation Details) ONCE to the task description

## CURRENT ISSUE
- The VAL number line remains blank: `📍 VALCRE JOB NUMBER:`
- Section 2 appears MULTIPLE times (was appearing 3x in last test)
- The Edge Function returns "success" but changes aren't reflected in ClickUp

## TEST REQUIREMENTS

### Test Job Details
- **Job ID**: `ff14d9e8-0247-4eac-b2a5-8edc18b3940c`
- **Expected VAL Number**: `VAL251033`
- **Expected ClickUp Task ID**: `86dykbbcw`
- **ClickUp Task URL**: https://app.clickup.com/t/86dykbbcw

### API Endpoints
- **Supabase URL**: `https://ngovnamnjmexdpjtcnky.supabase.co`
- **Edge Function**: `update-clickup-task`
- **ClickUp API**: `https://api.clickup.com/api/v2/task/{taskId}`

### Required Credentials
You'll need to get these from the user or environment:
1. **Supabase Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ`
2. **Production ClickUp API Token**: Ask user for the production token (NOT the dev token `pk_63967834_...`)

## TEST PROCEDURE

### Step 1: Call the Edge Function
```bash
curl -X POST https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/update-clickup-task \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {SUPABASE_ANON_KEY}" \
  -d '{"jobId":"ff14d9e8-0247-4eac-b2a5-8edc18b3940c"}'
```

**Expected Response:**
```json
{
  "success": true,
  "taskId": "86dykbbcw",
  "taskName": "VAL251033 - Riverside Plaza, 8258 Lake Street",
  "taskUrl": "https://app.clickup.com/t/86dykbbcw"
}
```

### Step 2: Verify ClickUp Task Content
```bash
curl -X GET https://api.clickup.com/api/v2/task/86dykbbcw \
  -H "Authorization: {PRODUCTION_CLICKUP_TOKEN}" \
  -H "Content-Type: application/json"
```

### Step 3: Parse and Validate Response

Extract `markdown_description` field and verify:

#### ✅ SUCCESS CRITERIA:
1. **VAL Number appears on line 2:**
   ```
   📍 **VALCRE JOB NUMBER:** [VAL251033](https://app.valcre.com/jobs/726004)
   ```
   - Check: Does line contain `VAL251033`?
   - Check: Is it a markdown link with format `[VAL251033](url)`?

2. **Section 2 appears EXACTLY ONCE:**
   - Search for: `LOE QUOTE & VALUATION DETAILS`
   - Count occurrences: Should be exactly 1
   - Check: Does Section 2 come AFTER the CLIENT COMMENTS divider?

3. **All LOE details are present:**
   - Property Rights: `Leased Fee Interest`
   - Scope of Work: `Cost Approach`
   - Appraisal Fee: `1,100`
   - Delivery Date: `25.12.10`

#### ❌ FAILURE CRITERIA:
1. VAL number line is blank or missing
2. Section 2 appears 0 times or more than 1 time
3. Section 2 has empty/missing LOE details

## DEBUGGING STEPS IF TEST FAILS

### If VAL number is missing:
1. Check the Edge Function logs for debug output:
   ```bash
   # Edge Function should log:
   # "=== DEBUG INFO ==="
   # "VAL Number: VAL251033"
   # "Does Stage 1 contain VAL number? true/false"
   ```
2. Verify the regex replacement is happening
3. Check if ClickUp is receiving the update but not saving it

### If Section 2 duplicates:
1. The Stage 1 extraction regex is failing
2. It's including old Section 2 content in Stage 1
3. Then appending new Section 2, causing duplication

### If Section 2 is empty:
1. LOE details aren't saved in database before calling Edge Function
2. Check job_loe_details table has data for this job_id

## EXPECTED FINAL TASK FORMAT

```markdown
📍 **NEW APPRAISAL REQUEST:** [APR Dashboard](url)
📍 **VALCRE JOB NUMBER:** [VAL251033](https://app.valcre.com/jobs/726004)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**RECEIVED DATE:**  25.11.26 / 8:07 PM
  ▸ LOE Sent:
  ▸ LOE Signed:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**CLIENT INFORMATION**
• Name:    Helen Thomas
• Org:     21 Diamond Properties
...

**CLIENT COMMENTS**
• Test submission generated at 4:07:13 PM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**LOE QUOTE & VALUATION DETAILS**

**PROPERTY VALUATION**
• Property Rights:  Leased Fee Interest
• Scope of Work:    Cost Approach
• Report Type:      Appraisal Report

**FINANCIAL DETAILS**
• Appraisal Fee:    1,100
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## AUTOMATED TEST SCRIPT

Create this script and run it:

```bash
#!/bin/bash
set -e

SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ"
PRODUCTION_CLICKUP_TOKEN="ASK_USER_FOR_THIS"
JOB_ID="ff14d9e8-0247-4eac-b2a5-8edc18b3940c"
TASK_ID="86dykbbcw"

echo "=== ClickUp Update Verification Test ==="
echo ""

# Step 1: Call Edge Function
echo "Step 1: Calling update-clickup-task Edge Function..."
EDGE_RESPONSE=$(curl -s -X POST \
  https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/update-clickup-task \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -d "{\"jobId\":\"$JOB_ID\"}")

echo "Edge Function Response:"
echo "$EDGE_RESPONSE" | jq '.'

if ! echo "$EDGE_RESPONSE" | jq -e '.success == true' > /dev/null; then
  echo "❌ FAIL: Edge Function did not return success"
  exit 1
fi
echo "✅ Edge Function returned success"
echo ""

# Step 2: Fetch actual ClickUp task
echo "Step 2: Fetching ClickUp task content..."
TASK_CONTENT=$(curl -s -X GET \
  "https://api.clickup.com/api/v2/task/$TASK_ID" \
  -H "Authorization: $PRODUCTION_CLICKUP_TOKEN" \
  -H "Content-Type: application/json")

if echo "$TASK_CONTENT" | jq -e '.err' > /dev/null; then
  echo "❌ FAIL: ClickUp API error"
  echo "$TASK_CONTENT" | jq '.'
  exit 1
fi

DESCRIPTION=$(echo "$TASK_CONTENT" | jq -r '.markdown_description // .description')

# Step 3: Validate content
echo "Step 3: Validating task content..."
echo ""

# Check 1: VAL number present
if echo "$DESCRIPTION" | grep -q "VALCRE JOB NUMBER.*VAL251033"; then
  echo "✅ VAL number is present: VAL251033"
else
  echo "❌ FAIL: VAL number is missing or incorrect"
  echo "VAL line content:"
  echo "$DESCRIPTION" | grep "VALCRE JOB NUMBER" || echo "(Line not found)"
  exit 1
fi

# Check 2: Section 2 appears exactly once
SECTION2_COUNT=$(echo "$DESCRIPTION" | grep -c "LOE QUOTE & VALUATION DETAILS" || echo "0")
if [ "$SECTION2_COUNT" -eq 1 ]; then
  echo "✅ Section 2 appears exactly once"
elif [ "$SECTION2_COUNT" -eq 0 ]; then
  echo "❌ FAIL: Section 2 is missing"
  exit 1
else
  echo "❌ FAIL: Section 2 appears $SECTION2_COUNT times (should be 1)"
  exit 1
fi

# Check 3: LOE details are populated
if echo "$DESCRIPTION" | grep -q "Property Rights:.*Leased Fee Interest"; then
  echo "✅ LOE details are populated"
else
  echo "❌ FAIL: LOE details are missing or empty"
  exit 1
fi

echo ""
echo "=== ALL TESTS PASSED ==="
echo ""
echo "Task URL: https://app.clickup.com/t/$TASK_ID"
```

## WHAT TO REPORT BACK

**If tests PASS:**
- ✅ VAL number appears correctly on line 2
- ✅ Section 2 appears exactly once
- ✅ All LOE details are present
- **CONCLUSION**: Issue is fixed, safe to deploy

**If tests FAIL:**
- ❌ Which specific check failed
- The actual content of the VAL number line
- How many times Section 2 appears
- The first 500 characters of the markdown_description
- Any error messages from API calls

## ASKING USER FOR PRODUCTION CLICKUP TOKEN

"I need the production ClickUp API token to verify the task content. It should start with `pk_10791838_`. This is different from the dev token (`pk_63967834_`). Can you provide it or run this command to get it from Supabase secrets:

```bash
supabase secrets list | grep CLICKUP_API_TOKEN
```

Then decode the value or provide the raw token."

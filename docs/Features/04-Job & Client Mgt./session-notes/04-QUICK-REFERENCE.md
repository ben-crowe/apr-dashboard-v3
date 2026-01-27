# ClickUp Auto-Creation - Quick Implementation Guide

**Full Specification**: See `CLICKUP_AUTO_CREATION_SPEC.md` for complete details

---

## Quick Start (3 Steps)

### 1. Create Custom Field in ClickUp

```bash
curl -X POST 'https://api.clickup.com/api/v2/list/901402094744/field' \
  -H 'Authorization: pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Dashboard Job URL","type":"url","type_config":{}}'
```

**Save the returned field ID!**

---

### 2. Update Edge Function

**File**: `/Users/bencrowe/Development/APR-Dashboard-v3/supabase/functions/create-clickup-task/index.ts`

**Add after line 28** (idempotency check):
```typescript
const { data: existingJob } = await supabase
  .from('job_submissions')
  .select('clickup_task_id, clickup_task_url')
  .eq('id', jobId)
  .single();

if (existingJob?.clickup_task_id) {
  return new Response(JSON.stringify({
    success: true,
    taskId: existingJob.clickup_task_id,
    taskUrl: existingJob.clickup_task_url,
    alreadyExists: true
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
}
```

**Add to task creation body** (line 96+):
```typescript
const DASHBOARD_URL_FIELD_ID = 'YOUR_FIELD_ID_HERE'; // From step 1

body: JSON.stringify({
  // ... existing fields ...
  custom_fields: [
    {
      id: DASHBOARD_URL_FIELD_ID,
      value: jobUrl
    }
  ]
})
```

**Deploy**:
```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3
supabase functions deploy create-clickup-task
```

---

### 3. Configure Database Webhook

**Supabase Dashboard**: https://supabase.com/dashboard/project/ngovnamnjmexdpjtcnky

**Navigate**: Database → Webhooks → Create new hook

**Settings**:
- Name: `Auto-create ClickUp task`
- Table: `job_submissions`
- Events: `INSERT`
- Method: `POST`
- URL: `https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/create-clickup-task`
- Headers: 
  ```
  Authorization: Bearer {service_role_key}
  Content-Type: application/json
  ```
- Payload: 
  ```json
  {"jobId": "{{ record.id }}"}
  ```

---

## Testing

1. Submit form at https://apr-hub-05-25.vercel.app
2. Wait 2-3 seconds
3. Check ClickUp - task should appear automatically
4. Click "Dashboard Job URL" field in ClickUp → Opens Dashboard
5. Click "View in ClickUp" in Dashboard → Opens task

**Success**: Bidirectional navigation works!

---

## Key Facts

**Database Schema**:
- Table: `job_submissions`
- Primary Key: `id` (UUID string)
- Example: `550e8400-e29b-41d4-a716-446655440000`

**Dashboard URL Format**:
```
https://apr-hub-05-25.vercel.app/#/dashboard?jobId={UUID}
```

**ClickUp Configuration**:
- List ID: `901402094744`
- Template ID: `t-86b3exqe8`
- Workspace ID: `9014181018`

---

## Rollback

If issues occur:
1. Disable webhook in Supabase Dashboard
2. Tasks can still be created manually via Dashboard button

---

**See full specification for detailed explanations, troubleshooting, and architecture diagrams.**

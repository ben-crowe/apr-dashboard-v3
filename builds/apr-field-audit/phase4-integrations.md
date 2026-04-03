# Phase 4: ClickUp + Email Integration Audit

## Integration Events Table

| # | Integration | Trigger Event | What's Sent | Recipient | Status |
|---|-------------|---------------|-------------|-----------|--------|
| 1 | Supabase | Form submit (/) | 18 fields + status/source/tags/metadata | job_submissions table | ACTIVE |
| 2 | Supabase Storage | Form submit (with files) | File blobs | job-files bucket | ACTIVE |
| 3 | Supabase | File upload metadata | job_id, file_name, path, type, size | job_files table | ACTIVE |
| 4 | Valcre API | "Create Valcre Job" button | Full job data (Contact + Property + Job entities) | Valcre API (api-core.valcre.com) | ACTIVE |
| 5 | Valcre API | Dashboard field blur (auto-save) | Changed field + Valcre enum mapping | Valcre PATCH endpoint | ACTIVE |
| 6 | ClickUp | After Valcre job created | Task name, markdown description, tags | ClickUp list (env-dependent) | ACTIVE |
| 7 | ClickUp | Valcre job created (task exists) | Updated name with CAL number, new description | Existing ClickUp task | ACTIVE |
| 8 | ClickUp Checklist | Valcre job created | "9. Book Job" → resolved | ClickUp checklist item | ACTIVE |
| 9 | ClickUp Checklist | LOE sent via DocuSeal | "1. Create & Send LOE" → resolved | ClickUp checklist item | ACTIVE |
| 10 | DocuSeal | "Send LOE" button | HTML document + submitter (email, name, role) | DocuSeal submissions/html API | ACTIVE |
| 11 | Supabase | LOE sent | job_id, client_name, email, HTML, slug, submission_id | loe_submissions table | ACTIVE |
| 12 | Supabase | LOE sent | docuseal_submission_id | job_loe_details table (update) | ACTIVE |
| 13 | Gmail SMTP | LOE sent | to, clientName, signingLink, propertyAddress | Client email (send-loe-email-fixed edge fn) | ACTIVE |
| 14 | DocuSeal Webhook | Document signed | submission.completed event | Webhook handler (updates DB + ClickUp) | ACTIVE |

## Answers to Specific Questions

### 1. When does the client get an email?

**Only when LOE is sent.** There is NO confirmation email on form submission.

- Form submission (Step 1): Client sees a success toast in the browser. No email.
- LOE sent (Step 3): Client receives an email via Gmail SMTP edge function (`send-loe-email-fixed`) with a signing link.
- The email contains: client name, signing link (`{origin}/sign/{loe_id}`), property address.
- DocuSeal's native `send_email` is set to `false` — the app sends its own custom email instead.

**Gap:** No confirmation email on form submission means the client has zero confirmation that their request was received. This is a UX gap — they only know it worked if they saw the toast.

### 2. What does the ClickUp task HTML description contain?

**Markdown description with these fields:**

```markdown
**NEW JOB ARRIVED - [View in APR Hub](jobUrl)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Client:** {firstName} {lastName}
**Property:** {propertyName}, {propertyAddress}
**Type:** {propertyType}
**Intended Use:** {intendedUse}
**Notes:** {notes} (if present)
```

After Valcre job is booked, the description updates to:

```markdown
**JOB BOOKED - {valcreJobNumber}**
**[View in APR Hub](hubUrl)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Valcre Job:** {valcreJobNumber}
**Property:** {propertyName}, {propertyAddress}
**Status:** Job booked and ready for processing
```

**Fields in ClickUp description:** clientFirstName, clientLastName, propertyName, propertyAddress, propertyType, intendedUse, notes, jobId (in URL), valcreJobNumber (after booking)

### 3. Is the ClickUp env set to test or production?

**Configurable via `VITE_CLICKUP_ENV` env variable.** Defaults to `'test'`.

| Environment | Workspace | List ID | Template |
|-------------|-----------|---------|----------|
| **test** | BC WorkSpace (8555561) | 901703694310 | t-86b3exqe8 |
| **production** | Valta workspace (9014181018) | 901402094744 | t-86b3exqe8 |

Same template ID in both environments. The ENV is checked at module load: `const ENV = import.meta.env.VITE_CLICKUP_ENV || 'test';`

### 4. Does the ClickUp checklist auto-update on LOE signature completion?

**Partially.** The webhook flow:

- DocuSeal sends `submission.completed` webhook → handler updates DB
- When LOE is **sent** (not signed): `markLOESent(taskId)` marks "1. Create & Send LOE" as complete
- When Valcre job is **booked**: `updateClickUpChecklist(taskId, '9. Book Job', true)` marks it complete

**BUT:** There is no code that marks a checklist item on **signature completion**. The `handleDocuSealWebhook` function only extracts the signed document URL — it does NOT call `updateClickUpChecklist`. This is a gap.

### 5. Is there a confirmation email to the client on form submission?

**NO.** The form submission path (`useFormSubmission.ts`) has this explicit comment:

```javascript
// REMOVED: Automatic ClickUp task creation on form submission
// n8n webhook removed - no longer part of workflow
console.log('Job submitted successfully to Supabase');
```

No Resend, no Gmail, no email of any kind is sent on form submission. The only email the client receives is when the LOE is sent (Step 3), via the `send-loe-email-fixed` Supabase edge function using Gmail SMTP.

**Resend:** Not wired to form submit. The Resend integration is referenced in the stack documentation but the actual sending uses Gmail SMTP via a Supabase edge function (`send-loe-email-fixed`).

## Integration Architecture Diagram

```
FORM SUBMIT → Supabase (job_submissions + job_files)
                    ↓ (no email, no ClickUp)
DASHBOARD → "Create Valcre Job" → Valcre API
                                      ↓
                                 ClickUp Task Created
                                 (or updated if exists)
                                      ↓
            "Send LOE" → DocuSeal (HTML document)
                              ↓
                         Gmail SMTP → Client Email
                         ClickUp checklist updated
                              ↓
                    Client Signs → DocuSeal Webhook
                              ↓
                         DB Updated (document URL)
                         ClickUp NOT updated (gap)
```

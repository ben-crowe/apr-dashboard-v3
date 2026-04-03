# Client Communication & Email Triggers

> Step-by-step timeline of all notifications and communications across the APR pipeline.
> For each trigger: what fires it, who receives it, what channel, current status.

---

## Timeline Flow

```
1. Client Submits Form
       │
2. Appraiser Reviews in Dashboard
       │
3. Appraiser Creates Valcre Job
       │
4. Appraiser Sends LOE for Signature
       │
5. Client Signs LOE
       │
6. Appraisal Work Begins
```

---

## Step 1: Form Submission

| Detail | Value |
|--------|-------|
| Trigger | Client clicks "Submit Appraisal Request" |
| Client receives | Browser toast: "Your submission has been received successfully" |
| Client email | **NONE — known gap** |
| Team receives | **Nothing immediate** — data lands in Supabase silently |
| Team notification | None until ClickUp task is created (Step 3) |
| Dashboard | New job appears in job list with "Submitted" status |

### What's Missing

- No confirmation email to client after form submission
- No notification to the team that a new submission arrived
- Client has no reference number or way to track their submission
- **Planned:** Resend API confirmation email with job reference number

> See: `1-client-form.md` for submitted fields

---

## Step 2: Appraiser Reviews in Dashboard

| Detail | Value |
|--------|-------|
| Trigger | Appraiser opens dashboard, clicks on job |
| Client receives | Nothing |
| Team receives | Nothing |
| Channel | Dashboard UI only |

> This is a manual step — appraiser reviews client data, fills in LOE details (fee, scope, report type, delivery date). See: `2-dashboard.md` Section 2 (LOE Quote & Valuation Details)

---

## Step 3: Appraiser Creates Valcre Job

| Detail | Value |
|--------|-------|
| Trigger | Appraiser clicks "Create Valcre Job" button on dashboard |
| What happens | Three things fire simultaneously: |

### 3a. Valcre Job Created

| Detail | Value |
|--------|-------|
| API | POST to Valcre API via `/api/valcre` serverless function |
| Result | VAL number assigned (e.g. VAL261030) |
| Client receives | Nothing |
| Team receives | Nothing directly from Valcre |

### 3b. ClickUp Task Created

| Detail | Value |
|--------|-------|
| API | POST to ClickUp API via edge function |
| Board | Valta Jobs (production list 901402094744) |
| Task name | "PENDING - {Property}, {Address}" |
| Description | Markdown with client/property data |
| Custom fields | 7 client fields populated |
| Template | t-86b3exqe8 (10-step checklist) |
| Team receives | ClickUp notification — new task on Jobs board |
| Channel | ClickUp app/email notifications (per team member settings) |

> See: `5-clickup-task.md` for full task structure

### 3c. Supabase Updated

| Detail | Value |
|--------|-------|
| Tables | job_submissions + job_loe_details updated with valcre_job_id |
| Dashboard | Job number changes from "Awaiting" to VAL number |
| "View in Valcre" button | Now active (links to Valcre web UI) |

---

## Step 4: Appraiser Sends LOE for Signature

| Detail | Value |
|--------|-------|
| Trigger | Appraiser clicks "Preview & Send LOE" → reviews → confirms send |
| API | DocuSeal `submissions/html` API |
| Email service | **Resend API** (custom branded email) |
| Sender name | Valta Property Valuations |
| Sender email | Configured in Resend (Valta domain) |
| Subject | LOE for {Property Name} — Signature Required |
| Client receives | **Email with signing link** |
| Email contains | Link to DocuSeal signing page, LOE document preview |
| Team receives | Nothing on send — only on signature (Step 5) |

### What the Client Sees

1. Email arrives from Valta with signing link
2. Click link → DocuSeal signing page (`/sign/{slug}`)
3. LOE document with all fields pre-filled (see `4-loe-esignature.md`)
4. Client reviews, signs electronically
5. Confirmation page after signing

> See: `4-loe-esignature.md` for full LOE document fields

---

## Step 5: Client Signs LOE

| Detail | Value |
|--------|-------|
| Trigger | Client completes electronic signature on DocuSeal |
| Webhook | DocuSeal fires webhook to Supabase edge function |
| What happens | Three updates: |

### 5a. Supabase Updated

| Detail | Value |
|--------|-------|
| Table | `job_loe_details` |
| Fields updated | `docuseal_status`, `docuseal_signed_at`, `docuseal_submission_id` |
| Dashboard | LOE status changes to "Signed" |

### 5b. ClickUp Task Updated

| Detail | Value |
|--------|-------|
| API | PATCH to ClickUp task via edge function |
| What changes | "LOE Signed" timestamp added to task description |
| Team receives | ClickUp notification — task updated |

### 5c. Client Receives

| Detail | Value |
|--------|-------|
| Signed copy | DocuSeal sends signed PDF copy to client email (DocuSeal default behavior) |
| Confirmation | DocuSeal confirmation page shown after signing |

---

## Step 6: Appraisal Work Begins

| Detail | Value |
|--------|-------|
| Trigger | Team sees signed LOE on ClickUp board |
| Process | Follow 10-step checklist on ClickUp task |
| Client receives | Nothing automatic — manual communication as needed |
| Dashboard | Appraiser fills in Building Information, VALTA fields, documents |

---

## Notification Summary

| Event | Client | Team | Channel |
|-------|--------|------|---------|
| Form submitted | Browser toast only | **None** | Dashboard |
| Valcre job created | Nothing | ClickUp notification | ClickUp |
| LOE sent for signature | **Signing email** | Nothing | Email (Resend) |
| LOE signed | **Signed PDF copy** | ClickUp update | Email + ClickUp |
| Field updated on dashboard | Nothing | Nothing | Dashboard auto-save |
| Custom fields synced to Valcre | Nothing | Nothing | API (silent) |

---

## Known Gaps

| Gap | Impact | Planned Fix |
|-----|--------|------------|
| No form submission confirmation email | Client has no proof they submitted | Resend API email with reference number |
| No team notification on new submission | Team discovers new jobs manually in dashboard | ClickUp task on submit OR email alert |
| No status update emails to client | Client doesn't know their appraisal progress | Status change emails (Resend API) |
| No "LOE sent" notification to team | Team doesn't know LOE was sent until client signs | ClickUp update on LOE send |

---

## Integration References

| Step | Detailed in |
|------|-------------|
| Client form fields | `1-client-form.md` |
| Dashboard all sections | `2-dashboard.md` |
| Valcre job fields | `3-valcre-job.md` |
| LOE document fields | `4-loe-esignature.md` |
| ClickUp task structure | `5-clickup-task.md` |
| Dropdown options | `6-dropdown-options.md` |
| File handling | `7-file-uploads.md` |

---

*4 notification channels: Dashboard (always), ClickUp (on job creation + LOE sign), Email/Resend (LOE send), DocuSeal (LOE sign confirmation). Biggest gap: no client confirmation email on form submit.*

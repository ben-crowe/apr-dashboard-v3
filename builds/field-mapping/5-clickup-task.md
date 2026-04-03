# ClickUp Integration — Full Lifecycle

> Complete ClickUp story: trigger, creation, notification, workflow, auto-updates.
> All values are examples. `#` numbers match Dashboard/Client Form field numbers.
> Verified: Yes = tested end-to-end. No = not yet tested.

---

## Task Preview

### Task Name

```
PENDING - Harbourfront Tower, 250 Queens Quay West, Toronto, ON
```

> Updates to `VAL261030 - Harbourfront Tower, 250 Queens Quay West, Toronto, ON` once Valcre job is booked.

### Tags

| Tag | Applied When | Purpose |
|-----|-------------|---------|
| NEW ARRIVAL | On task creation | Signals team: new job landed |
| APR Hub | On task creation | Identifies task came from APR Dashboard |

### Status

| Field | Value |
|-------|-------|
| Initial status | To Do |
| Priority | Normal |

---

## Task Creation Trigger

| Detail | Value |
|--------|-------|
| Dashboard button | "Create Valcre Job" (in LOE Quote & Valuation Details section) |
| What fires | Two API calls in sequence: Valcre job creation, then ClickUp task creation |
| Edge function | `create-clickup-task` (Supabase Edge Function) |
| When | Immediately after Valcre job is successfully created |
| Condition | Valcre job must succeed first — ClickUp task includes the VAL number |

### Data Sent to Edge Function

| # | Field | Example Value | Source | Verified |
|---|-------|---------------|--------|----------|
| | jobNumber | *VAL261030* | Valcre API response | Yes |
| 1 | clientFirstName | *Daniel* | Client | Yes |
| 2 | clientLastName | *Westbrook* | Client | Yes |
| 3 | clientTitle | *Managing Director* | Client | Yes |
| 4 | clientCompany | *Westbrook Capital Group* | Client | Yes |
| 6 | clientEmail | *daniel@westbrookcapital.ca* | Client | Yes |
| 7 | clientAddress | *200 Queens Quay West Suite 2100....* | Client | Yes |
| 8 | propertyName | *Harbourfront Tower* | Client | Yes |
| 10 | propertyAddress | *250 Queens Quay West, Toronto....* | Client | Yes |
| 9 | propertyType | *Multi-Family* | Client | Yes |
| 11 | intendedUse | *First Mortgage Financing* | Client | Yes |
| 12 | valuationPremises | *Market Value* | Client | Yes |
| 13 | assetCondition | *Good* | Client | Yes |
| 18 | additionalInfo | *Multi-family residential tower, 42 stories....* | Client | Yes |
| 14 | propertyContactFirst | *Marcus* | Client | Yes |
| 15 | propertyContactLast | *Johnson* | Client | Yes |
| 16 | propertyContactEmail | *property.manager@harbourfront.ca* | Client | Yes |
| 17 | propertyContactPhone | *(416) 555-0456* | Client | Yes |

---

## Which Board

| Detail | Value |
|--------|-------|
| Workspace | Valta (production) |
| Workspace ID | 8555561 |
| List | Valta Jobs |
| List ID | 901402094744 |
| Template | t-86b3exqe8 (LOE New Template) |

> Test environment: BC WorkSpace, list 901703694310 (same template). Toggle via `VITE_CLICKUP_ENV` env var.

---

## Task Description (Markdown)

```
▸ CLIENT INFORMATION

  • Client: Daniel Westbrook
  • Title: Managing Director
  • Organization: Westbrook Capital Group
  • Phone: (416) 555-0123
  • Email: daniel@westbrookcapital.ca
  • Address: 200 Queens Quay West Suite 2100, Toronto, ON M5J 2N2

▸ PROPERTY INFORMATION

  • Property: Harbourfront Tower
  • Address: 250 Queens Quay West, Toronto, ON M5J 2N2
  • Type: Multi-Family
  • Authorized Use: First Mortgage Financing
  • Valuation Premises: Market Value
  • Asset Condition: Good

▸ PROPERTY CONTACT

  • Contact: Marcus Johnson
  • Email: property.manager@harbourfront.ca
  • Phone: (416) 555-0456

▸ NOTES

  Multi-family residential tower, 42 stories, 380 units.
  Built 2018. Full interior and exterior inspection required.
  Requesting 30-day turnaround.

▸ LINKS

  • APR Dashboard: [link to job detail]
  • Valcre: [link to Valcre job - added after creation]
```

> Format: triangles (▸) for section headers, bullets (•) for items. No emojis. Clean markdown.

---

## Custom Fields (27 on Valta board)

### Auto-Populated on Creation (7 fields)

| # | Field | Example Value | Type | Verified |
|---|-------|---------------|------|----------|
| | Job Number | *VAL261030* | short_text | Yes |
| 1 | Client First Name | *Daniel* | short_text | Yes |
| 2 | Client Last Name | *Westbrook* | short_text | Yes |
| 3 | Client Title | *Managing Director* | short_text | Yes |
| 4 | Client Organization | *Westbrook Capital Group* | short_text | Yes |
| 7 | Client Address | *200 Queens Quay West Suite 2100....* | short_text | Yes |
| 6 | Client Email | *daniel@westbrookcapital.ca* | email | Yes |

### NOT Auto-Populated (20 fields — team fills manually if needed)

| Field | Type | Notes |
|-------|------|-------|
| Client Phone | phone | In description, not custom field |
| Property Name | short_text | In description |
| Property Address | short_text | In description |
| Property Type | drop_down | 9 options (Multifamily, Self Storage, Retail, etc.) |
| Intended Use | drop_down | 7 options |
| Property Rights Appraised | drop_down | 14 options |
| Valuation Premises | drop_down | 6 options |
| Report Type | drop_down | 4 options |
| Scope of Work | short_text | — |
| Payment Terms | drop_down | 5 options (Net 30, Net 60, etc.) |
| Job Status | drop_down | 20 statuses (Send LOE, Plan Job, etc.) |
| Delivery Date | date | — |
| Asset Condition | drop_down | 2 options |
| Additional Info | text | In description |
| Property Contact First/Last | short_text | In description |
| Property Contact Email/Phone | email/phone | In description |
| APR Dashboard Link | url | Planned: auto-populate |
| Valcre Job Link | url | Planned: auto-populate |

> ClickUp tasks are **notifications + links**, not data stores. The description contains all the data the team needs. Custom fields beyond the 7 client fields aren't auto-populated — per Ben's direction, the overhead isn't worth it since the team works in Valcre, not ClickUp custom fields.

---

## Template Subtasks — 10-Step Checklist

> Auto-created from template `t-86b3exqe8` on task creation.

| # | Subtask | What It Means | Auto-Updated? |
|---|---------|--------------|---------------|
| 1 | Receive Client Info & Documents | Client submission received, review data | No — manual |
| 2 | Create Valcre Job & LOE | Valcre job created, LOE prepared | **Implicit** — task only exists because this happened |
| 3 | Pull (TTSZ) Tax, Title, Site Plan, Zoning | Research phase — gather municipal docs | No — manual |
| 4 | Tour Property | Schedule and complete site inspection | No — manual |
| 5 | Sale and Lease Comps | Research comparable sales and leases | No — manual |
| 6 | Build Front End | Assemble report front section | No — manual |
| 7 | Complete Valuation | Run calculations, determine value | No — manual |
| 8 | Send to Client | Deliver final report | No — manual |
| 9 | Book Job | Finalize in Valcre, invoice | No — manual |
| 10 | Archive | Close out, archive documents | No — manual |

> Currently no subtasks are auto-checked by our system. Step 2 is implicitly done (task wouldn't exist without it). Future: auto-update Step 3 when LOE is sent, mark Step 1 when docs are uploaded.

---

## Task Auto-Updates (Post-Creation)

### On LOE Sent (DocuSeal submission created)

| Detail | Value |
|--------|-------|
| Trigger | Appraiser clicks "Preview & Send LOE" → confirms send |
| Edge function | `update-clickup-task` |
| What updates | Description gets "LOE SENT" section appended |
| Added text | `▸ LOE SENT — {date} — Sent to {client email} via DocuSeal` |
| Checklist | No auto-check currently |

### On LOE Signed (DocuSeal webhook fires)

| Detail | Value |
|--------|-------|
| Trigger | Client completes electronic signature |
| Edge function | `docuseal-webhook` → calls ClickUp update |
| What updates | Description gets "LOE SIGNED" section appended |
| Added text | `▸ LOE SIGNED — {date} — Signed by {client name}` |
| Checklist | No auto-check currently |

### On Job Status Change

| Detail | Value |
|--------|-------|
| Trigger | Not currently implemented |
| Planned | Dashboard status changes could update ClickUp Job Status custom field |

---

## Team Notification

| When | Who Sees It | How |
|------|-------------|-----|
| Task created | All Valta board members | ClickUp notification: "New task in Valta Jobs" |
| NEW ARRIVAL tag | Anyone watching the tag | ClickUp tag filter / notification |
| APR Hub tag | Anyone watching the tag | Identifies source as APR Dashboard |
| LOE sent update | Task followers | ClickUp: "Task description updated" |
| LOE signed update | Task followers | ClickUp: "Task description updated" |

> ClickUp notification delivery depends on each team member's settings (in-app, email, mobile push). The team sees new tasks appear on their board view — no separate email from our system.

---

## View in ClickUp Button

| Detail | Value |
|--------|-------|
| Location | Dashboard job detail, LOE section header |
| Button text | "View in ClickUp" |
| URL format | `https://app.clickup.com/t/{task_id}` |
| Task ID stored | `job_submissions.clickup_task_id` (Supabase) |
| When available | After ClickUp task is created (Step 3) |
| Before creation | Button shows disabled or hidden |

---

## Full Trigger Chain

```
Appraiser clicks "Create Valcre Job"
    │
    ├─► 1. Valcre API: POST /api/valcre (action: createJob)
    │       └─ Returns: VAL261030, jobId: 834912
    │
    ├─► 2. Supabase: UPDATE job_submissions + job_loe_details
    │       └─ Sets: valcre_job_id=834912, job_number=VAL261030
    │
    ├─► 3. ClickUp API: POST create-clickup-task edge function
    │       ├─ Creates task: "PENDING - Harbourfront Tower, ..."
    │       ├─ Applies template: t-86b3exqe8 (10 subtasks)
    │       ├─ Sets 7 client custom fields
    │       ├─ Adds tags: NEW ARRIVAL, APR Hub
    │       └─ Returns: task_id (e.g. 86e0n46af)
    │
    ├─► 4. Supabase: UPDATE job_submissions
    │       └─ Sets: clickup_task_id=86e0n46af
    │
    └─► 5. Dashboard: refreshes
            ├─ Job number shows VAL261030
            ├─ "View in Valcre" button active
            └─ "View in ClickUp" button active

Later:
    LOE Sent → update-clickup-task → description appended
    LOE Signed → docuseal-webhook → description appended + DB updated
```

---

## Environment Config

| Setting | Test | Production |
|---------|------|------------|
| VITE_CLICKUP_ENV | test | production |
| Workspace | BC WorkSpace | Valta |
| List ID | 901703694310 | 901402094744 |
| Template | t-86b3exqe8 | t-86b3exqe8 (same) |
| API Token | Personal token | Personal token |
| Token location | Supabase secrets | Supabase secrets |

> API token is `pk_10791838_...` — personal token, NOT OAuth. Same token works for both workspaces. Field IDs are per-list (test and production have different UUIDs for the same field names).

---

*ClickUp is the team's notification hub. Task creation alerts the team, description contains all data, 10-step checklist tracks the workflow, auto-updates mark LOE milestones. The team works in Valcre for the appraisal — ClickUp keeps them organized.*

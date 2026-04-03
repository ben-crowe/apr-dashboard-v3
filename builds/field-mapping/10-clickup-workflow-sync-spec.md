# ClickUp Workflow Sync — Feature Spec

> Spec for syncing dashboard actions to Chris's ClickUp board custom fields.
> Based on QA analysis of Chris's production Valta Jobs board (2026-03-31).

---

## The Problem

Chris's team tracks job workflow progress via ClickUp custom fields on the Valta Jobs board. The board view shows ~48 custom fields as columns — color-coded checkboxes, dropdowns, and status fields that the team fills manually. This is their daily workflow dashboard.

Our APR Dashboard collects most of the same data but doesn't sync it to ClickUp. Result: double-entry. The appraiser fills fields on our dashboard AND manually updates ClickUp.

## The Solution

Auto-sync dashboard actions to ClickUp custom fields. When an appraiser fills a field or completes a step on our dashboard, the corresponding ClickUp field updates automatically.

---

## Chris's Production Board — Field Inventory

> Source: API dump of Valta Jobs board (list 901402094744) + Ben's screenshots of active jobs.
> Production board has ~48 custom fields organized by numbered prefix.

### Workflow Checkboxes (Progress Tracking)

These are the color-coded columns on Chris's board view. Each is a checkbox that tracks whether a workflow step is complete.

| ClickUp Field | Type | Auto-Trigger from Dashboard? | Logic |
|---------------|------|------------------------------|-------|
| 1.1 Client Info Received | checkbox | YES — auto on form submit | Client submits intake form → check |
| 1.2 Invoice Paid | checkbox | FUTURE — needs payment integration | Payment received → check |
| 1.3 TTSZ Done | checkbox | MANUAL — appraiser clicks on dashboard | Tax/Title/SitePlan/Zoning gathered → check |
| 2.1 Template Saved | checkbox | MANUAL — appraiser clicks on dashboard | Report template saved → check |
| 2.2 Photos Saved | checkbox | MANUAL — appraiser clicks on dashboard | Property photos uploaded → check |
| 2.3 Comps Provided | checkbox | MANUAL — appraiser clicks on dashboard | Comparable sales/leases gathered → check |

### Job Data Fields (Already in Our Dashboard)

These fields contain data that our dashboard already collects. Auto-sync would eliminate double-entry.

| ClickUp Field | Type | Dashboard Field # | Auto-Sync? |
|---------------|------|-------------------|------------|
| 0.0 Job Number | short_text | (auto) | YES — on Valcre job creation |
| 1.1 Property Type | drop_down | #9 | YES |
| 1.2 Property Subtype | drop_down | #37 | YES |
| 1.3 Interest Appraised | drop_down | #20 (Property Rights) | YES |
| 1.4 Authorized Use | drop_down | #11 | YES |
| 1.5 State of Improvements | drop_down | #35 | YES |
| 1.6 Status of Improvements | drop_down | #36 | YES |
| 1.7 Approaches to Value | drop_down | #44 | YES |
| 1.8 Value Scenario(s) | drop_down | #12 (Valuation Premises) | YES |
| 1.9 Report Type | drop_down | #24 | YES |
| 1.9.1 Inspection Date | date | (not on dashboard yet) | FUTURE |
| 1.9.2 Desktop Report | checkbox | #42 | YES |
| 2.2 Transaction Status | drop_down | #45 | YES |
| 2.3 Zoning Status | drop_down | #46 | YES |
| 4.5 Land $/Metric | drop_down | #38 (Land Metric) | YES |

### Client & Property Fields

| ClickUp Field | Type | Dashboard Field # | Auto-Sync? |
|---------------|------|-------------------|------------|
| 1.0 Client Full Name | short_text | #1 + #2 | YES |
| 1.1 Client Title | short_text | #3 | YES |
| 1.2 Client Organization | short_text | #4 | YES |
| 1.3 Client Org Address | short_text | #7 | YES |
| 1.4 Client Phone | phone | #5 | YES |
| 1.5 Client Email | email | #6 | YES |
| 2.0 Property Name | short_text | #8 | YES |
| 2.1 Property Address | short_text | #10 | YES |

### Financial Fields

| ClickUp Field | Type | Dashboard Field # | Auto-Sync? |
|---------------|------|-------------------|------------|
| 3.0 Fee Amount | number | #23 | YES |
| 3.1 Disbursement | number | (not on dashboard) | NO |
| 3.3 Delivery Date | date | #26 | YES |
| 3.7 Retainer Amount | number | #25 | YES |

### Link Fields

| ClickUp Field | Type | Auto-Sync? | Logic |
|---------------|------|------------|-------|
| 5.0 Link: Valcre Job | url | YES — on Valcre creation | Valcre job URL |
| 5.0 Link: Box Folder | url | FUTURE — SharePoint integration | SharePoint/Box folder URL |
| 5.0 Link: LOE Contract | url | YES — on DocuSeal send | DocuSeal signing URL |
| 5.0 Link: CRM Deal | url | FUTURE — Pipedrive integration | CRM deal URL |
| APR Dashboard Link | url | YES — on task creation | Dashboard job detail URL |

### Action/Email Fields

| ClickUp Field | Type | Auto-Sync? | Logic |
|---------------|------|------------|-------|
| 4.0 Action: Create Valcre Job | checkbox | YES — auto on Valcre creation | Job created → check |
| 6.0 Send Email | checkbox | YES — auto on LOE send | LOE sent → check |
| 6.3 Email Body | text | YES — on LOE send | LOE email content |

### Other Fields

| ClickUp Field | Type | Auto-Sync? |
|---------------|------|------------|
| Phase Owner | drop_down | NO — ClickUp-only workflow |
| Work Phase | drop_down | NO — ClickUp-only workflow |
| Task Type | drop_down | NO — ClickUp-only workflow |
| Notes | text | MANUAL |
| 2.5 Comments | text | #18 (Client Comments) |
| 2.6 Date Received | date | Auto — form submission date |
| 2.7 Date Contract Created | date | Auto — Valcre job creation date |
| z. Action: CRM Deal Creation | checkbox | FUTURE |
| z. Payment Terms | drop_down | #22 |

---

## Implementation Plan

### Phase 1: Auto-Sync on Job Creation (extends current)

Currently we auto-fill 7 fields. Expand to fill ALL client/property/job data fields on task creation.

| What | Fields | Effort |
|------|--------|--------|
| Client fields | Full Name, Title, Org, Address, Phone, Email (6) | Already done |
| Property fields | Name, Address, Type, Subtype (4) | New |
| Job fields | Property Rights, Authorized Use, Report Type, Scope (4) | New |
| Financial | Fee, Retainer, Delivery Date (3) | New |
| Links | APR Dashboard link, Valcre link (2) | New |
| Auto-checks | Client Info Received, Valcre Job Created (2) | New |
| **Total** | **21 fields auto-filled on creation** | |

### Phase 2: Live Sync on Dashboard Field Changes

When appraiser updates a field on the dashboard, sync to ClickUp in real-time.

| Trigger | ClickUp Update |
|---------|---------------|
| Field blur (auto-save) | PATCH corresponding ClickUp custom field |
| LOE sent | Check "Send Email" + populate Email Body + LOE link |
| LOE signed | Update status note |
| Any VALTA field changed | Update matching ClickUp dropdown |

### Phase 3: Workflow Checkboxes on Dashboard

Add a "Workflow Status" section to the dashboard job detail with checkboxes matching Chris's board.

| Dashboard Checkbox | ClickUp Field | Type |
|-------------------|---------------|------|
| Client Info Received | 1.1 Client Info Received | Auto on submit |
| Invoice Paid | 1.2 Invoice Paid | Manual click |
| TTSZ Done | 1.3 TTSZ Done | Manual click |
| Template Saved | 2.1 Template Saved | Manual click |
| Photos Saved | 2.2 Photos Saved | Manual click |
| Comps Provided | 2.3 Comps Provided | Manual click |

Each click → `POST /api/v2/task/{id}/field/{field_id}` with `{"value": true}`.

### Phase 4: Board View on Dashboard

Build a ClickUp-style board/list view on our dashboard showing all jobs with workflow status columns. This replaces Chris's need to open ClickUp for the overview.

---

## API Reference

### Set a custom field value

```bash
POST https://api.clickup.com/api/v2/task/{task_id}/field/{field_id}
Authorization: {token}
Content-Type: application/json

# Checkbox
{"value": true}

# Dropdown (by option index)
{"value": 3}

# Text
{"value": "some text"}

# Date (Unix ms)
{"value": 1714521600000}
```

### Field IDs

Field IDs are **per-list** — production (901402094744) and test (901709622357) have different UUIDs for the same field names. Use `clickup-list-fields.sh` to get IDs for each environment.

### Token

Personal API token: stored in Supabase secrets. Same token for both workspaces.

---

## Current State vs Target

| Metric | Current | Phase 1 | Phase 2 | Phase 3 |
|--------|---------|---------|---------|---------|
| Fields auto-filled on creation | 7 | 21 | 21 | 21 |
| Fields live-synced on change | 0 | 0 | ~15 | ~15 |
| Workflow checkboxes on dashboard | 0 | 0 | 0 | 6 |
| Double-entry eliminated | ~15% | ~45% | ~85% | ~95% |

---

*This spec is the roadmap for ClickUp integration phases 1-4. Phase 1 is the quick win — extend task creation to fill 21 fields instead of 7. Phase 4 is the end goal — Chris never opens ClickUp for job status.*

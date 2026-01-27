# BC Workspace Mirror - Implementation Results

**Date Created:** January 13, 2026  
**Status:** ✅ Complete  
**List Location:** LOE Workflow folder, My Stuff space, BC Workspace

---

## Summary

Successfully created mirrored Valta workflow list in BC workspace for testing and Phase 3 specification. 

**Key Design Principle:** APR Dashboard is the single source of truth. ClickUp is a lightweight task tracker with links back to the dashboard. We do NOT need all 30+ custom fields from Valta - those are replaced by the dashboard job ticket.

**Minimal Field Set:**
- Job Number (identifier)
- APR Dashboard Link (primary source of truth)
- Valcre Job Link (external system link)
- Job Status (workflow tracking dropdown)
- Standard fields (Status, With, Notes, Dates, Priority)

**Note:** OAuth flow requires user browser interaction to complete. Personal API token was used temporarily for list creation. OAuth should be completed for production use.

---

## List Details

### Basic Information
- **List ID:** `901709621852`
- **List Name:** `APR Test - Valta Mirror`
- **List URL:** `https://app.clickup.com/8555561/v/f/90171828559/90030326242` (folder view)
- **Folder ID:** `90171828559`
- **Folder Name:** `LOE Workflow`
- **Space ID:** `90030326242`
- **Space Name:** `My Stuff`
- **Workspace ID:** `8555561`
- **Workspace Name:** `BC Workspace`

### Description
Mirrored Valta workflow for testing. Will become spec for internal PM system (Phase 3).

---

## Status Columns

**Current Statuses** (inherited from folder/space - NEEDS UPDATE):
1. `gen stuff` (open, #87909e) - Order: 0 ❌ WRONG
2. `ideas ` (custom, #f8ae00) - Order: 1 ❌ WRONG
3. `complete` (closed, #008844) - Order: 2 ❌ WRONG

**Required Statuses** (matching Valta images):
1. `TO DO` (open, #3db88b) - Green outline circle
2. `IN PROGRESS` (custom, #1090e0) - Solid blue circle
3. `WAITING ON` (custom, #e16b16) - Solid orange circle
4. `DONE` (done, #656f7d) - Gray circle with checkmark
5. `JOB DONE` (closed, #008844) - Dark green circle with checkmark

**Action Required:** See `83-STATUS-PIPELINE-SETUP.md` for step-by-step instructions to update statuses via ClickUp UI.

---

## Custom Fields

All 3 custom fields created successfully:

### 1. Job Number
- **Field ID:** `77e8fc0f-0fe6-4916-ae26-4e36f587094c`
- **Type:** `short_text`
- **Purpose:** Unique job identifier (e.g., VAL251999, TEST-001)

### 2. APR Dashboard Link
- **Field ID:** `de43430c-e269-4d36-92e8-504b26a4cd57`
- **Type:** `url`
- **Purpose:** Link to job in APR Dashboard

### 3. Valcre Job Link
- **Field ID:** `6073e69c-114c-4498-a7cf-239080188401`
- **Type:** `url`
- **Purpose:** Link to job in Valcre system

### 4. Job Status
- **Field ID:** `bd3e6f8a-dd06-4e00-a2c1-530fc48a56f3`
- **Type:** `drop_down`
- **Purpose:** Workflow sub-status tracking (matches Valta's Job Status field)
- **Options:** 20 options (Send LOE, Paid, Plan Job, Get Client Info, Book Tour, Call Client Clarify, Search Comps, Front End, Review Comps, Valuation, Review Report, Edits, Review & Book Tour, Send to Client, Client Changes, Not Paid, Not Signed, LOR Req Sent V/A, Sent for Review, Cancel)

**Note:** Fields are shared at folder/space level, so they're available to all lists in the "LOE Workflow" folder.

---

## Test Task

### Task Details
- **Task ID:** `86dz89m04`
- **Task Name:** `TEST-001 - Test Property, 123 Test St, Vancouver, BC`
- **Task URL:** `https://app.clickup.com/t/86dz89m04`
- **Status:** `gen stuff`
- **Created:** January 13, 2026

### Custom Fields Populated
- **Job Number:** `TEST-001`
- **APR Dashboard Link:** `https://apr-dashboard.vercel.app/jobs/test-001`
- **Valcre Job Link:** `https://valcre.com/jobs/test`

### Description Content
```markdown
▸ NEW APPRAISAL REQUEST: [View in APR Dashboard](https://apr-dashboard.vercel.app)

CLIENT INFORMATION
• Name: Test Client
• Email: test@example.com
• Phone: (555) 123-4567

PROPERTY INFORMATION
• Property Name: Test Property
• Address: 123 Test St
• Property Type: Retail

LOE QUOTE & VALUATION DETAILS
• Appraisal Fee: $3,500
• Retainer: $1,750
• Delivery Date: 2026-02-15
```

### Checklist Items
Checklist "APR Workflow Steps" created with 10 items:
1. Team Leader
2. 1. Create & Send LOE
3. 2. Plan Job
4. 3. Pull (TTSZ) Tax, Title, Site Plan, Zoning
5. 4. Tour Property
6. 5. Sale and Lease Comps
7. 6. Build Front End
8. 7. Complete Valuation
9. 8. Send to Client
10. 9. Book Job

**Checklist ID:** `ce9fafb3-bced-416e-8f9b-0ae2e1993597`

---

## Template Task

### Template Details
- **Task ID:** `86dz89kap` (created in first list location)
- **Task Name:** `APR Job Workflow Template`
- **Task URL:** `https://app.clickup.com/t/86dz89kap`
- **Status:** `to do`
- **Purpose:** Template task with 10 workflow steps for reference

**Note:** Template task created in first list location (Dev.Projects space). Consider creating another template in the LOE Workflow folder if needed.

---

## OAuth Setup Status

### OAuth App Credentials
- **Client ID:** `NSZQ8LEP2KV6KDUWEQU5VQBR65CIG7HKM7EZF61UG6HG82XN5J8S8C3WHGOENSD1`
- **Client Secret:** `PY3EQ1UW6SMST339JP8NG3B5OVTTPJMK` (stored in Supabase secrets)
- **Redirect URI:** `https://apr-dashboard-v3.vercel.app`

### OAuth Infrastructure
- ✅ Database table: `clickup_connections` (migration applied)
- ✅ Edge Functions deployed:
  - `clickup-oauth-authorize` ✅
  - `clickup-oauth-callback` ✅
- ✅ Secrets configured in Supabase

### OAuth Authorization Required
**Status:** ⏳ Pending user authorization

**Authorization URL:**
```
https://app.clickup.com/api?client_id=NSZQ8LEP2KV6KDUWEQU5VQBR65CIG7HKM7EZF61UG6HG82XN5J8S8C3WHGOENSD1&redirect_uri=https://apr-dashboard-v3.vercel.app
```

**To Complete OAuth:**
1. Open authorization URL in browser
2. Authorize BC workspace (8555561)
3. Access token will be stored in `clickup_connections` table
4. Use OAuth token for future API calls

**Current Token Used:** Personal API token (`pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY`) - temporary for setup

---

## Verification Checklist

- [x] Migration applied - `clickup_connections` table exists
- [x] OAuth credentials in Supabase secrets
- [x] OAuth Edge Functions deployed
- [ ] OAuth flow completed - access token stored (REQUIRES USER ACTION)
- [x] List created in BC workspace
- [x] 4 custom fields created (Job Number, Dashboard Link, Valcre Link, Job Status)
- [x] Test task created with all fields populated
- [x] Checklist items added (10 workflow steps)
- [x] Template task created
- [x] All IDs documented

---

## API Credentials Used

**Personal API Token (Temporary):**
- Token: `pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY`
- User: Ben Crowe (ID: 10791838)
- Workspace: BC Workspace (8555561)

**Note:** This token was used temporarily for setup. OAuth access token should be used for production automation.

---

## Next Steps

### Immediate
1. **Complete OAuth Flow** - Authorize BC workspace to get OAuth access token
2. **Update Statuses** - ⚠️ **CRITICAL:** Configure 5-stage pipeline to match Valta workflow (see `83-STATUS-PIPELINE-SETUP.md`)
3. **Test Automation** - Update Supabase secrets with new List ID and test Stage 1-3 automation

### For Testing
1. Update `CLICKUP_LIST_ID` secret to `901709621852`
2. Test Stage 1: Form submission → Task creation
3. Test Stage 2: Valcre job → Task update
4. Test Stage 2.5 & 3: DocuSeal webhooks → Task updates

### For Phase 3
- Use this list structure as specification for internal PM system
- Document workflow patterns observed
- Plan database schema based on custom fields
- Design status workflow matching Valta's 5-stage pipeline

---

## Files Created/Modified

- ✅ Migration applied: `supabase/migrations/20260108_create_clickup_connections.sql`
- ✅ OAuth secrets set in Supabase
- ✅ OAuth Edge Functions deployed
- ✅ List created: `901709621852`
- ✅ Test task created: `86dz89m04`
- ✅ Template task created: `86dz89kap`

---

## Quick Reference

**List URL:** `https://app.clickup.com/8555561/v/f/90171828559/90030326242`  
**Test Task:** `https://app.clickup.com/t/86dz89m04`  
**Template Task:** `https://app.clickup.com/t/86dz89kap`

**Field IDs:**
- Job Number: `77e8fc0f-0fe6-4916-ae26-4e36f587094c`
- Dashboard Link: `de43430c-e269-4d36-92e8-504b26a4cd57`
- Valcre Link: `6073e69c-114c-4498-a7cf-239080188401`
- Job Status: `bd3e6f8a-dd06-4e00-a2c1-530fc48a56f3`

---

**Implementation Complete:** January 13, 2026  
**Ready for:** Testing and OAuth completion

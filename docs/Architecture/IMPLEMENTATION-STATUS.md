# APR Dashboard V3 - Implementation Status

**Last Updated:** November 13, 2025
**Project:** APR Dashboard V3
**Status:** Production - Testing Phase
**For:** QA Testing & Bug Tracking

---

## Quick Status Overview

| Category | Status | Details |
|----------|--------|---------|
| **Client Form Submission** | ✅ Working | Form captures all required data |
| **ClickUp Auto-Creation** | ✅ Working | Stage 1 auto-creation LIVE (Nov 6) |
| **ClickUp Stage 2 Updates** | ⏳ Documented | Code exists, not yet implemented |
| **Valcre Integration** | ⚠️ Partial | Most fields working, some issues |
| **DocuSeal LOE** | ✅ Working | Multi-page field mapping functional |
| **Dashboard UI** | ⚠️ Partial | Core working, UX issues with sync |

---

## Current Bugs & Issues

### HIGH PRIORITY (Data Loss / Broken Functionality)

#### 1. Appraiser Comments Disappearing ✅ RESOLVED
**Discovered:** Nov 12, 2025 (Desktop Claude Stage-1 Test)
**Resolved:** Nov 13, 2025
**Severity:** HIGH - Data Loss (FIXED)

**Problem (FIXED):**
- User types comments in Dashboard "Appraiser Comments" field
- Comments did NOT sync to Valcre "General" field
- API only checked for `InternalComments`, but frontend sent `appraiserComments`

**Root Cause:**
- API (`api/valcre.ts`) only accepted `InternalComments` or `internalComments`
- Frontend auto-save sent `appraiserComments`
- Field was silently ignored

**Fix Applied:**
Updated 3 locations in `api/valcre.ts` to accept all three field name variants:
- Line 243-245: Job UPDATE (PATCH) flow
- Line 711-712: Property creation flow
- Line 901: Job creation flow

**Enhancement Added:**
Also added two new comment fields to match Valcre's custom fields:
- **General Comments** (formerly "Appraiser Comments")
- **Delivery Comments** (NEW)
- **Payment Comments** (NEW)

All three fields now displayed side-by-side in a responsive grid layout.

**Status:** ✅ Tested and confirmed working in production

**Files Modified:**
- `/api/valcre.ts` - Accept all field name variants
- `/src/components/dashboard/job-details/LoeQuoteSection.tsx` - Three-column layout
- `/src/utils/webhooks/valcre.ts` - Pass through new fields
- Database: Added `delivery_comments` and `payment_comments` columns

---

#### 2. Additional Notes → Wrong Valcre Field ❌
**Discovered:** Oct 24, 2025
**Severity:** HIGH - Data Pollution
**Status from Nov 6:** May be related to Issue #1 above

**Problem:**
- Client form "Additional Information" field maps to wrong Valcre field
- Currently maps to: Valcre Property → "Off-Site Improvements"
- Pollutes property data with client notes

**Example Pollution:**
```
Off-Site Improvements: "Property is a 12,000 sq ft Building complex..."
```

**Expected Behavior:**
- Should map to Valcre Job → Comments → "Client" field (or similar)
- Should NOT map to property-specific fields

**Files to Check:**
- `/src/utils/webhooks/valcre.ts`
- Client form submission handler

---

### MEDIUM PRIORITY (UX Issues / Non-Critical)

#### 3. LOE Email Preview Error ⚠️
**Discovered:** Nov 12, 2025 (Desktop Claude Stage-1 Test)
**Severity:** MEDIUM - UX Issue

**Problem:**
- Error message appears after changing email in LOE eSignature Previewer
- Unclear if email actually sends despite error
- Error message not captured (needs reproduction)

**Steps to Reproduce:**
1. Fill in LOE section and click "Preview & Send LOE"
2. In eSignature Previewer, change recipient email (for testing)
3. Submit/Send the LOE
4. Error message appears (exact text unknown)

**Questions to Investigate:**
- What is exact error message?
- Does email actually send? (Check test inbox)
- Is error only when email is changed, or always?
- Should changing email be allowed in preview mode?

**Positive Note:**
- ✅ Field mapping to multi-page DocuSeal is working correctly
- ✅ All LOE fields populate properly in eSignature document

**Files to Check:**
- DocuSeal integration component
- Email sending service
- LOE preview modal

---

#### 4. Valcre Sync Shows Annoying Popups ⚠️
**Discovered:** Nov 6, 2025
**Severity:** MEDIUM - UX Annoyance

**Problem:**
- Valcre sync shows popup on every field change
- Popup appears before job exists (no VAL number yet)
- Creates poor user experience

**Expected Behavior:**
- Silent sync with subtle indicator (loading spinner, status icon)
- No sync until Valcre job is created
- Single confirmation after complete sync, not per-field popups

**Files to Check:**
- Valcre sync service
- Dashboard notification system
- Sync trigger logic

---

#### 5. ClickUp Task Name Too Long ⚠️
**Discovered:** Oct 24, 2025
**Severity:** MEDIUM - Cosmetic

**Current Format:**
```
VAL251021 - Riverside Complex, 152 17th Avenue SW, Calgary, AB T2R 1M5
```

**Expected Format:**
```
VAL251021 - Riverside Complex, 152 17th Avenue SW, Calgary
```

**Problem:** Province and postal code make task name unnecessarily long

**Files to Check:**
- `/supabase/functions/create-clickup-task/index.ts`
- Task name builder function

---

#### 6. Frontend ClickUp Token Outdated (401 Errors) ⚠️
**Discovered:** Nov 6, 2025
**Severity:** MEDIUM - Breaks Task Updates

**Problem:**
- Frontend `clickup.ts` has old API token
- Causes 401 errors when updating tasks from dashboard
- Backend Edge Function has correct token (Nov 6 refresh)

**Current Tokens:**
- Backend (Correct): `pk_10791838_PA9IIZZQVZDSGCUO73ZDXYXEIPQKZLVM`
- Frontend (Outdated): Unknown old token

**Files to Update:**
- `/src/services/clickup.ts` (or similar)
- Update to match backend token

---

### LOW PRIORITY (Legacy / Enhancement)

#### 7. Remove Disbursement Field 🗑️
**Discovered:** Oct 24, 2025
**Severity:** LOW - Legacy Cleanup

**Problem:**
- "Disbursement %" field is legacy from previous employer
- No longer needed in workflow
- Should be removed

**Action Required:**
- Remove from Dashboard Section 2 UI
- Remove from database `job_loe_details` table
- Remove from ClickUp custom fields (if exists)

**Files to Check:**
- Dashboard Section 2 component
- Database schema
- ClickUp field mapping

---

## Features to Implement (Not Bugs)

### 1. Valuation Premises Field Mapping ⭐
**Requested:** Nov 12, 2025
**Priority:** Enhancement (Not Critical)

**Context:**
- Client added new Valcre custom field "Valuation Premise - 1"
- Client form has "Valuation Premises" dropdown
- Dashboard Section 1 shows field
- Field does NOT currently map to Valcre

**Client Form Options:**
- Market Value: As Is
- Market Value: As Is & As Stabilized
- Market Value: As Complete & As Stabilized
- Market Value: Land As Is & As Complete & As Stabilized
- Market Value: Land As Is
- Market Value: Land As Is & As Rezoned

**Valcre Custom Field Options:**
- As Is
- As Stabilized
- As If Renovated & Stabilized
- As If Complete & Stabilized
- As Is Vacant Land
- As If Vacant Land
- As If Rezoned
- As If Serviced
- As If Subdivided

**Mapping Strategy Needed:**
- Remove "Market Value:" prefix from client form values?
- Map to single scenario (first option)?
- Support multiple scenarios via "Valuation Premise - 2"?

**Files to Update:**
- Valcre sync payload builder
- Field mapping configuration

---

### 2. ClickUp Stage 2 Task Updates ⭐
**Status:** Documented but Not Implemented
**Priority:** Enhancement

**Context:**
- Stage 1 (auto-creation on form submission) is LIVE ✅
- Stage 2 (update after Valcre job creation) is DOCUMENTED but not implemented
- TypeScript code exists in docs, needs integration

**What Stage 2 Should Do:**
- Update task name: `NEW SUBMISSION` → `VAL######`
- Append LOE data to task description (preserve Stage 1 data)
- Add Valcre job URL custom field
- Update status: "New Submission" → "LOE Pending"

**Reference:**
- See `/docs/03-ClickUp-Integration/03-TASK-FORMAT-VISUAL.md` (lines 200-300)
- Production-ready TypeScript code included

**Files to Create/Update:**
- Dashboard Valcre job creation handler
- Call ClickUp update after Valcre job created successfully

---

### 3. Lender Fields (Optional) ⭐
**Requested:** Nov 12, 2025
**Priority:** Low Enhancement

**Available Valcre Custom Fields:**
- Lender Company Name
- Lender Company Address
- Lender Contact Name
- Lender Contact Email
- Lender Contact Phone
- Lender Contact Title

**Question:** Should these be added to client form?
- Conditional on "Intended Use: Financing Purposes"?
- Always visible?
- Skip entirely?

**Decision Needed:** Discuss with client (Chris) before implementing

---

## Recently Fixed (Nov 6, 2025) ✅

### 1. Retainer Amount Not Transferring ✅
**Original Bug (Oct 24):** Dashboard $3000 → Valcre $350
**Status:** FIXED as of Nov 6
**Solution:** Unknown (may have been database schema fix or API payload correction)

### 2. ClickUp Auto-Creation Not Working ✅
**Original State:** Manual button required
**Status:** FIXED - Auto-creation LIVE
**Solution:** Database trigger with pg_net extension, Edge Function v20 deployed

### 3. ClickUp Bidirectional Links ✅
**Original State:** One-way navigation only
**Status:** FIXED
**Solution:** Custom field "Dashboard Job URL" added with clickable link type

### 4. Property Type Required Field ✅
**Original Issue:** Database constraint error
**Status:** FIXED
**Solution:** Property Type made required field, validation added

### 5. Same-as-Client-Contact Checkbox Removed ✅
**Original Issue:** Caused duplicate contacts in Valcre
**Status:** FIXED
**Solution:** Checkbox removed from both forms (APR Dashboard + Valta Website)

### 6. Button Color Changed ✅
**Original State:** Purple ClickUp button
**Status:** FIXED
**Solution:** Changed to blue for better visual appearance

---

## Confirmed Working ✅

### Valcre Field Mappings (Working Correctly)

| Dashboard Field | Valcre Destination | Status |
|----------------|-------------------|--------|
| Delivery Date | Dates → Due Date | ✅ |
| Appraisal Fee | General → Fee | ✅ |
| Retainer Amount | General → Retainer | ✅ |
| Property Name + Address | General → Subject Property | ✅ |
| Property Contact | General → Property Contact | ✅ |
| Client Info | General → Authorized Client | ✅ |
| Report Type | Report → Format | ✅ |
| Intended Use | Report → Authorized Use | ✅ |
| Client Comments | Comments → Client | ✅ |

### ClickUp Integration (Stage 1)

| Feature | Status | Notes |
|---------|--------|-------|
| Auto-creation on form submission | ✅ | Database trigger + Edge Function |
| Template application (9 subtasks) | ✅ | Template `t-86b3exqe8` |
| Dashboard Job URL custom field | ✅ | Clickable link from ClickUp → Dashboard |
| Task description (Stage 1 format) | ✅ | Client + Property + Contact info |
| Idempotency (no duplicates) | ✅ | Checks for existing task before creating |
| Bidirectional navigation | ✅ | ClickUp ↔ Dashboard |

---

## Unknown / Needs Verification ❓

| Dashboard Field | Expected Valcre Destination | Notes |
|----------------|---------------------------|-------|
| Scope of Work | Report → Scope | Not visible in test screenshots |
| Property Rights | Report → Purpose | Terminology might be mismatched |
| Analysis Level | Report → Analysis Level | Shows "Comprehensive" - hardcoded? |
| Payment Terms | ??? | No clear Valcre destination |
| Asset Condition | ??? | No clear Valcre destination |
| Property Type | General → Type | Shows "Building" - verify with different types |

---

## Testing Checklist for QA Partner

### Client Form Submission Test
- [ ] Fill all required fields
- [ ] Submit form
- [ ] Verify submission appears in dashboard
- [ ] Verify ClickUp task auto-created
- [ ] Check task has correct client/property data
- [ ] Verify dashboard job URL in ClickUp works

### LOE Creation Test
- [ ] Fill Section 2 LOE fields
- [ ] Add "Appraiser Comments" (test Issue #1)
- [ ] Create Valcre job
- [ ] Verify all fields map to Valcre correctly
- [ ] Check if Appraiser Comments saved (currently fails)
- [ ] Verify retainer amount matches (currently works)

### DocuSeal LOE Test
- [ ] Click "Preview & Send LOE"
- [ ] Verify all fields populated in document
- [ ] Try changing recipient email (test Issue #3)
- [ ] Send LOE
- [ ] Check for error messages
- [ ] Verify email received in test inbox

### Valuation Premises Test (New Feature)
- [ ] Select value from dropdown in client form
- [ ] Submit form
- [ ] Create Valcre job
- [ ] Check if value maps to "Valuation Premise - 1" (currently doesn't)

### ClickUp Stage 2 Test (When Implemented)
- [ ] Create Valcre job
- [ ] Check if ClickUp task updates automatically
- [ ] Verify task name changes to VAL######
- [ ] Verify LOE data appended to description
- [ ] Verify Stage 1 data preserved (not overwritten)

---

## System Access for Testing

**Production URL:** https://apr-dashboard-v3.vercel.app
**Supabase Project ID:** pmayntjktflgoiqhrmku
**ClickUp Test Workspace:** 8555561 (Ben's test workspace)
**ClickUp List ID:** 901706896375

**Credentials:** See `/docs/LOGIN-CREDENTIALS-PHASE-1.md`

---

## Documentation References

### ClickUp Implementation
- **Full Package:** `/docs/03-ClickUp-Integration/`
- **README:** Current status, Nov 6 updates
- **Technical Spec:** `02-AUTO-CREATION-TECHNICAL-SPEC.md`
- **Visual Examples:** `03-TASK-FORMAT-VISUAL.md` (TypeScript code)
- **Quick Reference:** `04-QUICK-REFERENCE.md`

### Testing Reports
- **Desktop Claude Stage-1 Test:** `/docs/PROJECT STATUS/Stage-1 test - 25.11.12.md`
- **October 24 Artifacts:** External file (bugs and field mapping tables)

### System Overview
- **Tech Stack:** React 18 + TypeScript + Vite
- **Database:** Supabase PostgreSQL
- **Integrations:** Valcre API, ClickUp API, DocuSeal
- **Deployment:** Vercel

---

## Next Session Priorities

1. **Fix Appraiser Comments disappearing** (Issue #1 - HIGH)
2. **Investigate LOE Email preview error** (Issue #3 - MEDIUM)
3. **Update frontend ClickUp token** (Issue #6 - MEDIUM)
4. **Implement Valuation Premises mapping** (Feature #1)
5. **Improve Valcre sync UX** (Issue #4 - MEDIUM)
6. **Consider implementing ClickUp Stage 2** (Feature #2)

---

**Document Status:** ✅ Complete
**Created:** November 13, 2025
**Created by:** Marcel (Terminal Agent)
**For:** APR Dashboard V3 QA Testing & Bug Tracking

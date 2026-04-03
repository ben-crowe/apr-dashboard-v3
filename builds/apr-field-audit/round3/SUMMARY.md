# Round 3: Valcre Job Creation + DocuSeal Send Test — Summary

**Date:** 2026-03-28
**Auditor:** QA Agent (dev-3.2)
**Job Tested:** Southlands Plaza, 3494 Spring Parkway (Sarah Wilson, Quantum Holdings)

---

## Full Pipeline Execution Results

```
Form Submit ─────── PASS (Round 2)
    ↓
Dashboard ────────── PASS (all fields displayed)
    ↓
Create Valcre Job ── PASS ✓ VAL261028 (ID: 834469)
    ↓
LOE Preview ──────── PASS (all fields populated in V3 template)
    ↓
Send LOE ─────────── PASS ✓ DocuSeal #6609936, slug zu53LLXj3gJTPr
    ↓
Email Sent ────────── PASS ✓ bc@crowestudio.com via Gmail SMTP
    ↓
ClickUp Updated ──── PARTIAL (edge function path works, client-side fails)
```

**The full 4-stage pipeline works end-to-end on a single job.**

---

## 1. Valcre Job Creation

| Metric | Value |
|--------|-------|
| Status | SUCCESS |
| Job Number | VAL261028 |
| Valcre Job ID | 834469 |
| Name in Valcre | Southlands Plaza, 3494 Spring Parkway, Calgary, AB |
| Status in Valcre | Lead |
| Response Time | ~8 seconds |
| PropertyType sent | Land |
| Entities Created | Contact (Sarah Wilson), Property, Job |
| Property Contact | David Wright (separate contact, different email) |

**Conversion maps verified:** PURPOSES_MAP (Partial Interest → PartialInterest), REQUESTED_VALUES_MAP (Liquidation Value → Liquidation), SCOPE_OF_WORK_MAP (All Applicable → AllApplicable), INTENDED_USES_MAP (Financing/Refinancing → Financing). Report Type was empty (not sent).

---

## 2. DocuSeal LOE Send

| Metric | Value |
|--------|-------|
| Status | SUCCESS |
| Submission ID | 6609936 |
| Signing Slug | zu53LLXj3gJTPr |
| Signing Link | https://docuseal.com/s/zu53LLXj3gJTPr |
| Email sent to | bc@crowestudio.com (test mode) |
| Email method | Gmail SMTP via Supabase edge function |
| Template | V3 HTML (all fields pre-rendered) |

**All 15 LOE fields populated in the actual send.** The "7 empty SELECT fields" from Round 1 are confirmed DEAD CODE — the V3 HTML template path fills everything.

---

## 3. ClickUp Integration

| Metric | Value |
|--------|-------|
| Task ID | 86b93vwd3 |
| Task Created | Previously (not during this test) |
| Task Updated after LOE | YES (via edge function, 200) |
| Task Updated after Valcre | FAILED (TypeError: Failed to fetch) |
| "View in ClickUp" button | Renders but noop (no URL) |

**Two update paths:** Client-side direct fetch fails (CORS). Supabase edge function succeeds.

---

## 4. Issues Found in Round 3

### HIGH

| # | Issue | Evidence |
|---|-------|---------|
| 1 | **Property Type mapping bug in LOE** | LOE shows "Financing/Refinancing" (intendedUse) in Property Type row. `generateLOE.ts` line 79: `[purposes]: job.intendedUse`. Confirmed same bug as Round 2 but now on a SENT document. |
| 2 | **Client-side ClickUp API calls fail** | `TypeError: Failed to fetch` on `updateClickUpWithValcreJob`. Browser CORS blocks direct api.clickup.com calls. Only edge function path works. |
| 3 | **Value discrepancy: Liquidation → "Market Value As Is"** | Dashboard shows "Liquidation Value", LOE shows "Market Value As Is And Stabilized". Template may have static text overriding the dynamic value. |

### MEDIUM

| # | Issue | Evidence |
|---|-------|---------|
| 4 | **LOE submission save fails** | `Failed to save LOE submission: Object` — loe_submissions table insert fails. LOE still sends but the record isn't persisted for future reference. |
| 5 | **"View in ClickUp" button noop** | Task ID exists (86b93vwd3) but button doesn't navigate. URL not constructed in component. |
| 6 | **Test Data button requires double-click** | LOE section Test Data button does nothing on first click. Second click populates all fields. React state timing issue. |
| 7 | **Report Type empty after test data** | Test Data fills 5 of 6 required fields but NOT Report Type. Valcre job created without ReportFormat. |

### LOW

| # | Issue | Evidence |
|---|-------|---------|
| 8 | **Auth warning on every action** | "User authentication check failed: Auth session missing!" — app runs without auth but logs warnings. |

---

## 5. Master Pipeline Checklist

| Stage | Step | Status | Evidence |
|-------|------|--------|---------|
| 1. Intake | Form submit | PASS | 19/19 fields flow to Supabase |
| 1. Intake | File upload | PASS | test-property-document.pdf stored |
| 1. Intake | Confirmation email | FAIL | No email sent (false promise on success page) |
| 2. Dashboard | Load job data | PASS | All fields display correctly |
| 2. Dashboard | Auto-save + Valcre sync | PASS | Fields save on blur |
| 2. Dashboard | Test Data fill | PARTIAL | Requires double-click, misses Report Type |
| 3. Valcre | Create job | PASS | VAL261028 returned |
| 3. Valcre | Contact creation | PASS | Sarah Wilson + David Wright (separate) |
| 3. Valcre | Property creation | PASS | Land type, Calgary parsed |
| 3. Valcre | 6 enum maps | 5/6 PASS | Report Type was empty (not sent) |
| 3. Valcre | ClickUp update | FAIL | Client-side CORS blocked |
| 4. LOE | Preview generation | PASS | V3 template fills all fields |
| 4. LOE | Property Type in LOE | **BUG** | Shows intendedUse not propertyType |
| 4. LOE | Valuation Premises in LOE | **BUG** | Shows "Market Value" not "Liquidation Value" |
| 4. LOE | DocuSeal submission | PASS | ID 6609936, slug zu53LLXj3gJTPr |
| 4. LOE | Email delivery | PASS | Gmail SMTP to bc@crowestudio.com |
| 4. LOE | ClickUp LOE update | PASS | Edge function path succeeded |
| 4. LOE | LOE submission save | FAIL | Database insert failed |
| 4. LOE | Button state change | PASS | "Resend LOE" with amber styling |

---

## Deliverables

| File | Content |
|------|---------|
| test1-valcre-creation.md | Valcre job creation success, VAL261028 |
| test2-valcre-fields.md | Field mapping verification, 5/6 maps used |
| test3-docuseal-send.md | DocuSeal send success, 0/7 empty fields |
| test4-clickup.md | ClickUp partial — edge function works, client fails |
| SUMMARY.md | This file |

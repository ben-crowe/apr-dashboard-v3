# APR Dashboard — Full Field Mapping & Integration Audit Summary

**Date:** 2026-03-28
**Auditor:** QA Agent (dev-3.2)
**Scope:** 4-phase field lifecycle tracing: Intake Form → Supabase → Dashboard → Valcre → DocuSeal → ClickUp/Email

---

## 1. Total Fields Traced

| System | Fields |
|--------|--------|
| Intake Form → Supabase | 18 content + 4 auto = 22 |
| Dashboard → Valcre (Job) | 25 mapped fields |
| Dashboard → Valcre (Contact) | 11 fields |
| Dashboard → Valcre (Property) | 17 fields |
| Dashboard → Valcre (Parcel/Assessment) | 8 fields (Comments workaround) |
| Dashboard → DocuSeal | 22 fields (7 empty) |
| Dashboard → V3 LOE Template | 19 placeholders |
| Dashboard → ClickUp | 7 fields in description |
| **Total unique fields traced** | **~62 across all systems** |

---

## 2. Top Issues (Ranked by Severity)

### CRITICAL

1. **7 Empty DocuSeal SELECT Fields** — property_type, intended_use, requested_value, property_rights, report_type, payment_terms, report_delivery are all sent as "" to avoid template overlay bugs. Client must manually re-select 6 of these despite data existing in the dashboard. This is the biggest UX gap in the entire pipeline.

2. **No Client Confirmation Email on Form Submission** — Client submits the intake form and gets only a browser toast. No email confirmation. No receipt. No way to verify their submission was received if they close the tab.

3. **ClickUp Checklist Not Updated on Signature Completion** — The DocuSeal webhook handler (`handleDocuSealWebhook`) updates the DB but does NOT call `updateClickUpChecklist`. The ClickUp task doesn't reflect that the LOE has been signed.

### HIGH

4. **13 VALTA-FIELD-SPEC Fields Not Implemented** — AssignmentType, PropertySubtype (partial), Tenancy, StateofImprovements, StatusofImprovements, ApproachestoValue, DesktopReport, Valuetimeframe, TransactionStatus, ZoningStatus, LandMetric, EA, HC — none are in the dashboard UI.

5. **Property Type Single→Multi Paradigm Mismatch** — Intake form submits a single string; dashboard stores comma-separated multi-select; Valcre needs first-type for PropertyType field + all-types for Types field. Works but fragile.

### MEDIUM

6. **Parcel/Assessment Fields → Comments on Update** — During PATCH operations, 8 parcel/assessment fields can only be appended to Comments because the Property entity ID isn't available. During initial creation they go to proper fields.

7. **Payment Terms → Comments Workaround** — No dedicated Valcre field exists for Payment Terms, so it gets appended to the Comments field as "Payment Terms: {value}".

8. **Two LOE Code Paths with Different Behavior** — `docuseal.ts` sends 7 SELECT fields as empty, but `generateLOE.ts` populates ALL fields in the HTML template. The preview shows correct data; the signing experience shows blanks.

### LOW

9. **Phone Number Formatting Inconsistency** — Intake form stores raw input; dashboard strips to numbers-only on save but displays formatted. Minor but could cause matching issues.

10. **Double Supabase Fetch on Page Load** — `job_submissions` fetched twice on dashboard load (likely React StrictMode in dev).

---

## 3. VALTA-FIELD-SPEC Fields Not Implemented Anywhere

| VALTA # | Field | Type | Implementation Status |
|---------|-------|------|---------------------|
| 4 | AssignmentType | Select | Not in dashboard, API, or LOE |
| 17 | Tenancy | Select | Not in dashboard, API, or LOE |
| 18 | StateofImprovements | Select | Not in dashboard, API, or LOE |
| 19 | StatusofImprovements | Select | Not in dashboard, API, or LOE |
| 23 | ApproachestoValue | Multi-select | Not in dashboard, API, or LOE |
| 25 | DesktopReport | Yes/No | Not in dashboard, API, or LOE |
| 26 | Valuetimeframe | Select | Not in dashboard, API, or LOE |
| 33 | TransactionStatus | Multi-select | Not in dashboard, API, or LOE |
| 34 | ZoningStatus | Select | Not in dashboard, API, or LOE |
| 35 | LandMetric | Select | Not in dashboard, API, or LOE |
| 36 | EA | Text | Not in dashboard, API, or LOE |
| 37 | HC | Text | Not in dashboard, API, or LOE |

Partially implemented: PropertySubtype (#16, in Valcre API but not dashboard UI), InterestAppraised (#20, mapped as propertyRightsAppraised), ValueScenarios (#22, mapped as valuationPremises but single-select vs required multi-select).

---

## 4. The 7 Empty DocuSeal SELECT Fields

| Field | Has Dashboard Data? | Recommendation |
|-------|-------------------|---------------|
| property_type | YES | Convert to TEXT field in template, pre-populate |
| intended_use | YES | Convert to TEXT field in template, pre-populate |
| requested_value | YES | Convert to TEXT field in template, pre-populate |
| property_rights | YES | Convert to TEXT field in template, pre-populate |
| report_type | YES | Convert to TEXT field in template, pre-populate |
| payment_terms | YES | Convert to TEXT field in template, pre-populate |
| report_delivery | NO (no source) | Keep as SELECT or add delivery method field to dashboard |

**Root cause:** DocuSeal renders SELECT dropdown fields as HTML overlays. When a value is pre-populated AND the dropdown renders, text appears doubled (bleed-through). The workaround was to send empty strings.

**Fix:** Change these 7 fields from SELECT to TEXT in the DocuSeal template. TEXT fields don't have overlay issues and can be pre-populated with exact values. The V3 LOE template (`generateLOE.ts`) already maps these correctly — only the DocuSeal API path (`docuseal.ts`) needs updating.

---

## 5. Email Gaps

| Event | Email Sent? | Recipient | Method | Gap? |
|-------|------------|-----------|--------|------|
| Form submitted | NO | — | — | **YES — no confirmation** |
| Valcre job created | NO | — | — | No (internal action) |
| ClickUp task created | NO | — | — | No (internal) |
| LOE sent for signing | YES | Client | Gmail SMTP edge function | No |
| LOE signed | NO | Appraiser? | — | **YES — no notification** |
| LOE signed | NO | Client | — | **YES — no receipt** |

**3 email gaps:**
1. No form submission confirmation to client
2. No notification to appraiser when LOE is signed
3. No signed copy/receipt to client after signing

---

## 6. Field Naming Mismatches

| Layer | Convention | Example |
|-------|-----------|---------|
| React form state | camelCase | clientFirstName |
| Supabase DB | snake_case | client_first_name |
| TypeScript interface | camelCase | clientFirstName |
| Valcre API | PascalCase | FirstName, IntendedUses |
| Valcre enums | PascalCase | FeeSimple, AcquisitionDisposition |
| DocuSeal fields | snake_case | client_name, property_type |
| LOE template | bracket syntax | [propertycontact.firstname] |
| ClickUp | camelCase (JS) | clientFirstName in template |
| VALTA-FIELD-SPEC | PascalCase | ClientFirstName |

**4 different naming conventions across 8 systems.** The conversion is handled correctly in code but creates cognitive overhead and potential for silent mapping errors when adding new fields. Each new field must be mapped in:
1. `initialFormData` (camelCase)
2. Supabase insert (snake_case)
3. Dashboard display component (camelCase via job object)
4. Valcre sync (various maps to PascalCase)
5. DocuSeal mapping (snake_case)
6. V3 LOE template (bracket syntax)

---

## Deliverables

| File | Phase | Content |
|------|-------|---------|
| `/tmp/apr-field-audit/phase1-intake-to-dashboard.md` | 1 | 22 fields, form→DB→dashboard mapping |
| `/tmp/apr-field-audit/phase2-dashboard-to-valcre.md` | 2 | 61 fields, 6 conversion maps, VALTA gap analysis |
| `/tmp/apr-field-audit/phase3-dashboard-to-docuseal.md` | 3 | 22 DocuSeal fields, 19 V3 template placeholders |
| `/tmp/apr-field-audit/phase4-integrations.md` | 4 | 14 integration events, 5 specific answers |
| `/tmp/apr-field-audit/SUMMARY.md` | 5 | This file |

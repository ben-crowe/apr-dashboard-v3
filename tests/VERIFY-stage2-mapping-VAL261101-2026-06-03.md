# Verify — Stage-2 field mapping (dashboard → Valcre) on VAL261101

**By:** qa-agent · 2026-06-03 · test job **VAL261101 "Westside Mall"** (Valcre Id 784140)
**Identity guard:** PASS before + after every write (Name stayed "Westside Mall, 2129 Broadway Court, Calgary, AB", Status Lead). No new jobs created. No other job touched.
**Status:** ✅ **ALL Phase-2 mappings VERIFIED.** 8/8 fields + 1 bonus (from-empty) sync correctly.

## Mechanism (key finding)
Stage-2 sync is a **CLI action — no Codex needed.** POST `{ jobData: { updateType, jobId, <fields> } }` to `https://apr-dashboard-v3.vercel.app/api/valcre`. The handler branches on `updateType && jobId` → **PATCH `Jobs(jobId)`** → updates the existing job, never creates. Returns `{success, updatedFields[]}`. Read back with the (now-fixed) `valcre-verify-job.sh`.
**Script fix shipped:** `valcre-verify-job.sh` line 16 `$filter` spaces → `%20` (the exit-3 root cause). Reads now work (exit 0).

## Method (proven, now routine)
Two passes per field set: **Pass 1** = distinct test values (proves the write + conversion-map actually fires, not just "value already present"); **Pass 2** = canonical checklist values (restores the job + confirms final state). Each our-field maps to a distinct Valcre target (except the Comments family), so a batched PATCH still isolates each mapping cleanly.

## Field-by-field map (our field → Valcre field → synced?)

| Our field (dashboard) | jobData key | Valcre field | Map | Pass-1 test → result | Pass-2 canonical → result | Synced |
|---|---|---|---|---|---|---|
| Appraisal Fee ($3,500) | appraisalFee | Fee | direct | 9999 → **9999** | 3500 → **3500.0** | ✅ Y |
| Retainer ($350) | retainerAmount | Retainer | direct | 999 → **999** | 350 → **350.0** | ✅ Y |
| Delivery Date (2026-02-10) | deliveryDate | DueDate | date split | 2026-03-15 → **match** | 2026-02-10 → **match** | ✅ Y |
| Property Rights (Leased Fee Interest) | propertyRightsAppraised | Purposes | PURPOSES_MAP | "Fee Simple Interest" → **FeeSimple** | "Leased Fee Interest" → **LeasedFee** | ✅ Y |
| Scope of Work (All Applicable) | scopeOfWork | Scopes | SCOPE_OF_WORK_MAP | "All Applicable" → **AllApplicable** (from empty) | (canonical) → **AllApplicable** | ✅ Y |
| Report Type (Appraisal Report) | reportType | ReportFormat | REPORT_FORMAT_MAP | "Desk Review" → **DeskReview** | "Appraisal Report" → **Appraisal** | ✅ Y |
| Payment Terms (On LOE Signature) | paymentTerms | Comments (appended) | no dedicated field | — | appended → **"… \| Payment Terms: On LOE Signature"** | ✅ Y |
| Comments — General | appraiserComments / InternalComments | Comments | direct | — | full text → **stored verbatim** | ✅ Y |
| **Authorized Use** (was BLANK) | intendedUse | IntendedUses | INTENDED_USES_MAP | "First Mortgage Financing" → **Financing** | (left as test) | ✅ Y (from-empty) |

## Notes / flags
- **Comments-family collision (by design):** `paymentTerms` APPENDS to the same `Comments` field that `appraiserComments` sets → final `Comments` = `"<appraiser text> | Payment Terms: <terms>"`. Confirmed exactly as the edge function builds it. If both are present they combine; that's intended, not a bug.
- **IntendedUses left = "Financing":** the checklist had Authorized Use BLANK. The from-empty test populated it (proving the map). Valcre enums can't be trivially re-blanked via PATCH, so it remains "Financing". Clear it in-app if you want it back to blank — flagging, not fixing.
- **RequestedValues / Valuation Premises** is a Stage-1 (intake) field, not in CoArch's Phase-2 list — not exercised here. Its intake-side save was already verified green in the earlier intake check.
- **Job left in canonical checklist state** (Fee 3500, Retainer 350, DueDate 2026-02-10, Purposes LeasedFee, Scopes AllApplicable, ReportFormat Appraisal, Comments per checklist) — except the IntendedUses note above.

## Verdict
Stage-2 (dashboard → Valcre) mapping is **GREEN** — every current field syncs accurately, both directions confirmed for the conversion-map enums. The field-by-field method is now routine, so adding/verifying new fields later is a known, CLI-driven procedure.

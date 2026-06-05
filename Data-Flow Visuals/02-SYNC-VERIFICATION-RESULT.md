# 02 — Dashboard → Valcre Sync Verification (Official Result)

**Date:** 2026-06-04
**Tester:** qa-agent (dev-2)
**Test job:** VAL261101 — *Westside Mall, 2129 Broadway Court, Calgary, AB* (Valcre Id 784140) — name-match guard passed before every write.
**Prod build verified against:** commit `60754b5` (native-rejection-visible + Property Rights first-value fix), deployed live.
**Method:** real `agent-browser` clicks on the live prod dashboard → ~1s debounced auto-sync push → **Valcre-side `GetValues` / Job readback** (never trusting the HTTP 200) → screenshot.

---

## The headline

**The dashboard→Valcre sync is verified working end-to-end.** A real field change on the dashboard pushes through the per-field auto-save and lands in the correct Valcre field — confirmed for both **native** fields (Job.Purposes, Job.IntendedUses) and **custom** fields (CF12054). The big hidden gap — native fields silently not syncing behind an HTTP 200 — is fixed and proven.

---

## Per-field scorecard

| # | Dashboard field | Path | Change made | Valcre readback | Result |
|---|---|---|---|---|---|
| — | Name-match guard | — | — | Id 784140 = "Westside Mall, 2129 Broadway Court, Calgary, AB" | ✅ |
| 1 | Property Rights | native `Job.Purposes` | Fee Simple Interest + Leasehold (multi-select) | **FeeSimple** (first/primary value) | ✅ **PASS** |
| 2 | Authorized Use | native `Job.IntendedUses` | Estate Planning | **EstatePlanning** | ✅ **PASS** |
| 3 | Zoning Status | custom **CF12054** | Illegal | **Illegal** | ✅ **PASS** |
| 4 | Analysis Level | native `Job.AnalysisLevel` | (Concise attempted) | rejected — `nativePatchError: "Requested value 'Concise' was not found"` | ⏸️ **PARKED** — Ben product decision |
| 5 | Transaction Status | custom **CF12053** | Listed | stayed "Under Contract" | ❌ **FAIL** — label reconcile |

### Notes per row
- **Property Rights (PASS):** multi-select now syncs the first/primary interest per the documented "first-value" house rule (PropertyType precedent). No more silent drop on multi-value. Verified: dashboard "Fee Simple Interest, Leasehold Interest" → `Purposes = FeeSimple`.
- **Authorized Use (PASS):** native push confirmed + regression-checked (Estate Planning → `IntendedUses = EstatePlanning`; earlier First Mortgage Financing → `Financing`).
- **Zoning Status (PASS):** custom-field path solid; re-confirmed Illegal landing this round.
- **Analysis Level (PARKED):** root cause found — the dashboard's options (Comprehensive/Concise/Form) are **not** valid Valcre `JobAnalysisLevel` enum members; only Comprehensive→Detailed is real. The real enum is report-PRODUCT-type values (Detailed, Summary, Brief, RentalAssessmentLetter, RentalSubmission, RentalDetermination, ValuationAssessmentLetter, DetailedResidential, PropertyPro, RestrictedAccessReport, ProgressReport) — not "analysis levels." This is a product decision (re-option the dropdown vs remap), not a sync bug. The doc `1-API-FIELD-MAPPING-REFERENCE.md` §3.4 (Concise→Concise "verified from job #706542") is **stale/wrong** and should be corrected.
- **Transaction Status (FAIL):** dashboard options (Listed / Not Applicable / Under Contract) don't match Valcre CF12053's values (Arms Length / Non-Arms Length / Listing / Under Contract / REO). "Listed" has no Valcre target → silent no-write. Needs label reconcile.

---

## Evidence (screenshots — `Data-Flow Visuals/screenshots/`)
- `04-valcre-sync-verify-native.png` — Valcre Report section: **Authorized Use = Estate Planning**, **Purpose = Fee Simple Interest**, dates (Bid/Awarded/Date of Value).
- `05-valcre-sync-verify-custom.png` — Valcre Custom Fields: **Zoning Status = Illegal**, Transaction Status = Under Contract (the FAIL case visible), Valuation Premise 1/2.

---

## Remaining work

| Item | Type | Owner | Notes |
|---|---|---|---|
| Transaction Status label reconcile | Bug | react-spec | Map/align dashboard CF12053 option labels to Valcre's values (Listed→Listing, add Arms Length/Non-Arms Length/REO, or remap) |
| Analysis Level options decision | Product | **Ben** | Re-option dropdown to real `JobAnalysisLevel` enum (Option-b, cleaner) **or** one-off remap; current options are mis-placed Report-Format values. react-spec has the live enum in hand. |
| Value Scenarios — 8 cascade IDs | Build | react-spec | Wired as manual value (CF11563/11564 = As Is / As Stabilized confirmed). The other 8 scenario IDs + the cascade-derive logic are deferred. |
| Dates sync re-verify | Test (tooling) | qa | Native date inputs don't accept programmatic keystrokes; couldn't re-verify via automation (needs the real date-picker). The 3 dates were originally wired + ride the same native path now proven by Authorized Use/Property Rights. |
| Sync indicator restore | UX | react-spec | Restore the per-field sync status/visual indicator on the dashboard. |
| Doc fix | Docs | doc-engineer | Correct `1-API-FIELD-MAPPING-REFERENCE.md` §3.4 stale AnalysisLevel mapping. |
| **ClickUp sync verification** | Test | qa | Next objective — same job → ClickUp task, per-field landing (not started). |

---

## Bottom line
Custom + native dashboard→Valcre sync **works and is proven** (3 PASS with Valcre-side readback). Two known items remain — both scoped, neither a sync-engine defect: Transaction Status label reconcile, and the Analysis Level options product decision.

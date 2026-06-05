# Auto-Sync Wiring Map — new job-prep fields → Valcre

**Purpose:** input for react-spec to wire the new job-prep dashboard fields into the auto-sync list (`VALCRE_SYNC_FIELDS`, LoeQuoteSection.tsx) and route each to its correct Valcre target.
**Verified by:** qa-agent — every target below was confirmed by **direct API write + readback** on the live test job VAL261101 / Valcre Id 784140 ("Westside Mall").
**Date:** 2026-06-04

> **The gap this closes:** today `VALCRE_SYNC_FIELDS` contains only the OLD fields. The new fields save to `job_loe_details` and stop — they never reach the Valcre job. Wiring them in (and routing each correctly) is what makes the sync provable.

---

## ✅ WIRE THESE (real Valcre target, verified)

| Dashboard field | Dashboard control | Valcre target | Write method | Example value (verified) |
|---|---|---|---|---|
| Transaction Status | Select | **Custom 12053** | `UpdateSelectFieldValue` (AvailableValueId) | Under Contract = **5989** |
| Zoning Status | Select | **Custom 12054** | `UpdateSelectFieldValue` | Legal Conforming = **5991** |
| Value Scenarios | MultiSelect | **Custom 11563** (Premise-1) + **11564** (Premise-2) | `UpdateSelectFieldValue` per premise | As Is = **5128** (11563), As Stabilized = **5138** (11564) |
| Authorized Use | Select | **Native `Job.IntendedUses`** | PATCH via `INTENDED_USES_MAP` | Financial Reporting → `FinancialReporting` |
| Property Rights | MultiSelect | **Native `Job.Purposes`** | PATCH via `PURPOSES_MAP` | Fee Simple → `FeeSimple` |
| Analysis Level | Select (newly converted) | **Native `Job.AnalysisLevel`** | PATCH via `ANALYSIS_LEVEL_MAP` | Comprehensive / Concise / Form |
| Request Date | Date | **Native `Job.BidDate`** | PATCH (already wired ✓) | 2026-03-15 |
| Signed Date | Date | **Native `Job.AwardDate`** | PATCH (already wired ✓) | 2026-03-20 |
| Effective Date | Date | **Native `Job.EffectiveDate`** | PATCH (already wired ✓) | 2026-04-01 |

The 3 dates already push correctly (proven). The other 6 are the ones to **add** to the auto-sync list + route as above.

---

## ⛔ DO NOT WIRE TO VALCRE (LOE-only / no target)

Routing any of these to Valcre will error or land in the wrong field:

| Dashboard field | Why not |
|---|---|
| Report Format | LOE-only ruling — no Valcre target |
| Assignment Type | LOE-only ruling (CF12049 exists but concept clash — held) |
| CMHC Financing | No Valcre field exists |
| Desktop Report | Phantom — CF12050 not on this tenant |
| **Purpose** (text field) | Does NOT feed `Job.Purposes` — **Property Rights** owns that. Wiring it would mis-route. |
| Lead Appraiser | No custom field; native Owner/Staff only, needs real Valcre staff accounts → stays dashboard-only text |

---

## Two hard gotchas for the wiring

1. **HTTP 200 ≠ success.** Valcre `UpdateSelectFieldValue` returns 200 even on internal failure (real status rides in the body). Verify every custom-field write via `GetValues?entityId=784140&type=6` readback.
2. **Map-keyed values must match exactly.** Native maps (`INTENDED_USES_MAP`, `PURPOSES_MAP`, `ANALYSIS_LEVEL_MAP`) only accept their keys. A dashboard value that isn't a map key **silently fails to push** — which is exactly why the converted dropdowns must source their options from the map keys (no free-text drift).

---

## After react-spec wires it

qa runs the per-field live test on VAL261101 (name-match guard first): change each wired field on the app → watch it land in the correct Valcre field within ~1s → screenshot the Valcre side → per-field PASS/FAIL table. Sync + mapping proven in one motion.

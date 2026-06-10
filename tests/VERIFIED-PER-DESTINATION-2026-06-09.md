# Verified Per-Destination Sync Status — for v2 fold-out reconcile

**From:** qa-agent (dev-2) · **For:** ui-designer (dev-3) fold-out · **Date:** 2026-06-09
**Sources:** `Data-Flow Visuals/02-SYNC-VERIFICATION-RESULT.md`, `04-CLICKUP-CUSTOMFIELD-SYNC-RESULT.md`, `builds/apr-field-audit/round4/valcre-field-verification.md`, `tests/PRD-A-FIELD-VERIFICATION-2026-06-03.md`

**Status legend:** `live` = readback-matched in destination · `partial` = wired but only some option values land · `not` = no target / proven-fail / held · `—` = not applicable / not a destination for this field.

**Confidence note:**
- **Valcre + ClickUp** columns are READBACK-VERIFIED (GetValues / independent ClickUp API readback — never HTTP 200). High confidence.
- **LOE** column is MAPPER-DERIVED (token exists in V07 contract + fills), NOT field-by-field readback-proven. The contract generates + the date/tokens fill end-to-end, but I did not readback each token individually. Treat LOE dots as "token-mapped," lower confidence than the other two.

---

## Section 2 — LOE Quote & Valuation (the LOE-test fields)

| Dashboard field | Valcre | ClickUp | LOE | Evidence / note |
|---|---|---|---|---|
| Job Number | live | live | live | round4 #1; ClickUp 04 |
| Job Status | live | — | — | round4 #3 (Status=Lead on create); native Status enum unproven for arbitrary values |
| Property Rights | live | live | live | 02 PASS (Job.Purposes, first-value); ClickUp 04; PRD-A C4 |
| Authorized Use / Intended Use | live | **partial** | live | Valcre 02+PRD-A C6 live; **ClickUp empty — "Estate Planning" ≠ any option** |
| Report Format | live | — | live | PRD-A C5 (Job.ReportFormat = Restricted Appraisal) |
| Report Type | not | **partial** | live | No Valcre native write proven; **ClickUp empty — "Appraisal Report" ≠ any option** |
| Scope of Work | **not** | live | live | **Valcre create FAIL (Scopes="None")**; ClickUp 04 live (short_text) |
| Value Scenarios | **partial** | — | live | Only "As Is" + "As Stabilized" proven (CF11563/11564); other 8 options NOT wired |
| Analysis Level | **partial** | — | partial | Only "Comprehensive"→Detailed lands; all other options Valcre-rejected (PARKED, Ben decision) |
| Transaction Status | **partial** | — | live | Wired CF12053, but only Valcre's own labels land — your "Listed" silently no-writes |
| Zoning Status | live | — | live | 02 PASS (Illegal); PRD-A C2 (Legal Conforming) |
| Payment Terms | not | live | live | ClickUp 04 live (dropdown); Valcre side = Comments only, not a real target |
| Appraisal Fee | live | not | live | round4 #4 (Job.Fee); ClickUp field absent on mirror (not added) |
| Retainer Amount | live | — | live | round4 #5 (Job.Retainer) |
| Effective Date | live | — | live | PRD-A #3 (Job.EffectiveDate) |
| Request Date | live | — | live | PRD-A #1 (Job.BidDate) |
| Signed Date | live | — | live | PRD-A #2 (Job.AwardDate) |
| Delivery / Due Date | live | live | live | round4 #6 (Job.DueDate); ClickUp 04 (date, ms) |
| Client Comments | live | — | — | round4 #14 |
| Valuation Premises | **not** | — | live | round4 FAIL (RequestedValues="None" on create) |
| Desktop Report | **not** | — | not | PRD-A #4 FAIL (CF12050 rejected / absent on tenant) |
| Purpose | not | — | live | No Valcre field exists |
| CMHC Financing | not | — | live | No Valcre field exists |
| Assignment Type | not | — | live | HELD — CF12049 exists but concept clash (count vs appraisal-type); never confirmed |
| Lead Appraiser | not | — | — | HELD — native OwnerId/StaffId, needs staff-ID lookup |
| Current Use / Proposed Use | not | — | partial | Free-text GAP today (registry has a list); not wired to Valcre |

## Section 1 — Client & Property identity

| Dashboard field | Valcre | ClickUp | LOE | Evidence / note |
|---|---|---|---|---|
| Client First Name | live | live | live | round4 + ClickUp 04 |
| Client Last Name | live | live | live | round4 + ClickUp 04 |
| Client Organization | live | live | live | round4 (Company) + ClickUp 04 |
| Client Email | live | live | live | round4 + ClickUp 04 |
| Client Phone | live | — | live | round4 PASS |
| Client Title | **partial** | — | live | round4 MISMATCH — fell back to "Client" (mapping bug) |
| Client Address | **partial** | — | live | round4 FAIL — client got PROPERTY address (mapping bug); postal lost |
| Property Name | live | live | live | round4 + ClickUp 04 |
| Property Address | live | live | live | round4 + ClickUp 04 |
| Property Type | live | live | live | round4 #5 (Property.Types=Land); ClickUp 04 dropdown |

---

## The traps to keep honest on the fold-out

1. **Scope of Work + Payment Terms** = ClickUp live but Valcre NOT live — a single dot overstates. The per-destination split fixes this.
2. **Authorized Use + Report Type** = Valcre/LOE live but ClickUp lands EMPTY (option-label mismatch) — that's `partial` on ClickUp, not `live`.
3. **The dashboard-option-vs-Valcre-option mismatch is the #1 partial driver** (Transaction Status, Analysis Level, Report Type). Wiring is fine; the option LABELS don't reconcile, so values silently no-write.
4. **LOE column is mapper-derived** — do not present it with the same authority as Valcre/ClickUp readback dots. Mark it visually distinct or footnote it.

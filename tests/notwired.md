# NOT-WIRED Exceptions — intent-gated, binary (for the manage-by-exception fold-out)

**From:** qa-agent (dev-2) · **For:** ui-designer (dev-3) · **Date:** 2026-06-09
**Model:** manage-by-exception. Assume everything works. List ONLY fields that are **intended** to reach a destination but **don't**. Binary — wired or not, no "partial." A field that drops some option values is **not wired** (it fails its job). Intent-gated: a field appears here ONLY if I've confirmed it's *supposed* to wire to that destination — so an empty list = genuinely all-good, not "didn't check."

**Sources:** `Data-Flow Visuals/02-SYNC-VERIFICATION-RESULT.md`, `04-CLICKUP-CUSTOMFIELD-SYNC-RESULT.md`, `builds/apr-field-audit/round4/valcre-field-verification.md`, `tests/PRD-A-FIELD-VERIFICATION-2026-06-03.md`

---

## THE EXCEPTIONS — highlight exactly these

| # | Field label | Exception destination | Reason (the "how") |
|---|---|---|---|
| 1 | **Scope of Work** | Valcre | Sent on job-create but lands "None" — not included in the create payload (only the update path maps it). |
| 2 | **Transaction Status** | Valcre | Dashboard option labels don't reconcile with Valcre's values; any non-matching pick (e.g. "Listed") silently doesn't save. |
| 3 | **Analysis Level** | Valcre | Dashboard options are mis-mapped Report-Format values, not valid AnalysisLevel enums; only "Comprehensive" reconciles. *(Parked — option set is Ben's product decision.)* |
| 4 | **Valuation Premises** | Valcre | Sent on job-create but lands "None" — RequestedValues not included in the create payload. |
| 5 | **Client Title** | Valcre | Field-name mapping bug — falls back to "Client" instead of the sent title. |
| 6 | **Client Address** | Valcre | Client contact receives the PROPERTY address (mapping bug); postal code dropped. |
| 7 | **Authorized Use** (Intended Use) | ClickUp | Option labels don't reconcile ("Estate Planning" ≠ any dropdown option) → lands empty. *(Valcre side IS wired — ClickUp only.)* |
| 8 | **Report Type** | ClickUp | Option labels don't reconcile ("Appraisal Report" ≠ any dropdown option) → lands empty. |
| 9 | **Current Use** | dropdown/mapping | Never built — free-text today; registry has the option list, field was never wired to it. |
| 10 | **Proposed Use** | dropdown/mapping | Never built — free-text today; registry has the option list, field was never wired to it. |

**Everything not on this list = confirmed working (or correctly not-intended). No highlight.**

---

## Deliberately EXCLUDED — intent NOT confirmed, so NOT flagged

These are grey but **not exceptions** — flagging them would pollute the clean-page guarantee. They're open questions, not wiring failures:

- **Assignment Type → Valcre** — held; CF12049 exists but concept clash (count vs appraisal-type). Intent unresolved.
- **Lead Appraiser → Valcre** — held; needs staff-ID lookup. Intent plausible, not confirmed.
- **Purpose → Valcre** — no Valcre field exists; not intended to wire there.
- **CMHC Financing → Valcre** — no Valcre field; not intended.
- **Desktop Report → Valcre** — slated for deletion (client Status directive = "Delete"); not intended to wire.

---

## Note on the LOE column

I did NOT generate LOE exceptions. The LOE statuses are mapper-derived (token fills, not field-by-field readback), so I can't assert a LOE not-wired with the same confidence as Valcre/ClickUp. Treat LOE as un-flagged until readback-proven. If you want LOE exceptions too, say so and I'll readback-verify the contract tokens directly.

---

## Confidence

Items 1–8 are READBACK-VERIFIED exceptions (Valcre GetValues / independent ClickUp API). Items 9–10 are build-gaps (free-text where a mapped dropdown was intended) — confirmed by the field state, not a readback. The excluded list is intent-gated out on purpose.

---

## UPDATE 2026-06-10 (fresh live readback + round-trip, co-arch+qa)

**RETIRED (now confirmed WIRED via fresh readback / round-trip on 784140):**
- **Transaction Status** — TRUE round-trip PASS (wrote 7567 Listed → readback exact → restored 7568). Dropdown now offers only the 3 mapped labels. Fully wired.
- **Scope of Work** — readback `Scopes:"IncomeApproach"` lands (update path maps it).
- **Analysis Level** — readback `AnalysisLevel:"Detailed"` lands (2026-06-04 re-option fixed it).
- **Zoning Status** — readback CF12425 `In Place` lands.

**STILL NOT WIRED (the real remaining punch-list):**
- Valuation Premises — `RequestedValues:"None"` (create-payload gap).
- Client Title / Client Address — mapping bug (not re-verifiable on 784140; contact fields empty).
- Current Use / Proposed Use — custom 12410/12411 empty; dropdowns built but not sending to Valcre.
- Value Scenarios — DUAL-WRITE: legacy premise map (CF11563/11564, 3 scenarios only) throws "Failed to sync" for unmapped scenarios while CF12414 (all 10) holds the data. FIX = drop legacy premise path, keep CF12414.

**LATENT GAP (code-hardening, not a current failure):** setValtaCustomFields readback-verifies SingleOption only (api/valcre.ts:334); MultiOption writes (transactionStatus, clientDocuments) trust HTTP 200 with NO readback. They land today but won't catch a future silent no-write if Valcre re-ids the enum. Extend the readback gate to MultiOption.

---
content_type: parked-items
title: Parked Visual Items — Value Scenarios lines + Fill-cascade (Ben, 2026-06-10 PM)
status: PARKED — review + document only; rework with Ben when he has time
created: 2026-06-10
owner: ui-designer (holds) · Ben (decides timing)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, dashboard, underline, visual, parked, cascade, fill-test-data]
---

# Parked Visual Items (Ben review, 2026-06-10 PM)

Two things Ben flagged then asked to **park** — not to work on now. Documented so we pick them up
together later. No code changed for either.

---

## 1. Field underlines — too many, too visible (PARKED — the real future task)

**What Ben sees:** the dashboard underlines read as **busy/noisy** — "all these lines everywhere,"
especially in **dark mode**.

**What Ben wants (when we do it):**
- Underlines should be **very thin + dim** — only *slightly* visible, not prominent. Especially dark mode.
- **Line LENGTH differences are NOT the concern** — the non-dropdown (derived) field underlines run
  longer than the dropdown ones because the field content is longer. Ben is fine with that.
- Making the lines **a bit longer / more consistent is acceptable**, but secondary.
- **Layout idea:** the **left column could pull IN, or expand toward the middle** — there's more
  horizontal room than we're using. Worth exploring when we rework this.

**Technical note (for the rework):**
- Dropdown fields stop at a fixed width (SelectTrigger `max-w-[…]`, fills it → consistent underline).
- Derived/locked fields (`derivedFieldStyle` div) are content-width → underline length varies. A fixed
  width would even them, but per Ben that's NOT the priority — the **dimness/thinness** is.
- The underline color today: derived = `rgba(148,163,184,0.45)`; inputs/dropdowns = `border-b-gray-300 / white/20`.
  To make them barely-visible in dark mode, drop the opacity / use a fainter token consistently.

**Status:** PARKED. Review-only. Do NOT touch until Ben revisits this with more time.

---

## 2. Fill Test Data still populates a cascade-derived field (PARKED — pending Ben's call)

**What Ben wants:** pressing **Fill with Test Data** should leave the **cascade section empty
(Pending)** — identical to the default/cleared state. It should not fill any scenario. Applies to
**both live + mock**.

**Finding (root cause):**
- **Value Scenarios + Approaches** derive from **Status of Improvements**, which Fill does NOT set →
  they correctly stay **Pending** after Fill. ✓
- **Property Rights** derives from **Property Type / Subtype / Tenancy** (Cascade Group 1). Fill DOES
  set `tenancy: 'Multi-Tenant'` → `derivePropertyRights` returns **"Leased Fee Interest"** → Property
  Rights shows a value after Fill. That's the field appearing "filled" — it's Property Rights (driven
  by the Tenancy that Fill populates), and on the mock `PROPOSED_BASE` also sets `propertyRights`
  directly.

**Proposed fix (when greenlit):** make Fill leave the whole cascade section blank — i.e., have the
Fill objects NOT populate the Group-1 trigger/outputs (`propertySubtype`, `tenancy`,
`propertyRightsAppraised` on live; `propertyRights` in mock `PROPOSED_BASE`), so Property Rights stays
"Pending" until the user engages the cascade. Confirm with Ben WHICH fields Fill should leave blank
(Subtype/Tenancy are otherwise legit test data — the trade-off is his call).

**Status:** PARKED pending Ben's decision on which fields Fill should skip. Quick contained fix once decided.

---

**Last reviewed:** 2026-06-10 by ui-designer — captured from Ben's live-review notes; both items
parked at his request (review + document only, no changes made).

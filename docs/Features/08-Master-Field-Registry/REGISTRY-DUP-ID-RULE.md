---
content_type: rule
title: Registry Duplicate-ID Rule — classify before you "fix"
created: 2026-06-22
author: co-architect
gate: qa-agent
purpose: ONE shared rule so the two streams touching the registry — qa's S1/S2 V3-bridge work + ui-designer's V4-native section review + any field build (e.g. completion-plan priority #2) — resolve duplicate field ids CONSISTENTLY, not three different ways.
tags: [apr-dashboard, field-registry, duplicate-id, v4, coordination-rule]
---

# Registry Duplicate-ID Rule

> **Why this exists.** `fieldRegistry.ts` has ~111 duplicate field ids BY DESIGN — the
> "enter once, reference everywhere" pattern (one id surfaced in several sections shares ONE store
> value + fills ONE `{{placeholder}}`). So **a duplicate id is NOT inherently a bug.** Two streams are
> now editing the registry in parallel (qa = S1/S2 V3-bridge; ui-designer = V4-native sections; plus
> field builds). Without one rule they'll "fix" dups three different ways. This is that rule.

## The rule — split by SAME-SECTION vs CROSS-SECTION (the clean discriminator)

When you find the same field id more than once, do NOT reflexively dedupe. Decide by WHERE the copies sit:

**1. SAME-SECTION duplicate = ALWAYS a defect → collapse to ONE.**
Two instances of the same id inside one section have no reference purpose — there's no value to "flow"
to itself. Keep one canonical instance (edit it to the right label/type/options), delete the extra.
*(Evidence it's always a defect: this registry gives genuine repeats DISTINCT numbered ids —
`comp1/comp2`, `appraiser1/appraiser2`, `subject-photo-1…25` — so a true same-id-twice-in-one-section
is never intentional.)* *(e.g. the `client-postal` ×2 — alignment 2026-06-21.)*

**2. CROSS-SECTION duplicate sharing one id = INTENTIONAL consolidation → KEEP — IF consistent.**
This is the ~109 "enter once, reference everywhere" pattern: captured once, reappears downstream with
the same id so the value flows. **KEEP it — but every instance MUST be consistent on `type` + `options`
+ `label`.** A cross-section dup with a MISMATCH is the only cross-section thing you fix:
   - mismatched **type** (e.g. `text` vs `dropdown`) → reconcile to one type (captured option-field → dropdown wins). *(e.g. `tenancy`.)*
   - mismatched **options/label** that drifted → reconcile to the canonical set. *(e.g. `report-type` loe-prep vs report.)*

**3. CANONICAL tiebreak when two cross-section defs disagree:**
   - **The CAPTURE/source section wins** — where the user actually ENTERS the field (usually intake / S1–S2). Downstream copies match it (or become read-only references).
   - **Addition (co-arch) — V4-native-only dups (no S1/S2 capture involved):** when BOTH instances are downstream/V4-native (e.g. a `subject-*` id repeated across `exec`/`site`), there's no S1/S2 capture to win — so canonical = the section where the field is the genuine **INPUT** (vs a display mirror). If no clear input-owner, **flag it, don't guess** (STUCK / to co-arch).

> **⚑ Clarification — TYPE-canonical vs HOME-canonical are SEPARATE questions (qa, 2026-06-22).** "Dropdown wins for option-fields" and "the capture/canonical section wins" can look like they conflict — they don't, because they answer different things:
> - **TYPE-canonical** = which *type* is correct (the better-constrained one: dropdown > text for an option-field; currency/manual > a stale `calculated` for a captured value).
> - **HOME-canonical** = which *section's instance* is the home (capture/V3 section, or the genuine input-owner).
>
> **Resolution: apply the winning TYPE to the canonical HOME instance**, and make the other instances match. (e.g. `comp-parking-type`: upgrade the sales-comparison canonical instance TO dropdown + copy the options — TYPE-canonical=dropdown applied to HOME-canonical=sales-comparison.)

**Scope guard:** ONLY the two defect classes get touched — (1) same-section redundancy + (2) cross-section
type/options/label mismatch. The ~109 *consistent* consolidation dups are **LEFT ALONE** — touching them
breaks the value-flow pattern. KEEP-by-default: if you can't name the defect class + why, don't merge.

> **Co-editable vs read-only reference (builder note).** After reconciling a cross-section dup to one
> consistent definition, you'll have multiple co-editable instances bound to ONE store value. That's
> ACCEPTABLE today — they share one value, so it's last-write-wins, harmless. The "enter once"
> *intent* implies the downstream instances should ideally be read-only REFERENCES (display the
> captured value, not re-edit it) — a future polish, NOT required now. A builder doesn't need to make
> downstream copies read-only to satisfy this rule; just don't create a SECOND independent value.

## Non-negotiables on any fix

1. **Re-confirm against live `src/features/report-builder/schema/fieldRegistry.ts`** before editing — line refs + instance counts drift; a scoping map (this doc, a delta) is never the final word.
2. **4-file-sync** on every registry change: `fieldRegistry.ts` ↔ `data/TestDataSet1.ts` ↔ `public/Report-MF-template.html` ↔ `components/EditPanel/EditPanel.tsx`.
3. **No-workarounds** — one canonical definition per id; no aliases/commented-out copies as a "fix".

## Who uses this

- **qa-agent** — S1/S2 bridge dup resolution + gating any field build.
- **ui-designer** — the V4-native section-by-section review (already surfacing duplicate client fields in V4-native sections — classify each with the table above).
- **any field builder** (e.g. completion-plan priority #2) — cite this rule in the build prompt.

---

*Penned 2026-06-22 by co-architect (off qa's cross-stream collision flag + the alignment-pass dup classes). qa gates. The single dup-id authority — link here, don't re-derive per stream.*

---
content_type: fix-inventory
title: Mock ↔ Live Dashboard — Style Parity Fix Inventory (forensic)
status: READY — background visual pass; apply AFTER functional wiring is verified (Ben: visuals are minor, do them after)
created: 2026-06-10
owner: co-architect (holds) · ui-designer (applies when greenlit)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
source: forensic computed-style diff (mock field-registry-v6.html "Mock Dashboard" vs live job-detail) 2026-06-10
tags: [apr-workflow, dashboard, parity, visual-fix, font-size, mock-vs-live, forensic]
---

# Mock ↔ Live Parity Fix Inventory

**Tags:** #ground-truth #loose-end #doctrine-decision
**Entities:** [[Mock-Dashboard]] [[Live-Dashboard]]

Forensic computed-style diff of the mock vs the live dashboard. This is the ready punch-list for the
visual-parity pass — apply when greenlit (NOT during functional wiring; Ben parked visuals as
"minor, do after").

## ROOT CAUSE (the one big lever)

**Mock `body` font-size = 14px. Live `body` = 16px → the whole live page renders ~14% larger** ("zoomed"
feel). The mock's inline `<style>` sets `body { font-size: 14px }`; the live app has no `body`/`html`
font-size override in `src/index.css`, so it inherits the browser 16px.

**One-line fix first:** add `html { font-size: 14px; }` (or `font-size: 87.5%`) to `src/index.css`
`@layer base`, THEN re-audit the per-element type classes below (some deltas resolve automatically once
the base shrinks).

## Mismatch table (mock = target)

| Element | Property | Mock | Live | Fix |
|---|---|---|---|---|
| body | font-size | 14px | 16px | `body { font-size:14px }` |
| body | line-height | 21px | 24px | follows base fix |
| Section title heading | font-size | 10px | 16px | `text-xs font-semibold uppercase tracking-[0.06em]` |
| Section title heading | weight/transform/tracking | 600 / uppercase / 0.06em | 500 / none / normal | add all three |
| Section title bar | padding | 10px 20px | 12px 16px | `py-[10px] px-5` |
| Section title bar | background | #fafafa | gray-200 | `bg-[#fafafa]` / `bg-gray-50` |
| Subgroup heading | font-size | 10px | 12px | `text-[10px]` |
| Subgroup heading | margin-bottom | 0 | 12px | `mb-0`/`mb-1` |
| Field label | font-size | 12px | 14px | label `text-xs` |
| Field label | min-width (col) | 145px | 160px | `min-w-[145px]` |
| Field input | font-size | 12px | 14px | CompactField input `text-xs` (biggest text delta) |
| Field input | padding | 0 2px | 8px 0 | `py-0 px-[2px]` (the 8px is eating the 28px height) |
| Field input | height | 28px | 28px | match |
| Dropdown trigger | font-size | 12px | 14px | SelectTrigger `text-xs` |
| Dropdown placeholder | color | zinc-400 rgb(161,161,170) | rgb(92,99,112) (too dark) | `text-zinc-400` |
| Field row | min-height | 28px | 32px (`py-0.5`) | `py-0` |
| 2-col grid | column gap | 28px | 32px | `gap-x-7` |
| 2-col grid | row gap | 6px | 2px | `gap-y-1.5` |
| Section body | padding | 14px 20px 18px | 24px 40px | `px-5 pt-[14px] pb-[18px]` |
| Section-to-section | spacing | 14px | 24px (`space-y-6`) | `space-y-[14px]` |

## Structural notes
- Field layout model is the same horizontal flex (label left / input right) — correct; just needs the
  smaller type class (`text-xs` not `text-sm`).
- Section title is a Radix AccordionTrigger button rendered at full heading size — fine structurally,
  needs the compact uppercase class.
- The placeholder dim-shade inconsistency (3 shades) ties to the placeholder-color row above — unify to
  `text-zinc-400` so "Select…"/"Pending"/text placeholders match.

---

**Last reviewed:** 2026-06-10 by co-architect — forensic computed-style diff; root cause = 14px vs 16px
base. Held for the post-wiring visual pass.

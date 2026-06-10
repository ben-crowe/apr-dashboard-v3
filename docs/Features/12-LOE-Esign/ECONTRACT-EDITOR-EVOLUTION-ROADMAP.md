---
content_type: design-roadmap
title: eContract Creator — Evolution Roadmap (editable areas → page-faithful → asset-backed blocks)
status: v1 vision — 2026-06-05 (Ben brainstorm captured by ui-designer; design direction, not yet scheduled)
owner: ui-designer (design/spec) · react-spec (build) · Ben (direction + go-lives)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
pairs_with: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-ECONTRACT-CREATOR-ARCHITECTURE.md
tags: [apr-workflow, loe, econtract, html-editor, editable-areas, paginated-preview, asset-blocks, logo-asset, paged-js, roadmap]
---

# eContract Creator — Evolution Roadmap

**Tags:** #apr-workflow #loe #econtract #template-versioning #edit-scope #job-override #docuseal #html-editor #editable-zones #paged-js #roadmap
**Entities:** [[LOE E-Sign Feature]] [[eContract Editor]] [[loe_templates]] [[DocuSeal]] [[Paged.js]]

The in-app LOE editor today = a **section-textarea editor** beside a **read-only continuous-scroll
preview**, saving app-wide template versions to the `loe_templates` DB (see the architecture doc for
as-is detail). This roadmap is the agreed *to-be* direction, captured from Ben's brainstorm 2026-06-05.
It is design direction — phases are sequenced, not yet scheduled.

**The throughline:** the editor evolves from "edit text in fixed sections" → "compose a page-faithful
document from editable zones and shared assets," with a clean separation between *what ships* and *what
you're previewing/editing*.

**Cross-cutting principle — nothing client-specific stays hard-coded; the user takes control.**
The logo, the footer address/company line, and any other client-specific element should be editable in
the editor (or swappable from the resource area), NOT baked into the template source. The test: if the
client wants it different, can a user change it in-app without an agent editing code? Today the answer is
"no" for the logo (base64 baked in) and the footer (hard-coded in `@page` CSS) — both are the pattern to remove.

---

## Phase 1 — Multi-choice template picker (IN FLIGHT, react-spec)

- Template dropdown offers **both V3-Current and v07 as choices** — each **viewable AND editable** on selection.
- **Selecting a template = previewing it.** Choosing one loads it into editor/preview; it does NOT change
  the live send. (This is the resolution to "no preview-only slot" — the *act of choosing* is the preview.)
- **V3 stays the live send** until a deliberate, separate go-live. v07 added as a selectable choice so our
  work (rebuilt logo, §10 cascade, section suppression, the design) is finally reviewable inside the app.
- Going live (activating v07 as the send template) = a distinct Ben go/no-go.

## Phase 2 — Page-faithful preview AND editor (the page-break gap)

The current preview is a continuous scroll, so **page breaks, per-page footers, and per-page header
logos are invisible** — you can't see what lands on which page. Poor UX for a contract.

- Render the LOE as **real page-sized sheets** (8.5×11) stacked down the pane — each with its footer and
  "Page X of Y," with visible breaks — matching the PDF exactly. Tool: **Paged.js** (polyfills the same
  `@page` rules the PDF uses, in-browser).
- **The editor uses the same paginated render** — edit a block and watch content reflow onto the next
  sheet; you always see the real page, footers and breaks included. Preview and editor become one picture.
- Staging: page-faithful *rendering* first (the visible-pages win); edit-*directly-on-the-page* (click text
  on page 2, change in place) is the larger lift, layered on after.

## Phase 3 — Editable zones + two scopes (job vs template)

- **Editable zones** ride the **§10 comment-fence pattern** we already shipped (`<!-- ZONE:START/END -->`)
  — the proven foundation for marking which regions are user-editable.
- **Flagship editable zone — the FOOTER.** The footer company name + address currently live **hard-coded
  in the `@page` running-footer CSS** (`@bottom-left` etc.), so changing a client's address means editing
  template source. Make it an **editable footer zone** — the user edits the address/company line in-app,
  it populates every page's footer, no code change. (May partly exist already — verify; if not, it's a clean Phase-3 first target alongside the logo.)
- **Two scopes, because editing content is two different things:**
  - **Edit This LOE (job override)** — the *default, safe* action. Tweaks only this client's contract.
    Requires a **per-job override store** (today edits only save as app-wide template versions — the real
    missing piece flagged in the architecture doc).
  - **Edit Template** — *deliberate, gated, rare.* Changes the shared boilerplate for all future LOEs.
    Clearly labeled + confirm-gated, so a one-off tweak never silently rewrites everyone's contract.
- **Layout/structure stays out of user editing** — section order, page design, conditional logic are
  code/design. The conditional suppression already handles structural variation (sections drop + the
  doc renumbers) automatically.
- Reconciliation rule to design: when a job-override exists and the template later changes, the override
  wins for that job; new jobs inherit the new template.

## Phase 4 — Asset-backed blocks (logo first) — the headline evolution

Stop hard-coding assets into each template. Introduce a **shared resource/asset area** in the editor
(at the bottom), and let template blocks **reference an asset by ID/location** rather than embed it.

- **Logo first (the obvious starter — we just lived the hard-code pain):**
  - A **logo asset slot** keyed by a **location/ID**. The template's logo block points at that asset.
  - Swap the logo from the **resource area** → it **instantly updates every template** that references the
    slot. No re-baking base64 into each template, no per-template logo design.
  - This directly removes the work we just did by hand (rebuild logo → re-embed into the template file).
- **Then generalize to asset blocks:** add an **image block** or a **graph/chart block** from the resource
  library; map it to an asset; it populates on the page. The editor becomes "compose from assets," not
  just "edit text."
- Mechanics to design: a resource/asset registry (id → asset), a block type that renders `asset(id)`,
  and the editor UI to pick/map. Update-once-propagates-everywhere is the core value.
- **Demo asset retained (Ben, 2026-06-05):** keep the ui-designer-rebuilt logo
  (`loe07-build/assets/valta-logo-rebuilt*.png`) as a SECOND logo option — it's the ready-made test
  asset to prove the logo-swap concept (two logos in the resource area, pick one, it populates). Do not delete it.

---

## Why this sequence

1 unblocks review (see v07 in the app). 2 makes the preview honest (you see real pages). 3 makes editing
safe + per-job. 4 removes hard-coding and turns it into a real composer. Each phase stands alone and ships
value; together they're the "novel in-app page builder" the editor is already gesturing at.

## Foundations already in place
- `loe_templates` versioned store (Phase 1 picker rides it).
- §10 **comment-fence** pattern (Phase 3 zones ride it).
- **CSS section-counter** renumbering + conditional-section helper (structural variation already automatic).
- Chrome/DocuSeal `@page` print rules (Phase 2 Paged.js mirrors them in-browser).

> Captured from Ben's 2026-06-05 brainstorm. Next: Ben picks which phase to schedule after the v07
> picker (Phase 1) lands; ui-designer details that phase's spec, react-spec builds.

---

**Last reviewed:** 2026-06-09 by qa-agent — surfaced on the [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) (Significant Features 3a) + brought to km-markdown standard (inline Tags/Entities for tag-search). Content unchanged.

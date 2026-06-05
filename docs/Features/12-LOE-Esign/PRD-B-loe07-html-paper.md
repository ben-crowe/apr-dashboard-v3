---
content_type: prd
title: PRD-B — LOE-07 Build via Paper → HTML
status: ready-to-roll (Ben + co-architect drive design; agent does field/DocuSeal wiring)
created: 2026-06-03
source_odt: ~/Development/KM-Exp/data/tasks/content/task_015q1z37/attachments/LOE-Template-V07.odt (PREFERRED — pandoc → HTML skeleton)
source_pdf: ~/Development/KM-Exp/data/tasks/content/task_015q1z37/attachments/LOE-Template-V07.pdf (visual reference / page-images for canvas)
source: LOE-07-INTAKE-2026-06-03.md (structure + placeholder coverage)
related: [LOE-07-INTAKE-2026-06-03.md, workflow-graphic-paper, html-first-phase]
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, loe, loe-07, docuseal, html-render, section-10, cascade]
---

# PRD-B — LOE-07 Build via Paper → HTML

## Goal
Replace the current live LOE (v5) with LOE-07 (the May-25 contract). Build it the Paper way:
design the contract on the Paper canvas, export to an editable HTML template — same neat
canvas→HTML path as the graphic workflow. Then wire every placeholder to the APR job + DocuSeal
in code. Hard rule (Ben): nothing in the LOE is typed by hand — every field sources from the job.

## Phase 0 — RESOLVED 2026-06-03 ✓
**Footer verdict: DocuSeal HONORS CSS paged-media running footers** — verified end-to-end.
Test: a pure CSS `@page` running footer (`@bottom-center` with `counter(page)`/`counter(pages)`,
no manual breaks, no hardcoded total) pushed through docuseal-proxy → `/submissions/html`
(submission 8146815) rendered a 5-page PDF with "Valta Property Valuations Ltd. | Page N of 5"
on EVERY page, correct auto-numbers + auto-total. Confirmed by react-spec, co-architect (read the
PDF), and QA. → **LOE-07 uses the AUTOMATIC @page footer approach** (drop the manual per-page
hardcoded footers in v3Template). This makes the variable-length content (conditional Schedule A,
variable EA/HC rows) reflow-safe — footer + page numbers just work on whatever pages result.
Artifacts: tests/docuseal-footer-test.html, tests/docuseal-submit.py, data/screenshots/docuseal-footer-test.pdf.

The CURRENT v3Template uses MANUAL hardcoded footers (`.manual-footer` divs + literal "Page 1 of 4"
+ explicit `page-break` divs) — that is the legacy pattern LOE-07 replaces with the @page approach.

## (original Phase 0 note — superseded by the result above)
Before any canvas or HTML work, run serious context-search on how our existing LOE + DocuSeal
e-signing document actually works — specifically the **footer mechanics**: is the per-page footer
HTML-per-footer, a print/paged-media running footer, a baked image, or DocuSeal-injected? How does
DocuSeal render/paginate the multi-page doc, and where do signature/date tags anchor relative to
pages? Do NOT assume the paged-media model is what's in place — verify against the live system
(dist/templates/LOE-template*.html, docuseal-webhook, LOE-DOCUSEAL-ARCHITECTURE.md, prior LOE
checkpoints). The page-and-footer-per-page structure of the V07 PDF must be preserved — that's a
hard requirement, and how we keep it depends on what the current system actually does.

## Phase 1 — Design on Paper (Ben + co-architect + ui-designer)
**Canvas:** https://app.paper.design/file/01KM85Z8ET0BX23R3XH3H75YGN/2-0 (the standing Valta Paper board — same canvas the graphic-paper workflow uses). NOTE: LOE = multi-page flowing text contract, NOT the single-page graphic-recreation pipeline — design the look (letterhead, type, section styling, page frame + auto @page footer) → export to HTML. Do NOT run the 01→08 box-fit chain.
- Lay out LOE-07's structure on the Paper canvas: 16 sections + Schedule A (conditional) +
  Appendix A (24 limiting conditions). Letterhead, typography, section styling.
- Reference: LOE-07-INTAKE-2026-06-03.md (full structure + placeholder list).
- Export the canvas to an editable HTML template (the deliverable shell).

## VERSIONING (hard requirement — Ben, 2026-06-03)
LOE-07 is added as a NEW VERSION — do NOT override or delete the current live template.
- New template registered ALONGSIDE the existing (the gen path is version-keyed: generateLOE.ts → vXTemplate; add `v7Template` / LOE-template-v07.html, keep v3/v5 + LOE-template.html intact).
- Provide a VERSION SELECTOR so a job can choose which LOE version to use (default = newest, but old versions stay selectable + reproducible). Know-how-to-choose is part of the deliverable.
- Rationale: keep history; never lose a contract version a prior job was generated against.

## Phase 2 — Wire fields + signing (agent, in code, AFTER export)
- Map every placeholder to its APR-job source (coverage table already in the intake doc).
- Add the gap fields LOE-07 needs that aren't in the registry yet: PreviouslyAppraised,
  ProposedUseImprovements, ApproachesToValue (cascade), ValueTimeframe; confirm CurrentUse,
  DeliveryTime-as-weeks, EA4/EA5. EA/HC summaries = narrative Text Library, not dropdowns.
- DocuSeal: signature/date tags + the conditional Schedule A (insert only when
  AssignmentType = Multiple Properties).
- Payment terms: due on receipt, delinquent after 5 days.

## Phase 3 — Verify
- Render the wired template against the pinned test job; screenshot, read it, confirm every
  placeholder resolved from job data (no blanks, no hand-typed values). Surface in Ben's viewer.

## Done =
LOE-07 is the live template, every placeholder job-sourced, DocuSeal tags + Schedule A working,
verified on the test job with a read screenshot.

## Dependency note
Phase 2 gap fields overlap PRD-A's field work — add them in the same job-prep area so they sync.

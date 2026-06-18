---
title: "Insight — the dashboard should surface OUTPUTS, hide the cascade inputs"
status: insight / direction (captured 2026-06-18; not a build spec)
created: 2026-06-18
owner: Ben (insight) · qa-agent (captured)
description: "The client's ClickUp fields are our cascade outputs — proof that appraisers value the outputs + their narrative text, not the convoluted input pickers. Direction: foreground outputs, tuck the cascade machinery away."
tags: [apr-workflow, dashboard, cascade, outputs, ux-direction, appraiser-value, insight]
cognee_ingest: skip
gemini_ingest: skip
gemini_store: ""
---

# Insight — surface the outputs, hide the cascade inputs

**Tags:** #apr-workflow #dashboard #cascade #outputs #ux-direction #insight
**Backlink:** [LOE Flow Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/LOE-FLOW-ARCHITECTURE.md)
**Related:** [Cascade Logic — Spec & Wiring](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CASCADE-LOGIC-SPEC-AND-WIRING.md) · [Valta field options](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/FIELD-OPTIONS-valta-template-v2.md)

> Captured live from Ben (2026-06-18) while reading the client's ClickUp fields. A direction, not a build.

---

## The trigger

The client's ClickUp drop-downs — **Value Scenarios, Approaches To Value, Interest Appraised, Status of Improvements** — are **the exact OUTPUTS of our cascade engine.** The appraisers chose to surface the *outputs* on their job card, not the inputs that derive them.

## What it tells us

- **Appraisers value the OUTPUT, not the input mechanics.** The cascade inputs (Property Type · Subtype · Tenancy · Status of Improvements · Authorized Use) exist only to *produce* an output. The output (the value scenarios, the approaches) + the **narrative text** it pulls into the document is the real product.
- Our dashboard currently exposes a lot of **convoluted, crisscrossing input pickers** — the "this matches this produces this" machinery. To an appraiser that's noise; the **outputs + their editable text** are the signal.

## The direction

1. **Foreground the outputs** — the derived Value Scenarios / Approaches / Interest Appraised, named exactly as appraisers know them (the same names the client uses in ClickUp).
2. **Show the editable output text** — the summary/narrative paragraphs the outputs select for the document. Chris explicitly wants to *see and edit* this text — and our system already generates + lets you edit it (the genuinely valuable part; keep it front).
3. **Tuck the cascade input machinery away** — keep the picker (it's how outputs get produced) but hide/collapse it behind the output surface. It's plumbing, not the value view.

## Status

- **Insight captured.** Not scoped. A dashboard-simplification direction to weigh when the cascade UI gets revisited — aligns our dashboard with how appraisers (and the client's ClickUp) actually think: output-first.

---

**Last reviewed:** 2026-06-18 by qa-agent — captured from Ben; pairs with the Valta field-options reference (their fields = our cascade outputs).

---
title: "APR Systems Flow Diagram — Plan, Standard & Resume Point"
status: active
created: 2026-06-19
updated: 2026-06-19
last_reviewed: 2026-06-19
description: "The working plan for building a detailed, accurate systems flow diagram of the whole APR workflow — the diagram standard we settled on, the explain-first method, the code-traced ground truth to draw from, and where to pick up next."
tags: [apr-workflow, systems-flow-diagram, data-flow, information-design, tldraw, component-studio, explainer, resume-point]
entities: [[APR Dashboard]] [[Component Studio]] [[DocuSeal]] [[tldraw]] [[Nano]]
related:
  - ~/Development/APR-Dashboard-v3/docs/APR-DATA-FLOW-GROUND-TRUTH-2026-06-18.md
  - ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/LOE-FLOW-ARCHITECTURE.md
  - ~/Development/info-diagram-standard/REFERENCE-good-information-diagrams.md
cognee_ingest: pending
gemini_ingest: pending
gemini_store: "apr-features"
---

# APR Systems Flow Diagram — Plan, Standard & Resume Point

**Tags:** #apr-workflow #systems-flow-diagram #data-flow #information-design #tldraw #component-studio #explainer #resume-point
**Entities:** [[APR Dashboard]] [[Component Studio]] [[DocuSeal]] [[tldraw]] [[Nano]]
**Backlink:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) · [APR System Status](~/Development/APR-Dashboard-v3/docs/00-APR-SYSTEM-STATUS.md)

> **What this doc is.** The single resume point for the effort to build a **detailed, accurate
> systems flow diagram of the entire APR workflow.** It captures the goal, the diagram standard
> we agreed on, the explain-first method, the code-traced ground truth to draw from, the pieces
> the diagram must include, and the open next steps — so we can pick this up cold later.

---

## On this page
- [The goal](#the-goal)
- [The method we settled on](#the-method-we-settled-on)
- [The diagram standard](#the-diagram-standard)
- [What the diagram must show](#what-the-diagram-must-show)
- [The ground truth to draw from](#the-ground-truth-to-draw-from)
- [Rendering options](#rendering-options)
- [Next steps](#next-steps)
- [Open questions](#open-questions)

---

## The goal

Build a **detailed systems flow diagram** of the APR appraisal workflow — accurate enough to
explain the system to anyone and to spot where it breaks or goes stale. The diagram is the
*output*; the real work is understanding and explaining the flow correctly first. Images/drawings
come only once the content is rich enough to earn them.

---

## The method we settled on

**Comprehension → text → drawn → enriched.** Locked 2026-06-18. Most diagrams should stop at text.

- **Ground it in the code, never from memory.** This was proven the hard way — a from-memory pass
  wrongly claimed the intake form "auto-creates the Valcre job + ClickUp card." Tracing the actual
  code showed those are **manual buttons**. Comprehension is the deliverable; getting it quietly
  wrong is the only real failure.
- **Explain it as a text diagram first** — one question at the top, typed nodes, labeled edges,
  failure points flagged, honest build-state (wired vs planned). Fast, and easy to correct in
  conversation.
- **Escalate only when the content earns it** — a tldraw board for keepers; generated imagery last.

> Full doctrine + the good-vs-weak examples: [Reference — what makes a high-value information diagram](~/Development/info-diagram-standard/REFERENCE-good-information-diagrams.md).

---

## The diagram standard

A diagram earns its place only if it answers **one specific question** and makes the answer's
*structure* visible at a glance. The short rules:

- **Inventory vs. insight** — show the one relationship that drives a decision, not a list of parts.
- **Position must mean something** — flow left-to-right, state as a cycle, hierarchy top-down.
- **Encode by type, not decoration** — datastore vs. edge function vs. external service, with a legend.
- **Put the "why" on the arrows** — "after signing", "manual button", "anon write — RLS".
- **One altitude per diagram** — system-level OR code-level, never mixed.

:::details{.boxed summary="The diagram types that deliver (and the one that doesn't)"}

| Type | Answers | Value |
|---|---|---|
| Data-flow / lineage | where data starts, transforms, lands | ★★★ |
| Sequence / timeline | order of events across actors | ★★★ |
| State machine | what states a thing can be in + transitions | ★★★ |
| Boundary / context map | inside our system vs external service | ★★ |
| Trigger / automation map | what event fires what | ★★ |
| Import / dependency graph | what file imports what | ★ (rarely drives a decision) |

The import graph is the easiest to auto-generate and the least useful — default *away* from it.
:::

---

## What the diagram must show

The APR system has **two layers** that belong on the diagram together:

### 1. The runtime flow (what actually happens to a job)
The honest spine: **form → database only**, then a **human-driven dashboard sequence**, then a
**signature-triggered fan-out**.

- **Intake** — the form writes only to the database (job record + property-info + files). No external calls.
- **Becomes a job** — the dashboard list reads submission rows; a job *is* a submission row.
- **Section 1 (Client Info)** → **Section 2 (LOE Quote + cascade)** — fields fill, the cascade derives Value Scenarios / Approaches / Property Rights (Insurance overrides).
- **Create Valcre Job** — **manual button**, gated on required fields; writes the VAL number back.
- **Create ClickUp Task** — **manual button, hard-gated** on a Valcre job existing first.
- **Field sync** — edits auto-save to the database, then push to ClickUp + Valcre once a real Valcre job exists (every Valcre write readback-verified).
- **LOE → DocuSeal → email** — newest active template renders the LOE; sent via the proxy; the **one** email we own carries the signing link.
- **The signature is the trigger** — DocuSeal's "signed" webhook fans out: status → signed, signed PDF stored + mirrored to SharePoint, ClickUp stamped, QuickBooks invoice fired.
- **Payment email is NOT ours** — our app only *triggers* QuickBooks; QuickBooks emails the invoice + secure pay button from the client's own account.

### 2. The authoring layer (Component Studio)
Where the Document, Email, and Popup used by the runtime get **defined** — so it sits *before* the
live send on the diagram, feeding the three components into the runtime sequence.

:::details{summary="Component Studio — the authoring hub (full feature note)"}

[Component Studio](~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/actions/ComponentStudio.tsx) ("VALTA Component Studio · LOE Sequence Builder") unifies the three things a client receives:

- **Three component types**, each with a saved-instance library: **Document** (the LOE), **Email** (carries the signing link), **Popup** (post-sign thank-you — the newest, third type).
- **Three views:** *Map* (the client's experience left-to-right: Email → Document → Popup with "delivers" / "after signing" connectors), *Library rail* (browse every saved instance), and the *split work area* (render-left, inline editor-right, draggable, zoomable).
- **Behaviors:** open a sequence block → the map collapses to a left "spine"; open a library item → the rail stays. Inline editing for all three (merge-field palette for email/popup; document edits save a tailored draft). Self-healing popup (seeds the default Thank-You if empty); "+ New popup / + New email" from a seed.
- **Discipline (INV-0):** it's a **shell that reuses** the proven render + edit paths — no new render engine; deep edits delegate to the existing modal editors.
- **Heading toward:** instances carry IDs; sequences are built by placing instances by ID; library shows *what exists*, the sequence shows *where it's used*, cross-linked. Eventually cards reflect live state. See [Vision — Workflow Sequence Builder](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/VISION-workflow-sequence-builder.md).
:::

---

## The ground truth to draw from

The diagram should be built from these code-verified sources, not from any older narrative:

- [APR Data-Flow Ground Truth](~/Development/APR-Dashboard-v3/docs/APR-DATA-FLOW-GROUND-TRUTH-2026-06-18.md) — the full code-traced, stage-by-stage flow (every field/column/file cited). **Where this disagrees with the Master Dashboard, this is correct.**
- [LOE Flow Architecture — Send · Sign · Trigger Map](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/LOE-FLOW-ARCHITECTURE.md) — the current send + sign-back trigger map (the signature is the trigger; payment email is QuickBooks').
- [APR System Status](~/Development/APR-Dashboard-v3/docs/00-APR-SYSTEM-STATUS.md) — leg-by-leg done/open status.

:::details{.boxed summary="⚠️ Known gaps the trace exposed (must be visible on the diagram)"}
- Contracts never flip to "sent" — the function that would do it is dead code.
- QuickBooks "paid → receipt" isn't wired, and no invoice→job mapping is stored.
- DocuSeal submissions carry no job-id in metadata — webhook matches only by a stored id.
- The sent-webhook returns success on "job not found" — a silent miss, no retry.
- Email goes from a sandbox sender; the real Microsoft mail path is built but switched off.
:::

> **Note:** the older [Features Overview](~/Development/APR-Dashboard-v3/docs/Features/00-FEATURES-OVERVIEW.md) is a stale F01–F26 planning doc — not a reliable flow source. The `docs/-uxui/` feature-commit doc named in the project [CLAUDE.md](~/Development/APR-Dashboard-v3/CLAUDE.md) is currently empty.

---

## Rendering options

Three real paths, not either/or — picked by the moment:

- **Visual canvas (tldraw)** — the target renderer; renders live in KM-Exp, draggable, editable. The full tldraw CLI toolkit already exists.
- **Diagrams-as-code (Mermaid)** — quick doc sketches, version-controlled (the LOE flow doc already carries a Mermaid block).
- **Generated images as nodes (Nano + tldraw)** — the far ceiling: rich component images as nodes, tldraw owns every label + connector. Proven once; reserved for when the value is high enough.

---

## Next steps

- [ ] Draw the **runtime flow** as the first real diagram — data-flow + the signature-trigger fan-out, with the manual buttons and the known gaps labeled.
- [ ] Add the **Component Studio authoring layer** as the node that feeds the three components into the runtime sequence.
- [ ] Decide the first medium (lean: text diagram already drafted → tldraw board for the keeper).
- [ ] Keep the diagram synced to the ground-truth doc as the build advances.

---

## Open questions
- **One diagram or two?** A single board mixing authoring + runtime, or a runtime data-flow diagram with the authoring layer as a linked second view (cleaner "one altitude per diagram").
- **How live should it be?** Static keeper now vs. the vision's "cards reflect current state" later.
- **Home for the diagram standard** — [the reference](~/Development/info-diagram-standard/REFERENCE-good-information-diagrams.md) currently lives outside the APR repo; move it in, or keep it cross-project.

---

**Last reviewed:** 2026-06-19 by ui-designer — created as the resume point for the systems-flow-diagram effort; grounded in the code-traced data-flow doc, the LOE flow architecture, and the Component Studio review.

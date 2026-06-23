---
title: "QA Orientation — Asset Studio (code name: Component Studio)"
id: QA-ORIENT-asset-studio
type: qa-orientation
created: 2026-06-21
author: qa-agent (dev-2)
status: orientation complete — questions flagged for Ben/ui-designer
tags: [apr, loe-esign, component-studio, asset-studio, qa-orientation, sequence-builder]
---

**Tags:** #apr #loe-esign #asset-studio #component-studio #qa-orientation
**Design source of truth:** [SPEC-component-studio.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/SPEC-component-studio.md) · [HANDOFF](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/COMPONENT-STUDIO-STATUS-HANDOFF.md) · [VISION](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/VISION-workflow-sequence-builder.md) · [mockup](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/mockups/component-studio.html)

---

# QA Orientation — Asset Studio

> **Name note:** "Asset Studio" is the evolving/friendly name. In code + specs today it is **Component Studio**. No literal "Asset Studio" string exists in the codebase yet — same feature, broader framing (it's growing a 4th asset type, Email Signatures).

## What it is (one breath)

The dashboard's old Document/Email **Previewer** is becoming the **Asset/Component Studio**: a single surface that does three jobs the previewer never could — (1) a **library** of three managed asset types (**Document · Email · Popup**), each with saved instances; (2) a **sequence map** showing how they bolt into the flow the client experiences (**Email → Document → Popup**, connectors "delivers" / "after signing"); (3) a **split preview/editor** (render LEFT, inline WYSIWYG editor RIGHT, render-dominant ¾:¼, expand + drag + zoom).

## The load-bearing principle (INV-0 — the thesis)

**It is an outer SHELL, not a reimplementation.** Document render/download/zoom/edit stay the EXACT existing machinery (`generateLOEHTML` + Paged.js + `LOEPreviewModal` / `TemplateEditorModal` + `job_contracts`); Email stays `EmailComposeModal` + `emailTemplate.ts`; Popup stays `PopupComposeModal` + `popup_templates`. The Studio only *arranges and wraps* proven surfaces. Zero regression to the document previewer is Ben's explicit ask.

## How it works (code)

| File | Role |
|---|---|
| `src/components/dashboard/job-details/actions/ComponentStudio.tsx` (~497 ln) | the Studio shell — library rail + sequence map + sequence spine + split + inline editors |
| `DocumentPreviewPane.tsx` | **shared** doc render pane (scaled iframe + zoom) — extracted VERBATIM from `LOEPreviewModal` (the INV-0 reuse seam) |
| `src/utils/loe/downloadPagedPdf.ts` | **shared** paged-PDF download — extracted verbatim |
| `LoeQuoteSection.tsx` (line ~1591/2454) | mounts the Studio **additively behind a "Component Studio" button** + wires onEdit |

- Types: `CompType = doc|mail|popup`; `View = map|seq|lib`. Fixed `ORDER = [mail, doc, popup]`.
- Save paths reuse existing ones: doc→`saveJobContract`, email→`saveEmailTemplate`, popup→`savePopupTemplate`. No new save/render engine.
- Popup **self-seeds** (`loadActivePopupTemplate`) so it always shows; `+ New popup` / `+ New email`.
- Two entry paths (INV-3): **library-click** → rail stays, component opens right (no spine); **sequence-block-click** → rail collapses to icons, the **spine** takes the left.

## Current state (verified by reading code + SS12)

- **BUILT + LIVE, additive, behind the button** — the shell, both entry paths, the split (render-left/editor-right, expand/drag/zoom), inline editors for all three types, popup self-seed, dark-mode fixes. All committed; co-arch owns the `vercel --prod` deploy.
- **HELD pending Ben's click-test** (proof-first): (1) replacing the live Previewer entry point; (2) INV-6 flipping the standalone doc editor to render-left/editor-right.
- **MOCKUP-AHEAD, not yet built** (needs Ben review → co-arch spec extension → build): the **left slide-out IA** on the job dashboard (Studio as an overlay with a "Dashboard" back button; LOE section keeps only "Create Document/Email" jumping straight to the doc view); a **reusable email-PAGE shell** (subject/from/body, Gmail reading-pane proportions); and **Email Signatures as their own asset type** (4th type — currently the signature is BAKED INTO `EMAIL_SEED_BODY`; proposal separates it, composed at preview/send).

## Invariants I'll gate against (INV-0..7)

INV-0 zero-regression doc previewer (THESIS, verify first) · INV-1 email = existing `EmailComposeModal` · INV-2 popup = shipped `PopupComposeModal`/`popup_templates`, still drives `SigningPage` · INV-3 entry-path sets left context · INV-4 split render-left/editor-right, render-dominant, inline WYSIWYG (no raw-HTML box) · INV-5 browsing never silently mutates a sequence · INV-6 standalone doc editor adopts render-left/editor-right · INV-7 every asset floats on a viewer (doc = paper page, email/popup = monitor/screen).

## ⚠ QA verification model for this feature (INVERTS my usual gate)

The SPEC's hard rule: **agents verify CODE / DB ONLY** — reuse imports (INV-0/1/2), entry-path routing, split ratio/grabber/zoom wiring, no-mutation logic, `tsc --noEmit` clean, drift-gate green. **NO `/agent-screenshot`, NO app-walk, NO visual self-verify.** **Ben click-tests everything visual.** (This is Ben's explicit rule for the net-new-visual Studio — note it cuts against my normal "screenshot-or-it-didn't-happen" discipline, by design.)

## Open questions (flagged for Ben / ui-designer)

1. **Name + 4th type:** is **"Asset Studio"** the locked new name, and does it now formally include **Email Signatures** as a first-class asset type? The current SPEC/INVs only cover 3 types — the signature-asset + email-page-shell are mockup-ahead and need a **co-arch spec extension** before build. Is that extension authored yet, or still pending?
2. **Ben's click-test verdict:** has Ben click-tested the additive Studio yet? That gate unblocks the two HELD live-surface waves (replace Previewer entry; INV-6 doc-editor flip).
3. **Slide-out IA relocation:** is moving the Studio from the LOE-section button to a **left slide-out on the job dashboard** in scope for the next wave, and gated behind the same click-test?
4. **Sequences-as-library:** the code shows a FIXED `ORDER = [mail, doc, popup]` with no saved-sequence CRUD. Is the "Default LOE Deployment" / "Rush LOE" sequence library (a persisted data model) actually built yet, or is the sequence map currently a fixed diagram only? (The reuse map calls sequences a "NEW thin layer" — reads as not-yet-built.)
5. **Verification-model confirm:** confirm the CODE/DB-only, no-screenshots gate still holds for the next wave — so I gate by INV PROVED-BY clauses, not pixels, and route visual sign-off to Ben.

---

*Authored 2026-06-21 by qa-agent (dev-2) — familiarization + QA gate-prep for the Asset/Component Studio. Design ownership is ui-designer (dev-3); deploy is co-arch (dev-1); visual sign-off is Ben.*

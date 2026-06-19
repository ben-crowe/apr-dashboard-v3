---
title: "Build Spec — Component Studio (Document · Email · Popup library + sequence map) replacing the Previewer"
id: SPEC-APR-LOE-component-studio
type: build-spec
status: DRAFT — for co-architect review + qa-agent /review-gate, then → ui-designer (dev-3) build
created: 2026-06-18
authored: ui-designer (dev-3) — design owner; reviewed live with Ben across an iterative mockup
routes_to: ui-designer (dev-3) build, after gate
source: docs/Features/12-LOE-Esign/eSign-Workflow/mockups/component-studio.html (the reviewed, signed-off interactive mockup)
tags: [apr, loe-esign, component-studio, sequence-builder, previewer, document, email, popup, net-new-visual, no-regression]
---

**Tags:** #apr #loe-esign #component-studio #sequence-builder #previewer #no-regression
**Entities:** [[Component Studio]] [[SigningPage]] [[LOEPreviewModal]] [[EmailComposeModal]] [[PopupComposeModal]]
**Reviewed mockup (visual source of truth):** [component-studio.html](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/mockups/component-studio.html)
**Builds on:** [SPEC — Popup Editor](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/SPEC-popup-editor.md) · [Vision — Workflow Sequence Builder](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/VISION-workflow-sequence-builder.md)

---

# Build Spec — Component Studio

> **North star.** The dashboard's Document/Email Previewer becomes the **Component Studio** — a single surface that does three jobs the current previewer was never built for: (1) a **component library** of the three managed types (Document · Email · Popup), each with its saved instances; (2) a **sequence map** showing how chosen components bolt together into the flow the client actually experiences (Email → Document → Popup); (3) a **split-panel previewer/editor** for working any one component. Sequences themselves become a library (e.g. the "Default LOE Deployment" sequence). This was designed iteratively with Ben against the reviewed mockup above — that mockup is the visual source of truth.

> **⛔ THE SHELL PRINCIPLE — read before anything.** The Studio is an **outer shell**, NOT a reimplementation. The document render, the paged-PDF download, the zoom, and the template editor **remain the exact existing `LOEPreviewModal` / `TemplateEditorModal` machinery** (`generateLOEHTML`, the Paged.js polyfill, the 7-page render). The email render/edit **remains the existing `EmailComposeModal`** WYSIWYG. The Studio *arranges and wraps* these proven surfaces into the new library + sequence + split layout. **It must not rebuild, simplify, or downgrade them.** The mockup's renders are placeholders standing in for these real components. (INV-0.)

---

## Scope

1. **Component Studio shell** — replaces the current Previewer entry surface. Left rail = Sequences library + Component Library (Documents · Emails · Popups, each listing saved instances). Center = the sequence map by default; a split previewer/editor when a component is open.
2. **Sequence map** — the active sequence rendered as blocks (NOT full renders): Email → Document → Popup, with the runtime connectors ("delivers", "after signing"). Blocks are diagram cards; opening one drills into the real previewer.
3. **Two entry paths (the interaction rule Ben locked):**
   - **From a sequence block** → the library rail collapses to an icon strip and the **sequence spine** takes the left; the component opens on the right.
   - **From the component library** → the **library rail stays** exactly as-is; the component opens standalone on the right. The rail morphing into the spine is triggered *only* by sequence-block entry.
4. **Split previewer/editor (right side of either path):** **render on the LEFT, editor on the RIGHT.** Opens render-dominant (~¾ render / ¼ editor — editor is a hint, not in your face). A chevron beside the "Editor" header expands to half-and-half; a draggable grabber sizes it freely. A compact **zoom** control on the render (mirrors today's previewer). The editor is **rendered/WYSIWYG with merge-field chips — never a raw-HTML box.**
5. **Sequences are a library** — the "Default LOE Deployment" sequence (approved default Document + its default Email + the active Popup) is one saved sequence; others (e.g. "Rush LOE") can exist. Swapping which component fills a slot is an explicit act, never a side effect of browsing.
6. **Align the LOE document editor convention** — flip the existing document editor to the same **render-left / editor-right** orientation so the whole app is one consistent convention.

## Out of scope (fenced)

- Drag-to-reorder of sequence blocks (design intent noted — fixed order + explicit swap for v1; manual-order, no numeric-prefix sorting).
- Multiple sequences firing / sequence-level automation beyond the single default flow.
- Any change to the live send paths, DocuSeal webhook, Valcre/ClickUp wiring, or the report builder.
- Editing components from the signing page (editing is dashboard/Studio only — unchanged).

---

## Invariants (INV) — the gate runs each PROVED-BY verbatim

**INV-0 (THESIS — verify FIRST) — ZERO REGRESSION to the document previewer/editor. The Studio reuses it; it does not replace it.**
  - FAIL-WHEN: the document render in the Studio is anything other than the existing `LOEPreviewModal` render path (`generateLOEHTML` + the template's real HTML); OR the Paged.js paged-PDF **Download** is missing/changed; OR the document **zoom** is missing; OR the template **edit** path is a new/simpler editor instead of the existing `TemplateEditorModal`/`job_contracts` save.
  - PROVED-BY (code/DB — agents verify): the Studio's Document path **imports and calls the existing `LOEPreviewModal` / `generateLOEHTML` / Paged.js render** — NOT a new render engine (grep confirms no reimplemented render); the **Download** handler is the existing paged-PDF path; zoom is the existing control; edit saves a `job_contracts` instance via the existing `TemplateEditorModal` path. No new/parallel render or save code for documents.
  - PROVED-BY (visual — BEN, not an agent): Ben click-tests old Previewer vs Studio-Document on the live site and confirms no visual or functional loss (paged render, footer, Download, zoom). ⛔ NO agent screenshots / app-walk for this — the visual side-by-side is Ben's click-test.

**INV-1 — Email reuses the existing WYSIWYG editor, not a new one.**
  - FAIL-WHEN: the email render/edit in the Studio is a reimplementation rather than the existing `EmailComposeModal` rendered editor (designMode/iframe), losing merge-token insertion, set-default, save-as-version, or reset-to-seed.
  - PROVED-BY: open the Email component → it is the `EmailComposeModal` surface (rendered, tokens as locked chips), and Set-Default / Save-as-version / Reset behave exactly as today.

**INV-2 — Popup is the third component, reusing the just-built popup editor.**
  - FAIL-WHEN: the Popup component is not the `PopupComposeModal` + `popup_templates` CRUD already shipped (SPEC-popup-editor), or the active popup no longer drives `SigningPage`.
  - PROVED-BY: open the Popup component → it is `PopupComposeModal`; the active popup still renders on the signed page (popup-editor INVs still pass).

**INV-3 — Entry path sets the left context, per the locked rule.**
  - FAIL-WHEN: clicking a **library** item changes the rail into the sequence spine; OR clicking a **sequence block** does NOT bring up the spine.
  - PROVED-BY: click a library document → the full library rail stays, component opens on the right, no spine. Click the Document block in the map → rail collapses to icons, the spine shows, component opens on the right.

**INV-4 — The split is render-LEFT / editor-RIGHT, render-dominant by default, with expand + drag + zoom.**
  - FAIL-WHEN: the editor is on the left or the render on the right; OR it opens 50/50 by default instead of render-dominant; OR there is no expand control beside "Editor"; OR the grabber can't resize; OR the render has no zoom; OR the editor is a raw-HTML textarea.
  - PROVED-BY: open any component → render is left, editor right at ~¾:¼; the "Expand" control beside Editor toggles to ~50/50; dragging the grabber resizes; the render zoom in/out/reset works; the editor shows the rendered content with tokens as chips (no raw HTML).

**INV-5 — Browsing/editing a component never silently mutates a sequence.**
  - FAIL-WHEN: opening or editing a non-slotted component (e.g. "Commercial LOE") changes which component the active sequence uses, with no explicit swap action.
  - PROVED-BY: open "Commercial LOE" from the library, edit + save → the Default sequence still references "Standard LOE"; changing the slot requires an explicit "swap into slot" action.

**INV-6 — The LOE document editor adopts render-left / editor-right (app-wide consistency).**
  - FAIL-WHEN: after this build the standalone document editor still shows editor-left / preview-right, diverging from the Studio.
  - PROVED-BY: open the document editor → render is on the left, editor on the right, matching the Studio.

**INV-7 — Every asset renders as a floating page/screen on the viewer — the document previewer's look is the standard. Paper for documents, monitor/screen for email + popup.**
  - FAIL-WHEN: an asset renders flat/inline instead of floating on a viewer backdrop; OR the document loses its existing floating-paper-page look (covered by INV-0); OR the email/popup are NOT presented as an on-screen/monitor view (they're screen content, not paper, so they must read like you're looking at them on a monitor).
  - PROVED-BY: documents render as floating letter pages on the viewer backdrop, unchanged from today; the email and the popup render as a framed **screen/monitor view** floating on that same backdrop, so their real-world on-screen layout is judgeable. Distinction: a document is paper (page); an email and a popup are screen content (monitor). The current LOEPreviewModal floating-page-on-viewer aesthetic is the reference all three share.

---

## Build approach (reuse map — what wraps what)

| Studio surface | REUSES (do not rebuild) |
|---|---|
| Document component (render/edit/download/zoom) | `LOEPreviewModal` + `TemplateEditorModal` + `generateLOEHTML` + Paged.js + `job_contracts` |
| Email component | `EmailComposeModal` + `emailTemplate.ts` |
| Popup component | `PopupComposeModal` + `popupTemplate.ts` + `popup_templates` (shipped) |
| Saved instances per type | `loe_templates` / `email_templates` / `popup_templates` |
| Sequence (which component fills each slot) | NEW thin layer — references existing component ids; no new render engines |

The Studio shell itself is the net-new code: the library rail, the sequence map, the split-panel framing (ratio/grabber/zoom), and the entry-path routing. Everything inside the panels is an existing component.

## Skills + verification model (net-new visual)

The Studio shell is **net-new visual**, so the build MUST **load AND apply** ui-designer's design cascade: `/impeccable` (entry — shape → ia-wireframe → wireframe-layout → craft → human-centered-product-sense, Rejection Filter, no stage-skips) + `/ui-ux-pro-max` + `/interface-design` + `/visual-alignment` + `/human-centered-product-sense`, built against the signed-off mockup as the visual source of truth.

**Verification model:** agents verify **CODE / DB only** — the reuse imports (INV-0/1/2), entry-path routing, split ratios/grabber/zoom wiring, no-mutation logic, `tsc` clean, drift green. ⛔ **NO `/agent-screenshot`, NO app-walk, NO visual self-verify** (Ben's hard rule). **Ben click-tests the live Studio** for everything visual.

## Dispatch Plan (visible for the gate)

- **Vehicle:** ui-designer **dev-3** (she authored this from the mockup AND builds it) — tmux peer, NOT a fork. Co-arch reply-to = **dev-1**.
- **Step 0 on build:** `load-persona-skills.sh ui-designer` + load-and-apply the cascade above + `/tmux-comms` + Read APR `CLAUDE.md` (🚫 NO-LOGIN, port 8086) + `/search-2phase` scoped "Component Studio LOEPreviewModal TemplateEditorModal generateLOEHTML Paged.js EmailComposeModal PopupComposeModal sequence map split editor".
- **Build order:** INV-0 FIRST (prove the document reuse / no-regression before building the shell around it), then INV-1..6.
- **Comms contract (MANDATORY — QA gate checks):** when done OR with ANY question, dev-3 **messages dev-1 directly, pushed via `/tmux-comms`** (text → then `C-m` as a separate write, never left unsent); do NOT assume co-arch reads her pane. Co-arch verifies code/DB + relays to qa-agent (dev-2) to gate the result.
- **Terminal-open contingency:** check `tmux has-session -t dev-3`; if alive → send via the two-write push; if not → spawn (`~/.claude/scripts/spawn-session.sh dev-3`) or surface to Ben to open the pane, then deploy. Never silently fail the handoff.

## Pass/fail gates

- INV-0 verified FIRST and explicitly (no-regression is the thesis) — code reuse proven by agents, visual confirmed by Ben's click-test.
- Each INV proven by its PROVED-BY.
- `tsc --noEmit` clean + drift-gate green (V3 / report-builder untouched).
- Ben click-tests the live Studio; the document previewer is visibly unchanged in quality.

---

*Authored 2026-06-18 by ui-designer (dev-3) from the reviewed mockup, for co-architect review + qa-agent `/review-gate`. The no-regression of the existing document previewer (INV-0) is the load-bearing requirement — Ben's explicit ask.*

---
title: "Vision — Workflow Sequence Builder (the previewer as a visual sequence hub)"
status: vision / scope-capture (not built)
created: 2026-06-18
owner: Ben (vision) · qa-agent (captured)
description: "A read-only, current-state visual view of the whole post-sign workflow — each step (email, popup, task, status, notify) shown as an HTML card in sequence, so nobody has to wonder what actually happens or discover a stale step too late."
tags: [apr-workflow, loe, sequence-builder, previewer, workflow-visual, clickup, vision, scope-capture]
cognee_ingest: skip
gemini_ingest: skip
gemini_store: ""
---

# Vision — Workflow Sequence Builder

**Tags:** #apr-workflow #loe #sequence-builder #previewer #workflow-visual #vision
**Entities:** [[Previewer]] [[ClickUp]] [[Paper.design]] [[LOE]]
**Backlink:** [LOE Flow Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/LOE-FLOW-ARCHITECTURE.md)

> **This is a vision / scope-capture, not a build spec.** Captured live as Ben described it (2026-06-18) so it isn't lost. We turn it into a real PRD when it's time.

---

## The idea in one line

The APR dashboard gains a **read-only visual view of the entire follow-up sequence** — a chain of HTML cards, one per step, each showing the *current standard* for that step (the doc, the email, the popup, the task, the notify email). Nobody has to wonder "what actually happens here?" or discover too late that a step went stale.

## Why it matters (the pain it kills)

Multi-step automations are the hardest thing to remember and the easiest to let rot. A thank-you popup or a notify email gets wired once, then months later nobody knows what it says, whether it's stale, or what connects to what. **This makes every step a visible card at current state** — the connections are shown, not guessed, and a stale message can't hide. You see it, go "oh — we need to change that," then it gets fixed at the source (ClickUp / the template) and the card is updated to match.

## The sequence (a read-only view of what happens, step by step)

Building on the [LOE Flow Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/LOE-FLOW-ARCHITECTURE.md), the chain shows as a visual sequence:

```text
[ 1. Document / Contract (LOE) ]     ← the standard document that gets created
            │
[ 2. Client email + signing link ]   ← the standard email that goes out, carrying the link
            │
[ 3. Thank-you popup to client ]      ← what the client sees after signing
            │
[ 4. Dashboard status change ]        ← the job flips to "client signed"
            │
[ 5. ClickUp task (current fields) ]  ← the current task card (see below); link to the real task
            │
[ 6. Team notify email ]              ← the internal heads-up to Chris's team (clientcare@valta.ca)
```

- **It's a VIEW, not an editor.** Each card just *shows* the current standard for that step — not interactive, nothing to click-and-edit (at least to start). It isn't claiming "this exact email instance" — it's "here's the standard email that goes out at this step."
- **Current state, best-effort.** We render today's real version (the current ClickUp fields, the current default email) — never an outdated mock. When something changes, it changes at the source AND the card is refreshed to match, so the view always reflects current state.

## The ClickUp-task block — a visual module, not buried fields

The hardest thing to picture is a multi-field ClickUp task. So that block **shows a visual card of the task** — an HTML representation of the current fields (title, status, tags, the lines it writes).

- It is **not** a literal HTML→ClickUp mapping, and it's **not editable in the panel**. It's a **communication tool**: it shows the current task at a glance, and when you realize a field is wrong or missing, that change gets made at the source (ClickUp) and the card refreshed to match — an agent does the wiring.
- **Ben already built this task card in Paper.design (our HTML design app) — it's already FULL HTML, extractable anytime** (reference render: `~/Development/KM-Exp/data/tasks/content/task_5g001372/attachments/Clickup-Task-HTML.png`). Clean, scannable: job header + LOE Sent/Signed status + every custom field grouped (Client / Property / Report / Environment / Financial / Status) + Remove/Add sections. Because it's real HTML already, it just needs an inline previewer + a link out to the matching real ClickUp task — no rebuild.
- Removes the "I can't tell what the task actually looks like from inside the APR dashboard" problem.

## ⭐ The unlock — every module is an HTML card (already proven)

The ClickUp-task HTML above is the **template for the whole thing.** The hardest module — a clear view of a messy multi-field record — is already built and proven. So the rest is just: **render each sequence step as an HTML card in that same style** (client email, thank-you popup, notify email, status block), and **the stack of those cards IS the visual workflow dashboard.** No new invention — repeat the pattern. Each card shows exactly what that step currently is and links out to the live thing it represents.

## What's reusable that we already have

- The **Paper.design HTML cards** already exist (the ClickUp-task one is built) — the UI designer authors the rest the same way.
- The app already renders content in panels — showing static HTML cards in sequence is a **display-only** add, no editor needed.

## Asset register — captured parts (PNG + Paper canvas)

Each stage we capture gets logged here: a local PNG (in `assets/`) **and** a link to where it already lives on the Paper.design canvas — so an agent or person can grab either. As parts are captured they're added to this table and built out on the board.

| Part | On Paper canvas | Local PNG |
|---|---|---|
| Client submission form (full page) | [Paper — submission form](https://app.paper.design/file/01KM85Z8ET0BX23R3XH3H75YGN/A-0/QML-0) | [client-submission-form.png](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/assets/client-submission-form.png) |
| APR dashboard — job view (empty) | [Paper — dashboard job](https://app.paper.design/file/01KM85Z8ET0BX23R3XH3H75YGN/A-0/QMM-0) | [apr-dashboard-job-empty.png](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/assets/apr-dashboard-job-empty.png) |
| ClickUp task card | [Paper — ClickUp task card](https://app.paper.design/file/01KM85Z8ET0BX23R3XH3H75YGN/A-0/QJB-0) | [clickup-task-card.png](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/assets/clickup-task-card.png) |
| Thank-you popup (post-sign screen) — *bare/ugly, redesign target* | on the canvas (link TBD) | [Popup-thankyoupage.png](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/assets/Popup-thankyoupage.png) |
| Signing page (current) — *shows the DUPLICATE-document bug: full doc twice* | on the canvas | [signing-page-current-duplicate-doc.png](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/assets/signing-page-current-duplicate-doc.png) |

**Still to capture** (parts of the sequence, not yet screenshotted): sent LOE/contract design · the client email (with the signing button) · dashboard status change · team notify email.

> **Worth turning into HTML too:** the client submission form — there are likely fields to tweak, and seeing the HTML side-by-side with the live dashboard makes those changes obvious.

### Capture method

Ben is capturing these **by hand** as he goes (faster than briefing an agent for a handful of shots) — drops each on the Paper canvas + shares the PNG, and it gets logged in the register above + saved to `assets/`. *(Option for later: if the set ever gets large or needs a refresh after UI changes, an agent could batch-capture every full-page area with the `/agent-screenshot` skill — not needed now.)*

## Where it's built — the Paper.design board

The sequence lives on a **Paper.design board** (our full-HTML design app). The ClickUp-task card is already on it; the rest of the blocks get built out there the same way, then the board is linked into the task/dashboard so it's reachable.

- **Sequence board:** [Paper.design — sequence board](https://app.paper.design/file/01KM85Z8ET0BX23R3XH3H75YGN/A-0)
- **ClickUp-task card (already built):** [Paper.design — ClickUp task card](https://app.paper.design/file/01KM85Z8ET0BX23R3XH3H75YGN/A-0/QJB-0)

### How to finish building it (the agent recipe)

The task card proves the pattern; the rest is screenshot-driven — and Codex is strong at exactly this:

1. **Screenshot each current part from the live app** — the LOE/contract doc, the client email (with the signing-link **button** visible so the actual copy + button show), the thank-you popup, the dashboard status change, and the team notify email. (The ClickUp task card is already done.)
2. **Put the screenshots + the board link in one prompt** → hand to an agent, e.g.:
   > *"Go to this Paper.design board ([link]). A ClickUp-task card already exists on it. Build each part below as its own sequential block on the board, one at a time, each matching its screenshot, in sequence order: (1) sent LOE/contract design, (2) the client email — show the copy + the signing button, (3) thank-you popup, (4) dashboard status change, (5) the existing ClickUp task card, (6) team notify email."*
3. **Result:** the whole sequence laid out on the board as HTML cards — exactly what the app's read-only view then renders.

## Scope — Phase 1 is read-only (deliberately small)

- **Phase 1 (this):** the UI designer builds each stage as a **standalone HTML page/card** (the Paper.design pattern); the app simply **shows them in sequence**. Read-only. **Not editable, not interactive, not auto-synced.** The whole value is *visibility* — seeing every stage at current state.
- **Kept current by hand.** When a step changes, update it at the source (ClickUp, the email template) and refresh the card to match. Best-effort current state, never a stale mock.
- **Later (not now):** the default email/template could *sync* into the diagram so the card updates automatically, and edit-in-place could brief an agent to wire a change. Both are future — Phase 1 doesn't need either to be worth building.

## The fuller system — component libraries + ID-linked sequences (the target)

Phase 1 is the read-only view. This is what it grows into: the editor area holds **three component TYPES**, each with its own editor **and** its own saved-instance library (each a dropdown "type"). These three are the building blocks — almost every dropdown option is one of them, regardless of the sequence.

| Component type | Editor | Library (dropdown of saved instances) | Status |
|---|---|---|---|
| **Document** | document editor | saved LOE / contract templates | exists |
| **Email** | email editor | saved email templates | exists |
| **Popup** | popup editor (NEW) | saved thank-you / popup pages | to build |

**Saved instances carry an ID.** Each specific email or popup you save gets its own **ID**, and a **sequence is built by placing instances — by ID — in order**. The visual sequence references each block by its instance ID; that ID *is* the link between "the thing" and "where it's used."

**The library shows WHAT exists; the sequence shows WHERE it's used — and they link both ways.** A flat dropdown of, say, four different thank-you popups tells you nothing about when each one actually fires. So:

- **Library → usage:** click an instance in its library → a panel shows the **sequence(s) it's used in** → jump to that sequence diagram.
- **Sequence → editor:** click a block in the sequence diagram → opens **that instance's editor** directly.
- The library is for *finding + editing* a component; the sequence is for *seeing it in context*. Neither alone is enough — the cross-link is the point.

**The thank-you popup specifically:** today's "Thank You!" screen (full-page, bare, frankly ugly — copy: *"Your Letter of Engagement has been successfully signed. You will receive a copy of the signed document via email shortly."*) becomes the first **Popup** component — redesigned, saved as an instance with an ID, and dropped into the post-sign sequence. (Note: that screen already *promises* the client an email — so a **client confirmation email** is also a confirmed block in the sequence, not a maybe.)

## Status

- **Vision captured.** Phase 1 (the read-only HTML sequence view) is small and could slot in early as a pure visibility win — it doesn't depend on the send → sign → pay loop being finished. The three-component-library + ID-linked-sequence system above is the **later, fuller target** the read-only view grows into.

---

**Last reviewed:** 2026-06-18 by qa-agent — captured live from Ben's description; linked to the flow-architecture dashboard.

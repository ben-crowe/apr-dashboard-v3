---
title: "Build Spec — Popup Editor (the third component type) + editable post-sign Thank-You screen"
id: SPEC-APR-LOE-popup-editor
type: build-spec
status: DRAFT — for qa-agent /review-gate, then → ui-designer (dev-3) direct
created: 2026-06-18
authored: co-architect
routes_to: ui-designer (dev-3) — net-new visual, direct hand (NOT a fork)
source: VISION-workflow-sequence-builder.md (three component types: Document · Email · Popup)
tags: [apr, loe-esign, popup-editor, thank-you, signing-page, component-library, net-new-visual]
---

**Tags:** #apr #loe-esign #popup-editor #thank-you #signing-page #net-new-visual
**Entities:** [[Popup editor]] [[SigningPage]] [[Email editor]] [[Previewer]]
**Backlink:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)
**Related:** [Vision — Workflow Sequence Builder](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/VISION-workflow-sequence-builder.md) · [PRD-APR-LOE-03 (Email as first-class)](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-APR-LOE-03.md)

---

# Build Spec — Popup Editor + editable post-sign Thank-You screen

> **North star.** Popup becomes the **third managed component type** — beside Document and Email — with its own editor and its own saved-instance library. The proof is the **post-sign "Thank You" screen**: today it's hardcoded, frankly ugly HTML on `SigningPage.tsx`; it becomes the **live render of the ACTIVE saved popup**, redesigned and editable in-app.
>
> **Mirror what exists — do NOT invent a new pattern.** Document = `LOEPreviewModal`, Email = `EmailComposeModal` + `emailTemplate.ts` CRUD. Popup is the SAME family: a preview-first editor + a `popupTemplate.ts` CRUD + a `popup_templates` table, modeled 1:1 on the email side.

---

## Scope

1. **Popup editor surface** in the dashboard's document/email viewer area (the Previewer) — the third component type, a **Popup dropdown beside Document + Email**, opening the same preview-first → edit → save-as-version editor the email uses.
2. **Saved-popups library** — create / edit / list / set-active a popup, each carrying an **ID**, persisted (`popup_templates` table). Managed-object parity with email templates.
3. **Wire the signing page** — `SigningPage.tsx` post-sign screen renders the **ACTIVE saved popup** (DB-driven), replacing the hardcoded "Thank You!" block. The ugly screen becomes editable in-app.

## Out of scope (fenced)

- The full read-only **sequence builder** view (Vision doc Phase 1) — separate, later.
- Multiple popups firing at different sequence points — start with ONE active post-sign popup.
- Editing popups from the signing page itself (edit lives in the dashboard editor only).
- Any change to the live document/email send paths, the DocuSeal webhook, or migration work.

---

## Invariants (INV) — the gate runs each PROVED-BY verbatim

**INV-0 (THESIS — build FIRST) — the post-sign Thank-You screen renders the ACTIVE saved popup, not hardcoded HTML.**
  - FAIL-WHEN: `SigningPage.tsx` still renders the hardcoded "Thank You!" / "You will receive a copy…" block as the source of truth; OR the screen ignores the active saved popup.
  - PROVED-BY: edit + save + set-active a popup in the dashboard → sign a test LOE → the signing page shows the NEW popup content; the hardcoded thank-you string is gone from the render path (it survives only as the no-active-popup fallback, INV-3).

**INV-1 — Popup is the third component in the Previewer, same editor family as Email.**
  - FAIL-WHEN: there's no Popup dropdown beside Document + Email; OR the popup editor is a bespoke surface instead of the shared preview-first → edit → save-as-version pattern.
  - PROVED-BY: open the Previewer → a Popup dropdown sits beside Document + Email; selecting a popup opens preview-first with Edit + Save-as-version, mirroring `EmailComposeModal`.

**INV-2 — Saved popups are managed like email templates (CRUD + ID).**
  - FAIL-WHEN: a popup can't be created/edited/listed/set-active; OR a saved popup has no stable ID; OR it doesn't persist.
  - PROVED-BY: create a popup → a `popup_templates` row with an ID; edit + save → row updates; list shows all; set-active flips the active one. (CRUD mirrors `emailTemplate.ts`: `loadAllPopupTemplates` / `savePopupTemplate` / `setActivePopupTemplate` / `loadActivePopupTemplate`.)

**INV-3 — Exactly one active popup resolves deterministically; signing never shows blank.**
  - FAIL-WHEN: zero or ambiguous "active" popup leaves the signing page blank or errors.
  - PROVED-BY: with an active popup → the signing page renders it; with NONE → it falls back to the current default copy (never blank, never an error).

**INV-4 — Merge tokens resolve in the popup the same way they do in the email.**
  - FAIL-WHEN: a token like client name renders raw (`[ClientName]`) on the signed screen.
  - PROVED-BY: a popup containing a client-name token → the signed screen shows the resolved value, using the same resolver the email path uses.

---

## Data + code shape (mirror the email side)

- **Table `popup_templates`** — model on the email-template table: `id`, `name`, `html`/`body`, `is_active` (one active), timestamps. RLS posture matches the email tables (off for now; re-enable pre-cutover — logged debt).
- **`src/utils/loe/popupTemplate.ts`** — CRUD mirroring `emailTemplate.ts`: `loadAllPopupTemplates`, `savePopupTemplate`, `setActivePopupTemplate`, `loadActivePopupTemplate`, plus a `POPUP_SEED_*` seed = today's thank-you copy as the starting instance + the safe fallback.
- **`SigningPage.tsx`** — on `signed`, `loadActivePopupTemplate()` → render its HTML (tokens resolved); fallback to the seed copy if none.
- **Previewer / editor** — extend the existing dropdown family with a Popup option that opens the shared editor against `popup_templates`.

---

## ⭐ Brief to ui-designer (dev-3) — net-new visual, MANDATORY skills (QA gate checks these)

> Routes **directly to dev-3** (the open standing peer with context; Ben answers visual Qs live) — NOT a fork.

**Because this is NET-NEW VISUAL, the build MUST:**
- **Load AND apply `/interface-design` + `/ui-ux-pro-max`** — not just loaded; visibly applied to the popup design + the redesigned Thank-You screen.
- **Follow the `/impeccable` design-brief shape** for the redesign (the ugly thank-you screen is the redesign target — see asset below).
- **Verification model:** dev-3 + QA verify CODE / DB / token-resolution only — components built, CRUD persists, active resolves, tokens render, `tsc` clean, drift green. **NO agent app-walk / screenshots.** **Ben click-tests the deployed signing page** for the visual (proof-first close).
- **Redesign target asset:** the current bare screen — [`assets/Popup-thankyoupage.png`](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/assets/Popup-thankyoupage.png). Current copy to preserve as the seed: *"Your Letter of Engagement has been successfully signed. You will receive a copy of the signed document via email shortly."*

**Comms contract (MANDATORY on this tmux-peer handoff — QA gate checks it):**
- dev-3 is a **tmux peer, not a fork.** When done — or with ANY question — she **messages `dev-1` (co-architect) back DIRECTLY**; do NOT assume co-arch reads her pane. The reply-to target is named: **dev-1.**
- dev-3 **loads `/tmux-comms`** and uses it to **PUSH the reply through** (text → then Enter/`C-m` as a separate write) so the message actually sends and doesn't sit unsent in the input.
- Flow: co-arch hands the spec → dev-3 builds → dev-3 messages dev-1 with the result/evidence (pushed via tmux-comms) → co-arch verifies + relays to qa-agent (dev-2) to gate.

---

## Dispatch Plan (how co-arch hands this to dev-3 — visible for the gate)

**Vehicle:** ui-designer on tmux peer **dev-3** (confirmed alive + attached, fresh context). NOT a fork. Co-arch reply-to = **dev-1**.

**(a) What co-arch sends dev-3** — this prompt (after gate PASS), pointing at the spec, not re-pasting it:
```
ui-designer: build SPEC-popup-editor.md (gate-PASSED). Path: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/SPEC-popup-editor.md
STEP 0 (skills per ui-designer's CURRENT loadout, confirmed 2026-06-18 — design-brief is RETIRED, folded into /impeccable): bash ~/.claude/skills/load-persona-skills/load-persona-skills.sh ui-designer · LOAD-AND-APPLY the design cascade via /impeccable as the ENTRY POINT (shape → ia-wireframe → wireframe-layout → craft → human-centered-product-sense, no silent stage-skips, Rejection Filter applied) + /ui-ux-pro-max + /interface-design + /visual-alignment + /human-centered-product-sense · load /tmux-comms · Read ~/Development/APR-Dashboard-v3/CLAUDE.md (🚫 NO-LOGIN) · run /search-2phase scoped "popup editor SigningPage thank-you emailTemplate CRUD popup_templates active resolve merge tokens".
BUILD: INV-0 first (SigningPage renders the ACTIVE saved popup; hardcoded block → no-active fallback only), then INV-1..4. Mirror the email side (EmailComposeModal + emailTemplate.ts → popupTemplate.ts + popup_templates table). Redesign the Thank-You screen per the asset: docs/Features/12-LOE-Esign/eSign-Workflow/assets/Popup-thankyoupage.png.
VERIFY: code/DB/token only — tsc clean, drift green, CRUD persists, active resolves, tokens render. ⛔ DO NOT use /agent-screenshot to visual-verify or self-gate the render — that's the banned agent-app-walk pattern (Ben's hard rule). NO app-walk / NO screenshots. Ben click-tests the live signing page for the visual (proof-first close).
⛔ WHEN DONE OR WITH ANY QUESTION: MESSAGE dev-1 (co-architect) BACK DIRECTLY, pushed through /tmux-comms (text then C-m as a separate write — do NOT leave it unsent in the input). Do not assume co-arch reads your pane.
```

**(b) Reply-to is explicit** — the prompt names dev-1 as the message-back target and requires /tmux-comms to push it. Co-arch then verifies + relays the result to qa-agent (dev-2) to gate.

**(c) Terminal-open contingency:**
- Check first: `tmux has-session -t dev-3`. (Right now: EXISTS + attached + fresh — send directly.)
- If alive → send the prompt via the two-write push (`~/.claude/scripts/tmux-msg.sh` or the /tmux-comms text→`C-m` pattern); verify it submitted (capture-pane shows it cleared the input).
- If NOT open → spawn it (`~/.claude/scripts/spawn-session.sh dev-3` / the team launcher) OR surface to Ben to open the dev-3 pane (pane creation can be app-side in KM-Exp), THEN run Step 0 + send the prompt. Never silently fail the handoff.

## Open decision (separate from the build) — the seed/fallback copy

The current seed + no-active fallback copy still says *"You will receive a copy of the signed document via email shortly."* That promise isn't fulfilled yet. **Decide separately:** either (a) actually send the signed copy (a confirmed sequence block per the Vision doc), or (b) drop/soften that line in the seed. Until decided, the fallback shows it — flagging so it's a conscious choice, not a silent unfulfilled promise.

## Pass/fail gates

- Each INV proven by its PROVED-BY (DB row + real render, never just a 200).
- `tsc --noEmit` clean + drift-gate green (V3 / report-builder untouched).
- INV-0 built first (thesis), then INV-1..4.
- Ben click-tests the live signing page; the redesigned popup renders the active saved instance.

---

*Authored 2026-06-18 by co-architect from the Vision doc, for QA `/review-gate` → then direct to ui-designer (dev-3). Mirrors the Email-as-first-class pattern (PRD-APR-LOE-03).*

---
title: "Component Studio — status + handoff (ui-designer, dev-3)"
id: HANDOFF-component-studio
type: status-handoff
created: 2026-06-19
author: ui-designer (dev-3)
tags: [apr, loe-esign, component-studio, handoff, status, ui-designer, anti-patterns]
why: "The 2026-06-19 checkpoint write TRUNCATED the detailed body — this doc preserves the full context so next-startup ui-designer has it. Read this on resume."
---

**Tags:** #apr #loe-esign #component-studio #handoff #ui-designer
**Spec:** [SPEC-component-studio.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/SPEC-component-studio.md)
**Mockup (design source of truth):** [component-studio.html](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/mockups/component-studio.html)

---

# Component Studio — where it stands (read on resume)

The Document/Email **Previewer** is becoming a **Component Studio**: a library (Document · Email · Popup) + a sequence map (Email → Document → Popup) + a split previewer/editor. Designed iteratively with Ben against the mockup, then built + deployed **additive** behind a "Component Studio" button on the LOE section (the old Previewer is untouched — zero regression).

## Files

| File | Role |
|---|---|
| `src/components/dashboard/job-details/actions/ComponentStudio.tsx` | the Studio shell (library rail + sequence map + split + inline editors) |
| `src/components/dashboard/job-details/actions/DocumentPreviewPane.tsx` | **shared** doc render pane (scaled iframe + zoom) — extracted verbatim from LOEPreviewModal |
| `src/utils/loe/downloadPagedPdf.ts` | **shared** paged-PDF download — extracted verbatim |
| `src/components/dashboard/job-details/LoeQuoteSection.tsx` | mounts the Studio additively behind a button + wires onEdit callbacks |

## What's BUILT + LIVE (additive, behind the button) — all committed; co-arch deploys

- **INV-0 no-regression seam** — extracted `DocumentPreviewPane` + `downloadPagedPdf` verbatim from `LOEPreviewModal`; the existing previewer now renders THROUGH them, so the Studio reuses the EXACT same path. `generateLOEHTML` is the only render engine — no new one. (Proven by construction + grep.)
- **Shell** — library rail + sequence map + split **render-LEFT / editor-RIGHT**, render-dominant **¾:¼** + chevron expand-to-half + drag grabber + render **zoom**.
- **Two entry paths** — library-click = rail stays; sequence-block-click = rail collapses to icon strip + the sequence **spine** takes the left.
- **Inline editors for all 3 types** — email → `saveEmailTemplate`, popup → `savePopupTemplate`, doc → `saveJobContract` (all EXISTING save paths; doc also keeps an "Open full editor" link). Editor is a designMode WYSIWYG with merge-field chips.
- **Popup self-seeds** (`loadActivePopupTemplate`) so it always shows; **+ New popup / + New email**.
- **Per-block Preview + Edit** buttons; **spine expand/compact** (chevron + grabber); **light pages in dark mode**; dark-mode contrast fix.

## Process (LOCKED with Ben + co-arch)

**I COMMIT + ping dev-1 (co-arch). CO-ARCH owns the deploy** (`vercel --prod`) after verifying HEAD. Do NOT run vercel myself.

## PENDING / NEXT — HELD until Ben blesses the additive Studio

1. **Replace the Previewer entry point** (live-surface) — HELD.
2. **INV-6: flip the standalone doc editor** to render-left/editor-right (live-surface) — HELD.
   - Co-arch's instruction: hold both until Ben click-test-confirms the additive Studio is good (proof-first).

3. **MOCKUP-ONLY design, AHEAD of the build** — needs Ben review → then a **spec extension** (new data model) → then build:
   - **Reusable email-PAGE shell** — subject + from + body, Gmail reading-pane proportions (Ben's reference: the real e-sign email in Gmail).
   - **Signature as its own reusable asset** — a new type under Email: **"Email Signatures"**. Edited/previewed on a REAL email page (empty body + signature, grounded not floating). Email = message + a composed signature. **NOTE: the signature is currently BAKED INTO `EMAIL_SEED_BODY`** — the proposal separates it (data-model change: signature stored separately, composed at preview/send; Ben's lean = strip from body + append chosen signature).
   - **IA / where the Studio launches from** — do NOT bolt the Studio onto a button in the LOE section. Its real home is a **LEFT SLIDE-OUT on the job dashboard** (collapsible to the edge). The LOE section keeps ONLY "Create Document/Email", which jumps **straight to the doc view** (not the Studio map). The Studio opens as an **overlay over the job** with a "Dashboard" back button. (All shown in the mockup.)

## Anti-patterns + ground truth (hard-won this session)

- **CSS class-name collision** — gave the studio container a mode-class `panel` while `.panel` was ALSO a child element's class → the `.panel{flex-direction:column}` rule hijacked the whole container and stacked the layout (huge empty band). Use UNIQUE mode-class names. Caught by reading `getBoundingClientRect` via agent-browser, not by eyeballing.
- **React inner-component remount** — rendering inner view-builders as `<Work/>` REMOUNTS them every parent render → the designMode editor iframe lost edits. Call them as `{Work()}` (inline) so the iframe stays mounted.
- **Dark mode darkened the rendered viewer pages** — they used themed `bg-muted`/`bg-card`. Rendered PAGES must be FORCED LIGHT (`bg-white` page + `bg-slate-100` viewer backdrop); app CHROME stays themed. Precedent: `EmailComposeModal`/`PopupComposeModal` previews already use explicit `bg-white`. Also: hardcoded light bg (`bg-[#eef3fb]`) + themed text = white-on-light unreadable in dark → use translucent brand tint (`bg-[#2c5aa0]/10`) + `dark:` variants.
- **popup self-seed** — `loadAllPopupTemplates` only LISTS (returns `[]` on a fresh table); the default Thank-You seeds via `loadActivePopupTemplate`. The Studio must self-seed if the list is empty or Popup shows "None yet".
- **INV-0 reuse-by-construction** — prove "no-regression / no new render engine" by EXTRACTING shared modules BOTH surfaces import (one code path, impossible to diverge) — far stronger than a "promise not to regress".
- **Mockup visual self-verify is allowed** — screenshot the standalone design mockup via `agent-browser --session <iso>`; that is NOT the banned app-walk (the ban is for verifying the LIVE app build — Ben click-tests that). The mockup is a design artifact where visual IS the deliverable.

## Next-startup sequence

1. Read this doc + the spec + open the mockup.
2. Peer sweep dev-1 (co-arch, owns deploy + the email-integration phase) + dev-2 (QA, gates).
3. `Activate /search-2phase` scoped to "Component Studio LOEPreviewModal DocumentPreviewPane email signature asset email-page shell job dashboard slide-out".
4. The ONE thing waiting on Ben: his click-test verdict on the additive Studio (unblocks the two live-surface waves), and his review of the mockup's signature-asset + slide-out IA (which then needs a co-arch spec extension before building).

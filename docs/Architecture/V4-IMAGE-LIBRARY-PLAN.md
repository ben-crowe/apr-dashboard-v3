---
content_type: plan
title: APR V4 — Image-Library Plan (image the V4 app end to end)
status: REFIT V4-ONLY 2026-06-21 (Ben: "only V4, drop V3 — finish the V4 app end to end") — awaiting qa re-gate
created: 2026-06-21
author: co-architect
gate: qa-agent (spec-review + status-verification: code-vs-doc, not doc-to-doc)
anchor: ~/Development/APR-Dashboard-v3/docs/Architecture/V4-STATE-OF-PLAY-2026-06-16.md
sop: ~/.claude/skills/agent-screenshot/SKILL.md (VISUAL-VERIFICATION LOOP)
tags: [apr, v4, image-library, visual-verification, planning]
---

# APR V4 — Image-Library Plan (V4-only)

**Purpose.** Image the **V4 report-builder app completely, end to end** — one clean, readable
image per section/surface, each matched 1:1 to its feature doc + build status. The three of us
(Ben + co-arch + qa) then talk about every part of the V4 app off the SAME visuals, and the
library shows exactly what's built / partial / not-started as V4 gets finished.

> **⛔ V3 IS DROPPED (Ben, 2026-06-21).** An earlier draft framed this as a V3→V4 before/after and
> shot the live V3 app (batch 2). That was a co-arch misframe against Ben's "all V4" directive — V3
> is the working app Ben already sees daily and does not need imaging. **This library is V4 only.**
> The batch-2 V3 board is abandoned; no further V3 shots.

## Key Results (how each is proven)

1. **One V4 image-library INDEX** covering every V4 surface — proven by the populated table below,
   each row carrying doc + build-status + shootable + delivered-image.
2. **Every V4 surface captured + delivered to Ben on the ONE consolidated readable board** — proven
   by running the locked VISUAL-VERIFICATION LOOP per row (the single organized, readable board link
   in Ben's hand; images placed large enough to actually read).
3. **Every status claim verified against ground truth** — proven by qa's code-vs-doc certification
   (built/partial/not-started confirmed in code + on the live site, never doc-to-doc).

## ✅ DELIVERY FORMAT — ONE consolidated, readable board (close of the loop, locked 2026-06-21)

> **The board stays — it just has to be ONE board, organized, and big enough to read.** Ben's gripe
> was never "boards are bad" — it was (a) ui made a SEPARATE board per batch, so Ben only ever saw
> fragments, and (b) the thumbnails were too small to read. **The close of the loop = a SINGLE
> consolidated board, grouped (by section / panel), with each image placed large enough to actually
> read, and the ONE link handed to Ben.** Not zero board, not a board-per-batch.
> qa verifies off the raw PNGs (her surface) and hands Ben the one consolidated link (his surface).
> Existing shots already captured go ONTO this one board too — the work isn't thrown away; it's
> consolidated readable. (Full-size raw PNG paths can ride along, but the deliverable is the one board.)

## The real constraint — a FLAG-FLIP, not a build (code-verified 2026-06-21)

> **⚠ The 06-16 anchor is STALE on its two blockers — code wins.** The anchor said V4 was "bolted
> shut" (routes commented out via banned symlink) with "no persistence." **Both are resolved:** the
> symlink is GONE (`src/features/report-builder` is a real dir), persistence is WIRED
> (`useSaveReportBuilderData.ts` + `report_builder_data` refs + a `JobReportBuilder` page), and the
> V4 routes are **flag-gated, not commented out** (`isV4Enabled()` in `App.tsx`/`Dashboard.tsx`).
> **Slice A (Unlock) + B (Persist) = effectively DONE.** (qa certifies the depth.)

**V4 is a working engine behind a KEY (`VITE_V4_ENABLED`), not bolts.** Everything V4 gates on
`isV4Enabled()` = `VITE_V4_ENABLED==='true'` (`src/lib/featureFlags.ts`). The deployed **apr-v4.vercel.app**
project carries the flag ON, so the full V4 app renders + is shootable there NOW with no code change.

> **⛔ HARD RAIL (every V4 shoot prompt MUST carry it): NEVER flip the shared `.env.local`.** Flipping
> the project `.env.local` to `VITE_V4_ENABLED=true` exposes half-built V4 in Ben's LIVE client app.
> Shoot V4 off the **apr-v4.vercel.app** deployed project (flag already ON), or an isolated own-port
> dev instance — never the shared `.env.local`. qa's prompt-gate refuses any V4 shoot prompt omitting it.

## The V4 image-library INDEX (the core artifact)

| V4 surface | Matching doc | Build status | Shootable? | Image | Batch |
|---|---|---|---|---|---|
| **CAPTURED — batch 1 (10 builder panels, off apr-v4.vercel.app)** | | | | | |
| Builder shell + section nav | ReportBuilderLayout + SectionSidebar | built | ✅ done | v4-01-shell | 1 ✅ |
| Home / cover | HomeTabPanel | built | ✅ done | v4-02-home | 1 ✅ |
| Income approach | IncomeTabPanel | ✅ built + validated | ✅ done | v4-03-income | 1 ✅ |
| Sales approach | SalesTabPanel | partial (form, thin data) | ✅ done | v4-04-sales | 1 ✅ |
| Cost approach | CostTabPanel | not started (stub) | ✅ done | v4-05-cost | 1 ✅ |
| Site | SiteTabPanel | partial (form, no data) | ✅ done | v4-06-site | 1 ✅ |
| Improvements | ImprovementsTabPanel | partial (form, no data) | ✅ done | v4-07-improvements | 1 ✅ |
| Reconciliation | ReconTabPanel | partial ($0 final) | ✅ done | v4-08-recon | 1 ✅ |
| Image management | ImageMgtTabPanel | **⚠ DEFECT — see below** | ✅ done | v4-09-imagemgt | 1 ✅ |
| Live preview (split-screen) | PreviewPanel / PreviewRenderer | built | ✅ done | v4-10-preview | 1 ✅ |
| **THE GAP TO END-TO-END — batch 3 (qa-named, NOT yet shot)** | | | | | |
| Field editors — EditPanel states | EditPanel {Text/Image/CalculatedField} + CalcInputPanel | built | 🔑 apr-v4 | edit-panel each state | 3 ☐ |
| Calculator surfaces | /calculator-demo · /preview · /standalone | built/partial | 🔑 apr-v4 | calculator demo views | 3 ☐ |
| Job → report integration | /dashboard/job/:jobId/report (JobReportRoute), real job loaded | built (persist wired) | 🔑 apr-v4 + a real job | job data loaded into the report | 3 ☐ |
| V3/V4 GATE — OFF vs ON | SPEC-V4-slice2-gate-section3; isV4Enabled | live (flag) | ✅ both states | gate OFF (route 404s on client) vs ON (renders on apr-v4) | 3 ☐ |

*(Shot-list = the report-builder surfaces on disk, `src/features/report-builder/`, 1:1 to report
sections + the editor/calculator/integration/gate pieces. qa certifies each build-status cell against
live code + the live apr-v4 site before each batch.)*

## ⚠ Batch-1 DEFECT to fold in (fix-or-status row)

**Image Management panel sits stuck on "Loading images… / Loading layouts…" (0 images / 0 pages) on
the LIVE apr-v4 site — confirmed NOT a timing blip (re-took after a wait, still loading).** The
Page Configurator shell + dropzone + filters render, but the gallery + layout panes never resolve.
- **Status shot captured** (v4-09-imagemgt) as honest current-state — the panel is in the library as
  a real "broken on live" row, not faked complete.
- **Decision for Ben/qa:** treat as a **fix** (root-cause the stuck fetch on the deployed V4 build —
  likely a data/endpoint gap on apr-v4) OR leave as a **documented not-working status row** until the
  V4 build reaches it. Co-arch to surface this as its own fix-or-status call, not bury it.

## Per-row process

Each row runs the locked **VISUAL-VERIFICATION LOOP** (`/agent-screenshot`), with the NEW close:
qa REQUEST → co-arch PROMPT → qa GATE → ui CAPTURE+PLACE-on-the-ONE-board → qa VERIFY-off-raw →
**qa DELIVER the single consolidated board link to Ben** (organized + readable). Step 6 (a usable,
readable view in Ben's hand) is non-skippable.

## Ben-awareness flags (qa-certified — surface, don't bury)

- **⚠ Image Mgt is broken on live apr-v4** (above) — fix-or-status decision pending.
- **⚠ `report_builder_data` ships with RLS DELIBERATELY DISABLED** — the migration explicitly
  `DISABLE ROW LEVEL SECURITY` "to match where the email tables landed." A CONSCIOUS choice to match
  the wide-open no-login app, NOT an oversight — Ben should KNOW it's a choice. Revisit at the SaaS
  multi-tenant track.
- **⚠ file-exists ≠ panel-built.** A tab-panel file on disk doesn't prove it renders content (Cost =
  stub). The live-site shoot is what certifies what each panel actually RENDERS.

## Sequencing

1. **Batch 1 (DONE):** the 10 V4 builder panels off apr-v4.vercel.app — captured, delivered.
2. **Batch 3 (NEXT — the gap to end-to-end):** field editors, calculator surfaces, job→report
   integration (with a real job loaded — 20 jobs exist in shared Supabase), gate OFF-vs-ON. Off
   apr-v4.vercel.app (+ the client prod for the gate-OFF state only — that's the flag behaving, not
   a V3 shoot). One readable full-size PNG per surface.
3. **Status-only rows:** where a surface is genuinely unbuilt (Cost stub) or broken (Image Mgt),
   capture the real state + mark it — never fake completeness.
4. **Image Mgt defect:** co-arch surfaces the fix-or-status call to Ben separately.

## Out of scope (don't bundle)

- **V3 imaging** — dropped entirely (Ben, 2026-06-21). The working app needs no library.
- **Building any V4 slice** — this plan produces the visual map + status, not the build.
- **SaaS multi-tenant direction** — separate strategic track.

## Division of labor

- **co-architect:** pen this plan + the per-row capture prompts; surface the Image Mgt fix-or-status call.
- **qa-agent:** gate the plan + each prompt; own the visual-verify SOP runs + status-verification
  (code-vs-doc cert); **deliver the ONE consolidated, readable board link to Ben.**
- **ui-designer:** shoot + report; honest empty/stub/defect states.
- **Ben:** steer + view the growing V4 library; the Image Mgt fix-or-status decision; final aesthetic.

---

*REFIT V4-only 2026-06-21 per Ben's "only V4, drop V3, finish end to end." Folds qa's gap-rows
(editors / calculator / job→report / gate) + the Image Mgt live-defect + the dead-board delivery
rule. Awaiting qa re-gate. SOP: /agent-screenshot VISUAL-VERIFICATION LOOP.*

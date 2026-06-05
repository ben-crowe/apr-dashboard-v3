---
title: Testing — Visual Verification Workflow (SOP)
type: sop
domain: testing
project: APR-Dashboard
status: active
version: v2-draft
created: 2026-05-15
last_updated: 2026-05-15
last_reviewed: 2026-05-15
authors: [co-architect, qa-agent]
owners: [co-architect, qa-agent]
applies_to: [APR-Dashboard, KM-Exp, valta-brand]
companion: ~/.claude/knowledge/VISUAL-VERIFICATION-SOP.md
companion_doctrine: ~/.claude/knowledge/VISUAL-VERIFICATION-SOP.md
related_skills: [cli-tldraw-tools, cli-browser-auto, km-open, link-format]
related_personas: [visual-verifier, qa-agent, co-architect]
description: Canonical Standard Operating Procedure for visual verification across all agent work. The agent that captures a screenshot is NEVER the same agent that verifies it. Multimodal Read tool reads the actual pixels. Defines workflow, anti-patterns, scenarios, capture-method matrix, and the two locked screenshot-capture fixes (in-app endpoint + Apple Developer cert).
tags: [visual-verification, sop, qa, screenshots, doctrine, mode-d, multimodal, capture-vs-verify, ben-rule, locked-2026-05-15, master-document]
keywords: [visual verification, sop, screenshot verify, visual-verifier, agent dispatch, multimodal vision, capture verify split, mac screen recording, apple developer cert, electron capturePage, hono wrapper, tldraw board, ben rule, audit anti-pattern, image verify, screenshot evidence, see what i see]
aliases: [visual-verification-sop, visual-verify-sop, screenshot-verify-workflow, capture-verify-sop]
---

# Testing — Visual Verification Workflow (SOP)

**Status:** Draft v2 for Ben + qa review
**Filed:** 2026-05-15 — MASTER DOCUMENT as of this date
**Author:** co-architect (with qa-agent critique pass)
**Companion doctrine:** `~/.claude/knowledge/VISUAL-VERIFICATION-SOP.md`

The standard procedure for any agent that needs to visually confirm a UI claim. Not a test. A reusable workflow. Test scenarios live at the bottom — they trigger this workflow, they don't replace it.

---

## Scope — universal, not KM-Exp-specific

This SOP applies to ANY visual verification across ANY app surface:

- KM-Exp Electron app (our home turf)
- Locally-hosted web app on localhost:N (dev servers, prototypes)
- Deployed web app (Vercel, Netlify, anywhere)
- Browser-loaded HTML mockup (tldraw kmexp-html shape, file:// pages)
- Third-party app captured through Chrome MCP or computer-use
- Mobile-emulated or responsive layouts

Principles are global: DOM-query-before-capture, target-page-confirm, capturer ≠ verifier, read the actual artifact, never accept a relay. Mechanics differ per surface (which capture endpoint, which DOM-query tool, which dispatch chain) but the discipline doesn't.

The examples in this doc use KM-Exp because that's the immediate use case, but every step generalizes. When applying to a different surface: swap the capture tool, swap the DOM-query mechanism, keep everything else the same.

## Core principle

The agent that captures a screenshot NEVER verifies it. A separate agent — `visual-verifier` — opens the image with multimodal vision, describes what's actually in the pixels, and answers the assertion.

Self-verification = automatic fail. File existence ≠ visual proof.

---

## The workflow

### 0. PRE-CAPTURE — confirm target page (MANDATORY before any screenshot)

Before ANY screenshot is captured, the agent must explicitly answer:

1. **What view does the target element actually render on?** Not "the app" — the specific page/route/mode. Example: "Resources chip renders on the regular Task Board view (list of tasks), NOT on the Group View of folders."
2. **What's the canonical URL/deep-link/route for that view?** Example: `kmexp://board/list_apr_dashboard`
3. **Is the running app currently displaying that view?** Verify via:
   - URL or route check (current location of the active window)
   - DOM query confirming the parent container of the target element is mounted
   - OR a tiny preview capture for routing-only purposes (NOT for verification — capturer-previews-for-routing is allowed for triage, not for PASS claims)
4. **If NO** — navigate first. POST `/api/viewer-open` with the canonical route. Verify navigation completed. THEN proceed to step 1.

**Hard rule:** capturing without confirming step 0 wastes everyone's time. The pattern of "capture, send to verifier, get UNCERTAIN/FAIL because element absent, retry on different window" is the anti-pattern. Confirm target page first. Always.

Acceptance for step 0: agent writes a sentence stating "Target element X lives on view Y, currently mounted at window/route Z, confirmed by [DOM query / URL match / preview triage]." Without this sentence in the run log, the capture is invalid.

**STRONGEST gate — DOM query first.** Before any capture or navigation guess, run a DOM query against the running app. agent-browser CDP eval or Playwright queries can return: which routes are mounted, what windowIds exist, what element IDs/classes are present right now. The DOM is the ground truth — the agent's mental model of "where things are" is not.

Example pattern (adapt to actual CDP availability):

```
Query: 'what DOM nodes match selectors related to the target element?'
Result: list of elements + their containing windowId + their bounding rect
Decision: pick the windowId that contains a visible target element; if zero, navigate first
```

Without DOM query, the agent is guessing which window to capture. Guessing is the failure mode this workflow exists to kill.

### 1. Pinpoint

Identify the specific element you need to verify. Don't capture the whole screen — narrow to the target component. Use `agent-browser --cdp 9222 snapshot -i` to get DOM refs and locate the element of interest.

### 2. Capture

Element-scoped screenshot preferred over full-page. Save to a descriptive path under the run folder (`tests/runs/<date-name>/screenshots/<descriptive>.png`).

### 3. Refine (if needed)

If the captured region is too wide or detail too small, crop or zoom with `sips` before passing to the verifier. The clearer the image, the more accurate the multimodal read.

### 4. Dispatch the verifier

Spawn `visual-verifier` as a Mode 2b subagent. First message is the slash command only. Wait for activation announcement.

### 5. Send the assertion

After activation, send the screenshot path plus a specific, itemized assertion. Format:

- Path(s) to image(s)
- Numbered list of assertions to check (each one testable, not vague)
- Anomalies to flag
- Report format requirements

### 6. Read the verifier's report

Verifier opens image via Read tool (multimodal vision activates), describes pixels, answers assertions point-by-point. Report must include quoted observations, not summaries.

### 7. Mark verdict

Capturer reads the verifier's report and marks the step PASS / FAIL / UNCERTAIN. Capturer does NOT re-glance at the image — that re-introduces bias. UNCERTAIN escalates to Ben.

### 8. File the evidence

Both the screenshot and the verifier's verbatim report go into the run folder. If the run produces a tldraw board (long-form audit), the screenshot + verifier quote + verdict go on the board.

### 9. Open results in viewer-1 — ONE clean tab, properly named

Share any deliverable (board, log) by opening it for Ben directly via `POST /api/viewer-open windowId=viewer-1`. Never paste a path expecting a click.

**Tab hygiene — mandatory:**

- ONE tab per run artifact. No tab sprawl from iterating.
- BEFORE opening a new tab in viewer-1, close stale ones: `POST /api/viewer-close-tab { all: true }` clears all, `{ tabId: 'file:~/path' }` closes a specific one, `{}` closes the active.
- NAME the artifact correctly at creation. For a tldraw board, the tab title comes from the page name set via `tldraw-init --name "..."` or renamed via `tldraw-page-rename --page <pageId> --name "..."`.
- The dispatcher GIVES the agent the exact tab name in the brief. Don't let the agent invent one. Example brief: "Open a tldraw board for this test, name the page `Resources Chip Verify · 2026-05-15`." Then the dispatcher knows what name to look for.
- After the run completes, the only tab in viewer-1 should be the run artifact, with the dispatcher-specified name.

**Anti-patterns:**

- Five tabs accumulating across iterations of capture-fail-retry cycles
- Tab named `run.tldr` (the filename) instead of a human-readable run label
- Agent invents the tab name without being told what to use
- Dispatcher doesn't strip stale tabs before re-opening

---

## Mandatory inclusions in every run

- Visible `visual-verifier:` dispatch line in the run log (proves separation of capturer + verifier)
- Quoted "what I see" observation from the verifier (not a summary, not a paraphrase)
- Verdict per assertion, not just an overall PASS
- File path of the screenshot referenced in the verdict

---

## Anti-patterns that fail the audit

- "Screenshot saved, looks fine" without a verifier dispatch
- Capturer summarizing the verifier's findings without quoting them
- Same agent on both sides of the capture/verify split
- Verifier given a vague assertion ("looks right") and returning a vague verdict
- Verifier given a missing/wrong file path and silently substituting a different image

---

## When to invoke this workflow

Trigger scenarios — any of these should fire the SOP:

- **Form-fill verification.** Agent fills a form, claims the data submitted correctly → screenshot the rendered confirmation state, verifier confirms the expected values appear.
- **New UI component shipped.** A chip, button, panel, or modal lands in a commit → screenshot the rendered state, verifier confirms the component is present, styled, and matches the design intent.
- **Regression check after refactor.** Code change touched a component that should look identical pre/post → screenshot both states, verifier compares for unintended visual drift.
- **Data display fidelity.** Dashboard shows job data from the database → screenshot the rendered row, verifier confirms the displayed values match the source.
- **Error state UI.** Agent triggered a known failure path → screenshot the error state, verifier confirms the right error message and visual treatment appears.
- **Modal / overlay / slide-out launch.** Agent clicked a trigger → screenshot the result, verifier confirms the modal opened, contains expected content, no broken layout.

When in doubt: if the claim is "it looks right" or "the UI shows X", this SOP applies.

---

## Known gaps to resolve before this is locked

1. **`agent-browser --cdp 9222 screenshot` is currently blocked** on the running Electron app — port 9222 not binding cleanly. Either fix the CDP listener or add a Hono HTTP wrapper around the existing IPC handler (`ipcMain.handle('screenshot:capture')`).
2. **Confirm `--element @eXX` capture flag exists** in agent-browser. If not, fall back to full-page capture + sips crop.
3. **Confirm `visual-verifier` has multimodal Read tool access** on PNG files. Persona description implies it, but verify.
4. **Author a run-folder template** so every run drops into a consistent structure without needing to invent the layout each time.

---

:::details{summary="Screenshot capture — two locked fixes (click to expand)"}

**macOS Screen Recording perm keeps re-prompting because Screen Recording is tied to a binary signature. Unsigned/re-signed binaries (agent-browser, claude, etc.) get treated as new apps every update → perm revoked → re-prompt forever. Two fixes solve this for good:**

**1. In-app screenshot endpoint (do now, free)**
Build a Hono HTTP wrapper around KM-Exp's existing `webContents.capturePage()` IPC handler. The app captures its own windows. Zero macOS perms ever. Covers any UI hosted inside KM-Exp (the app itself, browser panel webviews, kmexp-html shapes on tldraw boards). This is THE correct architecture for self-capture — not a workaround.

**2. Apple Developer certificate ($99/year, long-term)**
Sign the agent-browser and claude binaries with a stable Developer ID signature. macOS prompts once for Screen Recording perm → sticks forever on that signature. Solves the prompt-fatigue problem for capturing external/standalone apps that aren't loaded inside KM-Exp.

**When to use which:**

| Target | Capture method | Perm needed |
|---|---|---|
| KM-Exp app itself (any panel, viewer, copilot) | In-app endpoint | None |
| Browser-hosted app loaded in KM-Exp browser panel | In-app endpoint | None |
| Vercel-deployed app loaded via kmexp-html shape on tldraw | In-app endpoint | None |
| Vercel-deployed app via Chrome MCP / CDP | Chrome MCP captureScreenshot | None |
| Standalone external app (Mail, Finder, third-party) | OS-level screencap | Screen Recording perm — needs Apple cert to stick |

**Bottom line:** for everything we do inside or through KM-Exp/Chrome, fix #1 covers us. Fix #2 only matters when capturing apps that aren't loaded into our toolchain.

:::

## Status

Pending qa critique + gap closure. Once approved, this is the canonical SOP. Test scenarios above stay as triggering examples — not embedded tests inside the SOP body.

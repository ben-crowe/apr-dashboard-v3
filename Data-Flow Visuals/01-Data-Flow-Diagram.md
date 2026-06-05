---
content_type: workflow-sop
title: Data-Flow Visual Verification Workflow — Methodology + Shot Plan
status: active — living document
owner: qa-agent
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
paper_canvas: "Paper file: 'Build Workflow Testing' › page: 'APR Workflow' › board: 'DATA-FLOW BOARD — VAL261101 (Westside Mall)' (LOE assets sit above it on the same page). This is the living layout home."
tags: [apr-workflow, apr-testing, data-flow-visual-verification, visual-verification, shot-plan, paper-canvas, e2e, qa-owned]
keywords: [data flow diagram, visual data verification, scene by scene screenshot, shot plan per phase, data travels intact, intake to LOE, paper canvas data-flow board, fields filled all apps, client-presentable plumbing]
related: [~/Development/APR-Dashboard-v3/tests/Testing-Visual-Verification-Workflow.md, ~/Development/APR-Dashboard-v3/tests/E2E-TESTING-WORKFLOW-MASTER.md, "~/Development/APR-Dashboard-v3/Data-Flow Visuals/02-SYNC-VERIFICATION-RESULT.md", "~/Development/APR-Dashboard-v3/Data-Flow Visuals/03-CLICKUP-JOB-HUB-SPEC.md", "~/Development/APR-Dashboard-v3/Data-Flow Visuals/04-CLICKUP-CUSTOMFIELD-SYNC-RESULT.md"]
---

# 01 — Data-Flow Diagram (Methodology + Shot Plan)

> **QA-agent owns this workflow.** It fires whenever we need end-to-end / visual proof that a
> job's data (from dashboard or client submission) makes it intact to every downstream area.
> QA runs the method (map stops → propose shots → Ben sign-off → capture), then hands the
> screenshots to ui-designer, who arranges them on the **Paper canvas** (the living board —
> link in `paper_canvas` frontmatter). When parts change, new shots are captured and added
> back to the canvas, so the board is a living data-flow map, never a one-time snapshot.

**Status:** Living resource · refine over time
**Author:** qa-agent (dev-2)
**Created:** 2026-06-04
**Reference job:** VAL261101 — *Westside Mall, 2129 Broadway Court, Calgary, AB* (Valcre Id 784140)

---

## What this is

A **data-flow diagram** is a visual proof that the *same* job's data travels intact from where a client enters it, all the way through every downstream system. We capture filled-in screenshots at each stop, lay them side-by-side on the Paper canvas (like a Figma board), and you can literally see one job's data show up in each place — intake → job prep → ClickUp → Valcre → LOE.

The point isn't QA pass/fail tables. The point is a **client-presentable picture** of the plumbing: "you fill this in once, and here it is, correct, in every system that matters."

---

## How we do these (the method)

When a data-flow diagram is requested, the steps are always:

1. **Map the stops.** List every system the data lands in, in order.
2. **Map the areas inside each stop.** A single system often has sub-sections the data flows into (e.g. the APR Dashboard has a Client Intake block and a Job Prep block; Valcre has tabs).
3. **Propose the shots BEFORE shooting.** Write out exactly which screenshots, where, and what each will capture — zoomed back enough to show all fields, never one-shot-per-field. Get sign-off.
4. **Do a quick live look** at the trickiest stop (usually Valcre) to lock the exact framing and final shot count.
5. **Capture** the filled-in screenshots into the shared folder.
6. **Hand to the UI designer** with a prompt to arrange them side-by-side by category on the Paper canvas.

This document is the resource we reuse + refine each time.

---

## The stops (this job)

```
Client Intake  →  APR Dashboard  →  ClickUp     →  Valcre
   (form)          (Section 1 +       (task w/        (job tabs)
                    Section 2)         synced fields)

                 APR Dashboard  →  LOE preview  →  Created LOE (e-sign)
```

- **Client Intake (form)** — where the client first enters data. Optional first shot (the true "start").
- **APR Dashboard** — the working record. Two areas the data flows into:
  - **Section 1 — Client Intake block** (who/what)
  - **Section 2 — Job Prep block** (the appraisal-prep fields that feed Valcre + the LOE)
- **ClickUp** — task tracking. The synced field set lands on the job's task per the new design.
- **Valcre** — the appraisal system of record. Job data lives across a few tabs (Dates / General-Report / Custom Fields).
- **LOE** — the engagement letter branch. Same job's data populates the preview, then the generated letter that goes to e-signature.

---

## The shot plan

### Block 1 — APR Dashboard (the source)

- **Shot 1** — Client Intake block (Section 1), filled in.
- **Shot 2** — Job Prep block (Section 2), filled in.
- *(Optional Shot 0 — the intake form itself, as the true entry point.)*

### Block 2 — ClickUp (destination 1)

- **Shot 3** — the job's ClickUp task showing the synced fields per the new design. One shot; two if the field panel runs long.

### Block 3 — Valcre (destination 2)

**Confirmed by live look + capture (2026-06-04):** the Valcre JOB tab is *not* separate tab-pages — it's **one scrolling page with collapsible sections**, stacked vertically: General · Dates · Report · Staff · Permissions · Comments · Custom Fields. At a **wider/zoomed-back view (1700px)** the sections render two-column and compact — so the whole job collapses to just **2 clean shots** (matches the "two or three, zoomed back" preference):

- **Valcre Shot 1 — `03-valcre-01-general-dates-report.png`:** General + Dates + Report + Staff in one frame. Captures Job Number (VAL261101), Job Name, Subject Property (Westside Mall), Authorized Client (*Edward Johnson / Evergreen Holdings*), Status, Fee/Retainer; all dates (Bid 2026-03-15, Awarded 2026-03-20, Date of Value 2026-04-01); Report Format (Restricted Appraisal Report), Authorized Use (Financial Reporting), Scope, Analysis Level, Purpose (Fee Simple Interest); Primary Appraiser.
- **Valcre Shot 2 — `03-valcre-02-custom-fields.png`:** Custom Fields, both columns. Captures Valuation Premise 1 (As Is), Valuation Premise 2 (As Stabilized), Transaction Status (Under Contract), Zoning Status (Legal Conforming). *(Empty custom fields — Tenancy, Improvements, Property Subtype, Land Metric, Assignment Type, Value Timeframe, Approaches to Value — are job-prep fields not yet wired/held.)*

> Permissions and Comments carry no structured synced dashboard data. Nothing we sync to Valcre lives outside these 2 shots = the complete Valcre picture.

### LOE branch (same job)

- **Shot 5** — APR Dashboard LOE **preview**, data populated.
- **Shot 6** — the **created LOE** ready for e-signature.

---

## Sync Verification (the field-level proof step)

The visual board proves the data *appears* in each system. The **Sync Verification Report** proves
each field actually *landed* in its correct destination — the rigorous, readback-verified layer of
end-to-end testing. Two paired docs, both QA-owned, run together:

- **[Auto-Sync Wiring Map](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/AUTO-SYNC-WIRING-MAP.md)** — HOW each dashboard field is wired + routed to its Valcre target (react-spec wires from it).
- **[Sync Verification Report](~/Development/APR-Dashboard-v3/Data-Flow Visuals/02-SYNC-VERIFICATION-RESULT.md)** — the per-field PASS/FAIL scorecard with Valcre `GetValues` readback proving it landed (never trust HTTP 200). The ClickUp leg = `04-CLICKUP-CUSTOMFIELD-SYNC-RESULT.md`.

Run order: wire from the map → change the field on the dashboard → readback from the destination →
record PASS/FAIL + screenshot in the report. Re-run the report whenever sync wiring changes — it's
a living report, same as the canvas board.

## Canvas Home (the living board)

The assembled data-flow board lives on Paper:

- **File:** `Build Workflow Testing`
- **Page:** `APR Workflow`
- **Board:** `DATA-FLOW BOARD — VAL261101 (Westside Mall)` — below the "APR Dashboard Below" divider; the LOE assets sit above it on the same page.

This is the living layout. When any stage changes (a field added, a sync re-wired, a render
tweaked), QA re-captures the affected shot and ui-designer swaps it on this board — the board
always reflects current reality, not a one-time snapshot.

## Where the screenshots go

- **Shared record (this folder):** `~/Development/APR-Dashboard-v3/Data-Flow Visuals/screenshots/`
- **Paper-canvas renderable copy:** the Paper canvas only renders images saved under `~/Development/KM-Exp/data/screenshots/`. Final PNGs are captured there (subfolder per job, e.g. `data-flow-westside-mall/`) and mirrored into the shared folder above.

Naming convention: `dataflow-<job>-<NN>-<stop>-<area>.png`
e.g. `dataflow-westside-01-dashboard-intake.png`

---

## Hand-off to UI designer

Once captured, the UI designer receives the screenshots folder + a prompt to lay them out on the Paper canvas **side-by-side by category**, left→right in flow order:

`Intake → Job Prep → ClickUp → Valcre → LOE/e-sign`

Uniform sizing, labeled per stop, grouped — so the whole journey reads as one visual board. This sits **beside the LOE flow** so both data paths (system sync + engagement letter) are visible together.

---

## Refinement log

- **2026-06-04** — v0.1 created. First diagram = Westside Mall job. Shot plan proposed; Valcre count to be locked after a live look.

---
title: "PRD Brief — APR-V4-01 — V3→V4 Transition Readiness, Part 1"
type: prd-brief
status: pending-lock — filled in full once Ben locks the PRD (after drawn options + qa spec-gate)
created: 2026-07-09
updated: 2026-07-09
prd: "~/Development/APR-Dashboard-v3/docs/Architecture/PRD-APR-V4-01.md"
author: frontier-reviewer (PRD-AUTHOR mode, with Ben)
owner: co-architect (from lock onward)
verifier: qa-agent
description: "One-page job brief pairing with PRD-APR-V4-01 — the at-a-glance home: goal, done-bar, key docs, how it works, where it stands."
---

# PRD Brief — APR-V4-01 — V3→V4 Transition Readiness, Part 1

**PRD:** [PRD-APR-V4-01.md](~/Development/APR-Dashboard-v3/docs/Architecture/PRD-APR-V4-01.md) · **Owner:** co-architect · **Verifier:** qa-agent · **Updated:** 2026-07-09

## Goal

Make the v4 report builder's test surface honest and the V3→V4 handoff provable, and give client files a live home. Split the one flood-everything test fill into two buttons — V4-only fields, and V3-origin tabs fed by the exact same fixed dataset the V3 app uses — then prove the real Create-Report push by comparing it field-for-field against that baseline. Turn the S3 Client Documents tab into the job's actual SharePoint folder buckets (exact names, contents visible, drag-and-drop upload), including an unsorted inbox for files the client attached at intake that can be dragged into the right bucket.

## Success looks like

Filling V4 test data never touches the V3 tabs; filling V3 test data puts in exactly what the V3 app's own fixed dataset says; a real job pushed from V3 lands identical to that baseline with any difference reported loudly; a file dropped on a bucket in the browser shows up in that folder on SharePoint; and the client's intake attachments sit in a visible inbox until someone files them — with the v3 dashboard's existing document view untouched throughout.

## Key docs & links

- **PRD** → ~/Development/APR-Dashboard-v3/docs/Architecture/PRD-APR-V4-01.md
- **Parent plan** → ~/Development/APR-Dashboard-v3/docs/Architecture/V4-COMPLETION-PLAN.md
- **Alignment delta (chunk-0 dependency)** → ~/Development/APR-Dashboard-v3/docs/Architecture/V3-V4-FIELD-ALIGNMENT-DELTA.md
- **SharePoint/folder ground truth** → ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md (Live Parts 2b)
- **INV-4 test procedure** → ~/Development/APR-Dashboard-v3/docs/Features/07-Report-Builder/E2E-TEST-WORKFLOW-FIX5.md
- **Drawn layout options (Visual Spec)** → pending (ui-designer via co-architect)
- **Close-out audit** → pending

## How it works (one pass)

One fixed V3 test dataset is defined once and travels the same two mappings a real job travels (form→database→report fields), so the v4 fill can never drift from the V3 app. The transition proof runs the same dataset in by both routes — the fill button and a real pushed job — and diffs the result per field. The S3 tab reuses the app's existing SharePoint code (the folder-create feature's library) to list and upload; sorting an intake file copies it to the right SharePoint folder and marks it filed, never deleting the original.

## Steps / where it stands

1. ☑ PRD drafted (frontier-reviewer with Ben) + hardened by plan-mode deep review (code-trace receipts inside the PRD)
2. ☐ Drawn layout options for S3 + button placement (ui-designer via co-architect); Ben picks
3. ☐ qa spec-gate
4. ☐ Ben LOCKS → this brief gets its final fill
5. ☐ Build chunks (after the S1/S2 alignment slice lands — chunk-0 dependency)
6. ☐ qa verify on live apr-v4 + diff artifact + SharePoint round-trip proof
7. ☐ Close-out audit + Part 2 (client upload page + follow-up email) picks up KR6

## Ben's notes

- S3 buckets must carry the exact SharePoint folder names; open pick at draw time: full folder set vs client-supplied-first layout.
- The client upload page + follow-up email is the real goal — Part 2, declared and never dropped.

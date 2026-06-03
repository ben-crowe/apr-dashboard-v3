---
content_type: board-assessment
status: draft
phase1_prep: true
ingest_proposed: false
ingested: false
tags: [apr-board, cleanup, triage, report-builder, field-work]
created: 2026-06-03
author: co-architect
board: list_apr_dashboard
---

# APR Board Cleanup Assessment — 2026-06-03

#apr-board #cleanup #triage

Per-task triage of the active groups, with full session context. **Nothing changed yet — this is for Ben to confirm before any delete/move.** Key frame: the board mixes TWO phases — the **light APR Dashboard (current)** and the **Report Builder (Phase 2, the bigger system)**. RB tasks are legit future work, NOT junk.

Verdicts: **ACTIVE** (current-phase, live) · **RB-PHASE2** (keep, future) · **DONE** (close/move to Done) · **REMOVE** (empty/dead) · **BACKLOG** (real but not now) · **DEBT** (small tech-debt).

## INBOX (13)
| Task | Verdict | Why |
|---|---|---|
| INBOX-APR.DomAgent | REMOVE? | generic catch-all seed, not a real task |
| LOE Temp. Changes | ASK BEN | no description — open or done? |
| Conditional Field Picker — Files for Claude Desktop | ASK BEN | no desc, unscoped backlog |
| APR test data file + video QA flow — reusable e2e testing | ACTIVE | ties directly to the E2E testing we started today — keep |
| **VALTA Field Spec — 13 missing fields + 3 dropdown fixes** | **ACTIVE (lead)** | THE current field work — update with the Delta + job-prep field map |
| Fix fieldRegistry.ts sync set header (3→4 file) | DEBT | part of field work |
| Settle field count across all docs (actual 2,082) | DONE | already reframed to 2,082 across 5 docs (apr-domain #18) — close |
| Investigate/remove duplicate report-builder in image-configurator | ACTIVE | confirmed duplicate exists; real cleanup |
| Remove backup files (.bak/.backup) in report-builder | DEBT | real cleanup |
| Create docs/README.md index | BACKLOG | doc hygiene |
| Clean up 07-Report-Builder docs (70+ files) | BACKLOG | doc hygiene (RB-phase docs) |
| Console.log cleanup in ClickUpAction.tsx | DEBT | react-spec touched this file today — fold in |
| New PRD | REMOVE | empty placeholder |

## PRD (8)
| Task | Verdict | Why |
|---|---|---|
| Report Builder DB Integration — full spec | RB-PHASE2 | keep |
| Dashboard → Report Builder Route Integration | RB-PHASE2 | keep |
| Data Bridge: job data → Report Builder Home | RB-PHASE2 | keep |
| Field Crosswalk: 43 Valta ↔ 2084 fieldRegistry | DONE | the crosswalk NOW EXISTS = VALTA-MASTER-DELTA-2026-05-14.md. Its "no crosswalk doc exists" premise is resolved — close/point at the Delta |
| Cascade Logic React Integration Spec | RB-PHASE2 / ACTIVE | cascade logic — relates to field work + RB; keep |
| SharePoint File Storage Integration | BACKLOG | needs Ben creds |
| Interactive Field Mapping Tool (HTML Prototype) | ASK BEN | v6 explorer may already cover this — verify before keeping |
| Resources UX migration + 45.A audit summary | DONE? | May 13 Resources work — likely shipped; verify + move to Done |

## APPROVED (2) — both RB-PHASE2 (the next-phase blockers, keep)
| Task | Verdict |
|---|---|
| Create `report_builder_data` table + migration | RB-PHASE2 (the gating blocker) |
| Auto-save 2-second debounce | RB-PHASE2 |

## BUILDING (1)
| Task | Verdict | Why |
|---|---|---|
| [unknown — needs Ben input] | REMOVE | empty placeholder; nothing actually in-flight |

## QA (3) — all ACTIVE (real pending bugs)
| Task | Verdict |
|---|---|
| Select trigger text indent on long values | ACTIVE bug |
| Client Comments textarea not editable | ACTIVE bug |
| Form intake page — apply same layout as dashboard | ACTIVE |

## Proposed actions (on Ben's OK)
1. **Add a new task (ACTIVE):** "Add 12 new Valta fields to job-prep area" → points at `JOB-PREP-FIELDS-MAP-2026-06-03.md` + the Delta. This is today's field work.
2. **REMOVE empties:** "New PRD", "[unknown] Building placeholder", maybe "INBOX-APR.DomAgent".
3. **CLOSE (→ Done):** "Settle field count" (done), "Field Crosswalk" (Delta is the doc now), likely "Resources UX migration".
4. **TAG the Report-Builder tasks as Phase-2** so the board visibly separates the light-version current work from the bigger RB phase (fixes the "what's current vs next" confusion).
5. **Confirm ASK-BEN items:** LOE Temp Changes, Conditional Field Picker, Interactive Field Mapping Tool.

## Group entry-rules (proposed — confirm before re-sorting)
- **Inbox** = raw triage, unscoped
- **PRD** = being specced
- **Approved** = ready-to-build = **what's NEXT**
- **Building** = in-flight = **what's CURRENT** (keep 1–2)
- **QA** = verify
- **Done** = shipped
- **Resources** = reference, not work
- **Phase-2 tag** = Report Builder (next system, not the light version)

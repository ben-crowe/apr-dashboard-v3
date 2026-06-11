---
content_type: phase-sheets-dashboard
title: APR Phase Sheets — Mini Dashboard
status: living index — one front door for every phase sheet; add new sheets here as they land
created: 2026-06-11
owner: co-architect (maintains with Ben)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, phase-sheets, stage-anatomy, mini-dashboard, index, navigation]
---

# APR Phase Sheets — Mini Dashboard

**Tags:** #apr-workflow #phase-sheets #stage-anatomy #mini-dashboard #index
**Entities:** [[APR-Testing]]

**What this is:** the single front door for the APR pipeline phase sheets. One file — open it, click into any phase. Each phase has its own deep sheet (the "Stage Anatomy" page) built from the same template. New phase sheets get linked here as they land, so you only ever manage this one file.

---

## The phases — click to open each

| # | Phase | What it covers | Open the sheet |
|---|---|---|---|
| 1 | **Client Submission** | The intake form — what the client fills, every field, where it lands. | [Phase 1](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-1-CLIENT-SUBMISSION.md) |
| 2 | **Form Received** | The submit fan-out — Supabase row + dashboard job + ClickUp notification + thank-you email. | [Phase 2](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-2-FORM-RECEIVED.md) |
| 2B | **LOE Prep + Gating** | The two gates: fill the prep fields → Create Valcre Job → job number unlocks the LOE/e-sign button. | [Phase 2B](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-2B-LOE-PREP-GATING.md) |
| 3 | **Valcre Job Creation** | Creating the real Valcre job (the good path vs the dead "Send to Valcre" path). | [Phase 3](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-3-VALCRE-JOB-CREATION.md) |
| 4 | **LOE Render** | Building the LOE document — template, cascade, coverage gate. | [Phase 4](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-4-LOE-RENDER.md) |
| 5 | **LOE Send + E-Sign** | Sending the LOE for signature via DocuSeal; email = the BC CLI suite. | [Phase 5](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-5-LOE-ESIGN.md) |
| 6 | **Sign → Triggers** | What fires the moment a client signs — signed date, status flip, ClickUp stamp. | [Phase 6](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-6-SIGN-TRIGGERS.md) |
| 7 | **Asset Folders** | The per-job SharePoint folder set (via the Microsoft folder app). | [Phase 7](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-7-FOLDERS.md) |
| 8 | **QuickBooks Closing** | The closing flow — invoice on sign, receipt on pay, status to paid. | [Phase 8](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-8-QUICKBOOKS-CLOSING.md) |

---

## The template — what every phase sheet explains

Every phase sheet is built from one standard shape, so they all read the same way. Open the template itself here:

[Stage Anatomy Template](~/Development/APR-Dashboard-v3/tests/phase-sheets/_STAGE-ANATOMY-TEMPLATE.md)

**Two rules that make a phase sheet readable:**
1. **Index at the very top** — click any line, jump to that section.
2. **Goal first, current state second** — every section leads with what we WANT, then a "Current state" block on what's true today.

**The twelve things a single phase sheet answers:**

| # | Section | The question it answers |
|---|---|---|
| 1 | What it is | What is this phase, and where does it sit in the pipeline? |
| 2 | Where it lives | Where to look at it AND test it — local + live URLs + the code. |
| 3 | The fields / data | What fields/data this phase involves. |
| 4 | Data flow in → out | Where the data comes from and where it goes next. |
| 5 | Trigger / gating logic | What fires this phase and what gates it. |
| 6 | User + agent flow | How a person uses it, and how an agent drives it. |
| 7 | Tools / CLIs | What we can use to do this phase's work. |
| 8 | Test + verify | How we prove it actually works. |
| 9 | Goal vs current state | What we want vs what's true today. |
| 10 | Known bugs / to-build | What's broken or missing, each routed to an owner. |
| 11 | Production wiring / cutover | Where it goes live and how we switch from test to client. |
| 12 | Sources | Where each fact was verified, so nothing's a guess. |

---

## How we use this

- **You:** open this one file, click into whichever phase you want as a tab. Keep it pinned in your viewer.
- **Me:** every new phase sheet or template change gets linked here the moment it lands, so this stays the one front door. You manage one file; I keep it current.

---

**Last reviewed:** 2026-06-11 by co-architect — created as the mini-dashboard front door for the APR phase sheets (the renamed Stage Anatomy set). Links to all nine phase sheets + the template, plus the twelve-section explainer of what a single phase sheet covers.

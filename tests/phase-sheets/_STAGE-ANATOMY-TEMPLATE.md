---
content_type: stage-anatomy-template
title: Stage Anatomy — the standard page template (every stage/phase is built from this)
status: LIVE template — copy this for each new stage sheet; add notes here as we discover new standard parts
created: 2026-06-11
owner: co-architect (maintains the template) · whoever authors a stage sheet builds from it
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, stage-anatomy, template, system-flow, user-flow, data-flow, testing, repeatable-pattern]
---

# Stage Anatomy — Standard Page Template

**Tags:** #stage-anatomy #template #system-flow #user-flow #data-flow #repeatable-pattern
**Entities:** [[APR-Testing]]

**What this is:** the canonical shape for a "Stage Anatomy" page — one page per stage/phase of an app-to-app system. It is NOT just a test sheet: it documents how the stage actually works end to end — **user flow, data flow, trigger logic, our capabilities, testing, build state, and the production path** — with testing as one of its twelve answers. Copy this template for each new stage; fill every section; add notes to THIS file as we discover new standard parts.

## How to use it (the two rules that make it readable)
1. **Index at the very top** — numbered, each entry jumps to its section. A reader scans the index and knows what the page answers.
2. **GOAL first, CURRENT STATE second** — in every section, lead with what we WANT, then a "Current state:" block on what's true today. Never lead with a backwards "what it is today" explanation. Goal → current → stop.

---

## Index (copy into every stage sheet)
1. [What it is](#1--what-it-is)
2. [Where it lives](#2--where-it-lives)
3. [The fields / data](#3--the-fields--data)
4. [Data flow in → out](#4--data-flow-in--out)
5. [Trigger / gating logic](#5--trigger--gating-logic)
6. [User + agent flow](#6--user--agent-flow)
7. [Tools / CLIs for this phase](#7--tools--clis-for-this-phase)
8. [Test + verify](#8--test--verify)
9. [Goal vs current state](#9--goal-vs-current-state)
10. [Known bugs / to-build](#10--known-bugs--to-build)
11. [Production wiring / cutover](#11--production-wiring--cutover)
12. [Sources](#12--sources)

---

## 1 — What it is
*The question: what is this stage, and where does it sit in the pipeline?*
One line of plain definition + where it falls in the phase sequence (what comes before, what comes after).

## 2 — Where it lives
*The question: where is it — to look at AND to test?*
- **Local URL** (agent-controllable dev) + how to start it.
- **Live / production URL.**
- **Code locations** — the components, hooks, edge functions that ARE this stage.

## 3 — The fields / data
*The question: what fields/data does this stage involve?*
The full field table (label · React name · type · options · required · maps-to), OR — preferred when a canonical map exists — a **pointer to the one source-of-truth field map** + the subset that matters here. Don't re-type a table that already exists; point to it.

## 4 — Data flow in → out
*The question: where does the data come from, and where does it go?*
What lands in (from the prior stage), what each field maps to (DB column / API field), and what goes downstream to the next stage.

## 5 — Trigger / gating logic
*The question: what fires this stage, and what gates it?*
The triggers, button enable/disable conditions (found in real code — quote the condition), the chain to the next stage. **This is the user-flow + data-flow heart of the page.**

## 6 — User + agent flow
*The question: how does a PERSON use it, and how does an AGENT drive it?*
The human path (buttons, clicks, the order) AND the agent path (the test-data fill, the cascade, never-hand-fill rules, the exact command sequence).

## 7 — Tools / CLIs for this phase
*The question: what can we use to do this work?*
The capability reminder — which CLIs/skills cover this stage's activities (e.g. /cli-apr-tools, /cli-clickup-tools, the BC email CLI, agent-browser, the deploy skills, Codex only for login-gated UI). Tailored to this stage.

## 8 — Test + verify
*The question: how do we prove it actually works?*
The test protocol, the evidence required (screenshots in → action → out), the gates each must pass, capturer≠verifier.

## 9 — Goal vs current state
*The question: what do we want, vs what's true today?*
**Goal** (what done looks like) then **Current state** (verified ground-truth — what works, what's only partial). Honest separation.

## 10 — Known bugs / to-build
*The question: what's broken or missing?*
Real bugs (with root cause if known) + the named build tasks. Each routed (which agent/owner fixes it).

## 11 — Production wiring / cutover
*The question: where does this go live, and how do we switch?*
The test→production path — what's on Ben's test accounts vs the client's, the exact IDs/locations, the cutover step, what "rebuild exact" requires.

## 12 — Sources
*The question: where was each fact verified?*
The files / code / docs each fact came from, so nothing on the page is a guess.

---

**Last reviewed:** 2026-06-11 by co-architect — the standard Stage Anatomy page template; twelve sections, index-led, goal-first. Add notes here as new standard parts emerge across stage sheets.

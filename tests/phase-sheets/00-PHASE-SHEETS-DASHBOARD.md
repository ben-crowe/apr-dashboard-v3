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

**↑ Home:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) — the project front door + running edit area.

**Tags:** #apr-workflow #phase-sheets #stage-anatomy #mini-dashboard #index
**Entities:** [[APR-Testing]]

**What this is:** the single front door for the APR pipeline phase sheets. One file — open it, click into any phase. Each phase has its own deep sheet (the "Stage Anatomy" page) built from the same template. New phase sheets get linked here as they land, so you only ever manage this one file.

---

## ✅ Check Sheet — every phase's parts, from the outside

Each phase's sub-parts as simple checkboxes — `[x]` done · `[ ]` not yet. See status at a glance here; click the phase heading to go deep.

:::details{.boxed summary="✅ Phase 1 — Client Submission  ·  click to expand the full check sheet"}

**Deep sheet:** [Phase 1 — Client Submission](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-1-CLIENT-SUBMISSION.md)

**Form loads & renders**
- [x] Loads on local dev (port 8086)
- [x] Loads on the live website (Vercel)
- [x] All four sections visible (Client · Property · Documents · Additional Info)
- [x] "Test Data" auto-fill link present (top-right of form)

**Client Information fields land correctly**
- [x] First Name
- [x] Last Name
- [x] Client Title
- [x] Client Company Name
- [x] Client Phone
- [x] Client Email
- [x] Client Organization Address

**Property fields land correctly**
- [x] Property Name
- [x] Property Address

**Optional Property Contact fields land correctly**
- [x] Contact First Name / Department
- [x] Contact Last Name
- [x] Contact Email
- [x] Contact Phone

**Classification dropdowns — value real, not desynced**
- [x] Property Type (saves the picked option)
- [x] Authorized Use (correctly stored as the internal "intended use")
- [x] Valuation Premises
- [x] Asset Current Condition
- [x] All dropdowns confirmed by submit + read-back, not just by looking

**Documents & notes**
- [x] File upload accepts multiple files
- [x] Uploaded files saved and linked to the job
- [x] Additional Information / notes saved
- [ ] File-attach "it worked" signal is obvious in dark mode

**Submit behavior (today)**
- [x] Submit creates the job record
- [x] Job marked "submitted"
- [x] Success screen appears
- [x] Every field stored in the correct place (all fields read back exact)
- [x] Submitted data shows in the dashboard Client section
- [x] Uploaded files show in the dashboard Documents section

**Submit auto-chain (to build — the goal)**
- [ ] Submit auto-creates the ClickUp job card
- [ ] Client data piped into the ClickUp card's fields
- [ ] ClickUp card exists the instant the form is submitted (no human step)
- [ ] Submit auto-sends the client a thank-you email
- [ ] The email never blocks or delays the success screen

**Live Valta website form (the real client form)**
- [x] Live form feeds the same database as our test form
- [ ] Live form fields kept identical to our test form (drift guard)
- [ ] Live form triggers the full pipeline (today it only sends an email)

**Known bugs to watch (downstream Create-Job step)**
- [ ] "Create Valcre Job" shows success feedback / flips to "View in Valcre"
- [ ] ClickUp update works from local dev (no "Failed to fetch")
- [ ] "Create" button disables while running (no accidental double job)
- [ ] Valuation Premises carries through so the "Create" button isn't stuck disabled

**Evidence captured**
- [x] Blank form screenshot
- [x] Filled form screenshot
- [x] Success screen screenshot
- [x] Dashboard Client section screenshot

**Polish / enhancements**
- [ ] Friendly job reference shown instead of the raw database ID
- [ ] Clearer file-attach confirmation

:::

:::details{.boxed summary="✅ Phase 2 — Form Received  ·  click to expand the full check sheet"}

**Deep sheet:** [Phase 2 — Form Received](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-2-FORM-RECEIVED.md)

**The submit chain — one submit should fire four things**
- [x] Supabase job record created, every field in the right place
- [x] Record marked "submitted" + tagged as coming from the web form
- [x] Attached files land in storage, the files table, and the dashboard list
- [x] Dashboard job appears automatically (the record IS the job)
- [ ] ClickUp card auto-created on submit (today it's a manual button — to build)
- [ ] Client data piped into the ClickUp card's fields
- [ ] Client thank-you email auto-sent (today: promised on screen, nothing sends — to build)
- [ ] A failed email never blocks the client's success screen

**ClickUp card details (when it fires)**
- [ ] Card name starts as "PENDING - Property, Street, City"
- [ ] Card renamed to "VAL# - address" once the Valcre number exists
- [ ] Rename lands the exact intended format (create-name vs rename-name mismatch to watch)
- [ ] Card carries the "New Arrival" + "APR Hub" tags
- [ ] Card lands on the test list, never the client's live list

**Dashboard Client Information & Property Details section**
- [x] Shows every submitted field, editable
- [x] Fields auto-save on blur
- [x] Once a Valcre job is attached, edits also sync to Valcre
- [x] Label mapping correct (Additional Info → Client Comments, Authorized Use → intended use, Company → Organization)
- [x] Uploaded Documents list shows files (upload / download / view / delete)

**Test → Production cutover (today's action item)**
- [ ] Point ClickUp at the client's live Valta list + token (your go-ahead)
- [ ] Rebuild the task template on the Valta workspace ("Save as Template" — login-gated)
- [ ] Reconcile any hardcoded list IDs to the canonical test list first
- [ ] Confirm the field set copies over by name (no field IDs hardcoded across lists)

**Evidence**
- [x] Screenshot of the dashboard Client section with mapped values
- [ ] Proof the ClickUp card auto-creates on submit (goal)
- [ ] A real thank-you email received and read (goal)

:::

:::details{.boxed summary="✅ Phase 2B — LOE Prep + Cascade + Gating  ·  click to expand the full check sheet"}

**Deep sheet:** [Phase 2B — LOE Prep + Gating](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-2B-LOE-PREP-GATING.md)

> **⚠ Order rule — pick the Cascade scenario BEFORE pressing "Create Valcre Job."** The cascade-derived fields (Value Scenarios, Approaches to Value, Status of Improvements, derived Property Rights) feed Valcre. Press Valcre first and they land blank.

**The six fields that unlock "Create Valcre Job" (Gate 1)**
- [ ] Property Address filled
- [ ] Property Type filled
- [ ] Authorized Use filled
- [ ] Appraisal Fee filled
- [ ] Scope of Work filled
- [ ] Valuation Premises filled
- [x] Gate 1 logic confirmed in code (all six required; disabled tooltip lists the missing ones)
- [x] Force-click guard holds — can't fire a half-empty job

**Cascade Options — set the Status, never hand-type the derived fields**
- [ ] ⚠ ISSUE (open): agent can't drive the cascade picker headlessly today — worked yesterday, broke today (Ben does the click for now; see Change Requests)
- [ ] Pick a cascade version (V1 Completed · V2 Under Renovation · V3 Demolition/Land · V4 Insurance)
- [ ] Picking sets Status of Improvements automatically
- [ ] Value Scenarios auto-derive and lock read-only after the pick
- [ ] Approaches to Value auto-derive
- [ ] Version overrides apply (e.g. V4 forces Insurance + Insurable Value + Cost Approach)
- [ ] The cascade-derived fields actually reach Valcre (the live end-to-end being verified now)
- [ ] "Scoped Clear" resets only the cascade fields, nothing else
- [x] Cascade mechanism confirmed in code

**Gate 2 — the Valcre job number unlocks the LOE / e-sign button**
- [x] Gate 2 confirmed in code (no job number → the e-sign button doesn't even render)
- [ ] A real Valcre create writes the VAL number back to the job
- [ ] "Preview & Send LOE" button appears after the write-back
- [ ] Missing client basics keep it disabled with a tooltip
- [ ] Don't use the fake-job-number test shortcut for a real gate test (it skips Gate 2)

**Verify each gate (need both the data read AND the button pixel)**
- [ ] Gate 1: button disabled with one field blank, tooltip names it
- [ ] Gate 1: button enables when all six are present (screenshot + record read)
- [ ] Gate 2: e-sign button absent before create, present after (screenshot before/after)
- [ ] Real clicks + real keystrokes only (fake JS fills silently false-pass)

:::

---

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

## Change Requests — by part

Documented changes a phase still needs. Each one is a real change request; click to open the full spec. New ones get added here as they come up, filed under their phase.

| Phase | Change request | Status |
|---|---|---|
| 2 — Form Received (ClickUp) | [Move job data into CUSTOM FIELDS, not the description](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20%26%20Client%20Mgt./CHANGE-REQUEST-clickup-custom-fields.md) — table view only shows custom fields, so all links/dates (LOE Sent/Signed, Date Received, the hyperlinked Valcre Job field, client phone, property rights + the unmapped rest) must move off the description. | OPEN |
| 2B — LOE Prep (Cascade) | **Agent can't drive the Cascade scenario picker headlessly.** The Radix "Cascade Options" dropdown won't open in QA's headless browser — click-by-ref, keyboard route, and screenshot-check all failed, options come back empty. **Regression — QA drove it fine yesterday, can't today.** Forces Ben to do the one cascade click by hand mid-test. Fix: a reliable way to open + pick a scenario headlessly (or a CLI that sets the cascade version directly). | OPEN |
| 1 / 2B — Intake (Subtype + Tenancy) | **Property Subtype + Tenancy are orphaned in Section 2 — they belong in Section 1 (client).** Confirmed three ways: (1) QA — they render ONLY in Section 2 (LOE Quote), absent from Section 1 + the client form; (2) co-arch — no cascade sets them, nothing feeds them, so always blank on "Select"; (3) **client registry (v03) — both are "User Input" fields, Subtype grouped under *Property* alongside Property Type (a client intake field).** They feed Property Rights and Tenancy syncs to Valcre. **Fix:** add Subtype + Tenancy to the client form + Section 1, store on property-info, have Section 2 PULL from Section 1 (not be the input); also align the app's Tenancy options to the client's list (missing "Partial Owner Occupied" + "Unkown") so the Property Rights auto-set stops misfiring. Owner: co-arch. **DECISION LOCKED (Ben, 2026-06-11): both are client-sourced — the building owner is the only one who knows tenancy/subtype, the appraiser can't. → belong on the client form + Section 1, Section 2 pulls from there. Ready to build.** | DECIDED — ready to build |

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

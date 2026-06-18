---
content_type: change-request
title: "Change Request — ClickUp Card: move job data into CUSTOM FIELDS (not the description)"
status: OPEN — requested by Ben 2026-06-11; field-by-field mapping being detailed by qa-agent + subagent
created: 2026-06-11
owner: qa-agent (mapping spec + build) · co-architect (this CR) · Codex (builds the matching fields on the client's live ClickUp)
home: ~/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./CLICKUP-SYNC-CANONICAL.md
tags: [apr-workflow, clickup, custom-fields, change-request, job-hub, cutover]
---

# Change Request — ClickUp Card: data belongs in CUSTOM FIELDS, not the description

**Tags:** #apr-workflow #clickup #custom-fields #change-request
**Entities:** [[ClickUp-Sync]]

**Requested by:** Ben, 2026-06-11, during the Phase 2 ClickUp cutover.
**Canonical feature doc this amends:** [ClickUp Sync — Canonical](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20%26%20Client%20Mgt./CLICKUP-SYNC-CANONICAL.md)

---

## The principle (why this change exists)

**ClickUp's table/board view only renders CUSTOM FIELDS — it never shows the task description.** So any piece of job data that lives only in the description is invisible the moment the team works in a table or board view, where they actually live.

**Rule of thumb (locked):** anything in the description — especially links and dates — MUST also exist as a custom field. The custom field is the source of truth and the only thing that shows in a column; the description stays as a light, eye-catching quick-read summary, nothing more.

**Net effect:** most of the current `📍 NEW APPRAISAL REQUEST` description block gets scrapped. Its links and dates move into custom fields; the description shrinks to a short human summary.

---

## Goal

Every job value the team needs to see, filter, or click in ClickUp is a **custom field** on the card. The description is a duplicate summary only — never the only home for any data.

## Current state

The auto-created card carries the core submission data in custom fields (client name, email, organization, property name/address/type) and round-trips to the dashboard job. **But a large set of fields is still description-only or unmapped** — so they don't show in table view. This CR closes that gap.

---

## Fields to ADD / MAP to custom fields

Named so far (qa-agent to complete the full field-by-field sweep against the submission field list):

| Field | Type | Notes |
|---|---|---|
| **Client phone** | text/phone | Currently unmapped — add. |
| **Property rights** | text/select | Currently unmapped — add (confirm option set). |
| **LOE Sent** | date | Currently a description line only → date custom field. |
| **LOE Signed** | date | Currently a description line only → date custom field. |
| **Date Received** | date | **Rename** from "Date Ordered" → "Date Received" (clearer). Date custom field. |
| **Valcre Job** | text + hyperlink | ONE field doing double duty — the job number rendered as a **hyperlink to the Valcre file.** Shows the number AND links to it. Same number that titles the task and that the dashboard job carries. **A separate "Job #: PENDING" line is NOT needed** — the Valcre Job field covers it. |
| **(all other currently-unmapped submission fields)** | — | qa-agent sweeps the full intake field list and maps every relevant one. |

> **The Valcre Job field is the key consolidation:** it replaces the separate "Job #" line. Before the Valcre job exists the card title is `PENDING - {property, street, city}`; once the job is created, the rename step writes the real `{VAL#}` as the title AND the Valcre Job field becomes the hyperlinked job number. One field, both jobs: shows the number, links to the file.

---

## Scope notes

- **Description shrinks, doesn't vanish** — keep a light, eye-catching summary; it's a duplicate convenience, not a data store.
- **Links especially** — every link currently in the description body (Valcre file, dashboard job) must have a custom-field home.
- **Build path:** qa-agent (or a subagent) writes the complete "custom-fields to add/map" spec against the full submission field list, then wires it. This keeps the phase testing moving in parallel.
- **Cutover dependency:** when these fields are finalized on Ben's TEST list, **Codex builds the matching custom fields on the client's live Valta ClickUp** (login-gated UI) so the test→production flip stays a no-code change (point at the Valta list + token).

---

## Definition of done

- [ ] Every named field above exists as a custom field on the card and is populated on submit (or at the Valcre-job step for job-number/LOE dates).
- [ ] "Date Ordered" renamed to "Date Received" everywhere it's written.
- [ ] "Valcre Job" is a single hyperlinked job-number field; the separate "Job #" line is removed.
- [ ] The full submission field list is swept — no relevant field is description-only.
- [ ] Description reduced to a light summary.
- [ ] Matching fields built on the client's live Valta list (Codex) so cutover is a no-code flip.

---

**Last reviewed:** 2026-06-11 by co-architect — authored from Ben's Phase-2 cutover direction. Captures the principle (custom fields show in table view, description does not), the rule of thumb (description data must also be a custom field), and the named fields to add/map. Field-by-field mapping spec to be completed by qa-agent.

---

## ⛔ SUPERSEDED — adopt the CLIENT'S EXISTING fields (Ben, 2026-06-18, later)

> **The lean 18-field redesign below is NO LONGER the plan.** Ben surfaced the client's LIVE Valta custom-field set — we will most likely **adopt the client's existing fields as-is** rather than impose our own. The grouped-18 / number-prefix / divider-header work below is retained as REFERENCE (the grouping ideas may still inform layout), but the field LIST is now the client's. Do not build to the 18-set.

### The client's existing custom fields (captured from the live Valta board, 2026-06-18 — canonical candidate)

The client uses a **decimal section-numbering** scheme (`1.1`, `1.2`, `1.9.1`, `2.2`, `4.5`) as the field-name prefix — their own grouping, not our `01/02`. Captured as-seen (value shown where present):

**Appraisal detail fields**
- `1.1 Property Type` (Multifamily) · `1.2 Property Subtype` (Apartment) · `1.3 Interest Appraised` · `1.4 Authorized Use` · `1.5 State of Improvements` (Existing Property) · `1.6 Status of Improvements` · `1.7 Approaches To Value` · `1.8 Value Scenario(s)` · `1.9 Report Type` (Concise) · `1.9.1 Inspection Date` · `2.2 Transaction Status` · `2.3 Zoning Status` · `4.5 Land $/Metric`

**Phase fields**
- `Phase Owner` · `Work Phase`

**Progress checkboxes + text (the board-column track)**
- `1.1 Client Info Received` · `1.2 Invoice Paid` · `1.3 TTSZ Done` · `2.1 Template Saved` · `2.2 Photos Saved` · `2.3 Comps Provided` · `2.1 - Property Address` · `6.3 - Email Body`

**Other**
- `Notes` · `Task Type`

### RESOLVED (Ben, 2026-06-18) — it's ONE set, mixed field types

- **No secondary structure.** There is NO separate checkbox set and NO separate "workflow steps" track. It's **one unified custom-field set on their list, with mixed types** — some fields are **checkbox-type ON PURPOSE** (Client Info Received, Invoice Paid, TTSZ Done, Template Saved, Photos Saved, Comps Provided) so they render as checkable COLUMNS on the project board (smart board-visibility trick). The detail fields are drop-down / multi-select; dates are Date; etc. **This is it — the whole set.**
- So the earlier "two numbering tracks / reconcile the 9 board steps vs checkboxes" question is **moot** — that confusion was just seeing one mixed-type set.
- **There's nothing to build or migrate** — the set already exists on the client's list AND as a saved TEMPLATE in their templates area (Ben confirming the template). We **tie our integration into their existing list/template** and map onto it.

### Still to do (the only real work)
- **Field-ID inventory** — pull their list's fields (names, types, multi-select options, IDs) so we know what to map to. (API pull on their Valta list, or read from the template.)
- **Map** our outbound data → their existing fields; **add the gaps** they lack (APR Dashboard Link, Valcre Job).
- **Re-point** the webhook token + list at their Valta list; **safe test path** so we don't spam their live board.

---

## (REFERENCE — superseded) AMENDMENT 2026-06-18 (Ben) — TRIM the custom-field list, don't max it out

**Direction shift:** the goal is NOT to mirror every dashboard field into ClickUp. The team will open the **APR dashboard** for full job detail — that's the whole point of the dashboard link. ClickUp is a lightweight "new appraisal request" trigger card: identity + the two jump links + status, nothing quirky. **Any field that is hard to map cleanly, comes through empty, or just isn't worth seeing in a column = REMOVE it from the offered custom-field list rather than chase it.**

> This REVERSES two lines in the "Fields to ADD / MAP" table above: **Property rights** and (as a standalone) **Client phone** are no longer "add" — Property rights is explicitly removed (Ben: "just not necessary"); Client phone is optional-only (keep if trivial, else drop — full contact lives in the dashboard).

### Empirical test (job VAL261065 — Riverside Commerce Centre)

Compared the live ClickUp card's custom fields against the dashboard job. **Empty in ClickUp but filled in the dashboard:**

| ClickUp custom field | Dashboard value | Verdict |
|---|---|---|
| Asset Condition | Good | REMOVE — not column-worthy |
| Client Phone | (403) 555-0142 | OPTIONAL — keep only if trivially mapped |
| Job Status | Pending | KEEP + FIX — this is the workflow signal |
| Report Type | Appraisal Report | REMOVE — view in dashboard |
| Valuation Premises | Market Value | REMOVE — quirky/select, view in dashboard |

**Populated but wrong (don't keep a misleading column):**

| ClickUp custom field | Issue | Verdict |
|---|---|---|
| Property Rights Appraised | Shows "Leased Fee Interest" but the dashboard Property Rights field is BLANK — a stale default, not a live map | REMOVE (Ben) |
| Delivery Date | ClickUp shows the 8th; dashboard says the 10th | REMOVE (see below) |

### Delivery Date — RESOLVED 2026-06-18: it's a weeks NUMBER, not a date

Investigated with Ben. The contract does NOT print an absolute delivery date — it prints **"[DeliveryTime] weeks from date of payment or signed agreement, whichever is later."** So the only thing that flows into the HTML is a plain **number of weeks** (the `[DeliveryTime]` / `deliveryTime` field). There is no delivery-DATE computation in the code, and none is needed.

- **No fix required** — typing `3` into the dashboard's "Delivery Time (wks)" field renders "3 weeks…" in the contract correctly (Ben confirmed live).
- **One default note:** when the weeks field is blank, the code falls back to **"4"** (`generateLOE.ts` `jobDetails.deliveryTime || '4'`). The client's standard is **3 weeks** — so either always populate the field, or flip that default to `3` (deferred — Ben chose to just set the field).
- **History reconciled:** the old V3.1/V3.2 specs DID describe an auto-calculated delivery DATE ("3 weeks / 21 days from Date Received, overridable") — that absolute-date design was never built AND is now moot, because the live contract expresses delivery as relative weeks, not a date.
- **ClickUp (REVERSED 2026-06-18, Ben):** the card SHOULD carry a real **Delivery Date** — but as an **auto-computed actual date**, not a hand-entered field. Compute it from the weeks value: `delivery date = LOE-send date + [DeliveryTime] weeks` (e.g. sent today + 3 weeks). Stamp it onto the ClickUp Delivery Date field at the send trigger. This gives the team a concrete date on the card while the **contract keeps its relative "[X] weeks from payment/signing" wording** (unchanged). ⚠ Base-date to confirm: send date (recommended — concrete + known) vs the contract's payment/signing basis; for an internal card, send-date estimate is fine.

### Field NAMING — number-prefix convention (Ben, 2026-06-18)

We **prefix each custom-field name with a number** (`01 `, `02 `, …) the way the client's existing ClickUp tasks were set up. ClickUp orders fields by name, so a numeric prefix lets us **control the display order** and keep related items grouped — instead of alphabetical. Decide before QA creates the fields, since the prefix is part of the field NAME (renaming later means editing every card). 

**Ben's grouping (2026-06-18) — DATES first (snapshot), then client, property, contact, all grouped by number:**

```
— Snapshot dates (FIRST — Ben: these earn field status; you can sort/filter/trigger on a date field, not on description text) —
01 Received Date        02 LOE Sent          03 LOE Signed        04 Delivery Date (auto-computed)
— Links + ID —
05 APR Dashboard Link   06 Valcre Job        07 Job Number
— Client Information —
08 Client First Name    09 Client Last Name  10 Client Organization   11 Client Email   12 Client Phone
— Property Information —
13 Property Name        14 Property Address  15 Property Type
— Property Contact —
16 Contact Name         17 Contact Email     18 Contact Phone
```

> **The date group is the change here.** `Received Date`, `LOE Sent`, `LOE Signed` (and the auto `Delivery Date`) become real **date fields** at the top — a quick job snapshot. They duplicate info that's also in the template description, and that's fine (Ben): fields do things text can't. **Distinct from the status TAG** — the tag shows current state; these are the actual timestamps. (This is why `LOE Sent`/`LOE Signed` as DATES are kept even though `Job Status` as a field was dropped.)

> `Use` · `Condition` · `Premise` stay **description-only** (dropped as fields, per the earlier trim) — open the dashboard for them. Exact order/grouping is Ben's call; the numeric prefix gives the control.

### LOCKED custom-field set (Ben, 2026-06-18)

**KEEP (18, grouped + number-prefixed per the order above):**
- **Dates:** Received Date · LOE Sent · LOE Signed · Delivery Date (auto-computed)
- **Links + ID:** APR Dashboard Link · Valcre Job (hyperlinked #) · Job Number
- **Client:** First Name · Last Name · Organization · Email · Phone
- **Property:** Name · Address · Type
- **Property Contact:** Name · Email · Phone

**REMOVE (as fields — these live in the description / dashboard):** Asset Condition · **Job Status** (clashes with the status TAG) · Property Rights Appraised · Valuation Premises (Premise) · Report Type · Payment Terms · Scope of Work · Property Use · Condition

### Field TYPES — every ClickUp field IS a type; choose it deliberately (2026-06-18)

A ClickUp custom field is created AS a type and the type is what gives it power (a real **Date** sorts/filters/triggers; a date typed into **Text** does none of that). Locked type per field:

| # | Field | Type |
|---|---|---|
| 10 | ━━ DATES ━━ (header) | **Text, always blank** (the divider hack) |
| 11 | Received Date | Date |
| 12 | LOE Sent | Date |
| 13 | LOE Signed | Date |
| 14 | Delivery Date | Date (auto-stamped) |
| 20 | ━━ JOB ━━ (header) | Text, blank |
| 21 | APR Dashboard Link | URL |
| 22 | Valcre Job | URL ⚠ |
| 23 | Job Number | Text |
| 30 | ━━ CLIENT ━━ (header) | Text, blank |
| 31 | Client First Name | Text |
| 32 | Client Last Name | Text |
| 33 | Client Organization | Text |
| 34 | Client Email | Email |
| 35 | Client Phone | Phone |
| 40 | ━━ PROPERTY ━━ (header) | Text, blank |
| 41 | Property Name | Text |
| 42 | Property Address | Text |
| 43 | Property Type | Text |
| 50 | ━━ PROPERTY CONTACT ━━ (header) | Text, blank |
| 51 | Contact Name | Text |
| 52 | Contact Email | Email |
| 53 | Contact Phone | Phone |

**Header/divider fields** = Text type, left permanently empty, hidden in table/board views, shown in the task-detail field list (the section-title hack, since ClickUp has no native field dividers).

> **Type rule (Ben/QA, 2026-06-18): NO drop-down/select fields — ClickUp is a READ-ONLY MIRROR of the dashboard (no sync-back), so a dropdown's input constraint adds nothing and complicates template import. Everything else KEEPS its natural type** — dates stay Date (for sort/filter/trigger), links stay URL, email stays Email, phone stays Phone. The only change this makes vs the draft: Property Type drop-down → Text. Revisit only if ClickUp ever syncs back to the dashboard.

> ⚠ **Valcre Job type nuance:** a ClickUp **URL** field displays the URL itself, not custom anchor text — so it can't natively show "VAL261065" as the clickable label the way the description link does. Options to decide: (a) URL field (shows the link, not the pretty number), or (b) keep the bare `VAL#` as the **task title** (already the case) + a plain URL field for the Valcre link. Flag for Ben/QA at the gate.

*Removal happens on Ben's TEST list first; Codex mirrors the final lean set on the client's live Valta list at cutover. Logged 2026-06-18 by co-architect from Ben's review during the e-sign one-on-one phase.*

---

## ⭐ STATUS IS A TAG — and the "signed" tag option is missing (2026-06-18)

### The e-sign trigger now works (confirmed live, Ben + QA)

Signing a test LOE now flows all the way through: the DocuSeal webhook fires → the job flips to `loe_signed`, the signed date lands on the job record, and the ClickUp card updates. The earlier dead-end (signing recorded on the signing side but never reached the dashboard) is closed. ✓

### How ClickUp status is actually managed — it's a TAG, not a Status field

The team reads workflow state on the card from its **colored tag pill**, not the native ClickUp Status. Current tags seen on the card: **`new arrival`** (blue) and **`apr hub`** (green, a category — NOT a status). So advancing the workflow means **swapping the status tag** along the canonical pipeline:

```
new arrival → loe sent → loe signed → awaiting payment → paid
```

(`apr hub` stays as a non-status category tag, never part of the swap.)

### THE GAP (what needs changing)

**The pipeline tags don't exist yet** — the tag picker only offers `apr hub` and `new arrival`, so there's nothing for the trigger to switch the tag TO. Two things to do:

1. **Create the pipeline tags** in the ClickUp list/space tag set: `loe sent`, `loe signed`, `awaiting payment`, `paid` (`new arrival` already exists). On the TEST list first; carried to Valta via the template at cutover.
2. **Wire the signed-trigger to swap the tag** — on the signed webhook, remove the prior tag (`loe sent`/`new arrival`) and add `loe signed` (the status-tracker / edge-function side, alongside the existing card update). Today the trigger updates the card but has no pipeline tag to apply.

*Logged 2026-06-18 by co-architect during the e-sign one-on-one phase (Ben's screenshot: tag picker shows only `apr hub` + `new arrival`). QA owns the tag-swap wiring + creating the tag options on the test list.*

---

## ⭐ CUTOVER — move the whole setup into the CLIENT's Valta ClickUp (2026-06-18)

**The real target.** Everything we're building (custom fields + status tags + the status-tag wiring + automations) currently lives in **Ben's** ClickUp account on the TEST list. It all has to end up in the **client's Valta ClickUp workspace** — that's where it actually runs. We should start moving it over soon (once the few remaining fields are mapped). The open question Ben raised: how to get the whole task setup across accounts **without rebuilding from scratch**.

**Options on the table (QA putting a research agent on this):**

1. **Template share/export across accounts** — save the configured task as a ClickUp template and open/import it in the client's Valta account, so the field+tag set carries over. (Best case — least rework; needs verifying ClickUp supports cross-account template sharing.)
2. **Rebuild + rewire** — recreate the fields/tags/automations directly in the Valta workspace. Annoying but always works; some rewiring is likely needed either way (field IDs differ per workspace → the webhook env must point at the Valta list + a valid Valta token).
3. **Codex / computer-use builds it from a detailed prompt** — Codex already created this whole setup once on its own, so a detailed prompt + computer-use could recreate it in the client's account with **no API/CLI work**. Ben's lean: this avoids burning agent time on token/CLI plumbing.

**Gotcha found today (token):** the ClickUp token **hardcoded in the source is DEAD** ("Token invalid"). The working token lives in the **server secrets** (the webhook uses it fine at runtime). So agents can't create ClickUp objects from the client side using the in-code token — either Ben acts in the UI, or a fresh personal API token is supplied. Tags themselves apply fine at runtime via the server's valid token.

**Status right now:** Ben is creating the status tags manually in his account (the in-UI tag box auto-creates them). QA has a research agent on the cross-account migration path. Cutover should begin once the remaining field mappings are settled.

*Logged 2026-06-18 by co-architect from Ben's direction to QA during the e-sign one-on-one phase.*

---

## ⭐ "APR Workflow Steps" — per-job step list (2026-06-18)

**RESOLVED 2026-06-18 (Ben showed the live Valta board):** these are **CHECKBOX custom fields — one column per step, numbered for order**, NOT subtasks and NOT a checklist-inside-a-task. The client's board is one row per job (grouped by priority — Urgent/High/…), with the workflow steps running across as checkbox columns; the team checks each off per job and reads progress straight across the board. Checkboxes (not subtasks) because they render as checkable COLUMNS on the main board — that cross-job, at-a-glance view is the whole point. The number prefix on each checkbox-field name orders the columns. **Checkbox is a boolean type — the "no drop-down/select" type rule doesn't apply to it; checkboxes are correct here.**

⏳ **Exact checkbox field NAMES + numbers: Ben is fetching them from the live Valta board.** The 9 below are the provisional set from Ben's earlier paste — confirm against the board before building.

**Grouped under: "Team Leader"**

```
1. Create & Send LOE
2. Plan Job
3. Pull (TTSZ) Tax, Title, Site Plan, Zoning
4. Tour Property
5. Sale and Lease Comps
6. Build Front End
7. Complete Valuation
8. Send to Client
9. Book Job
```

**Open question (Ben to confirm before build):** are these **subtasks** (each its own ClickUp task under the job, possibly with their own sub-subtasks) or **checklist items** (lightweight, no nesting)? Ben leans subtasks-with-nesting. The answer changes how we generate them per job (subtasks = real task objects via API/template; checklist = a single checklist block).

*Logged 2026-06-18 by co-architect — Ben pasted the step list from the client's ClickUp during the e-sign one-on-one phase. Build deferred until checklist-vs-subtask is decided.*

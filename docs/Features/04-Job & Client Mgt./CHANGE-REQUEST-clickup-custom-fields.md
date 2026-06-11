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

---
title: "Valta Template v2 — custom fields + their drop-down options (mapping reference)"
status: reference (extracted from client's live VALTA JOBS - Temp V2 template, 2026-06-18)
created: 2026-06-18
owner: qa-agent (extracted) · co-architect (formalizes mapping)
description: "The client's actual ClickUp custom fields and their multi-choice options, captured from screenshots — the reference for mapping our integration's outbound data onto their fields."
tags: [apr-workflow, clickup, valta, custom-fields, field-options, mapping, reference]
cognee_ingest: skip
gemini_ingest: skip
gemini_store: ""
---

# Valta Template v2 — fields + options (mapping reference)

**Tags:** #apr-workflow #clickup #valta #custom-fields #mapping #reference
**Backlink:** [Migration Playbook](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/MIGRATION-PLAYBOOK-clickup-to-valta.md)
**Shots:** `~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/assets/clickup-shots-fields/`

> Source: the client's live **VALTA JOBS - Temp V2** task template. Their model: **Custom Fields = job details · Subtasks = to-do items · Checklists = report workflow.** Most option-list fields are **the appraiser team's own selections** — our integration does NOT write them. (`6.3 Email Body` dropped per Ben — not used.)

---

## What OUR integration actually writes (the only mapping that matters)

| Our data | → Their field | Type | Option-match needed? |
|---|---|---|---|
| Client name (first+last combined) | `1.0 - Client Full Name` | text | no |
| Client email | `1.5 - Client Email` | text | no |
| Property name | `2.0 - Property Name` | text | no |
| Property address | `2.1 - Property Address` | text | no |
| Property type(s) | `1.1 Property Type` | **multi-select** | **YES — must match their options (below)** |
| Workflow state | **Tags** (not a field) | tag | the 5-tag pipeline |
| LOE dates · dashboard link · Valcre link | **(add to v2 — they have none)** | date / URL | n/a (ours) |

**`1.1 Property Type` options (our value must match one of these):** Multifamily · Self Storage · Retail · Industrial · Land · Office · Hotel · Senior · Other. *(Multi-select — fits our intake's multi-type array.)*

---

## Their appraisal fields — THEIR team fills these (we don't write them)

These are the cascade-style outputs the appraisers select themselves. Listed for reference / a possible future auto-fill from our cascade engine — **not** part of the current integration.

- **1.2 Property Subtype:** Apartment · Townhouse · Mixed Use
- **1.3 Interest Appraised:** Fee Simple Interest · Leased Fee Interest · Leasehold Estate · Going Concern
- **1.4 Authorized Use:** First Mortgage Financing · Financial Reporting · Insurance · Internal Decision-Making · Acquisition-Disposition · Estate Planning · Litigation · GST
- **1.5 State of Improvements:** Existing Property · Proposed
- **1.6 Status of Improvements:** Proposed - Vacant Land · Proposed - Improved Land · Proposed - Under Construction · Existing - Completed · Existing - Renovated · Existing - Under Renovation · Existing - To Be Renovated
- **1.7 Approaches To Value:** Land Direct Comparison · Cost Approach · Direct Comparison · Income Approach
- **1.8 Value Scenario(s):** As Is Vacant Land · As If Vacant Land · As If Complete & Stabilized · As-Is · As Stabilized · As If Complete (Rezoned / Serviced / Subdivided) · Insurable Replacement
- **1.9 Report Type:** Comprehensive · Concise · Form
- **1.9.1 Inspection Date:** (date)
- **2.2 Transaction Status:** Not Applicable · Listed · Under Contract
- **2.3 Zoning Status:** In Place · To Be Rezoned
- **4.5 Land $/Metric:** $/Unit · $/FAR · $/SF · $/Acre
- **Phase Owner:** Chris · Sanya · Ankita · Jamie
- **Work Phase:** Client Intake · Pre-Work · Production · Draft Review · Edits · Report Sent
- **(dept/category field, name cut off):** Ops/Tech & Equip · Fin · App & Val · Brnd-Mktg-Sales · HR-Recruiting · Leg-Ins-Reg · Strat & Plan · Daily
- **Checkboxes (report workflow):** Client Info Received · Invoice Paid · TTSZ Done · Template Saved · Photos Saved · Comps Provided
- **Free text:** Notes · Task Type

---

## Known mess (the client's, for Ben's optional tidy)

The numbering **collides across two tracks** — `1.1` is both *Property Type* AND *Client Info Received*; `2.1` is both *Property Address* AND *Template Saved*. Doesn't block our wiring (we map by the real field, not the label number), but it's the "mess" worth cleaning on v2.

---

**Last reviewed:** 2026-06-18 by qa-agent — extracted from the client's v2 template screenshots; the only integration-relevant option list is Property Type.

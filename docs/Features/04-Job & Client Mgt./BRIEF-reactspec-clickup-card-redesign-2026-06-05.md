---
content_type: agent-brief
title: react-spec Brief — ClickUp job-card redesign (data once: title block + grouped custom fields)
status: ACTIVE — dispatched 2026-06-05 (Ben-approved mock)
owner: react-spec (build) · ui-designer (design, Ben-approved) · co-architect (gate) · Ben (direction)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
mock: "Paper canvas page 4-0, node MK9-0 (right of live card MHQ-0): https://app.paper.design/file/01KM85Z8ET0BX23R3XH3H75YGN/4-0/MK9-0"
tags: [apr-workflow, clickup, job-card, custom-fields, redesign, build-brief]
related: [~/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./CLICKUP-API-PATTERNS-REFERENCE.md, ~/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./VALTA-CLICKUP-TEMPLATE-STRUCTURE.md, ~/Development/APR-Dashboard-v3/src/utils/webhooks/clickup.ts]
---

# react-spec Brief — ClickUp Job-Card Redesign

Ben-approved design (ui-designer). The principle: **each datum lives ONCE.** Today the card
duplicates everything — a long description body AND custom fields. Kill the duplication.

## The spec

**1. DESCRIPTION = a short, linkable title block ONLY** (no data body):
- Pinned "NEW APPRAISAL REQUEST" + APR Dashboard link + Valcre Job link + Job Number + Date Ordered + LOE Sent / LOE Signed.
- Readable + clickable up top; the operator never digs into fields for the links.

**2. CUSTOM FIELDS = every datum (from the old description), as fields, ONCE.** Groups:
- **CLIENT** — Org · Contact · Email · Phone
- **PROPERTY** — Name · Address · Type · Authorized Use · Asset Condition · Valuation Premise
- **PROPERTY CONTACT** — Name · Email · Phone
- **ASSIGNMENT** — Property Rights · Scope of Work · Report Type · Status of Improvements
- **FINANCIAL** — Appraisal Fee · Retainer · Delivery Date · Payment Terms
- **NOTES** — Appraiser Notes · Client Comments

**3. REMOVE (noise, not in our set):** QA_PROBE_DELETE_ME · Client Address · Client Title · Job Status · Intended Use (dup of Authorized Use) · Additional Info · + all empty/unfilled fields.

**4. ADD (in our data, no custom field yet):** Appraisal Fee · Retainer · LOE Sent · LOE Signed · Status of Improvements · Appraiser Notes · Client Comments.

> Ben's read: the custom fields were largely mapped correctly already — the real gaps are **removing the noise + de-duping the description** (move the data out of the body into fields, once).

## Build note (Ben pre-approved the fallback)
react-spec flagged they may not know how to strip the ClickUp description body programmatically.
**If stripping the body is hard, just build a NEW ClickUp template with this layout and leave the
old one in place.** Ben is fine with that — a new template is an acceptable path.

## Safety rails
- Build + verify against the **TEST workspace** (BC WorkSpace, list 901703694310) first — NOT the
  production Valta board (list 901402094744). Prove it on a test card.
- ClickUp dropdown fields return ORDERINDEX not option UUID, and field defs are per-list → resolve
  byName; destination-side readback (HTTP 200 ≠ success). See CLICKUP-API-PATTERNS-REFERENCE.md.
- **Gate the production-board rollout through co-architect on Ben's go** — don't flip the live job
  board's template without explicit approval.
- Code: `src/utils/webhooks/clickup.ts` (task creation). Reference: VALTA-CLICKUP-TEMPLATE-STRUCTURE.md.

## Report back
- Two-phase search layers run (name them).
- What you built (new template vs in-place), the test-card proof (description = title block only;
  fields grouped, noise removed, the 7 new fields added + populated), readback-verified.
- Whether you need Ben's go for the production-board rollout.

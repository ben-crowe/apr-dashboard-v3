---
content_type: feature-sheet
title: LOE / E-Signature Contract System — Feature Sheet
status: LIVE — V07 is the active send template as of 2026-06-05
owner: Ben (direction) · co-architect (coordination) · react-spec (build) · qa-agent (verify) · ui-designer (design)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, loe, e-signature, docuseal, econtract, feature-sheet, section-10, template-versioning]
keywords: [loe e-signature feature, how the contract system works, docuseal send sign flow, template versioning loe_templates, set default template, how to brief an agent on the loe feature, pending e-sign enhancements]
related: [~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-ECONTRACT-CREATOR-ARCHITECTURE.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/JOB-DOCUMENT-PICKER-DECISION-TREE.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-B-loe07-html-paper.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/ECONTRACT-EDITOR-EVOLUTION-ROADMAP.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-07-RENDER-TWEAKS-2026-06-04.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-TO-DOCUSEAL-FIELD-MAP.md]
---

# LOE / E-Signature Contract System — Feature Sheet

The single front door for the contract-and-e-signature feature. What it is, how it works, how to
put an agent on it, what was done last, and what's still pending. Linked from the
[APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) (Stage 3).

---

## 1. What it is

The part of the app that **generates a Letter of Engagement contract from job data, lets you
preview/edit it, sends it for e-signature, and tracks it through to signed.** No part of the
contract is hand-typed — every field fills from the job record. E-signature runs through DocuSeal.

## 2. How it works (the pipeline)

1. **Templates live in the database** (`loe_templates` table) — each is a full HTML letter, one row
   per version (V1, V2, V3, V07). One row is marked the **default/active** = the one every send uses.
2. **Open the LOE on a job** → the preview modal loads the active template and **fills every
   `[token]` with the job's real data** (and drops conditional sections like Schedule A / §10 when
   they don't apply).
3. **Preview + edit** — the preview is a read-only render; "Edit Template" opens a section-by-section
   text editor and saves edits as a **new template version** (app-wide, not per-job).
4. **Send** → the filled HTML goes to **DocuSeal**, which paginates it to a PDF with running footers,
   anchors the signature/date fields, and emails the signer.
5. **Sign** → the client opens the signing page and signs interactively.
6. **Track** → a webhook updates the job's status + ClickUp on completion.

**The recipient guard:** sends default to `bc@crowestudio.com` (the test inbox), not the client —
a deliberate safety so test sends never reach a real client. "Change Recipient" swaps it; the real
client email comes from the job record.

**Two "V3"s — do not blur** (the #1 confusion): the **template** "V3" = which letter design is live;
the **registry** "V3/v3.1" = the field dictionary. Unrelated tracks, same number. Full explainer:
[LOE eContract Creator Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-ECONTRACT-CREATOR-ARCHITECTURE.md).

## 3. Going live = "Set Default" (the switch people miss)

**Choosing a template in the picker only PREVIEWS it.** It does NOT change what clients receive.
The contract that actually sends is the one marked **default/active** — flipped via the **"Set
Default"** button (or the `is_active`/`is_default` flags in `loe_templates`). Making a new version
the live contract = set it default. Old versions stay selectable for instant rollback.

## 4. Current state — what was worked on last

**2026-06-05 — V07 went LIVE (verified).**
- **V07 is the active/default send template.** The send path was readback-proven to resolve V07.
- **Section 10 (Extraordinary Assumptions / Hypothetical Conditions) now fills for real jobs** —
  the "Status of Improvements" field was wired end-to-end (intake → `job_loe_details` → new Valcre
  custom field), driving the value-scenario cascade + EA/HC narrative text.
- **Dashboard fields re-pointed** to the new v3.1 Valcre custom fields (incl. Authorized Use moved
  off native onto its custom field), readback-verified.
- **DocuSeal signature/date anchoring re-verified** for V07's layout; token audit clean (no stray
  brackets reach a client).
- **Test-send verified:** a live send on the test job to `bc@crowestudio.com` produced a V07 PDF
  (logo, footers, §10 filled, anchors) and the signing page rendered V07 + signature field.
- **Rollback:** one step — set V07 `is_active=false` → send path reverts to V3.

Detail: [LOE-07 render tweaks + §10 wiring](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-07-RENDER-TWEAKS-2026-06-04.md) ·
[LOE-07 PRD](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-B-loe07-html-paper.md).

## 5. How to tell an agent to work on it

- **Read first:** this sheet, then the
  [eContract Creator Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-ECONTRACT-CREATOR-ARCHITECTURE.md)
  (preview/edit/version mechanics) and the
  [DocuSeal Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md)
  (send/sign/webhook).
- **Prime properly:** run the two-phase search (Phase 1 `context-search` + Phase 2 `/search-all`
  SS12) on the area being touched, and report which layers were run.
- **Key code:** `src/utils/loe/generateLOE.ts` (token fill + conditional sections),
  `LOEPreviewModal.tsx` (preview/send), `TemplateEditorModal.tsx` (section editor),
  `src/utils/loe/saveTemplate.ts` (version insert + set-default), `api/valcre.ts` (field sync),
  `loe_templates` table (versions), `job_loe_details` (per-job LOE data).
- **Iron rules:** name-match guard on the test job (VAL261101 — watch the 2nd "Westside Mall"
  decoy); **never** the "Test Data" button; test sends to `bc@crowestudio.com` ONLY; destination-side
  readback on every Valcre/DocuSeal write (HTTP 200 ≠ success); keep V3 selectable for rollback.
- **The standard brief pattern** is the one used for the V07 go-live (a build-brief doc the agent
  reads + executes, gated through co-architect on Ben's go).

## 6. Pending improvements / enhancements

- **Document-picker redesign (NEXT PHASE — documented, not a blocker).** Make the job level a
  document-TYPE picker (LOE first), version chosen ONCE at creation (default newest), then locked;
  no standing version menu beside a finished doc. Built on a typed-document foundation so new
  contract types add without a teardown. Spec:
  [Job Document Picker Decision Tree](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/JOB-DOCUMENT-PICKER-DECISION-TREE.md).
- **Two selectors disagree today** — the job-page "LOE Version" dropdown and the e-sign modal
  picker are separate; the job-page one drives `loe_template_id` but has never been used (null on all
  jobs). Unifying them is part of the decision-tree redesign above.
- **EA/HC detail text not pushed to Valcre.** The six long §10 assumption-text fields build into the
  contract fine but aren't *also* stored in Valcre. Separate wiring only if the client wants that
  data in Valcre.
- **Page-faithful preview.** The in-app preview is continuous-scroll (no page breaks/footers shown);
  the real sent PDF paginates correctly regardless. Reviewer-confidence upgrade. See
  [eContract Editor Evolution Roadmap](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/ECONTRACT-EDITOR-EVOLUTION-ROADMAP.md).
- **Bug — "sent" status never set automatically.** The flow jumps pending → signed; the `loe_sent`
  status exists but no automation sets it.
- **Bug — submission record sometimes fails to save.** `loe_submissions` insert can fail silently;
  the contract still reaches DocuSeal but the local record is lost.
- **Editable zones (future).** Let an appraiser hand-edit a region (e.g. §10 text) in place, with a
  per-job override vs new-version persistence decision. Roadmap doc above.

## 7. Related docs (all linked, working together)

- [**★ LOE-07 Edit / Version Workflow (ESTABLISHED)**](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-07-EDIT-VERSION-WORKFLOW.md) — the proven loop: Codex edits source (preview = ship target) → QA re-hosts live (no redeploy) → Download (Paged.js PDF) → cascade-version generation matrix.
- [eContract Creator Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-ECONTRACT-CREATOR-ARCHITECTURE.md) — preview/edit/version mechanics.
- [DocuSeal Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md) — send/sign/webhook deep dive.
- [Job Document Picker Decision Tree](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/JOB-DOCUMENT-PICKER-DECISION-TREE.md) — the next-phase UX model.
- [eContract Editor Evolution Roadmap](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/ECONTRACT-EDITOR-EVOLUTION-ROADMAP.md) — page-faithful + editable zones.
- [LOE-07 PRD](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-B-loe07-html-paper.md) · [Render tweaks + §10 wiring](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-07-RENDER-TWEAKS-2026-06-04.md) · [LOE→DocuSeal field map](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-TO-DOCUSEAL-FIELD-MAP.md).
- [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) — the project front door (this feature = Stage 3).

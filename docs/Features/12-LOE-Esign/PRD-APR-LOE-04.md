---
id: prd-apr-loe-04
title: "PRD-APR-LOE-04 — Sent & Signed documents as openable rows in one Saved Documents container"
date: 2026-06-23
updated: 2026-06-23
type: condensed-prd
status: LOCKED
series: PRD-APR-LOE (04 of series; follows LOE-03 email-as-first-class)
owner: fullstack-developer (build) · qa-agent (author + verify)
direction: Ben
app: APR-Dashboard-v3
tags: [apr-workflow, loe, esign, docuseal, saved-documents, job-dashboard]
keywords: [loe sent signed document row, saved documents container, markContractSent, job_contracts state, no doc pill, draft sent signed badge, openable document]
---

# PRD-APR-LOE-04 — Sent & Signed docs as openable rows in one Saved Documents container

> **Mode: condensed.** Familiar code, clear job, all mechanisms verified against source by a QA code-trace before lock (satisfies write-prd step 2.5). Front two phases of `/workflow-orc-2agt`.

## The intent (Ben's words, plain)

On a job's **LOE Quote & Valuation Details → Saved Documents** area, a **saved draft** shows as a proper row (real name, type, DRAFT badge, **Open** button). But a **sent** document never appears as a row — sending only drops a doc-less green pill reading *"Sent: Letter of Engagement - Ready for Signature · no doc"*, which isn't openable and persists even after the client signs. Ben wants every document — draft, sent, signed — to live as an openable row **inside the one expandable Saved Documents container**, each carrying its own status badge, and the redundant green pill block gone.

---

## ⭐ Key Results

- **A sent LOE appears in the Saved Documents list as an openable row with a SENT badge** — not a "no doc" pill. **Prove:** on the live job, create → send an LOE; the row appears with a SENT badge and Open re-opens the document read-only. **Status: open (in build).**
- **A signed LOE updates that same row to a SIGNED badge.** **Prove:** after the client signs (or webhook fires), the row reads SIGNED and still opens. **Status: open (in build).**
- **There is ONE place to view documents/emails — the Saved Documents container.** The separate green-pill block is removed; doc-less emails (if kept) render as rows inside the same list. **Prove:** the job view shows a single expandable Saved Documents section, no floating pill block. **Status: open (in build).**
- **No "· no doc" text appears once a document is attached.** **Prove:** the sent row shows the document name + type, never "no doc". **Status: open (in build).**
- **Opening a SIGNED row shows the EXECUTED signed copy (signatures/date), not the pre-send draft.** **Prove:** sign a doc; Open on the signed row renders the DocuSeal-executed PDF. **Status: open (in build — added 2026-06-23).**
- **(DEFERRED) The executed signed LOE auto-files to its SharePoint job folder.** Target home confirmed: subfolder **4. CLIENT BILLING (Invoice, LOE)** — folder spec annotates it "signed LOE + invoice land here." **Prove:** after signing, the executed PDF appears in that job's folder 4. **Status: DEFERRED — but foundation now VERIFIED present.** The "Asset Folders" button DOES create the full 5-subfolder set live via the SharePoint App (visually confirmed 2026-06-23 on VAL261066 — folders 1-REPORT … 4-CLIENT BILLING (Invoice, LOE) … 5-LOR all created). So remaining work is NOT the folder system (it exists) — only: drop the signed PDF into folder 4 via Graph upload. Rides on Ben confirming with the client. **NOTE:** master dashboard 2b currently states folder-create is NOT wired — that is STALE; corrected this session.

---

## Root cause (verified against code, not memory)

- The send flow (`handleApproveAndSend`, `LoeQuoteSection.tsx`) sends the email and persists an **email instance**, but `currentContractId` is commonly `null` at send (`handleGeneratePreview` clears it) → email instance gets `contract_id: null` → renders as the "· no doc" pill.
- `markContractSent` (`jobContracts.ts`) **exists but is never called** (zero callers); every save hard-codes `state:'draft'`. So no contract is ever promoted to `sent`.
- Signing updates **job status** only (`SigningPage.tsx` / docuseal webhook → `useJobActions.ts`); it never touches `job_contracts`.
- The list (`loadJobContracts` + render ~1746-1798) **already** selects all states and branches on `state === 'sent'` with a green badge + Open. **The list is ready; only the write side + view consolidation are missing.**

---

## Architecture Invariants

```
INV-0 (THESIS) — When a document is SENT, it MUST persist as a job_contracts row (state='sent', carrying its edited_html) that renders as an openable row in the Saved Documents list.
  FAIL-WHEN: after sending, the only artifact for that document is an email instance / pill with contract_id null, and no openable sent row exists in the list.
  PROVED-BY: on the job view, create + send an LOE; a job_contracts row with state='sent' and non-null edited_html is written; the Saved Documents list shows a row with a SENT badge whose Open button renders the document.

INV-1 — When a sent document is SIGNED, its job_contracts row MUST update to state='signed'.
  FAIL-WHEN: after the signed event lands, the row still reads SENT (or no row updates) while job status shows signed.
  PROVED-BY: trigger the signed-completion path; the matching job_contracts row (by docuseal_submission_id) reads state='signed' and renders a distinct SIGNED badge.

INV-2 — There MUST be exactly ONE document/email view surface on the job: the Saved Documents container.
  FAIL-WHEN: a sent/draft document or email renders in a second block separate from the Saved Documents list (e.g. the standalone green pill block).
  PROVED-BY: on the job view, the only place documents/emails render is the single expandable Saved Documents list; the separate emailInstances pill block is removed from the component.
```

---

## Scope

**In:** write-side wiring (save-before-send, `markContractSent` on send success, new `markContractSigned` on signed event), add `'signed'` to the `ContractState` union (+ verify/alter any DB CHECK constraint on `job_contracts.state`), a distinct SIGNED badge style, and removing the separate email-pill block so everything renders in the one list.

**Out (explicit):** no Vercel deploy in this build (QA verifies on local/live separately); no change to DocuSeal send mechanics, email transport, or the LOE generation/cascade; no redesign of the list's filters or layout beyond the badge + pill-block removal; doc-less email handling — keep them as rows inside the same list if low-cost, else priority is the pill-block removal + sent/signed rows (builder reports what was done).

## Owner & delegation

Build = **fullstack-developer** (React + Supabase write path); brief includes project-context load, no-workaround rule, tsc + local commit, no self-testing. Verify = **qa-agent** independently on the live job (create → send → confirm SENT row + Open; confirm SIGNED transition), with screenshots.

## Status

**LOCKED 2026-06-23.** Build dispatched same session. Close-out will show the proof artifact for each Key Result.

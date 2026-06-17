---
id: assembly-prompt-loe-03-waveD2
title: "Assembly Prompt — LOE-03 WAVE D2 (FINAL Ben-confirmed architecture: two dropdowns in the Previewer, one reusable email component) → fullstack fork"
date: 2026-06-17
type: assembly-prompt
prd: PRD-APR-LOE-03
wave: D2 (the FINAL architecture, Ben-confirmed via full explain-back; supersedes ALL prior D2 versions; removes D1's dashboard widget; touches the live send — CAREFUL + Ben-click-tested)
status: for-prompt-gate (qa-agent /review-gate prompt-mode — gates the placement-testable INV-0) → fork-deploy → Ben click-test
---

# Assembly Prompt — LOE-03 Wave D2 (FINAL — Ben-confirmed, supersedes all prior)

> Vehicle = Mode B-2 fork (`subagent_type: "fork"`; Step 0 bash-loads fullstack-developer). ⚑ CAREFUL wave — REMOVES D1's misplaced dashboard widget AND touches the live send. Ben click-tests after. Architecture LOCKED after 3 drifts + a full explain-back. **Build to EXACTLY the INV-0 below — nothing else.**

## ⭐ INV-0 (placement IS the proof — the gate runs this verbatim)
```
INV-0 — Email MUST be sendable without a document, via an Email dropdown SIDE-BY-SIDE with the Document dropdown IN THE PREVIEWER (opened by the "Create Document/Email" button).
  FAIL-WHEN: the email entry is a loose element on the dashboard/job page, OR not beside the Document dropdown in the Previewer, OR the bottom document-Send button was removed.
  PROVED-BY: the dashboard button reads "Create Document/Email" → opens the Previewer → Document + Email dropdowns render SIDE BY SIDE; pick Email + Send → job_email_instances contract_id=null, no document opened; the bottom document-Send button is still present + the live LOE document send works (document path, docTemplateId=the-doc, signing link); the loose D1 dashboard email widget is GONE.
```

## The prompt (paste to the fork)

```
You are the fullstack builder for APR Dashboard v3, Wave D2 of PRD-APR-LOE-03 — the FINAL Ben-confirmed architecture. You are a FORK — you inherit co-architect's full context (PRD with the FINAL INV-0, the gates, Wave A/B/C, D1's commit fdaab8c). This wave REMOVES D1's misplaced dashboard widget + wires the Previewer two-dropdown + touches the live send. Build CAREFULLY to EXACTLY the architecture below; Ben click-tests.

STEP 0: bash ~/.claude/skills/load-persona-skills/load-persona-skills.sh fullstack-developer · load /cli-agent-all /build-discipline /supabase-deploy /search-tools · Read ~/Development/APR-Dashboard-v3/CLAUDE.md (🚫 NO-LOGIN) · run /search-2phase scoped "LOE-03 LOEPreviewModal Previewer Document dropdown Email dropdown SendByEmailControl docTemplateId LoeQuoteSection Create Document Email bottom Send button continue-to-email".
BUILD-DISCIPLINE pre-flight (load for real): brainstorming · pre-change-audit (inventory: D1's loose "Send by Email" widget on the job page [LoeQuoteSection ~L1537, to REMOVE]; the dashboard "Create Document/Contract" button [to rename → "Create Document/Email", opens the Previewer]; LOEPreviewModal's Document dropdown [Email dropdown goes BESIDE it]; the BOTTOM document-Send button [KEEP]; the live send + safeRecipient + Resend sandbox L320-321; SendByEmailControl's docTemplateId:string|null prop) · systematic-debugging · verification-before-completion.

⭐ THE FINAL ARCHITECTURE (Ben explain-back confirmed — build EXACTLY this):
- ENTRY: rename the dashboard button → "Create Document/Email" (single entry). Pressing it OPENS the Previewer (LOEPreviewModal).
- PREVIEWER: TWO dropdowns SIDE BY SIDE — "Document" + "Email".
  · DOCUMENT path: pick Document → the document workflow → the BOTTOM document-Send button (the EXISTING send) sends by email WITH the document connected (signing link). ⚑ KEEP that bottom button — do NOT remove or replace it.
  · EMAIL path: pick Email → the email previewer opens STANDALONE (nothing connected) → adjust template → send.
- ⭐ ONE REUSABLE COMPONENT both ways (NOT a new component): SendByEmailControl already takes docTemplateId:string|null. Feed it:
  · from the Email dropdown directly → docTemplateId=null → standalone, contract_id=null, EMPTY signing link (KR2).
  · reached UNDER a document (continue-to-email) → docTemplateId=the-doc → document connected, carries the signing link.
  Same screen + template-edit both ways; ONLY the document-connection differs.

THE WORK (D2):
1. ⚑ REMOVE D1's loose dashboard widget ("Send by Email: [Default LOE Email][Preview][Send]") from LoeQuoteSection ~L1537. REUSE its doc-less send logic (safeRecipient, sendLOEEmail empty-link, persistEmailInstance contractId:null, the pills) — move it to drive the Previewer's Email path, don't delete it.
2. RENAME the dashboard button → "Create Document/Email"; it opens the Previewer.
3. ADD the "Email" dropdown in the Previewer (LOEPreviewModal) BESIDE the "Document" dropdown (sourced from loadAllEmailTemplates).
4. Wire the Email dropdown → SendByEmailControl with docTemplateId=null (standalone email, contract_id=null, empty link, safeRecipient fail-safe INV-1, sent-only-on-success G4).
5. ⚑ KEEP the bottom document-Send button + the existing live LOE document send UNCHANGED (document path → signing link → DocuSeal, G5). Do NOT remove/replace it.
6. ⚑ SAVED SECTION (INV-4, Ben's latest): RENAME the saved section "Saved Documents" → "Saved Documents/Email". When an email is SENT or a DRAFT saved → it lands in that section as a pill (use the existing Email/Thank-You pill categories). GROUPING default (derivable from contract_id; ui-designer refines later, non-blocking): email-only (contract_id=null) → under the Email/Thank-You pill; a document that was emailed (contract_id set) → stays under its document pill with an "emailed" marker, NOT a separate second email entry (no double-listing).

GUARDRAILS: G2 recipient fail-safe (reuse safeRecipient, preserve Resend sandbox) · G4 sent-only-on-success · G5 signing-link BOTH directions (document path → link present; standalone email → no link) · KR2 standalone → contract_id=null.
FENCES: report-builder/Slice-4b; RLS re-enable; migration-history reconcile.

VERIFY (CODE/LOGIC/DATA only — NO screenshots/app-walk/login; Ben click-tests):
- ⭐ INV-0 (run FIRST): the "Create Document/Email" button opens the Previewer; Email dropdown renders BESIDE the Document dropdown IN THE PREVIEWER (NOT on the dashboard); pick Email + Send → contract_id=null, no doc opened; the bottom document-Send button is PRESENT + the live document send works (signing link); D1's loose dashboard widget is GONE.
- INV-4: send a standalone email → a pill appears under the Email filter; the saved section header reads "Saved Documents/Email" (not "Saved Documents"); an emailed document is NOT double-listed.
- Recipient fail-safe holds on the email path; sent-only-on-success; signing-link both directions; live document send byte-intact.
- tsc --noEmit clean · drift green (V3 untouched) · checkpoint as fullstack-developer.

WORKER DOCTRINE: no AskUserQuestion/menus — pick + "proceeding"; "STUCK: <q>" if blocked. No screenshots/app-driving/login. Push DONE to dev-1 with code/DB evidence. Co-arch verifies; QA build-verifies (INV-0 placement PROVED-BY first); Ben click-tests the in-Previewer two-dropdown.
```

---

→ qa-agent `/review-gate` prompt-mode (gates the placement-testable INV-0 + D1-widget-removed + bottom-button-kept). On PASS: fork-deploy → I deploy → Ben click-tests. **This is the lock — Ben-confirmed via explain-back, no 4th drift.**

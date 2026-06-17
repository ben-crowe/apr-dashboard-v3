---
id: prd-apr-loe-01
title: "PRD-APR-LOE-01 — Multi-Document Creator (per-client contracts, drafts, versions, send)"
status: closed
created: 2026-06-11
updated: 2026-06-15
type: prd
owner: co-architect (assembler) · ui-designer (spec) · react-spec (build) · qa-agent (verify) · Ben (direction + go-lives)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
pairs_with: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/ECONTRACT-EDITOR-EVOLUTION-ROADMAP.md
tags: [apr-workflow, loe, econtract, loe-client-series, multi-document, template-versioning, drafts, sent-state, email-editor, prd]
prd_series: LOE / client-contract lifecycle
prd_seq: 1
keywords: [multi-document creator, create contract, save as draft, sent state, per-client collection, template version, email body editor, document naming]
---

**Tags:** #apr-workflow #loe #econtract #loe-client-series #multi-document #template-versioning #drafts #sent-state #email-editor #prd
**Entities:** [[LOE E-Sign Feature]] [[eContract Editor]] [[job_contracts]] [[loe_templates]] [[DocuSeal]]

> **📑 Series: LOE / client-contract lifecycle — this is PRD 1 of 2 (CLOSED).**
> → **PRD 2 (active):** [Client-Facing Cascade — versions, send, sign, status, storage, payment](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-APR-LOE-02.md) — picks up the open item this one carried forward (client-facing filename) + the full client-facing flow.

**↑ Home:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) · **Ground truth:** [Contract Editor Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CONTRACT-EDITOR-ARCHITECTURE.md)

# PRD-APR-LOE-01 — Multi-Document Creator

> **✅ CLOSED 2026-06-15.** Shipped + live: saved versions on the job, the type-pill version layout, and the editable email on send (default + edit-this-one, locked merge fields, reset-to-seed) — proven end-to-end through the full gated build loop (spec gate → build → independent verify → fix → re-verify → arrival in Ben's inbox). The one OPEN result — **client-facing filename** — was NOT dropped; it moves into the new client-facing PRD ([PRD-NEXT-client-cascade-send-sign-pay-SCOPE.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-NEXT-client-cascade-send-sign-pay-SCOPE.md)) since the filename only matters once docs go to a real client. Sender cutover, SharePoint storage, signing, and payment were always fenced as separate later sub-items → all carry to the new PRD.

> **Locked spec. North star only — no code, no agent assignments inline (those live in the per-chunk briefs).** Frozen once Ben approves.

> **⭐ PRD TYPE: Dual-Agent Deployment** (a worked example of the type — locked 2026-06-15). A PRD is **never standalone — its *type* carries the deployment method** (how it gets built and shipped). This one is the **dual-agent** type: co-architect × QA, the two upstream gates (spec-review → prompt-review via `/review-gate`), a **forked builder**, then **independent QA build-verify** → fix-fork → re-verify → live proof. Same north-star *writing* as any PRD; the type just declares the execution model.
>
> **Other types will follow** — same kind of PRD writing, different deployment. The obvious next one: **Multi-Agent Full-Team Orchestration on the KM Board** — still has a QA agent bouncing the work back and forth, but the build runs as a *team through the KM project board* (task cards, assigned workers, status columns) instead of forked agents. When an agent reads the PRD's type, it knows immediately which deployment to run. The deployment workflow (`workflow-prd`) stays general and dispatches per the declared type.
>
> **How the forked agents get prompted (this type's mechanism) — the full process is in [`/workflow-prd`](~/.claude/skills/workflow-prd/SKILL.md), not here** (the PRD is north-star; the *how* lives in the skill). At a glance: co-architect **searches the tools FIRST** (`/search-tools` + SS12 — so the builder gets tools that already exist, not rediscovery) → drafts the **Assembly Prompt** (names the agent + exact skills to load + spec + entry files + testable proof + tool reminder + read→SS12→build order) → runs it through the **`/review-gate` prompt-gate** (QA) → only then **forks the builder** (Agent tool, no subagent_type → inherits context). That tool-search-then-prompt-then-gate discipline is the crux of the dual-agent type — read `/workflow-prd` for the exact steps.

## What it is

A per-client document creator — not just an LOE sender. From a client's job you pick a template, it fills with that client's data, you edit your copy, name it, and send or save it as a draft. Every version is saved under that client and visible on the job. The tool grows to hold many document types (LOE, client letter, future contracts) behind one editor.

## Why

Today there is one template and the screen behaves as if you're always about to send a fresh LOE. Real work needs: more than one document type, a record of what was already sent to each client, the ability to pause a document and resume it, control over the email that carries it, and a safe way to evolve the templates themselves without rewriting everyone's contract.

## Key Results — the named deliverables to SHOW Ben when done

> **These are the pinpointed final-result details.** Each is a named end-result; "done" for that item = I show Ben *this specific thing* (a link, the file, the email, the options). The close-out must cover every one — not just the easy one. (Added 2026-06-14 after Ben flagged that only the saved-versions result got shown.)

### ⭐ At a glance — there are only FOUR Key Results

1. **Saved versions on the job** — ✅ done (live)
2. **Client-facing file name** — OPEN
3. **Editable email on send** (default + edit-this-one, locked merge fields) — ✅ done
4. **How versions present** (the type-pill layout) — ✅ done

> Everything written under result #3 below — *token timing, persistence, states, double-send guard, reset-to-seed, the test banner* — is **sub-detail of the email result**, NOT separate Key Results. It's kept for the builder. The long block reads as a wall because of formatting; THIS list is the real scorecard.

---

#### Full detail (per result)

- **Saved versions on the client record** — multiple documents (drafts + sent) saved per client, visible on the job. **Status: ✅ DONE** — shown via the live job link (chunk 1).
- **Client-facing file name** — what the client actually sees as the filename on download / PDF / HTML when a doc is sent, locked to a proper convention (NOT "LOE-04"). **Show via:** a sent doc downloaded/opened with the correct name. **Status: OPEN** — pull the existing client-folder naming convention first. (send flow / chunk 2)
- **Email template** — where the default send-email body lives + how it's edited/managed on send. **FINDINGS (2026-06-14, confirmed in code):** the LIVE send fn is `send-loe-email-fixed`; subject + HTML body are **HARDCODED** in that edge function (signed clientcare@valta.ca). Transport today = **Resend on the bc@crowestudio.com SANDBOX** (from `onboarding@resend.dev`) — a TEST path that only delivers to bc@crowestudio.com, NOT real clients. **Microsoft Graph is wired but deliberately OFF** for email (the intended production sender from a real valta.ca mailbox; parked until Ben sets it — production-only). Dead variants exist (`send-loe-email`, `-v2`, `-gmail`) → cleanup. ⚠ **A Resend API key is hardcoded in the function source** (secret in code) → must move to a managed secret. **PLAN to expose (the goal):** lift subject+body out of the function into a managed, editable email template (DB-backed) with merge fields, surfaced as an editable email body on the send step — same "expose + edit" model as the document editor. **Show via:** a test job where you open the send step, edit the email, and the test email arrives reflecting your edit. **Status: OPEN** — sub-item; not built. *(Sender cutover to production — Graph/valta.ca or a verified Resend domain — is a SEPARATE sub-item from making the template editable.)* **LOCKED SCOPE (Ben 2026-06-14):** (a) BOTH a managed DEFAULT email template (save your default, overwrite/change anytime) AND edit-THIS-one before sending — same model as documents; editing one send never changes the default. (b) Editable: SUBJECT + BODY. (c) MERGE FIELDS auto-fill client first name, last name, job number (+ signing link) — configured logically, VISIBLE in the editor (you can see where each goes, like the HTML editor) and HARD-LOCKED (can't be deleted/broken). (d) Order: editable FIRST; flipping the sender to reach real client inboxes (off the test/sandbox path) is a separate later step. The current hardcoded body/subject becomes the starting default. **Proof:** a test job → open the send step → edit the email (locked merge tokens visible) → send to the test inbox → the arriving email reflects your edit + merged fields. **CONTEXT FINDING (designer, 2026-06-14):** there is NO send-step screen today — "Send to Client" fires immediately. This sub-item ADDS an email-review step (stepper: ① Review document → ② Email → ③ Sent) between Send and the actual send. **FLOW RULE (Ben 2026-06-14):** email is ALWAYS step two, attached to a confirmed document — you never create an email cold. Implication: **"Email" is NOT a create-a-document type in the Saved Documents pills** (you don't pick "Email" then hunt for an attachment); emails are the step-two send wrapper + sent-records → drop "Email" as a creatable pill; sent emails appear as records. **Layout:** Compose (full-width email, doc as attachment chip) — **co-arch decides, NOT Ben's pick** (Ben 2026-06-14: "don't make me design the email; tell me how it looks now"). **Editor SEEDS the EXACT current email verbatim** — the `send-loe-email-fixed` subject ("Letter of Engagement - Ready for Signature") + body ("Hi [First Name], … blue 'Review & Sign Document' button → opens the contract … What happens next list … Client Services Team / Valta"). We EXPOSE the current email as the editable default; we do NOT redesign it. Rendered reference of the current email: `~/Development/current-email.png`. **REVISED per review-gate spec-review (2026-06-14 — closes 6 blockers + 3 clarifications; review: `REVIEW-email-sendstep-qa.md`):**
- **Token resolution timing** — names + job number resolve at EDIT time (from `job_submissions`); **`{signing link}` shows a labeled PLACEHOLDER in the editor and resolves at SEND time only** (the DocuSeal send action produces it; it doesn't exist before send).
- **Persistence (named)** — **default email template** = a settings-scoped row (one source of truth; subject + body columns); **per-send instance** = job-scoped, same pattern as `job_contracts`. Default and instance are SEPARATE rows — editing an instance never touches the default object. Merge sources: names/job# from `job_submissions`, signing link from the DocuSeal submission at send.
- **Default isolation + gating decision** — the email DEFAULT is **intentionally freely editable (NOT gated)** — it's a low-stakes cover note, unlike the legal-contract template which stays gated; safety net = reset-to-seed below. **Proof step added:** edit one send → open a fresh send → confirm the default is unchanged.
- **States (defined)** — **sending** (Send disabled + spinner), **error** (message + retry; document is NOT marked sent on failure), **③ Sent** (confirmation + recipient shown + return path to the job).
- **"Email" pill = record/filter bucket for SENT emails only, NEVER a create target** — the Create-Contract template picker lists document types only (LOE/letter/etc.), never Email; the Email pill only filters sent-email records.
- **Double-send guard** — disable Send after first dispatch + check a sent flag before dispatch (mirror the chunk-1 no-duplicate guard).
- **Security (IN this sub-item)** — move the hardcoded Resend API key out of the function source into a managed secret; a secret-in-code won't sit un-owned while we're editing this function. (Dead-variant cleanup `send-loe-email`/`-v2`/`-gmail` → fenced to the sender-cutover sub-item.)
- **Test-path indicator** — while on the Resend sandbox path, show a visible **"TEST — delivered to sandbox, not the client"** banner on the send step (sandbox delivers only to bc@crowestudio.com even though merged as the client).
- **Reset-to-seed** — keep the verbatim current email (`send-loe-email-fixed`) as the recoverable default seed; a reset-to-original escape hatch so a bad overwrite is never permanent.
- **Spec status: PASSED review-gate (re-review clean) — builder-ready.** Assembly-prompt notes (carry into the build brief, NOT re-spec): (a) name the default-EDIT surface — mirror the document editor's existing "Set Default" toggle for consistency; (b) builder must SNAPSHOT the verbatim current email as the immutable seed at build time (capture before lifting subject+body out of `send-loe-email-fixed`, or reset-to-seed isn't real); (c) the proof must explicitly eyeball that the ARRIVED test email's button links to the real signing URL (`{signing link}` only resolves at send). Mock: `~/Development/email-editor-mock.html`.
- **File naming convention + UI presentation** — the naming scheme, the user's rename ability, and how versions present when there are MANY (Ben's direction 2026-06-14): **half-width not full**; **grouped by template TYPE** (LOE / letter / thank-you / email / etc.) so you see how many of each type were sent; a **template-type picker/dropdown first** — click a type → see all items of that type (e.g. "Emails sent" → every email sent); **consistent action label or icon**, NOT a different word per row (the badge carries draft-vs-sent; behavior still differs — draft opens the editor, sent opens read-only); built to **scale to 10+ items across multiple template types**. **Show via:** UI designer proposes 2–3 look-at-able layout options → Ben picks → applied in the list. **Status: FORM CHOSEN = C (type-tabs / pill filter), BUILDING.** Ben picked C 2026-06-14 (better than current, scales best). Build into the real LoeQuoteSection from the C prototype. Requirements: persistent **type pills shown even when a type is empty** (placeholders — don't hide empty types); driven by the real template types (currently just **LOE**), structured so new types/cascade versions appear as new pills automatically; strip the orange "lands here" pointer. Prototype ref: `~/Development/saved-doc-in-context.html`. **Show via (proof):** live link to a real job showing the C tabs in place. Deferred idea (parked, needs more thought): an inline **preview on the page/canvas** of the selected version. **REVISION (2026-06-14, after Ben saw it LIVE):** make it **FULL-WIDTH** (half-width left an empty right side and looked wrong; the previewer-on-the-right idea is DROPPED — too small a space) and **pick-to-expand** (revised again same day, Ben): NO separate toggle — DEFAULT = no pill selected → list collapsed, only the pills row + counts show; picking a pill expands that type's docs ('All' no longer default-selected). The pill selection IS the expand/collapse. Supersedes both the earlier half-width AND the brief collapsible-toggle idea. *(Both refinements caught only because we showed it live on the real page — validates the proof-first close-out.)*
  - *Note — this supersedes the chunk-1 draft→"Continue" / sent→"View" labels: action label becomes consistent/iconic, badge stays the state tell.*

> Every "Goal Result" closes the same way: at the end I show Ben the artifact that proves it (per the GOAL + PROOF + annotation reflex). An OPEN one that we deliberately defer (e.g. naming convention → designer options) is fine — but it stays on this list as a required show-Ben item, never silently dropped.

---

## The feature surface (what "the whole thing" is)

- **Pick a template type**, fields auto-fill from the client's job data.
- **Edit the document** = edits this client's *instance* only; never touches the master template.
- **Name the document** — a user-given name on every saved/sent version.
- **Save as draft / Send** — a document lands as a draft (unfinished) or sent.
- **Per-client collection on the job** — saved + sent versions show beside the Create button, each with a state badge, clickable: reopen a draft to continue, open a sent one to see what went out.
- **Sent stays visibly sent** — the screen never implies a fresh send when one already happened.
- **Editable email on send** — the send step shows the default email body in an editor; the sender controls exactly what the client receives.
- **Gated template editing** — changing the *template* (not an instance) mints a new template version in a separate settings area; it only joins the main dropdown after Ben approves it.
- **Grows by type** — each new template type added becomes another dropdown choice, fields map in, same edit/save/send flow.

## Done =

- A document can be named, saved as a draft, reopened, edited, and re-saved **as the same version** (no duplicate rows).
- A sent document is marked sent and persists as sent on the client's job; the UI reflects "already sent," not "send fresh."
- The send step shows an **editable email body** (default template visible) before sending.
- Editing a client's document **never** alters the shared template.
- A template change creates a **gated, approval-only** template version; nothing reaches the live dropdown without Ben's approval.
- The picker supports a **second template type** end-to-end (pick → fill → edit → send), proving the library is real, not LOE-only.

## Guardrails

- **Instance vs template is sacred.** Editing a document is the safe default; editing a template is deliberate, gated, and confirm-labeled.
- **Sent-state is truthful.** Never show a send-fresh affordance for a document already sent.
- **No duplicate-on-resave.** Reopening and saving updates the same instance by id.
- **Don't band-aid the parser/render.** Verify the round-trip (fill → edit → save → reopen → send) on a real client, not a screenshot.

## Build order (sub-items)

1. **Instance round-trip + naming + drafts** — Save-as-Draft action, document naming, reopen-rehydrate-the-same-instance-by-id. The piece Ben emphasized; makes everything below testable. *Technique: standard single-agent build + QA verify.*
2. **Send-tracking gate + editable email body** — sent-state marking (the deploy blocker) and the editable email-body editor on send. *Technique candidate: goals-mode run (self-contained multi-step).*
3. **Gated template-version settings area** — edit-template → version → approve → joins dropdown.
4. **Second template type + per-type field mapping** — proves the multi-type library. *Technique candidate: forked variants (pick the look/avenue).*

## Current state (not a blank slate)

Most of the spine is built and on the designer's machine, not deployed: the template-agnostic Create-Contract editor, instance persistence (draft/saved/sent states in `job_contracts`), and the per-client collection beside the Create button. The gaps are the named chunks above. Full as-is detail: the Contract Editor Architecture doc.

## Forward direction — job view → client (CRM) view (Ben, 2026-06-14)

Today this lives at the **job level** — the saved-versions picker is scoped to one client's one job (the micro). The SAME grouped-picker pattern scales **one level up to a client/contact record** (CRM-style): the contact record shows everything across that client's jobs — jobs, documents, letters, emails — with the dropdown pivoting to e.g. "Jobs" (all of that client's jobs) or document-type across jobs. **Implication for the build:** make the job-level list a **reusable, level-agnostic component** so the client-level view reuses it instead of re-implementing. Client-level view is a **future level, not this chunk** — captured so it's not lost and so we don't hard-bake the list to job-only.

---
*Draft — co-architect (assembler) owns this PRD. Approve to lock, then chunks deploy in order with QA in the verifier seat.*

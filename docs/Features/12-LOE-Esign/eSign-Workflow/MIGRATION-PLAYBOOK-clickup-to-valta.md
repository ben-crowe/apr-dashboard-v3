---
title: "ClickUp Cross-Workspace Migration Playbook — Ben's account → client's Valta workspace"
status: DRAFT — for qa-agent /review-gate, then Ben
created: 2026-06-18
owner: co-architect (author) · qa-agent (gate + integration re-point) · Ben (Valta tenant admin / template import)
tags: [apr-workflow, clickup, migration, cutover, valta, template-share, docuseal, resend, quickbooks, webhook]
---

**Tags:** #apr-workflow #clickup #migration #cutover #valta #template-share
**Entities:** [[ClickUp]] [[Valta workspace]] [[DocuSeal]] [[Resend]] [[QuickBooks]]
**Backlink:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)
**Related:** [Codex Rebuild Prompt](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/CODEX-PROMPT-clickup-valta-rebuild.md) · [ClickUp Custom-Fields Change Request](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20%26%20Client%20Mgt./CHANGE-REQUEST-clickup-custom-fields.md) · [ClickUp Sync Canonical](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20%26%20Client%20Mgt./CLICKUP-SYNC-CANONICAL.md)

---

# ClickUp Cross-Workspace Migration Playbook

> **Why this exists.** The whole ClickUp task setup — custom fields, status-tag pipeline, statuses, views, layout — was built and tested in **Ben's** ClickUp account on the TEST list. It has to run in the **client's Valta ClickUp workspace**. This playbook is how it moves across accounts **without rebuilding from scratch**, plus exactly what does NOT carry and has to be re-pointed by hand.

---

## The two-layer reality (read first)

A ClickUp setup is **two layers**, and they migrate differently:

1. **The CONFIGURATION layer** — custom fields, tags, statuses, views, layout, task/subtask structure. **This DOES carry** via a shared Space template (below).
2. **The INTEGRATION layer** — the DocuSeal webhook, Resend email, QuickBooks, and our app's ClickUp webhook. These run on a **token + list ID + field IDs** that are **all NEW in the Valta workspace**. **This does NOT carry** — it must be re-pointed by hand. (A template copies field *definitions*, not their Valta field *IDs*, and never copies external secrets.)

So migration = **template-share the configuration**, then **re-wire the integration** against Valta's new IDs.

---

## What template-share DOES carry (confirmed)

Save as a **Space template** → enable **public sharing** → the **Valta workspace OWNER** (must be them, not Ben) imports the share link. Carries over:

- Custom fields (definitions + options)
- The status-**tag** pipeline (the workflow tags)
- Statuses
- Views + layout

## What it does NOT carry (re-point by hand)

- **Integration secrets + IDs** — DocuSeal webhook, Resend, QuickBooks: each uses a token + the Valta **list ID** + Valta **field IDs**, all new. Re-point manually.
- **Formula fields** — **dropped on import.** Recreate any formula field by hand in Valta.
- **Automations that name a specific person** — **break on import** (the named assignee doesn't exist in Valta). Recreate pointing at the Valta team member.

---

## The order of operations (do NOT reorder)

1. **Finish the config in Ben's account first** — create the status tags, lock the custom-field set (+ number-prefix naming), confirm subtask-vs-checklist for the "APR Workflow Steps." (Per the Change Request doc.)
2. **Save the Space as a template** → turn on **public sharing** → copy the share link.
3. **Valta workspace OWNER imports the link** (must be the owner account — Ben can't import into their workspace for them).
4. **DISABLE public sharing on the template** immediately after the import succeeds — don't leave the workspace structure world-readable on a public link.
5. **Audit the import in Valta** — verify custom fields, the tag pipeline, statuses, and views all landed. Note any **formula fields** (dropped) and **person-named automations** (broken) to rebuild.
6. **Get the Valta API token + the new list ID + the new field IDs** (they differ per workspace).
7. **Re-point the integration layer to Valta:** DocuSeal webhook, Resend, QuickBooks → new token/IDs; **recreate the app's ClickUp webhook in Valta.**
   - ⚠ **If we ADOPT the client's existing fields (likely — Ben 2026-06-18):** this step is no longer "new IDs for our fields." It becomes a **field-MAPPING + GAP pass** — map each outbound data point we send (job number, the date fields, client/property info, the status tag, signed date) onto the client's EXISTING field, and **flag the gaps** — what they don't have that we still need (e.g. `APR Dashboard Link`, `Valcre Job` link) gets ADDED on their side. QA re-gates the mapping once the client field set is confirmed.
8. **Test ONE signing end-to-end in Valta** — submit → job → LOE send → sign → verify the tag swaps `loe sent` → `loe signed` and the card updates. Proof-first close.

---

## The status-tag pipeline (canonical set)

```
new arrival → loe sent → loe signed → awaiting payment → paid
```

The signed-trigger swaps the tag (`new arrival`/`loe sent` removed, next tag added). This is the set to create in Ben's account BEFORE saving the template, so it carries on import. (`apr hub` stays as a category tag, not part of the status swap.)

> Note: this 5-tag pipeline supersedes the earlier 6-tag draft in the Change Request — it's the set Ben confirmed live with QA. Reconcile the CR doc to match.

---

## How the config gets built (decided 2026-06-18) — reorganize BEN's account first, then template across

We do **not** test the reorg theory in the client's account. **Codex / computer-use reorganizes the existing setup on BEN's own test list** into the locked grouped structure (fields + divider headers + tags). Once it's right on Ben's account, we **save it as a Space template → public-share → the Valta owner imports it** (steps 2–3 above). So Codex only ever works in Ben's account; the template carries the result to Valta. See the companion [Codex Rebuild Prompt](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/CODEX-PROMPT-clickup-valta-rebuild.md).

**Fallback** — only if cross-account template import misbehaves: point the same Codex prompt at the Valta account to rebuild directly. Avoid this unless the template path fails; it means redoing the build in the client's account.

---

## Known gotcha — the in-code token is dead

The ClickUp token hardcoded in the source returns **"Token invalid."** The working token lives in **server secrets** (the webhook uses it at runtime). So agents can't create ClickUp objects from the client side with the in-code token — Valta objects get created by the **Valta owner in-UI** (template import) or by **Codex/computer-use**, and the integration re-point uses a **fresh Valta API token**.

---

## Definition of done

- [ ] Config finished + tags created in Ben's account; template saved + public-shared.
- [ ] Valta owner imported; fields/tags/statuses/views audited present in Valta.
- [ ] **Public sharing on the template DISABLED** after the import (structure not left world-readable).
- [ ] Formula fields + person-named automations recreated in Valta (the two known drops).
- [ ] Valta API token + list ID + field IDs captured.
- [ ] DocuSeal / Resend / QuickBooks re-pointed + ClickUp webhook recreated in Valta.
- [ ] One signing tested end-to-end in Valta; tag swap + card update proven.

---

*Authored 2026-06-18 by co-architect from qa-agent's research findings, for QA `/review-gate` then Ben. Companion: the Codex rebuild prompt. Pairs with the ClickUp Custom-Fields Change Request (field set + tag mechanism + cutover notes).*

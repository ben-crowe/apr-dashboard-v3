# Dashboard field → ClickUp card mapping (canonical reference)

**By:** qa-agent · 2026-06-03 · sourced from all 4 edge functions + the client-side builder
**Target reference:** the rich "Summit Tower" (VAL251032) example card.
**Live-verify status:** PARTIAL — see "Live verification" note (the VAL261101 card 404s with the BC test token).

## The card is built by 3 stages (NOT 4) — important correction
The ClickUp card is touched by **three** builders. The 4th function CoArch listed (`create-valcre-job`) does **NOT touch the ClickUp card at all** (0 `clickup`/`markdown_description` references) — it builds the rich **Valcre job** (client contact, property, property contact). Its "rich content" goes to Valcre, not the card. So the rich Property Contact / Organization the card needs has **no ClickUp-card producer** today (see Gaps).

Also: the lean initial card is built by **two parallel implementations** — the edge function `create-clickup-task` AND the client-side `src/utils/webhooks/clickup.ts` (the edge one is commented "MUST match" the client one). Both produce the same lean card.

## Mapping table (dashboard field → card section/line → builder → live-verified)

### Stage 1 — initial card (`create-clickup-task` edge / `src/utils/webhooks/clickup.ts`) — LEAN
| Dashboard field | Card line | Builder | Live-verified |
|---|---|---|---|
| job.id | "NEW JOB ARRIVED — [View in APR Hub](url)" header link | create-clickup-task | ⚠ blocked (404) |
| client_first_name + client_last_name | **Client:** | create-clickup-task | ⚠ blocked |
| property_name + property_address | **Property:** | create-clickup-task | ⚠ blocked |
| property_type | **Type:** | create-clickup-task | ⚠ blocked |
| intended_use | **Intended Use:** | create-clickup-task | ⚠ blocked |
| notes | **Notes:** (optional) | create-clickup-task | ⚠ blocked |
| — | status = "to do" | create-clickup-task | ⚠ blocked |

### Stage 2 — LOE QUOTE & VALUATION section (`update-clickup-task`)
| Dashboard field | Card section → line | Builder | Live-verified |
|---|---|---|---|
| valcre_job_number | header "VALCRE JOB NUMBER" link | update-clickup-task | ✅ values sync confirmed (Valcre side) |
| property_rights_appraised | PROPERTY VALUATION → Property Rights | update-clickup-task | ✅ field-map verified |
| scope_of_work | PROPERTY VALUATION → Scope of Work | update-clickup-task | ✅ |
| report_type | PROPERTY VALUATION → Report Type | update-clickup-task | ✅ |
| appraisal_fee | FINANCIAL DETAILS → Appraisal Fee | update-clickup-task | ✅ |
| retainer_amount | FINANCIAL DETAILS → Retainer Amount | update-clickup-task | ✅ |
| delivery_date | FINANCIAL DETAILS → Delivery Date | update-clickup-task | ✅ |
| payment_terms | FINANCIAL DETAILS → Payment Terms | update-clickup-task | ✅ |
| internal_comments / delivery_comments / payment_comments / client_comments | APPRAISER NOTES (bulleted) | update-clickup-task | ✅ |

> "Live-verified ✅" for Stage 2 = the dashboard→Valcre field sync is confirmed (separate doc `VERIFY-stage2-mapping-VAL261101`). The card RENDERING of these couldn't be read live (token 404) — values are right at source; card render is pending a readable task.

### Stage 2.5 / 3 — status tracker (`docuseal-webhook`)
| Event | Card line | Builder | Live-verified |
|---|---|---|---|
| DocuSeal "sent" | "▸ LOE Sent: <time>" | docuseal-webhook | ⚠ not run (no LOE sent this session) |
| DocuSeal "completed" | "▸ LOE Signed: <time> by <signer>" | docuseal-webhook | ⚠ not run |

## ⚠ GAPS — rich Summit Tower sections that NO current builder produces
The Summit Tower target card has labeled sections the current builders do **not** emit. These are real gaps to close before the card matches the target:

1. **CLIENT INFO section** — current card emits only a flat `**Client:** <name>` line, not a labeled CLIENT INFO block with title/org/phone/email/address. **No producer.**
2. **PROPERTY INFO section** — current card emits flat `Property:` + `Type:` only; no labeled block. **No producer.**
3. **PROPERTY CONTACT section** — **no ClickUp-card producer at all.** The property contact is sent to *Valcre* by create-valcre-job; nothing writes it into the card. (This is the create-valcre-job mis-assumption.)
4. **CLIENT COMMENTS section** — not a labeled Stage-1 section; client_comments only appears inside Stage-2 APPRAISER NOTES (update-clickup-task).
5. **Status-tracker scaffold (Received / blank LOE Sent / blank LOE Signed)** — docuseal-webhook UPDATES/inserts these lines, but **no create function lays down the initial tracker + "Received" date.** docuseal-webhook has insert-fallbacks so it self-heals, but the "Received" origin is unconfirmed → the tracker may not appear until a DocuSeal event fires.

**Bottom line:** the current card is the LEAN Stage-1 + rich Stage-2 LOE section + status tracker on DocuSeal events. The rich Stage-1 sections (CLIENT INFO / PROPERTY INFO / PROPERTY CONTACT / CLIENT COMMENTS) in the Summit Tower example are **not produced by today's code** — they're either from an older builder or were hand-built. To hit the Summit Tower target, a builder must emit those Stage-1 sections (likely belongs in create-clickup-task, pulling the rich client/property/contact fields the same way create-valcre-job does for Valcre).

## Live verification — why it's PARTIAL
VAL261101's card (`86b8c5xt9`) returns **404 with the BC test token** — the task lives on a prod workspace the token can't read. So I could not read the rendered card to confirm sections live. Options to unblock: (a) use the prod ClickUp token to read 86b8c5xt9, or (b) create a fresh task on the test list 901709622357 and drive the 3 stages against it. The Stage-2 *field values* are independently confirmed correct at the Valcre source (separate doc); only the card *rendering* is unverified.

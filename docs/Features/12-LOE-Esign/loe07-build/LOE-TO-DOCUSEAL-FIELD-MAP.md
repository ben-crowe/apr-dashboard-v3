# LOE-07 → DocuSeal Field Map (PREP SPEC — investigate only, not wired)

**Author:** react-specialist (dev-3)
**Date:** 2026-06-04
**Status:** PREP / mapping spec. No code touched. Wiring is the clean follow-up.
**Scope:** How LOE-07 template data feeds DocuSeal's signable document. Field-by-field map + gaps + decisions.

---

## 0. The headline (read this first)

**There are TWO DocuSeal code paths in this repo. They are NOT the same, and the LIVE one is the opposite of what the old mapping doc describes.**

| Path | Endpoint | How fields land | Status |
|---|---|---|---|
| **A — HTML injection** (`generateLOE.ts` → `generateAndSendLOE`) | `POST /submissions/html`, **NO `template_id`** | Placeholders are string-replaced into the HTML body **server-side BEFORE** DocuSeal sees the doc. DocuSeal only adds the 2 interactive anchor fields. | **LIVE** — this is what LoeQuoteSection calls. |
| **B — Template ID** (`docuseal.ts` → `sendForESignature` + `mapJobToDocuSealFields`, template `1680270`) | `POST /submissions` with `template_id` + a `fields[]` array of 22 named fields | DocuSeal owns the template; the 22 fields are DocuSeal field objects pre-filled via API. | **DEAD CODE.** Grep confirms `sendForESignature`/`mapJobToDocuSealFields` are never called from any component. The archive doc `_Archive/3-DOCUSEAL-LOE-FIELD-MAPPING.md` documents THIS dead path. |

**Consequence for the mapping:** In the live path (A), **there is no per-field "DocuSeal field definition" to map to.** The 38 LOE-07 tokens are NOT DocuSeal fields — they are resolved to plain text in the HTML before submission. DocuSeal contributes exactly **2** real fields: one signature, one date, both via anchor tags. So the real map has two halves:

1. **Prefill half** — 38 `[Token]` placeholders → job/jobDetails data → baked into HTML as static text (`mapDataToV07Fields`).
2. **Signer half** — 2 anchor tags (`<signature-field>`, `<date-field>`) → 2 interactive DocuSeal fields the client fills.

CLAUDE.md and the archive doc still reference template `1680270` as if it's live. It is not. **Recommend CoArch decide whether to delete path B or keep it documented as deprecated** (see Decisions, item D1).

---

## 1. LIVE path data flow (Path A)

```
LoeQuoteSection.tsx
  → generateLOEHTML(job, jobDetails)          // loads newest active loe_templates row
      → loadTemplateRow()                       // version-aware; v07 = version >= 6
      → getMapperForVersion(version)            // v>=6 → mapDataToV07Fields, else mapDataToV3Fields
      → mapDataToV07Fields(job, jobDetails)     // builds { '[Token]': 'value' }
      → applyConditionalScheduleA()             // strips Schedule-A block unless Multiple Properties
      → string-replace every [Token] in HTML
  → generateAndSendLOE(job, jobDetails, html)
      → POST /functions/v1/docuseal-proxy?endpoint=submissions/html
         payload: { name, send_email:false, documents:[{html, size:'Letter'}],
                    submitters:[{ email, name, role:'First Party' }] }   // NO template_id
      → DocuSeal scans HTML for <signature-field>/<date-field> role="First Party"
      → returns { id, slug }
      → persist loe_submissions (filled HTML snapshot) + job_loe_details.docuseal_submission_id
      → send-loe-email-fixed (Resend) with /sign/:id link
```

Anchor `role="First Party"` **must** equal the submitter `role` — both are `"First Party"`. ✓ verified in v07 template + payload.

---

## 2. Prefill half — LOE-07 `[Token]` → source (38 tokens)

All of these become **static text** in the HTML. None are interactive DocuSeal fields. Source = `mapDataToV07Fields` in `src/utils/loe/generateLOE.ts:136`.

| # | LOE-07 Token | Source (job / jobDetails) | Wired? | Fallback / Notes |
|---|---|---|---|---|
| 1 | `[Today's Date]` | generated `toLocaleDateString` | ✓ | always |
| 2 | `[ClientFirstName]` | `job.clientFirstName` | ✓ | `''` |
| 3 | `[ClientLastName]` | `job.clientLastName` | ✓ | `''` |
| 4 | `[ClientCompanyName]` | `job.clientOrganization` | ✓ | `''` |
| 5 | `[ClientOrganizationAddress]` | `job.clientAddress` | ✓ | `''` |
| 6 | `[ClientPhone]` | `job.clientPhone` | ✓ | `''` |
| 7 | `[ClientEmail]` | `job.clientEmail` | ✓ | `''` |
| 8 | `[JobNumber]` | `jobDetails.jobNumber` | ✓ | `'Awaiting Valcre job'` |
| 9 | `[JobName]` | `propertyName + propertyAddress` | ✓ | joined |
| 10 | `[PropertyName]` | `job.propertyName` | ✓ | `'Unnamed Property'` |
| 11 | `[PropertyAddress]` | `job.propertyAddress` | ✓ | `''` |
| 12 | `[PropertyType]` | `job.propertyType` | ✓ | `''` |
| 13 | `[InterestAppraised]` | `jobDetails.propertyRightsAppraised` | ✓ | `''` |
| 14 | `[CurrentUseImprovements]` | `jd.currentUse / currentUseImprovements` | ⚠ | gap field — see G1 |
| 15 | `[ProposedUseImprovements]` | `jd.proposedUse / proposedUseImprovements` | ⚠ | gap field — see G1 |
| 16 | `[AuthorizedUse]` | `jd.authorizedUse \|\| job.intendedUse` | ✓ | |
| 17 | `[Valuetimeframe]` | `jd.valueTimeframe \|\| jobDetails.valuationPremises` | ✓ | |
| 18 | `[ValueScenarios]` | `jd.valueScenarios` | ✓ | `''` |
| 19 | `[ReportType]` | `jobDetails.reportType` | ✓ | `''` |
| 20 | `[AssignmentType]` | `jd.assignmentType` | ✓ | drives Schedule-A conditional |
| 21 | `[ApproachestoValue]` | `jd.approachesToValue` | ✓ | `''` |
| 22 | `[Fee]` | `jobDetails.appraisalFee` | ✓ | `'$TBD'`, currency-formatted |
| 23 | `[DeliveryTime]` | `jd.deliveryTime / deliveryTimeWeeks` | ✓ | `''` |
| 24 | `[ClientDocuments]` | `jd.clientDocuments` | ✓ | `''` |
| 25 | `[PreviouslyAppraised]` | `jd.previouslyAppraised` | ⚠ | gap field — see G1 |
| 26 | `[ScheduleAPropertyList]` | `jd.scheduleAPropertyList` | ⚠ | gap field — see G1; only rendered if Multiple Properties |
| 27–32 | `[ValueScenario1..6]` | `jd.valueScenario1..6` | ⚠ | EA/HC value table rows; mostly empty — see G2 |
| 33–38 | `[EA/HCSummary1..6]` | `jd.eaHcSummary1..6` | ⚠ | narrative Text Library, **not yet wired** — see G2 |

**`[Placeholder]`** (appears once, line 10) is a **build comment artifact**, not a real token. No mapping needed.

**Coverage:** every renderable token has a mapper entry. No token is left unreplaced (the loop replaces all keys; unmapped tokens would render literally, but there are none). The ⚠ rows resolve to empty strings until their dashboard inputs / Text Library exist.

---

## 3. Signer half — the only real DocuSeal fields (2)

Source: `LOE-template-v07.html:276,279`.

| DocuSeal field | Anchor tag | role | required | Who fills | Notes |
|---|---|---|---|---|---|
| Client Signature | `<signature-field name="Client Signature" role="First Party" required="true">` | First Party | yes | **Client (signer)** | 300×40, drawn/typed/uploaded |
| Signature Date | `<date-field name="Signature Date" role="First Party" required="true">` | First Party | yes | **Client (signer)** | 150×22, inline date picker |

That's the entire interactive surface. No appraiser counter-signature, no text/select/checkbox anchor fields in v07.

---

## 4. Gaps

- **G1 — Job-prep inputs not all on the dashboard yet.** `currentUse`, `proposedUse`, `previouslyAppraised`, `scheduleAPropertyList` are read off `jobDetails as any` but several have no dashboard control feeding them — they resolve to `''`. These are the same job-prep fields tracked in the Valcre-sync arc; they fill in as those inputs land. **Not a DocuSeal problem — an upstream input gap.**
- **G2 — EA/HC value table (rows 27–38) is unwired.** The 6 `[ValueScenario_n]` / `[EA/HCSummary_n]` pairs render a table (template line 199). `eaHcSummary_n` is explicitly TODO ("narrative Text Library") in code (`generateLOE.ts:171`). Until the Text Library exists, these rows render blank. **Decision needed on where that narrative content comes from (D3).**
- **G3 — No appraiser/second-signer field.** Only the client signs. If Valta needs to counter-sign the LOE, a second anchor + a second submitter role would be required. Flag, don't assume.
- **G4 — Path B drift.** `docuseal.ts` (template 1680270, 22 named fields) is dead but still referenced by CLAUDE.md + the archive doc. Risk: a future agent wires to the wrong path. (D1.)
- **G5 — `validateRequiredFields` still lives in the dead file.** LoeQuoteSection imports `validateRequiredFields` from `docuseal.ts` (the dead-path file) even though it uses the live path for everything else. It works (the fn is path-agnostic), but it's a confusing cross-import. Cosmetic; flag for cleanup.

---

## 5. Decisions needed (for CoArch / Ben — not mine to make)

- **D1 — Delete or formally deprecate Path B** (`sendForESignature`, `mapJobToDocuSealFields`, template `1680270`)? It's dead code that contradicts the live architecture and misleads the docs. Recommend: deprecate-in-place with a header comment + update CLAUDE.md, OR delete `mapJobToDocuSealFields`/`sendForESignature` and keep only `validateRequiredFields` + webhook types.
- **D2 — Who signs?** Confirm client-only (current) vs client + appraiser counter-sign. Drives whether G3 work is needed.
- **D3 — EA/HC narrative source.** Where do `[EA/HCSummary1..6]` come from — a Text Library, free-text dashboard fields, or Valcre? Until decided, that table stays blank.
- **D4 — Prefill vs signer-entered confirmation.** Current design = everything prefilled as static text, client enters ONLY signature + date. Confirm that's the intended client experience (vs. letting the client edit anything in-document). This is the deliberate "no editable DocuSeal fields = no overlay bugs" choice; just confirm it's still wanted.

---

## 6. What "wiring" actually means after this (preview of the follow-up)

Because the live path bakes text into HTML, **"wiring a new LOE field to DocuSeal" = adding one line to `mapDataToV07Fields`** (token → source) + ensuring the `[Token]` exists in `LOE-template-v07.html`. There is no DocuSeal template field to create, no field-option-ID to resolve. The only true DocuSeal-side objects are the 2 anchors, which are already in the template. So the follow-up is small and contained — the heavy lift is upstream (G1/G2 dashboard inputs + Text Library), not DocuSeal.

---

## Sources
- `src/utils/loe/generateLOE.ts` (mapDataToV07Fields:136, generateAndSendLOE:229, loader:40)
- `src/utils/webhooks/docuseal.ts` (dead Path B)
- `docs/Features/12-LOE-Esign/loe07-build/LOE-template-v07.html` (38 tokens + 2 anchors)
- `docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md` (gold-standard, describes live HTML path)
- `docs/Features/12-LOE-Esign/_Archive/3-DOCUSEAL-LOE-FIELD-MAPPING.md` (documents dead Path B — historical)
- `src/components/dashboard/job-details/LoeQuoteSection.tsx:23,24,697,745` (call sites)

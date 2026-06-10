---
content_type: workflow
title: LOE-07 — Edit / Re-host / Cascade-Version Workflow (ESTABLISHED)
status: established + proven 2026-06-09
owner: Codex (source/edits) · qa-agent (re-host + verify + DocuSeal) · ui-designer (QA/compare) · co-architect (planning)
home: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-LOE-ESIGN-FEATURE.md
tags: [apr-workflow, loe-07, e-signature, docuseal, cascade, workflow, codex, paged-js, established]
entities: [[LOE E-Sign Feature]] [[loeCascade]] [[DocuSeal]] [[Paged.js]] [[Codex]]
---

# LOE-07 — Edit / Re-host / Cascade-Version Workflow

**Tags:** #apr-workflow #loe-07 #e-signature #docuseal #cascade #workflow #codex #paged-js #established
**Entities:** [[LOE E-Sign Feature]] [[loeCascade]] [[DocuSeal]] [[Paged.js]] [[Codex]]

> 🏠 Home: [LOE / E-Signature Feature Sheet](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-LOE-ESIGN-FEATURE.md) · [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) → Significant Features → LOE + E-Signature.

The proven, repeatable loop for changing the LOE contract and for generating cascade-logic
PDF versions. Established and confirmed working 2026-06-09. **This is the established workflow —
follow it; don't reinvent the source-of-truth question each time.**

---

## The key fact that makes this clean

**Three views are PROVEN identical: Codex's integrated browser viewer = the app's in-app previewer =
the downloaded PDF.** This was the open worry — whether what we saw in Codex's viewer would actually
be what shipped — and it's now confirmed it is. No discrepancy across the chain. So there is no
"where do I change the source" guesswork:

- **Codex holds the editable source template** and is the go-to for ANY visual change — spacing,
  color, alignment, content. His browser-viewer render is exactly what ships.
- What Codex adjusts is what the client gets. No drift, because QA loads the same file Codex edits
  (not a separate mockup). That three-way match is the whole basis of trust.

### ⛔ Do NOT use Paper to make the LOE editable
Paper shifts the format slightly and is **not a predictable view** of what the HTML becomes in
production. Paper is fine as a rendered-image review board, but the editable source stays with Codex.
The only reliable "what it'll look like" is Codex's browser viewer / the app previewer / the download.

---

## Loop 0 — starting from a fresh source (PDF or, better, ODT)

When a new or revised contract arrives as a document:

1. **Hand Codex the source — ODT is better than PDF** (cleaner structure to convert). Codex turns it
   into HTML with minimal effort.
2. **Do NOT assume round 1 nails spacing/formatting** — first pass gets the structure; expect a few
   nudge cycles on spacing and layout. That's normal, not a failure.
3. **Codex's browser viewer makes each nudge fast** — render, look, adjust, repeat — and because it
   matches the downloaded PDF, what he converges on in his viewer is what the app will ship.
4. Once it looks right, it enters **Loop A** (QA re-hosts it into the live template + re-verifies).

---

## Loop A — content / spacing / color change (NO app redeploy)

1. **Codex edits** the contract template file on his end → previews in his desktop previewer
   (looks exactly like the final downloaded PDF).
2. **Codex hands the updated HTML back.**
3. **QA swaps the HTML into the live template.** The contract lives as **data the app reads live**
   (`loe_templates` row), so it shows immediately — **no redeploy needed** for pure content/spacing/color.
4. **QA re-verifies every time** (these regress easily on spacing edits):
   - footer renders per page,
   - white paper (no grey body reintroduced),
   - signature / name / date field anchoring still holds on the acceptance line.
5. **Redeploy is ONLY needed if app *code* changes** — never for contract content.

**DocuSeal:** QA can upload the template to DocuSeal anytime for changes — that path is established.

---

## Loop B — the Download button (now a true PDF)

Path: **Preview & Send LOE → Download.**

- Uses **Paged.js** (polyfill vendored to [/public/paged.polyfill.js](~/Development/APR-Dashboard-v3/public/paged.polyfill.js)) → opens a clean print window,
  paginates, auto-fires the print dialog → client picks **"Save as PDF."** Produces a real PDF
  (previously it wrongly downloaded HTML only).
- Output verified: footer on **every** page, page 1 has **no** header rule, date fills.
- **Footer format — bare page number (RESOLVED 2026-06-09).** The keeper footer is **left:**
  `VALTA PROPERTY VALUATIONS LTD.` · **center:** bare current-page number only (CSS `counter(page)`,
  no "Page X of Y", no total) · **right:** `LETTER OF ENGAGEMENT`, each with a `#003B7E` top rule.
  Confirmed against the client ODT `styles.xml` (co-arch): the source footer is a bare page field with
  zero page-count tags and no "Page" word. The earlier "Page X of Y" was ours and wrong on both counts;
  Codex is instructed to the bare number. **Closed — not an open reconcile.**
- **The print-dialog step is the stable tradeoff** — it's what guarantees the footer survives. True
  one-click (no dialog) would need a hosted render service; not worth it for this.
- **Allow pop-ups** for the site or the browser blocks the new tab.
- Download tab favicon = the **VA mark** (the old Lovable heart was removed).

### Previewer vs Download — footer (accepted behavior)
Footers render per page in the **download**, but **not in the previewer** — that's fine and expected.
The previewer won't show the footer; as long as footers + correct `Page X of Y` are present on the
downloaded PDF, we're good. **Page count flexes to the content** (light job ≈ 7 pages, worst-case
stuffed ≈ 9) — that's intended, not a bug; it varies per real job and per cascade pick.

---

## Loop C — generating cascade-logic PDF versions (for the client)

**Goal:** show the client that changing dashboard fields changes the contract — produce 3–4 labeled
PDF versions, each named for its logic.

**Per-version loop:** set ONE dashboard field → re-open **Preview & Send** → **Download** →
**rename the PDF** to its logic version. Repeat.

**The driver field is almost always `Status of Improvements`** (one special case uses `Authorized Use`).
The proven four-version matrix (co-arch planned, ui-designer verified against [src/utils/loe/loeCascade.ts](~/Development/APR-Dashboard-v3/src/utils/loe/loeCascade.ts)):

| Version | Field change | Section 10 result | Why it's in the set |
|---|---|---|---|
| **V1 — baseline** | Status of Improvements = **Improved – Completed** | 1 scenario: *As Stabilized* | shortest contract — the floor to compare against |
| **V2 — renovation** | Status = **Improved – Under Renovation** | 2 scenarios: *As-Is* + *As If Complete & Stabilized* | section grows + pages reflow vs V1 |
| **V3 — land (demo)** | Status = **Proposed – Improved Land (Demolition Required)** | 2 scenarios: *As If Vacant Land* + *As If Complete & Stabilized* | same row count as V2 but **different text** — proves content swaps, not just row count |
| **V4 — override** | Authorized Use = **Insurance** (trumps status) | 1 scenario: *Insurable Replacement Cost* | shows the override path — **and** its narrative comes through **blank** (text not yet written — a useful gap to catch) |

**Honest expectation:** the cascade changes three sections together (Value Scenarios §5, Approaches
§9, the §10 table), so the swap is very visible — but the per-version row difference is small, so you
may NOT always see a whole page added/removed between versions. The real proof is those sections
growing/reflowing with the logic AND the page numbering staying correct through it.

**§10 narrative gap (carry-forward):** 4 scenarios still resolve to blank summaries until **Chris**
supplies the Text-Library copy (As If Complete – Rezoned / Serviced / Subdivided, Insurable
Replacement Cost). V4's blank line is that gap showing through.

---

## Roles
- **Codex** — owns + edits the source template; desktop preview = the ship target.
- **qa-agent** — re-hosts Codex's file into the live template, re-verifies (footer / white / fields),
  uploads to DocuSeal, generates the cascade version PDFs.
- **ui-designer** — QA/compare eye + cascade-scenario review (verifies picks against [loeCascade.ts](~/Development/APR-Dashboard-v3/src/utils/loe/loeCascade.ts)).
- **co-architect** — version-matrix planning + coordination.

## Latest build state (2026-06-09)

**Codex footer-spacing tweak (in the keeper, edited in place, same filename):**
- Footer rule/text spacing now matches the source closely — measured gap source ≈ 0.070in vs updated
  HTML ≈ 0.063in.
- Changes: bottom page margin 0.58in → 0.46in · footer margin-box text aligned to top · footer padding
  above text 5px → 2px.
- Page counts stable: placeholder 9 pages, worst-case 10 pages.

**QA collision check — PASS (the important part, since Codex + QA both edited the same file):**
- No collision. QA's three earlier fixes (white paper, signature-field anchoring, date token) all
  survived Codex's footer edit; the footer changes apply cleanly on top. The two edit sets coexist.
- Brackets intact — the template keeps all `[Token]` placeholders (NOT populated). **Page 3 is the
  cascade page — its scenario/assumption slots MUST stay as brackets or the cascade dies.** The
  worst-case filled version exists only as a separate test file ([work-html/autoflow-worstcase.html](~/Development/valta-graphics/LOE-V07/work-html/autoflow-worstcase.html)),
  never the template.

**Filename / versioning decision (locked):** Codex edits the source **in place, same filename** —
QA pulls from one known path and handles live versioning on the app side. No per-change renames.

**Open pagination edge case (Ben + QA handle together on real data):** when a section empties out
under a given cascade pick, an orphan line may need to flow to the next page. Small reflow fixes,
caught live — not a Codex job.

## Source references
- **★ Codex page-detail spec sheet (extrapolated from client source):**
  [LOE-V07-SPEC-SHEET.md](~/Development/valta-graphics/LOE-V07/LOE-V07-SPEC-SHEET.md) — page setup, margins, logo dims,
  full typography scale (fonts/sizes/weights/colors per element), footer spec, DocuSeal notes.
- [src/utils/loe/loeCascade.ts](~/Development/APR-Dashboard-v3/src/utils/loe/loeCascade.ts) — STATUS_TO_SCENARIOS + Insurance override + NARRATIVES library.
- [LOEPreviewModal.tsx](~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/actions/LOEPreviewModal.tsx) — Download (Paged.js) + favicon.
- [LOE Template V07 - DocuSeal.html](~/Development/valta-graphics/LOE-V07/LOE%20Template%20V07%20-%20DocuSeal.html) — current keeper template.
- Cascade→contract detail: [CASCADE-TO-LOE-CONTRACT-NOTES.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/CASCADE-TO-LOE-CONTRACT-NOTES.md).
- Open gaps: [NEXT-STEPS-GAP-CLOSURE-2026-06-09.md](~/Development/APR-Dashboard-v3/docs/NEXT-STEPS-GAP-CLOSURE-2026-06-09.md).

---

**Last reviewed:** 2026-06-09 by documentation-engineer (km-markdown standardize, content unchanged).

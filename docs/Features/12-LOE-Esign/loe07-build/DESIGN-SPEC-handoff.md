---
content_type: design-spec-handoff
title: LOE-07 Design Spec → react-spec (build production HTML from this)
author: ui-designer
created: 2026-06-03
source_design: Paper canvas "Build Workflow Testing" page 2-0, artboards L3Y-0 (p1) … LEC-0 (p9)
reference: V07 contract (LOE-Template-V07.pdf) + loe07-skeleton.html (pandoc placeholders)
status: design complete — faithful recreation of V07, verified page-by-page
---

# LOE-07 — Design Spec Handoff

Build the production HTML **from this spec** — don't re-derive from the PDF. This is the
canvas design translated to exact values. Page geometry = **US Letter, 816×1056px @96dpi**
(`@page { size: 8.5in 11in; margin: 0.75in; }`). Content margin ≈ 64px sides. Body font =
**Open Sans** (verified: V07 embeds Open Sans Regular + Bold).

Exported reference renders: `~/Development/KM-Exp/data/screenshots/loe07-page1..9.png`.

---

## 1. Color tokens (sampled from V07)

| Role | Hex | Use |
|------|-----|-----|
| Navy (brand) | `#0A3D62` | Logo, section headings, contact block |
| Body text | `#1A1A1A` | All body copy, sub-headings |
| Rule grey | `#C9C9C9` | Footer top rule, intro divider |
| Footer text | `#6B7785` | Footer labels + page number |
| Page2+ header rule | `#3A3A3A` | Thin rule under continuation-page logo |
| Accent (field markers, design-only) | `#C08A2E` | DocuSeal field + conditional notes — **drop in production**, replace with real DocuSeal tag / conditional logic |

---

## 2. Type scale (Open Sans, px)

| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| Section heading (`1. ASSIGNMENT…`) | 15px | 700 | navy `#0A3D62`, ALL-CAPS, `letter-spacing:0.04em`, `line-height:20px` |
| Sub-heading (`Property Name`) | 13.5px | 700 | body color, `padding-top:~12px` |
| Body / placeholder | 13.5px | 400 | `line-height:19px`, paragraphs `text-align:justify` |
| Contact block (letterhead) | 9.5px | 600 | navy, right-aligned, `line-height:14px` |
| Footer | 9px | 400 | `#6B7785`, `letter-spacing:0.04em` |
| Appendix A conditions (dense) | 9.5–10px | 400 | `line-height:13–14px`, justified, numbered list |
| Sub-numbered clauses (14.x) | label 13px/700, body 12.5px/400 | | tighter `line-height:17px` on the dense terms page |

Section-heading pattern: navy, bold, uppercase, numbered `"N. TITLE"`. No underline rule
(V07 has none). Sub-headings are bold black, value/body directly beneath.

---

## 3. Letterhead logo (INLINE SVG — do not use raster)

Paper rejected the raster (`<img>` + `backgroundImage` data-URI both render blank); the V07
embedded PNG is fine for the PDF path, but for editable HTML use this inline-SVG lockup. It's
the real V-mark (path traced from `~/Development/valta-brand/valta-v-figma.svg`) + Open Sans
wordmark. Crisp at any scale, navy `#0A3D62`.

**Big lockup (page 1 letterhead):**
```html
<div style="display:flex; align-items:center; gap:9px;">
  <svg width="40" height="31" viewBox="0 0 95 74.4094" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.98313 9.61043C3.09908 14.8973 -0.0451475 19.3434 0.000490617 19.4947C0.0437268 19.646 4.3217 26.362 9.50523 34.4208C14.6864 42.4795 20.4584 51.5062 22.3296 54.4775C24.1983 57.4488 27.7653 63.1248 30.2514 67.0881L34.7744 74.2941L61.17 74.4094C71.501 58.0325 74.5012 53.1684 74.5012 53.0363C74.5012 52.8802 69.8845 52.7745 61.2493 52.7361L47.9974 52.676C35.2019 32.7562 29.4227 23.7318 26.9006 19.7685C24.3785 15.8052 21.3279 11.0805 20.1245 9.26695C18.9187 7.45583 17.0595 4.62867 15.9907 2.9857L14.0474 0L6.98313 9.61043ZM81.5486 0.242603C81.4093 0.413146 78.4837 4.98417 75.0512 10.4007C71.6187 15.8172 65.9524 24.8079 62.4599 30.3782C58.9674 35.9508 56.0874 40.6252 56.0585 40.7669C56.0225 40.9494 59.8873 41.0263 69.1567 41.0239L82.3077 41.0215C92.1751 25.3796 95.0215 20.7605 94.9999 20.6645C94.9807 20.5684 92.0742 15.9493 88.5409 10.4007C85.0099 4.85206 82.0507 0.228191 81.9618 0.122503C81.8753 0.0168146 81.6904 0.0720607 81.5486 0.242603Z" fill="#0A3D62"/>
  </svg>
  <div style="display:flex; align-items:baseline; gap:6px;">
    <span style="font-family:'Open Sans'; font-size:25px; font-weight:400; letter-spacing:0.16em; color:#0A3D62;">VALTA</span>
    <span style="display:flex; flex-direction:column; font-family:'Open Sans'; font-size:6.5px; font-weight:600; letter-spacing:0.18em; color:#0A3D62; line-height:8px;"><span>PROPERTY</span><span>VALUATIONS</span></span>
  </div>
</div>
```

**Compact lockup (page 2+ continuation header):** same markup, change `svg` to `width="26" height="20"`, `VALTA` to `font-size:16px`, the small block to `font-size:4.5px; line-height:5.5px`, gaps `6px`/`4px`.

> Production note: the raster `valta-v07-letterhead.png` (extracted from V07) lives at
> `loe07-build/assets/valta-v07-letterhead.png` if you'd rather embed the real PNG in the
> DocuSeal HTML path (DocuSeal renders `<img>` fine — the blank-render was a Paper-canvas
> quirk only). Either is acceptable; the inline SVG is resolution-independent.

---

## 4. Letterhead contact block (right-aligned, page 1 only)

```html
<div style="display:flex; flex-direction:column; align-items:flex-end; text-align:right;
     font-family:'Open Sans'; font-size:9.5px; line-height:14px; color:#0A3D62; font-weight:600;">
  <span>Valta Property Valuations Ltd.</span>
  <span>300, 4838 Richard Road SW</span>
  <span>Calgary, AB T3E 6L1</span>
  <span>587-801-5151</span>
  <span>www.valta.ca</span>
  <span>clientcare@valta.ca</span>
</div>
```
Page 1 letterhead = flex row, `justify-content:space-between` (big logo left, contact right).
Pages 2–9 header = compact logo + a `1px #3A3A3A` rule under it (no contact block).

---

## 5. Auto @page running footer (VERIFIED DocuSeal-honored)

DocuSeal's HTML→PDF engine honors CSS paged-media running footers + `counter(page)`/`counter(pages)`
(confirmed end-to-end by react-spec + QA + co-arch on submission 8146815). Use the AUTOMATIC
approach — **drop the legacy manual per-page `.manual-footer` divs + hardcoded "Page 1 of 4"**.

```css
@page {
  size: 8.5in 11in;
  margin: 0.75in;
  @bottom-left   { content: "VALTA PROPERTY VALUATIONS LTD."; }
  @bottom-center { content: "Page " counter(page) " of " counter(pages); }
  @bottom-right  { content: "LETTER OF ENGAGEMENT"; }
  /* footer text: Open Sans 9px, color #6B7785, letter-spacing 0.04em */
}
```
(On the canvas the footer is mocked per-page as a flex row above a `1px #C9C9C9` rule — that
mock is for visual proofing only; production uses the `@page` rules above so reflow-safe across
variable-length content.)

---

## 6. Section-heading + field pattern

```html
<div style="font-size:15px; font-weight:700; color:#0A3D62; letter-spacing:0.04em;">1. ASSIGNMENT IDENTIFICATION</div>
<div style="font-size:13.5px; font-weight:700; margin-top:12px;">Property Name</div>
<div style="font-size:13.5px; line-height:19px;">[PropertyName]</div>
```
Placeholders kept verbatim in `[Brackets]` exactly as in `loe07-skeleton.html`. Two-column
rows (EA/HC table §10) = flex row, left label `width:220px; flex-shrink:0`, right value `flex:1`.
Bullet lists (§13, §15) = flex row, `width:18px` bullet slot + `flex:1` text.

---

## 7. Signature block (page 6 — Acceptance)

Layout, top to bottom:
1. `16. ACCEPTANCE` heading + agree paragraph.
2. **DocuSeal signature field** — canvas marks it as a `340px × 40px` box (dashed `#C08A2E`,
   label "DocuSeal signature field") sitting ABOVE a `340px × 1px #1A1A1A` signature line.
   → In production replace the marker box with the **real DocuSeal signature tag** anchored
   at this location; keep the underline rule.
3. `[ClientFirstName] [ClientLastName]` (13.5px) under the line.
4. `Date: ____________________` (13.5px), ~18px below.
5. Spacer, then the **Valta signatory block**:
   - `Respectfully,` (13.5px)
   - `VALTA PROPERTY VALUATIONS LTD.` (13.5px, bold)
   - Chris signature — canvas uses a `200×48` placeholder ("Chris signature here"). The real
     signature image is extractable from V07 (`pdfimages` → `loe07-build/assets/v07img-006-006.png`);
     embed as `<img>` in the DocuSeal HTML, OR leave as a signed-by-Chris static asset.
   - `Chris Chornohos, AACI, MRICS` (13.5px)
   - `Founder` (13.5px)

---

## 8. Page-by-page content map (canvas artboard → V07)

| Page | Artboard | Content |
|------|----------|---------|
| 1 | L3Y-0 | Letterhead + contact · date · client block · RE · intro · §1 Assignment ID · §2 Property Description |
| 2 | L5O-0 | §3 Authorized Client/Users/Use · §4 Purpose · §5 Value Scenarios · §6 Effective/Report Date · §7 Report/Assignment Type |
| 3 | L79-0 | §8 Scope of Work · §9 Approaches to Value · §10 EA & HC (6-row [ValueScenarioN]/[EA/HCSummaryN] table) |
| 4 | L8K-0 | §11 Professional Fees & Terms · §12 Property Info Request · §13 Inspection Requirements (bullets) · §14.1–14.2 |
| 5 | LAD-0 | §14.3–14.10 · §15 Prior Services & Conflict of Interest |
| 6 | LBT-0 | §16 Acceptance + signature block (see §7) |
| 7 | LCO-0 | Schedule "A" — Property List (conditional: insert when [AssignmentType] = Multiple Properties) |
| 8 | LD4-0 | Appendix A intro + Limiting Conditions 1–8 |
| 9 | LEC-0 | Limiting Conditions 9–24 |

All section body copy is transcribed verbatim from V07 on the canvas — pull exact strings from
the exported page renders or `loe07-skeleton.html`. Placeholders to wire (Phase 2, your code):
ClientFirstName/LastName/CompanyName/OrganizationAddress/Phone/Email, JobNumber, JobName,
PropertyName/Address/Type, InterestAppraised, CurrentUseImprovements, ProposedUseImprovements,
Valuetimeframe, ValueScenarios, ApproachestoValue, ReportType, AssignmentType, ValueScenario1-6,
EA/HCSummary1-6, Fee, DeliveryTime, ClientDocuments, PreviouslyAppraised, AuthorizedUse.

---

## Handoff

Design is locked + faithful to V07. Build production HTML to these tokens; wire placeholders +
DocuSeal tags + conditional Schedule A in code. Questions on any value → ping ui-designer.

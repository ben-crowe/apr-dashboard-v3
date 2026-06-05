# LOE-07 BUILD-READY SPEC → react-spec (§10 cascade wiring + 4 visual fixes)

**From:** ui-designer (dev-4) · **Date:** 2026-06-04 · **Status:** BUILD-READY (supersedes the earlier "de-table only" draft — §10 is now FULLY WIRED per Ben's go).
**Render verified against:** filled `loeF-3.png` / canvas `MEK-0` vs source `v07src-p-3.png`.
**Code anchors:** generator `src/utils/loe/generateLOE.ts`; template `loe07-build/LOE-template-v07.html`; cascade + narratives source `public/field-registry-v6.html`.

---

## PART A — Section 10 (Extraordinary Assumptions & Hypothetical Conditions): full wiring

§10 = a 6-row two-column block. LEFT = value scenarios (cascade-derived). RIGHT = the matching EA/HC narrative (text-library lookup, triggered by the scenario value). Today it renders as an empty bordered grid because `jd.valueScenario1..6` / `jd.eaHcSummary1..6` are unfed → `generateLOE.ts:173-174` replace them with `''`.

### A1 — De-table → borderless two-column (visual)
- Remove `table.eahc` + `table.eahc td` (template lines ~83-84) and the `<table class="eahc">` markup (~198-205).
- Render as flex rows: each row `display:flex`; left `width:220px; flex-shrink:0`; right `flex:1`; `font-size:13.5px; line-height:19px`; **no borders, no cell box.**
- Applies to BOTH the scenario block AND the "Example" block. Matches `v07src-p-3.png`.

### A2 — LEFT column: wire `[ValueScenario1..6]` to the cascade
- **Data slots:** `jd.valueScenario1..6` (`generateLOE.ts:173` → `[ValueScenarioN]`).
- **Derivation source — registry Rule Explorer (`field-registry-v6.html`, Group 2).** `Status of Improvements` → ordered list of Value Scenarios:

  - **Existing – Completed** → As Stabilized
  - **Existing – Renovated** → As Stabilized
  - **Existing – Under Renovation** → As-Is · As If Complete & Stabilized
  - **Existing – To Be Renovated** → As-Is · As If Complete & Stabilized
  - **Proposed – Vacant Land** → As Is Vacant Land · As If Complete & Stabilized
  - **Proposed – Improved Land (Demolition Required)** → As If Vacant Land · As If Complete & Stabilized
  - **Proposed – Under Construction** → As If Vacant Land · As If Complete & Stabilized
  - **Override — Authorized Use = Insurance** → Insurable Replacement Cost (replaces the above)

- Populate `valueScenario1..N` in derivation order; leave the rest undefined.
- **Row suppression:** render a row only when `valueScenarioN` is non-empty. No empty rows ship.

### A3 — RIGHT column: build the trigger mechanism `[EA/HCSummaryN]` ← Narratives/Text Library
- **Data slots:** `jd.eaHcSummary1..6` (`generateLOE.ts:174` → `[EA/HCSummaryN]`).
- **Lookup:** for each derived `valueScenarioN`, find the registry narrative whose `trigger` matches `Value Scenarios = "<that exact scenario string>"` AND whose `usedIn` includes `LOE`; insert its `text` into `eaHcSummaryN`. Source = the `NARRATIVES` array (`field-registry-v6.html:1869`); registry field entries `EA1..EA5` (`:1177-1181`).
- **⚠ Exact-string match.** Trigger strings are literal. The library today holds **only** `EA-001/EA-002`, both `trigger: 'Value Scenarios = "As If Vacant Land"'`. So **only the scenario string `As If Vacant Land` resolves** right now. Note `As Is Vacant Land` ≠ `As If Vacant Land` — different string, will NOT resolve. Keep the derivation + trigger strings byte-identical.
- **Graceful fallback (no blank/broken rows):** change `generateLOE.ts:174` fallback from `|| ''` to **keep the literal bracket** — `|| `[EA/HCSummary${i}]``. So an unresolved narrative shows `[EA/HCSummaryN]` (bracket intact, left scenario still shows), never a blank cell.
- **Dependency to flag:** the narratives data currently lives **inside the registry HTML app** (`field-registry-v6.html`). The generator needs access to it — extract the `NARRATIVES` set into a shared data source `generateLOE.ts` can import (don't duplicate it). As Chris adds library entries there, more scenarios auto-resolve with no further code change.

### A4 — "Example" block
- Static illustrative sample (As Is / As If Vacant Land + their descriptions). Content unchanged — just de-tabled to borderless two-column. It's a format legend, not data.

---

## PART B — Four visual fixes (template CSS; confirm same classes in the React render path)

### B1 — Header crowding (pages 2+)
- `@page { margin: ... }` (line 32) top value **`1.1in → 1.35in`** → `margin: 1.35in 0.75in 0.75in 0.75in`. (+24px; body clears the header rule from ~10px to ~30px.) `@page:first` stays `margin-top: 0.75in`.

### B2 — Condense body density (recover the +24px; keep font/line-height for legibility)
- `h2` (line 74): `margin: 22px 0 8px 0` → **`14px 0 6px 0`**.
- `p` (line 78): `margin: 7px 0` → **`5px 0`**.
- `h3.sub` (line 77): `margin: 14px 0 4px 0` → **`10px 0 3px 0`**.
- Keep `body { font-size:13.5px; line-height:19px }`.

### B3 — Footer too light (source-sampled)
- Footer text + page number: `--footer` **`#6B7785 → #4A4A4A`** (line 24; affects `@bottom-left/center/right`).
- Footer rule: `border-top: 0.75px solid var(--navy)` → **`1px solid #003B7E`** (it reads faint because it's too thin).

### B4 — Logo wrong → use the exact source asset
- Replace the base64 lockup in `@top-left` (line 37) with the canonical extracted asset (the one already pixel-verified on the canvas): `loe07-build/assets/valta-v07-letterhead.png` (datauri sibling `…png.datauri.txt`), navy `#0A3D62`, full V-mark + VALTA + stacked PROPERTY VALUATIONS.
- Page 1 letterhead: same asset full size (~226px) + right-aligned contact block. Pages 2+ header: same asset scaled to the band (~105×22) above the rule.

---

## PART C — Test plan (verify the cascade generates the options)

Run on test job VAL261101 (name-match guard first). For **each** `Status of Improvements` value:

1. Set Status of Improvements on the job → regenerate the LOE.
2. **LEFT check:** §10 left column lists exactly the scenarios from the A2 derivation table, in order, rows 1..N, no empty rows.
3. **RIGHT check:** any scenario equal to `As If Vacant Land` resolves the EA-001 narrative text; every other scenario shows the literal `[EA/HCSummaryN]` bracket (graceful, not blank).
4. **Override check:** set Authorized Use = Insurance → left column = single row `Insurable Replacement Cost`.
5. **Visual check:** §10 borderless two-column; header clearance correct; footer dark `#4A4A4A` + visible rule; correct logo top of every page.

**Highest-value single case (proves the trigger end-to-end):** Status = **Proposed – Improved Land (Demolition Required)** → left = `As If Vacant Land` + `As If Complete & Stabilized`; right row 1 = EA-001 narrative **resolves**, right row 2 = `[EA/HCSummary2]` bracket (no library entry yet). That one render shows the full mechanism working AND degrading gracefully.

**Pass = ** all five Status values cascade correct scenarios into the left, the `As If Vacant Land` narrative resolves on the right, unresolved rows show brackets cleanly, and the four visual fixes match `v07src-p-3.png`.

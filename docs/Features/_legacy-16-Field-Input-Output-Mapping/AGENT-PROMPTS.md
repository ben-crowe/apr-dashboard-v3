# Agent Prompts - Template Fixes & Calculator Updates

**Created**: 2026-01-09
**Purpose**: Ready-to-use prompts for agents to execute fixes and enhancements

---

## PROMPT 1: Fix Pages 52-57 Blue Headers

**Agent**: Any agent with template editing access
**Estimated changes**: 6 CSS blocks

```
Fix pages 52-57 in Report-MF-template.html - they're missing the blue border-bottom on Header1 elements.

Add these two properties to each page's h1.Header1 CSS rule:
- border-bottom: 1px solid #003b7e;
- padding-bottom: 5px;

Pages to fix:
- .page-sheet[data-page-num="Page 52"] h1.Header1 (line ~21187)
- .page-sheet[data-page-num="Page 53"] h1.Header1 (line ~21304)
- .page-sheet[data-page-num="Page 54"] h1.Header1 (line ~21640)
- .page-sheet[data-page-num="Page 55"] h1.Header1 (line ~21976)
- .page-sheet[data-page-num="Page 56"] h1.Header1 (line ~22312)
- .page-sheet[data-page-num="Page 57"] h1.Header1 (line ~22648)

You have all the reference formatting from the global .Header1 style at line 391.
```

---

## PROMPT 2: Add data-sample to Pages 36-37

**Agent**: Desktop or Sonnet agent with template knowledge
**Estimated changes**: ~30-50 field spans

```
Pages 36 and 37 in Report-MF-template.html are missing data-sample attributes on their field-mapped spans, causing field IDs to show in User Ready mode and push content past the footer.

Add data-sample="[example value]" to all field-mapped spans on:
- Page 36: Income Approach (intro page)
- Page 37: Rent Survey Comparison Table

Use North Battleford test data as reference for realistic sample values.
Match the pattern from Pages 49-50 which already have data-sample attributes.
```

---

## PROMPT 3: Update CalcInputPanel to v2 Spec

**Agent**: React/TypeScript developer
**Estimated changes**: Major refactor of CalcInputPanel component

```
Update src/features/report-builder/components/CalcInputPanel to match the v2 specification from docs/16-Field-Input-Output-Mapping/Calculator-Field-Reference-v2.md

Key changes:
1. Expand unit types from 4 to 6 (type1-type6)
2. Add SF field to each unit type (calc-type{N}-sf)
3. Add 2 missing vacancy inputs (concessions-rate, other-loss-rate)
4. Update expense field IDs to use -annual suffix
5. Add second cap rate field (calc-cap-rate-2)

Total inputs: 49 fields
- 30 unit mix (6 types × 5 fields)
- 3 other income
- 4 vacancy/loss
- 7 expenses
- 5 capitalization

Reference the UI mockup at: docs/16-Field-Input-Output-Mapping/Income-Input-UI-Mockup-v2.html
This shows the exact layout and collapsible sections.
```

---

## PROMPT 4: Identify Pages 19 & 24

**Agent**: Quick search agent
**Estimated time**: < 2 min

```
Find and report what Pages 19 and 24 are in Report-MF-template.html

Search for:
- <!-- PAGE 19: [title]
- <!-- PAGE 24: [title]

Report the full page title and whether these pages contain field-mapped spans that should have data-sample attributes.
```

---

## PROMPT 5: Update Calculator Engine to 127 Fields

**Agent**: Calculator specialist (Desktop or backend dev)
**Estimated changes**: Expand calculator logic

```
Update src/features/calculator-demo-v4/ to support the v2 field specification:

Input fields: 49 (currently 29)
Output fields: 78 (currently 33)
Total: 127 fields (currently 62)

Use Calculator-Field-Reference-v2.md as the authoritative spec.

Key expansions:
1. Unit mix: 4 → 6 types (add type5, type6)
2. Vacancy: 3 → 4 types (add other-loss-rate)
3. Expense fields: Rename to -annual suffix
4. Add per-category expense breakdowns (per-unit, per-sf, pct-egr)
5. Add cap-rate-2 and blended calculations

Verify all calculations match Valcre workbook formulas from:
docs/16-Field-Input-Output-Mapping/06-VALCRE-WORKBOOK-INCOME-STRUCTURE.md
```

---

## PROMPT 6: Update Template Pages 49-50 for v2

**Agent**: Template specialist
**Estimated changes**: Expand tables on 2 pages

```
Update Pages 49-50 in Report-MF-template.html to support v2 calculator outputs (127 fields).

Page 49 (Direct Capitalization):
- Expand unit mix table from 4 to 6 rows (type1-type6)
- Add SF column (calc-type{N}-sf, calc-total-sf)
- Add 4th vacancy/loss row (other-loss-rate)
- Expand expense section to show per-category breakdowns

Page 50 (Income Conclusion):
- Add cap-rate-2 field
- Add blended cap rate display
- Verify all 78 calculated outputs have placeholders

Ensure all field IDs match fieldRegistry.ts.
Add data-sample attributes with North Battleford example values.
```

---

## PROMPT 7: Verify Field Alignment

**Agent**: QA/verification agent
**Estimated time**: 10-15 min

```
Verify field alignment across all systems for Income Approach v2:

Check that these 127 fields exist and match across:
1. fieldRegistry.ts (src/features/report-builder/schema/)
2. CalcInputPanel component
3. Calculator engine (calculator-demo-v4)
4. Template pages 49-50
5. Calculator-Field-Reference-v2.md (source of truth)

Report any:
- Missing fields
- ID mismatches
- inputSource designation errors (user-input vs calculated)
- Fields in template but not in registry

Output as markdown table: | Field ID | Registry | CalcPanel | Engine | Template | Status |
```

---

## EXECUTION ORDER

**Phase 1 - Quick Fixes** (can run in parallel):
1. ✅ Prompt 1: Fix Pages 52-57 blue headers
2. ✅ Prompt 4: Identify Pages 19 & 24

**Phase 2 - Data Integrity**:
3. ✅ Prompt 2: Add data-sample to Pages 36-37

**Phase 3 - v2 Implementation** (sequential):
4. ✅ Prompt 3: Update CalcInputPanel
5. ✅ Prompt 5: Update calculator engine
6. ✅ Prompt 6: Update template pages 49-50

**Phase 4 - Verification**:
7. ✅ Prompt 7: Verify field alignment

---

## NOTES

- All prompts reference existing documentation
- Agents have line numbers and examples already
- No need to re-analyze formatting - just execute
- Each prompt is self-contained and executable

---

**Status**: Ready for agent deployment

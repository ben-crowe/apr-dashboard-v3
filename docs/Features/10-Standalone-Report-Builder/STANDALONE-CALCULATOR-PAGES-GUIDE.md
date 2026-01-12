# Standalone Calculator Pages Guide

**Created**: 2026-01-09
**Purpose**: Work on Income Approach pages independently, then integrate into main template

---

## Overview

**File**: `templates/STANDALONE-INCOME-PAGES-48-49.html`

This is a **standalone HTML file** containing ONLY Pages 48-49 (Direct Capitalization + Income Conclusion).

**Why standalone?**
1. ✅ Easier to update without touching 33,000-line main template
2. ✅ Can preview calculator integration independently
3. ✅ Test field IDs and data flow in isolation
4. ✅ Copy proven structure back into main template when done

---

## Current Status

**Version**: v1.0 - Baseline from Report-MF-template.html v2.9.0

**Structure**:
- ✅ Page 48: Direct Capitalization table (currently 2 unit types)
- ✅ Page 49: Income Conclusion summary
- ✅ Field-mapped spans with data-field-id attributes
- ✅ Dev Mode / User Ready Mode toggle
- ✅ Control panel for testing

**Unit Mix Current State**:
- Type 1: 1 Bed / 1 Bath (4 units, 650 SF)
- Type 2: 2 Bed / 1 Bath (8 units, 850 SF)
- ❌ Type 3-6: NOT YET ADDED

---

## Next Steps: Update to v2 Spec

### Step 1: Add 4 More Unit Type Rows

**Copy the Type 2 row structure**, change field IDs to type3, type4, type5, type6:

```html
<!-- Unit Type 3 Row (COPY Type 2, change all "type2" to "type3") -->
<tr>
    <td style="padding: 2px 4px; font-size: 7pt;">
        <span class="field-mapped" data-field-id="{{calc-type3-name}}"
              title="{{calc-type3-name}}" data-sample="3 Bed / 2 Bath">{{calc-type3-name}}</span>
    </td>
    <td style="padding: 2px 4px; font-size: 7pt; text-align: center;">
        <span class="field-mapped" data-field-id="{{calc-type3-count}}"
              title="{{calc-type3-count}}" data-sample="6">{{calc-type3-count}}</span>
    </td>
    <td style="padding: 2px 4px; font-size: 7pt; text-align: center;">
        <span class="field-mapped" data-field-id="{{calc-type3-sf}}"
              title="{{calc-type3-sf}}" data-sample="1050">{{calc-type3-sf}}</span>
    </td>
    <!-- ... continue for all 9 columns -->
</tr>
```

**Repeat for type4, type5, type6** with appropriate sample values.

### Step 2: Add Other Revenue Section

After UNIT MIX subtotal, add:

```html
<!-- OTHER REVENUE Section Header -->
<tr style="background: #f0f0f0; border-bottom: 0.5px solid #333; border-top: 6px solid white;">
    <td colspan="3" style="padding: 3px 6px; font-weight: bold; font-size: 8pt;">
        OTHER REVENUE
    </td>
    <td colspan="3" style="padding: 3px 6px; font-weight: bold; font-size: 8pt; text-align: center;">
        %PRR
    </td>
    <td style="padding: 3px 6px; font-weight: bold; font-size: 8pt; text-align: right;">$/UNIT</td>
    <td style="padding: 3px 6px; font-weight: bold; font-size: 8pt; text-align: right;">$/SF(yr)</td>
    <td style="padding: 3px 6px; font-weight: bold; font-size: 8pt; text-align: right;">$/YR</td>
</tr>

<!-- Parking Row -->
<tr>
    <td colspan="3" style="padding: 2px 4px; font-size: 7pt;">Parking</td>
    <td colspan="3" style="padding: 2px 4px; font-size: 7pt; text-align: center;">
        <span class="field-mapped" data-field-id="{{calc-parking-pct-prr}}"
              title="{{calc-parking-pct-prr}}" data-sample="100%">{{calc-parking-pct-prr}}</span>
    </td>
    <td style="padding: 2px 4px; font-size: 7pt; text-align: right;">
        <span class="field-mapped" data-field-id="{{calc-parking-per-unit}}"
              title="{{calc-parking-per-unit}}" data-sample="$600">{{calc-parking-per-unit}}</span>
    </td>
    <td style="padding: 2px 4px; font-size: 7pt; text-align: right;">
        <span class="field-mapped" data-field-id="{{calc-parking-per-sf}}"
              title="{{calc-parking-per-sf}}" data-sample="$0.77">{{calc-parking-per-sf}}</span>
    </td>
    <td style="padding: 2px 4px; font-size: 7pt; text-align: right;">
        <span class="field-mapped" data-field-id="{{calc-parking-annual}}"
              title="{{calc-parking-annual}}" data-sample="$7,200">{{calc-parking-annual}}</span>
    </td>
</tr>

<!-- Laundry Row (repeat structure) -->
<!-- Other Income Row (repeat structure) -->
```

### Step 3: Add Vacancy & Loss Section

```html
<!-- VACANCY & LOSS Section Header -->
<tr style="background: #f0f0f0; border-bottom: 0.5px solid #333; border-top: 6px solid white;">
    <td colspan="3" style="padding: 3px 6px; font-weight: bold; font-size: 8pt;">
        VACANCY & LOSS
    </td>
    <td colspan="2" style="padding: 3px 6px; font-weight: bold; font-size: 8pt; text-align: center;">
        %PGR
    </td>
    <td style="padding: 3px 6px; font-weight: bold; font-size: 8pt; text-align: center;">
        %EGR
    </td>
    <td style="padding: 3px 6px; font-weight: bold; font-size: 8pt; text-align: right;">$/UNIT</td>
    <td style="padding: 3px 6px; font-weight: bold; font-size: 8pt; text-align: right;">$/SF(yr)</td>
    <td style="padding: 3px 6px; font-weight: bold; font-size: 8pt; text-align: right;">$/YR</td>
</tr>

<!-- Vacancy Loss Row -->
<tr>
    <td colspan="3" style="padding: 2px 4px; font-size: 7pt;">Vacancy Loss</td>
    <td colspan="2" style="padding: 2px 4px; font-size: 7pt; text-align: center;">
        <span class="field-mapped" data-field-id="{{calc-vacancy-rate}}"
              title="{{calc-vacancy-rate}}" data-sample="5.0%">{{calc-vacancy-rate}}</span>
    </td>
    <td style="padding: 2px 4px; font-size: 7pt; text-align: center;">
        <span class="field-mapped" data-field-id="{{calc-vacancy-pct-egr}}"
              title="{{calc-vacancy-pct-egr}}" data-sample="5.3%">{{calc-vacancy-pct-egr}}</span>
    </td>
    <td style="padding: 2px 4px; font-size: 7pt; text-align: right;">
        <span class="field-mapped" data-field-id="{{calc-vacancy-per-unit}}"
              title="{{calc-vacancy-per-unit}}" data-sample="$890">{{calc-vacancy-per-unit}}</span>
    </td>
    <td style="padding: 2px 4px; font-size: 7pt; text-align: right;">
        <span class="field-mapped" data-field-id="{{calc-vacancy-per-sf}}"
              title="{{calc-vacancy-per-sf}}" data-sample="$1.13">{{calc-vacancy-per-sf}}</span>
    </td>
    <td style="padding: 2px 4px; font-size: 7pt; text-align: right;">
        <span class="field-mapped" data-field-id="{{calc-vacancy-amount}}"
              title="{{calc-vacancy-amount}}" data-sample="$10,680">{{calc-vacancy-amount}}</span>
    </td>
</tr>

<!-- Concessions Row -->
<!-- Credit Loss Row -->
<!-- Other Loss Row (NEW for v2) -->
<!-- Total Vacancy Row -->
```

### Step 4: Add Operating Expenses Section

Reference: `Template-Page-Field-Mapping.md` lines 98-122

7 expense categories × 5 columns each (annual, per-unit, per-sf, %PGR, %EGR)

### Step 5: Add NOI & Value Sections

Reference Desktop's `Income-Input-UI-Mockup-v2.html` for exact structure.

---

## Testing Workflow

### 1. Open Standalone File in Browser
```bash
open docs/17-Template-Management/templates/STANDALONE-INCOME-PAGES-48-49.html
```

### 2. Toggle Modes
- Click "Toggle User Ready Mode" button
- **Dev Mode**: Yellow highlights, shows `{{field-id}}`
- **User Ready Mode**: Gray italic, shows data-sample values

### 3. Verify Field IDs
- Right-click → Inspect any field
- Check `data-field-id` attribute matches Desktop's v2 spec
- Ensure all IDs are kebab-case: `calc-type3-sf` ✅ not `calcType3SF` ❌

### 4. Test Calculator Integration (Future)
Once CalcInputPanel is built:
```javascript
// Post test data to standalone file
const iframe = document.querySelector('iframe');
iframe.contentWindow.postMessage({
    type: 'FIELD_UPDATE',
    fieldId: 'calc-type3-annual',
    value: '$86,400'
}, '*');
```

Standalone file will receive and display the value.

---

## Copy Back to Main Template

When standalone pages are complete and tested:

### Step 1: Extract Pages 48-49 HTML
From `STANDALONE-INCOME-PAGES-48-49.html`, copy everything between:
```html
<!-- PAGE 48: DIRECT CAPITALIZATION -->
...
</div> <!-- end page 48 -->

<!-- PAGE 49: INCOME APPROACH CONCLUSION -->
...
</div> <!-- end page 49 -->
```

### Step 2: Find Location in Main Template
In `public/Report-MF-template.html`:
- Search for: `<!-- PAGE 53 (Report Page 49): Direct Capitalization -->`
- Line number: ~18404

### Step 3: Replace Entire Section
- Delete existing Pages 48-49 structure
- Paste updated structure from standalone
- Verify page-sheet data-page-num matches ("Page 48", "Page 49")

### Step 4: Update CHANGELOG
In `docs/17-Template-Management/CHANGELOG.md`:
```markdown
## [v2.10.0] - 2026-01-XX

### Changed
- Pages 48-49: Expanded Income Approach to v2 spec
  - Unit Mix: 2 → 6 types
  - Added SF column to unit mix
  - Added 4th vacancy type (other-loss-rate)
  - Expanded to 127 total fields (49 inputs + 78 calculated)

**Source**: Standalone file → Main template integration
**Issue**: Based on Desktop's Calculator-Field-Reference-v2.md
```

---

## Field ID Reference

**All field IDs in standalone MUST match**:
1. `docs/16-Field-Input-Output-Mapping/Calculator-Field-Reference-v2.md`
2. `src/features/report-builder/schema/fieldRegistry.ts`
3. CalcInputPanel component (when built)

**Cross-check tool**:
```bash
# Extract all field IDs from standalone
grep -o 'data-field-id="{{[^}]*}}"' STANDALONE-INCOME-PAGES-48-49.html | sort -u

# Compare with v2 spec
grep "calc-type[1-6]" Calculator-Field-Reference-v2.md
```

---

## Benefits of Standalone Approach

✅ **Isolated testing** - Don't break main template while updating
✅ **Faster iteration** - Small file loads quickly in browser
✅ **Clear diff** - Easy to see what changed when copying back
✅ **Version control** - Can keep v1 and v2 side-by-side
✅ **Calculator integration** - Test data flow without full app

---

## File Locations

**Standalone**: `docs/17-Template-Management/templates/STANDALONE-INCOME-PAGES-48-49.html`
**Main Template**: `public/Report-MF-template.html` (lines 18404+)
**Field Spec**: `docs/16-Field-Input-Output-Mapping/Calculator-Field-Reference-v2.md`
**Field Mapping**: `docs/17-Template-Management/templates/Template-Page-Field-Mapping.md`

---

## Next Agent Tasks

1. ✅ **Composer**: Update standalone to add type3-6 rows
2. ✅ **Composer**: Add Other Revenue, Vacancy, Expense, NOI sections
3. ✅ **Desktop**: Verify field IDs match v2 spec exactly
4. ✅ **Sonnet**: Copy completed structure back to main template
5. ✅ **Sonnet**: Update CHANGELOG and version to v2.10.0

---

**Status**: ✅ Standalone file created, ready for v2 expansion
**Managed by**: Composer (updates) + Sonnet (integration)

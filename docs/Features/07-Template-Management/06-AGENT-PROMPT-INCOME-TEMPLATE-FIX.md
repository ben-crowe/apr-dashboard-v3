# Agent Task: Fix Page 48 Unit Mix Table

## Priority: ⚠️ MEDIUM

## Problem
The INCOME tab builder sends data for 6 unit types (type1-6), but Page 48 template only has rows for type1-2. Also missing the SF column.

## Template File
```
public/Report-MF-template.html
```
Page 48 (Direct Capitalization) - approximately lines 18400-20700

## Current State

### Template Has:
```html
<!-- Type 1 row -->
<tr>
    <td>Flat 1 Bed / 1 Bath</td>  <!-- HARDCODED! -->
    <td>{{calc-type1-count}}</td>
    <td>1 Bed</td>
    <td>{{calc-type1-contract-rent}}</td>
    <td>{{calc-type1-rent}}</td>
    <td>{{calc-type1-cont-v-market}}</td>
    <td>{{calc-type1-per-unit}}</td>
    <td>{{calc-type1-per-sf}}</td>
    <td>{{calc-type1-annual}}</td>
</tr>
<!-- Type 2 row -->
<tr>
    <td>Flat 2 Bed / 1 Bath</td>  <!-- HARDCODED! -->
    <td>{{calc-type2-count}}</td>
    ...
</tr>
<!-- NO type3, type4, type5, type6 rows -->
```

### Template Needs:
- Dynamic unit type names (not hardcoded)
- SF column added
- Rows for type3, type4, type5, type6

## Required Changes

### 1. Update Column Headers

Find the Unit Mix table header row and add SF column:

**Current:**
```html
<tr>
    <th>UNIT MIX</th>
    <th>UNITS</th>
    <th>CATEGORY</th>
    <th>CONTRACT</th>
    <th>MARKET</th>
    <th>CONT V MKT</th>
    <th>$/UNIT</th>
    <th>$/SF(yr)</th>
    <th>$/YR</th>
</tr>
```

**Change to:**
```html
<tr>
    <th>UNIT MIX</th>
    <th>UNITS</th>
    <th>AVG SF</th>           <!-- ADD THIS -->
    <th>CATEGORY</th>
    <th>CONTRACT</th>
    <th>MARKET</th>
    <th>CONT V MKT</th>
    <th>$/UNIT</th>
    <th>$/SF(yr)</th>
    <th>$/YR</th>
</tr>
```

### 2. Update Existing Type 1-2 Rows

**Type 1 - Change from:**
```html
<tr>
    <td>Flat 1 Bed / 1 Bath</td>
    <td>{{calc-type1-count}}</td>
    <td>1 Bed</td>
    ...
</tr>
```

**Type 1 - Change to:**
```html
<tr>
    <td>{{calc-type1-name}}</td>
    <td>{{calc-type1-count}}</td>
    <td>{{calc-type1-sf}}</td>           <!-- ADD SF -->
    <td>1 Bed</td>
    <td>{{calc-type1-contract-rent}}</td>
    <td>{{calc-type1-rent}}</td>
    <td>{{calc-type1-cont-v-market}}</td>
    <td>{{calc-type1-per-unit}}</td>
    <td>{{calc-type1-per-sf}}</td>
    <td>{{calc-type1-annual}}</td>
</tr>
```

**Repeat for Type 2**

### 3. Add Type 3-6 Rows

Add after Type 2 row:

```html
<!-- Type 3 -->
<tr>
    <td>{{calc-type3-name}}</td>
    <td>{{calc-type3-count}}</td>
    <td>{{calc-type3-sf}}</td>
    <td>3 Bed</td>
    <td>{{calc-type3-contract-rent}}</td>
    <td>{{calc-type3-rent}}</td>
    <td>{{calc-type3-cont-v-market}}</td>
    <td>{{calc-type3-per-unit}}</td>
    <td>{{calc-type3-per-sf}}</td>
    <td>{{calc-type3-annual}}</td>
</tr>
<!-- Type 4 -->
<tr>
    <td>{{calc-type4-name}}</td>
    <td>{{calc-type4-count}}</td>
    <td>{{calc-type4-sf}}</td>
    <td>4 Bed</td>
    <td>{{calc-type4-contract-rent}}</td>
    <td>{{calc-type4-rent}}</td>
    <td>{{calc-type4-cont-v-market}}</td>
    <td>{{calc-type4-per-unit}}</td>
    <td>{{calc-type4-per-sf}}</td>
    <td>{{calc-type4-annual}}</td>
</tr>
<!-- Type 5 -->
<tr>
    <td>{{calc-type5-name}}</td>
    <td>{{calc-type5-count}}</td>
    <td>{{calc-type5-sf}}</td>
    <td>Other</td>
    <td>{{calc-type5-contract-rent}}</td>
    <td>{{calc-type5-rent}}</td>
    <td>{{calc-type5-cont-v-market}}</td>
    <td>{{calc-type5-per-unit}}</td>
    <td>{{calc-type5-per-sf}}</td>
    <td>{{calc-type5-annual}}</td>
</tr>
<!-- Type 6 -->
<tr>
    <td>{{calc-type6-name}}</td>
    <td>{{calc-type6-count}}</td>
    <td>{{calc-type6-sf}}</td>
    <td>Other</td>
    <td>{{calc-type6-contract-rent}}</td>
    <td>{{calc-type6-rent}}</td>
    <td>{{calc-type6-cont-v-market}}</td>
    <td>{{calc-type6-per-unit}}</td>
    <td>{{calc-type6-per-sf}}</td>
    <td>{{calc-type6-annual}}</td>
</tr>
```

### 4. Update Subtotal Row

Add SF total column:

**Change from:**
```html
<tr class="subtotal-row">
    <td>UNIT MIX SUBTOTAL</td>
    <td>{{calc-total-units}}</td>
    <td>-</td>
    <td>{{calc-avg-contract-rent}}</td>
    ...
</tr>
```

**Change to:**
```html
<tr class="subtotal-row">
    <td>UNIT MIX SUBTOTAL</td>
    <td>{{calc-total-units}}</td>
    <td>{{calc-total-sf}}</td>           <!-- ADD TOTAL SF -->
    <td>-</td>
    <td>{{calc-avg-contract-rent}}</td>
    <td>{{calc-avg-market-rent}}</td>
    <td>{{calc-avg-cont-v-market}}</td>
    <td>{{calc-subtotal-per-unit}}</td>
    <td>{{calc-subtotal-per-sf}}</td>
    <td>{{calc-subtotal-annual}}</td>
</tr>
```

## Field IDs Summary

### New fields to add to template:
```
calc-type1-name (was hardcoded)
calc-type2-name (was hardcoded)
calc-type1-sf through calc-type6-sf (new column)
calc-type3-* through calc-type6-* (new rows)
calc-total-sf (subtotal)
```

### Fields already in template (verify still present):
```
calc-type1-count, calc-type1-contract-rent, calc-type1-rent
calc-type1-cont-v-market, calc-type1-per-unit, calc-type1-per-sf, calc-type1-annual
(same for type2)
calc-total-units, calc-avg-contract-rent, calc-avg-market-rent
calc-subtotal-per-unit, calc-subtotal-per-sf, calc-subtotal-annual
```

## Conditional Display (Optional Enhancement)

If a unit type has 0 units, the row could be hidden. This requires JavaScript:

```javascript
// In template's script section
document.querySelectorAll('[data-unit-type]').forEach(row => {
    const countField = row.querySelector('[data-field="count"]');
    if (countField && (countField.textContent === '0' || countField.textContent === '')) {
        row.style.display = 'none';
    }
});
```

Or use CSS:
```css
tr[data-empty="true"] { display: none; }
```

This is optional - showing empty rows with 0 values is also acceptable.

## Verification

1. Open Report Builder → INCOME tab → REVENUE sub-tab
2. Enter data for 4 unit types (leave type5-6 empty)
3. Preview Page 48
4. Verify:
   - All 6 rows appear (or 4 if conditional display implemented)
   - Unit type names are dynamic (not hardcoded)
   - SF column shows values
   - Subtotal row calculates correctly

## Do NOT
- Change field ID patterns
- Modify other sections of Page 48 (expenses, NOI, etc.)
- Alter calculator logic
- Change other pages

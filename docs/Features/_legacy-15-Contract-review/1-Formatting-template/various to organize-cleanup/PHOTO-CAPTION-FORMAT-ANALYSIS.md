# Photo Caption Format Analysis

## Problem Summary
- Photos are rendering (1491 blocks vs 1349 before)
- Match % stayed at 21.4%
- Missing blocks: 391
- Extra blocks: 785 (increased)

**ROOT CAUSE: Photos rendering but in WRONG FORMAT**

---

## Reference Format (Correct)

### HTML Structure:
```html
<table class="c9">
  <tr class="c5">
    <td class="c8" colspan="1" rowspan="1">
      <p class="c23">
        <span style="overflow: hidden; display: inline-block; ...">
          <img alt="..." src="images/image78.jpg" style="..." />
        </span>
      </p>
      <p class="c23"><span class="c6">1101 - East Elevation</span></p>
    </td>
    <td class="c8" colspan="1" rowspan="1">
      <p class="c23">
        <span style="overflow: hidden; display: inline-block; ...">
          <img alt="..." src="images/image77.jpg" style="..." />
        </span>
      </p>
      <p class="c23"><span class="c6">1101 - West Elevation</span></p>
    </td>
  </tr>
  <!-- More rows with 2 photos each -->
</table>
```

### Key Elements (Reference):
1. **Table structure**: `<table class="c9">`
2. **2-column layout**: Each `<tr>` contains 2 `<td>` cells
3. **Cell class**: `<td class="c8">`
4. **Photo wrapper**: `<p class="c23">` with nested `<span>` and `<img>`
5. **Caption**: Separate `<p class="c23"><span class="c6">Caption Text</span></p>` INSIDE same `<td>`
6. **Layout**: 2x3 grid (6 photos per page typically)

---

## Generated Format (WRONG)

### HTML Structure:
```html
<h3 class="subsection-title">EXTERIOR PHOTOGRAPHS</h3>

<div class="field-group">
  <div class="field-label">Exterior 1 - Front Facade:</div>
  <div class="field-value">/test-data/images/exterior/exterior-1.jpeg</div>
</div>

<div class="field-group">
  <div class="field-label">Caption:</div>
  <div class="field-value">Main building front elevation</div>
</div>

<div class="field-group">
  <div class="field-label">Exterior 2 - Rear View:</div>
  <div class="field-value">/test-data/images/exterior/exterior-2.jpeg</div>
</div>

<div class="field-group">
  <div class="field-label">Caption:</div>
  <div class="field-value">Additional exterior view</div>
</div>
```

### Problems with Generated Format:
1. NO table structure
2. NO 2-column grid layout
3. Using `<div class="field-group">` instead of table cells
4. Showing FILE PATHS instead of rendered images
5. Caption as separate field-group instead of `<p class="c23">`
6. Missing all Google Docs HTML styling (overflow spans, inline-block, etc.)

---

## Block Counting Impact

### Reference Blocks per Photo:
```
<table class="c9">                                    [1 block]
  <tr class="c5">                                     [1 block]
    <td class="c8" colspan="1" rowspan="1">           [1 block]
      <p class="c23">                                 [1 block]
        <span style="overflow: hidden...">           [1 block]
          <img alt="..." src="..." style="..." />    [1 block]
        </span>
      </p>
      <p class="c23">                                 [1 block]
        <span class="c6">Caption</span>               [1 block]
      </p>
    </td>
```
**~8 blocks per photo** (table + row + cell + 2 paragraphs + spans + img)

### Generated Blocks per Photo:
```
<div class="field-group">                            [1 block]
  <div class="field-label">Label:</div>              [1 block]
  <div class="field-value">Path</div>                [1 block]
</div>
<div class="field-group">                            [1 block]
  <div class="field-label">Caption:</div>            [1 block]
  <div class="field-value">Text</div>                [1 block]
</div>
```
**~6 blocks per photo** (2 field-groups with 3 elements each)

---

## Evidence from Block Counts

**Before Photos Section Added:**
- Generated: 1349 blocks
- Reference: 1491 blocks
- Missing: 142 blocks

**After Photos Section Added:**
- Generated: 1491 blocks
- Reference: 1491 blocks
- Missing: 391 blocks
- Extra: 785 blocks

**Analysis:**
- Total blocks matched (1491 = 1491) BUT structure wrong
- High "Extra" count (785) = wrong div structure being counted as different
- High "Missing" count (391) = table structure not found
- Match % stayed low (21.4%) = blocks exist but don't match reference patterns

---

## Required Changes

### What Needs to Change:
1. **Remove**: Field-group div structure for photos
2. **Add**: Table-based 2-column grid layout
3. **Render**: Actual `<img>` tags instead of file paths
4. **Wrap**: Images in Google Docs style spans with inline-block display
5. **Format**: Captions as `<p class="c23"><span class="c6">Text</span></p>`
6. **Group**: Photos in rows of 2 per `<tr>`

### Template Generator Fix:
The template is currently treating photos as DATA FIELDS instead of RENDERED IMAGES IN A TABLE GRID.

Need to:
1. Create table structure generator for photos section
2. Group photos by category (Exterior, Street View, Interior, etc.)
3. Render 2-column grid with actual image tags
4. Apply Google Docs HTML styling (overflow spans, inline-block)
5. Place captions directly below images within same table cell

---

## Next Steps

1. Update template generator to output table-based photo grid
2. Convert image-mgt data into table rows (2 photos per row)
3. Apply Google Docs HTML styling to match reference
4. Re-run comparison to verify block structure matches

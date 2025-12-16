# Field Input Character Limits - Implementation Plan

**Date Created:** 2024-12-16
**Status:** Planning Phase - To be implemented AFTER pages 40-77 formatting is complete
**Priority:** High - Prevents 95% of layout overflow issues

---

## Problem Statement

Users entering content in the React editor can overflow page boundaries in the HTML preview, causing:
- Content overlapping footers
- Text cutting off at 11-inch page boundary
- Unpredictable layout breaks
- Manual trial-and-error to fix overflow

---

## Solution: Dual-Layer Defense

### **Layer 1: Input Character Limits (Prevention - 95% of issues)**
Restrict character count in React editor input fields BEFORE content reaches preview.

### **Layer 2: Visual Overlap Alarm (Detection - Edge cases)**
Absolute positioned footer with z-index shows overlap when content exceeds page capacity.
*(Already implemented in PREVIEW-Master.html CSS)*

---

## Implementation Plan

### Phase 1: Measure Maximum Capacity Per Field

**Goal:** Determine exact character limits for each field that maps to a page section.

**Method:**
1. For each field-mapped section in PREVIEW-Master.html:
   - Identify the field ID (e.g., `{{Report_Transmittal}}`, `{{Neighborhood_Description}}`)
   - Fill with sample text of increasing length
   - Note character count when content reaches footer overlap
   - Set limit to 85-90% of measured max (safety margin)

**Example Measurements Needed:**
```
Field: {{Report_Transmittal}} (Page 3)
- Max before overlap: ~3200 characters
- Recommended limit: 2800 characters

Field: {{Neighborhood_Description}} (Page X)
- Max before overlap: TBD
- Recommended limit: TBD

Field: {{Subject_Zoning}} (Page 29)
- Max before overlap: ~500 characters (inline field)
- Recommended limit: 450 characters
```

**Deliverable:** CSV or JSON file with field-to-limit mappings
```json
{
  "Report_Transmittal": {
    "maxChars": 2800,
    "pageNumber": 3,
    "fieldType": "textarea"
  },
  "Neighborhood_Description": {
    "maxChars": 2500,
    "pageNumber": "TBD",
    "fieldType": "textarea"
  }
}
```

---

### Phase 2: Implement Character Limits in React Editor

**Tech Implementation:**

**Option A: Soft Limit with Visual Warning**
```jsx
<textarea
  value={transmittalText}
  onChange={handleChange}
  maxLength={2800}
  className={charCount > 2800 ? 'input-overlimit' : ''}
/>
<div className="char-counter">
  <span className={charCount > 2800 ? 'warning' : ''}>
    {charCount} / 2800 characters
  </span>
</div>
```

**Option B: Hard Stop at Limit**
```jsx
<textarea
  value={transmittalText}
  onChange={handleChange}
  maxLength={2800}  // Browser enforces hard stop
/>
<div className="char-counter">
  {charCount} / 2800 characters
</div>
```

**Visual Feedback Options:**
1. **Red border** on input when approaching/at limit
2. **Yellow warning** at 90% capacity
3. **Red hard stop** at 100% capacity
4. **Character counter** always visible
5. **Tooltip/help text** explaining why limit exists

**Recommended Approach:**
- Yellow warning at 90% (2520 chars for 2800 limit)
- Red border at 95% (2660 chars)
- Hard stop at 100% (2800 chars) using `maxLength`
- Character counter changes color with warning states

---

### Phase 3: User Experience Design

**Warning States:**

```css
/* Normal state */
.field-input {
  border: 1px solid #ccc;
}

/* Warning at 90% */
.field-input.warning-90 {
  border: 2px solid #FFA500;
  background-color: #FFFBF0;
}

/* Critical at 95% */
.field-input.warning-95 {
  border: 2px solid #FF6B6B;
  background-color: #FFF5F5;
}

/* At limit */
.field-input.at-limit {
  border: 2px solid #DC3545;
  background-color: #FFE5E5;
}
```

**Help Text:**
> "This field has a character limit to ensure proper page layout in the PDF. Current: 2340 / 2800 characters."

**What Happens When User Hits Limit:**
1. Input stops accepting new characters (browser `maxLength`)
2. Red border and background color change
3. Character counter shows "2800 / 2800" in red
4. Optional: Toast notification: "Character limit reached. Please be more concise or remove content."

---

### Phase 4: Testing Strategy

**Test Cases:**

1. **Normal Usage:**
   - Enter text up to 80% of limit → No warnings
   - Verify preview looks correct

2. **Warning Threshold:**
   - Enter text to 90% → Yellow warning appears
   - Enter text to 95% → Red warning appears
   - Verify character counter updates in real-time

3. **Hard Limit:**
   - Try to type past 100% → Input blocks new characters
   - Copy/paste large text → Truncates at limit
   - Verify preview has no footer overlap

4. **Edge Cases:**
   - Multiple newlines (takes up space but fewer chars)
   - Long words without spaces
   - Special characters (some take more space)
   - Different fonts/formatting (if applicable)

5. **Cross-Field Testing:**
   - Fill multiple fields to 95% capacity
   - Verify no cumulative overflow on multi-section pages

---

## Technical Notes

### Character vs. Visual Space

**Important:** Character count ≠ visual space consumed

Factors affecting visual space:
- **Newlines:** `\n\n\n` = 3 chars but takes vertical space
- **Long words:** May cause different wrapping
- **Font rendering:** Open Sans at 10pt (our standard)
- **HTML tags:** Field-mapped spans add extra markup

**Solution:**
- Measure limits with REALISTIC sample content (not just "aaa...")
- Include typical paragraph structure (2-3 newlines between paragraphs)
- Test with actual appraisal report language

### Mapping Fields to Pages

Reference the field-mapped sections in PREVIEW-Master.html:
```html
<span class="field-mapped" title="{{Field_ID}}">{{Field_ID}}</span>
```

Use Grep to find all unique field IDs:
```bash
grep -oE '\{\{[^}]+\}\}' PREVIEW-Master.html | sort -u
```

---

## Implementation Order

**Priority 1 (Text-Heavy Fields):**
1. `{{Report_Transmittal}}` - Letter of Transmittal (Page 3)
2. `{{Neighborhood_Description}}` - Neighborhood analysis
3. `{{Subject_ScopeOfWork}}` - Scope section
4. `{{Subject_Zoning}}` - Zoning description
5. `{{Report_Extraordinary}}` - Extraordinary assumptions
6. `{{Report_LimCond}}` - Limiting conditions

**Priority 2 (Medium Fields):**
7. All other multi-paragraph fields

**Priority 3 (Short Fields):**
8. Inline fields (street address, dates, single values)

---

## Success Metrics

- **95% reduction** in footer overlap issues in preview
- **Zero manual page adjustments** needed for typical content
- **User satisfaction:** Immediate feedback prevents frustration
- **Developer time saved:** No complex auto-pagination needed

---

## Future Enhancements

1. **Smart Suggestions:**
   - "You have 200 characters remaining. Consider being more concise."
   - AI-powered text summarization to fit within limits

2. **Dynamic Limits:**
   - Adjust limits based on page content (if page has table, reduce text limit)
   - Multi-field balancing (if one field is short, allow another to be longer)

3. **Preview Integration:**
   - Real-time character count updates as user types
   - Highlight in preview which field is causing overflow

4. **Export Warnings:**
   - Pre-export validation: "3 fields are at 95%+ capacity. Review before generating PDF."

---

## Notes

- **Do NOT implement until pages 40-77 formatting is complete**
- This is a React editor feature, not an HTML template change
- CSS "Visual Overlap Alarm" (Layer 2) is already implemented
- Character limits (Layer 1) will be the primary defense
- Keep implementation simple - maxLength + visual feedback is sufficient

---

## Next Steps (When Ready to Implement)

1. Complete formatting of PREVIEW-Master.html pages 40-77
2. Run measurement tests to determine exact limits per field
3. Create field-to-limit mapping configuration file
4. Implement React editor changes with character counters
5. Add visual warning states (yellow/red borders)
6. Test with real appraisal content
7. Document limits in user guide

---

**End of Planning Document**

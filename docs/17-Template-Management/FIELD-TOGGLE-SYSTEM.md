# APR Template Field Toggle System

**Originally from**: Phase 15 Contract Review / Report Formatting Guide
**Moved to**: Phase 17 Template Management (2026-01-09)
**Purpose:** Two-mode display system for template fields (Dev Mode vs User Ready Mode)
**Template:** Report-MF-template.html
**Last Updated:** 2026-01-09

---

## Overview

The field toggle system allows switching between two modes, each serving dual purposes:

### Dev Mode (Toggle OFF)
- **Display:** Raw `{{field-id}}` with yellow highlight
- **Purpose 1:** Development - see field IDs for mapping/debugging
- **Purpose 2:** Testing - this is the state when injecting registry data via script

### User Ready Mode (Toggle ON)
- **Display:** Sample data in gray italic
- **Purpose 1:** Layout planning - see how much space content needs on the page
- **Purpose 2:** Client preview - represents final deployed view with real data

---

## Mode Summary

| Mode | Toggle | Display | Styling | Use For |
|------|--------|---------|---------|---------|
| Dev Mode | OFF | `{{field-id}}` | Yellow highlight | Development + Registry testing |
| User Ready | ON | Sample data | Gray italic | Layout planning + Client preview |
| Populated | N/A | Real data | Normal | Live/deployed state |

---

## Implementation Details

### Step 1: Add data-field-id Attribute

**Regex (multiline):**
```regex
class="field-mapped"([^>]*)title="({{[^}]+}})"
```

**Replace:**
```
class="field-mapped" data-field-id="$2"$1title="$2"
```

This adds `data-field-id="{{field-name}}"` to all `.field-mapped` elements.

---

### Step 2: CSS Styles

Add to master `<style>` section:

```css
/* === TWO-MODE FIELD SYSTEM === */

/* DEV MODE (toggle OFF): Show raw {{field-id}} with yellow highlight */
.field-mapped {
    background-color: rgba(255, 255, 0, 0.25);
    border-bottom: 1px dotted #999;
}

/* USER READY MODE (toggle ON): Show sample data in gray italic */
.page-sheet.user-ready-mode .field-mapped {
    background-color: transparent;
    border-bottom: 1px dashed #ccc;
    color: #999;
    font-style: italic;
}

/* POPULATED: Real data injected - normal styling */
.page-sheet.user-ready-mode .field-mapped.populated {
    background-color: transparent;
    border-bottom: none;
    color: inherit;
    font-style: normal;
}

/* Image placeholders */
.image-field {
    position: relative;
}
.image-placeholder {
    display: none;
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: #f0f0f0;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #666;
    font-size: 9pt;
}
.image-placeholder span {
    font-family: monospace;
    background: #e0e0e0;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 8pt;
}
```

---

### Step 3: JavaScript Toggle Behavior

```javascript
const toggle = document.getElementById('mode-toggle');
const modeLabel = document.getElementById('mode-label');
const pageSheets = document.querySelectorAll('.page-sheet');

// Initialize: Show {{field-id}} on load (Dev Mode default)
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.field-mapped').forEach(el => {
        const fieldId = el.getAttribute('data-field-id');
        if (fieldId) {
            el.textContent = fieldId;
        }
    });
});

toggle.addEventListener('change', function() {
    const fields = document.querySelectorAll('.field-mapped');

    if (this.checked) {
        // USER READY MODE: Show data-sample in gray italic
        pageSheets.forEach(sheet => sheet.classList.add('user-ready-mode'));
        modeLabel.textContent = 'User Ready';

        fields.forEach(el => {
            if (el.classList.contains('populated')) return;
            const sample = el.getAttribute('data-sample');
            if (sample) {
                el.textContent = sample;
            }
        });
    } else {
        // DEV MODE: Show raw {{field-id}}
        pageSheets.forEach(sheet => sheet.classList.remove('user-ready-mode'));
        modeLabel.textContent = 'Dev Mode';

        fields.forEach(el => {
            if (el.classList.contains('populated')) return;
            const fieldId = el.getAttribute('data-field-id');
            if (fieldId) {
                el.textContent = fieldId;
            }
        });
    }
});
```

---

### Step 4: Toggle UI (Header HTML)

```html
<label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
    <span class="toggle-switch">
        <input type="checkbox" id="mode-toggle">
        <span class="toggle-slider"></span>
    </span>
    <span class="mode-label" id="mode-label">Dev Mode</span>
</label>
```

---

## Field Attributes Reference

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `class="field-mapped"` | Identifies editable field | Required |
| `data-field-id` | Stores raw placeholder | `{{property-address}}` |
| `data-sample` | Sample preview data | `123 Main Street` |
| `title` | Tooltip on hover | `{{property-address}}` |

---

## DO NOT

- Redesign any pages - structure is correct
- Change field IDs
- Modify spacing/padding/fonts on working pages

---

## Testing Checklist

- [ ] Toggle OFF (Dev Mode) shows `{{field-id}}` with yellow highlight
- [ ] Toggle ON (User Ready) shows `data-sample` in gray italic
- [ ] Pages 52-57 render correctly with all fields
- [ ] Images show placeholder when no src
- [ ] Page layout stable in both modes (no shifting)

---

## How It Works

1. **On page load:** JS reads `data-field-id` and sets text to `{{field-id}}`
2. **Toggle ON:** JS reads `data-sample` and displays it, adds `.user-ready-mode` class
3. **Toggle OFF:** JS reverts to `data-field-id` value, removes class
4. **Populated fields:** Have `.populated` class - skipped by toggle, show real data

---

## Related Files

- **Compact Styling:** `./compact-styling-guide.md`
- **Template:** `/public/Report-MF-template.html`
- **Field Registry:** `/src/features/report-builder/data/fieldRegistry.ts`

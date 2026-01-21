# UI Color Palette Standardization Guide

## Problem Statement

The LOE/Valuation Details section has inconsistent styling:
- **Big fat blue buttons** (variant="primary") need to be replaced with elegant gray low-profile buttons
- **Form fields have no borders** in dark mode, making them invisible
- **Inconsistent button styles** across different actions
- **Multiple color schemes** creating visual noise

## Design Goals

1. **Subtle, elegant gray buttons** - no bright blue primary colors
2. **Consistent border visibility** in both light and dark modes
3. **Low-profile, professional appearance** throughout
4. **Unified color palette** for all interactive elements

---

## Button Standardization

### ❌ CURRENT (WRONG)
```tsx
// Big fat blue buttons
<Button variant="primary">Send LOE</Button>
<Button variant="success">Sent</Button>
```

### ✅ TARGET (CORRECT)
```tsx
// Elegant gray low-profile buttons
<Button variant="outline" className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
  Send LOE
</Button>
<Button variant="outline" className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800">
  Sent
</Button>
```

### Button Style Rules

**All buttons must:**
- Use `variant="outline"` (never "primary", "default", or "success")
- Have subtle background colors (gray-50 in light, gray-800 in dark)
- Have hover states that are barely noticeable
- Use consistent height and padding

**Standard Button Classes:**
```tsx
// Default action button
className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"

// Success state (already completed)
className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800"

// Disabled/inactive
className="bg-gray-100 dark:bg-gray-900 opacity-50 cursor-not-allowed"
```

---

## Input Field Standardization

### ❌ CURRENT (WRONG)
```tsx
// No visible borders in dark mode
<Input className="bg-white dark:bg-gray-800" />
<Textarea className="bg-white dark:bg-gray-800" />
```

### ✅ TARGET (CORRECT)
```tsx
// Visible borders in both modes
<Input className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50" />
<Textarea className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50" />
```

### Input Style Rules

**All form fields must:**
- Have visible borders in both light and dark modes
- Use subtle gray backgrounds (not pure white)
- Remove focus rings (focus-visible:outline-none focus-visible:ring-0)
- Have consistent padding

**Standard Input Classes:**
```tsx
className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus-visible:outline-none focus-visible:ring-0"
```

---

## Color Palette Reference

### Background Colors
```css
Light Mode:
- bg-gray-50: Subtle input backgrounds
- bg-gray-100: Slightly darker backgrounds, disabled states
- bg-white: Pure white (avoid in favor of gray-50)

Dark Mode:
- dark:bg-gray-800/50: Semi-transparent inputs (lets theme show through)
- dark:bg-gray-800: Solid backgrounds for buttons
- dark:bg-gray-900: Disabled states, very dark sections
```

### Border Colors
```css
Light Mode:
- border-gray-200: Default borders (subtle, not harsh)
- border-gray-300: Slightly stronger borders (avoid - use gray-200)

Dark Mode:
- dark:border-gray-700: Default dark mode borders
- dark:border-gray-600: Slightly stronger borders (avoid - use gray-700)
```

### Text Colors
```css
Light Mode:
- text-gray-700: Primary text
- text-gray-500: Secondary text, labels
- text-gray-400: Disabled text, placeholders

Dark Mode:
- dark:text-gray-100: Primary text
- dark:text-gray-300: Secondary text, labels
- dark:text-gray-500: Disabled text, placeholders
```

### Hover States
```css
Light Mode:
- hover:bg-gray-100: Subtle hover for buttons
- hover:bg-gray-200: Stronger hover (avoid)

Dark Mode:
- dark:hover:bg-gray-700: Subtle hover for buttons
- dark:hover:bg-gray-600: Stronger hover (avoid)
```

---

## Files to Update

### Priority 1: Action Buttons (LOE/Valuation Details)
```
src/components/dashboard/job-details/actions/
├── ESignatureAction.tsx (line 143: variant="success" → variant="outline")
├── PandadocAction.tsx (line 68: variant="primary" → variant="outline")
├── ValcreAction.tsx (line 177: variant="primary" → variant="outline")
├── ContractAction.tsx (check all buttons)
├── ClickUpAction.tsx (check all buttons)
├── FinalDataAction.tsx (check all buttons)
└── GoogleFolderButton.tsx (check all buttons)
```

### Priority 2: Form Fields
```
src/components/dashboard/job-details/actions/
└── TemplateEditorModal.tsx (all Input and Textarea elements)
```

### Priority 3: General Buttons
```
src/components/dashboard/job-details/
├── Section4CompactIndependent.tsx
├── JobDetailHeader.tsx
└── Any other components with buttons
```

---

## Testing Checklist

After making changes, verify:

- [ ] All buttons in LOE section are gray, not blue
- [ ] All buttons have consistent size and padding
- [ ] Hover states are subtle, not dramatic
- [ ] All input fields have visible borders in dark mode
- [ ] All input fields have visible borders in light mode
- [ ] Focus states don't show green/blue rings
- [ ] Success states use subtle green, not bright green
- [ ] Disabled states are clearly distinguishable
- [ ] No pure white backgrounds in form fields
- [ ] All colors use the standardized palette above

---

## Implementation Strategy

1. **Search and replace all variant="primary"** with variant="outline" + standard classes
2. **Search and replace all variant="success"** with variant="outline" + success classes
3. **Add border classes to all Input components** in LOE-related files
4. **Add border classes to all Textarea components** in LOE-related files
5. **Remove all focus ring classes** (focus:ring-*, focus:border-blue-*)
6. **Standardize all bg-white** to bg-gray-50 for inputs

---

## Cursor Prompt

Use this prompt with Cursor:

```
Standardize all UI colors in the LOE/Valuation Details section:

1. Replace all blue primary buttons with gray outline buttons:
   - Change variant="primary" to variant="outline"
   - Add className: "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"

2. Replace all success buttons with subtle green outline buttons:
   - Change variant="success" to variant="outline"
   - Add className: "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800"

3. Add visible borders to all form fields:
   - All <Input> and <Textarea> must have:
   - className: "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus-visible:outline-none focus-visible:ring-0"

4. Remove all focus rings and blue/green focus states

5. Focus on these files:
   - src/components/dashboard/job-details/actions/ESignatureAction.tsx
   - src/components/dashboard/job-details/actions/PandadocAction.tsx
   - src/components/dashboard/job-details/actions/ValcreAction.tsx
   - src/components/dashboard/job-details/actions/TemplateEditorModal.tsx

Goal: Elegant, low-profile gray buttons and inputs with consistent subtle borders in both light and dark modes.
```

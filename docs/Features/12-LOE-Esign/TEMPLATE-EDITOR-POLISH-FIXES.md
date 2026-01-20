# Template Editor Polish Fixes

**File:** `src/components/dashboard/job-details/actions/TemplateEditorModal.tsx`

**Issues to Fix:**
1. Glitchy resizable divider
2. Inconsistent button colors (blue, green, gray)

---

## Issue 1: Glitchy Resizable Divider

### Current Problems:
- Divider is only 1px wide - hard to grab reliably
- `mouseleave` event on document fires when mouse leaves browser window, causing unexpected drag termination
- Aggressive capture phase event handling

### Lines to Fix: 171-226, 293-296

### Recommended Changes:

**Line 293 - Make divider wider and easier to grab:**
```tsx
// BEFORE:
<div
  className="absolute right-0 top-0 bottom-0 w-1 bg-transparent hover:bg-gray-400 dark:hover:bg-gray-500 cursor-col-resize transition-colors z-30"
  onMouseDown={handleMouseDown}
  style={{ marginRight: '-4px' }}
/>

// AFTER:
<div
  className="absolute right-0 top-0 bottom-0 w-2 bg-transparent hover:bg-blue-500/30 cursor-col-resize transition-all z-30 hover:w-1"
  onMouseDown={handleMouseDown}
  style={{ marginRight: '-6px' }} // Adjust for new width
/>
```

**Lines 211-213 - Remove document.mouseleave and simplify event handling:**
```tsx
// BEFORE:
document.addEventListener('mousemove', handleMouseMove, { passive: false, capture: true });
document.addEventListener('mouseup', handleMouseUp, { passive: false, capture: true });
document.addEventListener('mouseleave', handleMouseLeave, { passive: false, capture: true });

// AFTER:
document.addEventListener('mousemove', handleMouseMove, { passive: false });
document.addEventListener('mouseup', handleMouseUp, { passive: false });
// Remove mouseleave - it causes issues when cursor leaves document
```

**Lines 205-208 - Remove handleMouseLeave function entirely:**
```tsx
// DELETE these lines:
const handleMouseLeave = () => {
  isDragging = false;
  setIsResizing(false);
};
```

**Lines 220-222 - Remove mouseleave cleanup:**
```tsx
// BEFORE:
document.removeEventListener('mousemove', handleMouseMove, { capture: true });
document.removeEventListener('mouseup', handleMouseUp, { capture: true });
document.removeEventListener('mouseleave', handleMouseLeave, { capture: true });

// AFTER:
document.removeEventListener('mousemove', handleMouseMove);
document.removeEventListener('mouseup', handleMouseUp);
```

---

## Issue 2: Inconsistent Button Colors

### Current Problems:
- Save button (line 542) uses default primary blue variant
- Footer buttons (lines 447, 457) use outline variant (gray)
- Zoom controls use ghost variant with custom classes
- Result: Mix of blue, gray, and transparent buttons

### Goal: Unified, Subtle Button Styling

All buttons should use **consistent subtle styling** - no bright primary colors.

### Recommended Changes:

**Line 542 - Save button in dialog (PRIMARY ISSUE):**
```tsx
// BEFORE:
<Button onClick={handleSave} disabled={isSaving || !templateName.trim()}>
  {isSaving ? 'Saving...' : 'Save'}
</Button>

// AFTER:
<Button
  onClick={handleSave}
  disabled={isSaving || !templateName.trim()}
  variant="outline"
  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
>
  {isSaving ? 'Saving...' : 'Save'}
</Button>
```

**Lines 447-466 - Footer buttons (keep outline, ensure consistent):**
```tsx
// Keep variant="outline" but ensure consistent styling
<Button
  onClick={handleSaveClick}
  variant="outline"
  size="sm"
  className="h-7 px-2 text-xs gap-1 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
  disabled={isSaving}
>
  <Save className="h-3 w-3" />
  Save Template
</Button>
<Button
  variant="outline"
  size="sm"
  onClick={onClose}
  className="h-7 px-2 text-xs gap-1 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
  disabled={isSaving}
>
  <X className="h-3 w-3" />
  Cancel
</Button>
```

**Lines 545-551 - Cancel button in dialog:**
```tsx
// Already using outline - ensure consistent with Save button
<Button
  variant="outline"
  onClick={() => setShowSaveDialog(false)}
  disabled={isSaving}
  className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
>
  Cancel
</Button>
```

---

## Alternative: Unified Button Approach

If you want ALL buttons to have the same base style, create a unified className pattern:

```tsx
const buttonBaseStyles = "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600";

// Then use:
<Button variant="outline" className={buttonBaseStyles}>
```

---

## Testing Checklist

After making changes:

**Resizable Divider:**
- [ ] Divider is easier to see and grab
- [ ] Dragging feels smooth, no unexpected stops
- [ ] Cursor doesn't leave document and break drag
- [ ] Divider stays grabbable throughout drag operation

**Button Styling:**
- [ ] All buttons have consistent colors
- [ ] No bright blue or green buttons (unless intentional)
- [ ] Hover states are consistent
- [ ] Disabled states look correct
- [ ] Dark mode buttons look consistent

---

## Visual Goals

**Divider:**
- Subtle but visible on hover
- Wide enough to grab easily (2px minimum)
- Smooth drag experience
- Blue tint on hover for visibility

**Buttons:**
- Subtle gray/outline style across the board
- No primary colors unless explicitly needed
- Consistent padding and sizing
- Muted hover states (gray highlights, not bright colors)

---

## Cursor Prompt

You can give this prompt to Cursor:

```
Fix the template editor's resizable divider and button styling:

1. DIVIDER: Make it 2px wide instead of 1px, remove the document mouseleave listener that causes glitchy behavior, and simplify event handling by removing capture phase.

2. BUTTONS: Make all buttons consistent with subtle gray styling. The Save button in the dialog (line 542) should use variant="outline" like the others, not the default primary blue. Add consistent hover states.

Check lines: 171-226 (divider logic), 293-296 (divider element), 447-466 (footer buttons), 542-551 (dialog buttons).

Goal: Smooth dragging experience and unified button palette - no bright colors, all subtle gray/outline style.
```

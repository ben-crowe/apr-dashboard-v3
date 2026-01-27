# Button Standardization - APR Dashboard V3

**Created:** January 20, 2026  
**Purpose:** Standardize button styles across APR Dashboard V3, separate from TDD/Report Builder  
**Status:** In Progress

---

## Overview

Dashboard buttons are being standardized to **text-only** with minimal hover effects. This creates a cleaner, more professional look and separates dashboard styling from TDD/Report Builder pages.

---

## Style Guide

**Location:** `/style-guide` route (http://localhost:8086/style-guide)

The style guide shows:
- ✅ Light mode and dark mode side-by-side
- ✅ Button styles (text-only with hover underline)
- ✅ Form fields (inputs, textareas, selects)
- ✅ Typography examples
- ✅ Cards and badges
- ✅ Usage guidelines

---

## Button Style Standards

### Dashboard Buttons (Text-Only)

**Primary Actions:**
```tsx
className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 hover:underline transition-colors text-sm font-medium"
```

**Secondary Actions:**
```tsx
className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:underline transition-colors text-sm"
```

**Disabled State:**
```tsx
className="text-gray-400 dark:text-gray-600 cursor-not-allowed text-sm font-medium"
```

**Key Principles:**
- ❌ No background colors
- ❌ No borders
- ❌ No shadows
- ✅ Text color only
- ✅ Underline on hover
- ✅ Smooth transition

---

## Changes Made

### ✅ Updated Components

1. **LOEPreviewModal.tsx**
   - ✅ "Send to Client" button → Text-only
   - Changed from: `bg-green-600 hover:bg-green-700`
   - Changed to: Text-only with hover underline

2. **LoeQuoteSection.tsx**
   - ✅ "View in Valcre" button → Text-only
   - ✅ "Create Valcre Job" button → Text-only
   - Changed from: `bg-blue-600 hover:bg-blue-700`
   - Changed to: Text-only with hover underline

3. **ClickUpAction.tsx**
   - ✅ "View in ClickUp" button → Text-only
   - ✅ "Create ClickUp Task" button → Text-only
   - Changed from: `bg-blue-600 hover:bg-blue-700`
   - Changed to: Text-only with hover underline

### 📋 Style Guide Page

**Created:** `/src/pages/StyleGuide.tsx`
**Route:** `/style-guide`

**Features:**
- Light mode and dark mode side-by-side
- All button styles displayed
- Form field examples
- Typography reference
- Usage guidelines

---

## Scope Separation

### ✅ APR Dashboard V3 (Updated)
- Dashboard components
- Job detail pages
- LOE preview/sending
- ClickUp integration buttons

### 🔒 TDD Pages (Unchanged)
- `TestInputDashboard.tsx` - Keep existing styles
- Test input features
- Field mapping tools

### 🔒 Report Builder (Unchanged)
- `MockReportBuilder.tsx` - Keep existing styles
- `DocumentBuilderTest.tsx` - Keep existing styles
- Report generation features

---

## Remaining Work

### 🔴 High Priority

1. **Review other dashboard buttons**
   - Check for any remaining blue/green buttons
   - Update to text-only style
   - Ensure consistent hover effects

2. **Test style guide page**
   - Verify light/dark mode display correctly
   - Check all components render properly
   - Ensure responsive layout

### 🟡 Medium Priority

3. **Update disabled button states**
   - Ensure disabled buttons match text-only style
   - Keep disabled appearance consistent

4. **Document button usage**
   - Add examples to style guide
   - Create component usage guidelines

---

## Button Examples

### Before (Old Style)
```tsx
<Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
  View in Valcre
</Button>
```

### After (New Style)
```tsx
<button className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 hover:underline transition-colors text-sm font-medium">
  View in Valcre
</button>
```

---

## Testing Checklist

- [ ] Style guide page loads correctly
- [ ] Light mode displays properly
- [ ] Dark mode displays properly
- [ ] All buttons updated to text-only
- [ ] Hover effects work correctly
- [ ] Disabled states look correct
- [ ] TDD pages unchanged
- [ ] Report Builder pages unchanged

---

## Access Style Guide

**URL:** `http://localhost:8086/style-guide`

**Features:**
- Side-by-side light/dark mode comparison
- All button styles
- Form field examples
- Typography reference
- Usage guidelines

---

**Last Updated:** January 20, 2026  
**Related Files:**
- `src/pages/StyleGuide.tsx`
- `src/components/dashboard/job-details/actions/LOEPreviewModal.tsx`
- `src/components/dashboard/job-details/LoeQuoteSection.tsx`
- `src/components/dashboard/job-details/actions/ClickUpAction.tsx`

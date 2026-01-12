# Templates & Guides - TODO List

**Purpose:** Track important tasks and reminders for report template development
**Created:** December 17, 2025
**Status:** Active

---

## 🔴 High Priority

### 1. Update template-comparable-page.html to New Design
**Status:** ⚠️ Not Started
**Added:** December 17, 2025

**Changes Needed:**
- Remove table grid lines: Change `border: 1px solid #ddd` to `border: none`
- Remove background colors: Remove `background-color: #f9f9f9` from `.label` cells
- Increase photo height: Change from `200px` to `280px`
- Add address-map-wrapper: New flexbox container for side-by-side layout
- Update address-block: Add `flex: 0 0 38%`
- Update location-map: Add `flex: 0 0 58%`

**Reference:** Pages 54-58 in PREVIEW-Master.html (current implementation)

**Why:** Template currently has OLD design with grid lines and stacked layout. Must update before using for Pages 59+

---

## 📋 User-Requested Items

_(User can add additional items below)_

---

## ✅ Completed Items

### Page 47: Comparison Table & Chart Redesign
**Completed:** December 17, 2025
**Template Created:** `template-comparison-table-chart.html`

**What Was Done:**
- ✅ Removed all table borders for clean appearance
- ✅ Made label column transparent (no gray background)
- ✅ Left-aligned COMP headers
- ✅ Added gray separator lines (1px under headers, 1px under Cap Rate, 2px under LOW)
- ✅ Reduced data row font to 7.5pt
- ✅ Added proper spacing (12px after headers, 14px before Cap Rate, 44px to chart)
- ✅ Created compact, centered chart (490px wrapper, 180px tall)
- ✅ Changed chart gridlines to gray (#ccc)
- ✅ Positioned labels below chart gridlines
- ✅ Centered summary text
- ✅ Documented design patterns in new template file
- ✅ Updated README.md with template documentation

**Result:** Production-ready page with professional design and reusable template

---

**Last Updated:** December 17, 2025

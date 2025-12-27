# Quick Reference: Comparable Pages Layout Issue

**Issue:** Pages 54-56 (comparable property pages) extend past page boundary into footer when real data is loaded.

**Root Cause:** Wrong layout structure - vertical stack instead of 2-column layout.

---

## ⚡ Quick Diagnosis

**How to spot this issue:**
1. Open PREVIEW-Master.html in browser
2. Navigate to Page 55 (or any comparable page)
3. Toggle field IDs **OFF** (preview mode - shows data-sample values)
4. Scroll to bottom of page
5. **Problem:** Content overlaps the footer

**Why it happens:**
- Current layout stacks everything vertically (image, tables, remarks)
- Total content height: ~1030px
- Available space: 822px
- **Overflows by 238px!**

---

## ✅ The Fix (High-Level)

**Change from vertical stack to 2-column layout:**

**BEFORE (wrong):**
```
┌─────────────────┐
│ Image + Table   │
├─────────────────┤
│ Big Table       │
├─────────────────┤
│ Another Table   │
├─────────────────┤
│ Remarks         │
├─────────────────┤
│ FOOTER OVERLAP! │
└─────────────────┘
```

**AFTER (correct):**
```
┌──────────┬──────────┐
│ ALL      │ Image    │
│ TABLES   │ Map      │
│ (Left    │ Remarks  │
│ Column)  │ (Right   │
│          │ Column)  │
├──────────┴──────────┤
│ FOOTER FITS!        │
└─────────────────────┘
```

---

## 📖 Full Guide

**For detailed implementation steps, see:**
`/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/2-Field Management/AGENT-GUIDE-Page-55-Comparable-Layout-Fix.md`

**Reference image to match:**
`/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-images/Page-55.png`

**Current HTML to fix:**
`PREVIEW-Master.html` - Line 5008 (Page 55)

---

## 🎯 Key Changes Required

1. **2-column flexbox** (left 48%, right 48%, gap 12px)
2. **Left column:** ALL tables stacked vertically
3. **Right column:** Image (280px) + Map (180px) + Remarks
4. **Font size:** 7-8pt for compact data
5. **Scoped CSS:** `.page-sheet[data-page-num="Page 55"]`

---

## ⚠️ Pages Affected

- Page 54: Comparable 1
- **Page 55: Comparable 2** ← Start here
- Page 56: Comparable 3
- Any other comparable property pages

Fix Page 55 first, then apply the same pattern to others.

---

**Last Updated:** December 17, 2025

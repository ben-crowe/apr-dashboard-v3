# APR Data Flow - How It Works

**Purpose:** Simple explanation of how data flows from input to output.
**Created:** January 7, 2026

---

## The Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   HomeTabPanel.tsx          Zustand Store         OUTPUT(S)      │
│   ─────────────────         ────────────          ─────────      │
│                                                                  │
│   User types "Calgary"  →   store['city']    →   Option A:       │
│   onInputChange('city')     = "Calgary"          reportPageTemplates.ts
│                                                  getFieldValue('city')
│                                                                  │
│                                              →   Option B:       │
│                                                  HTML Template    │
│                                                  {{city}}         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## The Pieces

| Component | Role | How It Uses Field IDs |
|-----------|------|----------------------|
| **Tab Panels (INPUT)** | User entry | Writes to store via `onInputChange('field-id')` |
| **reportPageTemplates.ts** | OUTPUT #1 | Reads from store via `getFieldValue(sections, 'field-id')` |
| **HTML Template** | OUTPUT #2 | Reads from store via `{{field-id}}` interpolation |

### Input Tabs (Multiple)

The Report Builder has multiple tabs for different field categories:

| Tab | Purpose | Example Fields |
|-----|---------|----------------|
| **Home** | Common fields (client, property, appraisers) | `client-full-name`, `subject-street`, `appraiser1-name` |
| **Site** | Site characteristics | `site-area-sqft`, `zoning-code` |
| **Improvements** | Building details | `year-built`, `building-class` |
| **Income** | Revenue/expenses | `calc-noi`, `exp-taxes` |
| **Sales Comp** | Comparable sales | `comp1-sale-price`, `comp2-address` |
| **Cost** | Cost approach | `cost-land-value`, `cost-depreciation` |
| *...and more* | | |

**HomeTabPanel is just one input panel** - it handles common fields. Other tabs handle their respective sections.

---

## Key Insight

**They don't talk to each other directly.**

All three components talk to the **Zustand Store** - that's the hub.

But they ALL must use **the same field IDs** or the chain breaks.

---

## What Happens When IDs Don't Match

```
HomeTabPanel writes to:     'city'
reportPageTemplates reads:  'subject-city'
                            ↓
                         NO DATA
```

The store has the value under `city`, but the renderer is looking for `subject-city`.

**Result:** Empty field in output.

---

## The 4-File Alignment Rule

All four must use identical field IDs:

| File | Must Match |
|------|------------|
| `HomeTabPanel.tsx` | `onInputChange('city')` |
| `fieldRegistry.ts` | `id: 'city'` |
| `reportPageTemplates.ts` | `getFieldValue(sections, 'city')` |
| `Report-MF-template.html` | `{{city}}` |

**If ANY of these has a different ID → data flow breaks.**

---

## Debugging Checklist

When a field shows empty in output:

1. **Check HomeTabPanel** - Is it writing to the right ID?
2. **Check Registry** - Does the field exist with that exact ID?
3. **Check the Output renderer** - Is it reading the same ID?
4. **Check the Store** - Does the value exist under that key?

Usually the problem is a mismatch between what's written and what's read.

---

## Visual Summary

```
     INPUT (Multiple Tabs)          HUB                    OUTPUT
┌──────────────────────┐      ┌──────────────┐      ┌──────────────┐
│ HomeTabPanel         │      │              │      │              │
│ SiteTabPanel         │      │   Zustand    │      │ Templates    │
│ IncomeTabPanel       │─────→│   Store      │─────→│ (TS or HTML) │
│ SalesCompTabPanel    │writes│              │reads │              │
│ CostTabPanel         │      │ ['city']     │      │ 'city'       │
│ ...etc               │      │ ['calc-noi'] │      │ {{calc-noi}} │
└──────────────────────┘      └──────────────┘      └──────────────┘
                                    ↑
                           fieldRegistry.ts
                           defines valid IDs
```

**Registry is the authority** - it defines what IDs are valid.
**Store is the hub** - it holds all the data.
**Everyone else follows** - all input tabs and output renderers must use registry IDs.

---

*Credit: Ben's assistant for the clear explanation*

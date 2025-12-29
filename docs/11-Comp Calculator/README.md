# Section 5: Property Valuation Calculator

## Status: 📦 PLACEHOLDER - External Resources Need Migration

**⚠️ IMPORTANT:** This is a placeholder section. The actual calculator components are currently located externally and need to be moved here.

---

## Current External Location

**Path:** `/Users/bencrowe/Development/APR-Dashboard-v2-Res/01-APR-Resources/08-Calculator/`

**What's There:**
- `ComputationalTestPage-Standalone.tsx` (85KB) - Complete standalone calculator page
- `Comp-Test-Pg-VO-v2.tsx` (73KB) - Calculator with CollapsibleSection UI
- `calculation/` folder - Core calculation modules:
  - `CostApproach.tsx`
  - `IncomeApproach.tsx`
  - `SalesComparison.tsx`
  - `FinancialSummary.tsx`
  - `ValidationResults.tsx`

---

## Migration Plan

**When Ready to Migrate:**

1. Copy all components from external location to this folder
2. Update import paths in components
3. Test calculator functionality
4. Update Systems Guide references to point here
5. Archive or remove external copy

**Files to Move:**
```bash
# From: /Users/bencrowe/Development/APR-Dashboard-v2-Res/01-APR-Resources/08-Calculator/
# To: /Users/bencrowe/Development/APR-Dashboard-v3/-APR-System-Roadmap/5-section-Calculator/

- ComputationalTestPage-Standalone.tsx
- Comp-Test-Pg-VO-v2.tsx
- calculation/ (entire folder)
- README.md (original)
```

---

## What This Component Does

**Property Valuation Calculator** - Professional appraisal calculations

**Features:**
- Income Approach (NOI ÷ Cap Rate)
- Sales Comparison Approach (Comparable properties analysis)
- Cost Approach (Land value + Building cost - Depreciation)
- Comprehensive Valuation (Weighted combination of all three)
- Live recalculation
- Up to 5 comparable properties
- Confidence scoring

**Integration:** Phase 11 in Systems Guide

---

## Why This Section Exists

This section is a **future home** for the Calculator components. Currently they're hidden in the APR-Dashboard-v2-Res project, but they belong here in the main roadmap where:
- Team can easily find them
- Documentation is co-located with code
- Systems Guide can reference local paths
- Everything is in one organized place

---

**Last Updated:** November 3, 2025  
**Migration Status:** Not started - components still external

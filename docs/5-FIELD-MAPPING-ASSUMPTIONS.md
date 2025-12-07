# Field Mapping Assumptions

**Date:** November 13, 2025
**Status:** Documented Assumptions for Client Review

---

## Valuation Premises → Values Field

When mapping Dashboard "Valuation Premises" dropdown to Valcre "Values" field, we had to make an assumption for **"Investment Value"** because Valcre doesn't have a direct "Investment Value" option.

### The Assumption:

**Dashboard:** "Investment Value"
**→ Valcre:** "Prospective at Stabilization"

### Why This Mapping?

**Conceptual Difference:**
- **Investment Value** = Value to a specific investor based on their unique investment criteria (not market value)
- **Prospective at Stabilization** = Estimated market value when property reaches stabilized occupancy

These are technically DIFFERENT concepts in appraisal theory.

**Why We Chose It:**
- Investors typically care about the stabilized value (what the property will be worth when fully leased/operating)
- "Prospective at Stabilization" is the closest practical match in Valcre's dropdown
- It represents forward-looking value, which aligns with investment decision-making

### Alternative Options Considered:

1. **"In Use"** - Rejected because it means property is currently occupied, not investor-specific value
2. **"Other"** - Too generic, loses meaning
3. **"Prospective at Completion"** - Applies to properties under construction, not general investments

### Complete Valcre "Values" Dropdown Options:

```
✓ As-Is (Market Value maps here)
  Prospective at Completion
✓ Prospective at Stabilization (Investment Value maps here - ASSUMPTION)
  As-Vacant
✓ Insurable Replacement Cost (Insurable Value maps here)
  Bulk Value
  Disposition
  Go Dark
  Hypothetical
  In Use
✓ Liquidation (Liquidation Value maps here)
  Lots
  Lots to Houses
✓ Market Rent Study (Market Rent maps here)
  Other
  Rent Restricted
  Retrospective
  Tax Credits
```

### Full Dashboard → Valcre Mapping:

| Dashboard Value | Valcre Value | Status |
|----------------|--------------|--------|
| Market Value | As-Is | ✅ Direct match |
| Market Rent | Market Rent Study | ✅ Direct match |
| Liquidation Value | Liquidation | ✅ Direct match |
| Insurable Value | Insurable Replacement Cost | ✅ Direct match |
| **Investment Value** | **Prospective at Stabilization** | ⚠️ **ASSUMPTION** |

---

## Action Required

**Client (Chris) should confirm:**
- Is "Prospective at Stabilization" the correct match for "Investment Value"?
- Should we use a different Valcre option?
- Should we update the Dashboard dropdown to match Valcre's terminology exactly?

**Alternative Solutions:**

1. **Change Dashboard to match Valcre exactly:**
   - Remove "Investment Value" from Dashboard
   - Add "Prospective at Stabilization" to Dashboard
   - Eliminates the assumption

2. **Use "Other" for now:**
   - Map "Investment Value" → "Other"
   - Requires manual selection in Valcre
   - Preserves accuracy but adds manual work

3. **Keep current mapping:**
   - Accept that "Investment Value" ≈ "Prospective at Stabilization" for this workflow
   - Document in training materials

---

## Other Field Mappings (All Direct Matches)

All other LOE field mappings are direct 1:1 matches with no assumptions:

### ✅ Property Rights → Purpose (13 values)
All Dashboard options have exact Valcre equivalents

### ✅ Intended Use → Authorized Use (6 values)
All Dashboard options have exact Valcre equivalents

### ✅ Scope of Work → Scope (14 values)
All Dashboard options have exact Valcre equivalents

### ✅ Report Type → Format (10 values)
All Dashboard options have exact Valcre equivalents

---

**Document Status:** ✅ Complete
**Created:** November 13, 2025
**For Review By:** Chris (APR Client)
**Next Action:** Confirm Investment Value mapping assumption

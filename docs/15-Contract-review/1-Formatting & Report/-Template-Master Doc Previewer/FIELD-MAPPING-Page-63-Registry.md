# Field Mapping: Page 63 - Reconciliation of Values Table

**Page:** 63
**Table Name:** Reconciliation of Values & Final Value Conclusion
**Total Fields:** 14 fields (12 existing + 2 new)
**HTML Lines:** TBD (Page 63)
**Status:** ✅ Field Mapping Complete - Ready for HTML Update
**Registry Status:** ✅ All fields verified at registry count 786 (added 2 fields)

---

## Overview

Page 63 contains the final reconciliation table that compares the indicated values from the three valuation approaches (Income Approach, Sales Comparison Approach, and Cost Approach if applicable) and arrives at the final concluded market value for the subject property.

**Table Structure:**
- **Approach Comparison Rows:** 2-3 rows showing each valuation approach's indicated value
- **Final Value Conclusion:** Reconciled/concluded market value
- **Report Metadata:** Valuation scenario, interest appraised, effective date
- **Value per SF:** For comparison across approaches

---

## Field Mapping Table

### Section 1: Income Approach (Direct Capitalization) - 4 fields

| # | HTML Field ID | Registry Field ID | Registry Line | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| 1 | {{IncomeApproach_IndicatedValue}} | calc-indicated-value | 608 | ✅ Existing | From Page 49 Direct Cap table |
| 2 | {{IncomeApproach_ValuePerSF}} | calc-value-per-sf | 610 | ✅ Existing | Indicated value ÷ total SF |
| 3 | {{IncomeApproach_NOI}} | calc-noi | 604 | ✅ Existing | Net Operating Income |
| 4 | {{IncomeApproach_NOIPerSF}} | calc-noi-per-sf | 606 | ✅ Existing | NOI ÷ total SF |

---

### Section 2: Sales Comparison Approach - 2 fields

| # | HTML Field ID | Registry Field ID | Registry Line | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| 5 | {{SalesComparison_IndicatedValue}} | sca-indicated-value | 880 | ✅ Existing | From Page 61 DCA conclusion |
| 6 | {{SalesComparison_ValuePerSF}} | sca-value-per-sf | 882 | ✅ Existing | Indicated value ÷ total SF |

---

### Section 3: Cost Approach - NOT USED
*Cost Approach not developed for this property type (income-producing multifamily)*

---

### Section 4: Final Value Conclusion - 4 fields

| # | HTML Field ID | Registry Field ID | Registry Line | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| 7 | {{FinalValue_Concluded}} | recon-final-value | 1066 | ✅ Existing | Appraiser's final concluded value |
| 8 | {{FinalValue_PerSF}} | recon-final-value-per-sf | NEW | ✅ Added | Final value ÷ total SF (calculated) |
| 9 | {{FinalValue_PerUnit}} | recon-final-value-per-unit | NEW | ✅ Added | Final value ÷ subject units (calculated) |
| 10 | {{CapRate_Used}} | calc-cap-rate | 592 | ✅ Existing | Cap rate used in Income Approach |

---

### Section 5: Report Metadata - 4 fields

| # | HTML Field ID | Registry Field ID | Registry Line | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| 11 | {{Valuation_Scenario}} | value-scenario | 239 | ✅ Existing | Market Value, As Is, etc. |
| 12 | {{Interest_Appraised}} | property-rights | 240 | ✅ Existing | Fee Simple, Leased Fee, etc. |
| 13 | {{Report_Date}} | report-date | 177 | ✅ Existing | Report completion date |
| 14 | {{Effective_Date}} | recon-effective-date | 1068 | ✅ Existing | Effective date of valuation |

---

## Field Status Summary

### ✅ Fields Already Existing (12 fields)
| Field | Location | Registry Line |
|-------|----------|---------------|
| value-scenario | exec section | 239 |
| property-rights | exec section | 240 |
| report-date | cover section | 177 |
| recon-effective-date | recon section | 1068 |
| sca-indicated-value | sales section | 880 |
| sca-value-per-sf | sales section | 882 |
| calc-noi | calc section | 604 |
| calc-noi-per-sf | calc section | 606 |
| calc-cap-rate | calc section | 592 |
| calc-indicated-value | calc section | 608 |
| calc-value-per-sf | calc section | 610 |
| recon-final-value | recon section | 1066 |

### ✅ Fields Added by TypeScript Pro (2 fields)
| Field | Type | Source | Commit |
|-------|------|--------|--------|
| recon-final-value-per-unit | currency | calculated | f0a7610 |
| recon-final-value-per-sf | currency | calculated | f0a7610 |

### 📊 Registry Status
| Metric | Value |
|--------|-------|
| Previous count | 784 |
| Fields added | +2 |
| **New total** | **786** |
| TypeScript Pro Commit | f0a7610 |

### ❌ Cost Approach Fields - Not Used
- cost-indicated-value (not developed for income properties)
- cost-value-per-sf (not developed for income properties)

---

## Reconciliation Logic

### Typical Reconciliation Table Structure

```
APPROACH                    | INDICATED VALUE  | VALUE PER SF
----------------------------|------------------|-------------
Income Approach             | $1,780,000      | $137.31
Sales Comparison Approach   | $1,740,000      | $134.21
Cost Approach              | N/A             | N/A
----------------------------|------------------|-------------
FINAL CONCLUDED VALUE       | $1,760,000      | $135.76
```

### Reconciliation Narrative (Page 62)
- Appraiser's reasoning for weight given to each approach
- Why certain approaches were favored or not used
- Market conditions supporting the conclusion

### Final Value Calculation
**Option 1: Weighted Average**
- Income Approach: 60% weight × $1,780,000 = $1,068,000
- Sales Comp: 40% weight × $1,740,000 = $696,000
- **Total: $1,764,000** → Round to **$1,760,000**

**Option 2: Appraiser Judgment**
- Based on reliability of data
- Based on market conditions
- Based on property type (income-producing = favor Income Approach)

---

## Calculation Dependencies

### Values FROM Other Pages
```
Page 49 (Income Approach)
    ↓
calc-indicated-value = $1,780,000
calc-value-per-sf = $137.31
calc-cap-rate = 6.5%
    ↓
        +
        ↓
Page 61 (Sales Comparison)
    ↓
sca-indicated-value-rounded = $1,740,000
sca-value-per-sf = $134.21
    ↓
        +
        ↓
Page 63 (Reconciliation)
    ↓
Appraiser weighs both approaches
    ↓
final-value-conclusion = $1,760,000
final-value-per-sf = $135.76
```

### Calculated Fields
**final-value-per-sf:**
```
final-value-per-sf = final-value-conclusion ÷ subject-total-sf
Example: $1,760,000 ÷ 12,963 SF = $135.76/SF
```

**final-value-per-unit:**
```
final-value-per-unit = final-value-conclusion ÷ subject-units
Example: $1,760,000 ÷ 12 units = $146,667/unit
```

---

## HTML Implementation Notes

### Table Structure (Typical)

```html
<!-- Page 63: Reconciliation of Values -->
<div class="reconciliation-section">
  <h2>Reconciliation of Values</h2>

  <!-- Metadata Section -->
  <div class="report-metadata">
    <p><strong>Valuation Scenario:</strong>
       <span class="field-mapped" title="{{valuation-scenario}}">{{valuation-scenario}}</span>
    </p>
    <p><strong>Interest Appraised:</strong>
       <span class="field-mapped" title="{{interest-appraised}}">{{interest-appraised}}</span>
    </p>
    <p><strong>Effective Date:</strong>
       <span class="field-mapped" title="{{effective-date}}">{{effective-date}}</span>
    </p>
  </div>

  <!-- Reconciliation Table -->
  <table class="reconciliation-table">
    <thead>
      <tr>
        <th>APPROACH</th>
        <th>INDICATED VALUE</th>
        <th>VALUE PER SF</th>
      </tr>
    </thead>
    <tbody>
      <!-- Income Approach Row -->
      <tr>
        <td><strong>Income Approach (Direct Capitalization)</strong></td>
        <td>
          <span class="field-mapped" title="{{calc-indicated-value}}">{{calc-indicated-value}}</span>
        </td>
        <td>
          <span class="field-mapped" title="{{calc-value-per-sf}}">{{calc-value-per-sf}}</span>
        </td>
      </tr>

      <!-- Sales Comparison Row -->
      <tr>
        <td><strong>Sales Comparison Approach</strong></td>
        <td>
          <span class="field-mapped" title="{{sca-indicated-value-rounded}}">{{sca-indicated-value-rounded}}</span>
        </td>
        <td>
          <span class="field-mapped" title="{{sca-value-per-sf}}">{{sca-value-per-sf}}</span>
        </td>
      </tr>

      <!-- Cost Approach Row (if used) -->
      <tr class="not-applicable">
        <td><strong>Cost Approach</strong></td>
        <td colspan="2">Not Developed</td>
      </tr>

      <!-- Final Conclusion Row -->
      <tr class="conclusion-row">
        <td><strong>FINAL CONCLUDED VALUE</strong></td>
        <td>
          <strong>
            <span class="field-mapped" title="{{final-value-conclusion}}">{{final-value-conclusion}}</span>
          </strong>
        </td>
        <td>
          <strong>
            <span class="field-mapped" title="{{final-value-per-sf}}">{{final-value-per-sf}}</span>
          </strong>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Final Statement -->
  <div class="final-statement">
    <p>Based on the foregoing analysis, it is our opinion that the Market Value of the subject property,
       as of <span class="field-mapped" title="{{effective-date}}">{{effective-date}}</span>, is:</p>
    <p class="final-value">
      <strong>
        <span class="field-mapped" title="{{final-value-conclusion}}">{{final-value-conclusion}}</span>
      </strong>
    </p>
    <p class="final-value-words">(ONE MILLION SEVEN HUNDRED SIXTY THOUSAND DOLLARS)</p>
  </div>
</div>
```

---

## Relationship to Other Pages

### Data Flow
```
Page 49 (Income Approach)
    ↓
calc-indicated-value, calc-value-per-sf, calc-cap-rate
    ↓
        +
        ↓
Page 61 (Sales Comparison)
    ↓
sca-indicated-value-rounded, sca-value-per-sf
    ↓
        +
        ↓
Page 62 (Narrative Reconciliation)
    ↓
Appraiser's reasoning and weighting
    ↓
        ↓
Page 63 (Reconciliation Table)
    ↓
Displays both approaches + final conclusion
    ↓
        ↓
Page 65 (Final Value Statement)
    ↓
final-value-conclusion displayed on certification page
```

---

## TypeScript Pro Tasks - ✅ COMPLETE

### STEP 1: ✅ Fields Found in Registry
- [x] value-scenario (line 239, exec section)
- [x] property-rights (line 240, exec section)
- [x] report-date (line 177, cover section)
- [x] recon-effective-date (line 1068, recon section)

### STEP 2: ✅ All Fields Verified
- [x] sca-indicated-value (line 880, sales section)
- [x] sca-value-per-sf (line 882, sales section)
- [x] calc-noi (line 604, calc section)
- [x] calc-noi-per-sf (line 606, calc section)
- [x] calc-cap-rate (line 592, calc section)
- [x] calc-indicated-value (line 608, calc section)
- [x] calc-value-per-sf (line 610, calc section)
- [x] recon-final-value (line 1066, recon section)

### STEP 3: ✅ Fields Added
**Final Value Calculated Fields:**
- [x] recon-final-value-per-unit (currency, calculated) - Added
- [x] recon-final-value-per-sf (currency, calculated) - Added

**Registry Update:**
- Previous count: 784 fields
- Fields added: +2
- New total: **786 fields**
- Commit: f0a7610

---

## Common Valuation Scenarios

| Scenario | Description | Typical Use |
|----------|-------------|-------------|
| **Market Value** | Most probable price in competitive market | Standard appraisals |
| **Market Value - As Is** | Current condition without improvements | Pre-renovation |
| **Market Value - As Proposed** | Upon completion of improvements | Development projects |
| **Market Value - As Stabilized** | After rent-up/occupancy stabilization | New construction |
| **Liquidation Value** | Forced sale conditions | Distressed properties |
| **Investment Value** | Value to specific investor | Portfolio acquisitions |

---

## Common Property Interests

| Interest | Description | Typical Use |
|----------|-------------|-------------|
| **Fee Simple** | Complete ownership, no restrictions | Most common |
| **Leased Fee** | Ownership with existing lease in place | Income properties |
| **Leasehold** | Tenant's interest in leased property | Ground leases |
| **Life Estate** | Ownership for duration of life | Estate planning |
| **Partial Interest** | Less than 100% ownership | Partnership interests |

---

## Next Steps

### ✅ Field Mapping Complete
1. [x] TypeScript Pro verified all fields
2. [x] Added 2 new calculated fields (recon-final-value-per-unit, recon-final-value-per-sf)
3. [x] Registry updated to 786 fields (commit f0a7610)
4. [x] Field mapping document complete

### 🔄 Ready for HTML Template Update
1. **Create crosswalk for HTML wiring** (similar to Pages 49, 59, 61)
2. **Update PREVIEW-Master.html** with registry field IDs
3. **Test field mapping** with sample data
4. **Commit HTML updates**

### 📋 Remaining Tables
After Page 63, remaining tables to map:
- **Page 44:** Operating History (~40 fields)
- **Page 65:** Market Value Conclusion (~10 fields)

---

**Created:** December 18, 2025
**Last Updated:** December 18, 2025
**Status:** ✅ Field Mapping Complete - Ready for HTML Update
**Total Fields:** 14 fields (12 existing + 2 new)
**Registry Count:** 786 fields (+2 from 784)
**TypeScript Pro Commit:** f0a7610

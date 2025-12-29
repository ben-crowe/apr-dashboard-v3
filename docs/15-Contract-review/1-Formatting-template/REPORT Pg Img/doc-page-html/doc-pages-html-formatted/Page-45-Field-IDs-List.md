# Page 45 - Complete Field ID Reference

## Quick Stats
- **Total Field IDs:** 37
- **Page Section:** Income Approach - Operating Expenses & NOI
- **Status:** 100% Complete
- **Last Updated:** 2025-12-16

---

## Field IDs by Section

### 1. Operating Expenses - Taxes (4 fields)
```
OpEx_Taxes_PctEGR       → 10.1%
OpEx_Taxes_SF           → $1.93
OpEx_Taxes_Unit         → $1,231
OpEx_Taxes_Total        → $19,688
```

### 2. Operating Expenses - Insurance (4 fields)
```
OpEx_Insurance_PctEGR   → 5.8%
OpEx_Insurance_SF       → $1.11
OpEx_Insurance_Unit     → $710
OpEx_Insurance_Total    → $11,360
```

### 3. Operating Expenses - Repairs & Maintenance (4 fields)
```
OpEx_Repairs_PctEGR     → 6.8%
OpEx_Repairs_SF         → $1.30
OpEx_Repairs_Unit       → $830
OpEx_Repairs_Total      → $13,280
```

### 4. Operating Expenses - Payroll (4 fields)
```
OpEx_Payroll_PctEGR     → 4.1%
OpEx_Payroll_SF         → $0.78
OpEx_Payroll_Unit       → $500
OpEx_Payroll_Total      → $8,000
```

### 5. Operating Expenses - Utilities (4 fields)
```
OpEx_Utilities_PctEGR   → 10.8%
OpEx_Utilities_SF       → $2.06
OpEx_Utilities_Unit     → $1,315
OpEx_Utilities_Total    → $21,040
```

### 6. Operating Expenses - Management Fees (4 fields)
```
OpEx_Management_PctEGR  → 4.2%
OpEx_Management_SF      → $0.81
OpEx_Management_Unit    → $518
OpEx_Management_Total   → $8,281
```

### 7. Operating Expenses - Other Expenses (4 fields)
```
OpEx_Other_PctEGR       → 2.0%
OpEx_Other_SF           → $0.38
OpEx_Other_Unit         → $245
OpEx_Other_Total        → $3,920
```

### 8. Operating Expenses - Total Row (4 fields)
```
OpEx_Total_PctEGR       → 43.9%
OpEx_Total_SF           → $8.38
OpEx_Total_Unit         → $5,348
OpEx_Total_Total        → $85,569
```

### 9. Net Operating Income (3 fields)
```
NOI_Total               → $109,445
NOI_Per_Unit            → $6,840
NOI_Per_SF              → $10.73
```

### 10. Page Footer (2 fields)
```
Subject_Street          → 1101, 1121 109 St, North Battleford, Saskatchewan
Company_JobNumber       → VAL251012 - 1
```

---

## Field Naming Pattern

All Operating Expense fields follow this pattern:
```
OpEx_[Category]_[Metric]
```

### Categories:
- Taxes
- Insurance
- Repairs
- Payroll
- Utilities
- Management
- Other
- Total

### Metrics:
- **PctEGR** → Percentage of Effective Gross Revenue
- **SF** → Per Square Foot
- **Unit** → Per Unit
- **Total** → Total Amount

### Examples:
```typescript
OpEx_Taxes_PctEGR      // Taxes as % of EGR
OpEx_Taxes_SF          // Taxes per square foot
OpEx_Taxes_Unit        // Taxes per unit
OpEx_Taxes_Total       // Total taxes
```

---

## NOI Field Naming Pattern

Net Operating Income fields follow:
```
NOI_[Metric]
```

### Metrics:
- **Total** → Total NOI amount
- **Per_Unit** → NOI per unit
- **Per_SF** → NOI per square foot

---

## Usage in HTML

All field IDs are wrapped in `<span class="field-mapped" title="{{Field_ID}}">`:

```html
<td class="text-center">
  <span class="field-mapped" title="{{OpEx_Taxes_PctEGR}}">10.1%</span>
</td>
```

---

## Sample Data Integration

All 37 fields are defined in the sampleData object:

```javascript
const sampleData = {
  // ... other fields ...
  
  // Page 45 - Operating Expenses Summary
  'OpEx_Taxes_PctEGR': '10.1%',
  'OpEx_Taxes_SF': '$1.93',
  'OpEx_Taxes_Unit': '$1,231',
  'OpEx_Taxes_Total': '$19,688',
  // ... etc
};
```

---

## Table Structure

The Operating Expenses table has:
- **Columns:** Operating Expenses | %/EGR | $/SF NRA | $/UNIT | TOTAL | COMMENT
- **Rows:** 7 expense categories + 1 total row
- **Data Cells:** 4 field-mapped values per row (excluding comment column)
- **Total Data Points:** 32 field-mapped cells in table

---

## Related Pages

This page is part of the Income Approach section (Pages 40-50):
- **Page 44:** Revenue Analysis
- **Page 45:** Operating Expenses & NOI (THIS PAGE)
- **Page 46:** Capitalization Rate Selection

Field naming should remain consistent across this section.

---

## Verification Commands

```bash
# Count field-mapped spans on Page 45
grep -A 100 'data-page-num="Page 45"' PREVIEW-Master.html | \
  grep -o 'class="field-mapped"' | wc -l
# Expected: 37

# List all field IDs
grep -A 100 'data-page-num="Page 45"' PREVIEW-Master.html | \
  grep -o 'title="{{[^}]*}}"' | sort -u

# Verify in sampleData
grep -E "'(OpEx_|NOI_|Subject_Street|Company_JobNumber)'" PREVIEW-Master.html | \
  grep -o "'[A-Za-z_]*':" | sort -u
```

---

**Document Version:** 1.0  
**Status:** Complete  
**Last Verified:** 2025-12-16

# Assignment Section Input Fields

These are the USER INPUT fields for the Report Builder Assignment Section.

**Loads via:** "Load Test Data" button in Assignment section of EditPanel
**Rule:** User enters these. Template displays them in the Letter of Engagement and Assignment pages.

---

## Assignment Scope

Core assignment parameters that define the appraisal scope.

- **Report Type:** `report-type`  |  Appraisal Report  |  Type of report (Narrative/Form/Restricted)
- **Property Rights:** `property-rights`  |  Fee Simple Estate  |  Rights being appraised
- **Property Interest:** `property-interest`  |  fee simple estate  |  Legal interest appraised
- **Intended Use:** `intended-use`  |  The authorized use of this report is for first mortgage financing purposes.  |  Purpose of the appraisal
- **Intended User:** `intended-user`  |  102109845 Saskatchewan Ltd. is the only authorized user of this report.  |  Authorized users of report
- **Scope of Work:** `scope-of-work`  |  Complete appraisal of the subject property including all three approaches to value where applicable.  |  Work to be performed

---

## Valuation Parameters

Key dates and valuation premises.

- **Effective Date:** `effective-date`  |  October 17, 2025  |  Date of value
- **Report Effective Date:** `report-effectivedate`  |  October 17, 2025  |  Alternate effective date field
- **Valuation Premises:** `valuation-premises`  |  As Is  |  Valuation basis (As Is/As Stabilized/etc.)
- **Report Values:** `report-values`  |  As Stabilized (Fee Simple Estate)  |  Value scenario description
- **Inspection Date:** `inspection-date`  |  October 17, 2025  |  Date property was inspected

---

## Report Standards

Professional standards and guidelines followed.

- **Report Guidelines:** `report-guidelines`  |  The report has been completed in accordance with the Canadian Uniform Standards of Professional Appraisal Practice ("CUSPAP") adopted January 1, 2024.  |  Standards compliance statement
- **Report Depth:** `report-depth`  |  fully described  |  Level of detail in report

---

## Approaches to Value

Valuation approaches included in the report.

- **Report Approaches:** `report-approaches`  |  Direct Comparison and Income (Direct Capitalization) Approaches  |  Approaches used in valuation

---

## Special Conditions

Extraordinary assumptions and limiting conditions.

- **Extraordinary Assumptions:** `report-extraordinary`  |  No Extraordinary Assumptions were made for this assignment.  |  Any special assumptions
- **Limiting Conditions:** `report-limcond`  |  No Extraordinary Limiting Conditions were made for this assignment.  |  Additional limitations

---

## Approach Narratives

Explanations for each valuation approach.

- **Cost Approach Narrative:** `valuation-cost-narrative`  |  Considering the limited applicability of this approach...  |  Cost approach explanation
- **Sales Approach Narrative:** `valuation-sales-narrative`  |  We have undertaken the Direct Comparison Approach...  |  Sales comparison explanation
- **Income Approach Narrative:** `valuation-income-narrative`  |  We have undertaken the Income Approach...  |  Income approach explanation
- **Land Value Narrative:** `valuation-land-narrative`  |  Characteristics specific to the subject property...  |  Site value explanation

---

## Legal Information

Legal description and title matters.

- **Legal Description:** `report-legal`  |  Plan - C4240; Block - 95; Lot - 17,18, 19, 20  |  Legal land description
- **Easements Text:** `easements-text`  |  A legal opinion regarding title information was not provided...  |  Easements disclosure

---

## Field Mapping: Source to Assignment

Maps source fields from `northBattlefordTestData.ts` to assignment field IDs.

**Scope Fields:**
- `report-type` → Report type classification
- `property-rights` → Rights appraised
- `intended-use` → Authorized use statement
- `intended-user` → Authorized users
- `scope-of-work` → Work description

**Date Fields:**
- `effective-date` → Valuation effective date
- `inspection-date` → Property inspection date

**Approach Fields:**
- `report-approaches` → Approaches summary
- `valuation-cost-narrative` → Cost approach text
- `valuation-sales-narrative` → Sales approach text
- `valuation-income-narrative` → Income approach text

---

## Total Fields: 22

- Assignment Scope: 6
- Valuation Parameters: 5
- Report Standards: 2
- Approaches to Value: 1
- Special Conditions: 2
- Approach Narratives: 4
- Legal Information: 2

---

## Adding New Assignment Fields

1. Add field definition to `initializeMockData()` in `reportBuilderStore.ts`
2. Add mapping in `loadAssignmentTestData()` function
3. Update this documentation
4. Test with "Load Test Data" button

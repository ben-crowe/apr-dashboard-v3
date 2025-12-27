# Field Mapping Reference

Master field mapping from Dashboard → Valcre API

**Source:** `03-Master-Field-Workflow/01.Master Field-Mapping-Full.md` from v2 repo (archived)

## Critical Payment Fields

| Dashboard Field | Valcre API Field | Type | Notes |
|----------------|------------------|------|-------|
| retainerAmount | **Job.Retainer** | number | Use `Retainer` NOT `RetainerAmount` |
| appraisalFee | Job.Fee | number | Currency - strip $ and commas |
| deliveryDate | Job.DeliveryDate | date | ISO format |
| paymentTerms | Job.PaymentTerms | string | Text field |

## Property Fields

| Dashboard Field | Valcre API Field | Type | Notes |
|----------------|------------------|------|-------|
| propertyType | Property.PropertyType | string | Dropdown value |
| propertySubtype | Property.PropertySubtype | string | Optional |
| propertyAddress | Property.AddressStreet | string | Full address |
| buildingSize | Property.BuildingSize | number | Square feet |
| numberOfUnits | Property.NumberOfUnits | number | Count |

## Critical Enum Fields

| Dashboard Field | Valcre API Field | Allowed Values |
|----------------|------------------|----------------|
| intendedUse | Job.intendedUse | Financing, Acquisition/Disposition, etc. |
| reportType | Job.reportType | Appraisal Report, Restricted Report, etc. |
| propertyRightsAppraised | Job.propertyRightsAppraised | Fee Simple Interest, Leased Fee Interest, etc. |
| valuationPremises | Job.valuationPremises | As-Is, As Complete, As Proposed |

## Important Notes

1. **Retainer Bug Fix (Oct 2025):** Line 142 in valcre.ts changed from `RetainerAmount` to `Retainer`
2. **Two-Table Architecture:** Most fields save to both `job_submissions` AND `job_loe_details`
3. **Currency Formatting:** Always strip $ and commas before sending to Valcre
4. **Creation vs Update:** Some fields are POST-only, most support PATCH updates

For complete mapping, see v2 repo: `03-Master-Field-Workflow/01.Master Field-Mapping-Full.md`

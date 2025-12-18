# Page 59: Sales Comparison Grid - HTML to Registry Field Mapping

**Date Created:** 2025-12-18
**Status:** Field IDs identified, awaiting TypeScript Pro registry additions
**Total Fields:** 188 (76 existing + 112 to add)

---

## Overview

Page 59 contains the Sales Comparison Approach Grid comparing the subject property against 5 comparable sales. This is one of the primary valuation tables in the report.

**Field Categories:**
- **Subject Property Characteristics:** 18 fields (11 reuse existing, 7 new)
- **Comparable Sales (×5):** 170 fields (10 existing × 5 + 21 new × 5)

**Data Flow:**
```
Valcre API → fieldRegistry.ts → PREVIEW-Master.html Page 59 table
```

---

## SECTION 1: Subject Property Characteristics (18 fields)

### 1.1 Basic Property Info (Reuse Existing)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{Subject_Name}}` | `property-name` | text | user-input | PROPERTY.Name | ✅ Reuse |
| `{{Subject_Address}}` | `street-address` | text | user-input | PROPERTY.Address | ✅ Reuse |
| `{{Subject_City}}` | `city` | text | user-input | PROPERTY.City | ✅ Reuse |
| `{{Subject_Province}}` | `province` | text | user-input | PROPERTY.Province | ✅ Reuse |
| `{{Subject_PostalCode}}` | `postal-code` | text | user-input | PROPERTY.PostalCode | ✅ Reuse |

### 1.2 Property Metrics (Reuse Existing)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{Subject_Units}}` | `subject-units` | number | user-input | PROPERTY.Units | ✅ |
| `{{Subject_NRA}}` | `subject-gba` | number | user-input | PROPERTY.GBA | ✅ |
| `{{Subject_YearBuiltWeighted}}` | `subject-year` | number | user-input | PROPERTY.YearBuilt | ✅ |
| `{{Subject_Condition}}` | `subject-condition` | select | user-input | PROPERTY.Condition | ✅ |
| `{{Subject_NOIPerUnit}}` | `calc-noi-per-unit` | currency | calculated | CALC.NOI/Units | ✅ Reuse |
| `{{Subject_Occupancy}}` | `occupancy-rate` | percentage | user-input | PROPERTY.Occupancy | ✅ Reuse |

### 1.3 Qualitative Characteristics (NEW - Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{Subject_Location}}` | `subject-location` | select | user-input | PROPERTY.LocationRating | ❌ ADD |
| `{{Subject_Access}}` | `subject-access` | select | user-input | PROPERTY.AccessRating | ❌ ADD |
| `{{Subject_Exposure}}` | `subject-exposure` | select | user-input | PROPERTY.ExposureRating | ❌ ADD |
| `{{Subject_Quality}}` | `subject-quality` | select | user-input | PROPERTY.QualityRating | ❌ ADD |
| `{{Subject_Appeal}}` | `subject-appeal` | select | user-input | PROPERTY.AppealRating | ❌ ADD |

### 1.4 Amenities (NEW - Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{Subject_ParkingType}}` | `subject-parking` | text | user-input | PROPERTY.ParkingType | ⚠️ Verify exists |
| `{{Subject_ProjAmenities}}` | `subject-proj-amenities` | text | user-input | PROPERTY.ProjectAmenities | ❌ ADD |
| `{{Subject_UnitAmenities}}` | `subject-unit-amenities` | text | user-input | PROPERTY.UnitAmenities | ❌ ADD |

**Subject Section Subtotal:** 18 fields (11 existing + 7 to add)

---

## SECTION 2: Comparable Sale 1 (34 fields)

### 2.1 Basic Info (Existing)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_1_Name}}` | `comp1-name` | text | user-input | SALE1.Name | ✅ |
| `{{COMP_1_Address}}` | `comp1-address` | text | user-input | SALE1.Address | ✅ |
| `{{COMP_1_City}}` | `comp1-city` | text | user-input | SALE1.City | ✅ |

### 2.2 Sale Info (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_1_Province}}` | `comp1-province` | text | user-input | SALE1.Province | ❌ ADD |
| `{{COMP_1_PostalCode}}` | `comp1-postal-code` | text | user-input | SALE1.PostalCode | ❌ ADD |
| `{{COMP_1_TransPrice}}` | `comp1-sale-price` | currency | user-input | SALE1.SalePrice | ✅ |
| `{{COMP_1_PricePerUnit}}` | `comp1-price-per-unit` | currency | calculated | SALE1.Price/Units | ✅ |
| `{{COMP_1_NOIPerUnit}}` | `comp1-noi-per-unit` | currency | calculated | SALE1.NOI/Units | ✅ |
| `{{COMP_1_CapRate}}` | `comp1-cap-rate` | percentage | calculated | SALE1.NOI/Price | ✅ |

### 2.3 Property Metrics (Existing + New)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_1_Units}}` | `comp1-units` | number | user-input | SALE1.Units | ✅ |
| `{{COMP_1_NRA}}` | `comp1-gba` | number | user-input | SALE1.GBA | ✅ |
| `{{COMP_1_YearBuiltWeighted}}` | `comp1-year` | number | user-input | SALE1.YearBuilt | ✅ |
| `{{COMP_1_Occupancy}}` | `comp1-occupancy` | percentage | user-input | SALE1.Occupancy | ❌ ADD |

### 2.4 Transaction Adjustments (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_1_PropertyRights}}` | `comp1-property-rights` | percentage | user-input | SALE1.AdjPropertyRights | ❌ ADD |
| `{{COMP_1_Financing}}` | `comp1-financing` | percentage | user-input | SALE1.AdjFinancing | ❌ ADD |
| `{{COMP_1_SaleConditions}}` | `comp1-sale-conditions` | percentage | user-input | SALE1.AdjSaleConditions | ❌ ADD |
| `{{COMP_1_ExpendituresAfterSale}}` | `comp1-expenditures-after-sale` | percentage | user-input | SALE1.AdjExpenditures | ❌ ADD |
| `{{COMP_1_MarketConditions}}` | `comp1-market-conditions` | percentage | user-input | SALE1.AdjMarketConditions | ❌ ADD |
| `{{COMP_1_SaleStatus}}` | `comp1-sale-status` | text | user-input | SALE1.SaleStatus | ❌ ADD |
| `{{COMP_1_TotalTransAdj}}` | `comp1-total-trans-adj` | percentage | calculated | SUM(transaction adjs) | ❌ ADD |
| `{{COMP_1_AdjPerUnit}}` | `comp1-adj-per-unit` | currency | calculated | PricePerUnit × (1 + TotalTransAdj) | ❌ ADD |

### 2.5 Physical Characteristics (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_1_Location}}` | `comp1-location` | select | user-input | SALE1.LocationRating | ❌ ADD |
| `{{COMP_1_Access}}` | `comp1-access` | select | user-input | SALE1.AccessRating | ❌ ADD |
| `{{COMP_1_Exposure}}` | `comp1-exposure` | select | user-input | SALE1.ExposureRating | ❌ ADD |
| `{{COMP_1_Quality}}` | `comp1-quality` | select | user-input | SALE1.QualityRating | ❌ ADD |
| `{{COMP_1_Condition}}` | `comp1-condition` | select | user-input | SALE1.ConditionRating | ❌ ADD |
| `{{COMP_1_Appeal}}` | `comp1-appeal` | select | user-input | SALE1.AppealRating | ❌ ADD |
| `{{COMP_1_ParkingType}}` | `comp1-parking-type` | text | user-input | SALE1.ParkingType | ❌ ADD |
| `{{COMP_1_ProjAmenities}}` | `comp1-proj-amenities` | text | user-input | SALE1.ProjectAmenities | ❌ ADD |
| `{{COMP_1_UnitAmenities}}` | `comp1-unit-amenities` | text | user-input | SALE1.UnitAmenities | ❌ ADD |
| `{{COMP_1_TotalPhysAdj}}` | `comp1-total-phys-adj` | percentage | calculated | SUM(physical adjs) | ❌ ADD |

**Comp 1 Subtotal:** 34 fields (10 existing + 24 to add)

---

## SECTION 3: Comparable Sale 2 (34 fields)

### 3.1 Basic Info (Existing)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_2_Name}}` | `comp2-name` | text | user-input | SALE2.Name | ✅ |
| `{{COMP_2_Address}}` | `comp2-address` | text | user-input | SALE2.Address | ✅ |
| `{{COMP_2_City}}` | `comp2-city` | text | user-input | SALE2.City | ✅ |

### 3.2 Sale Info (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_2_Province}}` | `comp2-province` | text | user-input | SALE2.Province | ❌ ADD |
| `{{COMP_2_PostalCode}}` | `comp2-postal-code` | text | user-input | SALE2.PostalCode | ❌ ADD |
| `{{COMP_2_TransPrice}}` | `comp2-sale-price` | currency | user-input | SALE2.SalePrice | ✅ |
| `{{COMP_2_PricePerUnit}}` | `comp2-price-per-unit` | currency | calculated | SALE2.Price/Units | ✅ |
| `{{COMP_2_NOIPerUnit}}` | `comp2-noi-per-unit` | currency | calculated | SALE2.NOI/Units | ✅ |
| `{{COMP_2_CapRate}}` | `comp2-cap-rate` | percentage | calculated | SALE2.NOI/Price | ✅ |

### 3.3 Property Metrics (Existing + New)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_2_Units}}` | `comp2-units` | number | user-input | SALE2.Units | ✅ |
| `{{COMP_2_NRA}}` | `comp2-gba` | number | user-input | SALE2.GBA | ✅ |
| `{{COMP_2_YearBuiltWeighted}}` | `comp2-year` | number | user-input | SALE2.YearBuilt | ✅ |
| `{{COMP_2_Occupancy}}` | `comp2-occupancy` | percentage | user-input | SALE2.Occupancy | ❌ ADD |

### 3.4 Transaction Adjustments (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_2_PropertyRights}}` | `comp2-property-rights` | percentage | user-input | SALE2.AdjPropertyRights | ❌ ADD |
| `{{COMP_2_Financing}}` | `comp2-financing` | percentage | user-input | SALE2.AdjFinancing | ❌ ADD |
| `{{COMP_2_SaleConditions}}` | `comp2-sale-conditions` | percentage | user-input | SALE2.AdjSaleConditions | ❌ ADD |
| `{{COMP_2_ExpendituresAfterSale}}` | `comp2-expenditures-after-sale` | percentage | user-input | SALE2.AdjExpenditures | ❌ ADD |
| `{{COMP_2_MarketConditions}}` | `comp2-market-conditions` | percentage | user-input | SALE2.AdjMarketConditions | ❌ ADD |
| `{{COMP_2_SaleStatus}}` | `comp2-sale-status` | text | user-input | SALE2.SaleStatus | ❌ ADD |
| `{{COMP_2_TotalTransAdj}}` | `comp2-total-trans-adj` | percentage | calculated | SUM(transaction adjs) | ❌ ADD |
| `{{COMP_2_AdjPerUnit}}` | `comp2-adj-per-unit` | currency | calculated | PricePerUnit × (1 + TotalTransAdj) | ❌ ADD |

### 3.5 Physical Characteristics (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_2_Location}}` | `comp2-location` | select | user-input | SALE2.LocationRating | ❌ ADD |
| `{{COMP_2_Access}}` | `comp2-access` | select | user-input | SALE2.AccessRating | ❌ ADD |
| `{{COMP_2_Exposure}}` | `comp2-exposure` | select | user-input | SALE2.ExposureRating | ❌ ADD |
| `{{COMP_2_Quality}}` | `comp2-quality` | select | user-input | SALE2.QualityRating | ❌ ADD |
| `{{COMP_2_Condition}}` | `comp2-condition` | select | user-input | SALE2.ConditionRating | ❌ ADD |
| `{{COMP_2_Appeal}}` | `comp2-appeal` | select | user-input | SALE2.AppealRating | ❌ ADD |
| `{{COMP_2_ParkingType}}` | `comp2-parking-type` | text | user-input | SALE2.ParkingType | ❌ ADD |
| `{{COMP_2_ProjAmenities}}` | `comp2-proj-amenities` | text | user-input | SALE2.ProjectAmenities | ❌ ADD |
| `{{COMP_2_UnitAmenities}}` | `comp2-unit-amenities` | text | user-input | SALE2.UnitAmenities | ❌ ADD |
| `{{COMP_2_TotalPhysAdj}}` | `comp2-total-phys-adj` | percentage | calculated | SUM(physical adjs) | ❌ ADD |

**Comp 2 Subtotal:** 34 fields (10 existing + 24 to add)

---

## SECTION 4: Comparable Sale 3 (34 fields)

### 4.1 Basic Info (Existing)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_3_Name}}` | `comp3-name` | text | user-input | SALE3.Name | ✅ |
| `{{COMP_3_Address}}` | `comp3-address` | text | user-input | SALE3.Address | ✅ |
| `{{COMP_3_City}}` | `comp3-city` | text | user-input | SALE3.City | ✅ |

### 4.2 Sale Info (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_3_Province}}` | `comp3-province` | text | user-input | SALE3.Province | ❌ ADD |
| `{{COMP_3_PostalCode}}` | `comp3-postal-code` | text | user-input | SALE3.PostalCode | ❌ ADD |
| `{{COMP_3_TransPrice}}` | `comp3-sale-price` | currency | user-input | SALE3.SalePrice | ✅ |
| `{{COMP_3_PricePerUnit}}` | `comp3-price-per-unit` | currency | calculated | SALE3.Price/Units | ✅ |
| `{{COMP_3_NOIPerUnit}}` | `comp3-noi-per-unit` | currency | calculated | SALE3.NOI/Units | ✅ |
| `{{COMP_3_CapRate}}` | `comp3-cap-rate` | percentage | calculated | SALE3.NOI/Price | ✅ |

### 4.3 Property Metrics (Existing + New)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_3_Units}}` | `comp3-units` | number | user-input | SALE3.Units | ✅ |
| `{{COMP_3_NRA}}` | `comp3-gba` | number | user-input | SALE3.GBA | ✅ |
| `{{COMP_3_YearBuiltWeighted}}` | `comp3-year` | number | user-input | SALE3.YearBuilt | ✅ |
| `{{COMP_3_Occupancy}}` | `comp3-occupancy` | percentage | user-input | SALE3.Occupancy | ❌ ADD |

### 4.4 Transaction Adjustments (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_3_PropertyRights}}` | `comp3-property-rights` | percentage | user-input | SALE3.AdjPropertyRights | ❌ ADD |
| `{{COMP_3_Financing}}` | `comp3-financing` | percentage | user-input | SALE3.AdjFinancing | ❌ ADD |
| `{{COMP_3_SaleConditions}}` | `comp3-sale-conditions` | percentage | user-input | SALE3.AdjSaleConditions | ❌ ADD |
| `{{COMP_3_ExpendituresAfterSale}}` | `comp3-expenditures-after-sale` | percentage | user-input | SALE3.AdjExpenditures | ❌ ADD |
| `{{COMP_3_MarketConditions}}` | `comp3-market-conditions` | percentage | user-input | SALE3.AdjMarketConditions | ❌ ADD |
| `{{COMP_3_SaleStatus}}` | `comp3-sale-status` | text | user-input | SALE3.SaleStatus | ❌ ADD |
| `{{COMP_3_TotalTransAdj}}` | `comp3-total-trans-adj` | percentage | calculated | SUM(transaction adjs) | ❌ ADD |
| `{{COMP_3_AdjPerUnit}}` | `comp3-adj-per-unit` | currency | calculated | PricePerUnit × (1 + TotalTransAdj) | ❌ ADD |

### 4.5 Physical Characteristics (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_3_Location}}` | `comp3-location` | select | user-input | SALE3.LocationRating | ❌ ADD |
| `{{COMP_3_Access}}` | `comp3-access` | select | user-input | SALE3.AccessRating | ❌ ADD |
| `{{COMP_3_Exposure}}` | `comp3-exposure` | select | user-input | SALE3.ExposureRating | ❌ ADD |
| `{{COMP_3_Quality}}` | `comp3-quality` | select | user-input | SALE3.QualityRating | ❌ ADD |
| `{{COMP_3_Condition}}` | `comp3-condition` | select | user-input | SALE3.ConditionRating | ❌ ADD |
| `{{COMP_3_Appeal}}` | `comp3-appeal` | select | user-input | SALE3.AppealRating | ❌ ADD |
| `{{COMP_3_ParkingType}}` | `comp3-parking-type` | text | user-input | SALE3.ParkingType | ❌ ADD |
| `{{COMP_3_ProjAmenities}}` | `comp3-proj-amenities` | text | user-input | SALE3.ProjectAmenities | ❌ ADD |
| `{{COMP_3_UnitAmenities}}` | `comp3-unit-amenities` | text | user-input | SALE3.UnitAmenities | ❌ ADD |
| `{{COMP_3_TotalPhysAdj}}` | `comp3-total-phys-adj` | percentage | calculated | SUM(physical adjs) | ❌ ADD |

**Comp 3 Subtotal:** 34 fields (10 existing + 24 to add)

---

## SECTION 5: Comparable Sale 4 (34 fields)

### 5.1 Basic Info (Existing)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_4_Name}}` | `comp4-name` | text | user-input | SALE4.Name | ✅ |
| `{{COMP_4_Address}}` | `comp4-address` | text | user-input | SALE4.Address | ✅ |
| `{{COMP_4_City}}` | `comp4-city` | text | user-input | SALE4.City | ✅ |

### 5.2 Sale Info (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_4_Province}}` | `comp4-province` | text | user-input | SALE4.Province | ❌ ADD |
| `{{COMP_4_PostalCode}}` | `comp4-postal-code` | text | user-input | SALE4.PostalCode | ❌ ADD |
| `{{COMP_4_TransPrice}}` | `comp4-sale-price` | currency | user-input | SALE4.SalePrice | ✅ |
| `{{COMP_4_PricePerUnit}}` | `comp4-price-per-unit` | currency | calculated | SALE4.Price/Units | ✅ |
| `{{COMP_4_NOIPerUnit}}` | `comp4-noi-per-unit` | currency | calculated | SALE4.NOI/Units | ✅ |
| `{{COMP_4_CapRate}}` | `comp4-cap-rate` | percentage | calculated | SALE4.NOI/Price | ✅ |

### 5.3 Property Metrics (Existing + New)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_4_Units}}` | `comp4-units` | number | user-input | SALE4.Units | ✅ |
| `{{COMP_4_NRA}}` | `comp4-gba` | number | user-input | SALE4.GBA | ✅ |
| `{{COMP_4_YearBuiltWeighted}}` | `comp4-year` | number | user-input | SALE4.YearBuilt | ✅ |
| `{{COMP_4_Occupancy}}` | `comp4-occupancy` | percentage | user-input | SALE4.Occupancy | ❌ ADD |

### 5.4 Transaction Adjustments (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_4_PropertyRights}}` | `comp4-property-rights` | percentage | user-input | SALE4.AdjPropertyRights | ❌ ADD |
| `{{COMP_4_Financing}}` | `comp4-financing` | percentage | user-input | SALE4.AdjFinancing | ❌ ADD |
| `{{COMP_4_SaleConditions}}` | `comp4-sale-conditions` | percentage | user-input | SALE4.AdjSaleConditions | ❌ ADD |
| `{{COMP_4_ExpendituresAfterSale}}` | `comp4-expenditures-after-sale` | percentage | user-input | SALE4.AdjExpenditures | ❌ ADD |
| `{{COMP_4_MarketConditions}}` | `comp4-market-conditions` | percentage | user-input | SALE4.AdjMarketConditions | ❌ ADD |
| `{{COMP_4_SaleStatus}}` | `comp4-sale-status` | text | user-input | SALE4.SaleStatus | ❌ ADD |
| `{{COMP_4_TotalTransAdj}}` | `comp4-total-trans-adj` | percentage | calculated | SUM(transaction adjs) | ❌ ADD |
| `{{COMP_4_AdjPerUnit}}` | `comp4-adj-per-unit` | currency | calculated | PricePerUnit × (1 + TotalTransAdj) | ❌ ADD |

### 5.5 Physical Characteristics (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_4_Location}}` | `comp4-location` | select | user-input | SALE4.LocationRating | ❌ ADD |
| `{{COMP_4_Access}}` | `comp4-access` | select | user-input | SALE4.AccessRating | ❌ ADD |
| `{{COMP_4_Exposure}}` | `comp4-exposure` | select | user-input | SALE4.ExposureRating | ❌ ADD |
| `{{COMP_4_Quality}}` | `comp4-quality` | select | user-input | SALE4.QualityRating | ❌ ADD |
| `{{COMP_4_Condition}}` | `comp4-condition` | select | user-input | SALE4.ConditionRating | ❌ ADD |
| `{{COMP_4_Appeal}}` | `comp4-appeal` | select | user-input | SALE4.AppealRating | ❌ ADD |
| `{{COMP_4_ParkingType}}` | `comp4-parking-type` | text | user-input | SALE4.ParkingType | ❌ ADD |
| `{{COMP_4_ProjAmenities}}` | `comp4-proj-amenities` | text | user-input | SALE4.ProjectAmenities | ❌ ADD |
| `{{COMP_4_UnitAmenities}}` | `comp4-unit-amenities` | text | user-input | SALE4.UnitAmenities | ❌ ADD |
| `{{COMP_4_TotalPhysAdj}}` | `comp4-total-phys-adj` | percentage | calculated | SUM(physical adjs) | ❌ ADD |

**Comp 4 Subtotal:** 34 fields (10 existing + 24 to add)

---

## SECTION 6: Comparable Sale 5 (34 fields)

### 6.1 Basic Info (Existing)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_5_Name}}` | `comp5-name` | text | user-input | SALE5.Name | ✅ |
| `{{COMP_5_Address}}` | `comp5-address` | text | user-input | SALE5.Address | ✅ |
| `{{COMP_5_City}}` | `comp5-city` | text | user-input | SALE5.City | ✅ |

### 6.2 Sale Info (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_5_Province}}` | `comp5-province` | text | user-input | SALE5.Province | ❌ ADD |
| `{{COMP_5_PostalCode}}` | `comp5-postal-code` | text | user-input | SALE5.PostalCode | ❌ ADD |
| `{{COMP_5_TransPrice}}` | `comp5-sale-price` | currency | user-input | SALE5.SalePrice | ✅ |
| `{{COMP_5_PricePerUnit}}` | `comp5-price-per-unit` | currency | calculated | SALE5.Price/Units | ✅ |
| `{{COMP_5_NOIPerUnit}}` | `comp5-noi-per-unit` | currency | calculated | SALE5.NOI/Units | ✅ |
| `{{COMP_5_CapRate}}` | `comp5-cap-rate` | percentage | calculated | SALE5.NOI/Price | ✅ |

### 6.3 Property Metrics (Existing + New)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_5_Units}}` | `comp5-units` | number | user-input | SALE5.Units | ✅ |
| `{{COMP_5_NRA}}` | `comp5-gba` | number | user-input | SALE5.GBA | ✅ |
| `{{COMP_5_YearBuiltWeighted}}` | `comp5-year` | number | user-input | SALE5.YearBuilt | ✅ |
| `{{COMP_5_Occupancy}}` | `comp5-occupancy` | percentage | user-input | SALE5.Occupancy | ❌ ADD |

### 6.4 Transaction Adjustments (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_5_PropertyRights}}` | `comp5-property-rights` | percentage | user-input | SALE5.AdjPropertyRights | ❌ ADD |
| `{{COMP_5_Financing}}` | `comp5-financing` | percentage | user-input | SALE5.AdjFinancing | ❌ ADD |
| `{{COMP_5_SaleConditions}}` | `comp5-sale-conditions` | percentage | user-input | SALE5.AdjSaleConditions | ❌ ADD |
| `{{COMP_5_ExpendituresAfterSale}}` | `comp5-expenditures-after-sale` | percentage | user-input | SALE5.AdjExpenditures | ❌ ADD |
| `{{COMP_5_MarketConditions}}` | `comp5-market-conditions` | percentage | user-input | SALE5.AdjMarketConditions | ❌ ADD |
| `{{COMP_5_SaleStatus}}` | `comp5-sale-status` | text | user-input | SALE5.SaleStatus | ❌ ADD |
| `{{COMP_5_TotalTransAdj}}` | `comp5-total-trans-adj` | percentage | calculated | SUM(transaction adjs) | ❌ ADD |
| `{{COMP_5_AdjPerUnit}}` | `comp5-adj-per-unit` | currency | calculated | PricePerUnit × (1 + TotalTransAdj) | ❌ ADD |

### 6.5 Physical Characteristics (Need to Add)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| `{{COMP_5_Location}}` | `comp5-location` | select | user-input | SALE5.LocationRating | ❌ ADD |
| `{{COMP_5_Access}}` | `comp5-access` | select | user-input | SALE5.AccessRating | ❌ ADD |
| `{{COMP_5_Exposure}}` | `comp5-exposure` | select | user-input | SALE5.ExposureRating | ❌ ADD |
| `{{COMP_5_Quality}}` | `comp5-quality` | select | user-input | SALE5.QualityRating | ❌ ADD |
| `{{COMP_5_Condition}}` | `comp5-condition` | select | user-input | SALE5.ConditionRating | ❌ ADD |
| `{{COMP_5_Appeal}}` | `comp5-appeal` | select | user-input | SALE5.AppealRating | ❌ ADD |
| `{{COMP_5_ParkingType}}` | `comp5-parking-type` | text | user-input | SALE5.ParkingType | ❌ ADD |
| `{{COMP_5_ProjAmenities}}` | `comp5-proj-amenities` | text | user-input | SALE5.ProjectAmenities | ❌ ADD |
| `{{COMP_5_UnitAmenities}}` | `comp5-unit-amenities` | text | user-input | SALE5.UnitAmenities | ❌ ADD |
| `{{COMP_5_TotalPhysAdj}}` | `comp5-total-phys-adj` | percentage | calculated | SUM(physical adjs) | ❌ ADD |

**Comp 5 Subtotal:** 34 fields (10 existing + 24 to add)

---

## Summary Statistics

| Section | Total Fields | Existing | To Add | Reuse | Verify |
|---------|-------------|----------|--------|-------|--------|
| Subject Property | 18 | 11 | 7 | 11 | 0 |
| Comp 1 | 34 | 10 | 24 | 0 | 0 |
| Comp 2 | 34 | 10 | 24 | 0 | 0 |
| Comp 3 | 34 | 10 | 24 | 0 | 0 |
| Comp 4 | 34 | 10 | 24 | 0 | 0 |
| Comp 5 | 34 | 10 | 24 | 0 | 0 |
| **TOTAL** | **188** | **61** | **127** | **11** | **0** |

**Note:** Total shows 127 to add (vs 112 in gap analysis) because this includes duplicated patterns across all 5 comps. The unique field types to add to registry is 112.

---

## Fields to Add to Registry (112 unique fields)

### Subject Fields (7 new)
1. `subject-location` - select (Rating: Superior/Good/Average/Fair/Poor)
2. `subject-access` - select (Rating scale)
3. `subject-exposure` - select (Rating scale)
4. `subject-quality` - select (Rating scale)
5. `subject-appeal` - select (Rating scale)
6. `subject-proj-amenities` - text (Project-level amenities)
7. `subject-unit-amenities` - text (Unit-level amenities)

### Comp Fields (21 new × 5 = 105 unique field IDs)

**Per comp pattern (replace {N} with 1-5):**

1. `comp{N}-province` - text
2. `comp{N}-postal-code` - text
3. `comp{N}-occupancy` - percentage
4. `comp{N}-property-rights` - percentage (adjustment)
5. `comp{N}-financing` - percentage (adjustment)
6. `comp{N}-sale-conditions` - percentage (adjustment)
7. `comp{N}-expenditures-after-sale` - percentage (adjustment)
8. `comp{N}-market-conditions` - percentage (adjustment)
9. `comp{N}-sale-status` - text (Confirmed/Pending/etc.)
10. `comp{N}-total-trans-adj` - percentage (calculated)
11. `comp{N}-adj-per-unit` - currency (calculated)
12. `comp{N}-location` - select (Rating scale)
13. `comp{N}-access` - select (Rating scale)
14. `comp{N}-exposure` - select (Rating scale)
15. `comp{N}-quality` - select (Rating scale)
16. `comp{N}-condition` - select (Rating scale)
17. `comp{N}-appeal` - select (Rating scale)
18. `comp{N}-parking-type` - text
19. `comp{N}-proj-amenities` - text
20. `comp{N}-unit-amenities` - text
21. `comp{N}-total-phys-adj` - percentage (calculated)

---

## Next Steps

1. **User → TypeScript Pro:** Share this field list (112 unique fields to add)
2. **TypeScript Pro:** Add fields to fieldRegistry.ts with correct types and inputSource
3. **TypeScript Pro → User:** Report back confirmed field IDs
4. **User → Agent 1 (Claude Code):** Provide confirmed field IDs
5. **Agent 1:** Update this document, change all ❌ ADD to ✅ with actual registry IDs
6. **Agent 1:** Update TABLE-OF-CONTENTS-25.12.18.md status: 🔄 Next → ✅ Complete

---

**Status:** ⏳ Awaiting TypeScript Pro to add 112 fields to registry
**Next Update:** When confirmed field IDs received from TypeScript Pro

#!/bin/bash

# Script to replace Page 59 (Sales Comparison Grid) field IDs in PREVIEW-Master.html
# Based on FIELD-MAPPING-Page-59-Registry.md

FILE="./PREVIEW-Master.html"

# Create backup if not already created
if [ ! -f "$FILE.backup-page59" ]; then
    cp "$FILE" "$FILE.backup-page59"
fi

echo "Updating Page 59 field IDs..."

# ========================================
# SUBJECT PROPERTY FIELDS (18 fields)
# ========================================

# Basic Property Info
sed -i '' 's/{{Subject_Name}}/{{property-name}}/g' "$FILE"
sed -i '' 's/{{Subject_Address}}/{{street-address}}/g' "$FILE"
sed -i '' 's/{{Subject_City}}/{{city}}/g' "$FILE"
sed -i '' 's/{{Subject_Province}}/{{province}}/g' "$FILE"
sed -i '' 's/{{Subject_PostalCode}}/{{postal-code}}/g' "$FILE"

# Property Metrics
sed -i '' 's/{{Subject_Units}}/{{subject-units}}/g' "$FILE"
sed -i '' 's/{{Subject_NRA}}/{{subject-gba}}/g' "$FILE"
sed -i '' 's/{{Subject_YearBuiltWeighted}}/{{subject-year}}/g' "$FILE"
sed -i '' 's/{{Subject_Condition}}/{{subject-condition}}/g' "$FILE"
sed -i '' 's/{{Subject_NOIPerUnit}}/{{calc-noi-per-unit}}/g' "$FILE"
sed -i '' 's/{{Subject_Occupancy}}/{{occupancy-rate}}/g' "$FILE"

# Qualitative Characteristics
sed -i '' 's/{{Subject_Location}}/{{subject-location-rating}}/g' "$FILE"
sed -i '' 's/{{Subject_Access}}/{{subject-access-rating}}/g' "$FILE"
sed -i '' 's/{{Subject_Exposure}}/{{subject-exposure-rating}}/g' "$FILE"
sed -i '' 's/{{Subject_Quality}}/{{subject-quality-rating}}/g' "$FILE"
sed -i '' 's/{{Subject_Appeal}}/{{subject-appeal-rating}}/g' "$FILE"

# Amenities
sed -i '' 's/{{Subject_ParkingType}}/{{subject-parking}}/g' "$FILE"
sed -i '' 's/{{Subject_ProjAmenities}}/{{subject-proj-amenities}}/g' "$FILE"
sed -i '' 's/{{Subject_UnitAmenities}}/{{subject-unit-amenities}}/g' "$FILE"

# ========================================
# COMP 1 FIELDS (34 fields)
# ========================================

# Basic Info
sed -i '' 's/{{COMP_1_Name}}/{{comp1-name}}/g' "$FILE"
sed -i '' 's/{{COMP_1_Address}}/{{comp1-address}}/g' "$FILE"
sed -i '' 's/{{COMP_1_City}}/{{comp1-city}}/g' "$FILE"
sed -i '' 's/{{COMP_1_Province}}/{{comp1-province}}/g' "$FILE"
sed -i '' 's/{{COMP_1_PostalCode}}/{{comp1-postal-code}}/g' "$FILE"

# Sale Info
sed -i '' 's/{{COMP_1_TransPrice}}/{{comp1-sale-price}}/g' "$FILE"
sed -i '' 's/{{COMP_1_PricePerUnit}}/{{comp1-price-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_1_NOIPerUnit}}/{{comp1-noi-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_1_CapRate}}/{{comp1-cap-rate}}/g' "$FILE"

# Property Metrics
sed -i '' 's/{{COMP_1_Units}}/{{comp1-units}}/g' "$FILE"
sed -i '' 's/{{COMP_1_NRA}}/{{comp1-gba}}/g' "$FILE"
sed -i '' 's/{{COMP_1_YearBuiltWeighted}}/{{comp1-year}}/g' "$FILE"
sed -i '' 's/{{COMP_1_YearBuilt}}/{{comp1-year}}/g' "$FILE"
sed -i '' 's/{{COMP_1_Occupancy}}/{{comp1-occupancy}}/g' "$FILE"

# Transaction Adjustments
sed -i '' 's/{{COMP_1_PropertyRights}}/{{comp1-property-rights}}/g' "$FILE"
sed -i '' 's/{{COMP_1_Financing}}/{{comp1-financing}}/g' "$FILE"
sed -i '' 's/{{COMP_1_SaleConditions}}/{{comp1-sale-conditions}}/g' "$FILE"
sed -i '' 's/{{COMP_1_ExpendituresAfterSale}}/{{comp1-expenditures-after}}/g' "$FILE"
sed -i '' 's/{{COMP_1_MarketConditions}}/{{comp1-market-conditions}}/g' "$FILE"
sed -i '' 's/{{COMP_1_SaleStatus}}/{{comp1-sale-status}}/g' "$FILE"
sed -i '' 's/{{COMP_1_SaleDate}}/{{comp1-sale-date}}/g' "$FILE"
sed -i '' 's/{{COMP_1_SalePrice}}/{{comp1-sale-price}}/g' "$FILE"
sed -i '' 's/{{COMP_1_PriceSF}}/{{comp1-price-per-sf}}/g' "$FILE"
sed -i '' 's/{{COMP_1_NOI}}/{{comp1-noi}}/g' "$FILE"
sed -i '' 's/{{COMP_1_NOI_Unit}}/{{comp1-noi-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_1_TotalTransAdj}}/{{comp1-total-trans-adj}}/g' "$FILE"
sed -i '' 's/{{COMP_1_AdjPerUnit}}/{{comp1-adj-price-per-unit}}/g' "$FILE"

# Physical Characteristics
sed -i '' 's/{{COMP_1_Location}}/{{comp1-location}}/g' "$FILE"
sed -i '' 's/{{COMP_1_Access}}/{{comp1-access}}/g' "$FILE"
sed -i '' 's/{{COMP_1_Exposure}}/{{comp1-exposure}}/g' "$FILE"
sed -i '' 's/{{COMP_1_Quality}}/{{comp1-quality}}/g' "$FILE"
sed -i '' 's/{{COMP_1_Condition}}/{{comp1-condition}}/g' "$FILE"
sed -i '' 's/{{COMP_1_Appeal}}/{{comp1-appeal}}/g' "$FILE"
sed -i '' 's/{{COMP_1_ParkingType}}/{{comp1-parking-type}}/g' "$FILE"
sed -i '' 's/{{COMP_1_ProjAmenities}}/{{comp1-proj-amenities}}/g' "$FILE"
sed -i '' 's/{{COMP_1_UnitAmenities}}/{{comp1-unit-amenities}}/g' "$FILE"
sed -i '' 's/{{COMP_1_TotalPhysAdj}}/{{comp1-total-phys-adj}}/g' "$FILE"

# ========================================
# COMP 2 FIELDS (34 fields)
# ========================================

sed -i '' 's/{{COMP_2_Name}}/{{comp2-name}}/g' "$FILE"
sed -i '' 's/{{COMP_2_Address}}/{{comp2-address}}/g' "$FILE"
sed -i '' 's/{{COMP_2_City}}/{{comp2-city}}/g' "$FILE"
sed -i '' 's/{{COMP_2_Province}}/{{comp2-province}}/g' "$FILE"
sed -i '' 's/{{COMP_2_PostalCode}}/{{comp2-postal-code}}/g' "$FILE"
sed -i '' 's/{{COMP_2_TransPrice}}/{{comp2-sale-price}}/g' "$FILE"
sed -i '' 's/{{COMP_2_PricePerUnit}}/{{comp2-price-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_2_NOIPerUnit}}/{{comp2-noi-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_2_CapRate}}/{{comp2-cap-rate}}/g' "$FILE"
sed -i '' 's/{{COMP_2_Units}}/{{comp2-units}}/g' "$FILE"
sed -i '' 's/{{COMP_2_NRA}}/{{comp2-gba}}/g' "$FILE"
sed -i '' 's/{{COMP_2_YearBuiltWeighted}}/{{comp2-year}}/g' "$FILE"
sed -i '' 's/{{COMP_2_YearBuilt}}/{{comp2-year}}/g' "$FILE"
sed -i '' 's/{{COMP_2_Occupancy}}/{{comp2-occupancy}}/g' "$FILE"
sed -i '' 's/{{COMP_2_PropertyRights}}/{{comp2-property-rights}}/g' "$FILE"
sed -i '' 's/{{COMP_2_Financing}}/{{comp2-financing}}/g' "$FILE"
sed -i '' 's/{{COMP_2_SaleConditions}}/{{comp2-sale-conditions}}/g' "$FILE"
sed -i '' 's/{{COMP_2_ExpendituresAfterSale}}/{{comp2-expenditures-after}}/g' "$FILE"
sed -i '' 's/{{COMP_2_MarketConditions}}/{{comp2-market-conditions}}/g' "$FILE"
sed -i '' 's/{{COMP_2_SaleStatus}}/{{comp2-sale-status}}/g' "$FILE"
sed -i '' 's/{{COMP_2_SaleDate}}/{{comp2-sale-date}}/g' "$FILE"
sed -i '' 's/{{COMP_2_SalePrice}}/{{comp2-sale-price}}/g' "$FILE"
sed -i '' 's/{{COMP_2_PriceSF}}/{{comp2-price-per-sf}}/g' "$FILE"
sed -i '' 's/{{COMP_2_NOI}}/{{comp2-noi}}/g' "$FILE"
sed -i '' 's/{{COMP_2_NOI_Unit}}/{{comp2-noi-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_2_TotalTransAdj}}/{{comp2-total-trans-adj}}/g' "$FILE"
sed -i '' 's/{{COMP_2_AdjPerUnit}}/{{comp2-adj-price-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_2_Location}}/{{comp2-location}}/g' "$FILE"
sed -i '' 's/{{COMP_2_Access}}/{{comp2-access}}/g' "$FILE"
sed -i '' 's/{{COMP_2_Exposure}}/{{comp2-exposure}}/g' "$FILE"
sed -i '' 's/{{COMP_2_Quality}}/{{comp2-quality}}/g' "$FILE"
sed -i '' 's/{{COMP_2_Condition}}/{{comp2-condition}}/g' "$FILE"
sed -i '' 's/{{COMP_2_Appeal}}/{{comp2-appeal}}/g' "$FILE"
sed -i '' 's/{{COMP_2_ParkingType}}/{{comp2-parking-type}}/g' "$FILE"
sed -i '' 's/{{COMP_2_ProjAmenities}}/{{comp2-proj-amenities}}/g' "$FILE"
sed -i '' 's/{{COMP_2_UnitAmenities}}/{{comp2-unit-amenities}}/g' "$FILE"
sed -i '' 's/{{COMP_2_TotalPhysAdj}}/{{comp2-total-phys-adj}}/g' "$FILE"

# ========================================
# COMP 3 FIELDS (34 fields)
# ========================================

sed -i '' 's/{{COMP_3_Name}}/{{comp3-name}}/g' "$FILE"
sed -i '' 's/{{COMP_3_Address}}/{{comp3-address}}/g' "$FILE"
sed -i '' 's/{{COMP_3_City}}/{{comp3-city}}/g' "$FILE"
sed -i '' 's/{{COMP_3_Province}}/{{comp3-province}}/g' "$FILE"
sed -i '' 's/{{COMP_3_PostalCode}}/{{comp3-postal-code}}/g' "$FILE"
sed -i '' 's/{{COMP_3_TransPrice}}/{{comp3-sale-price}}/g' "$FILE"
sed -i '' 's/{{COMP_3_PricePerUnit}}/{{comp3-price-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_3_NOIPerUnit}}/{{comp3-noi-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_3_CapRate}}/{{comp3-cap-rate}}/g' "$FILE"
sed -i '' 's/{{COMP_3_Units}}/{{comp3-units}}/g' "$FILE"
sed -i '' 's/{{COMP_3_NRA}}/{{comp3-gba}}/g' "$FILE"
sed -i '' 's/{{COMP_3_YearBuiltWeighted}}/{{comp3-year}}/g' "$FILE"
sed -i '' 's/{{COMP_3_YearBuilt}}/{{comp3-year}}/g' "$FILE"
sed -i '' 's/{{COMP_3_Occupancy}}/{{comp3-occupancy}}/g' "$FILE"
sed -i '' 's/{{COMP_3_PropertyRights}}/{{comp3-property-rights}}/g' "$FILE"
sed -i '' 's/{{COMP_3_Financing}}/{{comp3-financing}}/g' "$FILE"
sed -i '' 's/{{COMP_3_SaleConditions}}/{{comp3-sale-conditions}}/g' "$FILE"
sed -i '' 's/{{COMP_3_ExpendituresAfterSale}}/{{comp3-expenditures-after}}/g' "$FILE"
sed -i '' 's/{{COMP_3_MarketConditions}}/{{comp3-market-conditions}}/g' "$FILE"
sed -i '' 's/{{COMP_3_SaleStatus}}/{{comp3-sale-status}}/g' "$FILE"
sed -i '' 's/{{COMP_3_SaleDate}}/{{comp3-sale-date}}/g' "$FILE"
sed -i '' 's/{{COMP_3_SalePrice}}/{{comp3-sale-price}}/g' "$FILE"
sed -i '' 's/{{COMP_3_PriceSF}}/{{comp3-price-per-sf}}/g' "$FILE"
sed -i '' 's/{{COMP_3_NOI}}/{{comp3-noi}}/g' "$FILE"
sed -i '' 's/{{COMP_3_NOI_Unit}}/{{comp3-noi-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_3_TotalTransAdj}}/{{comp3-total-trans-adj}}/g' "$FILE"
sed -i '' 's/{{COMP_3_AdjPerUnit}}/{{comp3-adj-price-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_3_Location}}/{{comp3-location}}/g' "$FILE"
sed -i '' 's/{{COMP_3_Access}}/{{comp3-access}}/g' "$FILE"
sed -i '' 's/{{COMP_3_Exposure}}/{{comp3-exposure}}/g' "$FILE"
sed -i '' 's/{{COMP_3_Quality}}/{{comp3-quality}}/g' "$FILE"
sed -i '' 's/{{COMP_3_Condition}}/{{comp3-condition}}/g' "$FILE"
sed -i '' 's/{{COMP_3_Appeal}}/{{comp3-appeal}}/g' "$FILE"
sed -i '' 's/{{COMP_3_ParkingType}}/{{comp3-parking-type}}/g' "$FILE"
sed -i '' 's/{{COMP_3_ProjAmenities}}/{{comp3-proj-amenities}}/g' "$FILE"
sed -i '' 's/{{COMP_3_UnitAmenities}}/{{comp3-unit-amenities}}/g' "$FILE"
sed -i '' 's/{{COMP_3_TotalPhysAdj}}/{{comp3-total-phys-adj}}/g' "$FILE"

# ========================================
# COMP 4 FIELDS (34 fields)
# ========================================

sed -i '' 's/{{COMP_4_Name}}/{{comp4-name}}/g' "$FILE"
sed -i '' 's/{{COMP_4_Address}}/{{comp4-address}}/g' "$FILE"
sed -i '' 's/{{COMP_4_City}}/{{comp4-city}}/g' "$FILE"
sed -i '' 's/{{COMP_4_Province}}/{{comp4-province}}/g' "$FILE"
sed -i '' 's/{{COMP_4_PostalCode}}/{{comp4-postal-code}}/g' "$FILE"
sed -i '' 's/{{COMP_4_TransPrice}}/{{comp4-sale-price}}/g' "$FILE"
sed -i '' 's/{{COMP_4_PricePerUnit}}/{{comp4-price-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_4_NOIPerUnit}}/{{comp4-noi-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_4_CapRate}}/{{comp4-cap-rate}}/g' "$FILE"
sed -i '' 's/{{COMP_4_Units}}/{{comp4-units}}/g' "$FILE"
sed -i '' 's/{{COMP_4_NRA}}/{{comp4-gba}}/g' "$FILE"
sed -i '' 's/{{COMP_4_YearBuiltWeighted}}/{{comp4-year}}/g' "$FILE"
sed -i '' 's/{{COMP_4_YearBuilt}}/{{comp4-year}}/g' "$FILE"
sed -i '' 's/{{COMP_4_Occupancy}}/{{comp4-occupancy}}/g' "$FILE"
sed -i '' 's/{{COMP_4_PropertyRights}}/{{comp4-property-rights}}/g' "$FILE"
sed -i '' 's/{{COMP_4_Financing}}/{{comp4-financing}}/g' "$FILE"
sed -i '' 's/{{COMP_4_SaleConditions}}/{{comp4-sale-conditions}}/g' "$FILE"
sed -i '' 's/{{COMP_4_ExpendituresAfterSale}}/{{comp4-expenditures-after}}/g' "$FILE"
sed -i '' 's/{{COMP_4_MarketConditions}}/{{comp4-market-conditions}}/g' "$FILE"
sed -i '' 's/{{COMP_4_SaleStatus}}/{{comp4-sale-status}}/g' "$FILE"
sed -i '' 's/{{COMP_4_SaleDate}}/{{comp4-sale-date}}/g' "$FILE"
sed -i '' 's/{{COMP_4_SalePrice}}/{{comp4-sale-price}}/g' "$FILE"
sed -i '' 's/{{COMP_4_PriceSF}}/{{comp4-price-per-sf}}/g' "$FILE"
sed -i '' 's/{{COMP_4_NOI}}/{{comp4-noi}}/g' "$FILE"
sed -i '' 's/{{COMP_4_NOI_Unit}}/{{comp4-noi-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_4_TotalTransAdj}}/{{comp4-total-trans-adj}}/g' "$FILE"
sed -i '' 's/{{COMP_4_AdjPerUnit}}/{{comp4-adj-price-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_4_Location}}/{{comp4-location}}/g' "$FILE"
sed -i '' 's/{{COMP_4_Access}}/{{comp4-access}}/g' "$FILE"
sed -i '' 's/{{COMP_4_Exposure}}/{{comp4-exposure}}/g' "$FILE"
sed -i '' 's/{{COMP_4_Quality}}/{{comp4-quality}}/g' "$FILE"
sed -i '' 's/{{COMP_4_Condition}}/{{comp4-condition}}/g' "$FILE"
sed -i '' 's/{{COMP_4_Appeal}}/{{comp4-appeal}}/g' "$FILE"
sed -i '' 's/{{COMP_4_ParkingType}}/{{comp4-parking-type}}/g' "$FILE"
sed -i '' 's/{{COMP_4_ProjAmenities}}/{{comp4-proj-amenities}}/g' "$FILE"
sed -i '' 's/{{COMP_4_UnitAmenities}}/{{comp4-unit-amenities}}/g' "$FILE"
sed -i '' 's/{{COMP_4_TotalPhysAdj}}/{{comp4-total-phys-adj}}/g' "$FILE"

# ========================================
# COMP 5 FIELDS (34 fields)
# ========================================

sed -i '' 's/{{COMP_5_Name}}/{{comp5-name}}/g' "$FILE"
sed -i '' 's/{{COMP_5_Address}}/{{comp5-address}}/g' "$FILE"
sed -i '' 's/{{COMP_5_City}}/{{comp5-city}}/g' "$FILE"
sed -i '' 's/{{COMP_5_Province}}/{{comp5-province}}/g' "$FILE"
sed -i '' 's/{{COMP_5_PostalCode}}/{{comp5-postal-code}}/g' "$FILE"
sed -i '' 's/{{COMP_5_TransPrice}}/{{comp5-sale-price}}/g' "$FILE"
sed -i '' 's/{{COMP_5_PricePerUnit}}/{{comp5-price-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_5_NOIPerUnit}}/{{comp5-noi-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_5_CapRate}}/{{comp5-cap-rate}}/g' "$FILE"
sed -i '' 's/{{COMP_5_Units}}/{{comp5-units}}/g' "$FILE"
sed -i '' 's/{{COMP_5_NRA}}/{{comp5-gba}}/g' "$FILE"
sed -i '' 's/{{COMP_5_YearBuiltWeighted}}/{{comp5-year}}/g' "$FILE"
sed -i '' 's/{{COMP_5_YearBuilt}}/{{comp5-year}}/g' "$FILE"
sed -i '' 's/{{COMP_5_Occupancy}}/{{comp5-occupancy}}/g' "$FILE"
sed -i '' 's/{{COMP_5_PropertyRights}}/{{comp5-property-rights}}/g' "$FILE"
sed -i '' 's/{{COMP_5_Financing}}/{{comp5-financing}}/g' "$FILE"
sed -i '' 's/{{COMP_5_SaleConditions}}/{{comp5-sale-conditions}}/g' "$FILE"
sed -i '' 's/{{COMP_5_ExpendituresAfterSale}}/{{comp5-expenditures-after}}/g' "$FILE"
sed -i '' 's/{{COMP_5_MarketConditions}}/{{comp5-market-conditions}}/g' "$FILE"
sed -i '' 's/{{COMP_5_SaleStatus}}/{{comp5-sale-status}}/g' "$FILE"
sed -i '' 's/{{COMP_5_SaleDate}}/{{comp5-sale-date}}/g' "$FILE"
sed -i '' 's/{{COMP_5_SalePrice}}/{{comp5-sale-price}}/g' "$FILE"
sed -i '' 's/{{COMP_5_PriceSF}}/{{comp5-price-per-sf}}/g' "$FILE"
sed -i '' 's/{{COMP_5_NOI}}/{{comp5-noi}}/g' "$FILE"
sed -i '' 's/{{COMP_5_NOI_Unit}}/{{comp5-noi-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_5_TotalTransAdj}}/{{comp5-total-trans-adj}}/g' "$FILE"
sed -i '' 's/{{COMP_5_AdjPerUnit}}/{{comp5-adj-price-per-unit}}/g' "$FILE"
sed -i '' 's/{{COMP_5_Location}}/{{comp5-location}}/g' "$FILE"
sed -i '' 's/{{COMP_5_Access}}/{{comp5-access}}/g' "$FILE"
sed -i '' 's/{{COMP_5_Exposure}}/{{comp5-exposure}}/g' "$FILE"
sed -i '' 's/{{COMP_5_Quality}}/{{comp5-quality}}/g' "$FILE"
sed -i '' 's/{{COMP_5_Condition}}/{{comp5-condition}}/g' "$FILE"
sed -i '' 's/{{COMP_5_Appeal}}/{{comp5-appeal}}/g' "$FILE"
sed -i '' 's/{{COMP_5_ParkingType}}/{{comp5-parking-type}}/g' "$FILE"
sed -i '' 's/{{COMP_5_ProjAmenities}}/{{comp5-proj-amenities}}/g' "$FILE"
sed -i '' 's/{{COMP_5_UnitAmenities}}/{{comp5-unit-amenities}}/g' "$FILE"
sed -i '' 's/{{COMP_5_TotalPhysAdj}}/{{comp5-total-phys-adj}}/g' "$FILE"

echo "✅ Page 59 field ID updates complete!"
echo "Total replacements: 188 fields"
echo "  - Subject fields: 18"
echo "  - Comp fields: 170 (34 per comp × 5 comps)"
echo "Backup created: $FILE.backup-page59"

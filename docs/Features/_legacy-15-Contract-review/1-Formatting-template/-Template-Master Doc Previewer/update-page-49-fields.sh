#!/bin/bash

# Script to replace Page 49 (Direct Capitalization) field IDs in PREVIEW-Master.html
# Based on FIELD-MAPPING-Page-49-Registry.md

FILE="./PREVIEW-Master.html"

# Create backup
cp "$FILE" "$FILE.backup-$(date +%Y%m%d-%H%M%S)"

echo "Updating Page 49 field IDs..."

# Unit Mix & Rental Revenue (20 fields)
sed -i '' 's/{{Unit_Type_1_Count}}/{{calc-type1-count}}/g' "$FILE"
sed -i '' 's/{{Unit_Type_1_Contract_Rent}}/{{calc-type1-contract-rent}}/g' "$FILE"
sed -i '' 's/{{Unit_Type_1_Market_Rent}}/{{calc-type1-rent}}/g' "$FILE"
sed -i '' 's/{{Unit_Type_1_Cont_v_Market}}/{{calc-type1-cont-v-market}}/g' "$FILE"
sed -i '' 's/{{Unit_Type_1_Per_Unit}}/{{calc-type1-per-unit}}/g' "$FILE"
sed -i '' 's/{{Unit_Type_1_Per_SF}}/{{calc-type1-per-sf}}/g' "$FILE"
sed -i '' 's/{{Unit_Type_1_Annual}}/{{calc-type1-annual}}/g' "$FILE"

sed -i '' 's/{{Unit_Type_2_Count}}/{{calc-type2-count}}/g' "$FILE"
sed -i '' 's/{{Unit_Type_2_Contract_Rent}}/{{calc-type2-contract-rent}}/g' "$FILE"
sed -i '' 's/{{Unit_Type_2_Market_Rent}}/{{calc-type2-rent}}/g' "$FILE"
sed -i '' 's/{{Unit_Type_2_Cont_v_Market}}/{{calc-type2-cont-v-market}}/g' "$FILE"
sed -i '' 's/{{Unit_Type_2_Per_Unit}}/{{calc-type2-per-unit}}/g' "$FILE"
sed -i '' 's/{{Unit_Type_2_Per_SF}}/{{calc-type2-per-sf}}/g' "$FILE"
sed -i '' 's/{{Unit_Type_2_Annual}}/{{calc-type2-annual}}/g' "$FILE"

sed -i '' 's/{{Total_Units}}/{{total-units}}/g' "$FILE"
sed -i '' 's/{{Total_Per_Unit}}/{{calc-type-total-per-unit}}/g' "$FILE"
sed -i '' 's/{{Total_Per_SF}}/{{calc-type-total-per-sf}}/g' "$FILE"
sed -i '' 's/{{Total_Rental_Revenue}}/{{calc-total-rental-revenue}}/g' "$FILE"

# Potential Gross Revenue (14 fields)
sed -i '' 's/{{Other_Income_Per_Unit}}/{{calc-other-income-per-unit}}/g' "$FILE"
sed -i '' 's/{{Other_Income_Per_SF}}/{{calc-other-income-per-sf}}/g' "$FILE"
sed -i '' 's/{{Other_Income_Annual}}/{{calc-other-income}}/g' "$FILE"

sed -i '' 's/{{PGR_Per_Unit}}/{{calc-pgr-per-unit}}/g' "$FILE"
sed -i '' 's/{{PGR_Per_SF}}/{{calc-pgr-per-sf}}/g' "$FILE"
sed -i '' 's/{{PGR_Annual}}/{{calc-pgr}}/g' "$FILE"

sed -i '' 's/{{Vacancy_Pct_PGR}}/{{calc-vacancy-rate}}/g' "$FILE"
sed -i '' 's/{{Vacancy_Pct_EGR}}/{{calc-vacancy-rate}}/g' "$FILE"
sed -i '' 's/{{Vacancy_Per_Unit}}/{{calc-vacancy-per-unit}}/g' "$FILE"
sed -i '' 's/{{Vacancy_Per_SF}}/{{calc-vacancy-per-sf}}/g' "$FILE"
sed -i '' 's/{{Vacancy_Annual}}/{{calc-vacancy-loss}}/g' "$FILE"

sed -i '' 's/{{EGR_Per_Unit}}/{{calc-egr-per-unit}}/g' "$FILE"
sed -i '' 's/{{EGR_Per_SF}}/{{calc-egr-per-sf}}/g' "$FILE"
sed -i '' 's/{{EGR_Total}}/{{calc-egr}}/g' "$FILE"
sed -i '' 's/{{EGR_Annual}}/{{calc-egr}}/g' "$FILE"

# Operating Expenses (40 fields - 7 categories × 5 metrics + totals)
# Taxes
sed -i '' 's/{{Tax_Pct_PGR}}/{{calc-exp-taxes-pct-pgr}}/g' "$FILE"
sed -i '' 's/{{Tax_Pct_EGR}}/{{calc-exp-taxes-pct-egr}}/g' "$FILE"
sed -i '' 's/{{Tax_Per_Unit}}/{{calc-exp-taxes-per-unit}}/g' "$FILE"
sed -i '' 's/{{Tax_Per_SF}}/{{calc-exp-taxes-per-sf}}/g' "$FILE"
sed -i '' 's/{{Tax_Annual}}/{{calc-exp-taxes-annual}}/g' "$FILE"

# Insurance
sed -i '' 's/{{Insurance_Pct_PGR}}/{{calc-exp-insurance-pct-pgr}}/g' "$FILE"
sed -i '' 's/{{Insurance_Pct_EGR}}/{{calc-exp-insurance-pct-egr}}/g' "$FILE"
sed -i '' 's/{{Insurance_Per_Unit}}/{{calc-exp-insurance-per-unit}}/g' "$FILE"
sed -i '' 's/{{Insurance_Per_SF}}/{{calc-exp-insurance-per-sf}}/g' "$FILE"
sed -i '' 's/{{Insurance_Annual}}/{{calc-exp-insurance-annual}}/g' "$FILE"

# Repairs & Maintenance
sed -i '' 's/{{Repairs_Pct_PGR}}/{{calc-exp-repairs-pct-pgr}}/g' "$FILE"
sed -i '' 's/{{Repairs_Pct_EGR}}/{{calc-exp-repairs-pct-egr}}/g' "$FILE"
sed -i '' 's/{{Repairs_Per_Unit}}/{{calc-exp-repairs-per-unit}}/g' "$FILE"
sed -i '' 's/{{Repairs_Per_SF}}/{{calc-exp-repairs-per-sf}}/g' "$FILE"
sed -i '' 's/{{Repairs_Annual}}/{{calc-exp-repairs-annual}}/g' "$FILE"

# Payroll
sed -i '' 's/{{Payroll_Pct_PGR}}/{{calc-exp-payroll-pct-pgr}}/g' "$FILE"
sed -i '' 's/{{Payroll_Pct_EGR}}/{{calc-exp-payroll-pct-egr}}/g' "$FILE"
sed -i '' 's/{{Payroll_Per_Unit}}/{{calc-exp-payroll-per-unit}}/g' "$FILE"
sed -i '' 's/{{Payroll_Per_SF}}/{{calc-exp-payroll-per-sf}}/g' "$FILE"
sed -i '' 's/{{Payroll_Annual}}/{{calc-exp-payroll-annual}}/g' "$FILE"

# Utilities
sed -i '' 's/{{Utilities_Pct_PGR}}/{{calc-exp-utilities-pct-pgr}}/g' "$FILE"
sed -i '' 's/{{Utilities_Pct_EGR}}/{{calc-exp-utilities-pct-egr}}/g' "$FILE"
sed -i '' 's/{{Utilities_Per_Unit}}/{{calc-exp-utilities-per-unit}}/g' "$FILE"
sed -i '' 's/{{Utilities_Per_SF}}/{{calc-exp-utilities-per-sf}}/g' "$FILE"
sed -i '' 's/{{Utilities_Annual}}/{{calc-exp-utilities-annual}}/g' "$FILE"

# Management Fees
sed -i '' 's/{{Management_Pct_PGR}}/{{calc-exp-management-pct-pgr}}/g' "$FILE"
sed -i '' 's/{{Management_Pct_EGR}}/{{calc-exp-management-pct-egr}}/g' "$FILE"
sed -i '' 's/{{Management_Per_Unit}}/{{calc-exp-management-per-unit}}/g' "$FILE"
sed -i '' 's/{{Management_Per_SF}}/{{calc-exp-management-per-sf}}/g' "$FILE"
sed -i '' 's/{{Management_Annual}}/{{calc-exp-management-annual}}/g' "$FILE"

# Other Expenses
sed -i '' 's/{{Other_Expenses_Pct_PGR}}/{{calc-exp-other-pct-pgr}}/g' "$FILE"
sed -i '' 's/{{Other_Expenses_Pct_EGR}}/{{calc-exp-other-pct-egr}}/g' "$FILE"
sed -i '' 's/{{Other_Expenses_Per_Unit}}/{{calc-exp-other-per-unit}}/g' "$FILE"
sed -i '' 's/{{Other_Expenses_Per_SF}}/{{calc-exp-other-per-sf}}/g' "$FILE"
sed -i '' 's/{{Other_Expenses_Annual}}/{{calc-exp-other-annual}}/g' "$FILE"

# Total Operating Expenses
sed -i '' 's/{{Total_OpEx_Pct_PGR}}/{{calc-expense-ratio}}/g' "$FILE"
sed -i '' 's/{{Total_OpEx_Pct_EGR}}/{{calc-expense-ratio}}/g' "$FILE"
sed -i '' 's/{{Total_OpEx_Per_Unit}}/{{calc-expenses-per-unit}}/g' "$FILE"
sed -i '' 's/{{Total_OpEx_Per_SF}}/{{calc-expenses-per-sf}}/g' "$FILE"
sed -i '' 's/{{Total_OpEx_Annual}}/{{calc-expenses-total}}/g' "$FILE"

# Net Operating Income & Value (8 fields)
sed -i '' 's/{{NOI_Per_Unit}}/{{calc-noi-per-unit}}/g' "$FILE"
sed -i '' 's/{{NOI_Per_SF}}/{{calc-noi-per-sf}}/g' "$FILE"
sed -i '' 's/{{NOI_Annual}}/{{calc-noi}}/g' "$FILE"

sed -i '' 's/{{Concluded_CapRate}}/{{calc-cap-rate}}/g' "$FILE"
sed -i '' 's/{{Capitalized_Value}}/{{calc-indicated-value}}/g' "$FILE"

sed -i '' 's/{{Value_Per_Unit}}/{{calc-value-per-unit}}/g' "$FILE"
sed -i '' 's/{{Value_Per_SF}}/{{calc-value-per-sf}}/g' "$FILE"
sed -i '' 's/{{Indicated_Value_Rounded}}/{{calc-indicated-value-rounded}}/g' "$FILE"

echo "✅ Page 49 field ID updates complete!"
echo "Total replacements: ~80 fields"
echo "Backup created: $FILE.backup-$(date +%Y%m%d-%H%M%S)"

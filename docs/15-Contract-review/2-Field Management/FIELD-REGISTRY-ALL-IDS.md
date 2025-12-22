# Field Registry - Complete ID Reference

**Generated:** 2025-12-22  
**Total Fields:** 944  
**Source:** `src/features/report-builder/schema/fieldRegistry.ts`

---

## Purpose

This is the **COMPLETE** list of all field IDs in the registry. 

**For Template Authors:**
- Every placeholder `{field-id}` MUST match an ID in this list
- If an ID doesn't exist here, it doesn't exist in the system
- Do NOT auto-convert Valcre names - use the IDs listed here

**For Data Import:**
- Valcre fields map to registry IDs via the `valcreRange` column
- Always look up by Valcre name, then use the registry ID

---


## Section: `calc` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `calc-adj-capex` | CapEx Adjustment | - |
| `calc-adj-leasing` | Leasing Costs | - |
| `calc-adj-other` | Other Adjustments | - |
| `calc-adj-total` | Total Adjustments | - |
| `calc-avg-rent-per-sf` | Avg Rent/SF | - |
| `calc-avg-rent-per-unit` | Avg Rent/Unit | - |
| `calc-avg-unit-sf` | Avg Unit SF | - |
| `calc-bad-debt-rate` | Bad Debt Rate (%) | - |
| `calc-cap-rate` | Cap Rate (%) | - |
| `calc-concessions-rate` | Concessions Rate (%) | - |
| `calc-egr` | Effective Gross Revenue | - |
| `calc-egr-pct-pgr` | EGR % PGR | - |
| `calc-egr-per-sf` | EGR Per SF | - |
| `calc-egr-per-unit` | EGR Per Unit | - |
| `calc-exp-admin` | Admin & General | - |
| `calc-exp-insurance` | Insurance | - |
| `calc-exp-insurance-annual` | Insurance Annual | - |
| `calc-exp-insurance-pct-egr` | Insurance % of EGR | - |
| `calc-exp-insurance-pct-pgr` | Insurance % of PGR | - |
| `calc-exp-insurance-per-sf` | Insurance/SF | - |
| `calc-exp-insurance-per-unit` | Insurance/Unit | - |
| `calc-exp-management` | Management | - |
| `calc-exp-management-annual` | Management Annual | - |
| `calc-exp-management-pct-egr` | Management % of EGR | - |
| `calc-exp-management-pct-pgr` | Management % of PGR | - |
| `calc-exp-management-per-sf` | Management/SF | - |
| `calc-exp-management-per-unit` | Management/Unit | - |
| `calc-exp-other` | Other Expenses | - |
| `calc-exp-other-annual` | Other Annual | - |
| `calc-exp-other-pct-egr` | Other % of EGR | - |
| `calc-exp-other-pct-pgr` | Other % of PGR | - |
| `calc-exp-other-per-sf` | Other/SF | - |
| `calc-exp-other-per-unit` | Other/Unit | - |
| `calc-exp-payroll` | Payroll | - |
| `calc-exp-payroll-annual` | Payroll Annual | - |
| `calc-exp-payroll-pct-egr` | Payroll % of EGR | - |
| `calc-exp-payroll-pct-pgr` | Payroll % of PGR | - |
| `calc-exp-payroll-per-sf` | Payroll/SF | - |
| `calc-exp-payroll-per-unit` | Payroll/Unit | - |
| `calc-exp-repairs` | Repairs & Maintenance | - |
| `calc-exp-repairs-annual` | Repairs Annual | - |
| `calc-exp-repairs-pct-egr` | Repairs % of EGR | - |
| `calc-exp-repairs-pct-pgr` | Repairs % of PGR | - |
| `calc-exp-repairs-per-sf` | Repairs/SF | - |
| `calc-exp-repairs-per-unit` | Repairs/Unit | - |
| `calc-exp-reserves` | Replacement Reserves | - |
| `calc-exp-taxes` | Real Estate Taxes | - |
| `calc-exp-taxes-annual` | Taxes Annual | - |
| `calc-exp-taxes-pct-egr` | Taxes % of EGR | - |
| `calc-exp-taxes-pct-pgr` | Taxes % of PGR | - |
| `calc-exp-taxes-per-sf` | Taxes/SF | - |
| `calc-exp-taxes-per-unit` | Taxes/Unit | - |
| `calc-exp-utilities` | Utilities | - |
| `calc-exp-utilities-annual` | Utilities Annual | - |
| `calc-exp-utilities-pct-egr` | Utilities % of EGR | - |
| `calc-exp-utilities-pct-pgr` | Utilities % of PGR | - |
| `calc-exp-utilities-per-sf` | Utilities/SF | - |
| `calc-exp-utilities-per-unit` | Utilities/Unit | - |
| `calc-expense-ratio` | Expense Ratio (%) | - |
| `calc-expenses-per-sf` | Expenses Per SF | - |
| `calc-expenses-per-unit` | Expenses Per Unit | - |
| `calc-expenses-total` | Total Expenses | - |
| `calc-grm` | GRM | - |
| `calc-indicated-value` | Indicated Value | - |
| `calc-laundry-per-unit` | Laundry $/Unit/Mo | - |
| `calc-laundry-total` | Laundry Annual | - |
| `calc-noi` | Net Operating Income | - |
| `calc-noi-pct-pgr` | NOI % PGR | - |
| `calc-noi-per-sf` | NOI/SF | - |
| `calc-noi-per-unit` | NOI/Unit | - |
| `calc-other-income` | Other Income Annual | - |
| `calc-parking-per-unit` | Parking $/Unit/Mo | - |
| `calc-parking-total` | Parking Annual | - |
| `calc-pgr` | Potential Gross Revenue | - |
| `calc-pgr-pct-pgr` | PGR % PGR | - |
| `calc-pgr-per-sf` | PGR Per SF | - |
| `calc-pgr-per-unit` | PGR Per Unit | - |
| `calc-raw-value` | Raw Value | - |
| `calc-revenue-laundry-pct-pgr` | Laundry Revenue % PGR | - |
| `calc-revenue-misc-pct-pgr` | Misc Revenue % PGR | - |
| `calc-revenue-multifamily-pct-pgr` | Multifamily Revenue % PGR | - |
| `calc-revenue-parking-pct-pgr` | Parking Revenue % PGR | - |
| `calc-revenue-rental-pct-pgr` | Rental Revenue % PGR | - |
| `calc-total-other-income` | Total Other Income | - |
| `calc-total-rental-revenue` | Total Rental Revenue | - |
| `calc-total-sf` | Total SF | - |
| `calc-total-units` | Total Units | - |
| `calc-type1-annual` | Annual Revenue | - |
| `calc-type1-cont-v-market` | Contract vs Market % | - |
| `calc-type1-contract-rent` | Contract Rent/Mo | - |
| `calc-type1-count` | Unit Count | - |
| `calc-type1-name` | Unit Type 1 | - |
| `calc-type1-per-sf` | Revenue/SF | - |
| `calc-type1-per-unit` | Revenue/Unit | - |
| `calc-type1-rent` | Market Rent/Mo | - |
| `calc-type1-sf` | Avg SF | - |
| `calc-type2-annual` | Annual Revenue | - |
| `calc-type2-cont-v-market` | Contract vs Market % | - |
| `calc-type2-contract-rent` | Contract Rent/Mo | - |
| `calc-type2-count` | Unit Count | - |
| `calc-type2-name` | Unit Type 2 | - |
| `calc-type2-per-sf` | Revenue/SF | - |
| `calc-type2-per-unit` | Revenue/Unit | - |
| `calc-type2-rent` | Market Rent/Mo | - |
| `calc-type2-sf` | Avg SF | - |
| `calc-type3-annual` | Annual Revenue | - |
| `calc-type3-cont-v-market` | Contract vs Market % | - |
| `calc-type3-contract-rent` | Contract Rent/Mo | - |
| `calc-type3-count` | Unit Count | - |
| `calc-type3-name` | Unit Type 3 | - |
| `calc-type3-per-sf` | Revenue/SF | - |
| `calc-type3-per-unit` | Revenue/Unit | - |
| `calc-type3-rent` | Market Rent/Mo | - |
| `calc-type3-sf` | Avg SF | - |
| `calc-type4-annual` | Annual Revenue | - |
| `calc-type4-cont-v-market` | Contract vs Market % | - |
| `calc-type4-contract-rent` | Contract Rent/Mo | - |
| `calc-type4-count` | Unit Count | - |
| `calc-type4-name` | Unit Type 4 | - |
| `calc-type4-per-sf` | Revenue/SF | - |
| `calc-type4-per-unit` | Revenue/Unit | - |
| `calc-type4-rent` | Market Rent/Mo | - |
| `calc-type4-sf` | Avg SF | - |
| `calc-vacancy-loss` | Total Vacancy & Loss | - |
| `calc-vacancy-rate` | Vacancy Rate (%) | - |
| `calc-value-per-sf` | Value/SF | - |
| `calc-value-per-unit` | Value/Unit | - |
| `cap-rate-average` | Cap Rate Average | - |
| `cap-rate-range-high` | Cap Rate Range High | - |
| `cap-rate-range-low` | Cap Rate Range Low | - |
| `dircap-blend` | Cap Rate Blend | `IA_DirCap_Blend` |
| `dircap-caprate1` | Capitalization Rate 1 | `IA_DirCap_CapRate1` |
| `dircap-caprate2` | Capitalization Rate 2 | `IA_DirCap_CapRate2` |
| `dircap-concession-total` | Concession Total | `IA_DirCap_ConcessionTotal` |
| `dircap-expense-ratio` | Expense Ratio | `IA_DirCap_ExpenseRatio` |
| `dircap-expense01-label` | Expense Line 01 | `IA_DirCap_Expense01` |
| `dircap-expense02-label` | Expense Line 02 | `IA_DirCap_Expense02` |
| `dircap-expense03-label` | Expense Line 03 | `IA_DirCap_Expense03` |
| `dircap-expense04-label` | Expense Line 04 | `IA_DirCap_Expense04` |
| `dircap-expense05-label` | Expense Line 05 | `IA_DirCap_Expense05` |
| `dircap-expense06-label` | Expense Line 06 | `IA_DirCap_Expense06` |
| `dircap-expense07-label` | Expense Line 07 | `IA_DirCap_Expense07` |
| `dircap-expense08-label` | Expense Line 08 | `IA_DirCap_Expense08` |
| `dircap-expense09-label` | Expense Line 09 | `IA_DirCap_Expense09` |
| `dircap-expense10-label` | Expense Line 10 | `IA_DirCap_Expense10` |
| `dircap-expense11-label` | Expense Line 11 | `IA_DirCap_Expense11` |
| `dircap-expense12-label` | Expense Line 12 | `IA_DirCap_Expense12` |
| `dircap-expense13-label` | Expense Line 13 | `IA_DirCap_Expense13` |
| `dircap-expense14-label` | Expense Line 14 | `IA_DirCap_Expense14` |
| `dircap-expense15-label` | Expense Line 15 | `IA_DirCap_Expense15` |
| `dircap-expense16-label` | Expense Line 16 | `IA_DirCap_Expense16` |
| `dircap-expense17-label` | Expense Line 17 | `IA_DirCap_Expense17` |
| `dircap-expense18-label` | Expense Line 18 | `IA_DirCap_Expense18` |
| `dircap-expense19-label` | Expense Line 19 | `IA_DirCap_Expense19` |
| `dircap-expense20-label` | Expense Line 20 | `IA_DirCap_Expense20` |
| `dircap-expense21-label` | Expense Line 21 | `IA_DirCap_Expense21` |
| `dircap-expense22-label` | Expense Line 22 | `IA_DirCap_Expense22` |
| `dircap-expense23-label` | Expense Line 23 | `IA_DirCap_Expense23` |
| `dircap-expense24-label` | Expense Line 24 | `IA_DirCap_Expense24` |
| `dircap-expense25-label` | Expense Line 25 | `IA_DirCap_Expense25` |
| `dircap-loss-total` | Total Loss | `IA_DirCap_LossTotal` |
| `dircap-misc-total` | Miscellaneous Income Total | `IA_DirCap_Misc` |
| `dircap-reimb-total` | Reimbursement Total | `IA_DirCap_Rmb` |
| `dircap-rent-total` | Total Rental Revenue | `IA_DirCap_Rent` |
| `dircap-vacancy-total` | Vacancy Total | `IA_DirCap_VacancyTotal` |


## Section: `cert` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `cert-sign-credentials` | Credentials | - |
| `cert-sign-date` | Signature Date | - |
| `cert-sign-name` | Appraiser Name | - |
| `cert-signature` | Signature Image | - |
| `cert-statement-1` | Statement 1 | - |
| `cert-statement-10` | Statement 10 | - |
| `cert-statement-11` | Statement 11 | - |
| `cert-statement-12` | Statement 12 | - |
| `cert-statement-2` | Statement 2 | - |
| `cert-statement-3` | Statement 3 | - |
| `cert-statement-4` | Statement 4 | - |
| `cert-statement-5` | Statement 5 | - |
| `cert-statement-6` | Statement 6 | - |
| `cert-statement-7` | Statement 7 | - |
| `cert-statement-8` | Statement 8 | - |
| `cert-statement-9` | Statement 9 | - |


## Section: `client-intake` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `intake-asset-condition` | Asset Condition | - |
| `intake-client-address` | Client Address | - |
| `intake-client-email` | Client Email | - |
| `intake-client-first-name` | Client First Name | - |
| `intake-client-last-name` | Client Last Name | - |
| `intake-client-organization` | Organization | - |
| `intake-client-phone` | Client Phone | - |
| `intake-client-title` | Client Title | - |
| `intake-contact-email` | Contact Email | - |
| `intake-contact-first-name` | Contact First Name | - |
| `intake-contact-last-name` | Contact Last Name | - |
| `intake-contact-phone` | Contact Phone | - |
| `intake-intended-use` | Intended Use | - |
| `intake-notes` | Notes | - |
| `intake-property-address` | Property Address | - |
| `intake-property-name` | Property Name | - |
| `intake-property-type` | Property Type | - |
| `intake-valuation-premises` | Valuation Premises | - |


## Section: `cost-s` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `cost-approach-conclusion` | Cost Approach Conclusion | - |


## Section: `cover` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `appraiser-address` | Company Address | - |
| `appraiser-aic-number` | AIC Number | - |
| `appraiser-city` | Company City | - |
| `appraiser-company` | Company Name | - |
| `appraiser-credentials` | Appraiser Credentials | - |
| `appraiser-email` | Appraiser Email | - |
| `appraiser-name` | Appraiser Name | - |
| `appraiser-phone` | Company Phone | - |
| `appraiser-postal` | Company Postal Code | - |
| `appraiser-province` | Company Province | - |
| `appraiser-title` | Appraiser Title | - |
| `appraiser-website` | Company Website | - |
| `census-tract` | Census Tract | `Subject_Census` |
| `city` | City | - |
| `city-formal` | City (Formal Name) | `Subject_CityFormal` |
| `client-address` | Client Address | - |
| `client-city` | Client City | - |
| `client-company` | Client Company | - |
| `client-contact-name` | Client Contact Name | - |
| `client-postal` | Client Postal Code | - |
| `client-province` | Client Province | - |
| `client-title` | Client Title | - |
| `county` | County | `Subject_County` |
| `cover-photo` | Cover Photo | - |
| `file-number` | File Number | - |
| `geocode` | Geocode | `Subject_Geocode` |
| `latitude` | Latitude | - |
| `longitude` | Longitude | - |
| `market` | Market | - |
| `msa` | MSA | `Subject_MSA` |
| `postal-code` | Postal Code | - |
| `property-full-address` | Full Property Address | - |
| `property-name` | Property Name | - |
| `property-type-display` | Property Type | - |
| `province` | Province | - |
| `province-abbr` | Province Abbreviation | - |
| `report-date` | Date of Report | - |
| `street-address` | Street Address | - |
| `submarket` | Submarket | - |
| `valuation-date` | Date of Valuation | - |


## Section: `exec` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `appeal` | Appeal | `Subject_Appeal` |
| `building-format` | Building Format | - |
| `building-style` | Building Style | - |
| `concluded-value` | Concluded Value | - |
| `condition` | Condition | `Subject_Condition` |
| `extraordinary-assumptions` | Extraordinary Assumptions | - |
| `extraordinary-limiting-conditions` | Extraordinary Limiting Conditions | - |
| `hypothetical-conditions` | Hypothetical Conditions | - |
| `occupancy-rate` | Occupancy Rate (%) | - |
| `parking` | Parking | `Subject_Parking` |
| `property-rights` | Property Rights | - |
| `quality` | Quality | `Subject_Quality` |
| `stabilized-occupancy` | Stabilized Occupancy (%) | `Subject_OccupancyStabilized` |
| `stories` | Number of Stories | - |
| `total-buildings` | Total Buildings | - |
| `total-nra` | Net Rentable Area (SF) | - |
| `total-units` | Total Units | - |
| `value-ia-conclusion` | Income Approach Value Conclusion | `Value_IARecScenario1` |
| `value-insurable` | Insurable Value | `Value_Insurable` |
| `value-sa-conclusion` | Sales Approach Value Conclusion | `Value_SARecScenario1` |
| `value-scenario` | Value Scenario | - |
| `value-scenario1` | Value Scenario 1 | `Value_Scenario1` |
| `value-scenario1-psf` | Value Scenario 1 ($/SF) | `Value_Scenario1PerUofM` |
| `value-scenario1-text` | Value Scenario 1 (Text) | `Value_Scenario1Text` |
| `value-scenario2` | Value Scenario 2 | `Value_Scenario2` |
| `value-scenario2-text` | Value Scenario 2 (Text) | `Value_Scenario2Text` |
| `value-scenario3` | Value Scenario 3 | `Value_Scenario3` |
| `value-scenario3-text` | Value Scenario 3 (Text) | `Value_Scenario3Text` |
| `year-built` | Year Built | - |


## Section: `expenses` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `exp-insurance-comment` | Insurance Comment | - |
| `exp-management-comment` | Management Comment | - |
| `exp-other-comment` | Other Comment | - |
| `exp-payroll-comment` | Payroll Comment | - |
| `exp-repairs-comment` | Repairs Comment | - |
| `exp-taxes-comment` | Taxes Comment | - |
| `exp-utilities-comment` | Utilities Comment | - |


## Section: `hbu` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `hbu-conclusion-text` | HBU Conclusion | - |
| `hbu-improved` | Highest & Best Use As Improved | - |
| `hbu-intro` | HBU Introduction | - |
| `hbu-vacant-financial` | Financially Feasible | - |
| `hbu-vacant-legal` | Legally Permissible | - |
| `hbu-vacant-physical` | Physically Possible | - |
| `hbu-vacant-productive` | Maximally Productive | - |


## Section: `hist` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `hist-egr-pct-pgr` | EGR % PGR | - |
| `hist-egr-per-unit` | EGR/Unit | - |
| `hist-egr-total` | EGR Total | - |
| `hist-exp-insurance-pct-pgr` | Insurance % PGR | - |
| `hist-exp-insurance-per-unit` | Insurance/Unit | - |
| `hist-exp-insurance-total` | Insurance | - |
| `hist-exp-management-pct-pgr` | Management % PGR | - |
| `hist-exp-management-per-unit` | Management/Unit | - |
| `hist-exp-management-total` | Management | - |
| `hist-exp-other-pct-pgr` | Other % PGR | - |
| `hist-exp-other-per-unit` | Other/Unit | - |
| `hist-exp-other-total` | Other Expenses | - |
| `hist-exp-payroll-pct-pgr` | Payroll % PGR | - |
| `hist-exp-payroll-per-unit` | Payroll/Unit | - |
| `hist-exp-payroll-total` | Payroll | - |
| `hist-exp-repairs-pct-pgr` | Repairs % PGR | - |
| `hist-exp-repairs-per-unit` | Repairs/Unit | - |
| `hist-exp-repairs-total` | Repairs & Maintenance | - |
| `hist-exp-taxes-pct-pgr` | Taxes % PGR | - |
| `hist-exp-taxes-per-unit` | Taxes/Unit | - |
| `hist-exp-taxes-total` | Taxes | - |
| `hist-exp-total-pct-pgr` | Total Expenses % PGR | - |
| `hist-exp-total-per-unit` | Total Expenses/Unit | - |
| `hist-exp-total-total` | Total Expenses | - |
| `hist-exp-utilities-pct-pgr` | Utilities % PGR | - |
| `hist-exp-utilities-per-unit` | Utilities/Unit | - |
| `hist-exp-utilities-total` | Utilities | - |
| `hist-noi-pct-pgr` | NOI % PGR | - |
| `hist-noi-per-unit` | NOI/Unit | - |
| `hist-noi-total` | NOI | - |
| `hist-pgr-pct` | PGR % | - |
| `hist-pgr-per-unit` | PGR/Unit | - |
| `hist-pgr-total` | PGR Total | - |
| `hist-revenue-laundry-pct-pgr` | Laundry Revenue % PGR | - |
| `hist-revenue-laundry-per-unit` | Laundry Revenue/Unit | - |
| `hist-revenue-laundry-total` | Laundry Revenue | - |
| `hist-revenue-misc-pct-pgr` | Misc Revenue % PGR | - |
| `hist-revenue-misc-per-unit` | Misc Revenue/Unit | - |
| `hist-revenue-misc-total` | Misc Revenue | - |
| `hist-revenue-multifamily-pct-pgr` | Multifamily Revenue % PGR | - |
| `hist-revenue-multifamily-per-unit` | Multifamily Revenue/Unit | - |
| `hist-revenue-multifamily-total` | Multifamily Revenue | - |
| `hist-revenue-parking-pct-pgr` | Parking Revenue % PGR | - |
| `hist-revenue-parking-per-unit` | Parking Revenue/Unit | - |
| `hist-revenue-parking-total` | Parking Revenue | - |
| `hist-revenue-rental-pct-pgr` | Rental Revenue % PGR | - |
| `hist-revenue-rental-per-unit` | Rental Revenue/Unit | - |
| `hist-revenue-rental-total` | Rental Revenue | - |
| `hist-vacancy-pct-pgr` | Vacancy % PGR | - |
| `hist-vacancy-per-unit` | Vacancy/Unit | - |
| `hist-vacancy-total` | Vacancy Loss | - |


## Section: `home` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `transmittal-body` | Letter Body | - |
| `transmittal-date` | Letter Date | - |


## Section: `image-mgt` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `img-common-1` | Common Area 1 - Lobby/Entrance | - |
| `img-common-1-caption` | Caption | - |
| `img-common-2` | Common Area 2 - Hallway/Corridor | - |
| `img-common-2-caption` | Caption | - |
| `img-common-3` | Common Area 3 - Amenity Space | - |
| `img-common-3-caption` | Caption | - |
| `img-common-4` | Common Area 4 - Additional | - |
| `img-common-4-caption` | Caption | - |
| `img-cover-photo` | Cover Photo - Main property image | - |
| `img-exterior-1` | Exterior 1 - Front Facade | - |
| `img-exterior-1-caption` | Caption | - |
| `img-exterior-2` | Exterior 2 - Rear Elevation | - |
| `img-exterior-2-caption` | Caption | - |
| `img-exterior-3` | Exterior 3 - Left Side | - |
| `img-exterior-3-caption` | Caption | - |
| `img-exterior-4` | Exterior 4 - Right Side | - |
| `img-exterior-4-caption` | Caption | - |
| `img-exterior-5` | Exterior 5 - Detail/Feature | - |
| `img-exterior-5-caption` | Caption | - |
| `img-exterior-6` | Exterior 6 - Additional | - |
| `img-exterior-6-caption` | Caption | - |
| `img-map-aerial-1` | Aerial View - Bird\ | - |
| `img-map-aerial-2` | Site Boundary - Property lines shown | - |
| `img-map-local` | Local Area Map - City/neighborhood | - |
| `img-map-regional` | Regional Map - Province/region context | - |
| `img-signature` | Appraiser Signature | - |
| `img-site-plan-1` | Site Plan - Layout/footprint | - |
| `img-site-plan-2` | Survey/Plot Plan | - |
| `img-street-1` | Street View 1 - Looking North | - |
| `img-street-1-caption` | Caption | - |
| `img-street-2` | Street View 2 - Looking South | - |
| `img-street-2-caption` | Caption | - |
| `img-street-3` | Street View 3 - Streetscape/Context | - |
| `img-street-3-caption` | Caption | - |
| `img-systems-1` | Building Systems 1 - Mechanical Room | - |
| `img-systems-1-caption` | Caption | - |
| `img-systems-2` | Building Systems 2 - Electrical Panel | - |
| `img-systems-2-caption` | Caption | - |
| `img-systems-3` | Building Systems 3 - Plumbing/Water Heater | - |
| `img-systems-3-caption` | Caption | - |
| `img-systems-4` | Building Systems 4 - HVAC/Furnace | - |
| `img-systems-4-caption` | Caption | - |
| `img-unit-1` | Unit Interior 1 - Living Room | - |
| `img-unit-1-caption` | Caption | - |
| `img-unit-2` | Unit Interior 2 - Kitchen | - |
| `img-unit-2-caption` | Caption | - |
| `img-unit-3` | Unit Interior 3 - Bedroom | - |
| `img-unit-3-caption` | Caption | - |
| `img-unit-4` | Unit Interior 4 - Bathroom | - |
| `img-unit-4-caption` | Caption | - |
| `img-unit-5` | Unit Interior 5 - Additional Room | - |
| `img-unit-5-caption` | Caption | - |
| `img-unit-6` | Unit Interior 6 - Additional | - |
| `img-unit-6-caption` | Caption | - |
| `img-zoning-map` | Zoning Map - Municipal zoning | - |


## Section: `impv` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `actual-age` | Actual Age (Years) | - |
| `ceilings` | Ceilings | - |
| `density-units-acre` | Density (Units/Acre) | - |
| `doors-windows` | Doors & Windows | - |
| `economic-life` | Economic Life (Years) | - |
| `effective-age` | Effective Age (Years) | - |
| `electrical` | Electrical | - |
| `elevator` | Elevator | - |
| `exterior-walls` | Exterior Walls/Framing | - |
| `fire-protection` | Fire Protection | - |
| `flooring` | Flooring | - |
| `foundation` | Foundation | - |
| `functional-design` | Functional Design | - |
| `gba` | Gross Building Area (SF) | - |
| `hazardous-materials` | Hazardous Materials | - |
| `hvac` | HVAC | - |
| `impv-building-footprint` | Building Footprint (SF) | - |
| `impv-building-format` | Building Format | - |
| `impv-insulation` | Insulation | - |
| `impv-interior-finish` | Interior Finish Quality | - |
| `impv-nra` | Net Rentable Area (SF) | - |
| `impv-num-buildings` | Number of Buildings | - |
| `impv-num-units` | Number of Units | - |
| `impv-overview` | Overview | - |
| `impv-roof-condition` | Roof Condition | - |
| `impv-site-coverage` | Site Coverage (%) | - |
| `impv-stories` | Number of Stories | - |
| `impv-year-built` | Year Built | - |
| `interior-walls` | Interior Walls | - |
| `landscaping` | Landscaping | - |
| `laundry` | Laundry | - |
| `overall-condition` | Overall Condition | - |
| `parking-ratio` | Parking Ratio | - |
| `parking-spaces` | Parking Spaces | - |
| `plumbing` | Plumbing | - |
| `project-amenities` | Project Amenities | - |
| `remaining-useful-life` | Remaining Useful Life (Years) | - |
| `roof` | Roof | - |
| `security` | Security Features | - |
| `site-impv` | Site Improvements | - |
| `tenancy` | Tenancy | - |
| `unit-amenities` | Unit Amenities | - |


## Section: `income` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `income-cap-rate-analysis` | Cap Rate Analysis | - |
| `income-expense-narrative` | Expense Analysis | - |
| `income-noi-narrative` | NOI Analysis | - |
| `income-pgi-narrative` | PGI Analysis | - |
| `income-value-indication` | Income Approach Value | - |


## Section: `land1` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `land-value-conclusion` | Land Value Conclusion | - |


## Section: `location` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `bike-score` | Bike Score | - |
| `local-area-description` | Local Area Description | - |
| `location-access` | Access | - |
| `location-nearby-amenities` | Nearby Amenities | - |
| `location-overview-text` | Location Overview | - |
| `nearby-schools` | Nearby Schools | - |
| `public-transit` | Public Transportation | - |
| `transit-score` | Transit Score | - |
| `walk-score` | Walk Score | - |


## Section: `loe-prep` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `loe-appraisal-fee` | Appraisal Fee | - |
| `loe-appraiser-comments` | Appraiser Comments | - |
| `loe-delivery-date` | Delivery Date | - |
| `loe-internal-comments` | Internal Comments | - |
| `loe-payment-terms` | Payment Terms | - |
| `loe-property-rights` | Property Rights Appraised | - |
| `loe-report-type` | Report Type | - |
| `loe-retainer-amount` | Retainer Amount | - |
| `loe-scope-of-work` | Scope of Work | - |
| `loe-special-instructions` | Special Instructions | - |
| `loe-valcre-job-id` | Valcre Job ID (VAL#) | - |


## Section: `maps` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `map-aerial` | Aerial/Site Map | - |
| `map-local` | Local Area Map | - |
| `map-regional` | Regional Map | - |


## Section: `market` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `local-market` | Local Market Analysis | - |
| `market-demand-drivers` | Demand Drivers | - |
| `market-local-employment` | Employment | - |
| `market-local-population` | Population | - |
| `market-national-gdp` | GDP Growth | - |
| `market-national-inflation` | Inflation Rate | - |
| `market-provincial-key-industries` | Key Industries | - |
| `market-provincial-unemployment` | Unemployment Rate | - |
| `market-supply-pipeline` | Supply Pipeline | - |
| `market-vacancy-rate` | Market Vacancy Rate (%) | - |
| `multifamily-overview` | Multifamily Market Overview | - |
| `national-overview` | National Economic Overview | - |
| `provincial-overview` | Provincial Overview | - |
| `rent-trend` | Rent Trend | - |


## Section: `photos` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `photos-common` | Common Area Photos | - |
| `photos-exterior` | Exterior Photos | - |
| `photos-street` | Street View Photos | - |
| `photos-systems` | Building Systems Photos | - |
| `photos-units` | Unit Interior Photos | - |


## Section: `recon` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `property-is-listed` | Property Currently Listed | - |
| `recon-cost-value` | Cost Approach Value | - |
| `recon-cost-weight` | Cost Weight (%) | - |
| `recon-effective-date` | Effective Date | - |
| `recon-final-value` | Final Value | - |
| `recon-final-value-per-sf` | Final Value/SF | - |
| `recon-final-value-per-unit` | Final Value/Unit | - |
| `recon-income-value` | Income Approach Value | - |
| `recon-income-weight` | Income Weight (%) | - |
| `recon-narrative` | Reconciliation Narrative | - |
| `recon-sales-value` | Sales Comparison Value | - |
| `recon-sales-weight` | Sales Weight (%) | - |
| `recon-value-premise` | Value Premise | - |
| `use-dcf-methodology` | Use DCF Methodology | - |


## Section: `rentroll` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `rentroll-avg-actual-sf` | Average Actual Rent/SF | - |
| `rentroll-avg-actual-unit` | Average Actual Rent/Unit | - |
| `rentroll-avg-asking-sf` | Average Asking Rent/SF | - |
| `rentroll-avg-asking-unit` | Average Asking Rent/Unit | - |
| `rentroll-avg-occ-pct` | Average Occupancy % | - |
| `rentroll-avg-recent-sf` | Average Recent Rent/SF | - |
| `rentroll-avg-recent-unit` | Average Recent Rent/Unit | - |
| `rentroll-avg-size` | Average Size (SF) | - |
| `rentroll-avg-vac-pct` | Average Vacancy % | - |
| `rentroll-total-occ` | Total Occupied | - |
| `rentroll-total-pct` | Total % | - |
| `rentroll-total-units` | Total Units | - |
| `rentroll-total-vac` | Total Vacant | - |
| `rentroll-type1-actual-sf` | Type 1 Actual Rent/SF | - |
| `rentroll-type1-actual-unit` | Type 1 Actual Rent/Unit | - |
| `rentroll-type1-desc` | Type 1 Description | - |
| `rentroll-type1-name` | Type 1 Name | - |
| `rentroll-type1-occ` | Type 1 Occupied | - |
| `rentroll-type1-occ-pct` | Type 1 Occupancy % | - |
| `rentroll-type1-pct` | Type 1 % | - |
| `rentroll-type1-recent-sf` | Type 1 Recent Rent/SF | - |
| `rentroll-type1-size` | Type 1 Size (SF) | - |
| `rentroll-type1-total` | Type 1 Total | - |
| `rentroll-type1-vac` | Type 1 Vacant | - |
| `rentroll-type1-vac-pct` | Type 1 Vacancy % | - |
| `rentroll-type2-actual-sf` | Type 2 Actual Rent/SF | - |
| `rentroll-type2-actual-unit` | Type 2 Actual Rent/Unit | - |
| `rentroll-type2-desc` | Type 2 Description | - |
| `rentroll-type2-name` | Type 2 Name | - |
| `rentroll-type2-occ` | Type 2 Occupied | - |
| `rentroll-type2-occ-pct` | Type 2 Occupancy % | - |
| `rentroll-type2-pct` | Type 2 % | - |
| `rentroll-type2-recent-sf` | Type 2 Recent Rent/SF | - |
| `rentroll-type2-size` | Type 2 Size (SF) | - |
| `rentroll-type2-total` | Type 2 Total | - |
| `rentroll-type2-vac` | Type 2 Vacant | - |
| `rentroll-type2-vac-pct` | Type 2 Vacancy % | - |


## Section: `report` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `report-compliance` | Compliance Standard | - |
| `report-purpose` | Purpose | - |
| `report-scope` | Scope of Work | - |
| `report-type` | Report Type | - |


## Section: `sales` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `comp1-access` | Access Rating | - |
| `comp1-address` | Address | - |
| `comp1-adj-price-per-unit` | Adjusted Price/Unit | - |
| `comp1-appeal` | Appeal Rating | - |
| `comp1-cap-rate` | Cap Rate (%) | - |
| `comp1-city` | City | - |
| `comp1-condition` | Condition Rating | - |
| `comp1-expenditures-after` | Expenditures After Sale | - |
| `comp1-exposure` | Exposure Rating | - |
| `comp1-financing` | Financing | - |
| `comp1-gba` | GBA (SF) | - |
| `comp1-gross-adj` | Gross Adjustment % | - |
| `comp1-location` | Location Rating | - |
| `comp1-market-conditions` | Market Conditions | - |
| `comp1-name` | Property Name | - |
| `comp1-net-adj` | Net Adjustment % | - |
| `comp1-noi` | NOI | - |
| `comp1-noi-per-unit` | NOI/Unit | - |
| `comp1-occupancy` | Occupancy % | - |
| `comp1-parking-type` | Parking Type | - |
| `comp1-postal-code` | Postal Code | - |
| `comp1-price-per-sf` | Price/SF | - |
| `comp1-price-per-unit` | Price/Unit | - |
| `comp1-proj-amenities` | Project Amenities | - |
| `comp1-property-rights` | Property Rights | - |
| `comp1-province` | Province | - |
| `comp1-quality` | Quality Rating | - |
| `comp1-sale-conditions` | Conditions of Sale | - |
| `comp1-sale-date` | Sale Date | - |
| `comp1-sale-price` | Sale Price | - |
| `comp1-sale-status` | Sale Status | - |
| `comp1-total-phys-adj` | Total Physical Adj % | - |
| `comp1-total-trans-adj` | Total Transactional Adj % | - |
| `comp1-trans-adj-price` | Transactional Adj Price | - |
| `comp1-unit-amenities` | Unit Amenities | - |
| `comp1-units` | Units | - |
| `comp1-year` | Year Built | - |
| `comp2-access` | Access Rating | - |
| `comp2-address` | Address | - |
| `comp2-adj-price-per-unit` | Adjusted Price/Unit | - |
| `comp2-appeal` | Appeal Rating | - |
| `comp2-cap-rate` | Cap Rate (%) | - |
| `comp2-city` | City | - |
| `comp2-condition` | Condition Rating | - |
| `comp2-expenditures-after` | Expenditures After Sale | - |
| `comp2-exposure` | Exposure Rating | - |
| `comp2-financing` | Financing | - |
| `comp2-gba` | GBA (SF) | - |
| `comp2-gross-adj` | Gross Adjustment % | - |
| `comp2-location` | Location Rating | - |
| `comp2-market-conditions` | Market Conditions | - |
| `comp2-name` | Property Name | - |
| `comp2-net-adj` | Net Adjustment % | - |
| `comp2-noi` | NOI | - |
| `comp2-noi-per-unit` | NOI/Unit | - |
| `comp2-occupancy` | Occupancy % | - |
| `comp2-parking-type` | Parking Type | - |
| `comp2-postal-code` | Postal Code | - |
| `comp2-price-per-sf` | Price/SF | - |
| `comp2-price-per-unit` | Price/Unit | - |
| `comp2-proj-amenities` | Project Amenities | - |
| `comp2-property-rights` | Property Rights | - |
| `comp2-province` | Province | - |
| `comp2-quality` | Quality Rating | - |
| `comp2-sale-conditions` | Conditions of Sale | - |
| `comp2-sale-date` | Sale Date | - |
| `comp2-sale-price` | Sale Price | - |
| `comp2-sale-status` | Sale Status | - |
| `comp2-total-phys-adj` | Total Physical Adj % | - |
| `comp2-total-trans-adj` | Total Transactional Adj % | - |
| `comp2-trans-adj-price` | Transactional Adj Price | - |
| `comp2-unit-amenities` | Unit Amenities | - |
| `comp2-units` | Units | - |
| `comp2-year` | Year Built | - |
| `comp3-access` | Access Rating | - |
| `comp3-address` | Address | - |
| `comp3-adj-price-per-unit` | Adjusted Price/Unit | - |
| `comp3-appeal` | Appeal Rating | - |
| `comp3-cap-rate` | Cap Rate (%) | - |
| `comp3-city` | City | - |
| `comp3-condition` | Condition Rating | - |
| `comp3-expenditures-after` | Expenditures After Sale | - |
| `comp3-exposure` | Exposure Rating | - |
| `comp3-financing` | Financing | - |
| `comp3-gba` | GBA (SF) | - |
| `comp3-gross-adj` | Gross Adjustment % | - |
| `comp3-location` | Location Rating | - |
| `comp3-market-conditions` | Market Conditions | - |
| `comp3-name` | Property Name | - |
| `comp3-net-adj` | Net Adjustment % | - |
| `comp3-noi` | NOI | - |
| `comp3-noi-per-unit` | NOI/Unit | - |
| `comp3-occupancy` | Occupancy % | - |
| `comp3-parking-type` | Parking Type | - |
| `comp3-postal-code` | Postal Code | - |
| `comp3-price-per-sf` | Price/SF | - |
| `comp3-price-per-unit` | Price/Unit | - |
| `comp3-proj-amenities` | Project Amenities | - |
| `comp3-property-rights` | Property Rights | - |
| `comp3-province` | Province | - |
| `comp3-quality` | Quality Rating | - |
| `comp3-sale-conditions` | Conditions of Sale | - |
| `comp3-sale-date` | Sale Date | - |
| `comp3-sale-price` | Sale Price | - |
| `comp3-sale-status` | Sale Status | - |
| `comp3-total-phys-adj` | Total Physical Adj % | - |
| `comp3-total-trans-adj` | Total Transactional Adj % | - |
| `comp3-trans-adj-price` | Transactional Adj Price | - |
| `comp3-unit-amenities` | Unit Amenities | - |
| `comp3-units` | Units | - |
| `comp3-year` | Year Built | - |
| `comp4-access` | Access Rating | - |
| `comp4-address` | Address | - |
| `comp4-adj-price-per-unit` | Adjusted Price/Unit | - |
| `comp4-appeal` | Appeal Rating | - |
| `comp4-cap-rate` | Cap Rate (%) | - |
| `comp4-city` | City | - |
| `comp4-condition` | Condition Rating | - |
| `comp4-expenditures-after` | Expenditures After Sale | - |
| `comp4-exposure` | Exposure Rating | - |
| `comp4-financing` | Financing | - |
| `comp4-gba` | GBA (SF) | - |
| `comp4-gross-adj` | Gross Adjustment % | - |
| `comp4-location` | Location Rating | - |
| `comp4-market-conditions` | Market Conditions | - |
| `comp4-name` | Property Name | - |
| `comp4-net-adj` | Net Adjustment % | - |
| `comp4-noi` | NOI | - |
| `comp4-noi-per-unit` | NOI/Unit | - |
| `comp4-occupancy` | Occupancy % | - |
| `comp4-parking-type` | Parking Type | - |
| `comp4-postal-code` | Postal Code | - |
| `comp4-price-per-sf` | Price/SF | - |
| `comp4-price-per-unit` | Price/Unit | - |
| `comp4-proj-amenities` | Project Amenities | - |
| `comp4-property-rights` | Property Rights | - |
| `comp4-province` | Province | - |
| `comp4-quality` | Quality Rating | - |
| `comp4-sale-conditions` | Conditions of Sale | - |
| `comp4-sale-date` | Sale Date | - |
| `comp4-sale-price` | Sale Price | - |
| `comp4-sale-status` | Sale Status | - |
| `comp4-total-phys-adj` | Total Physical Adj % | - |
| `comp4-total-trans-adj` | Total Transactional Adj % | - |
| `comp4-trans-adj-price` | Transactional Adj Price | - |
| `comp4-unit-amenities` | Unit Amenities | - |
| `comp4-units` | Units | - |
| `comp4-year` | Year Built | - |
| `comp5-access` | Access Rating | - |
| `comp5-address` | Address | - |
| `comp5-adj-price-per-unit` | Adjusted Price/Unit | - |
| `comp5-appeal` | Appeal Rating | - |
| `comp5-cap-rate` | Cap Rate (%) | - |
| `comp5-city` | City | - |
| `comp5-condition` | Condition Rating | - |
| `comp5-expenditures-after` | Expenditures After Sale | - |
| `comp5-exposure` | Exposure Rating | - |
| `comp5-financing` | Financing | - |
| `comp5-gba` | GBA (SF) | - |
| `comp5-gross-adj` | Gross Adjustment % | - |
| `comp5-location` | Location Rating | - |
| `comp5-market-conditions` | Market Conditions | - |
| `comp5-name` | Property Name | - |
| `comp5-net-adj` | Net Adjustment % | - |
| `comp5-noi` | NOI | - |
| `comp5-noi-per-unit` | NOI/Unit | - |
| `comp5-occupancy` | Occupancy % | - |
| `comp5-parking-type` | Parking Type | - |
| `comp5-postal-code` | Postal Code | - |
| `comp5-price-per-sf` | Price/SF | - |
| `comp5-price-per-unit` | Price/Unit | - |
| `comp5-proj-amenities` | Project Amenities | - |
| `comp5-property-rights` | Property Rights | - |
| `comp5-province` | Province | - |
| `comp5-quality` | Quality Rating | - |
| `comp5-sale-conditions` | Conditions of Sale | - |
| `comp5-sale-date` | Sale Date | - |
| `comp5-sale-price` | Sale Price | - |
| `comp5-sale-status` | Sale Status | - |
| `comp5-total-phys-adj` | Total Physical Adj % | - |
| `comp5-total-trans-adj` | Total Transactional Adj % | - |
| `comp5-trans-adj-price` | Transactional Adj Price | - |
| `comp5-unit-amenities` | Unit Amenities | - |
| `comp5-units` | Units | - |
| `comp5-year` | Year Built | - |
| `dca-avg-final-price` | Avg Final Price | - |
| `dca-avg-gross-adj` | Avg Gross Adj % | - |
| `dca-avg-net-adj` | Avg Net Adj % | - |
| `dca-avg-phys-adj` | Avg Physical Adj % | - |
| `dca-avg-price-per-unit` | Avg Price/Unit | - |
| `dca-avg-trans-adj` | Avg Trans Adj % | - |
| `dca-avg-trans-adj-price` | Avg Trans Adj Price | - |
| `dca-high-final-price` | High Final Price | - |
| `dca-high-gross-adj` | High Gross Adj % | - |
| `dca-high-net-adj` | High Net Adj % | - |
| `dca-high-phys-adj` | High Physical Adj % | - |
| `dca-high-price-per-unit` | High Price/Unit | - |
| `dca-high-trans-adj` | High Trans Adj % | - |
| `dca-high-trans-adj-price` | High Trans Adj Price | - |
| `dca-low-final-price` | Low Final Price | - |
| `dca-low-gross-adj` | Low Gross Adj % | - |
| `dca-low-net-adj` | Low Net Adj % | - |
| `dca-low-phys-adj` | Low Physical Adj % | - |
| `dca-low-price-per-unit` | Low Price/Unit | - |
| `dca-low-trans-adj` | Low Trans Adj % | - |
| `dca-low-trans-adj-price` | Low Trans Adj Price | - |
| `dca-med-final-price` | Median Final Price | - |
| `dca-med-gross-adj` | Median Gross Adj % | - |
| `dca-med-net-adj` | Median Net Adj % | - |
| `dca-med-phys-adj` | Median Physical Adj % | - |
| `dca-med-price-per-unit` | Median Price/Unit | - |
| `dca-med-trans-adj` | Median Trans Adj % | - |
| `dca-med-trans-adj-price` | Median Trans Adj Price | - |
| `dca-price-per-unit-concluded` | Concluded Price Per Unit | - |
| `dca-price-per-unit-high` | Price Per Unit High | - |
| `dca-price-per-unit-low` | Price Per Unit Low | - |
| `sales-adjustment-summary` | Adjustment Summary | - |
| `sales-value-indication` | Sales Comparison Value | - |
| `sca-concluded-value-per-unit` | Concluded Value/Unit | - |
| `sca-indicated-value` | SCA Indicated Value | - |
| `sca-indicated-value-rounded` | SCA Indicated Value (Rounded) | - |
| `sca-value-per-sf` | SCA Value/SF | - |
| `subject-access-rating` | Access Rating | - |
| `subject-appeal-rating` | Appeal Rating | - |
| `subject-condition` | Condition | - |
| `subject-exposure-rating` | Exposure Rating | - |
| `subject-gba` | Gross Building Area (SF) | - |
| `subject-location-rating` | Location Rating | - |
| `subject-parking` | Parking Ratio | - |
| `subject-proj-amenities` | Project Amenities | - |
| `subject-quality-rating` | Quality Rating | - |
| `subject-site-area` | Site Area (SF) | - |
| `subject-unit-amenities` | Unit Amenities | - |
| `subject-units` | Number of Units | - |
| `subject-year` | Year Built | - |


## Section: `site` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `accessibility` | Accessibility | - |
| `adjacent-east` | East | - |
| `adjacent-north` | North | - |
| `adjacent-south` | South | - |
| `adjacent-west` | West | - |
| `building-appeal` | Building Appeal | - |
| `building-quality` | Building Quality | - |
| `easements` | Easements & Encroachments | - |
| `exposure-visibility` | Exposure & Visibility | - |
| `hazardous-waste` | Environmental Concerns | - |
| `land-area-usable-acres` | Usable Land Area (Acres) | - |
| `land-area-usable-sf` | Usable Land Area (SF) | - |
| `legal-description` | Legal Description | - |
| `site-acreage` | Site Acreage | - |
| `site-address` | Site Address | - |
| `site-conclusion` | Site Conclusion | - |
| `site-plan-image` | Site Plan Images | - |
| `site-quality` | Site Quality | - |
| `site-rating` | Site Rating | - |
| `site-shape` | Shape | - |
| `site-total-area` | Total Site Area (SF) | - |
| `site-utility` | Site Utility | - |
| `soils` | Soils | - |
| `topography` | Topography | - |


## Section: `survey` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `contract-to-market-pct` | Contract to Market % | - |
| `rent-1br-avg` | 1BR Average Rent | - |
| `rent-1br-concluded-psf` | 1BR Concluded Rent/SF | - |
| `rent-1br-concluded-rent` | 1BR Concluded Rent | - |
| `rent-1br-concluded-sf` | 1BR Concluded SF | - |
| `rent-1br-high` | 1BR High Rent | - |
| `rent-1br-low` | 1BR Low Rent | - |
| `rent-1br-median` | 1BR Median Rent | - |
| `rent-2br-avg` | 2BR Average Rent | - |
| `rent-2br-concluded-psf` | 2BR Concluded Rent/SF | - |
| `rent-2br-concluded-rent` | 2BR Concluded Rent | - |
| `rent-2br-concluded-sf` | 2BR Concluded SF | - |
| `rent-2br-high` | 2BR High Rent | - |
| `rent-2br-low` | 2BR Low Rent | - |
| `rent-2br-median` | 2BR Median Rent | - |
| `survey-1br-avg-psf` | 1BR Average PSF | - |
| `survey-1br-avg-rent` | 1BR Average Rent | - |
| `survey-2br-avg-psf` | 2BR Average PSF | - |
| `survey-2br-avg-rent` | 2BR Average Rent | - |
| `survey-conclusion` | Rental Survey Conclusion | - |
| `survey-intro` | Rental Survey Introduction | - |
| `survey-market-rent-support` | Market Rent Support Narrative | - |
| `survey-methodology` | Survey Methodology | - |
| `survey1-1br-psf` | 1BR Rent/SF | - |
| `survey1-1br-rent` | 1BR Rent/Mo | - |
| `survey1-1br-sf` | 1BR Avg SF | - |
| `survey1-2br-psf` | 2BR Rent/SF | - |
| `survey1-2br-rent` | 2BR Rent/Mo | - |
| `survey1-2br-sf` | 2BR Avg SF | - |
| `survey1-address` | Address | - |
| `survey1-amenities` | Amenities Rating | - |
| `survey1-appeal` | Appeal Rating | - |
| `survey1-city` | City | - |
| `survey1-condition` | Condition Rating | - |
| `survey1-distance` | Distance (km) | - |
| `survey1-laundry` | Laundry | - |
| `survey1-location` | Location Rating | - |
| `survey1-name` | Property Name | - |
| `survey1-parking` | Parking | - |
| `survey1-quality` | Quality Rating | - |
| `survey1-stories` | Stories | - |
| `survey1-units` | Total Units | - |
| `survey1-utilities` | Utilities Included | - |
| `survey1-year-built` | Year Built | - |
| `survey2-1br-psf` | 1BR Rent/SF | - |
| `survey2-1br-rent` | 1BR Rent/Mo | - |
| `survey2-1br-sf` | 1BR Avg SF | - |
| `survey2-2br-psf` | 2BR Rent/SF | - |
| `survey2-2br-rent` | 2BR Rent/Mo | - |
| `survey2-2br-sf` | 2BR Avg SF | - |
| `survey2-address` | Address | - |
| `survey2-amenities` | Amenities Rating | - |
| `survey2-appeal` | Appeal Rating | - |
| `survey2-city` | City | - |
| `survey2-condition` | Condition Rating | - |
| `survey2-distance` | Distance (km) | - |
| `survey2-laundry` | Laundry | - |
| `survey2-location` | Location Rating | - |
| `survey2-name` | Property Name | - |
| `survey2-parking` | Parking | - |
| `survey2-quality` | Quality Rating | - |
| `survey2-stories` | Stories | - |
| `survey2-units` | Total Units | - |
| `survey2-utilities` | Utilities Included | - |
| `survey2-year-built` | Year Built | - |
| `survey3-1br-psf` | 1BR Rent/SF | - |
| `survey3-1br-rent` | 1BR Rent/Mo | - |
| `survey3-1br-sf` | 1BR Avg SF | - |
| `survey3-2br-psf` | 2BR Rent/SF | - |
| `survey3-2br-rent` | 2BR Rent/Mo | - |
| `survey3-2br-sf` | 2BR Avg SF | - |
| `survey3-address` | Address | - |
| `survey3-amenities` | Amenities Rating | - |
| `survey3-appeal` | Appeal Rating | - |
| `survey3-city` | City | - |
| `survey3-condition` | Condition Rating | - |
| `survey3-distance` | Distance (km) | - |
| `survey3-laundry` | Laundry | - |
| `survey3-location` | Location Rating | - |
| `survey3-name` | Property Name | - |
| `survey3-parking` | Parking | - |
| `survey3-quality` | Quality Rating | - |
| `survey3-stories` | Stories | - |
| `survey3-units` | Total Units | - |
| `survey3-utilities` | Utilities Included | - |
| `survey3-year-built` | Year Built | - |
| `survey4-1br-psf` | 1BR Rent/SF | - |
| `survey4-1br-rent` | 1BR Rent/Mo | - |
| `survey4-1br-sf` | 1BR Avg SF | - |
| `survey4-2br-psf` | 2BR Rent/SF | - |
| `survey4-2br-rent` | 2BR Rent/Mo | - |
| `survey4-2br-sf` | 2BR Avg SF | - |
| `survey4-address` | Address | - |
| `survey4-amenities` | Amenities Rating | - |
| `survey4-appeal` | Appeal Rating | - |
| `survey4-city` | City | - |
| `survey4-condition` | Condition Rating | - |
| `survey4-distance` | Distance (km) | - |
| `survey4-laundry` | Laundry | - |
| `survey4-location` | Location Rating | - |
| `survey4-name` | Property Name | - |
| `survey4-parking` | Parking | - |
| `survey4-quality` | Quality Rating | - |
| `survey4-stories` | Stories | - |
| `survey4-units` | Total Units | - |
| `survey4-utilities` | Utilities Included | - |
| `survey4-year-built` | Year Built | - |
| `survey5-1br-psf` | 1BR Rent/SF | - |
| `survey5-1br-rent` | 1BR Rent/Mo | - |
| `survey5-1br-sf` | 1BR Avg SF | - |
| `survey5-2br-psf` | 2BR Rent/SF | - |
| `survey5-2br-rent` | 2BR Rent/Mo | - |
| `survey5-2br-sf` | 2BR Avg SF | - |
| `survey5-address` | Address | - |
| `survey5-amenities` | Amenities Rating | - |
| `survey5-appeal` | Appeal Rating | - |
| `survey5-city` | City | - |
| `survey5-condition` | Condition Rating | - |
| `survey5-distance` | Distance (km) | - |
| `survey5-laundry` | Laundry | - |
| `survey5-location` | Location Rating | - |
| `survey5-name` | Property Name | - |
| `survey5-parking` | Parking | - |
| `survey5-quality` | Quality Rating | - |
| `survey5-stories` | Stories | - |
| `survey5-units` | Total Units | - |
| `survey5-utilities` | Utilities Included | - |
| `survey5-year-built` | Year Built | - |


## Section: `tax` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `annual-taxes` | Annual Taxes | - |
| `assessment-year` | Assessment Year | - |
| `building-assessment` | Building Assessment | - |
| `land-assessment` | Land Assessment | - |
| `mill-rate` | Mill Rate | - |
| `tax-commentary` | Tax Commentary | - |
| `total-assessment` | Total Assessment | - |


## Section: `zone` (1 fields)

| Field ID | Label | Valcre Range |
|----------|-------|-------------|
| `max-density` | Max Density | - |
| `max-height` | Max Height | - |
| `min-setback` | Min Setback | - |
| `parking-requirements` | Parking Requirements | - |
| `permitted-uses` | Permitted Uses | - |
| `site-coverage` | Site Coverage | - |
| `zone-conditional-uses` | Conditional Uses | - |
| `zone-minimum-lot-size` | Minimum Lot Size | - |
| `zone-setbacks` | Setback Requirements | - |
| `zoning-classification` | Zoning Classification | - |
| `zoning-conclusion` | Zoning Conclusion | - |
| `zoning-conformance` | Conformance | - |
| `zoning-description` | Zoning Description | - |
| `zoning-map` | Zoning Map | - |

---

## Summary by Section

| Section | Field Count |
|---------|-------------|
| `calc` | 165 |
| `cert` | 16 |
| `client-intake` | 18 |
| `cost-s` | 1 |
| `cover` | 40 |
| `exec` | 29 |
| `expenses` | 7 |
| `hbu` | 7 |
| `hist` | 51 |
| `home` | 2 |
| `image-mgt` | 55 |
| `impv` | 42 |
| `income` | 5 |
| `land1` | 1 |
| `location` | 9 |
| `loe-prep` | 11 |
| `maps` | 3 |
| `market` | 14 |
| `photos` | 5 |
| `recon` | 14 |
| `rentroll` | 37 |
| `report` | 4 |
| `sales` | 235 |
| `site` | 24 |
| `survey` | 128 |
| `tax` | 7 |
| `zone` | 14 |

**Total:** 944 fields

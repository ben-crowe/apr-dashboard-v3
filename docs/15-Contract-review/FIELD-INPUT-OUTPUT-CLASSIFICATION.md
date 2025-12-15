# Field Input/Output Classification Report

**Generated:** classify-input-output-fields.py
**Purpose:** Classify all fieldRegistry.ts fields as user inputs vs calculator outputs

---

## Summary Statistics

| Category | Count | Description |
|----------|-------|-------------|
| **Total Fields** | 519 | All fields in fieldRegistry.ts |
| **📝 User Inputs** | 377 | Fields with inputSource='user-input' |
| **🔢 Registry Calculated** | 59 | Fields with inputSource='calculated' |
| **🌐 API Fetch** | 0 | Fields with inputSource='api-fetch' |
| **🤖 Auto-filled** | 83 | Fields with inputSource='auto-filled' |
| **🔢 Valcre Calculated** | 15 | Fields marked 🔢 in Valcre workbook |
| **❓ Unmapped** | 492 | Fields not found in Valcre directory |

---

## Data Flow Architecture

```
USER INPUTS (TDD Dashboard - Manual Entry)
    ↓
CALCULATOR ENGINE (External Valcre Code)
    ↓
CALCULATED OUTPUT FIELDS (~15 fields)
    ↓
REPORT TABLES (Expenses, Surveys, Comps)
```

---

## User Input Fields (377)

These fields are manually entered by users in the TDD Dashboard.

| Field ID | Valcre Match | Valcre Type | Confidence | Notes |
|----------|--------------|-------------|------------|-------|
| `accessibility` | `None` | None | None |  |
| `adjacent-east` | `None` | None | None |  |
| `adjacent-north` | `None` | None | None |  |
| `adjacent-south` | `None` | None | None |  |
| `adjacent-west` | `None` | None | None |  |
| `appraiser-aic-number` | `None` | None | None |  |
| `appraiser-credentials` | `None` | None | None |  |
| `appraiser-email` | `None` | None | None |  |
| `appraiser-name` | `None` | None | None |  |
| `appraiser-title` | `None` | None | None |  |
| `building-appeal` | `None` | None | None |  |
| `building-quality` | `None` | None | None |  |
| `calc-adj-capex` | `None` | None | None |  |
| `calc-adj-leasing` | `None` | None | None |  |
| `calc-adj-other` | `None` | None | None |  |
| `calc-bad-debt-rate` | `None` | None | None |  |
| `calc-cap-rate` | `None` | None | None |  |
| `calc-concessions-rate` | `None` | None | None |  |
| `calc-exp-admin` | `None` | None | None |  |
| `calc-exp-insurance` | `None` | None | None |  |
| `calc-exp-management` | `None` | None | None |  |
| `calc-exp-other` | `None` | None | None |  |
| `calc-exp-payroll` | `None` | None | None |  |
| `calc-exp-repairs` | `None` | None | None |  |
| `calc-exp-reserves` | `None` | None | None |  |
| `calc-exp-taxes` | `None` | None | None |  |
| `calc-exp-utilities` | `None` | None | None |  |
| `calc-laundry-per-unit` | `None` | None | None |  |
| `calc-other-income` | `None` | None | None |  |
| `calc-parking-per-unit` | `None` | None | None |  |
| `calc-type1-count` | `None` | None | None |  |
| `calc-type1-name` | `None` | None | None |  |
| `calc-type1-rent` | `None` | None | None |  |
| `calc-type1-sf` | `None` | None | None |  |
| `calc-type2-count` | `None` | None | None |  |
| `calc-type2-name` | `None` | None | None |  |
| `calc-type2-rent` | `None` | None | None |  |
| `calc-type2-sf` | `None` | None | None |  |
| `calc-type3-count` | `None` | None | None |  |
| `calc-type3-name` | `None` | None | None |  |
| `calc-type3-rent` | `None` | None | None |  |
| `calc-type3-sf` | `None` | None | None |  |
| `calc-type4-count` | `None` | None | None |  |
| `calc-type4-name` | `None` | None | None |  |
| `calc-type4-rent` | `None` | None | None |  |
| `calc-type4-sf` | `None` | None | None |  |
| `calc-vacancy-rate` | `None` | None | None |  |
| `ceilings` | `L_Ceilings` | 🔢 Calculated | partial | ⚠️ CONFLICT: Registry=user-input, Valcre=calculated |
| `cert-signature` | `None` | None | None |  |
| `client-address` | `Client_Address` | 🔢 Calculated | direct | ⚠️ CONFLICT: Registry=user-input, Valcre=calculated |
| `client-city` | `None` | None | None |  |
| `client-company` | `Client_Company` | 🔢 Calculated | direct | ⚠️ CONFLICT: Registry=user-input, Valcre=calculated |
| `client-contact-name` | `None` | None | None |  |
| `client-postal` | `None` | None | None |  |
| `client-province` | `None` | None | None |  |
| `comp1-address` | `None` | None | None |  |
| `comp1-cap-rate` | `None` | None | None |  |
| `comp1-gba` | `None` | None | None |  |
| `comp1-name` | `None` | None | None |  |
| `comp1-sale-date` | `None` | None | None |  |
| `comp1-sale-price` | `None` | None | None |  |
| `comp1-units` | `None` | None | None |  |
| `comp1-year` | `None` | None | None |  |
| `comp2-address` | `None` | None | None |  |
| `comp2-cap-rate` | `None` | None | None |  |
| `comp2-gba` | `None` | None | None |  |
| `comp2-name` | `None` | None | None |  |
| `comp2-sale-date` | `None` | None | None |  |
| `comp2-sale-price` | `None` | None | None |  |
| `comp2-units` | `None` | None | None |  |
| `comp2-year` | `None` | None | None |  |
| `comp3-address` | `None` | None | None |  |
| `comp3-cap-rate` | `None` | None | None |  |
| `comp3-gba` | `None` | None | None |  |
| `comp3-name` | `None` | None | None |  |
| `comp3-sale-date` | `None` | None | None |  |
| `comp3-sale-price` | `None` | None | None |  |
| `comp3-units` | `None` | None | None |  |
| `comp3-year` | `None` | None | None |  |
| `cost-approach-conclusion` | `None` | None | None |  |
| `cover-photo` | `None` | None | None |  |
| `doors-windows` | `L_DoorsWindows` | 🔢 Calculated | partial | ⚠️ CONFLICT: Registry=user-input, Valcre=calculated |
| `easements` | `None` | None | None |  |
| `economic-life` | `None` | None | None |  |
| `effective-age` | `None` | None | None |  |
| `electrical` | `L_Electrical` | 🔢 Calculated | partial | ⚠️ CONFLICT: Registry=user-input, Valcre=calculated |
| `elevator` | `L_Elevator` | 🔢 Calculated | partial | ⚠️ CONFLICT: Registry=user-input, Valcre=calculated |
| `exposure-visibility` | `None` | None | None |  |
| `exterior-walls` | `None` | None | None |  |
| `extraordinary-assumptions` | `None` | None | None |  |
| `extraordinary-limiting-conditions` | `None` | None | None |  |
| `fire-protection` | `None` | None | None |  |
| `flooring` | `None` | None | None |  |
| `foundation` | `L_Foundation` | 🔢 Calculated | partial | ⚠️ CONFLICT: Registry=user-input, Valcre=calculated |
| `functional-design` | `None` | None | None |  |
| `hazardous-materials` | `None` | None | None |  |
| `hazardous-waste` | `None` | None | None |  |
| `hbu-conclusion-text` | `None` | None | None |  |
| `hbu-improved` | `None` | None | None |  |
| `hbu-intro` | `None` | None | None |  |
| `hbu-vacant-financial` | `None` | None | None |  |
| `hbu-vacant-legal` | `None` | None | None |  |
| `hbu-vacant-physical` | `None` | None | None |  |
| `hbu-vacant-productive` | `None` | None | None |  |
| `hvac` | `None` | None | None |  |
| `hypothetical-conditions` | `None` | None | None |  |
| `img-common-1` | `None` | None | None |  |
| `img-common-1-caption` | `None` | None | None |  |
| `img-common-2` | `None` | None | None |  |
| `img-common-2-caption` | `None` | None | None |  |
| `img-common-3` | `None` | None | None |  |
| `img-common-3-caption` | `None` | None | None |  |
| `img-common-4` | `None` | None | None |  |
| `img-common-4-caption` | `None` | None | None |  |
| `img-cover-photo` | `None` | None | None |  |
| `img-exterior-1` | `None` | None | None |  |
| `img-exterior-1-caption` | `None` | None | None |  |
| `img-exterior-2` | `None` | None | None |  |
| `img-exterior-2-caption` | `None` | None | None |  |
| `img-exterior-3` | `None` | None | None |  |
| `img-exterior-3-caption` | `None` | None | None |  |
| `img-exterior-4` | `None` | None | None |  |
| `img-exterior-4-caption` | `None` | None | None |  |
| `img-exterior-5` | `None` | None | None |  |
| `img-exterior-5-caption` | `None` | None | None |  |
| `img-exterior-6` | `None` | None | None |  |
| `img-exterior-6-caption` | `None` | None | None |  |
| `img-map-aerial-1` | `Map_Aerial` | 📝 Input | partial |  |
| `img-map-aerial-2` | `Map_Aerial` | 📝 Input | partial |  |
| `img-map-local` | `Map_Local` | 📝 Input | partial |  |
| `img-map-regional` | `Map_Regional` | 📝 Input | partial |  |
| `img-signature` | `None` | None | None |  |
| `img-site-plan-1` | `None` | None | None |  |
| `img-site-plan-2` | `None` | None | None |  |
| `img-street-1` | `None` | None | None |  |
| `img-street-1-caption` | `None` | None | None |  |
| `img-street-2` | `None` | None | None |  |
| `img-street-2-caption` | `None` | None | None |  |
| `img-street-3` | `None` | None | None |  |
| `img-street-3-caption` | `None` | None | None |  |
| `img-systems-1` | `None` | None | None |  |
| `img-systems-1-caption` | `None` | None | None |  |
| `img-systems-2` | `None` | None | None |  |
| `img-systems-2-caption` | `None` | None | None |  |
| `img-systems-3` | `None` | None | None |  |
| `img-systems-3-caption` | `None` | None | None |  |
| `img-systems-4` | `None` | None | None |  |
| `img-systems-4-caption` | `None` | None | None |  |
| `img-unit-1` | `None` | None | None |  |
| `img-unit-1-caption` | `None` | None | None |  |
| `img-unit-2` | `None` | None | None |  |
| `img-unit-2-caption` | `None` | None | None |  |
| `img-unit-3` | `None` | None | None |  |
| `img-unit-3-caption` | `None` | None | None |  |
| `img-unit-4` | `None` | None | None |  |
| `img-unit-4-caption` | `None` | None | None |  |
| `img-unit-5` | `None` | None | None |  |
| `img-unit-5-caption` | `None` | None | None |  |
| `img-unit-6` | `None` | None | None |  |
| `img-unit-6-caption` | `None` | None | None |  |
| `img-zoning-map` | `None` | None | None |  |
| `impv-insulation` | `None` | None | None |  |
| `impv-interior-finish` | `None` | None | None |  |
| `impv-overview` | `None` | None | None |  |
| `impv-roof-condition` | `None` | None | None |  |
| `income-cap-rate-analysis` | `None` | None | None |  |
| `income-expense-narrative` | `None` | None | None |  |
| `income-noi-narrative` | `None` | None | None |  |
| `income-pgi-narrative` | `None` | None | None |  |
| `intake-asset-condition` | `None` | None | None |  |
| `intake-client-address` | `None` | None | None |  |
| `intake-client-email` | `None` | None | None |  |
| `intake-client-first-name` | `None` | None | None |  |
| `intake-client-last-name` | `None` | None | None |  |
| `intake-client-organization` | `None` | None | None |  |
| `intake-client-phone` | `None` | None | None |  |
| `intake-client-title` | `None` | None | None |  |
| `intake-contact-email` | `None` | None | None |  |
| `intake-contact-first-name` | `None` | None | None |  |
| `intake-contact-last-name` | `None` | None | None |  |
| `intake-contact-phone` | `None` | None | None |  |
| `intake-intended-use` | `None` | None | None |  |
| `intake-notes` | `None` | None | None |  |
| `intake-property-address` | `None` | None | None |  |
| `intake-property-name` | `None` | None | None |  |
| `intake-property-type` | `None` | None | None |  |
| `intake-valuation-premises` | `None` | None | None |  |
| `interior-walls` | `None` | None | None |  |
| `land-area-usable-acres` | `None` | None | None |  |
| `land-area-usable-sf` | `None` | None | None |  |
| `land-value-conclusion` | `None` | None | None |  |
| `landscaping` | `L_Landscaping` | 📝 Input | partial |  |
| `laundry` | `None` | None | None |  |
| `legal-description` | `None` | None | None |  |
| `local-area-description` | `None` | None | None |  |
| `local-market` | `None` | None | None |  |
| `location-access` | `None` | None | None |  |
| `location-nearby-amenities` | `None` | None | None |  |
| `location-overview-text` | `None` | None | None |  |
| `loe-appraisal-fee` | `None` | None | None |  |
| `loe-appraiser-comments` | `None` | None | None |  |
| `loe-delivery-date` | `None` | None | None |  |
| `loe-internal-comments` | `None` | None | None |  |
| `loe-payment-terms` | `None` | None | None |  |
| `loe-property-rights` | `None` | None | None |  |
| `loe-report-type` | `None` | None | None |  |
| `loe-retainer-amount` | `None` | None | None |  |
| `loe-scope-of-work` | `None` | None | None |  |
| `loe-special-instructions` | `None` | None | None |  |
| `loe-valcre-job-id` | `None` | None | None |  |
| `map-aerial` | `Map_Aerial` | 📝 Input | direct |  |
| `map-local` | `Map_Local` | 📝 Input | direct |  |
| `map-regional` | `Map_Regional` | 📝 Input | direct |  |
| `market` | `None` | None | None |  |
| `market-demand-drivers` | `None` | None | None |  |
| `market-local-employment` | `None` | None | None |  |
| `market-local-population` | `None` | None | None |  |
| `market-national-gdp` | `None` | None | None |  |
| `market-national-inflation` | `None` | None | None |  |
| `market-provincial-key-industries` | `None` | None | None |  |
| `market-provincial-unemployment` | `None` | None | None |  |
| `market-supply-pipeline` | `None` | None | None |  |
| `multifamily-overview` | `None` | None | None |  |
| `national-overview` | `None` | None | None |  |
| `nearby-schools` | `None` | None | None |  |
| `overall-condition` | `None` | None | None |  |
| `permitted-uses` | `None` | None | None |  |
| `photos-common` | `None` | None | None |  |
| `photos-exterior` | `None` | None | None |  |
| `photos-street` | `None` | None | None |  |
| `photos-systems` | `None` | None | None |  |
| `photos-units` | `None` | None | None |  |
| `plumbing` | `L_Plumbing` | 🔢 Calculated | partial | ⚠️ CONFLICT: Registry=user-input, Valcre=calculated |
| `project-amenities` | `None` | None | None |  |
| `property-is-listed` | `None` | None | None |  |
| `property-rights` | `None` | None | None |  |
| `provincial-overview` | `None` | None | None |  |
| `public-transit` | `None` | None | None |  |
| `recon-cost-value` | `None` | None | None |  |
| `recon-cost-weight` | `None` | None | None |  |
| `recon-income-weight` | `None` | None | None |  |
| `recon-narrative` | `None` | None | None |  |
| `recon-sales-value` | `None` | None | None |  |
| `recon-sales-weight` | `None` | None | None |  |
| `rent-1br-concluded-rent` | `None` | None | None |  |
| `rent-1br-concluded-sf` | `None` | None | None |  |
| `rent-2br-concluded-rent` | `None` | None | None |  |
| `rent-2br-concluded-sf` | `None` | None | None |  |
| `rent-trend` | `None` | None | None |  |
| `report-purpose` | `None` | None | None |  |
| `report-scope` | `None` | None | None |  |
| `roof` | `None` | None | None |  |
| `sales-adjustment-summary` | `None` | None | None |  |
| `sales-value-indication` | `None` | None | None |  |
| `security` | `None` | None | None |  |
| `site-conclusion` | `None` | None | None |  |
| `site-impv` | `CA_SiteImpv` | 📝 Input | partial |  |
| `site-plan-image` | `None` | None | None |  |
| `site-quality` | `None` | None | None |  |
| `site-rating` | `None` | None | None |  |
| `site-shape` | `None` | None | None |  |
| `site-utility` | `None` | None | None |  |
| `soils` | `None` | None | None |  |
| `subject-condition` | `Subject_Condition` | 🔢 Calculated | direct | ⚠️ CONFLICT: Registry=user-input, Valcre=calculated |
| `submarket` | `PwC_Submarket_1` | 📝 Input | partial |  |
| `survey-conclusion` | `None` | None | None |  |
| `survey-intro` | `None` | None | None |  |
| `survey-market-rent-support` | `None` | None | None |  |
| `survey-methodology` | `None` | None | None |  |
| `survey1-1br-rent` | `None` | None | None |  |
| `survey1-1br-sf` | `None` | None | None |  |
| `survey1-2br-rent` | `None` | None | None |  |
| `survey1-2br-sf` | `None` | None | None |  |
| `survey1-address` | `None` | None | None |  |
| `survey1-amenities` | `None` | None | None |  |
| `survey1-appeal` | `None` | None | None |  |
| `survey1-city` | `None` | None | None |  |
| `survey1-condition` | `None` | None | None |  |
| `survey1-distance` | `None` | None | None |  |
| `survey1-laundry` | `None` | None | None |  |
| `survey1-location` | `None` | None | None |  |
| `survey1-name` | `None` | None | None |  |
| `survey1-parking` | `None` | None | None |  |
| `survey1-quality` | `None` | None | None |  |
| `survey1-stories` | `None` | None | None |  |
| `survey1-units` | `None` | None | None |  |
| `survey1-utilities` | `None` | None | None |  |
| `survey1-year-built` | `None` | None | None |  |
| `survey2-1br-rent` | `None` | None | None |  |
| `survey2-1br-sf` | `None` | None | None |  |
| `survey2-2br-rent` | `None` | None | None |  |
| `survey2-2br-sf` | `None` | None | None |  |
| `survey2-address` | `None` | None | None |  |
| `survey2-amenities` | `None` | None | None |  |
| `survey2-appeal` | `None` | None | None |  |
| `survey2-city` | `None` | None | None |  |
| `survey2-condition` | `None` | None | None |  |
| `survey2-distance` | `None` | None | None |  |
| `survey2-laundry` | `None` | None | None |  |
| `survey2-location` | `None` | None | None |  |
| `survey2-name` | `None` | None | None |  |
| `survey2-parking` | `None` | None | None |  |
| `survey2-quality` | `None` | None | None |  |
| `survey2-stories` | `None` | None | None |  |
| `survey2-units` | `None` | None | None |  |
| `survey2-utilities` | `None` | None | None |  |
| `survey2-year-built` | `None` | None | None |  |
| `survey3-1br-rent` | `None` | None | None |  |
| `survey3-1br-sf` | `None` | None | None |  |
| `survey3-2br-rent` | `None` | None | None |  |
| `survey3-2br-sf` | `None` | None | None |  |
| `survey3-address` | `None` | None | None |  |
| `survey3-amenities` | `None` | None | None |  |
| `survey3-appeal` | `None` | None | None |  |
| `survey3-city` | `None` | None | None |  |
| `survey3-condition` | `None` | None | None |  |
| `survey3-distance` | `None` | None | None |  |
| `survey3-laundry` | `None` | None | None |  |
| `survey3-location` | `None` | None | None |  |
| `survey3-name` | `None` | None | None |  |
| `survey3-parking` | `None` | None | None |  |
| `survey3-quality` | `None` | None | None |  |
| `survey3-stories` | `None` | None | None |  |
| `survey3-units` | `None` | None | None |  |
| `survey3-utilities` | `None` | None | None |  |
| `survey3-year-built` | `None` | None | None |  |
| `survey4-1br-rent` | `None` | None | None |  |
| `survey4-1br-sf` | `None` | None | None |  |
| `survey4-2br-rent` | `None` | None | None |  |
| `survey4-2br-sf` | `None` | None | None |  |
| `survey4-address` | `None` | None | None |  |
| `survey4-amenities` | `None` | None | None |  |
| `survey4-appeal` | `None` | None | None |  |
| `survey4-city` | `None` | None | None |  |
| `survey4-condition` | `None` | None | None |  |
| `survey4-distance` | `None` | None | None |  |
| `survey4-laundry` | `None` | None | None |  |
| `survey4-location` | `None` | None | None |  |
| `survey4-name` | `None` | None | None |  |
| `survey4-parking` | `None` | None | None |  |
| `survey4-quality` | `None` | None | None |  |
| `survey4-stories` | `None` | None | None |  |
| `survey4-units` | `None` | None | None |  |
| `survey4-utilities` | `None` | None | None |  |
| `survey4-year-built` | `None` | None | None |  |
| `survey5-1br-rent` | `None` | None | None |  |
| `survey5-1br-sf` | `None` | None | None |  |
| `survey5-2br-rent` | `None` | None | None |  |
| `survey5-2br-sf` | `None` | None | None |  |
| `survey5-address` | `None` | None | None |  |
| `survey5-amenities` | `None` | None | None |  |
| `survey5-appeal` | `None` | None | None |  |
| `survey5-city` | `None` | None | None |  |
| `survey5-condition` | `None` | None | None |  |
| `survey5-distance` | `None` | None | None |  |
| `survey5-laundry` | `None` | None | None |  |
| `survey5-location` | `None` | None | None |  |
| `survey5-name` | `None` | None | None |  |
| `survey5-parking` | `None` | None | None |  |
| `survey5-quality` | `None` | None | None |  |
| `survey5-stories` | `None` | None | None |  |
| `survey5-units` | `None` | None | None |  |
| `survey5-utilities` | `None` | None | None |  |
| `survey5-year-built` | `None` | None | None |  |
| `tax-commentary` | `None` | None | None |  |
| `tenancy` | `L_Tenancy` | 📝 Input | partial |  |
| `topography` | `L_Topography` | 📝 Input | partial |  |
| `transmittal-body` | `None` | None | None |  |
| `unit-amenities` | `None` | None | None |  |
| `use-dcf-methodology` | `None` | None | None |  |
| `valuation-date` | `None` | None | None |  |
| `value-scenario` | `Value_Scenario1` | 🔢 Calculated | partial | ⚠️ CONFLICT: Registry=user-input, Valcre=calculated |
| `zone-conditional-uses` | `None` | None | None |  |
| `zoning-conclusion` | `None` | None | None |  |
| `zoning-conformance` | `None` | None | None |  |
| `zoning-description` | `None` | None | None |  |
| `zoning-map` | `None` | None | None |  |


---

## Calculated Fields (Registry) (59)

These fields are marked as calculated in fieldRegistry.ts.

| Field ID | Valcre Match | Valcre Type | Confidence |
|----------|--------------|-------------|------------|
| `actual-age` | `None` | None | None |
| `calc-adj-total` | `None` | None | None |
| `calc-avg-rent-per-sf` | `None` | None | None |
| `calc-avg-rent-per-unit` | `None` | None | None |
| `calc-avg-unit-sf` | `None` | None | None |
| `calc-egr` | `None` | None | None |
| `calc-expense-ratio` | `None` | None | None |
| `calc-expenses-total` | `None` | None | None |
| `calc-grm` | `None` | None | None |
| `calc-indicated-value` | `None` | None | None |
| `calc-laundry-total` | `None` | None | None |
| `calc-noi` | `None` | None | None |
| `calc-noi-per-sf` | `None` | None | None |
| `calc-noi-per-unit` | `None` | None | None |
| `calc-parking-total` | `None` | None | None |
| `calc-pgr` | `None` | None | None |
| `calc-raw-value` | `None` | None | None |
| `calc-total-other-income` | `None` | None | None |
| `calc-total-rental-revenue` | `None` | None | None |
| `calc-total-sf` | `None` | None | None |
| `calc-total-units` | `None` | None | None |
| `calc-type1-annual` | `None` | None | None |
| `calc-type2-annual` | `None` | None | None |
| `calc-type3-annual` | `None` | None | None |
| `calc-type4-annual` | `None` | None | None |
| `calc-vacancy-loss` | `None` | None | None |
| `calc-value-per-sf` | `None` | None | None |
| `calc-value-per-unit` | `None` | None | None |
| `comp1-price-per-sf` | `None` | None | None |
| `comp1-price-per-unit` | `None` | None | None |
| `comp2-price-per-sf` | `None` | None | None |
| `comp2-price-per-unit` | `None` | None | None |
| `comp3-price-per-sf` | `None` | None | None |
| `comp3-price-per-unit` | `None` | None | None |
| `concluded-value` | `None` | None | None |
| `density-units-acre` | `None` | None | None |
| `income-value-indication` | `None` | None | None |
| `recon-final-value` | `None` | None | None |
| `remaining-useful-life` | `None` | None | None |
| `rent-1br-avg` | `None` | None | None |
| `rent-1br-concluded-psf` | `None` | None | None |
| `rent-1br-high` | `None` | None | None |
| `rent-1br-low` | `None` | None | None |
| `rent-1br-median` | `None` | None | None |
| `rent-2br-avg` | `None` | None | None |
| `rent-2br-concluded-psf` | `None` | None | None |
| `rent-2br-high` | `None` | None | None |
| `rent-2br-low` | `None` | None | None |
| `rent-2br-median` | `None` | None | None |
| `survey1-1br-psf` | `None` | None | None |
| `survey1-2br-psf` | `None` | None | None |
| `survey2-1br-psf` | `None` | None | None |
| `survey2-2br-psf` | `None` | None | None |
| `survey3-1br-psf` | `None` | None | None |
| `survey3-2br-psf` | `None` | None | None |
| `survey4-1br-psf` | `None` | None | None |
| `survey4-2br-psf` | `None` | None | None |
| `survey5-1br-psf` | `None` | None | None |
| `survey5-2br-psf` | `None` | None | None |


---

## Calculator Output Fields (Valcre) (15)

These fields are marked 🔢 Calculated in the Valcre workbook.
They are auto-generated by the external calculator engine.

| Field ID | Valcre Field Name | Registry Input Source |
|----------|-------------------|----------------------|
| `ceilings` | `L_Ceilings` | user-input |
| `client-address` | `Client_Address` | user-input |
| `client-company` | `Client_Company` | user-input |
| `doors-windows` | `L_DoorsWindows` | user-input |
| `electrical` | `L_Electrical` | user-input |
| `elevator` | `L_Elevator` | user-input |
| `foundation` | `L_Foundation` | user-input |
| `plumbing` | `L_Plumbing` | user-input |
| `report-date` | `Report_Date` | auto-filled |
| `report-type` | `L_ReportType` | auto-filled |
| `subject-condition` | `Subject_Condition` | user-input |
| `subject-gba` | `Subject_GBA` | auto-filled |
| `subject-parking` | `Subject_Parking` | auto-filled |
| `subject-units` | `Subject_Units` | auto-filled |
| `value-scenario` | `Value_Scenario1` | user-input |


---

## Unmapped Fields (492)

These fields exist in fieldRegistry.ts but have no match in MASTER-FIELD-DIRECTORY.md.
They may be:
- Custom dashboard fields without Valcre equivalents
- Fields with significantly different naming conventions
- New fields added to the dashboard

| Field ID | Registry Input Source | Possible Reason |
|----------|----------------------|-----------------|
| `accessibility` | user-input | Unknown - needs manual review |
| `actual-age` | calculated | Unknown - needs manual review |
| `adjacent-east` | user-input | Unknown - needs manual review |
| `adjacent-north` | user-input | Unknown - needs manual review |
| `adjacent-south` | user-input | Unknown - needs manual review |
| `adjacent-west` | user-input | Unknown - needs manual review |
| `annual-taxes` | auto-filled | Unknown - needs manual review |
| `appraiser-address` | auto-filled | Unknown - needs manual review |
| `appraiser-aic-number` | user-input | Unknown - needs manual review |
| `appraiser-city` | auto-filled | Unknown - needs manual review |
| `appraiser-company` | auto-filled | Unknown - needs manual review |
| `appraiser-credentials` | user-input | Unknown - needs manual review |
| `appraiser-email` | user-input | Unknown - needs manual review |
| `appraiser-name` | user-input | Unknown - needs manual review |
| `appraiser-phone` | auto-filled | Unknown - needs manual review |
| `appraiser-postal` | auto-filled | Unknown - needs manual review |
| `appraiser-province` | auto-filled | Unknown - needs manual review |
| `appraiser-title` | user-input | Unknown - needs manual review |
| `appraiser-website` | auto-filled | Unknown - needs manual review |
| `assessment-year` | auto-filled | Unknown - needs manual review |
| `bike-score` | auto-filled | Unknown - needs manual review |
| `building-appeal` | user-input | Unknown - needs manual review |
| `building-assessment` | auto-filled | Unknown - needs manual review |
| `building-format` | auto-filled | Unknown - needs manual review |
| `building-quality` | user-input | Unknown - needs manual review |
| `building-style` | auto-filled | Unknown - needs manual review |
| `calc-adj-capex` | user-input | Unknown - needs manual review |
| `calc-adj-leasing` | user-input | Unknown - needs manual review |
| `calc-adj-other` | user-input | Unknown - needs manual review |
| `calc-adj-total` | calculated | Unknown - needs manual review |
| `calc-avg-rent-per-sf` | calculated | Unknown - needs manual review |
| `calc-avg-rent-per-unit` | calculated | Unknown - needs manual review |
| `calc-avg-unit-sf` | calculated | Unknown - needs manual review |
| `calc-bad-debt-rate` | user-input | Unknown - needs manual review |
| `calc-cap-rate` | user-input | Unknown - needs manual review |
| `calc-concessions-rate` | user-input | Unknown - needs manual review |
| `calc-egr` | calculated | Unknown - needs manual review |
| `calc-exp-admin` | user-input | Unknown - needs manual review |
| `calc-exp-insurance` | user-input | Unknown - needs manual review |
| `calc-exp-management` | user-input | Unknown - needs manual review |
| `calc-exp-other` | user-input | Unknown - needs manual review |
| `calc-exp-payroll` | user-input | Unknown - needs manual review |
| `calc-exp-repairs` | user-input | Unknown - needs manual review |
| `calc-exp-reserves` | user-input | Unknown - needs manual review |
| `calc-exp-taxes` | user-input | Unknown - needs manual review |
| `calc-exp-utilities` | user-input | Unknown - needs manual review |
| `calc-expense-ratio` | calculated | Unknown - needs manual review |
| `calc-expenses-total` | calculated | Unknown - needs manual review |
| `calc-grm` | calculated | Unknown - needs manual review |
| `calc-indicated-value` | calculated | Unknown - needs manual review |
| `calc-laundry-per-unit` | user-input | Unknown - needs manual review |
| `calc-laundry-total` | calculated | Unknown - needs manual review |
| `calc-noi` | calculated | Unknown - needs manual review |
| `calc-noi-per-sf` | calculated | Unknown - needs manual review |
| `calc-noi-per-unit` | calculated | Unknown - needs manual review |
| `calc-other-income` | user-input | Unknown - needs manual review |
| `calc-parking-per-unit` | user-input | Unknown - needs manual review |
| `calc-parking-total` | calculated | Unknown - needs manual review |
| `calc-pgr` | calculated | Unknown - needs manual review |
| `calc-raw-value` | calculated | Unknown - needs manual review |
| `calc-total-other-income` | calculated | Unknown - needs manual review |
| `calc-total-rental-revenue` | calculated | Unknown - needs manual review |
| `calc-total-sf` | calculated | Unknown - needs manual review |
| `calc-total-units` | calculated | Unknown - needs manual review |
| `calc-type1-annual` | calculated | Unknown - needs manual review |
| `calc-type1-count` | user-input | Unknown - needs manual review |
| `calc-type1-name` | user-input | Unknown - needs manual review |
| `calc-type1-rent` | user-input | Unknown - needs manual review |
| `calc-type1-sf` | user-input | Unknown - needs manual review |
| `calc-type2-annual` | calculated | Unknown - needs manual review |
| `calc-type2-count` | user-input | Unknown - needs manual review |
| `calc-type2-name` | user-input | Unknown - needs manual review |
| `calc-type2-rent` | user-input | Unknown - needs manual review |
| `calc-type2-sf` | user-input | Unknown - needs manual review |
| `calc-type3-annual` | calculated | Unknown - needs manual review |
| `calc-type3-count` | user-input | Unknown - needs manual review |
| `calc-type3-name` | user-input | Unknown - needs manual review |
| `calc-type3-rent` | user-input | Unknown - needs manual review |
| `calc-type3-sf` | user-input | Unknown - needs manual review |
| `calc-type4-annual` | calculated | Unknown - needs manual review |
| `calc-type4-count` | user-input | Unknown - needs manual review |
| `calc-type4-name` | user-input | Unknown - needs manual review |
| `calc-type4-rent` | user-input | Unknown - needs manual review |
| `calc-type4-sf` | user-input | Unknown - needs manual review |
| `calc-vacancy-loss` | calculated | Unknown - needs manual review |
| `calc-vacancy-rate` | user-input | Unknown - needs manual review |
| `calc-value-per-sf` | calculated | Unknown - needs manual review |
| `calc-value-per-unit` | calculated | Unknown - needs manual review |
| `cert-sign-credentials` | auto-filled | Unknown - needs manual review |
| `cert-sign-date` | auto-filled | Unknown - needs manual review |
| `cert-sign-name` | auto-filled | Unknown - needs manual review |
| `cert-signature` | user-input | Unknown - needs manual review |
| `cert-statement-1` | auto-filled | Unknown - needs manual review |
| `cert-statement-10` | auto-filled | Unknown - needs manual review |
| `cert-statement-11` | auto-filled | Unknown - needs manual review |
| `cert-statement-12` | auto-filled | Unknown - needs manual review |
| `cert-statement-2` | auto-filled | Unknown - needs manual review |
| `cert-statement-3` | auto-filled | Unknown - needs manual review |
| `cert-statement-4` | auto-filled | Unknown - needs manual review |
| `cert-statement-5` | auto-filled | Unknown - needs manual review |
| `cert-statement-6` | auto-filled | Unknown - needs manual review |
| `cert-statement-7` | auto-filled | Unknown - needs manual review |
| `cert-statement-8` | auto-filled | Unknown - needs manual review |
| `cert-statement-9` | auto-filled | Unknown - needs manual review |
| `city` | auto-filled | Unknown - needs manual review |
| `client-city` | user-input | Unknown - needs manual review |
| `client-contact-name` | user-input | Unknown - needs manual review |
| `client-postal` | user-input | Unknown - needs manual review |
| `client-province` | user-input | Unknown - needs manual review |
| `comp1-address` | user-input | Unknown - needs manual review |
| `comp1-cap-rate` | user-input | Unknown - needs manual review |
| `comp1-gba` | user-input | Unknown - needs manual review |
| `comp1-name` | user-input | Unknown - needs manual review |
| `comp1-price-per-sf` | calculated | Unknown - needs manual review |
| `comp1-price-per-unit` | calculated | Unknown - needs manual review |
| `comp1-sale-date` | user-input | Unknown - needs manual review |
| `comp1-sale-price` | user-input | Unknown - needs manual review |
| `comp1-units` | user-input | Unknown - needs manual review |
| `comp1-year` | user-input | Unknown - needs manual review |
| `comp2-address` | user-input | Unknown - needs manual review |
| `comp2-cap-rate` | user-input | Unknown - needs manual review |
| `comp2-gba` | user-input | Unknown - needs manual review |
| `comp2-name` | user-input | Unknown - needs manual review |
| `comp2-price-per-sf` | calculated | Unknown - needs manual review |
| `comp2-price-per-unit` | calculated | Unknown - needs manual review |
| `comp2-sale-date` | user-input | Unknown - needs manual review |
| `comp2-sale-price` | user-input | Unknown - needs manual review |
| `comp2-units` | user-input | Unknown - needs manual review |
| `comp2-year` | user-input | Unknown - needs manual review |
| `comp3-address` | user-input | Unknown - needs manual review |
| `comp3-cap-rate` | user-input | Unknown - needs manual review |
| `comp3-gba` | user-input | Unknown - needs manual review |
| `comp3-name` | user-input | Unknown - needs manual review |
| `comp3-price-per-sf` | calculated | Unknown - needs manual review |
| `comp3-price-per-unit` | calculated | Unknown - needs manual review |
| `comp3-sale-date` | user-input | Unknown - needs manual review |
| `comp3-sale-price` | user-input | Unknown - needs manual review |
| `comp3-units` | user-input | Unknown - needs manual review |
| `comp3-year` | user-input | Unknown - needs manual review |
| `concluded-value` | calculated | Unknown - needs manual review |
| `cost-approach-conclusion` | user-input | Unknown - needs manual review |
| `cover-photo` | user-input | Unknown - needs manual review |
| `density-units-acre` | calculated | Unknown - needs manual review |
| `easements` | user-input | Unknown - needs manual review |
| `economic-life` | user-input | Unknown - needs manual review |
| `effective-age` | user-input | Unknown - needs manual review |
| `exposure-visibility` | user-input | Unknown - needs manual review |
| `exterior-walls` | user-input | Unknown - needs manual review |
| `extraordinary-assumptions` | user-input | Unknown - needs manual review |
| `extraordinary-limiting-conditions` | user-input | Unknown - needs manual review |
| `file-number` | auto-filled | Unknown - needs manual review |
| `fire-protection` | user-input | Unknown - needs manual review |
| `flooring` | user-input | Unknown - needs manual review |
| `functional-design` | user-input | Unknown - needs manual review |
| `gba` | auto-filled | Unknown - needs manual review |
| `hazardous-materials` | user-input | Unknown - needs manual review |
| `hazardous-waste` | user-input | Unknown - needs manual review |
| `hbu-conclusion-text` | user-input | Unknown - needs manual review |
| `hbu-improved` | user-input | Unknown - needs manual review |
| `hbu-intro` | user-input | Unknown - needs manual review |
| `hbu-vacant-financial` | user-input | Unknown - needs manual review |
| `hbu-vacant-legal` | user-input | Unknown - needs manual review |
| `hbu-vacant-physical` | user-input | Unknown - needs manual review |
| `hbu-vacant-productive` | user-input | Unknown - needs manual review |
| `hvac` | user-input | Unknown - needs manual review |
| `hypothetical-conditions` | user-input | Unknown - needs manual review |
| `img-common-1` | user-input | Image management (Dashboard-specific) |
| `img-common-1-caption` | user-input | Image management (Dashboard-specific) |
| `img-common-2` | user-input | Image management (Dashboard-specific) |
| `img-common-2-caption` | user-input | Image management (Dashboard-specific) |
| `img-common-3` | user-input | Image management (Dashboard-specific) |
| `img-common-3-caption` | user-input | Image management (Dashboard-specific) |
| `img-common-4` | user-input | Image management (Dashboard-specific) |
| `img-common-4-caption` | user-input | Image management (Dashboard-specific) |
| `img-cover-photo` | user-input | Image management (Dashboard-specific) |
| `img-exterior-1` | user-input | Image management (Dashboard-specific) |
| `img-exterior-1-caption` | user-input | Image management (Dashboard-specific) |
| `img-exterior-2` | user-input | Image management (Dashboard-specific) |
| `img-exterior-2-caption` | user-input | Image management (Dashboard-specific) |
| `img-exterior-3` | user-input | Image management (Dashboard-specific) |
| `img-exterior-3-caption` | user-input | Image management (Dashboard-specific) |
| `img-exterior-4` | user-input | Image management (Dashboard-specific) |
| `img-exterior-4-caption` | user-input | Image management (Dashboard-specific) |
| `img-exterior-5` | user-input | Image management (Dashboard-specific) |
| `img-exterior-5-caption` | user-input | Image management (Dashboard-specific) |
| `img-exterior-6` | user-input | Image management (Dashboard-specific) |
| `img-exterior-6-caption` | user-input | Image management (Dashboard-specific) |
| `img-signature` | user-input | Image management (Dashboard-specific) |
| `img-site-plan-1` | user-input | Image management (Dashboard-specific) |
| `img-site-plan-2` | user-input | Image management (Dashboard-specific) |
| `img-street-1` | user-input | Image management (Dashboard-specific) |
| `img-street-1-caption` | user-input | Image management (Dashboard-specific) |
| `img-street-2` | user-input | Image management (Dashboard-specific) |
| `img-street-2-caption` | user-input | Image management (Dashboard-specific) |
| `img-street-3` | user-input | Image management (Dashboard-specific) |
| `img-street-3-caption` | user-input | Image management (Dashboard-specific) |
| `img-systems-1` | user-input | Image management (Dashboard-specific) |
| `img-systems-1-caption` | user-input | Image management (Dashboard-specific) |
| `img-systems-2` | user-input | Image management (Dashboard-specific) |
| `img-systems-2-caption` | user-input | Image management (Dashboard-specific) |
| `img-systems-3` | user-input | Image management (Dashboard-specific) |
| `img-systems-3-caption` | user-input | Image management (Dashboard-specific) |
| `img-systems-4` | user-input | Image management (Dashboard-specific) |
| `img-systems-4-caption` | user-input | Image management (Dashboard-specific) |
| `img-unit-1` | user-input | Image management (Dashboard-specific) |
| `img-unit-1-caption` | user-input | Image management (Dashboard-specific) |
| `img-unit-2` | user-input | Image management (Dashboard-specific) |
| `img-unit-2-caption` | user-input | Image management (Dashboard-specific) |
| `img-unit-3` | user-input | Image management (Dashboard-specific) |
| `img-unit-3-caption` | user-input | Image management (Dashboard-specific) |
| `img-unit-4` | user-input | Image management (Dashboard-specific) |
| `img-unit-4-caption` | user-input | Image management (Dashboard-specific) |
| `img-unit-5` | user-input | Image management (Dashboard-specific) |
| `img-unit-5-caption` | user-input | Image management (Dashboard-specific) |
| `img-unit-6` | user-input | Image management (Dashboard-specific) |
| `img-unit-6-caption` | user-input | Image management (Dashboard-specific) |
| `img-zoning-map` | user-input | Image management (Dashboard-specific) |
| `impv-building-footprint` | auto-filled | Unknown - needs manual review |
| `impv-building-format` | auto-filled | Unknown - needs manual review |
| `impv-insulation` | user-input | Unknown - needs manual review |
| `impv-interior-finish` | user-input | Unknown - needs manual review |
| `impv-nra` | auto-filled | Unknown - needs manual review |
| `impv-num-buildings` | auto-filled | Unknown - needs manual review |
| `impv-num-units` | auto-filled | Unknown - needs manual review |
| `impv-overview` | user-input | Unknown - needs manual review |
| `impv-roof-condition` | user-input | Unknown - needs manual review |
| `impv-site-coverage` | auto-filled | Unknown - needs manual review |
| `impv-stories` | auto-filled | Unknown - needs manual review |
| `impv-year-built` | auto-filled | Unknown - needs manual review |
| `income-cap-rate-analysis` | user-input | Unknown - needs manual review |
| `income-expense-narrative` | user-input | Unknown - needs manual review |
| `income-noi-narrative` | user-input | Unknown - needs manual review |
| `income-pgi-narrative` | user-input | Unknown - needs manual review |
| `income-value-indication` | calculated | Unknown - needs manual review |
| `intake-asset-condition` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-client-address` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-client-email` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-client-first-name` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-client-last-name` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-client-organization` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-client-phone` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-client-title` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-contact-email` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-contact-first-name` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-contact-last-name` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-contact-phone` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-intended-use` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-notes` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-property-address` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-property-name` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-property-type` | user-input | Client intake form (V3 Dashboard specific) |
| `intake-valuation-premises` | user-input | Client intake form (V3 Dashboard specific) |
| `interior-walls` | user-input | Unknown - needs manual review |
| `land-area-usable-acres` | user-input | Unknown - needs manual review |
| `land-area-usable-sf` | user-input | Unknown - needs manual review |
| `land-assessment` | auto-filled | Unknown - needs manual review |
| `land-value-conclusion` | user-input | Unknown - needs manual review |
| `latitude` | auto-filled | Unknown - needs manual review |
| `laundry` | user-input | Unknown - needs manual review |
| `legal-description` | user-input | Unknown - needs manual review |
| `local-area-description` | user-input | Unknown - needs manual review |
| `local-market` | user-input | Unknown - needs manual review |
| `location-access` | user-input | Unknown - needs manual review |
| `location-nearby-amenities` | user-input | Unknown - needs manual review |
| `location-overview-text` | user-input | Unknown - needs manual review |
| `loe-appraisal-fee` | user-input | LOE/Quote section (V3 Dashboard specific) |
| `loe-appraiser-comments` | user-input | LOE/Quote section (V3 Dashboard specific) |
| `loe-delivery-date` | user-input | LOE/Quote section (V3 Dashboard specific) |
| `loe-internal-comments` | user-input | LOE/Quote section (V3 Dashboard specific) |
| `loe-payment-terms` | user-input | LOE/Quote section (V3 Dashboard specific) |
| `loe-property-rights` | user-input | LOE/Quote section (V3 Dashboard specific) |
| `loe-report-type` | user-input | LOE/Quote section (V3 Dashboard specific) |
| `loe-retainer-amount` | user-input | LOE/Quote section (V3 Dashboard specific) |
| `loe-scope-of-work` | user-input | LOE/Quote section (V3 Dashboard specific) |
| `loe-special-instructions` | user-input | LOE/Quote section (V3 Dashboard specific) |
| `loe-valcre-job-id` | user-input | LOE/Quote section (V3 Dashboard specific) |
| `longitude` | auto-filled | Unknown - needs manual review |
| `market` | user-input | Unknown - needs manual review |
| `market-demand-drivers` | user-input | Unknown - needs manual review |
| `market-local-employment` | user-input | Unknown - needs manual review |
| `market-local-population` | user-input | Unknown - needs manual review |
| `market-national-gdp` | user-input | Unknown - needs manual review |
| `market-national-inflation` | user-input | Unknown - needs manual review |
| `market-provincial-key-industries` | user-input | Unknown - needs manual review |
| `market-provincial-unemployment` | user-input | Unknown - needs manual review |
| `market-supply-pipeline` | user-input | Unknown - needs manual review |
| `market-vacancy-rate` | auto-filled | Unknown - needs manual review |
| `max-density` | auto-filled | Unknown - needs manual review |
| `max-height` | auto-filled | Unknown - needs manual review |
| `mill-rate` | auto-filled | Unknown - needs manual review |
| `min-setback` | auto-filled | Unknown - needs manual review |
| `multifamily-overview` | user-input | Unknown - needs manual review |
| `national-overview` | user-input | Unknown - needs manual review |
| `nearby-schools` | user-input | Unknown - needs manual review |
| `occupancy-rate` | auto-filled | Unknown - needs manual review |
| `overall-condition` | user-input | Unknown - needs manual review |
| `parking-ratio` | auto-filled | Unknown - needs manual review |
| `parking-requirements` | auto-filled | Unknown - needs manual review |
| `parking-spaces` | auto-filled | Unknown - needs manual review |
| `permitted-uses` | user-input | Unknown - needs manual review |
| `photos-common` | user-input | Unknown - needs manual review |
| `photos-exterior` | user-input | Unknown - needs manual review |
| `photos-street` | user-input | Unknown - needs manual review |
| `photos-systems` | user-input | Unknown - needs manual review |
| `photos-units` | user-input | Unknown - needs manual review |
| `postal-code` | auto-filled | Unknown - needs manual review |
| `project-amenities` | user-input | Unknown - needs manual review |
| `property-is-listed` | user-input | Unknown - needs manual review |
| `property-name` | auto-filled | Unknown - needs manual review |
| `property-rights` | user-input | Unknown - needs manual review |
| `property-type-display` | auto-filled | Unknown - needs manual review |
| `province` | auto-filled | Unknown - needs manual review |
| `provincial-overview` | user-input | Unknown - needs manual review |
| `public-transit` | user-input | Unknown - needs manual review |
| `recon-cost-value` | user-input | Unknown - needs manual review |
| `recon-cost-weight` | user-input | Unknown - needs manual review |
| `recon-effective-date` | auto-filled | Unknown - needs manual review |
| `recon-final-value` | calculated | Unknown - needs manual review |
| `recon-income-value` | auto-filled | Unknown - needs manual review |
| `recon-income-weight` | user-input | Unknown - needs manual review |
| `recon-narrative` | user-input | Unknown - needs manual review |
| `recon-sales-value` | user-input | Unknown - needs manual review |
| `recon-sales-weight` | user-input | Unknown - needs manual review |
| `recon-value-premise` | auto-filled | Unknown - needs manual review |
| `remaining-useful-life` | calculated | Unknown - needs manual review |
| `rent-1br-avg` | calculated | Unknown - needs manual review |
| `rent-1br-concluded-psf` | calculated | Unknown - needs manual review |
| `rent-1br-concluded-rent` | user-input | Unknown - needs manual review |
| `rent-1br-concluded-sf` | user-input | Unknown - needs manual review |
| `rent-1br-high` | calculated | Unknown - needs manual review |
| `rent-1br-low` | calculated | Unknown - needs manual review |
| `rent-1br-median` | calculated | Unknown - needs manual review |
| `rent-2br-avg` | calculated | Unknown - needs manual review |
| `rent-2br-concluded-psf` | calculated | Unknown - needs manual review |
| `rent-2br-concluded-rent` | user-input | Unknown - needs manual review |
| `rent-2br-concluded-sf` | user-input | Unknown - needs manual review |
| `rent-2br-high` | calculated | Unknown - needs manual review |
| `rent-2br-low` | calculated | Unknown - needs manual review |
| `rent-2br-median` | calculated | Unknown - needs manual review |
| `rent-trend` | user-input | Unknown - needs manual review |
| `report-compliance` | auto-filled | Unknown - needs manual review |
| `report-purpose` | user-input | Unknown - needs manual review |
| `report-scope` | user-input | Unknown - needs manual review |
| `roof` | user-input | Unknown - needs manual review |
| `sales-adjustment-summary` | user-input | Unknown - needs manual review |
| `sales-value-indication` | user-input | Unknown - needs manual review |
| `security` | user-input | Unknown - needs manual review |
| `site-acreage` | auto-filled | Unknown - needs manual review |
| `site-address` | auto-filled | Unknown - needs manual review |
| `site-conclusion` | user-input | Unknown - needs manual review |
| `site-coverage` | auto-filled | Unknown - needs manual review |
| `site-plan-image` | user-input | Unknown - needs manual review |
| `site-quality` | user-input | Unknown - needs manual review |
| `site-rating` | user-input | Unknown - needs manual review |
| `site-shape` | user-input | Unknown - needs manual review |
| `site-total-area` | auto-filled | Unknown - needs manual review |
| `site-utility` | user-input | Unknown - needs manual review |
| `soils` | user-input | Unknown - needs manual review |
| `stories` | auto-filled | Unknown - needs manual review |
| `street-address` | auto-filled | Unknown - needs manual review |
| `subject-site-area` | auto-filled | Unknown - needs manual review |
| `subject-year` | auto-filled | Unknown - needs manual review |
| `survey-conclusion` | user-input | Unknown - needs manual review |
| `survey-intro` | user-input | Unknown - needs manual review |
| `survey-market-rent-support` | user-input | Unknown - needs manual review |
| `survey-methodology` | user-input | Unknown - needs manual review |
| `survey1-1br-psf` | calculated | Unknown - needs manual review |
| `survey1-1br-rent` | user-input | Unknown - needs manual review |
| `survey1-1br-sf` | user-input | Unknown - needs manual review |
| `survey1-2br-psf` | calculated | Unknown - needs manual review |
| `survey1-2br-rent` | user-input | Unknown - needs manual review |
| `survey1-2br-sf` | user-input | Unknown - needs manual review |
| `survey1-address` | user-input | Unknown - needs manual review |
| `survey1-amenities` | user-input | Unknown - needs manual review |
| `survey1-appeal` | user-input | Unknown - needs manual review |
| `survey1-city` | user-input | Unknown - needs manual review |
| `survey1-condition` | user-input | Unknown - needs manual review |
| `survey1-distance` | user-input | Unknown - needs manual review |
| `survey1-laundry` | user-input | Unknown - needs manual review |
| `survey1-location` | user-input | Unknown - needs manual review |
| `survey1-name` | user-input | Unknown - needs manual review |
| `survey1-parking` | user-input | Unknown - needs manual review |
| `survey1-quality` | user-input | Unknown - needs manual review |
| `survey1-stories` | user-input | Unknown - needs manual review |
| `survey1-units` | user-input | Unknown - needs manual review |
| `survey1-utilities` | user-input | Unknown - needs manual review |
| `survey1-year-built` | user-input | Unknown - needs manual review |
| `survey2-1br-psf` | calculated | Unknown - needs manual review |
| `survey2-1br-rent` | user-input | Unknown - needs manual review |
| `survey2-1br-sf` | user-input | Unknown - needs manual review |
| `survey2-2br-psf` | calculated | Unknown - needs manual review |
| `survey2-2br-rent` | user-input | Unknown - needs manual review |
| `survey2-2br-sf` | user-input | Unknown - needs manual review |
| `survey2-address` | user-input | Unknown - needs manual review |
| `survey2-amenities` | user-input | Unknown - needs manual review |
| `survey2-appeal` | user-input | Unknown - needs manual review |
| `survey2-city` | user-input | Unknown - needs manual review |
| `survey2-condition` | user-input | Unknown - needs manual review |
| `survey2-distance` | user-input | Unknown - needs manual review |
| `survey2-laundry` | user-input | Unknown - needs manual review |
| `survey2-location` | user-input | Unknown - needs manual review |
| `survey2-name` | user-input | Unknown - needs manual review |
| `survey2-parking` | user-input | Unknown - needs manual review |
| `survey2-quality` | user-input | Unknown - needs manual review |
| `survey2-stories` | user-input | Unknown - needs manual review |
| `survey2-units` | user-input | Unknown - needs manual review |
| `survey2-utilities` | user-input | Unknown - needs manual review |
| `survey2-year-built` | user-input | Unknown - needs manual review |
| `survey3-1br-psf` | calculated | Unknown - needs manual review |
| `survey3-1br-rent` | user-input | Unknown - needs manual review |
| `survey3-1br-sf` | user-input | Unknown - needs manual review |
| `survey3-2br-psf` | calculated | Unknown - needs manual review |
| `survey3-2br-rent` | user-input | Unknown - needs manual review |
| `survey3-2br-sf` | user-input | Unknown - needs manual review |
| `survey3-address` | user-input | Unknown - needs manual review |
| `survey3-amenities` | user-input | Unknown - needs manual review |
| `survey3-appeal` | user-input | Unknown - needs manual review |
| `survey3-city` | user-input | Unknown - needs manual review |
| `survey3-condition` | user-input | Unknown - needs manual review |
| `survey3-distance` | user-input | Unknown - needs manual review |
| `survey3-laundry` | user-input | Unknown - needs manual review |
| `survey3-location` | user-input | Unknown - needs manual review |
| `survey3-name` | user-input | Unknown - needs manual review |
| `survey3-parking` | user-input | Unknown - needs manual review |
| `survey3-quality` | user-input | Unknown - needs manual review |
| `survey3-stories` | user-input | Unknown - needs manual review |
| `survey3-units` | user-input | Unknown - needs manual review |
| `survey3-utilities` | user-input | Unknown - needs manual review |
| `survey3-year-built` | user-input | Unknown - needs manual review |
| `survey4-1br-psf` | calculated | Unknown - needs manual review |
| `survey4-1br-rent` | user-input | Unknown - needs manual review |
| `survey4-1br-sf` | user-input | Unknown - needs manual review |
| `survey4-2br-psf` | calculated | Unknown - needs manual review |
| `survey4-2br-rent` | user-input | Unknown - needs manual review |
| `survey4-2br-sf` | user-input | Unknown - needs manual review |
| `survey4-address` | user-input | Unknown - needs manual review |
| `survey4-amenities` | user-input | Unknown - needs manual review |
| `survey4-appeal` | user-input | Unknown - needs manual review |
| `survey4-city` | user-input | Unknown - needs manual review |
| `survey4-condition` | user-input | Unknown - needs manual review |
| `survey4-distance` | user-input | Unknown - needs manual review |
| `survey4-laundry` | user-input | Unknown - needs manual review |
| `survey4-location` | user-input | Unknown - needs manual review |
| `survey4-name` | user-input | Unknown - needs manual review |
| `survey4-parking` | user-input | Unknown - needs manual review |
| `survey4-quality` | user-input | Unknown - needs manual review |
| `survey4-stories` | user-input | Unknown - needs manual review |
| `survey4-units` | user-input | Unknown - needs manual review |
| `survey4-utilities` | user-input | Unknown - needs manual review |
| `survey4-year-built` | user-input | Unknown - needs manual review |
| `survey5-1br-psf` | calculated | Unknown - needs manual review |
| `survey5-1br-rent` | user-input | Unknown - needs manual review |
| `survey5-1br-sf` | user-input | Unknown - needs manual review |
| `survey5-2br-psf` | calculated | Unknown - needs manual review |
| `survey5-2br-rent` | user-input | Unknown - needs manual review |
| `survey5-2br-sf` | user-input | Unknown - needs manual review |
| `survey5-address` | user-input | Unknown - needs manual review |
| `survey5-amenities` | user-input | Unknown - needs manual review |
| `survey5-appeal` | user-input | Unknown - needs manual review |
| `survey5-city` | user-input | Unknown - needs manual review |
| `survey5-condition` | user-input | Unknown - needs manual review |
| `survey5-distance` | user-input | Unknown - needs manual review |
| `survey5-laundry` | user-input | Unknown - needs manual review |
| `survey5-location` | user-input | Unknown - needs manual review |
| `survey5-name` | user-input | Unknown - needs manual review |
| `survey5-parking` | user-input | Unknown - needs manual review |
| `survey5-quality` | user-input | Unknown - needs manual review |
| `survey5-stories` | user-input | Unknown - needs manual review |
| `survey5-units` | user-input | Unknown - needs manual review |
| `survey5-utilities` | user-input | Unknown - needs manual review |
| `survey5-year-built` | user-input | Unknown - needs manual review |
| `tax-commentary` | user-input | Unknown - needs manual review |
| `total-assessment` | auto-filled | Unknown - needs manual review |
| `total-buildings` | auto-filled | Unknown - needs manual review |
| `total-nra` | auto-filled | Unknown - needs manual review |
| `total-units` | auto-filled | Unknown - needs manual review |
| `transit-score` | auto-filled | Unknown - needs manual review |
| `transmittal-body` | user-input | Unknown - needs manual review |
| `transmittal-date` | auto-filled | Unknown - needs manual review |
| `unit-amenities` | user-input | Unknown - needs manual review |
| `use-dcf-methodology` | user-input | Unknown - needs manual review |
| `valuation-date` | user-input | Unknown - needs manual review |
| `walk-score` | auto-filled | Unknown - needs manual review |
| `year-built` | auto-filled | Unknown - needs manual review |
| `zone-conditional-uses` | user-input | Unknown - needs manual review |
| `zone-minimum-lot-size` | auto-filled | Unknown - needs manual review |
| `zone-setbacks` | auto-filled | Unknown - needs manual review |
| `zoning-classification` | auto-filled | Unknown - needs manual review |
| `zoning-conclusion` | user-input | Unknown - needs manual review |
| `zoning-conformance` | user-input | Unknown - needs manual review |
| `zoning-description` | user-input | Unknown - needs manual review |
| `zoning-map` | user-input | Unknown - needs manual review |


---

## Next Steps

1. **Review Conflicts:** Check fields where Registry says 'user-input' but Valcre says '🔢 Calculated'
2. **Verify Unmapped Fields:** Determine if unmapped fields should be added to Valcre or removed from registry
3. **Map Field Destinations:** For each field, identify which report page/table it populates
4. **Document Calculator Engine:** Identify which input fields feed which calculated outputs

---

## Field Naming Convention Notes

- **Registry:** Uses `kebab-case` (e.g., `client-company`, `calc-pgi`)
- **Valcre:** Uses `PascalCase_Underscore` (e.g., `Client_Company`, `IA_DirCap_PGI`)
- **Prefixes:**
  - `calc-*`: Calculated fields in registry
  - `IA_*`: Income Analysis fields in Valcre
  - `intake-*`: Client intake form fields (dashboard-specific)
  - `loe-*`: Letter of Engagement fields (dashboard-specific)
  - `img-*`: Image upload fields (dashboard-specific)


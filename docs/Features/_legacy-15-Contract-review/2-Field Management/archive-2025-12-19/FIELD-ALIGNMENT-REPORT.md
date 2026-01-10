# Field Alignment Report: Registry → HTML Source

**Date:** 2025-12-15
**Purpose:** Map existing fieldRegistry.ts fields to Word HTML source fields

## Summary

- **Total Registry Fields:** 519
- **Total HTML Source Fields:** 524
- **Exact Matches:** 24 (already aligned perfectly)
- **Close Matches:** 20 (need renaming)
- **Uncertain Matches:** 146 (need manual review)
- **Extra in Registry:** 329 (not in HTML)
- **Missing from Registry:** 334 (in HTML, not in registry)

## Coverage Analysis

**Registry → HTML Match Rate:** 8.5%
- Fields that align well: 44 / 519
- Potential obsolete fields: 329 (63.4%)

**HTML → Registry Coverage:** 8.4%
- Fields needing addition: 334 / 524 (63.7%)

## Field Alignment Table

| fieldRegistry.ts | Word HTML Source | Status | Notes |
|------------------|------------------|--------|-------|
| cost-approach-conclusion | income-approach-conclusion-table | ⚠️ Uncertain | Uncertain match (78.43%) - manual review required |
| tenancy | tenancy-type | ⚠️ Uncertain | Uncertain match (77.78%) - manual review required |
| appraiser-name | appraiser-aic-number | ⚠️ Uncertain | Uncertain match (77.42%) - manual review required |
| comp1-cap-rate | comparable-1b-cap-rate | ⚠️ Uncertain | Uncertain match (77.42%) - manual review required |
| hbu-vacant-legal | hbu-vacant-use | ⚠️ Uncertain | Uncertain match (76.92%) - manual review required |
| site-rating | site-access-rating | ⚠️ Uncertain | Uncertain match (76.92%) - manual review required |
| calc-total-rental-revenue | total-rental-revenue-section | ⚠️ Uncertain | Uncertain match (76.60%) - manual review required |
| accessibility | site-accessibility-note | ⚠️ Uncertain | Uncertain match (76.47%) - manual review required |
| comp2-sale-price | comparable-4-sale-price | ⚠️ Uncertain | Uncertain match (76.47%) - manual review required |
| report-date | report-title | ⚠️ Uncertain | Uncertain match (76.19%) - manual review required |
| appraiser-title | appraiser-signatory-title | ⚠️ Uncertain | Uncertain match (75.68%) - manual review required |
| property-rights | property-rights-appraised | ⚠️ Uncertain | Uncertain match (75.68%) - manual review required |
| zoning-conclusion | concessions-conclusion | ⚠️ Uncertain | Uncertain match (75.68%) - manual review required |
| comp2-sale-date | comparable-4-sale-date | ⚠️ Uncertain | Uncertain match (75.00%) - manual review required |
| img-map-local | intro-map-local | ⚠️ Uncertain | Uncertain match (75.00%) - manual review required |
| intake-property-address | property-address-full | ⚠️ Uncertain | Uncertain match (75.00%) - manual review required |
| market | market-name | ⚠️ Uncertain | Uncertain match (75.00%) - manual review required |
| calc-concessions-rate | concessions-array | ⚠️ Uncertain | Uncertain match (74.29%) - manual review required |
| calc-noi-per-unit | comparable-4-noi-per-unit | ⚠️ Uncertain | Uncertain match (74.29%) - manual review required |
| comp3-sale-price | comparable-1b-sale-price | ⚠️ Uncertain | Uncertain match (74.29%) - manual review required |
| building-format | building-count | ⚠️ Uncertain | Uncertain match (74.07%) - manual review required |
| comp1-units | comparable-1b-units | ⚠️ Uncertain | Uncertain match (74.07%) - manual review required |
| street-address | subject-address | ⚠️ Uncertain | Uncertain match (74.07%) - manual review required |
| sales-adjustment-summary | physical-adjustments-array | ⚠️ Uncertain | Uncertain match (73.91%) - manual review required |
| loe-property-rights | property-rights-details | ⚠️ Uncertain | Uncertain match (73.68%) - manual review required |
| comp2-cap-rate | comparable-4-cap-rate | ⚠️ Uncertain | Uncertain match (73.33%) - manual review required |
| comp3-sale-date | comparable-1b-sale-date | ⚠️ Uncertain | Uncertain match (72.73%) - manual review required |
| land-value-conclusion | final-value-conclusion-title | ⚠️ Uncertain | Uncertain match (72.73%) - manual review required |
| calc-indicated-value | sales-comparison-indicated-value | ⚠️ Uncertain | Uncertain match (72.34%) - manual review required |
| calc-exp-utilities | comparable-1-utilities | ⚠️ Uncertain | Uncertain match (72.22%) - manual review required |
| intake-client-address | client-address-full | ⚠️ Uncertain | Uncertain match (72.22%) - manual review required |
| loe-appraiser-comments | appraiser-company | ⚠️ Uncertain | Uncertain match (72.22%) - manual review required |
| site-conclusion | exposure-time-conclusion | ⚠️ Uncertain | Uncertain match (72.22%) - manual review required |
| building-style | building-nra-sqft | ⚠️ Uncertain | Uncertain match (71.43%) - manual review required |
| calc-vacancy-loss | vacancy-loss-table | ⚠️ Uncertain | Uncertain match (70.97%) - manual review required |
| appraiser-credentials | appraiser-email | ⚠️ Uncertain | Uncertain match (70.59%) - manual review required |
| comp2-price-per-unit | price-per-unit-array | ⚠️ Uncertain | Uncertain match (70.59%) - manual review required |
| total-buildings | comparable-1-buildings | ⚠️ Uncertain | Uncertain match (70.59%) - manual review required |
| public-transit | public-transit-description | ⚠️ Uncertain | Uncertain match (70.27%) - manual review required |
| comp1-price-per-sf | sales-comparison-price-per-sf | ⚠️ Uncertain | Uncertain match (70.00%) - manual review required |
| site-address | site-grade | ⚠️ Uncertain | Uncertain match (70.00%) - manual review required |
| loe-report-type | report-date | ⚠️ Uncertain | Uncertain match (69.57%) - manual review required |
| province | subject-province | ⚠️ Uncertain | Uncertain match (69.57%) - manual review required |
| site-acreage | site-area-sqft | ⚠️ Uncertain | Uncertain match (69.57%) - manual review required |
| site-total-area | site-area-sf | ⚠️ Uncertain | Uncertain match (69.57%) - manual review required |
| comp2-units | comparable-4-units | ⚠️ Uncertain | Uncertain match (69.23%) - manual review required |
| img-zoning-map | zoning-map-image | ⚠️ Uncertain | Uncertain match (69.23%) - manual review required |
| submarket | subject-zone-market | ⚠️ Uncertain | Uncertain match (69.23%) - manual review required |
| calc-cap-rate | comparable-1-cap-rate | ⚠️ Uncertain | Uncertain match (68.97%) - manual review required |
| calc-vacancy-rate | vacancy-rates-array | ⚠️ Uncertain | Uncertain match (68.75%) - manual review required |
| multifamily-overview | multifamily-sf | ⚠️ Uncertain | Uncertain match (68.75%) - manual review required |
| property-name | comparable-1-property-name | ⚠️ Uncertain | Uncertain match (68.57%) - manual review required |
| calc-avg-rent-per-unit | concluded-rent-per-unit | ⚠️ Uncertain | Uncertain match (68.42%) - manual review required |
| appraiser-province | appraiser-assistance-provided | ⚠️ Uncertain | Uncertain match (68.18%) - manual review required |
| comp1-name | comp-1-address | ⚠️ Uncertain | Uncertain match (66.67%) - manual review required |
| comp3-price-per-unit | comparable-1-analysis-price-per-unit | ⚠️ Uncertain | Uncertain match (66.67%) - manual review required |
| hbu-conclusion-text | one-bed-unit-conclusion-table | ⚠️ Uncertain | Uncertain match (66.67%) - manual review required |
| img-street-1 | intro-map-street | ⚠️ Uncertain | Uncertain match (66.67%) - manual review required |
| impv-building-format | building-information-table | ⚠️ Uncertain | Uncertain match (66.67%) - manual review required |
| impv-year-built | comparable-1-year-built | ⚠️ Uncertain | Uncertain match (66.67%) - manual review required |
| income-cap-rate-analysis | comparable-1-analysis-price | ⚠️ Uncertain | Uncertain match (66.67%) - manual review required |
| property-is-listed | property-address-line1 | ⚠️ Uncertain | Uncertain match (66.67%) - manual review required |
| security | security-features | ⚠️ Uncertain | Uncertain match (66.67%) - manual review required |
| site-coverage | section-divider-page | ⚠️ Uncertain | Uncertain match (66.67%) - manual review required |
| subject-units | subsection-title | ⚠️ Uncertain | Uncertain match (66.67%) - manual review required |
| market-vacancy-rate | market-value-characteristics | ⚠️ Uncertain | Uncertain match (65.12%) - manual review required |
| recon-final-value | comp-1-conclusion-final-value | ⚠️ Uncertain | Uncertain match (65.00%) - manual review required |
| survey-methodology | cap-rate-methodology-intro | ⚠️ Uncertain | Uncertain match (65.00%) - manual review required |
| survey1-utilities | comparable-1b-utilities | ⚠️ Uncertain | Uncertain match (64.86%) - manual review required |
| survey1-year-built | comparable-1b-year-built | ⚠️ Uncertain | Uncertain match (64.86%) - manual review required |
| survey-intro | survey-presentation-intro | ⚠️ Uncertain | Uncertain match (64.71%) - manual review required |
| client-address | comparable-1-address | ⚠️ Uncertain | Uncertain match (64.52%) - manual review required |
| img-common-1-caption | photo-10-caption | ⚠️ Uncertain | Uncertain match (64.52%) - manual review required |
| img-common-2-caption | photo-12-caption | ⚠️ Uncertain | Uncertain match (64.52%) - manual review required |
| intake-client-first-name | client-name | ⚠️ Uncertain | Uncertain match (64.52%) - manual review required |
| loe-appraisal-fee | appraisal-purpose | ⚠️ Uncertain | Uncertain match (64.52%) - manual review required |
| comp3-cap-rate | comparable-1-title | ⚠️ Uncertain | Uncertain match (64.29%) - manual review required |
| parking-ratio | parking-type-array | ⚠️ Uncertain | Uncertain match (64.29%) - manual review required |
| comp1-year | comparable-1-buyer | ⚠️ Uncertain | Uncertain match (64.00%) - manual review required |
| img-exterior-1 | exterior-array | ⚠️ Uncertain | Uncertain match (64.00%) - manual review required |
| parking-spaces | parking-ratio | ⚠️ Uncertain | Uncertain match (64.00%) - manual review required |
| photos-common | photo-9-caption | ⚠️ Uncertain | Uncertain match (64.00%) - manual review required |
| subject-gba | subject-distance | ⚠️ Uncertain | Uncertain match (64.00%) - manual review required |
| total-nra | total-land-area-sqft | ⚠️ Uncertain | Uncertain match (64.00%) - manual review required |
| comp2-price-per-sf | income-approach-final-price-per-sf | ⚠️ Uncertain | Uncertain match (63.64%) - manual review required |
| income-pgi-narrative | income-approach-final-cap-rate | ⚠️ Uncertain | Uncertain match (63.64%) - manual review required |
| intake-client-title | final-reconciliation-title | ⚠️ Uncertain | Uncertain match (63.41%) - manual review required |
| appraiser-address | appraiser-signatory-name | ⚠️ Uncertain | Uncertain match (63.16%) - manual review required |
| cover-photo | corner-lot | ⚠️ Uncertain | Uncertain match (63.16%) - manual review required |
| national-overview | income-approach-overview | ⚠️ Uncertain | Uncertain match (63.16%) - manual review required |
| recon-income-value | income-approach-value | ⚠️ Uncertain | Uncertain match (62.86%) - manual review required |
| appraiser-company | appraiser-address | ⚠️ Uncertain | Uncertain match (62.50%) - manual review required |
| img-exterior-1-caption | photo-1-caption | ⚠️ Uncertain | Uncertain match (62.50%) - manual review required |
| img-exterior-2-caption | photo-2-caption | ⚠️ Uncertain | Uncertain match (62.50%) - manual review required |
| img-exterior-3-caption | photo-3-caption | ⚠️ Uncertain | Uncertain match (62.50%) - manual review required |
| img-exterior-4-caption | photo-4-caption | ⚠️ Uncertain | Uncertain match (62.50%) - manual review required |
| img-exterior-5-caption | photo-5-caption | ⚠️ Uncertain | Uncertain match (62.50%) - manual review required |
| img-exterior-6-caption | photo-6-caption | ⚠️ Uncertain | Uncertain match (62.50%) - manual review required |
| market-national-inflation | market-rent-conclusion-intro | ⚠️ Uncertain | Uncertain match (62.50%) - manual review required |
| recon-sales-value | subject-total-value | ⚠️ Uncertain | Uncertain match (62.50%) - manual review required |
| survey1-laundry | comparable-1-laundry | ⚠️ Uncertain | Uncertain match (62.50%) - manual review required |
| survey4-laundry | comparable-4-laundry | ⚠️ Uncertain | Uncertain match (62.50%) - manual review required |
| calc-expenses-total | expense-ratio | ⚠️ Uncertain | Uncertain match (62.07%) - manual review required |
| calc-value-per-sf | final-price-per-sf | ⚠️ Uncertain | Uncertain match (62.07%) - manual review required |
| img-unit-1-caption | photo-11-caption | ⚠️ Uncertain | Uncertain match (62.07%) - manual review required |
| income-noi-narrative | income-approach-final-title | ⚠️ Uncertain | Uncertain match (61.90%) - manual review required |
| location-nearby-amenities | location-description | ⚠️ Uncertain | Uncertain match (61.90%) - manual review required |
| market-local-population | market-value-definition | ⚠️ Uncertain | Uncertain match (61.90%) - manual review required |
| overall-condition | hypothetical-conditions-text | ⚠️ Uncertain | Uncertain match (61.90%) - manual review required |
| calc-parking-per-unit | comparable-1-noi-per-unit | ⚠️ Uncertain | Uncertain match (61.54%) - manual review required |
| calc-value-per-unit | comparable-1-price-per-unit | ⚠️ Uncertain | Uncertain match (61.54%) - manual review required |
| comp2-name | comp2-unit-mix-table | ⚠️ Uncertain | Uncertain match (61.54%) - manual review required |
| hbu-vacant-productive | hbu-label-construction | ⚠️ Uncertain | Uncertain match (61.54%) - manual review required |
| roof | roof-array | ⚠️ Uncertain | Uncertain match (61.54%) - manual review required |
| subject-condition | subject-property-location | ⚠️ Uncertain | Uncertain match (61.54%) - manual review required |
| survey5-address | comp-5-address | ⚠️ Uncertain | Uncertain match (61.54%) - manual review required |
| total-units | comparable-1-units | ⚠️ Uncertain | Uncertain match (61.54%) - manual review required |
| calc-laundry-per-unit | current-rent-per-unit | ⚠️ Uncertain | Uncertain match (61.11%) - manual review required |
| calc-parking-total | sales-comparison-title | ⚠️ Uncertain | Uncertain match (61.11%) - manual review required |
| impv-num-buildings | comparable-4-buildings | ⚠️ Uncertain | Uncertain match (61.11%) - manual review required |
| location-access | location-map-placeholder | ⚠️ Uncertain | Uncertain match (61.11%) - manual review required |
| occupancy-rate | current-occupancy-percent | ⚠️ Uncertain | Uncertain match (61.11%) - manual review required |
| survey1-distance | survey-comparison-table | ⚠️ Uncertain | Uncertain match (61.11%) - manual review required |
| survey2-utilities | comparable-4-utilities | ⚠️ Uncertain | Uncertain match (61.11%) - manual review required |
| survey2-year-built | comparable-4-year-built | ⚠️ Uncertain | Uncertain match (61.11%) - manual review required |
| comp2-year | comp-zones-array | ⚠️ Uncertain | Uncertain match (60.87%) - manual review required |
| comp3-price-per-sf | direct-comparison-final-price-per-sf | ⚠️ Uncertain | Uncertain match (60.87%) - manual review required |
| rent-1br-low | rent-roll-notes | ⚠️ Uncertain | Uncertain match (60.87%) - manual review required |
| zone-conditional-uses | comparable-1-conditions-of-sale | ⚠️ Uncertain | Uncertain match (60.87%) - manual review required |
| fire-protection | frontage-description | ⚠️ Uncertain | Uncertain match (60.61%) - manual review required |
| recon-cost-value | reconciliation-title | ⚠️ Uncertain | Uncertain match (60.61%) - manual review required |
| report-type | comparable-1-property-type | ⚠️ Uncertain | Uncertain match (60.61%) - manual review required |
| survey1-address | comparable-1b-address | ⚠️ Uncertain | Uncertain match (60.61%) - manual review required |
| annual-taxes | actual-age | ⚠️ Uncertain | Uncertain match (60.00%) - manual review required |
| exposure-visibility | exposure-time-definition | ⚠️ Uncertain | Uncertain match (60.00%) - manual review required |
| img-common-3-caption | photo-7-caption | ⚠️ Uncertain | Uncertain match (60.00%) - manual review required |
| img-common-4-caption | photo-8-caption | ⚠️ Uncertain | Uncertain match (60.00%) - manual review required |
| img-site-plan-1 | site-plan-lot-17-image | ⚠️ Uncertain | Uncertain match (60.00%) - manual review required |
| intake-valuation-premises | valuation-interest | ⚠️ Uncertain | Uncertain match (60.00%) - manual review required |
| market-demand-drivers | market-rent-survey-intro | ⚠️ Uncertain | Uncertain match (60.00%) - manual review required |
| market-national-gdp | marketing-time | ⚠️ Uncertain | Uncertain match (60.00%) - manual review required |
| subject-site-area | subject-unit-indicated-value | ⚠️ Uncertain | Uncertain match (60.00%) - manual review required |
| survey-conclusion | expense-conclusions-header | ⚠️ Uncertain | Uncertain match (60.00%) - manual review required |
| survey1-condition | condition-array | ⚠️ Uncertain | Uncertain match (60.00%) - manual review required |
| survey3-year-built | year-built-array | ⚠️ Uncertain | Uncertain match (60.00%) - manual review required |
| walk-score | walk-transit-bike-scores | ⚠️ Uncertain | Uncertain match (60.00%) - manual review required |
| value-scenario | value-scenarios | ✅ Close | Strong match (96.30%) - verify and rename |
| extraordinary-assumptions | extraordinary-assumptions-text | ✅ Close | Strong match (92.31%) - verify and rename |
| comp1-address | comp-2-address | ✅ Close | Strong match (91.67%) - verify and rename |
| comp2-address | comp-3-address | ✅ Close | Strong match (91.67%) - verify and rename |
| comp3-address | comp-4-address | ✅ Close | Strong match (91.67%) - verify and rename |
| density-units-acre | density-units-per-acre | ✅ Close | Strong match (91.43%) - verify and rename |
| hbu-improved | hbu-improved-use | ✅ Close | Strong match (88.00%) - verify and rename |
| loe-scope-of-work | scope-of-work | ✅ Close | Strong match (88.00%) - verify and rename |
| site-plan-image | site-plan-lot-18-image | ✅ Close | Strong match (83.87%) - verify and rename |
| unit-amenities | unit-amenities-array | ✅ Close | Strong match (83.87%) - verify and rename |
| building-quality | building-quality-rating | ✅ Close | Strong match (83.33%) - verify and rename |
| building-appeal | building-appeal-rating | ✅ Close | Strong match (82.35%) - verify and rename |
| comp1-sale-price | comparable-1-sale-price | ✅ Close | Strong match (82.35%) - verify and rename |
| comp1-sale-date | comparable-1-sale-date | ✅ Close | Strong match (81.25%) - verify and rename |
| comp1-price-per-unit | comparable-4-price-per-unit | ✅ Close | Strong match (80.00%) - verify and rename |
| foundation | foundation-array | ✅ Close | Strong match (80.00%) - verify and rename |
| img-map-regional | intro-map-regional | ✅ Close | Strong match (80.00%) - verify and rename |
| intake-property-name | property-name | ✅ Close | Strong match (80.00%) - verify and rename |
| intake-property-type | property-type | ✅ Close | Strong match (80.00%) - verify and rename |
| use-dcf-methodology | dcf-methodology-note | ✅ Close | Strong match (80.00%) - verify and rename |
| adjacent-east | adjacent-east | ✅ Exact | Perfect match - already aligned |
| adjacent-north | adjacent-north | ✅ Exact | Perfect match - already aligned |
| adjacent-south | adjacent-south | ✅ Exact | Perfect match - already aligned |
| adjacent-west | adjacent-west | ✅ Exact | Perfect match - already aligned |
| concluded-value | concluded-value | ✅ Exact | Perfect match - already aligned |
| economic-life | economic-life | ✅ Exact | Perfect match - already aligned |
| effective-age | effective-age | ✅ Exact | Perfect match - already aligned |
| extraordinary-limiting-conditions | extraordinary-limiting-conditions | ✅ Exact | Perfect match - already aligned |
| file-number | file-number | ✅ Exact | Perfect match - already aligned |
| hypothetical-conditions | hypothetical-conditions | ✅ Exact | Perfect match - already aligned |
| laundry | laundry | ✅ Exact | Perfect match - already aligned |
| legal-description | legal-description | ✅ Exact | Perfect match - already aligned |
| local-area-description | local-area-description | ✅ Exact | Perfect match - already aligned |
| nearby-schools | nearby-schools | ✅ Exact | Perfect match - already aligned |
| project-amenities | project-amenities | ✅ Exact | Perfect match - already aligned |
| remaining-useful-life | remaining-useful-life | ✅ Exact | Perfect match - already aligned |
| site-quality | site-quality | ✅ Exact | Perfect match - already aligned |
| site-shape | site-shape | ✅ Exact | Perfect match - already aligned |
| site-utility | site-utility | ✅ Exact | Perfect match - already aligned |
| topography | topography | ✅ Exact | Perfect match - already aligned |
| valuation-date | valuation-date | ✅ Exact | Perfect match - already aligned |
| year-built | year-built | ✅ Exact | Perfect match - already aligned |
| zoning-classification | zoning-classification | ✅ Exact | Perfect match - already aligned |
| zoning-description | zoning-description | ✅ Exact | Perfect match - already aligned |
| actual-age | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| appraiser-aic-number | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| appraiser-city | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| appraiser-email | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| appraiser-phone | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| appraiser-postal | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| appraiser-website | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| assessment-year | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| bike-score | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| building-assessment | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-adj-capex | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-adj-leasing | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-adj-other | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-adj-total | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-avg-rent-per-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-avg-unit-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-bad-debt-rate | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-egr | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-exp-admin | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-exp-insurance | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-exp-management | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-exp-other | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-exp-payroll | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-exp-repairs | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-exp-reserves | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-exp-taxes | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-expense-ratio | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-grm | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-laundry-total | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-noi | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-noi-per-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-other-income | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-pgr | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-raw-value | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-total-other-income | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-total-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-total-units | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type1-annual | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type1-count | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type1-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type1-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type1-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type2-annual | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type2-count | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type2-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type2-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type2-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type3-annual | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type3-count | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type3-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type3-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type3-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type4-annual | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type4-count | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type4-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type4-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| calc-type4-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| ceilings | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-sign-credentials | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-sign-date | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-sign-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-signature | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-statement-1 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-statement-10 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-statement-11 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-statement-12 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-statement-2 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-statement-3 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-statement-4 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-statement-5 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-statement-6 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-statement-7 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-statement-8 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| cert-statement-9 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| city | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| client-city | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| client-company | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| client-contact-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| client-postal | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| client-province | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| comp1-gba | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| comp2-gba | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| comp3-gba | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| comp3-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| comp3-units | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| comp3-year | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| doors-windows | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| easements | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| electrical | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| elevator | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| exterior-walls | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| flooring | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| functional-design | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| gba | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| hazardous-materials | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| hazardous-waste | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| hbu-intro | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| hbu-vacant-financial | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| hbu-vacant-physical | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| hvac | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-common-1 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-common-2 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-common-3 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-common-4 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-cover-photo | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-exterior-2 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-exterior-3 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-exterior-4 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-exterior-5 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-exterior-6 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-map-aerial-1 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-map-aerial-2 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-signature | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-site-plan-2 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-street-1-caption | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-street-2 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-street-2-caption | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-street-3 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-street-3-caption | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-systems-1 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-systems-1-caption | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-systems-2 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-systems-2-caption | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-systems-3 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-systems-3-caption | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-systems-4 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-systems-4-caption | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-unit-1 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-unit-2 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-unit-2-caption | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-unit-3 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-unit-3-caption | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-unit-4 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-unit-4-caption | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-unit-5 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-unit-5-caption | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-unit-6 | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| img-unit-6-caption | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| impv-building-footprint | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| impv-insulation | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| impv-interior-finish | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| impv-nra | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| impv-num-units | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| impv-overview | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| impv-roof-condition | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| impv-site-coverage | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| impv-stories | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| income-expense-narrative | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| income-value-indication | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| intake-asset-condition | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| intake-client-email | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| intake-client-last-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| intake-client-organization | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| intake-client-phone | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| intake-contact-email | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| intake-contact-first-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| intake-contact-last-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| intake-contact-phone | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| intake-intended-use | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| intake-notes | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| interior-walls | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| land-area-usable-acres | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| land-area-usable-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| land-assessment | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| landscaping | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| latitude | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| local-market | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| location-overview-text | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| loe-delivery-date | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| loe-internal-comments | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| loe-payment-terms | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| loe-retainer-amount | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| loe-special-instructions | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| loe-valcre-job-id | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| longitude | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| map-aerial | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| map-local | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| map-regional | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| market-local-employment | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| market-provincial-key-industries | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| market-provincial-unemployment | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| market-supply-pipeline | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| max-density | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| max-height | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| mill-rate | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| min-setback | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| parking-requirements | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| permitted-uses | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| photos-exterior | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| photos-street | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| photos-systems | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| photos-units | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| plumbing | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| postal-code | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| property-type-display | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| provincial-overview | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| recon-cost-weight | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| recon-effective-date | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| recon-income-weight | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| recon-narrative | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| recon-sales-weight | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| recon-value-premise | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| rent-1br-avg | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| rent-1br-concluded-psf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| rent-1br-concluded-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| rent-1br-concluded-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| rent-1br-high | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| rent-1br-median | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| rent-2br-avg | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| rent-2br-concluded-psf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| rent-2br-concluded-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| rent-2br-concluded-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| rent-2br-high | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| rent-2br-low | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| rent-2br-median | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| rent-trend | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| report-compliance | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| report-purpose | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| report-scope | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| sales-value-indication | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| site-impv | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| soils | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| stories | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| subject-parking | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| subject-year | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey-market-rent-support | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-1br-psf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-1br-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-1br-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-2br-psf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-2br-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-2br-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-amenities | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-appeal | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-city | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-location | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-parking | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-quality | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-stories | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey1-units | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-1br-psf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-1br-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-1br-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-2br-psf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-2br-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-2br-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-address | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-amenities | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-appeal | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-city | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-condition | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-distance | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-laundry | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-location | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-parking | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-quality | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-stories | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey2-units | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-1br-psf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-1br-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-1br-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-2br-psf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-2br-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-2br-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-address | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-amenities | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-appeal | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-city | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-condition | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-distance | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-laundry | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-location | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-parking | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-quality | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-stories | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-units | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey3-utilities | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-1br-psf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-1br-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-1br-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-2br-psf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-2br-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-2br-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-address | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-amenities | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-appeal | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-city | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-condition | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-distance | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-location | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-parking | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-quality | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-stories | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-units | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-utilities | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey4-year-built | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-1br-psf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-1br-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-1br-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-2br-psf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-2br-rent | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-2br-sf | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-amenities | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-appeal | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-city | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-condition | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-distance | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-laundry | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-location | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-name | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-parking | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-quality | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-stories | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-units | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-utilities | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| survey5-year-built | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| tax-commentary | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| total-assessment | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| transit-score | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| transmittal-body | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| transmittal-date | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| zone-minimum-lot-size | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| zone-setbacks | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| zoning-conformance | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| zoning-map | — | 🔵 Extra | Not found in HTML - may be obsolete or custom field |
| — | access-description | ❌ Missing | Must be added to registry |
| — | adjusted-prices-array | ❌ Missing | Must be added to registry |
| — | adjusted-values-array | ❌ Missing | Must be added to registry |
| — | all-units-inspected | ❌ Missing | Must be added to registry |
| — | alternative-investment-rates-text | ❌ Missing | Must be added to registry |
| — | approaches-to-value-table | ❌ Missing | Must be added to registry |
| — | assignment-purpose-text | ❌ Missing | Must be added to registry |
| — | building-condition-rating | ❌ Missing | Must be added to registry |
| — | building-description | ❌ Missing | Must be added to registry |
| — | cap-rate-selection-intro | ❌ Missing | Must be added to registry |
| — | capitalization-rate | ❌ Missing | Must be added to registry |
| — | certification-footer-address | ❌ Missing | Must be added to registry |
| — | certification-item-1-statements-of-fact | ❌ Missing | Must be added to registry |
| — | certification-item-10-aic-membership | ❌ Missing | Must be added to registry |
| — | certification-item-11-signature-requirement | ❌ Missing | Must be added to registry |
| — | certification-item-2-analyses-opinions | ❌ Missing | Must be added to registry |
| — | certification-item-3-no-interest | ❌ Missing | Must be added to registry |
| — | certification-item-4-no-bias | ❌ Missing | Must be added to registry |
| — | certification-item-5-compensation | ❌ Missing | Must be added to registry |
| — | certification-item-6-cusap-conformity | ❌ Missing | Must be added to registry |
| — | certification-item-7-competency | ❌ Missing | Must be added to registry |
| — | certification-item-8-professional-assistance | ❌ Missing | Must be added to registry |
| — | certification-item-9-cpd-requirements | ❌ Missing | Must be added to registry |
| — | certification-page-number | ❌ Missing | Must be added to registry |
| — | certification-section-title | ❌ Missing | Must be added to registry |
| — | certification-title | ❌ Missing | Must be added to registry |
| — | comp-1-conclusion-adjusted-price | ❌ Missing | Must be added to registry |
| — | comp-1-conclusion-adjustment-pct | ❌ Missing | Must be added to registry |
| — | comp-1-conclusion-net-gross-pct | ❌ Missing | Must be added to registry |
| — | comp-1-conclusion-property-adjustment | ❌ Missing | Must be added to registry |
| — | comp-1-conclusion-unadjusted-price | ❌ Missing | Must be added to registry |
| — | comp-2-conclusion-adjusted-price | ❌ Missing | Must be added to registry |
| — | comp-2-conclusion-adjustment-pct | ❌ Missing | Must be added to registry |
| — | comp-2-conclusion-final-value | ❌ Missing | Must be added to registry |
| — | comp-2-conclusion-net-gross-pct | ❌ Missing | Must be added to registry |
| — | comp-2-conclusion-property-adjustment | ❌ Missing | Must be added to registry |
| — | comp-2-conclusion-unadjusted-price | ❌ Missing | Must be added to registry |
| — | comp-3-conclusion-adjusted-price | ❌ Missing | Must be added to registry |
| — | comp-3-conclusion-adjustment-pct | ❌ Missing | Must be added to registry |
| — | comp-3-conclusion-final-value | ❌ Missing | Must be added to registry |
| — | comp-3-conclusion-net-gross-pct | ❌ Missing | Must be added to registry |
| — | comp-3-conclusion-property-adjustment | ❌ Missing | Must be added to registry |
| — | comp-3-conclusion-unadjusted-price | ❌ Missing | Must be added to registry |
| — | comp-4-conclusion-adjusted-price | ❌ Missing | Must be added to registry |
| — | comp-4-conclusion-adjustment-pct | ❌ Missing | Must be added to registry |
| — | comp-4-conclusion-final-value | ❌ Missing | Must be added to registry |
| — | comp-4-conclusion-net-gross-pct | ❌ Missing | Must be added to registry |
| — | comp-4-conclusion-property-adjustment | ❌ Missing | Must be added to registry |
| — | comp-4-conclusion-unadjusted-price | ❌ Missing | Must be added to registry |
| — | comp-5-conclusion-adjusted-price | ❌ Missing | Must be added to registry |
| — | comp-5-conclusion-adjustment-pct | ❌ Missing | Must be added to registry |
| — | comp-5-conclusion-final-value | ❌ Missing | Must be added to registry |
| — | comp-5-conclusion-net-gross-pct | ❌ Missing | Must be added to registry |
| — | comp-5-conclusion-property-adjustment | ❌ Missing | Must be added to registry |
| — | comp-5-conclusion-unadjusted-price | ❌ Missing | Must be added to registry |
| — | comp-6-address | ❌ Missing | Must be added to registry |
| — | comp1-description | ❌ Missing | Must be added to registry |
| — | comp1-income-analysis-table | ❌ Missing | Must be added to registry |
| — | comp1-map-placeholder | ❌ Missing | Must be added to registry |
| — | comp1-photo-placeholder | ❌ Missing | Must be added to registry |
| — | comp1-property-table | ❌ Missing | Must be added to registry |
| — | comp1-sale-info-table | ❌ Missing | Must be added to registry |
| — | comp1-unit-mix-table | ❌ Missing | Must be added to registry |
| — | comp2-analysis-section | ❌ Missing | Must be added to registry |
| — | comp2-description | ❌ Missing | Must be added to registry |
| — | comp2-income-analysis-table | ❌ Missing | Must be added to registry |
| — | comp2-map-placeholder | ❌ Missing | Must be added to registry |
| — | comp2-photo-placeholder | ❌ Missing | Must be added to registry |
| — | comp2-property-table | ❌ Missing | Must be added to registry |
| — | comp2-sale-info-table | ❌ Missing | Must be added to registry |
| — | comparable-1-building-photo | ❌ Missing | Must be added to registry |
| — | comparable-1-corner | ❌ Missing | Must be added to registry |
| — | comparable-1-financing | ❌ Missing | Must be added to registry |
| — | comparable-1-gross-building-area | ❌ Missing | Must be added to registry |
| — | comparable-1-label | ❌ Missing | Must be added to registry |
| — | comparable-1-land-area | ❌ Missing | Must be added to registry |
| — | comparable-1-location-map | ❌ Missing | Must be added to registry |
| — | comparable-1-market-notes | ❌ Missing | Must be added to registry |
| — | comparable-1-net-operating-income | ❌ Missing | Must be added to registry |
| — | comparable-1-net-rentable-area | ❌ Missing | Must be added to registry |
| — | comparable-1-occupancy | ❌ Missing | Must be added to registry |
| — | comparable-1-parking-type | ❌ Missing | Must be added to registry |
| — | comparable-1-project-amenities | ❌ Missing | Must be added to registry |
| — | comparable-1-rent-type | ❌ Missing | Must be added to registry |
| — | comparable-1-security-features | ❌ Missing | Must be added to registry |
| — | comparable-1-seller | ❌ Missing | Must be added to registry |
| — | comparable-1-transaction-status | ❌ Missing | Must be added to registry |
| — | comparable-1-unit-amenities | ❌ Missing | Must be added to registry |
| — | comparable-1-unit-mix-avg-size | ❌ Missing | Must be added to registry |
| — | comparable-1-unit-mix-type | ❌ Missing | Must be added to registry |
| — | comparable-1-unit-mix-units | ❌ Missing | Must be added to registry |
| — | comparable-1b-adjusted-price-per-unit | ❌ Missing | Must be added to registry |
| — | comparable-1b-analysis-price | ❌ Missing | Must be added to registry |
| — | comparable-1b-analysis-text | ❌ Missing | Must be added to registry |
| — | comparable-1b-arms-length | ❌ Missing | Must be added to registry |
| — | comparable-1b-building-photo | ❌ Missing | Must be added to registry |
| — | comparable-1b-buildings | ❌ Missing | Must be added to registry |
| — | comparable-1b-buyer | ❌ Missing | Must be added to registry |
| — | comparable-1b-construction-type | ❌ Missing | Must be added to registry |
| — | comparable-1b-expenses | ❌ Missing | Must be added to registry |
| — | comparable-1b-financing | ❌ Missing | Must be added to registry |
| — | comparable-1b-gross-building-area | ❌ Missing | Must be added to registry |
| — | comparable-1b-label | ❌ Missing | Must be added to registry |
| — | comparable-1b-land-area | ❌ Missing | Must be added to registry |
| — | comparable-1b-laundry | ❌ Missing | Must be added to registry |
| — | comparable-1b-location-map | ❌ Missing | Must be added to registry |
| — | comparable-1b-net-operating-income | ❌ Missing | Must be added to registry |
| — | comparable-1b-net-rentable-area | ❌ Missing | Must be added to registry |
| — | comparable-1b-noi-per-unit | ❌ Missing | Must be added to registry |
| — | comparable-1b-occupancy | ❌ Missing | Must be added to registry |
| — | comparable-1b-parking-type | ❌ Missing | Must be added to registry |
| — | comparable-1b-project-amenities | ❌ Missing | Must be added to registry |
| — | comparable-1b-property-name | ❌ Missing | Must be added to registry |
| — | comparable-1b-property-type | ❌ Missing | Must be added to registry |
| — | comparable-1b-recording-number | ❌ Missing | Must be added to registry |
| — | comparable-1b-remarks | ❌ Missing | Must be added to registry |
| — | comparable-1b-rent-type | ❌ Missing | Must be added to registry |
| — | comparable-1b-rights-transferred | ❌ Missing | Must be added to registry |
| — | comparable-1b-security-features | ❌ Missing | Must be added to registry |
| — | comparable-1b-seller | ❌ Missing | Must be added to registry |
| — | comparable-1b-title | ❌ Missing | Must be added to registry |
| — | comparable-1b-transaction-status | ❌ Missing | Must be added to registry |
| — | comparable-1b-unit-amenities | ❌ Missing | Must be added to registry |
| — | comparable-1b-unit-mix-1bed | ❌ Missing | Must be added to registry |
| — | comparable-1b-unit-mix-1bed-count | ❌ Missing | Must be added to registry |
| — | comparable-1b-unit-mix-2bed | ❌ Missing | Must be added to registry |
| — | comparable-1b-unit-mix-2bed-count | ❌ Missing | Must be added to registry |
| — | comparable-1b-unit-mix-3bed | ❌ Missing | Must be added to registry |
| — | comparable-1b-unit-mix-3bed-count | ❌ Missing | Must be added to registry |
| — | comparable-4-analysis-price | ❌ Missing | Must be added to registry |
| — | comparable-4-analysis-price-per-unit | ❌ Missing | Must be added to registry |
| — | comparable-4-arms-length | ❌ Missing | Must be added to registry |
| — | comparable-4-building-photo | ❌ Missing | Must be added to registry |
| — | comparable-4-buyer | ❌ Missing | Must be added to registry |
| — | comparable-4-expenses | ❌ Missing | Must be added to registry |
| — | comparable-4-expenses-per-unit | ❌ Missing | Must be added to registry |
| — | comparable-4-financing | ❌ Missing | Must be added to registry |
| — | comparable-4-flooring | ❌ Missing | Must be added to registry |
| — | comparable-4-gross-building-area | ❌ Missing | Must be added to registry |
| — | comparable-4-label | ❌ Missing | Must be added to registry |
| — | comparable-4-land-area | ❌ Missing | Must be added to registry |
| — | comparable-4-location-map | ❌ Missing | Must be added to registry |
| — | comparable-4-lot-size | ❌ Missing | Must be added to registry |
| — | comparable-4-net-operating-income | ❌ Missing | Must be added to registry |
| — | comparable-4-net-rentable-area | ❌ Missing | Must be added to registry |
| — | comparable-4-occupancy | ❌ Missing | Must be added to registry |
| — | comparable-4-parking-type | ❌ Missing | Must be added to registry |
| — | comparable-4-project-amenities | ❌ Missing | Must be added to registry |
| — | comparable-4-property-name | ❌ Missing | Must be added to registry |
| — | comparable-4-property-type | ❌ Missing | Must be added to registry |
| — | comparable-4-recording-number | ❌ Missing | Must be added to registry |
| — | comparable-4-remarks | ❌ Missing | Must be added to registry |
| — | comparable-4-rent-type | ❌ Missing | Must be added to registry |
| — | comparable-4-rights-transferred | ❌ Missing | Must be added to registry |
| — | comparable-4-security-features | ❌ Missing | Must be added to registry |
| — | comparable-4-seller | ❌ Missing | Must be added to registry |
| — | comparable-4-title | ❌ Missing | Must be added to registry |
| — | comparable-4-transaction-status | ❌ Missing | Must be added to registry |
| — | comparable-4-unit-amenities | ❌ Missing | Must be added to registry |
| — | comparable-4-unit-mix-1bed | ❌ Missing | Must be added to registry |
| — | comparable-4-unit-mix-2bed | ❌ Missing | Must be added to registry |
| — | comparable-content-placeholder | ❌ Missing | Must be added to registry |
| — | comparable-details-table | ❌ Missing | Must be added to registry |
| — | comparable-distance-table | ❌ Missing | Must be added to registry |
| — | comparable-presentation-heading | ❌ Missing | Must be added to registry |
| — | comparable-sales-table | ❌ Missing | Must be added to registry |
| — | comparable-selection-criteria | ❌ Missing | Must be added to registry |
| — | conclusion-avg-price | ❌ Missing | Must be added to registry |
| — | conclusion-avg-price-value | ❌ Missing | Must be added to registry |
| — | conclusion-high-price | ❌ Missing | Must be added to registry |
| — | conclusion-high-price-value | ❌ Missing | Must be added to registry |
| — | conclusion-low-price | ❌ Missing | Must be added to registry |
| — | conclusion-low-price-value | ❌ Missing | Must be added to registry |
| — | conclusion-med-price | ❌ Missing | Must be added to registry |
| — | conclusion-med-price-value | ❌ Missing | Must be added to registry |
| — | conditions-array | ❌ Missing | Must be added to registry |
| — | contract-vs-market-rent-section | ❌ Missing | Must be added to registry |
| — | contract-vs-market-table | ❌ Missing | Must be added to registry |
| — | cost-approach-status | ❌ Missing | Must be added to registry |
| — | current-owner | ❌ Missing | Must be added to registry |
| — | direct-capitalization-intro | ❌ Missing | Must be added to registry |
| — | direct-capitalization-method | ❌ Missing | Must be added to registry |
| — | direct-comparison-addresses-title | ❌ Missing | Must be added to registry |
| — | direct-comparison-conclusion-title | ❌ Missing | Must be added to registry |
| — | direct-comparison-conclusion-unit-title | ❌ Missing | Must be added to registry |
| — | direct-comparison-final-indicated-value | ❌ Missing | Must be added to registry |
| — | direct-comparison-final-indicated-value-amount | ❌ Missing | Must be added to registry |
| — | direct-comparison-final-price-per-sf-amount | ❌ Missing | Must be added to registry |
| — | direct-comparison-final-title | ❌ Missing | Must be added to registry |
| — | direct-comparison-income-info-title | ❌ Missing | Must be added to registry |
| — | direct-comparison-intro-text | ❌ Missing | Must be added to registry |
| — | direct-comparison-physical-info-title | ❌ Missing | Must be added to registry |
| — | direct-comparison-sale-info-title | ❌ Missing | Must be added to registry |
| — | direct-comparison-section-heading | ❌ Missing | Must be added to registry |
| — | direct-comparison-title | ❌ Missing | Must be added to registry |
| — | direct-comparison-unit-amenities-title | ❌ Missing | Must be added to registry |
| — | direct-comparison-value | ❌ Missing | Must be added to registry |
| — | dom-financing-array | ❌ Missing | Must be added to registry |
| — | dscr-or-noi-per-unit | ❌ Missing | Must be added to registry |
| — | effective-gross-income-array | ❌ Missing | Must be added to registry |
| — | effective-gross-revenue-section | ❌ Missing | Must be added to registry |
| — | excess-surplus-land | ❌ Missing | Must be added to registry |
| — | exposure-time-assumptions | ❌ Missing | Must be added to registry |
| — | exposure-time-value-table | ❌ Missing | Must be added to registry |
| — | extraordinary-assumptions-title | ❌ Missing | Must be added to registry |
| — | extraordinary-limiting-conditions-text | ❌ Missing | Must be added to registry |
| — | extraordinary-limiting-conditions-title | ❌ Missing | Must be added to registry |
| — | final-price-per-sf-amount | ❌ Missing | Must be added to registry |
| — | final-reconciliation-footer-address | ❌ Missing | Must be added to registry |
| — | final-reconciliation-page-number | ❌ Missing | Must be added to registry |
| — | final-value-conclusion-amount | ❌ Missing | Must be added to registry |
| — | geocode | ❌ Missing | Must be added to registry |
| — | hbu-label-improved | ❌ Missing | Must be added to registry |
| — | hbu-label-vacant | ❌ Missing | Must be added to registry |
| — | hbu-proposed-construction | ❌ Missing | Must be added to registry |
| — | highest-best-use | ❌ Missing | Must be added to registry |
| — | hypothetical-conditions-title | ❌ Missing | Must be added to registry |
| — | improvements-summary | ❌ Missing | Must be added to registry |
| — | income-approach-final-cap-rate-value | ❌ Missing | Must be added to registry |
| — | income-approach-final-indicated-value | ❌ Missing | Must be added to registry |
| — | income-approach-final-indicated-value-amount | ❌ Missing | Must be added to registry |
| — | income-approach-final-noi | ❌ Missing | Must be added to registry |
| — | income-approach-final-noi-amount | ❌ Missing | Must be added to registry |
| — | income-approach-final-noi-per-sf | ❌ Missing | Must be added to registry |
| — | income-approach-final-noi-per-sf-amount | ❌ Missing | Must be added to registry |
| — | income-approach-final-price-per-sf-amount | ❌ Missing | Must be added to registry |
| — | inspection-appraiser-1 | ❌ Missing | Must be added to registry |
| — | inspection-appraiser-2 | ❌ Missing | Must be added to registry |
| — | inspection-date-1 | ❌ Missing | Must be added to registry |
| — | inspection-date-2 | ❌ Missing | Must be added to registry |
| — | inspection-extent | ❌ Missing | Must be added to registry |
| — | inspection-role-1 | ❌ Missing | Must be added to registry |
| — | inspection-role-2 | ❌ Missing | Must be added to registry |
| — | interest-appraised | ❌ Missing | Must be added to registry |
| — | intro-photo-1 | ❌ Missing | Must be added to registry |
| — | intro-photo-10 | ❌ Missing | Must be added to registry |
| — | intro-photo-11 | ❌ Missing | Must be added to registry |
| — | intro-photo-12 | ❌ Missing | Must be added to registry |
| — | intro-photo-13 | ❌ Missing | Must be added to registry |
| — | intro-photo-2 | ❌ Missing | Must be added to registry |
| — | intro-photo-3 | ❌ Missing | Must be added to registry |
| — | intro-photo-4 | ❌ Missing | Must be added to registry |
| — | intro-photo-5 | ❌ Missing | Must be added to registry |
| — | intro-photo-6 | ❌ Missing | Must be added to registry |
| — | intro-photo-7 | ❌ Missing | Must be added to registry |
| — | intro-photo-8 | ❌ Missing | Must be added to registry |
| — | intro-photo-9 | ❌ Missing | Must be added to registry |
| — | investment-activity-trends-text | ❌ Missing | Must be added to registry |
| — | land-use-conformity | ❌ Missing | Must be added to registry |
| — | lot-17-adjacent-lots | ❌ Missing | Must be added to registry |
| — | lot-17-dimensions | ❌ Missing | Must be added to registry |
| — | lot-18-dimensions | ❌ Missing | Must be added to registry |
| — | market-analysis-content | ❌ Missing | Must be added to registry |
| — | market-submarket-label | ❌ Missing | Must be added to registry |
| — | marketing-time-vs-exposure-time | ❌ Missing | Must be added to registry |
| — | multifamily-chart-placeholder | ❌ Missing | Must be added to registry |
| — | multifamily-revenue-analysis-intro | ❌ Missing | Must be added to registry |
| — | municipal-services | ❌ Missing | Must be added to registry |
| — | net-operating-income-conclusion | ❌ Missing | Must be added to registry |
| — | net-operating-income-ytd | ❌ Missing | Must be added to registry |
| — | nra-sqft | ❌ Missing | Must be added to registry |
| — | one-bed-units-analysis-table | ❌ Missing | Must be added to registry |
| — | operating-expenses-breakdown-table | ❌ Missing | Must be added to registry |
| — | operating-expenses-detail-table | ❌ Missing | Must be added to registry |
| — | operating-expenses-discussion | ❌ Missing | Must be added to registry |
| — | operating-history-table | ❌ Missing | Must be added to registry |
| — | other-revenue-conclusions-table | ❌ Missing | Must be added to registry |
| — | ownership-history | ❌ Missing | Must be added to registry |
| — | page-25-continuation | ❌ Missing | Must be added to registry |
| — | page-footer | ❌ Missing | Must be added to registry |
| — | potential-gross-revenue-section | ❌ Missing | Must be added to registry |
| — | property-address-line2 | ❌ Missing | Must be added to registry |
| — | property-description | ❌ Missing | Must be added to registry |
| — | property-improvements-summary | ❌ Missing | Must be added to registry |
| — | reconciliation-footer-address | ❌ Missing | Must be added to registry |
| — | reconciliation-of-value-title | ❌ Missing | Must be added to registry |
| — | reconciliation-page-number | ❌ Missing | Must be added to registry |
| — | reconciliation-para-1-scope | ❌ Missing | Must be added to registry |
| — | reconciliation-para-2-process | ❌ Missing | Must be added to registry |
| — | reconciliation-para-3-cost-approach | ❌ Missing | Must be added to registry |
| — | reconciliation-para-4-sales-comparison | ❌ Missing | Must be added to registry |
| — | reconciliation-para-5-income-approach | ❌ Missing | Must be added to registry |
| — | reconciliation-para-6-emphasis | ❌ Missing | Must be added to registry |
| — | rent-survey-information-table | ❌ Missing | Must be added to registry |
| — | rental-revenue-table | ❌ Missing | Must be added to registry |
| — | revenue-data-array | ❌ Missing | Must be added to registry |
| — | sales-comparison-analysis-para-1 | ❌ Missing | Must be added to registry |
| — | sales-comparison-analysis-para-2 | ❌ Missing | Must be added to registry |
| — | sales-comparison-analysis-para-3 | ❌ Missing | Must be added to registry |
| — | sales-comparison-analysis-para-4 | ❌ Missing | Must be added to registry |
| — | sales-comparison-approach-conclusion-title | ❌ Missing | Must be added to registry |
| — | sales-comparison-approach-title | ❌ Missing | Must be added to registry |
| — | sales-comparison-indicated-value-amount | ❌ Missing | Must be added to registry |
| — | sales-comparison-price-per-sf-amount | ❌ Missing | Must be added to registry |
| — | section-title | ❌ Missing | Must be added to registry |
| — | site-area-acres | ❌ Missing | Must be added to registry |
| — | site-exposure | ❌ Missing | Must be added to registry |
| — | site-exposure-rating | ❌ Missing | Must be added to registry |
| — | site-intro-text | ❌ Missing | Must be added to registry |
| — | site-quality-rating | ❌ Missing | Must be added to registry |
| — | site-topography | ❌ Missing | Must be added to registry |
| — | site-utility-rating | ❌ Missing | Must be added to registry |
| — | sources-data-limitation-note | ❌ Missing | Must be added to registry |
| — | sources-of-information-table | ❌ Missing | Must be added to registry |
| — | stabilized-occupancy-percent | ❌ Missing | Must be added to registry |
| — | story-count | ❌ Missing | Must be added to registry |
| — | subject-rent-roll-table | ❌ Missing | Must be added to registry |
| — | subject-total-value-amount | ❌ Missing | Must be added to registry |
| — | subject-unit-indicated-value-amount | ❌ Missing | Must be added to registry |
| — | table-section-header | ❌ Missing | Must be added to registry |
| — | toc-section-1 | ❌ Missing | Must be added to registry |
| — | toc-section-2 | ❌ Missing | Must be added to registry |
| — | traffic-count-data | ❌ Missing | Must be added to registry |
| — | transaction-adjustments-array | ❌ Missing | Must be added to registry |
| — | transaction-prices-array | ❌ Missing | Must be added to registry |
| — | two-bed-unit-conclusion-table | ❌ Missing | Must be added to registry |
| — | two-bed-units-analysis-table | ❌ Missing | Must be added to registry |
| — | unadjusted-adjusted-price-chart | ❌ Missing | Must be added to registry |
| — | unit-count | ❌ Missing | Must be added to registry |
| — | unit-of-comparison | ❌ Missing | Must be added to registry |
| — | unit-rent-discussion | ❌ Missing | Must be added to registry |
| — | units-count-array | ❌ Missing | Must be added to registry |
| — | units-occupied-vacant | ❌ Missing | Must be added to registry |
| — | usable-site-size-sqft | ❌ Missing | Must be added to registry |
| — | vacancy-allowance-discussion | ❌ Missing | Must be added to registry |
| — | valuation-date-value | ❌ Missing | Must be added to registry |
| — | valuation-interest-value | ❌ Missing | Must be added to registry |
| — | valuation-intro-text | ❌ Missing | Must be added to registry |
| — | valuation-scenarios-title | ❌ Missing | Must be added to registry |
| — | value-scenario-label | ❌ Missing | Must be added to registry |
| — | value-scenario-type | ❌ Missing | Must be added to registry |
| — | visibility-rating | ❌ Missing | Must be added to registry |
| — | zoning-district | ❌ Missing | Must be added to registry |
| — | zoning-districts | ❌ Missing | Must be added to registry |

## Action Items

### High Priority - Uncertain Matches (146 fields)

These matches need manual verification to confirm they are correct:

- `cost-approach-conclusion` → `income-approach-conclusion-table` (similarity: 78.43%)
- `tenancy` → `tenancy-type` (similarity: 77.78%)
- `appraiser-name` → `appraiser-aic-number` (similarity: 77.42%)
- `comp1-cap-rate` → `comparable-1b-cap-rate` (similarity: 77.42%)
- `hbu-vacant-legal` → `hbu-vacant-use` (similarity: 76.92%)
- `site-rating` → `site-access-rating` (similarity: 76.92%)
- `calc-total-rental-revenue` → `total-rental-revenue-section` (similarity: 76.60%)
- `accessibility` → `site-accessibility-note` (similarity: 76.47%)
- `comp2-sale-price` → `comparable-4-sale-price` (similarity: 76.47%)
- `report-date` → `report-title` (similarity: 76.19%)
- `appraiser-title` → `appraiser-signatory-title` (similarity: 75.68%)
- `property-rights` → `property-rights-appraised` (similarity: 75.68%)
- `zoning-conclusion` → `concessions-conclusion` (similarity: 75.68%)
- `comp2-sale-date` → `comparable-4-sale-date` (similarity: 75.00%)
- `img-map-local` → `intro-map-local` (similarity: 75.00%)
- `intake-property-address` → `property-address-full` (similarity: 75.00%)
- `market` → `market-name` (similarity: 75.00%)
- `calc-concessions-rate` → `concessions-array` (similarity: 74.29%)
- `calc-noi-per-unit` → `comparable-4-noi-per-unit` (similarity: 74.29%)
- `comp3-sale-price` → `comparable-1b-sale-price` (similarity: 74.29%)
- `building-format` → `building-count` (similarity: 74.07%)
- `comp1-units` → `comparable-1b-units` (similarity: 74.07%)
- `street-address` → `subject-address` (similarity: 74.07%)
- `sales-adjustment-summary` → `physical-adjustments-array` (similarity: 73.91%)
- `loe-property-rights` → `property-rights-details` (similarity: 73.68%)
- `comp2-cap-rate` → `comparable-4-cap-rate` (similarity: 73.33%)
- `comp3-sale-date` → `comparable-1b-sale-date` (similarity: 72.73%)
- `land-value-conclusion` → `final-value-conclusion-title` (similarity: 72.73%)
- `calc-indicated-value` → `sales-comparison-indicated-value` (similarity: 72.34%)
- `calc-exp-utilities` → `comparable-1-utilities` (similarity: 72.22%)
- `intake-client-address` → `client-address-full` (similarity: 72.22%)
- `loe-appraiser-comments` → `appraiser-company` (similarity: 72.22%)
- `site-conclusion` → `exposure-time-conclusion` (similarity: 72.22%)
- `building-style` → `building-nra-sqft` (similarity: 71.43%)
- `calc-vacancy-loss` → `vacancy-loss-table` (similarity: 70.97%)
- `appraiser-credentials` → `appraiser-email` (similarity: 70.59%)
- `comp2-price-per-unit` → `price-per-unit-array` (similarity: 70.59%)
- `total-buildings` → `comparable-1-buildings` (similarity: 70.59%)
- `public-transit` → `public-transit-description` (similarity: 70.27%)
- `comp1-price-per-sf` → `sales-comparison-price-per-sf` (similarity: 70.00%)
- `site-address` → `site-grade` (similarity: 70.00%)
- `loe-report-type` → `report-date` (similarity: 69.57%)
- `province` → `subject-province` (similarity: 69.57%)
- `site-acreage` → `site-area-sqft` (similarity: 69.57%)
- `site-total-area` → `site-area-sf` (similarity: 69.57%)
- `comp2-units` → `comparable-4-units` (similarity: 69.23%)
- `img-zoning-map` → `zoning-map-image` (similarity: 69.23%)
- `submarket` → `subject-zone-market` (similarity: 69.23%)
- `calc-cap-rate` → `comparable-1-cap-rate` (similarity: 68.97%)
- `calc-vacancy-rate` → `vacancy-rates-array` (similarity: 68.75%)
- `multifamily-overview` → `multifamily-sf` (similarity: 68.75%)
- `property-name` → `comparable-1-property-name` (similarity: 68.57%)
- `calc-avg-rent-per-unit` → `concluded-rent-per-unit` (similarity: 68.42%)
- `appraiser-province` → `appraiser-assistance-provided` (similarity: 68.18%)
- `comp1-name` → `comp-1-address` (similarity: 66.67%)
- `comp3-price-per-unit` → `comparable-1-analysis-price-per-unit` (similarity: 66.67%)
- `hbu-conclusion-text` → `one-bed-unit-conclusion-table` (similarity: 66.67%)
- `img-street-1` → `intro-map-street` (similarity: 66.67%)
- `impv-building-format` → `building-information-table` (similarity: 66.67%)
- `impv-year-built` → `comparable-1-year-built` (similarity: 66.67%)
- `income-cap-rate-analysis` → `comparable-1-analysis-price` (similarity: 66.67%)
- `property-is-listed` → `property-address-line1` (similarity: 66.67%)
- `security` → `security-features` (similarity: 66.67%)
- `site-coverage` → `section-divider-page` (similarity: 66.67%)
- `subject-units` → `subsection-title` (similarity: 66.67%)
- `market-vacancy-rate` → `market-value-characteristics` (similarity: 65.12%)
- `recon-final-value` → `comp-1-conclusion-final-value` (similarity: 65.00%)
- `survey-methodology` → `cap-rate-methodology-intro` (similarity: 65.00%)
- `survey1-utilities` → `comparable-1b-utilities` (similarity: 64.86%)
- `survey1-year-built` → `comparable-1b-year-built` (similarity: 64.86%)
- `survey-intro` → `survey-presentation-intro` (similarity: 64.71%)
- `client-address` → `comparable-1-address` (similarity: 64.52%)
- `img-common-1-caption` → `photo-10-caption` (similarity: 64.52%)
- `img-common-2-caption` → `photo-12-caption` (similarity: 64.52%)
- `intake-client-first-name` → `client-name` (similarity: 64.52%)
- `loe-appraisal-fee` → `appraisal-purpose` (similarity: 64.52%)
- `comp3-cap-rate` → `comparable-1-title` (similarity: 64.29%)
- `parking-ratio` → `parking-type-array` (similarity: 64.29%)
- `comp1-year` → `comparable-1-buyer` (similarity: 64.00%)
- `img-exterior-1` → `exterior-array` (similarity: 64.00%)
- `parking-spaces` → `parking-ratio` (similarity: 64.00%)
- `photos-common` → `photo-9-caption` (similarity: 64.00%)
- `subject-gba` → `subject-distance` (similarity: 64.00%)
- `total-nra` → `total-land-area-sqft` (similarity: 64.00%)
- `comp2-price-per-sf` → `income-approach-final-price-per-sf` (similarity: 63.64%)
- `income-pgi-narrative` → `income-approach-final-cap-rate` (similarity: 63.64%)
- `intake-client-title` → `final-reconciliation-title` (similarity: 63.41%)
- `appraiser-address` → `appraiser-signatory-name` (similarity: 63.16%)
- `cover-photo` → `corner-lot` (similarity: 63.16%)
- `national-overview` → `income-approach-overview` (similarity: 63.16%)
- `recon-income-value` → `income-approach-value` (similarity: 62.86%)
- `appraiser-company` → `appraiser-address` (similarity: 62.50%)
- `img-exterior-1-caption` → `photo-1-caption` (similarity: 62.50%)
- `img-exterior-2-caption` → `photo-2-caption` (similarity: 62.50%)
- `img-exterior-3-caption` → `photo-3-caption` (similarity: 62.50%)
- `img-exterior-4-caption` → `photo-4-caption` (similarity: 62.50%)
- `img-exterior-5-caption` → `photo-5-caption` (similarity: 62.50%)
- `img-exterior-6-caption` → `photo-6-caption` (similarity: 62.50%)
- `market-national-inflation` → `market-rent-conclusion-intro` (similarity: 62.50%)
- `recon-sales-value` → `subject-total-value` (similarity: 62.50%)
- `survey1-laundry` → `comparable-1-laundry` (similarity: 62.50%)
- `survey4-laundry` → `comparable-4-laundry` (similarity: 62.50%)
- `calc-expenses-total` → `expense-ratio` (similarity: 62.07%)
- `calc-value-per-sf` → `final-price-per-sf` (similarity: 62.07%)
- `img-unit-1-caption` → `photo-11-caption` (similarity: 62.07%)
- `income-noi-narrative` → `income-approach-final-title` (similarity: 61.90%)
- `location-nearby-amenities` → `location-description` (similarity: 61.90%)
- `market-local-population` → `market-value-definition` (similarity: 61.90%)
- `overall-condition` → `hypothetical-conditions-text` (similarity: 61.90%)
- `calc-parking-per-unit` → `comparable-1-noi-per-unit` (similarity: 61.54%)
- `calc-value-per-unit` → `comparable-1-price-per-unit` (similarity: 61.54%)
- `comp2-name` → `comp2-unit-mix-table` (similarity: 61.54%)
- `hbu-vacant-productive` → `hbu-label-construction` (similarity: 61.54%)
- `roof` → `roof-array` (similarity: 61.54%)
- `subject-condition` → `subject-property-location` (similarity: 61.54%)
- `survey5-address` → `comp-5-address` (similarity: 61.54%)
- `total-units` → `comparable-1-units` (similarity: 61.54%)
- `calc-laundry-per-unit` → `current-rent-per-unit` (similarity: 61.11%)
- `calc-parking-total` → `sales-comparison-title` (similarity: 61.11%)
- `impv-num-buildings` → `comparable-4-buildings` (similarity: 61.11%)
- `location-access` → `location-map-placeholder` (similarity: 61.11%)
- `occupancy-rate` → `current-occupancy-percent` (similarity: 61.11%)
- `survey1-distance` → `survey-comparison-table` (similarity: 61.11%)
- `survey2-utilities` → `comparable-4-utilities` (similarity: 61.11%)
- `survey2-year-built` → `comparable-4-year-built` (similarity: 61.11%)
- `comp2-year` → `comp-zones-array` (similarity: 60.87%)
- `comp3-price-per-sf` → `direct-comparison-final-price-per-sf` (similarity: 60.87%)
- `rent-1br-low` → `rent-roll-notes` (similarity: 60.87%)
- `zone-conditional-uses` → `comparable-1-conditions-of-sale` (similarity: 60.87%)
- `fire-protection` → `frontage-description` (similarity: 60.61%)
- `recon-cost-value` → `reconciliation-title` (similarity: 60.61%)
- `report-type` → `comparable-1-property-type` (similarity: 60.61%)
- `survey1-address` → `comparable-1b-address` (similarity: 60.61%)
- `annual-taxes` → `actual-age` (similarity: 60.00%)
- `exposure-visibility` → `exposure-time-definition` (similarity: 60.00%)
- `img-common-3-caption` → `photo-7-caption` (similarity: 60.00%)
- `img-common-4-caption` → `photo-8-caption` (similarity: 60.00%)
- `img-site-plan-1` → `site-plan-lot-17-image` (similarity: 60.00%)
- `intake-valuation-premises` → `valuation-interest` (similarity: 60.00%)
- `market-demand-drivers` → `market-rent-survey-intro` (similarity: 60.00%)
- `market-national-gdp` → `marketing-time` (similarity: 60.00%)
- `subject-site-area` → `subject-unit-indicated-value` (similarity: 60.00%)
- `survey-conclusion` → `expense-conclusions-header` (similarity: 60.00%)
- `survey1-condition` → `condition-array` (similarity: 60.00%)
- `survey3-year-built` → `year-built-array` (similarity: 60.00%)
- `walk-score` → `walk-transit-bike-scores` (similarity: 60.00%)

### Medium Priority - Close Matches (20 fields)

These fields just need to be renamed in fieldRegistry.ts:

- Rename `value-scenario` → `value-scenarios`
- Rename `extraordinary-assumptions` → `extraordinary-assumptions-text`
- Rename `comp1-address` → `comp-2-address`
- Rename `comp2-address` → `comp-3-address`
- Rename `comp3-address` → `comp-4-address`
- Rename `density-units-acre` → `density-units-per-acre`
- Rename `hbu-improved` → `hbu-improved-use`
- Rename `loe-scope-of-work` → `scope-of-work`
- Rename `site-plan-image` → `site-plan-lot-18-image`
- Rename `unit-amenities` → `unit-amenities-array`
- Rename `building-quality` → `building-quality-rating`
- Rename `building-appeal` → `building-appeal-rating`
- Rename `comp1-sale-price` → `comparable-1-sale-price`
- Rename `comp1-sale-date` → `comparable-1-sale-date`
- Rename `comp1-price-per-unit` → `comparable-4-price-per-unit`
- Rename `foundation` → `foundation-array`
- Rename `img-map-regional` → `intro-map-regional`
- Rename `intake-property-name` → `property-name`
- Rename `intake-property-type` → `property-type`
- Rename `use-dcf-methodology` → `dcf-methodology-note`

### Already Aligned - Exact Matches (24 fields)

These fields are perfectly aligned and need no changes:

```
adjacent-east, adjacent-north, adjacent-south, adjacent-west, concluded-value
economic-life, effective-age, extraordinary-limiting-conditions, file-number, hypothetical-conditions
laundry, legal-description, local-area-description, nearby-schools, project-amenities
remaining-useful-life, site-quality, site-shape, site-utility, topography
valuation-date, year-built, zoning-classification, zoning-description
```

### Low Priority - Extra Fields (329 fields)

These registry fields are not found in the HTML source. Review if they are still needed:

- `actual-age` - Consider removing if obsolete
- `appraiser-aic-number` - Consider removing if obsolete
- `appraiser-city` - Consider removing if obsolete
- `appraiser-email` - Consider removing if obsolete
- `appraiser-phone` - Consider removing if obsolete
- `appraiser-postal` - Consider removing if obsolete
- `appraiser-website` - Consider removing if obsolete
- `assessment-year` - Consider removing if obsolete
- `bike-score` - Consider removing if obsolete
- `building-assessment` - Consider removing if obsolete
- `calc-adj-capex` - Consider removing if obsolete
- `calc-adj-leasing` - Consider removing if obsolete
- `calc-adj-other` - Consider removing if obsolete
- `calc-adj-total` - Consider removing if obsolete
- `calc-avg-rent-per-sf` - Consider removing if obsolete
- `calc-avg-unit-sf` - Consider removing if obsolete
- `calc-bad-debt-rate` - Consider removing if obsolete
- `calc-egr` - Consider removing if obsolete
- `calc-exp-admin` - Consider removing if obsolete
- `calc-exp-insurance` - Consider removing if obsolete
- `calc-exp-management` - Consider removing if obsolete
- `calc-exp-other` - Consider removing if obsolete
- `calc-exp-payroll` - Consider removing if obsolete
- `calc-exp-repairs` - Consider removing if obsolete
- `calc-exp-reserves` - Consider removing if obsolete
- `calc-exp-taxes` - Consider removing if obsolete
- `calc-expense-ratio` - Consider removing if obsolete
- `calc-grm` - Consider removing if obsolete
- `calc-laundry-total` - Consider removing if obsolete
- `calc-noi` - Consider removing if obsolete
- `calc-noi-per-sf` - Consider removing if obsolete
- `calc-other-income` - Consider removing if obsolete
- `calc-pgr` - Consider removing if obsolete
- `calc-raw-value` - Consider removing if obsolete
- `calc-total-other-income` - Consider removing if obsolete
- `calc-total-sf` - Consider removing if obsolete
- `calc-total-units` - Consider removing if obsolete
- `calc-type1-annual` - Consider removing if obsolete
- `calc-type1-count` - Consider removing if obsolete
- `calc-type1-name` - Consider removing if obsolete
- `calc-type1-rent` - Consider removing if obsolete
- `calc-type1-sf` - Consider removing if obsolete
- `calc-type2-annual` - Consider removing if obsolete
- `calc-type2-count` - Consider removing if obsolete
- `calc-type2-name` - Consider removing if obsolete
- `calc-type2-rent` - Consider removing if obsolete
- `calc-type2-sf` - Consider removing if obsolete
- `calc-type3-annual` - Consider removing if obsolete
- `calc-type3-count` - Consider removing if obsolete
- `calc-type3-name` - Consider removing if obsolete

... and 279 more (see table above for full list)

### Required - Missing Fields (334 fields)

These HTML fields are not in the registry and must be added:

- `access-description`
- `adjusted-prices-array`
- `adjusted-values-array`
- `all-units-inspected`
- `alternative-investment-rates-text`
- `approaches-to-value-table`
- `assignment-purpose-text`
- `building-condition-rating`
- `building-description`
- `cap-rate-selection-intro`
- `capitalization-rate`
- `certification-footer-address`
- `certification-item-1-statements-of-fact`
- `certification-item-10-aic-membership`
- `certification-item-11-signature-requirement`
- `certification-item-2-analyses-opinions`
- `certification-item-3-no-interest`
- `certification-item-4-no-bias`
- `certification-item-5-compensation`
- `certification-item-6-cusap-conformity`
- `certification-item-7-competency`
- `certification-item-8-professional-assistance`
- `certification-item-9-cpd-requirements`
- `certification-page-number`
- `certification-section-title`
- `certification-title`
- `comp-1-conclusion-adjusted-price`
- `comp-1-conclusion-adjustment-pct`
- `comp-1-conclusion-net-gross-pct`
- `comp-1-conclusion-property-adjustment`
- `comp-1-conclusion-unadjusted-price`
- `comp-2-conclusion-adjusted-price`
- `comp-2-conclusion-adjustment-pct`
- `comp-2-conclusion-final-value`
- `comp-2-conclusion-net-gross-pct`
- `comp-2-conclusion-property-adjustment`
- `comp-2-conclusion-unadjusted-price`
- `comp-3-conclusion-adjusted-price`
- `comp-3-conclusion-adjustment-pct`
- `comp-3-conclusion-final-value`
- `comp-3-conclusion-net-gross-pct`
- `comp-3-conclusion-property-adjustment`
- `comp-3-conclusion-unadjusted-price`
- `comp-4-conclusion-adjusted-price`
- `comp-4-conclusion-adjustment-pct`
- `comp-4-conclusion-final-value`
- `comp-4-conclusion-net-gross-pct`
- `comp-4-conclusion-property-adjustment`
- `comp-4-conclusion-unadjusted-price`
- `comp-5-conclusion-adjusted-price`

... and 284 more (see table above for full list)

## Recommended Next Steps

1. **Review Uncertain Matches** (High Priority)
   - Manually verify the suggested mappings
   - Update field names where appropriate
   - Document any intentional differences

2. **Rename Close Matches** (Medium Priority)
   - Systematically rename registry fields to match HTML source
   - Update all references in code
   - Commit changes incrementally

3. **Add Missing Fields** (Required)
   - Add new field definitions to fieldRegistry.ts
   - Follow existing patterns for field structure
   - Include proper categories and data types

4. **Review Extra Fields** (Low Priority)
   - Identify which fields are truly obsolete
   - Remove unused fields to reduce maintenance burden
   - Document any custom fields that should remain

5. **Test and Validate**
   - Run full report generation after changes
   - Verify all fields render correctly
   - Check for any breaking changes

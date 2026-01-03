# Valcre Home Tab - Field Reference

---

## 1. SETUP

| Input Field | Outputs To |
|-------------|------------|
| Load job from Job Info tab | Pulls job data into workbook |
| Property Type | Report structure, narrative terminology |
| Property Subtype | Page selection, unit terminology |
| Valuation Type | Cover page, certification |
| # Rental Units | Income pages, unit mix |
| Occupancy Status | Descriptions, income assumptions |
| Property Description prefix | Narrative text throughout |
| Timeframe | Date logic, retrospective/current labels |
| Use Stabilization Tool | Enables stabilization analysis pages |
| Select Workbook | Which calculation workbook links |
| Select Modules | Which approach sections appear |

---

## 2. APPROACH TOGGLES

| Input Field | Outputs To |
|-------------|------------|
| Use Site & Land DC | Enables land valuation pages |
| Land Value 1 | Land valuation page |
| Land Value 2 | Land valuation page |
| Land Value 3 | Land valuation page |
| Use Cost Approach | Adds cost pages, reconciliation |
| Use Direct Comparison | Enables SCA pages |
| Use Multi-DC | Multiple SCA grids |
| Sale/Lease Config | Units of comparison ($/SF, $/Unit) |
| Use Income Approach | Enables income pages |
| Commercial Leases 1-5 | Income schedule, lease abstracts |
| Use DCF | Adds DCF pages |
| Use Special/Hotel | Special purpose or hotel pages |

---

## 3. APPRAISAL INFO

| Input Field | Outputs To |
|-------------|------------|
| Company Name | Letterhead, certification, signature block |
| Company Address | Letterhead |
| City, Province | Letterhead |
| Phone | Letterhead, signature block |
| Report Type | Cover, certification, letter |
| Appraisal Status | Certification |

---

## 4. CLIENT INFO

| Input Field | Outputs To |
|-------------|------------|
| Client Name (legal) | LOE, cover letter, certification, intended users |
| Company Name | LOE, cover letter |
| Contact | Cover letter |
| Email | LOE |
| Address | Cover letter address block |
| Attention Line | Cover letter |
| Salutation | Cover letter greeting |

---

## 5. APPRAISER(S)

### Primary Appraiser
| Input Field | Outputs To |
|-------------|------------|
| Name | Certification, signature block |
| Credentials | After name throughout |
| Role | Certification |
| Title | Signature block |
| Phone | Signature block |
| Email | Signature block |
| Inspector? | Certification statement |
| Date Inspected | Certification |
| License Number | Certification |
| License Expiry | Certification |
| CE Completed | Certification statement |
| Ethics Completed | Certification statement |
| GET SIGNATURE | Signature block image |

### Secondary Appraiser
| Input Field | Outputs To |
|-------------|------------|
| Name | Certification, signature block |
| Credentials | After name |
| Role | Certification |
| Title | Signature block |
| Phone | Signature block |
| Email | Signature block |
| Inspector? | Certification statement |
| Date Inspected | Certification |

### Assistance
| Input Field | Outputs To |
|-------------|------------|
| Assistance Provided | Certification |
| Assistant Name | Certification |

---

## 6. VALUATION SCENARIOS

| Input Field | Outputs To |
|-------------|------------|
| Scenario Name | Cover, certification, reconciliation |
| Property Rights | Cover, certification, assumptions |
| Value Component | Certification |

---

## 7. DATES

| Input Field | Outputs To |
|-------------|------------|
| Letter Date | Cover letter date |
| Inspection Date | Certification, narrative |
| Report Date | Cover, certification, footer |
| Effective Date | Cover, certification, headers, throughout |

---

## 8. SUBJECT PROPERTY

| Input Field | Outputs To |
|-------------|------------|
| Property Name | Cover, headers |
| Street Address | Property description, cover, throughout |
| City | Throughout |
| Province | Throughout |
| Postal Code | Report |
| Country | Report |
| GET GEOCODE | Auto-fills lat/long |
| Latitude | Location map |
| Longitude | Location map |
| Parcel ID | Legal section |
| Legal Description | Legal section, addenda |
| Adjacent North | Site description |
| Adjacent South | Site description |
| Adjacent East | Site description |
| Adjacent West | Site description |

---

## 9. QUALITATIVE

| Input Field | Outputs To |
|-------------|------------|
| Site Appeal | Site description |
| Site Exposure | Site description |
| Site Utility | Site description |
| Building Quality | Building description |
| Building Appeal | Building description |
| Building Condition | Building description |
| Building Function | Building description |

---

## 10. TRANSACTION HISTORY

| Input Field | Outputs To |
|-------------|------------|
| Current Owner | Ownership section, certification |
| Owner Address | Ownership section |
| Prior Owner | Transaction history |
| Last Purchase Price | Transaction history |
| Deed Type | Transaction history |
| Ownership History | Transaction history narrative |
| Sales History | Transaction history narrative |

---

## 11. CONDITIONS

### Extraordinary Assumptions
| Input Field | Outputs To |
|-------------|------------|
| EA 1 | EA page, certification, letter |
| EA 2 | EA page, certification, letter |
| EA 3 | EA page, certification, letter |
| EA 4 | EA page, certification, letter |
| Default | "No Extraordinary Assumptions were made..." |

### Hypothetical Conditions
| Input Field | Outputs To |
|-------------|------------|
| HC 1 | HC page, certification, letter |
| HC 2 | HC page, certification, letter |
| HC 3 | HC page, certification, letter |
| HC 4 | HC page, certification, letter |
| Default | "No Hypothetical Conditions were made..." |

### Limiting Conditions
| Input Field | Outputs To |
|-------------|------------|
| ELC 1 | ELC page, certification |
| ELC 2 | ELC page, certification |
| ELC 3 | ELC page, certification |
| Default | "No Extraordinary Limiting Conditions..." |

---

## 12. OCCUPANCY

| Input Field | Outputs To |
|-------------|------------|
| Occupancy % | Property description, income |
| Stabilized Occupancy % | Income analysis |
| Stabilized Vacancy % | Income analysis |
| Market Vacancy % | Income analysis |

---

## 13. WORDS (Auto-Grammar)

| Input Field | Outputs To |
|-------------|------------|
| Units Plural | "unit" vs "units" in narrative |
| Report Type Article | "a" vs "an" before report type |
| Buildings Plural | "building" vs "buildings" |
| Area Units | "SF" vs "hectares" |
| Unit Terminology | "suite" / "unit" / "guest" by property type |

---

## SUMMARY

| Section | Fields |
|---------|--------|
| 1. Setup | 11 |
| 2. Approach Toggles | 12 |
| 3. Appraisal Info | 6 |
| 4. Client Info | 7 |
| 5. Appraiser(s) | 24 |
| 6. Valuation Scenarios | 3 |
| 7. Dates | 4 |
| 8. Subject Property | 15 |
| 9. Qualitative | 7 |
| 10. Transaction History | 7 |
| 11. Conditions | 14 |
| 12. Occupancy | 4 |
| 13. Words | 5 |
| **TOTAL** | **~119** |

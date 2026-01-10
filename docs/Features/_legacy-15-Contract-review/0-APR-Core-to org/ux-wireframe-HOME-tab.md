# HOME Tab UX Wireframe

**Purpose:** Visual mockup of HOME tab sub-sections to validate UX before implementation.

**Based on:** Valcre workbook (114 fields, 12 subsections) + our improvements

---

# 🏠 HOME

> Central data hub - fields used across multiple report pages

---

## ══════════════════════════════════════════════════════════
## 📋 VALUATION APPROACHES
## ══════════════════════════════════════════════════════════

*Always visible at top of HOME tab*

| Approach | Toggle | Additional |
|--|--|--|
| ☑️ **Income Approach** | `[ON]` | |
| ☑️ **Sales Comparison** | `[ON]` | |
| ☐ **Cost Approach** | `[OFF]` | |
| ☐ **DCF Analysis** | `[OFF]` | |
| ☐ **Land/Site DC** | `[OFF]` | |

**Sale/Lease Config:** `[ $/Unit ▼ ]`

---

## ══════════════════════════════════════════════════════════
## 🔧 JOB SETUP                                    [▼ Collapse]
## ══════════════════════════════════════════════════════════

| Field | Input | Example Value |
|--|--|--|
| **Job ID** | `[ VAL251012 - 1        ]` | *Auto from Valcre* |
| **Property Type** | `[ Multi-Family ▼ ]` | *Dropdown* |
| **Property Subtype** | `[ Apartment MURB ▼ ]` | *Dropdown* |
| **Valuation Type** | `[ Current ▼ ]` | *Dropdown* |
| **# Rental Units** | `[ 48 ]` | *Number* |
| **Occupancy Status** | `[ Multi-Tenant ▼ ]` | *Dropdown* |
| **Timeframe** | `[ Current ▼ ]` | *Dropdown* |

**Property Description Prefix:**
```
┌─────────────────────────────────────────────────────────────────┐
│ The subject property is a 48-unit apartment building            │
│ constructed in 2008 and located in North Battleford,            │
│ Saskatchewan.                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Workbook/Modules:**
| Option | Selection |
|--|--|
| Select Workbook | `[ Direct Comparison and Income ▼ ]` |
| Select Modules | `[☑️ DC] [☑️ Income] [☐ Cost] [☐ Land] [☐ DCF]` |

---

## ══════════════════════════════════════════════════════════
## 🏢 APPRAISAL FIRM                               [▼ Collapse]
## ══════════════════════════════════════════════════════════

| Field | Input | Example Value |
|--|--|--|
| **Company Name** | `[ Valta Property Valuations Ltd.     ]` | |
| **Company Address** | `[ 301, 4838 Richard Road SW          ]` | |
| **City, Province, Postal** | `[ Calgary, AB T3E 6L1                ]` | |
| **Company Phone** | `[ 403-800-9747                       ]` | |
| **Company Email** | `[ info@valtapv.com                   ]` | |

| Field | Input |
|--|--|
| **Report Type** | `[ Appraisal Report ▼ ]` |
| **Appraisal Status** | `[ Fully Detailed ▼ ]` |

---

## ══════════════════════════════════════════════════════════
## 👤 CLIENT INFORMATION                           [▼ Collapse]
## ══════════════════════════════════════════════════════════

| Field | Input | Example Value |
|--|--|--|
| **Client Name (Legal)** | `[ Kenneth Engler                     ]` | |
| **Organization** | `[ 102109845 Saskatchewan Ltd.        ]` | |
| **Contact Person** | `[ Kenneth Engler                     ]` | |
| **Email** | `[ kengler@example.com                ]` | |
| **Phone** | `[ (306) 555-1234                     ]` | |
| **Address** | `[ 1901, 1088 - 6th Ave SW            ]` | |
| **City** | `[ Calgary                            ]` | |
| **Province** | `[ Alberta ▼ ]` | *Dropdown* |
| **Postal Code** | `[ T3E 6L1                            ]` | |

| Field | Input |
|--|--|
| **Attention Line** | `[ att'n Kenneth Engler               ]` |
| **Salutation** | `[ Dear Mr. Engler                    ]` |

---

## ══════════════════════════════════════════════════════════
## 👨‍💼 APPRAISERS                                  [▼ Collapse]
## ══════════════════════════════════════════════════════════

### Primary Appraiser

| Field | Input | Example Value |
|--|--|--|
| **Name** | `[ Chris Chornohos                    ]` | |
| **Credentials** | `[ AACI, MRICS                        ]` | |
| **Role** | `[ Primary Appraiser ▼ ]` | *Dropdown* |
| **Title** | `[ Partner                            ]` | |
| **Phone** | `[ 587-801-5151                       ]` | |
| **Email** | `[ chris.chornohos@valta.ca           ]` | |
| **AIC License #** | `[ A12345                             ]` | |
| **License Expiry** | `[ 2026-12-31 📅 ]` | *Date picker* |

| Toggle | Status |
|--|--|
| ☑️ **Inspected Property** | `[ON]` |
| **Inspection Date** | `[ 2025-10-17 📅 ]` |
| **Inspection Extent** | `[ Full interior and exterior         ]` |
| ☑️ **All Units Inspected** | `[ON]` |
| ☑️ **CE Completed** | `[ON]` |
| ☑️ **Ethics Completed** | `[ON]` |

**Signature:** `[ 📎 Upload signature image ]`

---

### Secondary Appraiser

| Field | Input | Example Value |
|--|--|--|
| **Name** | `[ Sarah Johnson                      ]` | |
| **Credentials** | `[ AACI                               ]` | |
| **Role** | `[ Co-Appraiser ▼ ]` | *Dropdown* |
| **Title** | `[ Senior Director                    ]` | |
| **Phone** | `[ 587-891-5713                       ]` | |
| **Email** | `[ sarah.johnson@valta.ca             ]` | |

| Toggle | Status |
|--|--|
| ☐ **Inspected Property** | `[OFF]` |
| **Inspection Date** | `[ — ]` | *Disabled when not inspected* |

---

### Assistance

| Field | Input |
|--|--|
| **Assistant Name** | `[ None                               ]` |

**Assistance Statement:**
```
┌─────────────────────────────────────────────────────────────────┐
│ No one provided significant real property appraisal assistance  │
│ to the persons signing this appraisal report.                   │
└─────────────────────────────────────────────────────────────────┘
```
*Auto-fills if Assistant Name is "None" or empty*

---

## ══════════════════════════════════════════════════════════
## 📅 KEY DATES                                    [▼ Collapse]
## ══════════════════════════════════════════════════════════

| Field | Date | Notes |
|--|--|--|
| **Letter Date** | `[ 2025-12-26 📅 ]` | *Date of transmittal letter* |
| **Inspection Date** | `[ 2025-10-17 📅 ]` | *Links from Appraiser section* |
| **Report Date** | `[ 2025-12-26 📅 ]` | *Date report completed* |
| **Effective Date** | `[ 2025-10-17 📅 ]` | *Date of value opinion* |

---

## ══════════════════════════════════════════════════════════
## 🎯 VALUATION SCENARIO                           [▼ Collapse]
## ══════════════════════════════════════════════════════════

| Field | Input |
|--|--|
| **Scenario Name** | `[ As Stabilized ▼ ]` |
| **Property Rights** | `[ Fee Simple Estate ▼ ]` |
| **Value Component** | `[ Real Property ▼ ]` |

*Options: As Is, As Stabilized, As Complete, Hypothetical*

---

## ══════════════════════════════════════════════════════════
## 🏘️ SUBJECT PROPERTY                             [▼ Collapse]
## ══════════════════════════════════════════════════════════

| Field | Input | Example Value |
|--|--|--|
| **Property Name** | `[ North Battleford Apartments        ]` | |
| **Street Address** | `[ 1101, 1121 109 St                  ]` | |
| **City** | `[ North Battleford                   ]` | |
| **Province** | `[ Saskatchewan ▼ ]` | *Dropdown* |
| **Postal Code** | `[ S9A 2S9                            ]` | |
| **Country** | `[ Canada ▼ ]` | *Dropdown* |

| Field | Input |
|--|--|
| **Latitude** | `[ 52.7599945        ]` |
| **Longitude** | `[ -108.2801917      ]` |
| `[ 🔍 Get Geocode ]` | *Button - auto-fills lat/long* |

| Field | Input |
|--|--|
| **Parcel ID** | `[ 123456789                          ]` |

**Legal Description:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Plan - C4240; Block - 95; Lot - 17, 18, 19, 20                  │
│ North Battleford, Saskatchewan                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Adjacent Properties

| Direction | Land Use |
|--|--|
| **North** | `[ Residential ▼ ]` |
| **South** | `[ Residential ▼ ]` |
| **East** | `[ Residential ▼ ]` |
| **West** | `[ Commercial ▼ ]` |

*Options: Residential, Commercial, Industrial, Vacant, Park, Road, Institutional*

---

## ══════════════════════════════════════════════════════════
## ⭐ QUALITATIVE RATINGS                          [▼ Collapse]
## ══════════════════════════════════════════════════════════

### Site Ratings

| Rating | Value |
|--|--|
| **Site Appeal** | `[ Average ▼ ]` |
| **Site Exposure** | `[ Good ▼ ]` |
| **Site Utility** | `[ Average ▼ ]` |

### Building Ratings

| Rating | Value |
|--|--|
| **Building Quality** | `[ Average ▼ ]` |
| **Building Appeal** | `[ Average ▼ ]` |
| **Building Condition** | `[ Good ▼ ]` |
| **Building Function** | `[ Average ▼ ]` |

*All dropdowns: Excellent, Good, Average, Fair, Poor*

---

## ══════════════════════════════════════════════════════════
## 📜 TRANSACTION HISTORY                          [▼ Collapse]
## ══════════════════════════════════════════════════════════

| Field | Input | Example Value |
|--|--|--|
| **Current Owner** | `[ 102109845 Saskatchewan Ltd.        ]` | |
| **Owner Address** | `[ 1901, 1088 - 6th Ave SW            ]` | |
| **Prior Owner** | `[ ABC Holdings Inc.                  ]` | |
| **Last Purchase Price** | `[ $ 3,200,000                        ]` | *Currency* |
| **Purchase Date** | `[ 2020-05-15 📅 ]` | |
| **Deed Type** | `[ Warranty ▼ ]` | *Dropdown* |

**Ownership History:**
```
┌─────────────────────────────────────────────────────────────────┐
│ The subject property is currently under the ownership of        │
│ 102109845 Saskatchewan Ltd., having been acquired in May 2020.  │
└─────────────────────────────────────────────────────────────────┘
```

**Sales History:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Based on our research the subject property has no changes in    │
│ ownership within the past three years other than the noted      │
│ transaction.                                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## ══════════════════════════════════════════════════════════
## ⚠️ CONDITIONS                                   [▼ Collapse]
## ══════════════════════════════════════════════════════════

### Extraordinary Assumptions

| # | Assumption |
|--|--|
| EA 1 | `[ (empty - optional)                                    ]` |
| EA 2 | `[ (empty - optional)                                    ]` |
| EA 3 | `[ (empty - optional)                                    ]` |

**Auto-Default (if all empty):**
> *"No Extraordinary Assumptions were made for this assignment."*

---

### Hypothetical Conditions

| # | Condition |
|--|--|
| HC 1 | ```
┌─────────────────────────────────────────────────────────────────┐
│ The As Stabilized value has been developed based on the         │
│ hypothetical condition that the subject property is fully       │
│ leased at prevailing market rents and has achieved stabilized   │
│ occupancy as of the effective date of the appraisal.           │
└─────────────────────────────────────────────────────────────────┘
``` |
| HC 2 | `[ (empty - optional)                                    ]` |
| HC 3 | `[ (empty - optional)                                    ]` |

**Auto-Default (if all empty):**
> *"No Hypothetical Conditions were made for this assignment."*

---

### Extraordinary Limiting Conditions

| # | Condition |
|--|--|
| ELC 1 | `[ (empty - optional)                                    ]` |
| ELC 2 | `[ (empty - optional)                                    ]` |
| ELC 3 | `[ (empty - optional)                                    ]` |

**Auto-Default (if all empty):**
> *"No Extraordinary Limiting Conditions were made for this assignment."*

---

## ══════════════════════════════════════════════════════════
## 📊 OCCUPANCY                                    [▼ Collapse]
## ══════════════════════════════════════════════════════════

| Field | Value | Notes |
|--|--|--|
| **Current Occupancy** | `[ 100.0 ]` % | *Actual occupancy* |
| **Stabilized Occupancy** | `[ 95.0 ]` % | *Expected stabilized* |
| **Stabilized Vacancy** | `[ 5.0 ]` % | *Auto-calc: 100 - stabilized* |
| **Market Vacancy** | `[ 5.0 ]` % | *From market data* |

---

## ══════════════════════════════════════════════════════════
## ✉️ LETTER OF TRANSMITTAL                        [▼ Collapse]
## ══════════════════════════════════════════════════════════

| Field | Input |
|--|--|
| **Letter Date** | `[ 2025-12-26 📅 ]` | *Links to Key Dates* |

**Letter Body:**
```
┌─────────────────────────────────────────────────────────────────┐
│ RE: Appraisal Report                                            │
│     North Battleford Apartments                                 │
│     1101, 1121 109 St, North Battleford, SK S9A 2S9            │
│                                                                 │
│ Dear Mr. Engler,                                                │
│                                                                 │
│ In accordance with your request, we have prepared an appraisal  │
│ report for the above-referenced property. The purpose of this   │
│ appraisal is to estimate the market value of the fee simple     │
│ interest in the subject property as of October 17, 2025.        │
│                                                                 │
│ Based on our analysis, it is our opinion that the market value  │
│ of the subject property, as of the effective date, is:          │
│                                                                 │
│     EIGHT MILLION SIX HUNDRED THOUSAND DOLLARS                  │
│                           ($8,600,000)                          │
│                                                                 │
│ This letter is subject to the assumptions, limiting conditions, │
│ and certifications contained in the attached report.            │
│                                                                 │
│ Respectfully submitted,                                         │
│                                                                 │
│ VALTA PROPERTY VALUATIONS LTD.                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# Summary

| Subsection | Fields | Input Types |
|--|--|--|
| Valuation Approaches | 8 | Toggles, 1 dropdown |
| Job Setup | 11 | 5 dropdowns, textarea, text, number |
| Appraisal Firm | 7 | 2 dropdowns, text |
| Client Info | 11 | 1 dropdown, text |
| Appraisers | 23 | 2 dropdowns, 6 toggles, dates, file |
| Key Dates | 4 | All date pickers |
| Valuation Scenario | 3 | All dropdowns |
| Subject Property | 15 | 6 dropdowns, button, textarea |
| Qualitative Ratings | 7 | All dropdowns |
| Transaction History | 7 | 1 dropdown, currency, textareas |
| Conditions | 14 | Textareas with auto-defaults |
| Occupancy | 4 | Percentages |
| Letter of Transmittal | 2 | Date, textarea |
| **TOTAL** | **~116** | |

---

*Created: January 3, 2026*
*Purpose: UX validation before implementation*

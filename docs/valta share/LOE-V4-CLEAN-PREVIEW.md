# Letter of Engagement — V4 Clean Preview

> This is how the LOE will look when sent to a client. Bracket fields like [client.firstname] get replaced with real data before sending. This is the design spec — review and approve before building.

---

**[Valta Logo]**

[date.created]

[client.company] | [client.firstname] [client.lastname], [client.title]
[client.addressstreet]
[client.phone]
[client.email]

---

**Re:** Letter of Engagement ("LOE" or "Agreement") for Appraisal and Valuation Services for the Subject Property Identified as: [name], [addressstreet]

---

This Letter of Engagement (this "LOE", "Agreement") is made and entered into on [date.created] (Engagement Date), by and between Valta Property Valuations Ltd. and [client.company] (herein referred to as "Authorized Client").

---

### Assignment Details

| | |
|---|---|
| **Job Name** | [name] |
| **Property Address** | [addressstreet] |
| **Property Type** | [purposes] |
| **Interest Appraised** | [propertyrights] |
| **Authorized User** | The appraisal will be prepared for the above-mentioned Authorized Client. Authorized users include the Authorized Client. |
| **Authorized Use** | The report to be performed under this Agreement ("Appraisal") is authorized for [intendeduses]. No other use is authorized by Appraiser. |
| **Purpose** | To estimate the [valuetimeframe] market value of the subject property. |
| **Value Scenarios** | [valuescenarios] |
| **Effective Date** | Date of inspection. |
| **Report Type** | [reportformat] |

### Fee

| | |
|---|---|
| **Professional Fee** | [fee] |
| **Expenses** | Fees include all associated expenses. |
| **Payment Terms** | Appraiser shall invoice Client for services rendered pursuant to this Agreement based upon the fees specified in this Agreement. Appraiser's invoices are considered due upon receipt by Client and shall be deemed delinquent if not paid within five (5) days of the date of Appraiser's invoice. |

---

### Scope of Work

**Valuation Approaches**

Appraiser will provide the Appraisal in accordance with Canadian Uniform Standards of Professional Appraisal (CUSPAP). Appraiser will research relevant market data and perform analysis to the extent necessary to produce credible appraisal results. Appraiser anticipates developing the following valuation approaches:

> [approachestovalue]

The scope of work will be included in the Appraisal. A copy of the Assumptions and Limiting Conditions, which appear in the Appraisal, is available upon request.

Note: Appraiser shall use all approaches necessary to develop a credible opinion of value. Subject to any Extraordinary Assumptions and Hypothetical Conditions deemed necessary which will be included in the report.

| | |
|---|---|
| **Delivery** | [deliverytime] weeks (effective from date of payment or signed/returned engagement contract, whichever is later) |
| **Number of Reports** | One (1) Electronic Final Appraisal |
| **Acceptance Date** | These specifications are subject to modification if this Agreement is not accepted within 5 business days from the date of this letter. |

---

### Property Data Request

Please forward any additional materials you would consider relevant in the analysis of the subject property. Such items may include, as applicable:

> [clientdocuments]

Additionally, any other third party reports, or any other sources of information known to exist that may impact the valuation of the property.

Our ability to honor the terms of this Agreement will require Authorized Client's response within five (5) business days. If you have questions regarding the enclosed, please feel free to contact me, Valta Property Valuations Ltd. appreciates this opportunity to be of service to you on this assignment and looks forward to serving you. If you have additional questions, please contact us.

---

### Acceptance

I, [client.firstname] [client.lastname], agree to the above stated terms and authorize Valta Property Valuations Ltd. to prepare the above referenced appraisal.

__________________________________________________ Date: ________________________

[client.firstname] [client.lastname]

Respectfully,

**VALTA PROPERTY VALUATIONS LTD.**

**[Chris's Signature]**
Chris Chornohos, AACI, MRICS
Founder

---

### Terms & Conditions

*Full legal terms from client's updated template — PIPEDA compliance, CUSPAP standards, environmental disclaimers, confidentiality, insurance requirements, indemnification, liability limitations. 31 numbered clauses including nested insurance sublists.*

*(Full T&C text is in LOE-Template-Extracted.md — too long to repeat here but will be included verbatim in the HTML template.)*

---

## Field Reference

All bracket fields that appear in this template and need data mapping:

| Bracket | Source | Status |
|---------|--------|--------|
| `[date.created]` | Auto-generated current date | Existing |
| `[client.company]` | job.clientOrganization | Existing |
| `[client.firstname]` | job.clientFirstName | Existing |
| `[client.lastname]` | job.clientLastName | Existing |
| `[client.title]` | job.clientTitle | Existing |
| `[client.addressstreet]` | job.clientAddress | Existing |
| `[client.phone]` | job.clientPhone | NEW — already in DB |
| `[client.email]` | job.clientEmail | NEW — already in DB |
| `[name]` | jobDetails.jobNumber | Existing |
| `[addressstreet]` | job.propertyAddress | Existing |
| `[purposes]` | job.propertyType | Existing |
| `[propertyrights]` | jobDetails.propertyRightsAppraised | Existing |
| `[intendeduses]` | job.intendedUse | Existing |
| `[valuetimeframe]` | jobDetails.valuationPremises | NEW mapping — field exists |
| `[valuescenarios]` | TBD — hardcode or new field | NEW |
| `[reportformat]` | jobDetails.reportType | Existing |
| `[fee]` | jobDetails.appraisalFee (formatted) | Existing |
| `[approachestovalue]` | VALTA custom field 12052 | NEW mapping — field exists on dashboard |
| `[deliverytime]` | jobDetails.deliveryTime | NEW — needs dashboard field or default |
| `[clientdocuments]` | jobDetails.clientDocuments | NEW — needs dashboard field or default |

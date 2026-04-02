# LOE Template V03 vs V02 — Change Summary

**Source:** `LOE Template V03.docx` (Chris's latest, received 2026-04-02)
**Compared against:** `LOE-Template-Extracted.md` (V02, received 2026-04-01)
**Prepared by:** co-architect

---

## Major Structural Changes

V03 is a **significant rewrite**, not a minor edit. Chris reorganized and expanded the document substantially.

### NEW Sections in V03 (not in V02)

| Section | What It Is |
|---------|-----------|
| **PROPERTY DESCRIPTION** | Current Use [CurrentUse] + Proposed Use [ProposedUse] — 2 new fields |
| **EFFECTIVE DATE & REPORT DATE** | Effective Date + Date of Report (was just "Effective Date" in V02) |
| **ASSIGNMENT TYPE** | [AssignmentType] — new field alongside Report Type |
| **EXTRAORDINARY ASSUMPTIONS & HYPOTHETICAL CONDITIONS** | 5 bullet points of standard assumptions (completion, occupancy, subdivision, permits) |
| **INSPECTION REQUIREMENTS** | 4 bullet points — property access, designated contact, photo consent, hazard disclosure |
| **PRIOR SERVICES & CONFLICT OF INTEREST** | CUSPAP disclosure — no prior valuation, no prior client work, 3-month exclusivity |
| **APPENDIX A — ASSUMPTIONS & LIMITING CONDITIONS** | Massive expansion — A1 General (8 paragraphs), A2 Limiting (21 paragraphs), A3 Extraordinary (3 paragraphs) |

### RENAMED Sections

| V02 Name | V03 Name |
|----------|----------|
| Assignment Details (table) | ASSIGNMENT IDENTIFICATION |
| Fee (section) | PROFESSIONAL FEES & TERMS |
| Scope of Work (section) | SCOPE OF WORK (expanded with detailed description) |
| Property Data Request | PROPERTY INFORMATION REQUEST |
| Terms & Conditions | TERMS OF ENGAGEMENT (numbered 14.1-14.10, much shorter) |

### REMOVED from V03

| What | Notes |
|------|-------|
| "Authorized Users" row with boilerplate | Replaced with cleaner AUTHORIZED CLIENT, USERS & USE section |
| Old T&C (31 clauses) | Replaced with 10 numbered Terms of Engagement + full Appendix A |

---

## New Placeholder Fields

| Bracket | What It Is | Status |
|---------|-----------|--------|
| `[CurrentUse]` | Current use of property | NEW — not on dashboard |
| `[ProposedUse]` | Proposed use if applicable | NEW — not on dashboard |
| `[AssignmentType]` | Assignment type (Standard, Desktop, etc.) | NEW — already a VALTA field (12049) |
| `[PropertyInformationRequest]` | Document checklist (was [ClientDocuments]) | RENAMED from V02 |
| `[PropertyName]` | Property name | RENAMED from [JobName] in V02 |
| `[PropertyAddress]` | Property address | RENAMED from [addressstreet] |

### Unchanged Brackets (same as V02)

[Today's Date], [ClientFirstName], [ClientLastName], [ClientCompanyName], [ClientOrganizationAddress], [ClientPhone], [ClientEmail], [PropertyType], [InterestAppraised], [AuthorizedUse], [Valuetimeframe], [ValueScenarios], [ReportType], [Fee], [DeliveryTime], [ApproachestoValue]

---

## Text Changes

### Subject Line
- **V02:** `Re: Letter of Engagement ("LOE" or "Agreement") for Appraisal and Valuation Services for the Subject Property Identified as: [name], [addressstreet]`
- **V03:** `RE: Letter of Engagement for Appraisal & Valuation Services [JobName]`
- Shorter, cleaner. No property address in subject.

### Introduction
- **V02:** Short one-liner about engagement date + Authorized Client
- **V03:** Longer paragraph mentioning Scope of Work, Assumptions, Limiting Conditions, and Terms of Engagement as integral parts

### Authorized Use
- **V02:** Simple one-liner
- **V03:** Adds "No other use is authorized. Any reliance or use for purposes other than those stated is expressly prohibited and considered unreasonable."

### Purpose
- **V02:** `To estimate the [Valuetimeframe] market value of the subject property.`
- **V03:** Same text, unchanged

### Value Scenarios
- **V02:** Just `[ValueScenarios]`
- **V03:** Adds intro: "The Appraisal in accordance with CUSPAP, anticipates developing the following valuation approaches:" then `[ValueScenarios]`

### Scope of Work
- **V02:** Brief CUSPAP reference + [ApproachestoValue]
- **V03:** Long detailed paragraph listing all scope items (inspection, review, municipal info, market research, highest and best use, valuation approaches, reconciliation). Approaches to Value is now a separate section.

### Payment Terms
- **V02:** Fixed prose about invoicing within 5 days
- **V03:** Same concept, slightly reworded: "Invoices are due upon receipt by and shall be deemed delinquent if not paid within five (5) days of the date of invoice."

### Fee
- **V02:** `[Fee]`
- **V03:** `[Fee] + GST` — GST explicitly added

### Terms of Engagement (was Terms & Conditions)
- **V02:** 31 dense legal clauses in one numbered list
- **V03:** 10 clear numbered sections (14.1-14.10): Entire Agreement, Changes to Scope, Expiry, Confidentiality, Reliance, Publication, Liability, Court Testimony, Electronic Transmission, No Modification
- Much cleaner and more readable
- The heavy legal detail moved to Appendix A

### Appendix A (NEW)
- **A1 General Assumptions:** 8 paragraphs covering title, information reliability, zoning, site, improvements, environmental, market conditions, competent management
- **A2 Limiting Conditions:** 21 paragraphs — PIPEDA/CUSPAP compliance, no legal responsibility, no survey, no engineering, inspection limits, confidentiality, lending conditions, no business value, projections disclaimer, draft disclaimer
- **A3 Extraordinary Limiting Conditions:** Placeholder for property-specific conditions

---

## Summary of Effort

| Category | Count |
|----------|-------|
| New placeholder fields | 3 (CurrentUse, ProposedUse, AssignmentType) |
| Renamed placeholders | 2 (PropertyName, PropertyInformationRequest) |
| New sections | 7 |
| Renamed sections | 5 |
| Text rewrites | Multiple — intro, scope, authorized use, value scenarios |
| T&C → Terms of Engagement | Complete restructure (31 clauses → 10 sections + Appendix) |

This is a bigger change than V02. The template structure itself changed, not just field additions.

---

## Questions for Ben

### Q1: Do we build V05 (from V03) or wait?
We just deployed V04 (from Chris's V02). V03 is a significant restructure. Options:
- **Build now:** Create v5Template.ts from V03, keep V04 as option in picker
- **Wait:** Test V04 thoroughly first, then do V05 as next sprint
- **Ask Chris:** Is V03 final or still iterating?

### Q2: New fields — add to dashboard?
- [CurrentUse] and [ProposedUse] are new. Do we add dashboard fields or hardcode defaults?
- [AssignmentType] is already VALTA field 12049 on the dashboard — just needs mapping

### Q3: Fee + GST
V03 says `[Fee] + GST`. Do we calculate GST (5% in Alberta) or leave it as text "plus GST"?

### Q4: Appendix A
32 paragraphs of legal text. This replaces the old 31-clause T&C. Same templateParser pattern (ol/li) or does it need a different structure (h2/h3 headers for A1/A2/A3)?

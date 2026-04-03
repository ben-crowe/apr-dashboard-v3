# Dropdown Options Reference

> Single reference for ALL dropdown fields across the APR system.
> Source noted for each: VALTA = Chris's Master Field Registry, Valcre = Valcre API enums, ClickUp = Chris's ClickUp board.

---

## Property Type

**Appears:** Form, Dashboard
**Valcre mapping:** PropertyType (always "Building" for multi) + Types field (PascalCase)

| Option | Valcre PropertyType | Valcre Types | Source |
|--------|-------------------|-------------|--------|
| Agriculture | Agriculture | Agriculture | Valcre |
| Building | Building | — | Valcre |
| Healthcare | Building | HealthCare | Valcre |
| Hospitality | Hospitality | Hospitality | Valcre |
| Industrial | Industrial | Industrial | Valcre |
| Land | Land | Land | Valcre |
| Manufactured Housing | Building | ManufacturedHousing | Valcre |
| Multi-Family | Building | MultiFamily | VALTA |
| Office | Office | Office | Valcre |
| Retail | Retail | Retail | Valcre |
| Self-Storage | Building | SelfStorage | Valcre |
| Single-Family | Building | SingleFamily | Valcre |
| Special Purpose | Building | SpecialPurpose | Valcre |
| Mixed Use | Building | — | Dashboard |
| Commercial | Building | — | Dashboard |
| Residential | Building | — | Dashboard |

---

## Authorized Use / Intended Use

**Appears:** Form, Dashboard
**Valcre mapping:** IntendedUses field

| Option | Valcre Value | Source |
|--------|-------------|--------|
| First Mortgage Financing | Financing | VALTA |
| Financial Reporting | FinancialReporting | VALTA |
| Insurance | Financing | VALTA |
| Internal Decision-Making | DecisionMakingInternal | VALTA |
| Acquisition-Disposition | AcquisitionDisposition | VALTA |
| Estate Planning | EstatePlanning | VALTA |
| Litigation | Litigation | VALTA |
| GST | Other | VALTA |

---

## Valuation Premises

**Appears:** Form, Dashboard
**Valcre mapping:** RequestedValues field

| Option | Valcre Value | Source |
|--------|-------------|--------|
| Market Value | AsIs | Dashboard |
| As-Is | AsIs | Valcre |
| Market Rent | MarketRentStudy | Valcre |
| Liquidation Value | Liquidation | Valcre |
| Investment Value | ProspectiveAtStabilization | Valcre |
| Insurable Value | InsurableReplacementCost | Valcre |
| Prospective at Completion | ProspectiveAtCompletion | Valcre |
| Prospective at Stabilization | ProspectiveAtStabilization | Valcre |
| As-Vacant | AsVacant | Valcre |
| Bulk Value | BulkValue | Valcre |
| Disposition | Disposition | Valcre |
| Go Dark | GoDark | Valcre |
| Hypothetical | Hypothetical | Valcre |
| In Use | InUse | Valcre |
| Retrospective | Retrospective | Valcre |

---

## Asset Condition

**Appears:** Form, Dashboard
**Valcre mapping:** Not sent to Valcre (dashboard-only)

| Option | Source |
|--------|--------|
| Excellent | Dashboard |
| Very Good | Dashboard |
| Good | Dashboard |
| Average | Dashboard |
| Fair | Dashboard |
| Poor | Dashboard |

---

## Scope of Work

**Appears:** Dashboard (LOE section)
**Valcre mapping:** Scopes field

| Option | Valcre Value | Source |
|--------|-------------|--------|
| All Applicable | AllApplicable | Valcre |
| Best One Approach | BestOneApproach | Valcre |
| Best Two Approaches | BestTwoApproaches | Valcre |
| Cost Approach | CostApproach | Valcre |
| Direct Comparison Approach | DirectComparisonApproach | Valcre |
| Discounted Cash Flow | DiscountedCashFlow | Valcre |
| Feasibility Study | FeasibilityStudy | Valcre |
| Income Approach | IncomeApproach | Valcre |
| Land Value | LandValue | Valcre |
| Litigation | Litigation | Valcre |
| Market Research | MarketResearch | Valcre |
| Market Study | MarketStudy | Valcre |
| Net Rent Review | NetRentReview | Valcre |
| Update | Update | Valcre |

---

## Property Rights Appraised

**Appears:** Dashboard (LOE section)
**Valcre mapping:** Purposes field

| Option | Valcre Value | Source |
|--------|-------------|--------|
| Fee Simple Interest | FeeSimple | Valcre |
| Leased Fee Interest | LeasedFee | Valcre |
| Leasehold Interest | Leasehold | Valcre |
| Undivided Interest | UndividedInterest | Valcre |
| Partial Interest | PartialInterest | Valcre |
| Partial Interest Taking | PartialInterestTaking | Valcre |
| Total Taking | TotalTaking | Valcre |
| Rent Restricted | RentRestricted | Valcre |
| Market Study | MarketStudy | Valcre |
| Going Concern | GoingConcern | Valcre |
| Condominium Ownership | CondominiumOwnership | Valcre |
| Cost Segregation Study | CostSegregationStudy | Valcre |
| ASC 805 | ASC805 | Valcre |
| Other | Other | Valcre |
| None | None | Valcre |

---

## Report Type

**Appears:** Dashboard (LOE section)
**Valcre mapping:** ReportFormat field

| Option | Valcre Value | Source |
|--------|-------------|--------|
| Appraisal Report | Appraisal | Valcre |
| Restricted Appraisal Report | RestrictedAppraisal | Valcre |
| Amendment Letter | AmendmentLetter | Valcre |
| Broker Opinion of Value | BrokerOpinionOfValue | Valcre |
| Completion Report | CompletionReport | Valcre |
| Consultation | Consultation | Valcre |
| Desk Review | DeskReview | Valcre |
| Evaluation | Evaluation | Valcre |
| Peer Review | PeerReview | Valcre |
| Rent Study | RentStudy | Valcre |
| Form | Form | Valcre |

---

## Payment Terms

**Appears:** Dashboard (LOE section)
**Valcre mapping:** Not sent (dashboard/ClickUp only)

| Option | Source |
|--------|--------|
| Net 30 | ClickUp (Chris) |
| Net 60 | ClickUp (Chris) |
| Upon Completion | ClickUp (Chris) |
| 50% Upfront | ClickUp (Chris) |
| On LOE Signature | ClickUp (Chris) |

---

## 13 VALTA Custom Fields (Valcre Custom Fields API)

### Tenancy (ID: 12042, SingleOption)

| Option | Source |
|--------|--------|
| Multi-Tenant | VALTA |
| Single-Tenant | VALTA |
| Owner-Occupied | VALTA |
| Partial Owner Occupied | VALTA |
| Vacant | VALTA |
| Unknown | VALTA |

### State of Improvements (ID: 12043, SingleOption)

| Option | Source |
|--------|--------|
| Proposed | VALTA |
| Under Construction | VALTA |
| Complete | VALTA |

### Status of Improvements (ID: 12044, SingleOption)

| Option | Source |
|--------|--------|
| As Is | VALTA |
| As Complete | VALTA |
| As Stabilized | VALTA |
| As Proposed | VALTA |

### Property Subtype (ID: 12045, SingleOption)

| Option | Source |
|--------|--------|
| Low-Rise | VALTA |
| Mid-Rise | VALTA |
| High-Rise | VALTA |
| Garden | VALTA |
| Walk-Up | VALTA |
| Townhouse | VALTA |
| Mixed-Use | VALTA |

### Land Metric (ID: 12046, SingleOption)

| Option | Source |
|--------|--------|
| Square Feet | VALTA |
| Acres | VALTA |
| Hectares | VALTA |

### Environmental Assessment (ID: 12047, String)

> Free text field. No dropdown options.

### Heritage / Conservation (ID: 12048, String)

> Free text field. No dropdown options.

### Assignment Type (ID: 12049, SingleOption)

| Option | Source |
|--------|--------|
| Standard | VALTA |
| Update | VALTA |
| Retrospective | VALTA |
| Desktop | VALTA |

### Desktop Report (ID: 12050, Boolean)

| Option | Source |
|--------|--------|
| Yes (true) | VALTA |
| No (false) | VALTA |

### Value Timeframe (ID: 12051, SingleOption)

| Option | Source |
|--------|--------|
| Current | VALTA |
| Retrospective | VALTA |
| Prospective | VALTA |

### Approaches to Value (ID: 12052, MultiOption)

| Option | Source |
|--------|--------|
| All Applicable | VALTA |
| Cost Approach | VALTA |
| Direct Comparison | VALTA |
| Income Approach | VALTA |
| Cost + Direct Comparison | VALTA |
| Cost + Income | VALTA |
| Direct Comparison + Income | VALTA |

### Transaction Status (ID: 12053, SingleOption)

| Option | Source |
|--------|--------|
| Arms Length | VALTA |
| Non-Arms Length | VALTA |
| Listing | VALTA |
| Under Contract | VALTA |
| REO/Bank Sale | VALTA |

### Zoning Status (ID: 12054, SingleOption)

| Option | Source |
|--------|--------|
| Legal Conforming | VALTA |
| Legal Non-Conforming | VALTA |
| Illegal | VALTA |
| No Zoning | VALTA |

---

*Total dropdown fields: 21. Total unique options: ~150. Sources: VALTA (Chris spec) = 46 options across 13 fields. Valcre API enums = ~90 options across 6 conversion maps. ClickUp/Dashboard = ~14 options across 2 fields.*

# Stitch Design Prompt — Cascading Field Picker

## What This Is

An interactive demo page for a commercial real estate appraisal system. It shows how picking one dropdown field automatically sets other fields based on business rules. The purpose is to show a client (Chris) that we understood his complex spreadsheet logic and can turn it into a working interactive tool.

Two views: a full dashboard form (all fields), and a focused "Logic Fields Only" view showing just the cascade fields.

---

## Design Direction

**Technical inspector aesthetic.** Think: Chrome DevTools property panel meets a well-designed admin tool. Not a marketing page. Not bubbly. Precise, information-dense, quietly confident.

**Key qualities:**
- Monospace or semi-mono for data values and the Rule Explorer tables
- System sans-serif (Inter, SF Pro, system-ui) for labels and headers
- Dark background (#161616 or #1a1a1a) with subtle surface elevation (#1f1f1f cards)
- Thin borders, minimal shadows, tight spacing
- Color used sparingly — only to indicate cascade relationships (a single accent, maybe blue-gray or teal)
- Fields that are "auto-set" by the system should look visually distinct from fields the user picks manually — different background tint, or a subtle glow, or a small indicator

**References for feel:**
- VS Code settings panel
- Linear.app's property sidebar
- Vercel dashboard forms
- Supabase table editor
- The "inspector" panel in any dev tool

---

## Page Structure

### Header
- Title: "Field Registry"
- Subtitle: "Cascading rules demo — Pick dropdowns to see auto-fill"
- Three buttons: "Fill Test Data" (fills text inputs with mock data), "Reset", "Save"
- View toggle: two buttons — "Full Dashboard" | "Logic Fields Only"

### View 1: Full Dashboard
Standard form layout — label on the left, input on the right. Organized into section cards:

**Section 1: Client Information**
Fields: First Name, Last Name, Title, Organization, Phone, Email, Address
(All text inputs — no cascade logic)

**Section 2: Property Information**
Fields: Property Name, Property Type [dropdown, TRIGGER A], Address, Authorized Use [dropdown, TRIGGER E], Valuation Premises [dropdown], Asset Condition [dropdown]

**Section 3: Property Contact**
Fields: First Name, Last Name, Email, Phone

**Section 4: LOE Quote & Job Information**
Fields: Job Number [readonly], Job Status [dropdown], Property Rights [dropdown, AUTO-SET], Scope of Work [dropdown], Payment Terms [dropdown], Appraisal Fee, Report Type [dropdown], Retainer Amount, Delivery Date, Paid Date, Request Date, Signed Date, Due Date, Amount Paid, CMHC Financing [dropdown]

**Section 5: Building Information**
Fields: Year Built, Building Size (SF), Number of Units, Parking Spaces, Tenancy [dropdown, TRIGGER C], State of Improvements [dropdown], Status of Improvements [dropdown, TRIGGER D], Value Scenarios [dropdown, AUTO-SET], Property Subtype [dropdown, TRIGGER B], Land Metric [dropdown], Env. Assessment

**Section 6: Appraisal Assignment**
Fields: Assignment Type [dropdown], Desktop Report [dropdown], Value Timeframe [dropdown], Approaches to Value [dropdown, AUTO-SET], Transaction Status [dropdown], Zoning Status [dropdown]

**Section 7: Property Site & Parcels**
Fields: Zoning, Zone Code, Land Use, Flood Zone, Gross Building Area, Net Rentable Area, Total Site Area, Assessed Value, Taxes

**Section 8: Document Uploads**
8 upload slots: Land Title, Survey/RPR, Tax Notice, Aerial Photo, Zoning Map, Flood Map, Building Permits, Site Plan

### View 2: Logic Fields Only
A single card showing ONLY the 8 fields involved in cascade logic, arranged in a 4-column grid:

```
TRIGGER LABEL    TRIGGER DROPDOWN    RESULT LABEL       RESULT DROPDOWN
─────────────    ────────────────    ────────────       ───────────────
Property Type:   [Multifamily ▾]    Property Rights:   [Fee Simple ▾]
Prop. Subtype:   [Choose... ▾]
Tenancy:         [Choose... ▾]

Status of Imp.:  [Choose... ▾]      Value Scenarios:   [Auto ▾]
Authorized Use:  [Choose... ▾]      Approaches:        [Auto ▾]
```

Left columns = user picks. Right columns = system auto-fills.
When user picks a trigger, the result dropdown immediately shows the computed value.

### Rule Explorer (bottom of page, always visible)
Two groups showing the complete rule mappings in table format.

**Group 1: Property Rights**

```
A  Property Type        ──┐
B  Property Subtype     ──┼──→  Property Rights
C  Tenancy              ──┘
```

| | Property Rights |
|---|---|
| **A  Property Type** | |
| Multifamily, Self-Storage, Land, Hotel, Seniors | Fee Simple |
| Retail, Industrial, Office | Leased Fee Interest |
| **B  Property Subtype (override)** | |
| Mixed Use | Fee Simple & Leased Fee |
| **C  Tenancy (override)** | |
| Owner Occupied | Fee Simple |
| Multi-Tenant | Leased Fee Interest |
| Partial Owner Occupied | Leasehold Estate |
| Single-Tenant | Going Concern |

*Last picked wins. C overrides B overrides A.*

**Group 2: Valuation Chain**

```
D  Status of Improvements  ──┐
                              ├──→  Value Scenarios  ──→  Approaches to Value
E  Authorized Use          ──┘
```

| | Value Scenarios | Approaches |
|---|---|---|
| **D  Status of Improvements** | | |
| Existing - Completed | As Stabilized | Direct Comparison + Income |
| Existing - Under Renovation | As-Is + As If Complete | Direct Comparison + Income + Cost |
| Existing - To Be Renovated | As-Is + As If Complete | Direct Comparison + Income + Cost |
| Proposed - Vacant Land | As Is Vacant Land + As If Complete | Land Direct Comparison + Cost |
| Proposed - Improved Land | As If Vacant Land + As If Complete | Land Direct Comparison + Cost |
| Proposed - Under Construction | As If Vacant Land + As If Complete | Land Direct Comparison + Cost |
| **E  Authorized Use (override)** | | |
| Insurance | Insurable Replacement Cost | Cost Approach |

*Pick Status -> Value Scenarios auto-sets -> Approaches auto-sets. Three fields from one pick.*

---

## Cascade Logic (JavaScript behavior)

### Rule Set 1: Property Type + Subtype + Tenancy -> Property Rights

Priority order (last wins):
1. Property Type sets the base value
2. Property Subtype overrides if it has a rule
3. Tenancy overrides if it has a rule

```
INTEREST_BY_PROPERTY = {
  Multifamily: Fee Simple,
  Self-Storage: Fee Simple,
  Retail: Leased Fee Interest,
  Industrial: Leased Fee Interest,
  Office: Leased Fee Interest,
  Land: Fee Simple,
  Hotel: Fee Simple,
  Seniors: Fee Simple
}

INTEREST_BY_SUBTYPE = {
  Mixed Use: Fee Simple & Leased Fee
}

INTEREST_BY_TENANCY = {
  Multi-Tenant: Leased Fee Interest,
  Owner Occupied: Fee Simple,
  Partial Owner Occupied: Leasehold Estate,
  Single-Tenant: Going Concern
}
```

### Rule Set 2: Status of Improvements -> Value Scenarios

```
SCENARIOS_BY_STATUS = {
  Existing - Completed: [As Stabilized],
  Existing - Renovated: [As Stabilized],
  Existing - Under Renovation: [As-Is, As If Complete & Stabilized],
  Existing - To Be Renovated: [As-Is, As If Complete & Stabilized],
  Proposed - Vacant Land: [As Is Vacant Land, As If Complete & Stabilized],
  Proposed - Improved Land (Demolition Required): [As If Vacant Land, As If Complete & Stabilized],
  Proposed - Under Construction: [As If Vacant Land, As If Complete & Stabilized]
}
```

Override: Authorized Use = Insurance -> Value Scenarios = Insurable Replacement Cost

### Rule Set 3: Value Scenarios -> Approaches to Value

```
APPROACHES_BY_SCENARIO = {
  As Stabilized: [Direct Comparison Approach, Income Approach],
  As-Is: [Direct Comparison Approach, Income Approach],
  As Is Vacant Land: [Land Direct Comparison Approach],
  As If Vacant Land: [Land Direct Comparison Approach],
  As If Complete & Stabilized: [Cost Approach],
  Insurable Replacement Cost: [Cost Approach]
}
```

Multiple scenarios produce a union of approaches (deduplicated).

---

## Dropdown Options (Chris's exact registry)

**Property Type (9):** Multifamily, Self-Storage, Retail, Industrial, Office, Land, Hotel, Seniors, Other

**Property Subtype (3):** Apartment, Townhouse, Mixed Use

**Tenancy (6):** Multi-Tenant, Owner Occupied, Partial Owner Occupied, Single-Tenant, Unknown, Vacant

**Property Rights (4):** Fee Simple, Leased Fee Interest, Leasehold Estate, Going Concern

**Authorized Use (8):** First Mortgage Financing, Financial Reporting, Insurance, Internal Decision-Making, Acquisition-Disposition, Estate Planning, Litigation, GST

**Status of Improvements (7):** Existing - Completed, Existing - Renovated, Existing - Under Renovation, Existing - To Be Renovated, Proposed - Vacant Land, Proposed - Improved Land (Demolition Required), Proposed - Under Construction

**Value Scenarios (10):** As Is Vacant Land, As If Vacant Land, As If Complete & Stabilized, As-Is, As Stabilized, As If Complete & Stabilized - Renovated, As If Complete - Rezoned, As If Complete - Serviced, As If Complete - Subdivided, Insurable Replacement Cost

**Approaches to Value (4):** Land Direct Comparison Approach, Cost Approach, Direct Comparison Approach, Income Approach

---

## On Page Load

Pre-select Property Type = Multifamily and fire the cascade so Property Rights shows "Fee Simple" immediately. The user sees the cascade already working before they touch anything.

---

## Key UX Details

- Auto-set dropdowns show "Auto" as placeholder text (same color/style as "Choose..." on manual dropdowns)
- When cascade fires, the auto-set dropdown shows the computed value normally — no special tags or bubbles, just the selected text
- Trigger fields in the Logic view have small gray reference numbers (1-5) next to their labels
- The Rule Explorer monospace diagrams (the prong/fork ASCII art) serve as visual headers for each rule group
- Section title rows in the Rule Explorer tables are bold; data rows are normal weight
- The entire page is a single HTML file with inline CSS and JS — no build step, no dependencies

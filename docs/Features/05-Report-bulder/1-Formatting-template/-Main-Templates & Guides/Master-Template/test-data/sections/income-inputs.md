# Income Section Input Fields

These are the USER INPUT fields for the Report Builder Income Section.

**Loads via:** "Load Test Data" button in Income section of EditPanel
**Rule:** User enters these. Template displays them in the Income Approach pages.

---

## Unit Mix (Revenue)

Unit type breakdown with rents.

- **Type 1 Name:** `calc-type1-name`  |  1 Bed / 1 Bath  |  Unit type 1 description
- **Type 1 Count:** `calc-type1-count`  |  4  |  Number of type 1 units
- **Type 1 SF:** `calc-type1-sf`  |  550  |  Average SF per unit
- **Type 1 Rent:** `calc-type1-rent`  |  900  |  Monthly rent per unit
- **Type 1 Contract Rent:** `calc-type1-contract-rent`  |  900  |  Current contract rent
- **Type 2 Name:** `calc-type2-name`  |  2 Bed / 1 Bath  |  Unit type 2 description
- **Type 2 Count:** `calc-type2-count`  |  12  |  Number of type 2 units
- **Type 2 SF:** `calc-type2-sf`  |  667  |  Average SF per unit
- **Type 2 Rent:** `calc-type2-rent`  |  1060  |  Monthly rent per unit
- **Type 2 Contract Rent:** `calc-type2-contract-rent`  |  1060  |  Current contract rent

---

## Revenue Summary

Total revenue and income calculations.

- **Total Units:** `calc-total-units`  |  16  |  Total residential units
- **Total Rental Revenue:** `calc-total-rental-revenue`  |  204240  |  Annual rental revenue
- **PGI:** `calc-pgi`  |  204240  |  Potential gross income
- **PGI Per Unit:** `calc-pgi-perunit`  |  12765  |  PGI per unit
- **PGI PSF:** `calc-pgi-psf`  |  20.02  |  PGI per square foot
- **PGR:** `calc-pgr`  |  204240  |  Potential gross revenue
- **Other Income:** `calc-other-income`  |  0  |  Other income sources

---

## Vacancy & Loss

Vacancy and collection loss rates.

- **Vacancy Rate:** `calc-vacancy-rate`  |  4  |  Vacancy rate (%)
- **Bad Debt Rate:** `calc-bad-debt-rate`  |  0  |  Bad debt rate (%)
- **Concessions Rate:** `calc-concessions-rate`  |  0  |  Concessions rate (%)

---

## Effective Revenue

Net revenue after vacancy/loss.

- **EGR:** `calc-egr`  |  196406.4  |  Effective gross revenue
- **EGR Per Unit:** `calc-egr-perunit`  |  12275.4  |  EGR per unit
- **EGR PSF:** `calc-egr-psf`  |  19.25  |  EGR per square foot
- **EGR Comment:** `egr-comment`  |  The total effective gross revenue for the subject is $196,406...  |  EGR narrative

---

## Operating Expenses

Individual expense line items (user input is per-unit amounts).

- **Taxes Per Unit:** `calc-exp-taxes`  |  1168  |  Real estate taxes
- **Taxes Annual:** `calc-exp-taxes-annual`  |  14016  |  Total annual taxes
- **Insurance Per Unit:** `calc-exp-insurance`  |  710  |  Insurance per unit
- **Insurance Annual:** `calc-exp-insurance-annual`  |  8520  |  Total annual insurance
- **Repairs Per Unit:** `calc-exp-repairs`  |  830  |  Repairs & maintenance
- **Repairs Annual:** `calc-exp-repairs-annual`  |  9960  |  Total annual repairs
- **Utilities Per Unit:** `calc-exp-utilities`  |  1315  |  Utilities per unit
- **Utilities Annual:** `calc-exp-utilities-annual`  |  15780  |  Total annual utilities
- **Payroll Per Unit:** `calc-exp-payroll`  |  500  |  Payroll per unit
- **Payroll Annual:** `calc-exp-payroll-annual`  |  6000  |  Total annual payroll
- **Management Rate:** `calc-exp-management`  |  4.25  |  Management fee (% of EGR)
- **Management Annual:** `calc-exp-management-annual`  |  8347  |  Total annual management
- **Admin Per Unit:** `calc-exp-admin`  |  0  |  Administrative per unit
- **Reserves Per Unit:** `calc-exp-reserves`  |  0  |  Reserves per unit
- **Other Per Unit:** `calc-exp-other`  |  245  |  Other expenses per unit
- **Other Annual:** `calc-exp-other-annual`  |  2940  |  Total annual other

---

## Expense Summary

Total expense calculations.

- **Total Expenses:** `calc-total-expenses`  |  65563  |  Total operating expenses
- **Expense Ratio:** `expense-ratio`  |  0.43  |  Operating expense ratio (OER)

---

## Net Operating Income

NOI calculations.

- **NOI:** `calc-noi`  |  111771.128  |  Net operating income
- **NOI Per Unit:** `calc-noi-perunit`  |  6985.70  |  NOI per unit
- **NOI PSF:** `calc-noi-psf`  |  10.95  |  NOI per square foot

---

## Capitalization

Cap rate and value calculations.

- **Cap Rate:** `calc-cap-rate`  |  6.25  |  Capitalization rate (%)
- **Direct Cap Value 1:** `dircap-value1`  |  1800000  |  Primary value conclusion
- **Direct Cap Value Per Unit:** `dircap-value1-perunit`  |  $112,500/Unit  |  Value per unit
- **Direct Cap Value PSF:** `dircap-value1-psf`  |  176.40  |  Value per SF

---

## Historical Operating Data

Prior year operating history (YTD totals).

- **Hist PGR Total:** `hist-pgr-total`  |  180000  |  Historical potential gross revenue
- **Hist EGR Total:** `hist-egr-total`  |  172800  |  Historical effective gross revenue
- **Hist Vacancy Total:** `hist-vacancy-total`  |  7200  |  Historical vacancy loss
- **Hist Revenue Multifamily:** `hist-revenue-multifamily-total`  |  170400  |  Historical unit revenue
- **Hist Revenue Parking:** `hist-revenue-parking-total`  |  4800  |  Historical parking revenue
- **Hist Revenue Laundry:** `hist-revenue-laundry-total`  |  2400  |  Historical laundry revenue
- **Hist Revenue Misc:** `hist-revenue-misc-total`  |  2400  |  Historical misc revenue
- **Hist Exp Taxes:** `hist-exp-taxes-total`  |  15500  |  Historical taxes
- **Hist Exp Insurance:** `hist-exp-insurance-total`  |  9500  |  Historical insurance
- **Hist Exp Repairs:** `hist-exp-repairs-total`  |  11000  |  Historical repairs
- **Hist Exp Utilities:** `hist-exp-utilities-total`  |  17500  |  Historical utilities
- **Hist Exp Payroll:** `hist-exp-payroll-total`  |  6500  |  Historical payroll
- **Hist Exp Management:** `hist-exp-management-total`  |  7300  |  Historical management
- **Hist Exp Other:** `hist-exp-other-total`  |  3200  |  Historical other
- **Hist Exp Total:** `hist-exp-total-total`  |  70500  |  Historical total expenses
- **Hist NOI Total:** `hist-noi-total`  |  102300  |  Historical NOI

---

## Direct Capitalization Details

Detailed direct cap worksheet fields.

- **DirCap Rent Per Unit:** `dircap-rent-perunit`  |  12240  |  Stabilized rent per unit
- **DirCap Rent Total:** `dircap-rent-total`  |  195840  |  Total stabilized rent
- **DirCap Rent PSF/Mo:** `dircap-rent-psfmo`  |  1.60  |  Rent per SF per month
- **DirCap Rent PSF/Yr:** `dircap-rent-psfyr`  |  19.19  |  Rent per SF per year
- **DirCap Misc Per Unit:** `dircap-misc-perunit`  |  525  |  Misc income per unit
- **DirCap Misc Total:** `dircap-misc-total`  |  8400  |  Total misc income
- **DirCap Vacancy Pct:** `dircap-vacancy-pct`  |  -0.04  |  Vacancy rate (decimal)
- **DirCap Vacancy Total:** `dircap-vacancy-total`  |  -7833.6  |  Vacancy loss amount
- **DirCap Loss Pct:** `dircap-loss-pct`  |  3.8%  |  Total loss percentage
- **DirCap Expenses Total:** `dircap-expenses-total`  |  -84635.27  |  Total expenses
- **DirCap Expense Ratio:** `dircap-expense-ratio`  |  -0.43  |  Expense ratio
- **DirCap Cap Rate 1:** `dircap-cap-rate1`  |  0.0625  |  Primary cap rate
- **DirCap Cap Rate 2:** `dircap-cap-rate2`  |  0.06  |  Secondary cap rate

---

## Field Mapping: Source to Income

Maps source fields from `northBattlefordTestData.ts` to income field IDs.

**Unit Mix Fields:**
- `calc-type{N}-*` → Unit type details
- `calc-total-units` → Total unit count

**Revenue Fields:**
- `calc-pgi`, `calc-pgr`, `calc-egr` → Revenue totals
- `calc-*-perunit`, `calc-*-psf` → Per-unit/SF metrics

**Expense Fields:**
- `calc-exp-*` → Per-unit expense amounts
- `calc-exp-*-annual` → Annual expense totals
- `calc-total-expenses`, `expense-ratio` → Expense summary

**NOI Fields:**
- `calc-noi`, `calc-noi-perunit`, `calc-noi-psf` → NOI metrics

**Cap Rate Fields:**
- `calc-cap-rate` → Capitalization rate
- `dircap-*` → Direct cap worksheet values

**Historical Fields:**
- `hist-*-total` → Historical operating data

---

## Total Fields: 62

- Unit Mix: 10
- Revenue Summary: 7
- Vacancy & Loss: 3
- Effective Revenue: 4
- Operating Expenses: 16
- Expense Summary: 2
- Net Operating Income: 3
- Capitalization: 4
- Historical Data: 16
- Direct Cap Details: 13

---

## Adding New Income Fields

1. Add field definition to `initializeMockData()` in `reportBuilderStore.ts`
2. Add mapping in `loadIncomeTestData()` function
3. Update this documentation
4. Test with "Load Test Data" button

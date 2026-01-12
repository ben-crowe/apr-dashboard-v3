# Page 46 - Multifamily Investment Indicators Chart

**Status:** 📝 REFERENCE NOTE (Low Priority)
**Date Created:** December 18, 2025

---

## Overview

This is a **market-level research chart**, not property-specific data. Unlike Pages 47 and 60, this chart doesn't pull from the property registry - it shows historical and forecast cap rates across Canadian markets.

**Recommendation:** Keep as static image updated annually, or maintain a simple CSV.

---

## Data Series & Sources

| Series | Source | URL/Notes |
|--------|--------|-----------|
| Canada (National) | CBRE Cap Rate Survey | https://www.cbre.ca/insights/figures/canada-cap-rate-survey |
| Calgary | CBRE Cap Rate Survey | Same as above |
| Edmonton | CBRE Cap Rate Survey | Same as above |
| GGH (Greater Golden Horseshoe) | CBRE Cap Rate Survey | Same as above |
| Ottawa | CBRE Cap Rate Survey | Same as above |
| Toronto | CBRE Cap Rate Survey | Same as above |
| Vancouver | CBRE Cap Rate Survey | Same as above |
| BOC 5-Yr Yield | Bank of Canada | https://www.bankofcanada.ca/rates/interest-rates/canadian-bonds/ |
| Boardwalk REIT | Annual Reports | https://www.boardwalkreit.com/investors/financial-reports |

---

## Alternative Sources

| Provider | Data Available | Access |
|----------|---------------|--------|
| **Colliers** | Cap rate reports | https://www.colliers.com/en-ca/research |
| **CMHC** | Rental market data | https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research |
| **Altus Group** | Investment trends | https://www.altusgroup.com/insights/ |
| **RealNet** | Transaction data | Subscription required |

---

## Implementation Options

**Option A: Static Image (Current)**
- Export chart from Excel/research source
- Embed as PNG in template
- Update annually

**Option B: CSV-Driven (Recommended if automating)**
```csv
year,canada,calgary,edmonton,ggh,ottawa,toronto,vancouver,boc_5yr,boardwalk
2015,2.95,4.98,4.42,5.12,4.75,4.42,2.95,1.78,5.25
2016,2.92,4.35,4.95,4.72,4.65,4.35,2.88,1.92,5.25
...
```
- Maintain one CSV file
- Chart component reads CSV
- One update per year

**Option C: API Integration (Future)**
- Bank of Canada API for bond yields
- CBRE data (if API available)
- Most market data requires manual collection

---

## Quick Update Process

1. Go to CBRE Cap Rate Survey (published quarterly)
2. Download latest multifamily cap rates by market
3. Get BOC 5-year yield from Bank of Canada
4. Check Boardwalk REIT latest annual report for their stated cap rate
5. Update CSV or recreate chart image

---

## Notes

- Forecast data (2025-2030) is speculative - likely from industry outlook reports
- Chart shows cap rate compression during low-rate era (2015-2021) and expansion post-2022
- Useful for supporting cap rate selection narrative in appraisal

---

**Priority:** Low - static image works fine for now
**Revisit:** When automating market research section of reports

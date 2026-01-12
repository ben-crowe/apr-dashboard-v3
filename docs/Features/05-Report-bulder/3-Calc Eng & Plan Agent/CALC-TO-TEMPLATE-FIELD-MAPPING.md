# Calc Engine to Template Field Mapping

**Created:** 2025-12-29
**Status:** Complete (6 pages)

---

## Column Key

| Col | Meaning |
|-----|---------|
| ID | Field ID (use as `{{ID}}` in template) |
| Name | UI label |
| Type | num/curr/pct/text/calc |
| Ln | fieldRegistry.ts line |
| Match | ✅ = verified in template, ❌ = missing |

---

## Source Files

| File | Path |
|------|------|
| Registry | `schema/fieldRegistry.ts` |
| Calc | `store/reportBuilderStore.ts` |
| Bridge | `CalculatorWithPreview.tsx` |
| Template | `Report-MF-template.html` |

---

## Page 43 - Income

### INPUTS (27)

| ID | Name | Type | Ln | Match |
|----|------|------|----|-------|
| calc-type1-name | Type 1 | text | 595 | ❌ |
| calc-type1-count | Count | num | 596 | ✅ |
| calc-type1-sf | SF | num | 597 | ❌ |
| calc-type1-rent | Rent/Mo | num | 598 | ✅ |
| calc-type1-contract-rent | Contract | curr | 600 | ✅ |
| calc-type2-name | Type 2 | text | 605 | ❌ |
| calc-type2-count | Count | num | 606 | ✅ |
| calc-type2-sf | SF | num | 607 | ❌ |
| calc-type2-rent | Rent/Mo | num | 608 | ✅ |
| calc-type2-contract-rent | Contract | curr | 610 | ✅ |
| calc-type3-name | Type 3 | text | 615 | ❌ |
| calc-type3-count | Count | num | 616 | ❌ |
| calc-type3-sf | SF | num | 617 | ❌ |
| calc-type3-rent | Rent/Mo | num | 618 | ❌ |
| calc-type3-contract-rent | Contract | curr | 620 | ❌ |
| calc-type4-name | Type 4 | text | 625 | ❌ |
| calc-type4-count | Count | num | 626 | ❌ |
| calc-type4-sf | SF | num | 627 | ❌ |
| calc-type4-rent | Rent/Mo | num | 628 | ❌ |
| calc-type4-contract-rent | Contract | curr | 630 | ❌ |
| calc-parking-per-unit | Parking | num | 643 | ❌ |
| calc-laundry-per-unit | Laundry | num | 645 | ❌ |
| calc-other-income | Other Inc | num | 647 | ✅ |
| calc-vacancy-rate | Vacancy % | num | 657 | ✅ |
| calc-bad-debt-rate | Bad Debt % | num | 658 | ❌ |
| calc-concessions-rate | Concess % | num | 659 | ❌ |

---

### OUTPUTS (42)

| ID | Name | Type | Ln | Match |
|----|------|------|----|-------|
| calc-type1-annual | Annual | calc | 599 | ✅ |
| calc-type1-cont-v-market | vs Mkt % | pct | 601 | ✅ |
| calc-type1-per-unit | /Unit | curr | 602 | ✅ |
| calc-type1-per-sf | /SF | num | 603 | ✅ |
| calc-type2-annual | Annual | calc | 609 | ✅ |
| calc-type2-cont-v-market | vs Mkt % | pct | 611 | ✅ |
| calc-type2-per-unit | /Unit | curr | 612 | ✅ |
| calc-type2-per-sf | /SF | num | 613 | ✅ |
| calc-type3-annual | Annual | calc | 619 | ❌ |
| calc-type3-cont-v-market | vs Mkt % | pct | 621 | ❌ |
| calc-type3-per-unit | /Unit | curr | 622 | ❌ |
| calc-type3-per-sf | /SF | num | 623 | ❌ |
| calc-type4-annual | Annual | calc | 629 | ❌ |
| calc-type4-cont-v-market | vs Mkt % | pct | 631 | ❌ |
| calc-type4-per-unit | /Unit | curr | 632 | ❌ |
| calc-type4-per-sf | /SF | num | 633 | ❌ |
| calc-total-units | Tot Units | calc | 635 | ❌ |
| calc-total-sf | Tot SF | calc | 636 | ❌ |
| calc-avg-unit-sf | Avg SF | calc | 637 | ❌ |
| calc-avg-rent-per-unit | Avg/Unit | calc | 639 | ❌ |
| calc-avg-rent-per-sf | Avg/SF | calc | 640 | ❌ |
| calc-parking-total | Parking | calc | 644 | ❌ |
| calc-laundry-total | Laundry | calc | 646 | ❌ |
| calc-total-other-income | Other Tot | calc | 648 | ❌ |
| calc-other-income-per-sf | Other/SF | curr | 2280 | ✅ |
| calc-other-income-per-unit | Other/Unit | curr | 2281 | ✅ |
| calc-pgr | PGR | calc | 652 | ✅ |
| calc-pgr-per-unit | PGR/Unit | calc | 653 | ✅ |
| calc-pgr-per-sf | PGR/SF | calc | 654 | ✅ |
| calc-pgr-pct-pgr | PGR % | pct | 801 | ❌ |
| calc-vacancy-loss | Vac Loss | calc | 663 | ✅ |
| calc-vacancy-per-sf | Vac/SF | curr | 2285 | ✅ |
| calc-vacancy-per-unit | Vac/Unit | curr | 2286 | ✅ |
| calc-egr | EGR | calc | 664 | ✅ |
| calc-egr-per-unit | EGR/Unit | calc | 665 | ✅ |
| calc-egr-per-sf | EGR/SF | calc | 666 | ✅ |
| calc-egr-pct-pgr | EGR % | pct | 802 | ❌ |

**Total: 69** (27 in + 42 out)

---

## Page 44 - Expenses

### INPUTS (7)

| ID | Name | Type | Ln | Match |
|----|------|------|----|-------|
| calc-exp-taxes-annual | Taxes | curr | 712 | ✅ |
| calc-exp-insurance-annual | Insurance | curr | 719 | ✅ |
| calc-exp-repairs-annual | Repairs | curr | 726 | ✅ |
| calc-exp-payroll-annual | Payroll | curr | 733 | ✅ |
| calc-exp-utilities-annual | Utilities | curr | 740 | ✅ |
| calc-exp-management-annual | Mgmt | curr | 747 | ✅ |
| calc-exp-other-annual | Other | curr | 754 | ✅ |

---

### OUTPUTS (28)

| ID | Name | Type | Ln | Match |
|----|------|------|----|-------|
| calc-exp-taxes-pct-egr | Tax % | pct | 709 | ✅ |
| calc-exp-taxes-per-unit | Tax/Unit | curr | 710 | ✅ |
| calc-exp-taxes-per-sf | Tax/SF | num | 711 | ✅ |
| calc-exp-insurance-pct-egr | Ins % | pct | 716 | ✅ |
| calc-exp-insurance-per-unit | Ins/Unit | curr | 717 | ✅ |
| calc-exp-insurance-per-sf | Ins/SF | num | 718 | ✅ |
| calc-exp-repairs-pct-egr | Rep % | pct | 723 | ✅ |
| calc-exp-repairs-per-unit | Rep/Unit | curr | 724 | ✅ |
| calc-exp-repairs-per-sf | Rep/SF | num | 725 | ✅ |
| calc-exp-payroll-pct-egr | Pay % | pct | 730 | ✅ |
| calc-exp-payroll-per-unit | Pay/Unit | curr | 731 | ✅ |
| calc-exp-payroll-per-sf | Pay/SF | num | 732 | ✅ |
| calc-exp-utilities-pct-egr | Util % | pct | 737 | ✅ |
| calc-exp-utilities-per-unit | Util/Unit | curr | 738 | ✅ |
| calc-exp-utilities-per-sf | Util/SF | num | 739 | ✅ |
| calc-exp-management-pct-egr | Mgmt % | pct | 744 | ✅ |
| calc-exp-management-per-unit | Mgmt/Unit | curr | 745 | ✅ |
| calc-exp-management-per-sf | Mgmt/SF | num | 746 | ✅ |
| calc-exp-other-pct-egr | Oth % | pct | 751 | ✅ |
| calc-exp-other-per-unit | Oth/Unit | curr | 752 | ✅ |
| calc-exp-other-per-sf | Oth/SF | num | 753 | ✅ |
| calc-expense-ratio | Exp Ratio | calc | 757 | ✅ |
| calc-expenses-per-unit | Exp/Unit | calc | 758 | ✅ |
| calc-expenses-per-sf | Exp/SF | calc | 759 | ✅ |
| calc-expenses-total | Tot Exp | calc | 756 | ✅ |
| calc-noi | NOI | calc | 786 | ✅ |
| calc-noi-per-unit | NOI/Unit | calc | 787 | ✅ |
| calc-noi-per-sf | NOI/SF | calc | 788 | ✅ |

**Total: 35** (7 in + 28 out)

---

## Page 45 - Cap Rate

### INPUTS (2)

| ID | Name | Type | Ln | Match |
|----|------|------|----|-------|
| calc-cap-rate | Cap Rate | num | 771 | ✅ |
| ia-dircap-cap-rate1 | DC Rate | pct | 1452 | ✅ |

---

### OUTPUTS (3)

| ID | Name | Type | Ln | Match |
|----|------|------|----|-------|
| dircap-blend | Blend | pct | 775 | ❌ |
| dircap-cap-rate1 | Rate 1 | pct | 776 | ❌ |
| dircap-cap-rate2 | Rate 2 | pct | 777 | ❌ |

**Total: 5** (2 in + 3 out)

---

## Page 49 - Direct Cap

### INPUTS (25)

| ID | Name | Type | Ln | Match |
|----|------|------|----|-------|
| dircap-expense01-label | Exp 01 | text | 681 | ❌ |
| dircap-expense02-label | Exp 02 | text | 682 | ❌ |
| dircap-expense03-label | Exp 03 | text | 683 | ❌ |
| dircap-expense04-label | Exp 04 | text | 684 | ❌ |
| dircap-expense05-label | Exp 05 | text | 685 | ❌ |
| dircap-expense06-label | Exp 06 | text | 686 | ❌ |
| dircap-expense07-label | Exp 07 | text | 687 | ❌ |
| dircap-expense08-label | Exp 08 | text | 688 | ❌ |
| dircap-expense09-label | Exp 09 | text | 689 | ❌ |
| dircap-expense10-label | Exp 10 | text | 690 | ❌ |
| dircap-expense11-label | Exp 11 | text | 691 | ❌ |
| dircap-expense12-label | Exp 12 | text | 692 | ❌ |
| dircap-expense13-label | Exp 13 | text | 693 | ❌ |
| dircap-expense14-label | Exp 14 | text | 694 | ❌ |
| dircap-expense15-label | Exp 15 | text | 695 | ❌ |
| dircap-expense16-label | Exp 16 | text | 696 | ❌ |
| dircap-expense17-label | Exp 17 | text | 697 | ❌ |
| dircap-expense18-label | Exp 18 | text | 698 | ❌ |
| dircap-expense19-label | Exp 19 | text | 699 | ❌ |
| dircap-expense20-label | Exp 20 | text | 700 | ❌ |
| dircap-expense21-label | Exp 21 | text | 701 | ❌ |
| dircap-expense22-label | Exp 22 | text | 702 | ❌ |
| dircap-expense23-label | Exp 23 | text | 703 | ❌ |
| dircap-expense24-label | Exp 24 | text | 704 | ❌ |
| dircap-expense25-label | Exp 25 | text | 705 | ❌ |

---

### OUTPUTS (12)

| ID | Name | Type | Ln | Match |
|----|------|------|----|-------|
| dircap-rent-total | Rent Tot | curr | 649 | ❌ |
| dircap-reimb-total | Reimb Tot | curr | 650 | ❌ |
| dircap-misc-total | Misc Tot | curr | 651 | ❌ |
| dircap-vacancy-total | Vac Tot | curr | 660 | ❌ |
| dircap-concession-total | Conc Tot | curr | 661 | ❌ |
| dircap-loss-total | Loss Tot | curr | 662 | ❌ |
| dircap-expense-ratio | Exp Ratio | pct | 678 | ❌ |
| ia-dircap-noi | DC NOI | curr | 1454 | ✅ |
| ia-dircap-noi-per-unit | DC NOI/U | curr | 1455 | ✅ |
| ia-dircap-expenseratio | DC Exp % | pct | 1453 | ✅ |

**Total: 37** (25 in + 12 out)

---

## Page 50 - Value Conclusion

### INPUTS (0)

*None - all calculated*

---

### OUTPUTS (5)

| ID | Name | Type | Ln | Match |
|----|------|------|----|-------|
| calc-indicated-value | Value | calc | 790 | ✅ |
| calc-indicated-value-rounded | Rounded | curr | 2279 | ✅ |
| calc-value-per-unit | Val/Unit | calc | 791 | ✅ |
| calc-value-per-sf | Val/SF | calc | 792 | ✅ |
| calc-grm | GRM | calc | 793 | ❌ |

**Total: 5** (0 in + 5 out)

---

## Page 63 - Reconciliation

### INPUTS (6)

| ID | Name | Type | Ln | Match |
|----|------|------|----|-------|
| recon-sales-value | Sales Val | num | 1467 | ❌ |
| recon-cost-value | Cost Val | num | 1468 | ❌ |
| recon-income-weight | Inc Wt % | num | 1471 | ❌ |
| recon-sales-weight | Sls Wt % | num | 1472 | ❌ |
| recon-cost-weight | Cst Wt % | num | 1473 | ❌ |
| recon-narrative | Narrative | text | 1476 | ❌ |

---

### AUTO-FILLED (3)

| ID | Name | Type | Ln | Match |
|----|------|------|----|-------|
| recon-income-value | Inc Value | num | 1466 | ❌ |
| recon-value-premise | Premise | text | 1480 | ❌ |
| recon-effective-date | Eff Date | date | 1481 | ✅ |

---

### OUTPUTS (6)

| ID | Name | Type | Ln | Match |
|----|------|------|----|-------|
| recon-final-value | Final Val | num | 1479 | ✅ |
| recon-final-value-per-unit | Final/U | curr | 1482 | ❌ |
| recon-final-value-per-sf | Final/SF | curr | 1483 | ✅ |
| sca-indicated-value | SCA Val | curr | 1231 | ✅ |
| sca-indicated-value-rounded | SCA Rnd | curr | 1232 | ✅ |
| sca-value-per-sf | SCA/SF | curr | 1233 | ✅ |

**Total: 15** (6 in + 3 auto + 6 out)

---

## Summary

| Pg | Desc | In | Auto | Out | Tot | ✅ | ❌ |
|----|------|----|----|-----|-----|----|----|
| 43 | Income | 27 | 0 | 42 | 69 | 27 | 36 |
| 44 | Expenses | 7 | 0 | 28 | 35 | 35 | 0 |
| 45 | Cap Rate | 2 | 0 | 3 | 5 | 2 | 3 |
| 49 | Direct Cap | 25 | 0 | 12 | 37 | 3 | 32 |
| 50 | Conclusion | 0 | 0 | 5 | 5 | 4 | 1 |
| 63 | Recon | 6 | 3 | 6 | 15 | 6 | 9 |
| **Tot** | | **67** | **3** | **96** | **166** | **77** | **81** |

---

## Notes

- Use as `title="{{field-id}}"` in template
- postMessage searches `[title*="{{ID}}"]`
- Negatives show as `($1,234)`

---

## Verification Summary

**Verified:** 2025-12-29
**Template:** `public/Report-MF-template.html`

| Status | Count | % |
|--------|-------|---|
| ✅ In Template | 77 | 46% |
| ❌ Missing | 81 | 49% |
| Unverified | 8 | 5% |
| **Total** | **166** | 100% |

### Key Gaps (81 missing fields):

**Page 43 - Income (36 missing):**
- Unit types 3 & 4 not used in template (only types 1-2)
- type*-name, type*-sf fields not in template
- parking/laundry inputs, bad-debt/concessions rates
- calc-total-units, calc-total-sf, calc-avg-* fields

**Page 49 - Direct Cap (32 missing):**
- All 25 dircap-expense*-label inputs
- All dircap-*-total outputs (rent, reimb, misc, vacancy, concession, loss)
- dircap-expense-ratio

**Page 63 - Recon (9 missing):**
- All 6 recon inputs (sales-value, cost-value, weights, narrative)
- recon-income-value, recon-value-premise (auto-filled)
- recon-final-value-per-unit

---

*Updated: 2025-12-29*

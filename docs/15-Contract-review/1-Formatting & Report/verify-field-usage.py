#!/usr/bin/env python3
"""
Field Usage Verification Script

Purpose: Verify which of the 273 missing fields are actually used in templates
Usage: python3 verify-field-usage.py

Outputs:
- Field usage statistics
- Page numbers where each field is used
- Unused fields (phantom references)
"""

import re
from collections import defaultdict
from pathlib import Path

# Load missing fields from audit
MISSING_FIELDS = """site-access
site-access-rating
site-area-acres
site-area-sf
site-area-sqft
site-corner
site-exposure
site-exposure-rating
site-grade
site-intro-text
site-quality-rating
site-topography
site-utility-rating
frontage-1-distance
frontage-2-distance
frontage-street
frontage-street-1
frontage-street-2
street-1-lanes
street-1-type
street-2-lanes
street-2-type
traffic-count-1
traffic-count-2
traffic-date
traffic-source
inspection-appraiser-1
inspection-appraiser-2
inspection-date
inspection-date-1
inspection-date-2
inspection-extent
inspection-role-1
inspection-role-2
zoning-change
zoning-district
zoning-district-type
zoning-permitted-uses
access-description
accessibility-note
actual-rent-total
all-units-inspected
alternative-investment-rates-text
analysis-of-comparable-sales-text
appraisal-purpose
appraiser-assistance-provided
appraiser-signatory-name
appraiser-signatory-title
assessed-value
avg-rent-total
avg-unit-sf
building-appeal-rating
building-condition-rating
building-count
building-nra-sf
building-nra-sqft
building-quality-rating
calc-assessed-value
calc-real-estate-taxes
calc-taxes-per-sf
cap-rate-methodology-intro
cap-rate-selection-intro
capitalization-rate
certification-item-1
certification-item-10
certification-item-11
certification-item-2
certification-item-3
certification-item-4
certification-item-5
certification-item-6
certification-item-7
certification-item-8
certification-item-9
client-address-full
client-name
comp1-distance
comp1-full-address
comp2-distance
comp2-full-address
comp3-distance
comp3-full-address
comp4-address
comp4-distance
comp4-full-address
comp5-address
comp5-distance
comp5-full-address
comparable-1b-address
comparable-1b-adjusted-price-per-unit
comparable-1b-analysis-price
comparable-1b-arms-length
comparable-1b-buyer
comparable-1b-cap-rate
comparable-1b-city-prov-postal
comparable-1b-construction-type
comparable-1b-expenses
comparable-1b-financing
comparable-1b-gba
comparable-1b-land-area
comparable-1b-noi
comparable-1b-occupancy
comparable-1b-property-name
comparable-1b-property-type
comparable-1b-recording-number
comparable-1b-remarks
comparable-1b-rent-type
comparable-1b-rights-transferred
comparable-1b-sale-date
comparable-1b-sale-price
comparable-1b-seller
comparable-1b-transaction-status
comparable-1b-units
comparable-1b-year-built
concessions-text
concluded-rent-per-unit
conforming-lot
conforming-use
correlation-conclusion-text
cost-approach-applicability
cost-approach-status
cost-approach-text
cost-approach-use
current-occupancy-percent
current-owner
current-rent-per-unit
dcf-methodology-note
density-units-per-acre
direct-capitalization-intro
direct-capitalization-method
direct-comparison-indicated-value
direct-comparison-psf-nra
direct-comparison-value
dscr-or-noi-per-unit
easements-note
effective-date
effective-gross-revenue-section
effective-year-built
excess-surplus-land
expense-ratio
exposure-period
exposure-time
exposure-time-conclusion
exposure-time-value-table
extraordinary-assumptions-text
extraordinary-limiting-conditions-text
final-extraordinary-assumptions
final-extraordinary-limiting
final-hypothetical-conditions
final-value-conclusion
final-value-psf-nra
frontage-street
geocode
hazardous-waste-note
hbu-improved-use
hbu-proposed-construction
hbu-vacant-use
hypothetical-conditions-text
improvements-description
income-approach-applicability
income-approach-indicated-value
income-approach-noi
income-approach-noi-psf
income-approach-overview
income-approach-psf-nra
income-approach-use
income-approach-value
income-capitalization-text
indicated-value-per-unit
inspection-date
interest-appraised
investment-activity-trends-text
land-valuation-text
location-description
location-map-placeholder
market-name
market-rent-conclusion-intro
market-rent-sf-avg
market-rent-survey-intro
market-rent-unit-avg
marketing-time
multifamily-revenue-analysis-intro
multifamily-sf
municipal-services
net-operating-income-conclusion
nra-sqft
number-of-buildings
number-of-stories
one-bed-actual-rent
one-bed-avg-rent
one-bed-avg-rent-conclusion
one-bed-avg-rent-sf
one-bed-conclusion-sf
one-bed-rent-sf
one-bed-rent-unit
one-bed-unit-size
one-bed-units
operating-expenses-discussion
ownership-history
personal-property-note
photo-1-caption
photo-10-caption
photo-11-caption
photo-12-caption
photo-2-caption
photo-3-caption
photo-4-caption
photo-5-caption
photo-6-caption
photo-7-caption
photo-8-caption
photo-9-caption
property-address
property-address-line1
property-address-line2
property-city
property-province
property-type
public-transit-description
reconciliation-para-1
reconciliation-para-2
reconciliation-para-3
reconciliation-para-4
reconciliation-para-5
reconciliation-para-6
rent-roll-note
report-title
sales-approach-applicability
sales-approach-use
sales-comparison-analysis-para-1
sales-comparison-analysis-para-2
sales-comparison-analysis-para-3
sales-comparison-analysis-para-4
sales-comparison-indicated-value
sales-comparison-psf-nra
sales-comparison-text
section-title
security-features
selection-of-comparables-text
soils-note
sources-data-limitation-note
stabilized-occupancy-percent
story-count
subject-address
subsection-title
survey-presentation-intro
tax-assessment-commentary
tax-assessment-note
tax-rate
tax-year
taxes-per-sf
tenancy-type
two-bed-actual-rent
two-bed-avg-rent
two-bed-avg-rent-conclusion
two-bed-avg-rent-sf
two-bed-conclusion-sf
two-bed-conclusion-total
two-bed-rent-sf
two-bed-rent-unit
two-bed-unit-size
two-bed-units
unit-count
unit-of-comparison-text
unit-rent-discussion
units-occupied-vacant
usable-site-acres
usable-site-sqft
use-legally-permitted
vacancy-allowance-discussion
valuation-intro-text
valuation-methodology-intro
valuation-scenario
value-scenario-type
walk-transit-bike-scores""".strip().split('\n')

def main():
    # Read template file
    template_path = Path('../../../src/features/report-builder/templates/reportPageTemplates.ts')
    
    if not template_path.exists():
        print(f"❌ Template file not found: {template_path}")
        return
    
    with open(template_path, 'r') as f:
        template_content = f.read()
    
    # Find field usage
    field_usage = defaultdict(list)
    unused_fields = []
    
    for field in MISSING_FIELDS:
        # Pattern: getFieldValue(sections, 'field-id')
        pattern = rf"getFieldValue\(sections,\s*['\"]{ re.escape(field) }['\"]\ )"
        matches = list(re.finditer(pattern, template_content))
        
        if matches:
            # Find which renderPageXX function(s) use this field
            for match in matches:
                start = template_content.rfind('export function renderPage', 0, match.start())
                if start != -1:
                    func_match = re.search(r'renderPage(\d+)', template_content[start:start+50])
                    if func_match:
                        page_num = int(func_match.group(1))
                        field_usage[field].append(page_num)
        else:
            unused_fields.append(field)
    
    # Statistics
    total_fields = len(MISSING_FIELDS)
    used_fields = len(field_usage)
    unused_count = len(unused_fields)
    
    print(f"📊 FIELD USAGE ANALYSIS\n")
    print(f"Total missing fields analyzed: {total_fields}")
    print(f"✅ Used in templates: {used_fields} ({used_fields/total_fields*100:.1f}%)")
    print(f"❌ NOT found in templates: {unused_count} ({unused_count/total_fields*100:.1f}%)")
    print()
    
    # Category breakdown
    if field_usage:
        print(f"📍 FIELDS USED IN TEMPLATES ({used_fields} fields):\n")
        
        # Group by page
        page_fields = defaultdict(list)
        for field, pages in field_usage.items():
            for page in set(pages):
                page_fields[page].append(field)
        
        for page in sorted(page_fields.keys()):
            fields = page_fields[page]
            print(f"  Page {page:02d}: {len(fields)} fields")
            for field in sorted(fields)[:5]:  # Show first 5
                print(f"    - {field}")
            if len(fields) > 5:
                print(f"    ... and {len(fields) - 5} more")
            print()
    
    # Unused fields
    if unused_fields:
        print(f"⚠️  PHANTOM FIELDS (NOT USED): {unused_count} fields\n")
        
        # Group by prefix
        prefix_groups = defaultdict(list)
        for field in unused_fields:
            prefix = field.split('-')[0]
            prefix_groups[prefix].append(field)
        
        for prefix, fields in sorted(prefix_groups.items()):
            print(f"  {prefix}-*: {len(fields)} fields")
            for field in fields[:3]:
                print(f"    - {field}")
            if len(fields) > 3:
                print(f"    ... and {len(fields) - 3} more")
            print()
    
    # Summary recommendation
    print("\n💡 RECOMMENDATIONS:\n")
    
    if unused_count > 0:
        print(f"⚠️  {unused_count} fields NOT found in templates (possible false positives)")
        print("   → Investigate if these are from older/deleted pages")
        print("   → May not need to add to registry if truly unused")
    
    if used_fields > 0:
        print(f"✅ {used_fields} fields confirmed in use")
        print("   → MUST add these to registry for templates to render")
    
    print(f"\n📈 NEXT STEPS:\n")
    print(f"1. Review unused fields list (if any)")
    print(f"2. Add {used_fields} confirmed fields to registry")
    print(f"3. Test pages listed above for missing field errors")

if __name__ == '__main__':
    main()

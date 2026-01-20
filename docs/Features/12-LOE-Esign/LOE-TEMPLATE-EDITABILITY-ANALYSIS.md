# LOE Template Editability Analysis

**Purpose:** Determine which sections of the V3 LOE template should be user-editable vs. system-controlled.

**Date:** 2026-01-20

---

## Current Parser Status

### Currently Extracted (4-5 sections):
1. ✅ Introduction paragraph
2. ✅ Terms and Conditions items (4+ individual list items)
3. ✅ Action/closing statement (potentially)

### Currently NOT Extracted:
- Header/title area
- Property details tables
- Most other text sections

---

## Full Template Content Map

### Section-by-Section Analysis

| Section | Content Type | Current Status | Should Be Editable? | Reasoning |
|---------|-------------|----------------|-------------------|-----------|
| **1. Document Header** | | | | |
| - Company logo | Image (embedded) | Not editable | ❌ NO | System-controlled branding |
| - Date | Field: `[date]` | Not editable | ❌ NO | Auto-populated from job data |
| - Client name | Field: `[client-name]` | Not editable | ❌ NO | Auto-populated from job data |
| - Client company | Field: `[propertycontact.company]` | Not editable | ❌ NO | Auto-populated from job data |
| - Client address | Field: `[addressstreet]`, `[city]` | Not editable | ❌ NO | Auto-populated from job data |
| **2. Subject Line** | | | | |
| - "Re: Letter of Engagement..." | Static text + fields | Not editable | ❓ MAYBE | Could be template-level customization |
| **3. Introduction Paragraph** | | | | |
| - "Thank you for your request..." | Boilerplate text | ✅ **Editable** | ✅ YES | Core engagement language - should be customizable |
| **4. Property Details Table** | | | | |
| - Property Identification | Label + field `[name]`, `[addressstreet]` | Not editable | ❌ NO | Structure + auto-populated |
| - Property Type | Label + field `[purposes]` | Not editable | ❌ NO | Structure + auto-populated |
| - Authorized Client | Label + field `[propertycontact.company]` | Not editable | ❌ NO | Structure + auto-populated |
| - Authorized Users | Label + **text paragraph** | Not editable | ❓ MAYBE | Semi-boilerplate with standard language |
| - Authorized Use | Label + field `[intendeduses]` | Not editable | ❌ NO | Structure + auto-populated |
| - Effective Date | Label + static text | Not editable | ❌ NO | Standard legal language |
| - Value to be Appraised | Label + field `[requestedvalues]` | Not editable | ❌ NO | Structure + auto-populated |
| - Property Rights | Label + field `[propertyrights]` | Not editable | ❌ NO | Structure + auto-populated |
| **5. Fees & Scope Table** | | | | |
| - Report Type | Label + field `[reportformat]` | Not editable | ❌ NO | Structure + auto-populated |
| - Fee | Label + field `[fee]` | Not editable | ❌ NO | Structure + auto-populated |
| - Scope of Work | Label + field `[scopes]` | Not editable | ❌ NO | Structure + auto-populated |
| - Estimated Completion | Label + field `[estimatedcompletion]` | Not editable | ❌ NO | Structure + auto-populated |
| **6. Terms & Conditions Section** | | | | |
| - Section divider | Visual element | Not editable | ❌ NO | Design element |
| - "Terms & Conditions" header | Static heading | Not editable | ❌ NO | Standard legal heading |
| - Term list items (numbered) | Boilerplate legal text | ✅ **Editable** | ✅ YES | Legal language may need firm-specific adjustments |
|   - Term 1: "These Terms and Conditions..." | Legal boilerplate | Currently editable | ✅ YES | Standard but may need tweaks |
|   - Term 2: "The appraisal, draft..." | Legal boilerplate | Currently editable | ✅ YES | Delivery terms may vary |
|   - Term 3: "The appraisal process..." | Legal boilerplate | Currently editable | ✅ YES | Process description may vary |
|   - Term 4: "Intended users of the appraisal..." | Legal boilerplate | Currently editable | ✅ YES | Legal restrictions may vary |
|   - Terms 5-20+ (if they exist) | Legal boilerplate | Unknown if editable | ✅ YES | All legal terms should be editable |
| **7. Action/Closing Section** | | | | |
| - "If this letter of engagement..." | Boilerplate closing | ✅ **Editable** | ✅ YES | Standard closing language - customizable |
| **8. Signature Block** | | | | |
| - "Sincerely," | Static text | Not editable | ❌ NO | Standard closing |
| - Company name | Static text | Not editable | ❌ NO | System-controlled branding |
| - Signature image | Image (embedded) | Not editable | ❌ NO | System-controlled signature |
| - Appraiser name | Field `[appraiser-name]` | Not editable | ❌ NO | Auto-populated from job data |
| **9. Client Signature Area** | | | | |
| - "Client Signature" label | Static text | Not editable | ❌ NO | Standard label |
| - Signature line | Visual element | Not editable | ❌ NO | DocuSeal field |
| - Date line | Visual element | Not editable | ❌ NO | DocuSeal field |

---

## Categorization Summary

### ❌ NEVER Editable (System-Controlled):
1. **Field Placeholders** - `[field-name]` patterns that get auto-populated from job data
2. **Company Branding** - Logo, company name, signature image
3. **Table Structure** - Row labels, column headers, table formatting
4. **Visual Elements** - Dividers, spacing, design elements
5. **DocuSeal Integration Points** - Signature boxes, date fields

**Why:** These are data-driven or system-controlled elements that should remain consistent across all templates.

---

### ✅ SHOULD Be Editable (Boilerplate Text):
1. **Introduction Paragraph** - Opening greeting and engagement purpose
2. **Terms & Conditions Items** - Legal language and requirements (ALL list items)
3. **Action/Closing Statement** - Final paragraph before signatures

**Why:** These are narrative/legal boilerplate that different firms or situations might need to customize.

---

### ❓ MAYBE Editable (Needs Discussion):
1. **Subject Line** - "Re: Letter of Engagement for..."
   - **Pro:** Some firms may want different subject line formats
   - **Con:** Could be auto-generated from fields
   - **Recommendation:** ❌ NOT editable (use field-based generation)

2. **"Authorized Users" Table Cell** - "The authorized user of the appraisal services..."
   - **Pro:** Some language customization may be needed
   - **Con:** It's within a structured table
   - **Recommendation:** ✅ EDITABLE (it's a text paragraph, not a field)

3. **Standard Table Row Labels** - "Property Identification", "Fee", etc.
   - **Pro:** Some firms may use different terminology
   - **Con:** Changes structure consistency
   - **Recommendation:** ❌ NOT editable (keep structure consistent)

---

## Missing from Current Parser

### High Priority (Should Add):
1. ❌ **All Terms & Conditions items** - Currently only parsing 4-5, but there may be 10-20+ terms in the list
   - Need to verify: How many terms are actually in V3_TEMPLATE?
   - Parser should extract ALL `<li>` items, not just the first few

2. ❓ **"Authorized Users" cell content** - If it's a text paragraph (not just a field), it should be editable

### Medium Priority (Consider):
1. Any other substantial text paragraphs within table cells that aren't just field placeholders

---

## Recommended Strategy

### Option A: Conservative (Recommended)
**Edit only major boilerplate sections:**
- ✅ Introduction paragraph
- ✅ ALL Terms & Conditions items (ensure parser gets all of them)
- ✅ Action/closing statement
- ✅ "Authorized Users" table cell (if it's a text paragraph)

**Total editable sections:** ~5-25 sections depending on how many terms exist

**Pros:**
- Clear scope
- Low risk of breaking structure
- Focused on actual boilerplate language
- Easier to understand for users

**Cons:**
- Less flexibility
- Can't customize table labels or structure

---

### Option B: Aggressive
**Edit everything that's text (not fields):**
- ✅ All the above PLUS:
- ✅ Subject line
- ✅ Table row labels
- ✅ Any other text content

**Total editable sections:** 30-50+ sections

**Pros:**
- Maximum flexibility
- Can customize everything

**Cons:**
- Overwhelming for users
- Higher risk of breaking template structure
- May expose too much complexity
- Users might not know what to do with all the options

---

### Option C: Hybrid (Alternative)
**Two template types:**
1. **Standard Template** - Only major boilerplate editable (Option A)
2. **Advanced Template** - Everything editable (Option B)

Users choose which level of control they want.

**Pros:**
- Serves both use cases
- Power users get flexibility
- Regular users get simplicity

**Cons:**
- More complex to build
- Two different UIs or modes to maintain

---

## Next Steps

1. **Read V3_TEMPLATE completely** - Count how many Terms & Conditions items actually exist
2. **Verify "Authorized Users" cell** - Is it a text paragraph or just a field?
3. **User Decision:** Which strategy?
   - [ ] Option A: Conservative (just major boilerplate)
   - [ ] Option B: Aggressive (all text)
   - [ ] Option C: Hybrid (two modes)
4. **Update templateParser.ts** based on decision
5. **Test with real LOE** to verify all intended sections are captured

---

## Questions for User

1. **How many Terms & Conditions are in the actual V3_TEMPLATE?** (Need to verify parser gets all)
2. **Should table cell text paragraphs be editable?** (Like "Authorized Users" description)
3. **Which strategy do you prefer?** (A: Conservative, B: Aggressive, C: Hybrid)
4. **Are there specific sections you know you want to customize** that aren't currently editable?

---

## Current Parser Code Location

- **File:** `src/utils/loe/templateParser.ts`
- **Extracts:** intro, terms list, action section, table cells (>20 chars)
- **Needs Verification:** Are ALL terms being extracted, or just the first few?

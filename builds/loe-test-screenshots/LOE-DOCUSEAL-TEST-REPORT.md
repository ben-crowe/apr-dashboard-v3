# LOE/DocuSeal Field Mapping Test Report

**Date:** 2026-03-30
**Agent:** react-specialist (dev-4 successor)
**Trigger:** CoArch requested verification after faf2562 ([propertycontact.*] renamed to [client.*])

---

## Test Subject

- **Job:** Harbourfront Tower (VAL261029)
- **Client:** Marcus Wellington, Senior VP, Wellington Capital Group
- **Address:** 888 Bay Street, Suite 1200, Toronto, ON M5S 2B4
- **Property:** 250 Queens Quay W, Toronto, ON M5J 2N3
- **DocuSeal Submission ID:** 6641589
- **Signing URL:** https://docuseal.com/s/ajwtDDbaxgXJkD

---

## Test Flow

1. Generated LOE HTML using V3 template with real Harbourfront Tower data
2. Verified all [client.*] placeholders rendered correctly in local preview
3. Sent pre-filled HTML to DocuSeal API (POST /submissions/html)
4. Navigated to signing page via agent-browser (headless)
5. Scrolled through entire document, captured screenshots at each section

---

## Results: ALL FIELDS PASS

### Header (Screenshot 03, 07)

| Field | Placeholder | Value | Status |
|-------|------------|-------|--------|
| Company | [client.company] | Wellington Capital Group | PASS |
| Name | [client.firstname] [client.lastname] | Marcus Wellington | PASS |
| Title | [client.title] | Senior VP | PASS |
| Address | [client.addressstreet] | 888 Bay Street, Suite 1200, Toronto, ON M5S 2B4 | PASS |

### Assignment Table (Screenshot 05, 08-09)

| Field | Placeholder | Value | Status |
|-------|------------|-------|--------|
| Property ID | [name], [addressstreet] | VAL261029, 250 Queens Quay W, Toronto, ON M5J 2N3 | PASS |
| Property Type | [purposes] | Multi-Family | PASS |
| Authorized Client | [client.company] | Wellington Capital Group | PASS |
| Authorized Use | [intendeduses] | First Mortgage Financing | PASS |
| Value to Appraise | [requestedvalues] | Market Value | PASS |
| Property Rights | [propertyrights] | Fee Simple Interest | PASS |

### Fee Table (Screenshot 06, 10)

| Field | Placeholder | Value | Status |
|-------|------------|-------|--------|
| Report Type | [reportformat] | Appraisal Report | PASS |
| Fee | [fee] | $7,500 plus applicable taxes | PASS |
| Scope of Work | [scopes] | All Applicable | PASS |
| Delivery Date | [duedate] | 15 business days from receipt of signed LOE and payment | PASS |

### Signature Section (Screenshot 04, 11)

| Field | Placeholder | Value | Status |
|-------|------------|-------|--------|
| Valta signature | (image) | Chris Chornohos signature present | PASS |
| Client Signature | {{signature}} | Interactive field (red dashed box) | PASS |
| Date Signed | {{date}} | Interactive field (calendar icon) | PASS |
| Signed By | [client.firstname] [client.lastname], [client.title] | Marcus Wellington, Senior VP | PASS |
| Company | [client.company] | Wellington Capital Group | PASS |

---

## Screenshots

| # | File | Content |
|---|------|---------|
| 02 | loe-preview-full.png | Full LOE document (local preview) |
| 03 | loe-header-client-fields.png | Header with client company/name/title/address |
| 04 | loe-signature-client-fields.png | Signature section with client name |
| 05 | loe-assignment-table.png | Assignment details table |
| 06 | loe-fee-scope-table.png | Fee and scope table |
| 07 | docuseal-signing-page.png | DocuSeal signing page (top) |
| 08 | docuseal-scrolled.png | DocuSeal scrolled to assignment table |
| 09 | docuseal-fee-table.png | DocuSeal fee section |
| 10 | docuseal-signature.png | DocuSeal fee + delivery |
| 11 | docuseal-client-acceptance.png | Client acceptance with signature field + client name |

---

## Conclusion

The [propertycontact.*] to [client.*] rename (commit faf2562) is verified safe. All 5 client fields render correctly through the full pipeline: V3 template -> generateLOE.ts mapping -> DocuSeal HTML submission -> signing page. Zero blanks, zero "Not Specified" where data exists.

DocuSeal receives pre-filled HTML — it never sees the bracket placeholders. The rename has no effect on the DocuSeal side.

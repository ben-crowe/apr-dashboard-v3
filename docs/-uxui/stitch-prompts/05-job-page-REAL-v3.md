# Stitch single-page prompt — the REAL V3 job page, mirrored exactly

Source: the RUNNING app at http://localhost:8086/dashboard/job/… — every
section name, field label, button, and value below was read off the live
page (job VAL261070) on 2026-07-17. Screenshot:
~/Development/KM-Exp/data/screenshots/stitch-apr-review/v3-real-job-page.png
Nothing here is invented. Section names and labels are VERBATIM.

Paste everything below the line into Stitch. It replaces the tabbed job
pages (the S1 and S2 screens) with ONE vertical page, exactly like the app.

---

Replace the Job Detail screens with ONE single vertical page titled "Job
Detail" that mirrors our real application exactly. Delete the tab
navigation between job sub-pages — this page is one long scroll of
collapsible sections. Keep the existing design system (dark tone-on-tone,
underline-only fields: gray label right-aligned to a colon, off-white value
on a transparent background with a thin underline — never boxed or filled
inputs). Job-list rows and any job links navigate here.

**Page structure, top to bottom — use these EXACT section names and field
labels, none renamed, none added:**

1. Breadcrumb row: "← Back", then "Submitted  #VAL261070" in muted text.
2. Page title: "VAL261070 - Parkview Apartments, 7874 Pine Drive"; right-
   aligned buttons: secondary "Create Report" (document icon), text button
   "Asset Studio" (gear icon).
3. **Collapsible section box: "Client Information & Property Details"**
   (a chevron header on a slightly raised bar; body contains flat
   UPPERCASE sub-headed groups, two-column underline fields):
   - CLIENT INFORMATION: First Name: Donald · Last Name: Miller · Title:
     Asset Manager · Organization: Phoenix Realty · Phone: (403) 865-3846 ·
     Email: donald.miller.981846@test.com · Street Address: Suite 469,
     5916 First Way · City: Calgary · Province: AB · Postal Code: T2T 0H1
   - PROPERTY INFORMATION: Property Name: Parkview Apartments · Property
     Type: Office ▾ · Property Subtype: Mixed-Use ▾ · Tenancy:
     Multi-Tenant ▾ · Street Address: 7874 Pine Drive · City: Chestermere ·
     Province: AB · Postal Code: T8I 0G2 · Authorized Use: GST ▾ ·
     Valuation Premises: Market Rent ▾ · Asset Condition: Poor ▾
   - PROPERTY CONTACT: First Name: Susan · Last Name: Clark · Email:
     susan.clark.981847@test.com · Phone: (403) 963-1224
   - CLIENT COMMENTS: one wide underline textarea.
4. **UPLOADED DOCUMENTS** section: an "Upload Files" secondary button; one
   file chip "test-property-document.pdf · 1 KB". Then "Client Documents":
   a "Documents to Request:" dropdown (Select…); a drop zone reading "Drop
   files here, or click to choose — they land in the pile below, unsorted";
   a row "Unsorted · 1 file" with the file chip. Then "Job Folders — drag a
   file onto one · click to look inside": FIVE folder cards in a row, each
   a framed card with a name, an em-dash count, "Empty — drag a file here",
   and a small "contents" link:
   "1. REPORT" · "2. CLIENT SUPPLIED" · "3. WORK FILES (TTSZ, PICS, COMPS)"
   · "4. CLIENT BILLING (Invoice, LOE)" · "5. LETTER OF RELIANCE (LOR)".
5. **Collapsible section box: "LOE Quote & Valuation Details"** — its
   header bar carries three small buttons on the right: "View in Valcre",
   "View in ClickUp", "Create Document/Email". Directly under the header, a
   quiet row: "Cascade Options — pick a scenario". Body = flat UPPERCASE
   groups of two-column underline fields:
   - JOB INFO: Job Number: · Job Status:
   - PURPOSE OF THE ASSIGNMENT: Purpose:
   - VALUE SCENARIOS & APPROACHES: Status of Improvements: Improved -
     Completed ▾ · Value Scenarios: As Stabilized ▾ · Property Rights:
     Leased Fee Interest ▾ · Approaches to Value: Direct Comparison,
     Income · Property Subtype: Mixed-Use ▾ · Tenancy: Multi-Tenant ▾ ·
     Value Timeframe: Select… ▾
   - A special row group titled "Section 10 write-ups — exactly what prints
     in the contract" with small toggle chips "All scenarios | As
     Stabilized", then a framed row "§10 ROW 1" with an "Edit" link and two
     lines of contract text, footed by the small note "Prints into Section
     10 as [EA/HCSummary1] · live mirror".
   - SCOPE OF WORK: Scope of Work: Income Approach
   - REPORT TYPE & ASSIGNMENT TYPE: Report Type: Appraisal Report ▾ ·
     Report Format: Select… ▾ · Assignment Type: Single Property ▾ ·
     Analysis Level: Select… ▾
   - FEES & TERMS: Appraisal Fee: · Retainer Amount:
   - PAYMENT: Retainer Paid: · Amount Paid: · Paid Date: · Signed Date:
   - EFFECTIVE DATE & REPORT DATE: Effective Date: · Client Requested
     Date: · Delivery Date: 2026-08-07 · Delivery Time (wks):
   - PROPERTY USE & OTHER: Current Use: Select… ▾ · Proposed Use:
     Select… ▾ · CMHC Financing: Select… ▾ · Transaction Status: Under
     Contract ▾ · Zoning Status: In Place ▾
   - PROPERTY INFORMATION REQUEST: Previously Appraised: Select… ▾
   - COMMENTS: General: · Delivery: · Payment: (three wide underline
     textareas)

Every field row: label right-aligned to a colon, value with underline only.
Sub-section headers are small uppercase letter-spaced slate text sitting
flat on the surface. The two big section boxes are the ONLY bordered
containers on the page; everything inside them is flat.

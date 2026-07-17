# Valcre client-page vs job-page — what lives at each level (mapped to our app)

Captured 2026-07-17 from the LIVE logged-in Valcre app (Valta's real account)
via the cmux browser surface — contact list, an open contact record, its
related-jobs tab — plus the archived job-page screenshots.

Sources:
- Live: https://app.valcre.com/contacts + /contacts/edit/13609812 (Dean Leischner)
- Archive: ~/Development/KM-Exp/data/screenshots/valcre-job-orient-01..05.png
- Doc: docs/Features/07-Report-Builder/0-APR-Core-to org/HomeTab Editor Plan
  Restructure/Valcre-HomeTab-Reference.md

## Valcre's top navigation (left sidebar)

Dashboard · Market Insights · Jobs · Contacts · Sets · Properties · Sales ·
Leases · Surveys · Expenses · Downloads · Administration · Custom fields

**Contacts (= clients) is a TOP-LEVEL sibling of Jobs** — the client is an
organizing level of the app, not a field on a job. This is exactly the CRM
direction Ben chose for our wrapper.

## The CLIENT page (Valcre "Contact") — three tabs

**CONTACT tab — identity, two blocks + meta:**
- Company block: Company Name, Company Type, Main Phone, Main Fax, Website,
  Street Address, Unit, City, State/Province, ZIP/Postal
- Person block: Salutation, First Name, Last Name, Suffix, Title, Division,
  Phone, Extension, Mobile, Fax, Email
- Meta: Notes (free text), Confidential flag, Relationship Owner (which
  staff member owns this client)

**FILES tab** — documents held at the client level (not per job).

**RELATED tab** — the client's JOBS as a table: Number, Name, Primary
Subject (property), Office, an Open link per row. (Verified live: one
contact → three jobs.)

## The JOB page — tabs JOB / COMPS / FILES / DCF

**JOB tab, "General" section (underline fields, label right-aligned):**
Job Number, Job Name, Subject Property (name + address), Property Contact,
**Authorized Client (the person + company — the LINK BACK to the Contact)**,
Client File Number, Borrower, Status (dropdown), Fee, Retainer, Amount Paid,
Check Number, … (dates/report sections continue below the fold).

**COMPS / DCF** — valuation tooling, out of scope for our wrapper.
**FILES** — per-job documents (our Client Documents section already does this).

## The relationship model (what to copy)

- Client and Job are both first-class pages; the job carries ONE field
  ("Authorized Client") pointing at the client; the client page shows ALL
  its jobs on a tab. Files exist at BOTH levels, separately.
- Our Stitch Clients page already matches this shape: roster → slide-over
  profile (≈ CONTACT tab) with an active-jobs list (≈ RELATED tab).
- Our Job Detail's S1 Client & Property ≈ the JOB/General block; our S3
  Client Documents ≈ the job FILES tab. A client-level files area is the
  one piece we don't have yet.

## Import path (the client-adoption move)

- Our app ALREADY talks to Valcre: `api/valcre.ts` is the server-side proxy
  used for job creation, and the `client_profiles` table holds 104 CRM rows.
- Valta's Valcre account holds ~116 contacts (read live). Importing them
  through the existing proxy would seed our Clients page with his real
  client base on day one — the adoption hook: he signs in and his clients
  are already there.
- Next step when Ben wants it: confirm the Valcre API's contacts endpoint
  in the API guide PDF (docs/Features/08-Master-Field-Registry/
  Valcre-API-Reference/Valcre API Guide.pdf) and map its fields onto
  client_profiles.

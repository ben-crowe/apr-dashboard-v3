# ClickUp Card — One-Pass UI Setup Checklist

The card-redesign **code is done + QA-verified**. ClickUp's API can't create, delete, or reorder
field columns — those are UI-only. So this is the manual pass (do it on the **mirror/test list**
first; repeat on production only when you're ready).

After this pass, React agent re-fires a test card and it shows clean: title-block description +
grouped fields, nothing dead.

---

## STEP 1 — ADD these 7 new field columns (so they populate)

- Appraisal Fee
- Retainer
- LOE Sent
- LOE Signed
- Status of Improvements
- Appraiser Notes
- Client Comments

## STEP 2 — DELETE these dead columns (noise + the dropped Property Contact group)

- QA_PROBE_DELETE_ME
- Client Title
- Client Address
- Job Status
- Intended Use
- Property Contact Name
- Property Contact First
- Property Contact Last
- Property Contact Email
- Property Contact Phone

## STEP 3 — REORDER: keepers grouped at top, dead ones at the bottom

Top, in this order:

**CLIENT** — Client Organization · Client First Name · Client Last Name · Client Email · Client Phone

**PROPERTY** — Property Name · Property Address · Property Type · Authorized Use · Asset Condition · Valuation Premise

**ASSIGNMENT** — Property Rights Appraised · Scope of Work · Report Type · Status of Improvements

**FINANCIAL** — Appraisal Fee · Retainer · Delivery Date · Payment Terms

**NOTES** — Appraiser Notes · Client Comments

Then everything in STEP 2 (the dead ones) pushed to the bottom — that way they're clustered and
obvious to delete in one sweep.

---

*Source: react-spec readback of the test card (QA-verified). Production list untouched until you say go.*

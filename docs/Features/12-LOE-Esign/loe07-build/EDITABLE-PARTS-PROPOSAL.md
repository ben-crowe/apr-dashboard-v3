# LOE V07 — Editable-Parts Proposal

_Scan of the live letter (V07 "LOE-07-1"). This is the **proposal** an agent hands back before anything goes live. On Ben's approval, these markers get added to a **client version** of the HTML — the master stays untouched._

---

## The rule (one simple convention)

Every part of the letter falls into one of four buckets:

- **Title** → LOCKED. The numbered headings + sub-clause headings. Holds the structure; not free-text editable.
- **Body** → EDITABLE. The wording inside a section. Client can reword freely.
- **Data field** → AUTO-FILLED. Name, address, fees, dates (the merge tokens). Filled by the system, not hand-typed over.
- **Removable section** → an **X** on a section's title drops that whole section out. Deliberate, not accidental.

The editor reads these markers and opens a box for each **Body**, locks each **Title**, leaves **Data** alone, and shows an **X** on each **Removable** section.

---

## What I'd make editable, section by section

Each numbered section: **title locked · body editable · removable = yes**, unless noted.

- **1. Assignment Identification** — body editable · removable
- **2. Property Description** — body editable · removable
- **3. Authorized Client, Users & Use** — body editable · removable
- **4. Purpose of the Assignment** — body editable · removable
- **5. Value Scenarios** — system-generated from the cascade; body editable but auto-populated · removable
- **6. Effective Date & Report Date** — body editable · removable
- **7. Report Type & Assignment Type** — body editable · removable
- **8. Scope of Work** — body editable · removable
- **9. Approaches to Value** — system-generated from the cascade; body editable but auto-populated · removable
- **10. Extraordinary Assumptions & Hypothetical Conditions** — system-generated; auto-drops when empty · removable
- **11. Professional Fees & Terms** — body editable · removable
- **12. Property Information Request** — body editable · removable
- **13. Inspection Requirements** — body editable · removable
- **14. Terms of Engagement** — each sub-clause (14.1–14.10) individually editable + individually removable
- **15. Prior Services & Conflict of Interest** — body editable · removable
- **16. Acceptance** — body editable; signature fields stay locked (DocuSeal anchors) · NOT removable
- **Schedule "A"** — body editable · removable (already auto-drops for single-property)
- **Appendix A** — body editable · removable

---

## What stays locked no matter what

- All section + sub-clause **titles** (the numbered headings).
- The **signature anchors** in section 16 (DocuSeal places these — must not be touched).
- The **data fields** (client name, address, fees, dates) — auto-filled, not free-typed.

---

## Mechanical note (for Codex — how the markers go in the HTML)

- Wrap each editable body block: `data-editable` on the element holding the wording.
- Mark each removable section wrapper: `data-removable` (the X targets this, drops the whole block).
- Leave titles and `merge-token` fields unmarked → the editor treats unmarked = locked.
- Section 16 signature anchors: leave exactly as-is, no markers.

Editor change required: the scanner reads `data-editable` / `data-removable` instead of the old five hardcoded class names. One simple convention, any future letter built to it just works.

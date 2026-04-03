# ClickUp Task — What Appears

> When a Valcre job is created, a task automatically appears on the Valta Jobs board.
> All values are examples. `#` numbers match Dashboard/Client Form field numbers.
> Verified: Yes = tested end-to-end.

---

## Task Example

```
Task Name:  PENDING - Harbourfront Tower, 250 Queens Quay West, Toronto, ON
Status:     To Do
Priority:   Normal
Tags:       NEW ARRIVAL, APR Hub

───────────────────────────────────────────────

▸ CLIENT INFORMATION

  • Client: Daniel Westbrook
  • Title: Managing Director
  • Organization: Westbrook Capital Group
  • Phone: (416) 555-0123
  • Email: daniel@westbrookcapital.ca
  • Address: 200 Queens Quay West Suite 2100, Toronto, ON M5J 2N2

▸ PROPERTY INFORMATION

  • Property: Harbourfront Tower
  • Address: 250 Queens Quay West, Toronto, ON M5J 2N2
  • Type: Multi-Family
  • Authorized Use: First Mortgage Financing
  • Valuation Premises: Market Value
  • Asset Condition: Good

▸ PROPERTY CONTACT

  • Contact: Marcus Johnson
  • Email: property.manager@harbourfront.ca
  • Phone: (416) 555-0456

▸ NOTES

  Multi-family residential tower, 42 stories, 380 units.
  Built 2018. Full interior and exterior inspection required.
  Requesting 30-day turnaround.

▸ LINKS

  • APR Dashboard: [link to job detail]
  • Valcre: [link to Valcre job]

───────────────────────────────────────────────

Subtasks (from template):

  □ 1. Receive Client Info & Documents
  □ 2. Create Valcre Job & LOE
  □ 3. Pull (TTSZ) Tax, Title, Site Plan, Zoning
  □ 4. Tour Property
  □ 5. Sale and Lease Comps
  □ 6. Build Front End
  □ 7. Complete Valuation
  □ 8. Send to Client
  □ 9. Book Job
  □ 10. Archive
```

---

## Custom Fields (Auto-Populated)

| # | Field | Example Value | Source | Verified |
|---|-------|---------------|--------|----------|
| | Job Number | *VAL261030* | Auto | Yes |
| 1 | Client First Name | *Daniel* | Client | Yes |
| 2 | Client Last Name | *Westbrook* | Client | Yes |
| 3 | Client Title | *Managing Director* | Client | Yes |
| 4 | Client Organization | *Westbrook Capital Group* | Client | Yes |
| 7 | Client Address | *200 Queens Quay West Suite 2100....* | Client | Yes |
| 6 | Client Email | *daniel@westbrookcapital.ca* | Client | Yes |

> 7 of 27 custom fields auto-populated. Remaining 20 are available on the board but not auto-filled — team uses the task description and Valcre for full details.

---

## Auto-Updates After Creation

| Event | What Happens |
|-------|-------------|
| LOE sent to client | Task description updated: `▸ LOE SENT — 2026-04-01 — Sent to daniel@westbrookcapital.ca` |
| Client signs LOE | Task description updated: `▸ LOE SIGNED — 2026-04-03 — Signed by Daniel Westbrook` |

---

## Trigger

```
Dashboard "Create Valcre Job" button
    │
    ├─► Valcre job created (VAL261030)
    ├─► ClickUp task created on Valta Jobs board
    ├─► 7 custom fields populated
    ├─► 10-step checklist applied
    └─► Team notified via ClickUp
```

---

*Task name updates from "PENDING" to the VAL number once the Valcre job is booked.*

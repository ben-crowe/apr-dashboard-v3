# Target — single-digit group prefix on each field

Each field's Name = one group digit + a space + the field's own name. No title words, no header rows. Same digit = same group, so they cluster (ClickUp sorts fields by name). Order within a group doesn't matter. The column header in a table view shows just "1 Received Date" — one clean number. Keep every field's type + drop-down options; only the Name changes.

(Blank lines below are just to show the grouping in this doc — in ClickUp it's one continuous list.)

```
 TYPE     FIELD NAME                      VALUE      group
 ─────    ──────────────────────────────  ─────      ─────
 date     1 Received Date                  —          1 · dates  (we feed)
 date     1 LOE Sent                       —
 date     1 LOE Signed                     —
 date     1 Delivery Date                  —

 url      2 APR Dashboard Link             —          2 · job  (we feed)
 url      2 Valcre Job                     —
 text     2 Job Number                     —

 text     3 Client Full Name               —          3 · client  (we feed)
 email    3 Client Email                   —
 phone    3 Client Phone                   —
 text     3 Client Organization            —

 text     4 Property Name                  —          4 · property  (we feed)
 text     4 Property Address               —
 drop     4 Property Type                  —

 text     5 Contact Name                   —          5 · contact  (we feed)
 email    5 Contact Email                  —
 phone    5 Contact Phone                  —

 drop     6 Property Subtype               —          6 · appraisal scope  (team)
 drop     6 Interest Appraised             —
 drop     6 Authorized Use                 —
 drop     6 State of Improvements          —
 drop     6 Status of Improvements         —
 drop     6 Approaches To Value            —
 drop     6 Value Scenario(s)              —
 drop     6 Report Type                    —
 date     6 Inspection Date                —

 drop     7 Transaction Status             —          7 · site / transaction  (team)
 drop     7 Zoning Status                  —
 drop     7 Land $/Metric                  —

 drop     8 Phase Owner                    —          8 · team & workflow  (team)
 drop     8 Work Phase                     —
 check    8 Client Info Received          [ ]
 check    8 Invoice Paid                  [ ]
 check    8 TTSZ Done                     [ ]
 check    8 Template Saved                [ ]
 check    8 Photos Saved                  [ ]
 check    8 Comps Provided                [ ]

 text     9 Notes                          —          9 · notes  (team)
 text     9 Task Type                      —
```

Groups 1–5 the dashboard feeds; 6–9 the appraiser team fills. Property Type (group 4) must match their existing options. None left on the old import names.

Status tags (separate from fields — the job-state pipeline): new arrival → loe sent → loe signed → awaiting payment → paid, plus an apr hub tag.

Optional, if you ever want a visible header inside a group: a field named "1  Dates" with TWO spaces after the digit floats to the top of that group (the extra space sorts above the field names). Skipped here since it reads oddly as a table column — the bare digit is enough.

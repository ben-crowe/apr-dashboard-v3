# Valcre Job — Complete Field View

> Every field on the Valcre job edit page, matching the exact layout at `app.valcre.com/job/edit/{id}`.
> 7 sections: General, Dates, Report, Staff, Permissions, Comments, Custom Fields.
> All values are examples. `#` numbers match the Dashboard field numbers.
> Verified: Yes = tested end-to-end. No = mapped but not yet tested. — = not our field.
> All Mapped From fields are located on the APR Dashboard.

***

## 1. General

| #      | Field              | Example Value                                | Mapped From                        | Verified |
| ------ | ------------------ | ------------------------------------ | ---------------------------------- | -------- |
| <br /> | Job Number         | *VAL261030*                          | —                                  | —        |
| <br /> | Client File Number | *—*                                  | —                                  | —        |
| 8      | Job Name           | *Harbourfront Tower, 250 Queens....* | Property Name + Property Address   | Yes      |
| 8      | Subject Property   | *Harbourfront Tower*                 | Property Name                      | Yes      |
| 10     | Address            | *250 Queens Quay West, Toronto....*  | Property Address                   | Yes      |
| <br /> | Borrower           | *—*                                  | —                                  | —        |
| 14     | Property Contact   | *Marcus Johnson*                     | Property Contact First + Last Name | No       |
| 4      | Authorized Client  | *Westbrook Capital Group*            | Organization                       | Yes      |
| <br /> | Status             | *Lead*                               | —                                  | —        |
| 23     | Fee                | *$7,500.00*                          | Appraisal Fee                      | Yes      |
| 25     | Retainer           | *$1,500.00*                          | Retainer Amount                    | Yes      |
| <br /> | Invoiced           | *—*                                  | —                                  | —        |
| <br /> | Amount Paid        | *—*                                  | —                                  | —        |
| <br /> | Check Number       | *—*                                  | —                                  | —        |
| <br /> | Appraised Value    | *—*                                  | —                                  | —        |

***

## 2. Dates

| #      | Field             | Example Value        | Mapped From              | Verified |
| ------ | ----------------- | ------------ | ------------------------ | -------- |
| <br /> | Bid Date          | *2026-03-30* | Auto (job creation date) | —        |
| 26     | Delivery Date     | *2026-04-30* | Delivery Date            | No       |
| <br /> | Inspection Date   | *yyyy-mm-dd* | —                        | —        |
| <br /> | Date of Value     | *yyyy-mm-dd* | —                        | —        |
| <br /> | Internal Due Date | *yyyy-mm-dd* | —                        | —        |
| <br /> | Due Date          | *yyyy-mm-dd* | —                        | —        |
| <br /> | Award Date        | *yyyy-mm-dd* | —                        | —        |
| <br /> | Field Date        | *yyyy-mm-dd* | —                        | —        |

***

## 3. Report

| #      | Field          | Example Value              | Mapped From     | Verified |
| ------ | -------------- | ------------------ | --------------- | -------- |
| 24     | Format         | *Appraisal Report* | Report Type     | Yes      |
| 11     | Authorized Use | *Financing*        | Authorized Use  | Yes      |
| 21     | Scope          | *All Applicable*   | Scope of Work   | Yes      |
| <br /> | Analysis Level | *—*                | —               | —        |
| 20     | Purposes       | *Fee Simple*       | Property Rights | Yes      |
| <br /> | Classes        | *—*                | —               | —        |

***

## 4. Staff

| #      | Field             | Example Value | Mapped From | Verified |
| ------ | ----------------- | ----- | ----------- | -------- |
| <br /> | Primary Appraiser | *—*   | —           | —        |
| <br /> | Scope 1           | *—*   | —           | —        |
| <br /> | Scope 2           | *—*   | —           | —        |
| <br /> | Scope 3           | *—*   | —           | —        |

***

## 5. Permissions

| #      | Field        | Example Value | Mapped From | Verified |
| ------ | ------------ | ----- | ----------- | -------- |
| <br /> | Confidential | *No*  | —           | —        |

***

## 6. Comments

| #      | Field    | Example Value                                   | Mapped From       | Verified |
| ------ | -------- | --------------------------------------- | ----------------- | -------- |
| 27     | General  | *Comparable sales indicate strong....*  | General Comments  | Yes      |
| <br /> | Detail   | *—*                                     | —                 | —        |
| 28     | Delivery | *Email draft to client for review\....* | Delivery Comments | Yes      |
| 29     | Payment  | *Retainer received March....*           | Payment Comments  | Yes      |

***

## 7. Custom Fields

| #      | Field                      | Example Value               | Mapped From              | Verified |
| ------ | -------------------------- | ------------------- | ------------------------ | -------- |
| <br /> | Lender Company Name        | *—*                 | —                        | —        |
| <br /> | Lender Company Address     | *—*                 | —                        | —        |
| <br /> | Lender Contact Name        | *—*                 | —                        | —        |
| <br /> | Lender Contact Email       | *—*                 | —                        | —        |
| <br /> | Lender Contact Phone       | *—*                 | —                        | —        |
| <br /> | Lender Contact Title       | *—*                 | —                        | —        |
| <br /> | Valuation Premise - 1      | *—*                 | —                        | —        |
| <br /> | Valuation Premise - 2      | *—*                 | —                        | —        |
| <br /> | Appraised Value - 1        | *—*                 | —                        | —        |
| <br /> | Appraised Value - 2        | *—*                 | —                        | —        |
| <br /> | <br />                     | <br />              | <br />                   | <br />   |
| 35     | State of Improvements ★    | *Complete*          | State of Improvements    | Yes      |
| 36     | Status of Improvements ★   | *As Is*             | Status of Improvements   | Yes      |
| 37     | Property Subtype ★         | *High-Rise*         | Property Subtype         | Yes      |
| 38     | Land Metric ★              | *Square Feet*       | Land Metric              | Yes      |
| 39     | Environmental Assessment ★ | *Phase 1 - Clear*   | Environmental Assessment | Yes      |
| 40     | Heritage / Conservation ★  | *None*              | Heritage / Conservation  | Yes      |
| 41     | Assignment Type ★          | *Standard*          | Assignment Type          | Yes      |
| 42     | Desktop Report ★           | *false*             | Desktop Report           | Yes      |
| 43     | Value Timeframe ★          | *Prospective*       | Value Timeframe          | Yes      |
| 44     | Approaches to Value ★      | *Direct Comparison* | Approaches to Value      | Yes      |
| 45     | Transaction Status ★       | *Arms Length*       | Transaction Status       | Yes      |
| 46     | Zoning Status ★            | *Legal Conforming*  | Zoning Status            | Yes      |
| 34     | Tenancy ★                  | *Multi-Tenant*      | Tenancy                  | Yes      |

★ = 13 custom fields we created (IDs 12042-12054)
All Mapped From fields are located on the APR Dashboard.

***

*Verified: 25 Yes, 2 No (Property Contact, Delivery Date). 13 custom fields all verified. Remaining dashboard fields (#30-33, #47-65) map to Valcre Property tab — see file 9.*

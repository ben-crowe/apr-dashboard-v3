# 05 - External APIs & Services

## ClickUp Integration
**Purpose:** Sync job management states and automate task templates.
**Endpoints:** Standard ClickUp Open API.
**Core Rule:** Do *not* silence token or permission errors. Tasks must trigger dynamically *after* Valcre job creation.

## Valcre Integration
**Purpose:** Record-keeping for properties and finalized appraisals.
**Flow:** Valcre API is triggered typically following Client Intake validation.

## DocuSeal Integration
**Purpose:** E-signatures for the LOE and final delivery outputs.

## Resend Email Integration (Work In Progress)
**Purpose:** Client follow-ups and automated response loops.
**Status:** Recent implementation efforts detected in session logs regarding setup of the email reply system.

*(Reviewer check: Are there any specific payload schemas or webhook structures missing here that should be strictly documented?)*

# 02 - Data Models

## Core Relational Tables
This application heavily leverages Supabase (PostgreSQL). The fundamental entities and flows are as follows:

### `job_submissions`
**Purpose:** Handles the entry point. Stages 1 and 2 operate here. External CRM APIs push to this.

### `job_loe_details`
**Purpose:** Specific financial line of efforts, pricing parameters, and quoting mechanisms. Represents an attachment/supplement to a `job_submission`.

### `report_builder_data`
**Purpose:** Stores the gigantic JSON blob (or normalized tabular data—*Needs Verification*) representing the 944+ fields necessary for report assembly.
**Key Constraint:** Data should aggressively debounce-save here (e.g., 2 seconds un-interrupted) while a user is working in the Report Builder.

*(Reviewer check: Does `report_builder_data` hold a flat JSON column or is it strongly relational?)*

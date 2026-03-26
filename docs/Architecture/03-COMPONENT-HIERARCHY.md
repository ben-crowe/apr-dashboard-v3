# 03 - Component Hierarchy

## Design System
- **Framework:** React + Tailwind CSS
- **Library Base:** Shadcn UI 

## Project Architecture
The project is built on Vite and groups into features.
**Standard Structure:**
- `src/components/ui`: Isolated Shadcn atomic components. Avoid mutating here unless globally required.
- `src/features`: Grouping logic by domain (e.g., `report-builder/`).
  - Contains nested `schema`, `store`, and layout configurations.
- `src/hooks`: Global custom React hooks.
- `src/utils`: Utilities like mathematical operations for appraisal calculators.

## State Management
- **Zustand** is utilized for application-level state where React Context is too heavy (such as managing the active payload of 944+ fields in the `report-builder`).

*(Reviewer check: Is there a specific caching mechanic inside Zustand handling offline/saving behavior that requires deep linking here?)*

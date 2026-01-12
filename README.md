# APR Dashboard V3

Modern web application for managing appraisal job submissions, quotes, workflow automation, and report generation.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn UI Components
- **Backend**: Supabase (PostgreSQL)
- **Integrations**: Valcre API, ClickUp, DocuSeal
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Valcre API access
- ClickUp API access (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/ben-crowe/apr-dashboard-v3.git
cd apr-dashboard-v3

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your actual credentials

# Start development server
npm run dev
```

Application runs at `http://localhost:5173`

## Environment Configuration

See `.env.example` for required environment variables:

- **Supabase**: Database and authentication
- **Valcre API**: Job management integration
- **ClickUp**: Task automation (optional)

Get Supabase credentials from: Dashboard -> Settings -> API

### Required Environment Variables

```
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
VITE_SUPABASE_PROJECT_ID=[project-id]
VITE_CLICKUP_ENV=production
VALCRE_API_KEY=[your-key]
CLICKUP_API_KEY=[your-key]
CLICKUP_LIST_ID=[list-id]
```

## Development

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Project Structure

```
apr-dashboard-v3/
|-- docs/                         # Documentation
|   |-- Features/                 # Feature documentation (01-13)
|   |   |-- 00-FEATURES-OVERVIEW.md
|   |   |-- 07-Report-Builder/
|   |   |-- 09-Template-Management/
|   |   +-- ...
|   +-- Architecture/             # Architecture docs
|       |-- APR-V4-ARCHITECTURE.md
|       +-- ...
|-- src/
|   |-- components/               # React components
|   |   |-- ui/                   # Shadcn UI components
|   |   |-- dashboard/            # Dashboard views
|   |   +-- submission-form/      # Form components
|   |-- features/                 # Feature modules
|   |   +-- report-builder/       # Report Builder system
|   |       |-- schema/           # Field registry
|   |       +-- store/            # Zustand store
|   |-- hooks/                    # Custom React hooks
|   |-- utils/                    # Utility functions
|   +-- integrations/
|       +-- supabase/             # Supabase client
|-- public/                       # Static assets
|   +-- Report-MF-template.html   # 79-page report template
|-- supabase/
|   +-- migrations/               # Database migrations
+-- api/                          # API routes
```

## Key Documentation

| Topic | Location |
|-------|----------|
| Features Overview | `docs/Features/00-FEATURES-OVERVIEW.md` |
| Report Builder | `docs/Features/07-Report-Builder/` |
| Template Management | `docs/Features/09-Template-Management/` |
| Field Registry | `docs/Features/08-Field-Input-Output-Mapping/` |
| Architecture | `docs/Architecture/APR-V4-ARCHITECTURE.md` |

## Database Schema

Two-table architecture:
- `job_submissions` - Main job data
- `job_loe_details` - Line of Effort / Quote details

## Deployment

### Vercel (Recommended)

**Auto-Deploy from GitHub:**
1. Push to `main` branch
2. Vercel automatically detects changes
3. Builds and deploys

**Manual Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Environment Variables (Vercel Dashboard)

Set all variables from `.env.example` in Vercel Dashboard -> Settings -> Environment Variables.

### Supabase Setup

```bash
cd supabase
supabase db push
```

## Troubleshooting

### Build Fails
1. Check all environment variables are set
2. Run `npm install` to ensure dependencies are current
3. Check `npm run build` locally first

### Deployment Works But App Doesn't Load
1. Check browser console for errors
2. Verify Supabase URL and keys are correct
3. Check CORS settings in Supabase dashboard

### Field Mapping Issues
- See `docs/Features/08-Field-Input-Output-Mapping/` for field references
- Field IDs use kebab-case (e.g., `calc-type1-rent`)
- Check `src/features/report-builder/schema/fieldRegistry.ts` for source of truth

## Contributing

1. Check field registry for existing field IDs
2. Follow kebab-case naming for new fields
3. Maintain 4-file sync: fieldRegistry, TestDataSet, template, EditPanel
4. Run `npm run build` before committing
5. Follow TypeScript strict mode conventions

---

**Version**: 3.x
**Last Updated**: January 2026

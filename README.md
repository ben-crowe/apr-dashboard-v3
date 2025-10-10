# APR Dashboard V3

Modern web application for managing appraisal job submissions, quotes, and workflow automation.

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

Get Supabase credentials from: Dashboard → Settings → API

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
├── .docs/                    # Documentation
│   ├── field-mapping.md     # Valcre API field mappings
│   ├── api-reference.md     # API integration docs
│   └── deployment.md        # Deployment guide
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn UI components
│   │   ├── dashboard/      # Dashboard views
│   │   └── submission-form/ # Form components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   │   └── webhooks/       # Integration services
│   ├── pages/              # Route pages
│   └── integrations/
│       └── supabase/       # Supabase client
├── public/                  # Static assets
├── supabase/
│   └── migrations/         # Database migrations
└── api/                    # API routes
```

## Key Documentation

- **Field Mapping**: `.docs/field-mapping.md` - Master reference for Valcre API field names
- **API Reference**: `.docs/api-reference.md` - Integration endpoints and conventions
- **Deployment**: `.docs/deployment.md` - Deployment procedures and troubleshooting

## Database Schema

Two-table architecture:
- `job_submissions` - Main job data
- `job_loe_details` - Line of Effort / Quote details

Most form data persists to both tables. See `.docs/api-reference.md` for schema details.

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

Or connect GitHub repository to Vercel for automatic deployments on push to `main`.

### Environment Variables (Vercel Dashboard)

Set all variables from `.env.example` in Vercel Dashboard → Settings → Environment Variables.

See `.docs/deployment.md` for detailed deployment guide.

## Common Issues

### Retainer Amount Not Syncing
- Ensure using field name `Retainer` (not `RetainerAmount`)
- Strip $ and commas from currency values before API calls

### Build Fails
- Verify all environment variables are set
- Run `npm install` to update dependencies
- Check `npm run build` locally first

### Field Mapping Questions
- Always reference `.docs/field-mapping.md`
- Never guess Valcre API field names
- Use exact PascalCase as documented

## Contributing

1. Check `.docs/field-mapping.md` for Valcre field names
2. Consider two-table pattern impact for data changes
3. Test currency formatting if touching payment fields
4. Run `npm run build` before committing
5. Follow TypeScript strict mode conventions

## Support

For issues or questions, see `.docs/` directory for detailed documentation.

---

**Version**: 3.0
**Last Updated**: October 10, 2025

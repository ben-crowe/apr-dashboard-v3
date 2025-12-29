# Deployment Guide

## Local Development

```bash
# Clone repository
git clone https://github.com/ben-crowe/apr-dashboard-v3.git
cd apr-dashboard-v3

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your keys to .env.local
# Then start development server
npm run dev
```

Runs on `http://localhost:5173`

---

## Vercel Deployment

### Auto-Deploy from GitHub

1. Push to `main` branch
2. Vercel automatically detects changes
3. Builds and deploys

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables (Set in Vercel Dashboard)

Required variables:
```
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
VITE_SUPABASE_PROJECT_ID=[project-id]
VITE_CLICKUP_ENV=production
VALCRE_API_KEY=[your-key]
CLICKUP_API_KEY=[your-key]
CLICKUP_LIST_ID=[list-id]
```

---

## Supabase Setup

### Migrations

Run migrations in order:
```bash
cd supabase
supabase db push
```

### Environment Variables

Get from Supabase Dashboard → Settings → API:
- Project URL → `VITE_SUPABASE_URL`
- anon/public key → `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## Build Configuration

### Vite Config

- Framework: React + TypeScript
- Build command: `npm run build`
- Output directory: `dist`
- Dev server: Port 5173

### Vercel Config

See `vercel.json` for routing and build settings.

---

## Troubleshooting

### Build Fails

1. Check all environment variables are set
2. Run `npm install` to ensure dependencies are current
3. Check `npm run build` locally first

### Deployment Works But App Doesn't Load

1. Check browser console for errors
2. Verify Supabase URL and keys are correct
3. Check CORS settings in Supabase dashboard
4. Verify Valcre API key is valid

### Field Mapping Issues

1. See `.docs/field-mapping.md` for correct field names
2. Retainer field must be `Retainer` not `RetainerAmount`
3. Strip $ and commas from currency before sending to Valcre

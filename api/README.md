# API Folder - Vercel Serverless Functions

## ⚠️ IMPORTANT: DO NOT MOVE THIS FOLDER

This `/api` folder MUST remain at the project root for Vercel deployment to work correctly.

## Why This Folder Exists Here

Vercel automatically deploys any TypeScript/JavaScript files in the `/api` folder as serverless functions. Moving these files elsewhere will break the API endpoints.

## Current Functions

### `valcre.ts`
- **Endpoint**: `/api/valcre`
- **Purpose**: Handles Valcre API integration for creating and updating jobs
- **Used by**: Frontend "Create Valcre Job" button and sync operations
- **Note**: Contains hardcoded credentials that should be moved to environment variables

## How Vercel Serverless Functions Work

1. Any file in `/api` becomes an endpoint
2. `valcre.ts` → accessible at `/api/valcre`
3. The function handles POST requests for job creation
4. Deployed automatically with `vercel` or `vercel --prod`

## Security Note

⚠️ The `valcre.ts` file contains hardcoded credentials:
- OAuth client_id and client_secret
- Username and password

These should be moved to environment variables in Vercel dashboard.

## Related Documentation

For more details about the Valcre integration, see:
`/03-Valcre-Integration.Dev/valcre-integration/`

---
**Note**: Even though the logic is part of the Valcre integration module, the actual serverless function file MUST stay here in `/api` for deployment.
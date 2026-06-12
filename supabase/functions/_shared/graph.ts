// Microsoft Graph helper (app-only / client-credentials) for the APR Dashboard.
//
// Powers two features off ONE Entra app:
//   A. Outbound email  — POST /users/{mailbox}/sendMail
//   B. SharePoint       — per-job folder tree + file upload under .../sites/V
//
// Build spec: docs/Features/13-Asset-Storage/MS-GRAPH-BUILD-SPEC-2026-06-11.md
//
// All of this is INERT until the three secrets exist. `graphConfigured()` lets a
// caller fall back (e.g. send-loe-email keeps using Resend) until Ben registers
// the Entra app and stores GRAPH_TENANT_ID / GRAPH_CLIENT_ID / GRAPH_CLIENT_SECRET.

const TENANT_ID = Deno.env.get('GRAPH_TENANT_ID') ?? '';
const CLIENT_ID = Deno.env.get('GRAPH_CLIENT_ID') ?? '';
const CLIENT_SECRET = Deno.env.get('GRAPH_CLIENT_SECRET') ?? '';

// Optional pre-resolved SharePoint IDs (see one-time discovery in the build spec).
// If unset, resolveSharePointIds() discovers + caches them at runtime.
const SITE_HOSTNAME = Deno.env.get('SHAREPOINT_HOSTNAME') ?? 'valtapropertyvaluations.sharepoint.com';
const SITE_PATH = Deno.env.get('SHAREPOINT_SITE_PATH') ?? '/sites/V';
let SHAREPOINT_SITE_ID = Deno.env.get('SHAREPOINT_SITE_ID') ?? '';
let SHAREPOINT_DRIVE_ID = Deno.env.get('SHAREPOINT_DRIVE_ID') ?? '';

const GRAPH = 'https://graph.microsoft.com/v1.0';

/** True only when all three Entra secrets are present. Callers gate on this. */
export function graphConfigured(): boolean {
  return Boolean(TENANT_ID && CLIENT_ID && CLIENT_SECRET);
}

// ----- token (cached for its lifetime, never per-call) -----------------------

let cachedToken = '';
let tokenExpiresAt = 0; // epoch ms

export async function getGraphToken(): Promise<string> {
  if (!graphConfigured()) {
    throw new Error('Microsoft Graph not configured (GRAPH_TENANT_ID / GRAPH_CLIENT_ID / GRAPH_CLIENT_SECRET missing).');
  }
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 60_000) return cachedToken; // 60s safety margin

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    scope: 'https://graph.microsoft.com/.default',
    client_secret: CLIENT_SECRET,
    grant_type: 'client_credentials',
  });

  const res = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) {
    throw new Error(`Graph token request failed (${res.status}): ${await res.text()}`);
  }
  const json = await res.json();
  cachedToken = json.access_token;
  tokenExpiresAt = now + (json.expires_in ?? 3599) * 1000;
  return cachedToken;
}

async function graphFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getGraphToken();
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  return fetch(path.startsWith('http') ? path : `${GRAPH}${path}`, { ...init, headers });
}

// ----- Feature A: email ------------------------------------------------------

export interface SendMailArgs {
  mailbox: string;            // sending UPN, e.g. noreply@valta.ca
  to: string | string[];
  subject: string;
  html: string;
  cc?: string | string[];
  saveToSentItems?: boolean;
}

const toRecipientList = (v: string | string[]) =>
  (Array.isArray(v) ? v : [v]).filter(Boolean).map((address) => ({ emailAddress: { address } }));

/** Send HTML mail as {mailbox}. Returns on HTTP 202 (accepted for delivery). */
export async function graphSendMail(args: SendMailArgs): Promise<void> {
  const message: Record<string, unknown> = {
    subject: args.subject,
    body: { contentType: 'HTML', content: args.html },
    toRecipients: toRecipientList(args.to),
  };
  if (args.cc) message.ccRecipients = toRecipientList(args.cc);

  const res = await graphFetch(`/users/${encodeURIComponent(args.mailbox)}/sendMail`, {
    method: 'POST',
    body: JSON.stringify({ message, saveToSentItems: args.saveToSentItems ?? true }),
  });
  if (res.status !== 202) {
    throw new Error(`sendMail failed (${res.status}): ${await res.text()}`);
  }
}

// ----- Feature B: SharePoint -------------------------------------------------

/** Resolve + cache the site id and the "Shared Documents" drive id. */
export async function resolveSharePointIds(): Promise<{ siteId: string; driveId: string }> {
  if (SHAREPOINT_SITE_ID && SHAREPOINT_DRIVE_ID) {
    return { siteId: SHAREPOINT_SITE_ID, driveId: SHAREPOINT_DRIVE_ID };
  }
  if (!SHAREPOINT_SITE_ID) {
    const res = await graphFetch(`/sites/${SITE_HOSTNAME}:${SITE_PATH}`);
    if (!res.ok) throw new Error(`site-get failed (${res.status}): ${await res.text()}`);
    SHAREPOINT_SITE_ID = (await res.json()).id;
  }
  if (!SHAREPOINT_DRIVE_ID) {
    // The default document library = "Shared Documents".
    const res = await graphFetch(`/sites/${SHAREPOINT_SITE_ID}/drive`);
    if (!res.ok) throw new Error(`drive-get failed (${res.status}): ${await res.text()}`);
    SHAREPOINT_DRIVE_ID = (await res.json()).id;
  }
  return { siteId: SHAREPOINT_SITE_ID, driveId: SHAREPOINT_DRIVE_ID };
}

// Encode each path segment but keep the slashes between segments.
const encodePath = (p: string) => p.split('/').map(encodeURIComponent).join('/');

/**
 * Idempotent folder create at a path under the drive root.
 * GET first (returns id if it already exists), else POST with conflictBehavior:fail.
 * Returns the folder's driveItem id.
 */
export async function ensureFolder(driveId: string, parentPath: string, name: string): Promise<string> {
  const fullPath = parentPath ? `${parentPath}/${name}` : name;

  const getRes = await graphFetch(`/drives/${driveId}/root:/${encodePath(fullPath)}`);
  if (getRes.ok) return (await getRes.json()).id;
  if (getRes.status !== 404) {
    throw new Error(`folder GET failed (${getRes.status}): ${await getRes.text()}`);
  }

  const childrenUrl = parentPath
    ? `/drives/${driveId}/root:/${encodePath(parentPath)}:/children`
    : `/drives/${driveId}/root/children`;
  const postRes = await graphFetch(childrenUrl, {
    method: 'POST',
    body: JSON.stringify({ name, folder: {}, '@microsoft.graph.conflictBehavior': 'fail' }),
  });
  if (postRes.status === 201) return (await postRes.json()).id;
  if (postRes.status === 409) {
    // race: someone created it between our GET and POST — re-read
    const retry = await graphFetch(`/drives/${driveId}/root:/${encodePath(fullPath)}`);
    if (retry.ok) return (await retry.json()).id;
  }
  throw new Error(`folder create failed (${postRes.status}): ${await postRes.text()}`);
}

// The five canonical job subfolders — EXACT order + casing (confirmed from live SharePoint).
export const JOB_SUBFOLDERS = [
  '1. REPORT',
  '2. CLIENT SUPPLIED',
  '3. WORK FILES (TTSZ, PICS, COMPS)',
  '4. CLIENT BILLING (Invoice, LOE)',
  '5. LETTER OF RELIANCE (LOR)',
] as const;

export interface JobFolderArgs {
  year: string | number;     // {YEAR} segment under 2.Jobs
  parentFolderName: string;  // "{JOB#} - {Property Description + Street + City + Province}"
}

export interface JobFolderResult {
  parentPath: string;
  parentId: string;
  subfolders: { name: string; id: string }[];
}

/**
 * Create the full per-job folder tree: 2.Jobs/{YEAR}/{parentFolderName}/ + the 5 subfolders.
 * Idempotent — safe to call repeatedly (the dashboard "Create Client Folders" button).
 */
export async function createJobFolders(args: JobFolderArgs): Promise<JobFolderResult> {
  const { driveId } = await resolveSharePointIds();
  const year = String(args.year);

  // Ensure the 2.Jobs/{YEAR} chain exists (Graph does not auto-create intermediates).
  await ensureFolder(driveId, '', '2.Jobs');
  await ensureFolder(driveId, '2.Jobs', year);

  const parentPath = `2.Jobs/${year}/${args.parentFolderName}`;
  const parentId = await ensureFolder(driveId, `2.Jobs/${year}`, args.parentFolderName);

  const subfolders: { name: string; id: string }[] = [];
  for (const name of JOB_SUBFOLDERS) {
    subfolders.push({ name, id: await ensureFolder(driveId, parentPath, name) });
  }
  return { parentPath, parentId, subfolders };
}

/** Upload a small file (< ~250 MB single PUT) to a path under the drive root. */
export async function uploadFile(
  filePath: string,        // e.g. "2.Jobs/2026/VAL261054 - .../4. CLIENT BILLING (Invoice, LOE)/LOE.pdf"
  bytes: Uint8Array | ArrayBuffer,
  contentType: string,
): Promise<{ id: string; webUrl: string }> {
  const { driveId } = await resolveSharePointIds();
  const res = await graphFetch(`/drives/${driveId}/root:/${encodePath(filePath)}:/content`, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    // Deno fetch accepts Uint8Array/ArrayBuffer at runtime; the cast sidesteps a
    // strict ArrayBufferLike-vs-ArrayBuffer lib typing mismatch (no runtime effect).
    body: bytes as unknown as BodyInit,
  });
  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`upload failed (${res.status}): ${await res.text()}`);
  }
  const item = await res.json();
  return { id: item.id, webUrl: item.webUrl };
}

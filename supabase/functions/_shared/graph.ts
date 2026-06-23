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
  fromName?: string;          // sender DISPLAY name override (cosmetic); address stays = mailbox
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
  if (args.fromName) message.from = { emailAddress: { name: args.fromName, address: args.mailbox } };
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
 * CONNECT-or-create a folder at a path under the drive root.
 * Connect is the dominant path: GET first and return the EXISTING folder if present
 * (the client manages their own per-job folders — we attach to theirs, never duplicate).
 * Only POST (conflictBehavior:fail) when the folder is genuinely absent (404).
 * Returns the driveItem id + whether we created it (created:false = connected to existing).
 */
export async function ensureFolder(
  driveId: string,
  parentPath: string,
  name: string,
): Promise<{ id: string; created: boolean; webUrl?: string }> {
  const fullPath = parentPath ? `${parentPath}/${name}` : name;

  const getRes = await graphFetch(`/drives/${driveId}/root:/${encodePath(fullPath)}`);
  if (getRes.ok) {
    const item = await getRes.json();
    return { id: item.id, created: false, webUrl: item.webUrl }; // connected to existing
  }
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
  if (postRes.status === 201) {
    const item = await postRes.json();
    return { id: item.id, created: true, webUrl: item.webUrl };
  }
  if (postRes.status === 409) {
    // race: created between our GET and POST — re-read + treat as connected (no duplicate)
    const retry = await graphFetch(`/drives/${driveId}/root:/${encodePath(fullPath)}`);
    if (retry.ok) {
      const item = await retry.json();
      return { id: item.id, created: false, webUrl: item.webUrl };
    }
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
  jobNumber?: string;        // FIX 2 (2026-06-23): the bare VAL number, for prefix-match dedupe (see below)
}

export interface JobFolderResult {
  parentPath: string;
  parentId: string;
  parentCreated: boolean;        // false = connected to the client's existing folder
  parentWebUrl?: string;
  subfolders: { name: string; id: string; created: boolean; webUrl?: string }[];
  connectedOnly: boolean;        // true = nothing was created (pure connect to existing)
}

/**
 * CONNECT to (or, only if absent, create) the per-job folder tree:
 * 2.Jobs/{YEAR}/{parentFolderName}/ + the 5 subfolders.
 *
 * The client manages their own per-job folders; the generated parent name matches their
 * live convention, so the dominant path resolves + attaches to THEIR existing folder and
 * surfaces the existing subfolders — never a duplicate parallel set. `created` flags show
 * exactly what (if anything) had to be made. Idempotent — safe to re-run (dashboard button).
 */
export async function createJobFolders(args: JobFolderArgs): Promise<JobFolderResult> {
  const { driveId } = await resolveSharePointIds();
  const year = String(args.year);

  // Connect/ensure the 2.Jobs/{YEAR} chain (Graph does not auto-create intermediates).
  await ensureFolder(driveId, '', '2.Jobs');
  await ensureFolder(driveId, '2.Jobs', year);

  // FIX 2 (2026-06-23) — prefix-match dedupe. The button used to compose the parent name client-side
  // with a different join (comma) than the canonical server builder (space), so the exact-path GET in
  // ensureFolder missed the client's existing folder and created a DUPLICATE set. Even with the name now
  // composed one canonical way, the client's live folder can carry a slightly different description tail.
  // So: if a folder under 2.Jobs/{YEAR} already starts with "{jobNumber} - ", CONNECT to THAT one
  // (whatever its tail) instead of creating a parallel "{jobNumber} - {our description}". Only when no
  // "{jobNumber} - *" exists do we fall through to creating with our composed name.
  let parentFolderName = args.parentFolderName;
  if (args.jobNumber) {
    const prefix = `${args.jobNumber} - `;
    const siblings = await listFolderNames(driveId, `2.Jobs/${year}`);
    const existingMatch = siblings.find((n) => n.startsWith(prefix));
    if (existingMatch) parentFolderName = existingMatch; // attach to the client's existing folder, no dup
  }

  const parentPath = `2.Jobs/${year}/${parentFolderName}`;
  const parent = await ensureFolder(driveId, `2.Jobs/${year}`, parentFolderName);

  const subfolders: { name: string; id: string; created: boolean; webUrl?: string }[] = [];
  for (const name of JOB_SUBFOLDERS) {
    const sub = await ensureFolder(driveId, parentPath, name);
    subfolders.push({ name, id: sub.id, created: sub.created, webUrl: sub.webUrl });
  }
  const connectedOnly = !parent.created && subfolders.every((s) => !s.created);
  return {
    parentPath,
    parentId: parent.id,
    parentCreated: parent.created,
    parentWebUrl: parent.webUrl,
    subfolders,
    connectedOnly,
  };
}

/**
 * Canonical job-folder inputs — the SINGLE source so the folder name built at
 * intake (create-job-folders) is byte-identical to the one used at signing
 * (upload-loe-to-sharepoint). Parent folder = "{jobNumber} - {propertyDescription}".
 * property_address already carries street + city + province.
 */
export function jobFolderInputs(job: {
  job_number: string;
  property_name?: string | null;
  property_address?: string | null;
  created_at?: string | null;
}): { jobNumber: string; propertyDescription: string; year: number } {
  const propertyDescription = [job.property_name, job.property_address]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  const year = job.created_at ? new Date(job.created_at).getUTCFullYear() : new Date().getUTCFullYear();
  return { jobNumber: job.job_number, propertyDescription, year };
}

/** True iff a folder exists at the given drive path (distinguishes 404 from empty). */
export async function folderExists(driveId: string, folderPath: string): Promise<boolean> {
  const res = await graphFetch(`/drives/${driveId}/root:/${encodePath(folderPath)}`);
  if (res.ok) return true;
  if (res.status === 404) return false;
  throw new Error(`folderExists check failed (${res.status}): ${await res.text()}`);
}

/** List the file/folder names directly under a drive path (empty array if the path 404s). */
export async function listFolderNames(driveId: string, folderPath: string): Promise<string[]> {
  const res = await graphFetch(`/drives/${driveId}/root:/${encodePath(folderPath)}:/children?$select=name&$top=200`);
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`listFolderNames failed (${res.status}): ${await res.text()}`);
  const j = await res.json();
  return (j.value ?? []).map((c: { name: string }) => c.name);
}

/**
 * Pick the signed-LOE filename to write, gracefully handling the client's job-to-job
 * naming variance. If a signed-LOE file ALREADY exists in the folder (either the long
 * "LOE - {parentFolderName} - signed.pdf" or the short "LOE - {jobNumber} - signed.pdf"
 * form, or any "LOE - ... signed" variant), REUSE that exact name (replace it — no
 * duplicate). Otherwise default to the robust long form.
 */
export function chooseSignedLoeName(existingNames: string[], jobNumber: string, parentFolderName: string): string {
  const long = `LOE - ${parentFolderName} - signed.pdf`;
  const short = `LOE - ${jobNumber} - signed.pdf`;
  if (existingNames.includes(long)) return long;
  if (existingNames.includes(short)) return short;
  const anySigned = existingNames.find((n) => /^LOE .*signed\.pdf$/i.test(n));
  return anySigned ?? long;
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

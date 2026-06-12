// QuickBooks Online (Accounting API, invoice-only) helper for the APR closing flow.
//
// Build spec (verified 2026-06-11): docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-BUILD-SPEC-2026-06-11.md
//
// Two triggers:
//   1. LOE signed   -> create Customer (if new) + Item + Invoice + SendInvoice
//   2. Invoice paid -> Payment.Create webhook -> APR downstream receipt/status
//
// INERT until Ben creates the free Intuit Developer account. qboConfigured() gates
// on QBO_CLIENT_ID/SECRET; getValidAccessToken() additionally needs a stored token
// row (produced by the one-time OAuth bootstrap). Endpoints return 503 until both exist.
//
// Refresh-token ROTATION is the load-bearing rule: every token call returns a NEW
// refresh_token and invalidates the old one. We persist it on every call (token store
// table quickbooks_tokens) — a stale copy is a hard lockout (invalid_grant).

import { createClient } from 'jsr:@supabase/supabase-js@2';
import { createHmac } from 'node:crypto';

const CLIENT_ID = Deno.env.get('QBO_CLIENT_ID') ?? '';
const CLIENT_SECRET = Deno.env.get('QBO_CLIENT_SECRET') ?? '';
const VERIFIER_TOKEN = Deno.env.get('QBO_VERIFIER_TOKEN') ?? '';
const REDIRECT_URI = Deno.env.get('QBO_REDIRECT_URI') ?? '';
const QBO_ENV = (Deno.env.get('QBO_ENV') ?? 'sandbox').toLowerCase(); // 'sandbox' | 'production'

const TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
const AUTH_URL = 'https://appcenter.intuit.com/connect/oauth2';
const SCOPE = 'com.intuit.quickbooks.accounting';
const MINOR_VERSION = '75';
const API_HOST = QBO_ENV === 'production'
  ? 'https://quickbooks.api.intuit.com'
  : 'https://sandbox-quickbooks.api.intuit.com';

/** Thrown when QBO is reachable in code but not yet usable (no creds / no token). Maps to 503. */
export class QboNotReady extends Error {
  constructor(msg: string) { super(msg); this.name = 'QboNotReady'; }
}

/** True only when the app credentials exist. Endpoints gate on this first. */
export function qboConfigured(): boolean {
  return Boolean(CLIENT_ID && CLIENT_SECRET);
}

function basicAuthHeader(): string {
  return 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
}

function sb() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

// ----- token store ----------------------------------------------------------

interface TokenRow {
  access_token: string | null;
  refresh_token: string | null;
  realm_id: string | null;
  access_expires_at: string | null;
  refresh_expires_at: string | null;
}

async function readTokenRow(): Promise<TokenRow | null> {
  const { data } = await sb().from('quickbooks_tokens').select('*').eq('id', 1).single();
  return (data as TokenRow) ?? null;
}

async function writeTokens(t: {
  access_token: string; refresh_token: string; realm_id?: string | null;
  expires_in: number; x_refresh_token_expires_in?: number;
}): Promise<void> {
  const now = Date.now();
  const update: Record<string, unknown> = {
    access_token: t.access_token,
    refresh_token: t.refresh_token, // ALWAYS persist the rotated token
    access_expires_at: new Date(now + t.expires_in * 1000).toISOString(),
    updated_at: new Date(now).toISOString(),
  };
  if (t.realm_id) update.realm_id = t.realm_id;
  if (t.x_refresh_token_expires_in) {
    update.refresh_expires_at = new Date(now + t.x_refresh_token_expires_in * 1000).toISOString();
  }
  await sb().from('quickbooks_tokens').update(update).eq('id', 1);
}

// ----- OAuth bootstrap ------------------------------------------------------

export function buildAuthUrl(state: string): string {
  const p = new URLSearchParams({
    client_id: CLIENT_ID,
    scope: SCOPE,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    state,
  });
  return `${AUTH_URL}?${p.toString()}`;
}

/** Exchange the callback `code` for the first token pair + realmId, and persist. */
export async function exchangeCodeForTokens(code: string, realmId: string): Promise<void> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': basicAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`QBO token exchange failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  await writeTokens({
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    realm_id: realmId,
    expires_in: json.expires_in,
    x_refresh_token_expires_in: json.x_refresh_token_expires_in,
  });
}

// ----- access-token lifecycle (refresh + persist rotation) ------------------

let refreshing: Promise<void> | null = null; // process-local single-flight

async function refreshAccessToken(refreshToken: string): Promise<void> {
  const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken });
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': basicAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: body.toString(),
  });
  if (!res.ok) {
    throw new Error(`QBO token refresh failed (${res.status}): ${await res.text()} — likely a rotated/stale refresh token (invalid_grant).`);
  }
  const json = await res.json();
  await writeTokens({
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    expires_in: json.expires_in,
    x_refresh_token_expires_in: json.x_refresh_token_expires_in,
  });
}

/**
 * Return a valid access token, refreshing + persisting the rotated refresh token
 * when near expiry. Throws QboNotReady if the OAuth bootstrap hasn't run.
 * NOTE: production hardening = serialize refresh across instances with a DB
 * advisory lock (spec Section 6). Process-local single-flight here covers the
 * common case; cross-instance concurrent refresh is a follow-up.
 */
export async function getValidAccessToken(): Promise<{ accessToken: string; realmId: string }> {
  if (!qboConfigured()) throw new QboNotReady('QBO not configured (QBO_CLIENT_ID/SECRET missing).');
  const row = await readTokenRow();
  if (!row?.refresh_token || !row?.realm_id) {
    throw new QboNotReady('QBO not authorized yet — run the one-time OAuth bootstrap (qbo-auth connect/callback).');
  }
  const nearExpiry = !row.access_expires_at || Date.now() > new Date(row.access_expires_at).getTime() - 120_000;
  if (nearExpiry) {
    if (!refreshing) refreshing = refreshAccessToken(row.refresh_token).finally(() => { refreshing = null; });
    await refreshing;
    const fresh = await readTokenRow();
    return { accessToken: fresh!.access_token!, realmId: fresh!.realm_id! };
  }
  return { accessToken: row.access_token!, realmId: row.realm_id };
}

// ----- data API -------------------------------------------------------------

async function qboFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const { accessToken, realmId } = await getValidAccessToken();
  const sep = path.includes('?') ? '&' : '?';
  const url = `${API_HOST}/v3/company/${realmId}/${path}${sep}minorversion=${MINOR_VERSION}`;
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  headers.set('Accept', 'application/json');
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  return fetch(url, { ...init, headers });
}

export async function createCustomer(displayName: string, email?: string): Promise<{ id: string }> {
  // Idempotent: look up by DisplayName first (survives sandbox resets).
  const q = encodeURIComponent(`select * from Customer where DisplayName = '${displayName.replace(/'/g, "\\'")}'`);
  const found = await qboFetch(`query?query=${q}`);
  if (found.ok) {
    const j = await found.json();
    const existing = j?.QueryResponse?.Customer?.[0];
    if (existing?.Id) return { id: existing.Id };
  }
  const body: Record<string, unknown> = { DisplayName: displayName };
  if (email) body.PrimaryEmailAddr = { Address: email };
  const res = await qboFetch('customer', { method: 'POST', body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`createCustomer failed (${res.status}): ${await res.text()}`);
  return { id: (await res.json()).Customer.Id };
}

/** Ensure an Item exists (default "Appraisal Services"); returns its Id. */
export async function ensureItem(name = 'Appraisal Services'): Promise<{ id: string }> {
  const q = encodeURIComponent(`select * from Item where Name = '${name.replace(/'/g, "\\'")}'`);
  const found = await qboFetch(`query?query=${q}`);
  if (found.ok) {
    const j = await found.json();
    const existing = j?.QueryResponse?.Item?.[0];
    if (existing?.Id) return { id: existing.Id };
  }
  // Creating a Service item needs an income account; resolve one of type Income.
  const acctQ = encodeURIComponent(`select * from Account where AccountType = 'Income' maxresults 1`);
  const acctRes = await qboFetch(`query?query=${acctQ}`);
  const incomeId = acctRes.ok ? (await acctRes.json())?.QueryResponse?.Account?.[0]?.Id : undefined;
  const body: Record<string, unknown> = { Name: name, Type: 'Service' };
  if (incomeId) body.IncomeAccountRef = { value: incomeId };
  const res = await qboFetch('item', { method: 'POST', body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`ensureItem failed (${res.status}): ${await res.text()}`);
  return { id: (await res.json()).Item.Id };
}

export async function createInvoice(args: {
  customerId: string; itemId: string; amount: number; billEmail?: string; description?: string;
}): Promise<{ id: string; syncToken: string }> {
  const body = {
    CustomerRef: { value: args.customerId },
    Line: [{
      Amount: args.amount,
      DetailType: 'SalesItemLineDetail',
      Description: args.description,
      SalesItemLineDetail: { ItemRef: { value: args.itemId }, Qty: 1, UnitPrice: args.amount },
    }],
    ...(args.billEmail ? { BillEmail: { Address: args.billEmail } } : {}),
  };
  const res = await qboFetch('invoice', { method: 'POST', body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`createInvoice failed (${res.status}): ${await res.text()}`);
  const inv = (await res.json()).Invoice;
  return { id: inv.Id, syncToken: inv.SyncToken };
}

export async function sendInvoice(invoiceId: string, sendTo?: string): Promise<void> {
  const path = sendTo
    ? `invoice/${invoiceId}/send?sendTo=${encodeURIComponent(sendTo)}`
    : `invoice/${invoiceId}/send`;
  const res = await qboFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' }, // SendInvoice quirk — no JSON body
  });
  if (!res.ok) throw new Error(`sendInvoice failed (${res.status}): ${await res.text()}`);
}

export async function recordPayment(args: {
  customerId: string; invoiceId: string; amount: number;
}): Promise<{ id: string }> {
  const body = {
    TotalAmt: args.amount,
    CustomerRef: { value: args.customerId },
    Line: [{ Amount: args.amount, LinkedTxn: [{ TxnId: args.invoiceId, TxnType: 'Invoice' }] }],
  };
  const res = await qboFetch('payment', { method: 'POST', body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`recordPayment failed (${res.status}): ${await res.text()}`);
  return { id: (await res.json()).Payment.Id };
}

export async function getPayment(paymentId: string): Promise<any> {
  const res = await qboFetch(`payment/${paymentId}`);
  if (!res.ok) throw new Error(`getPayment failed (${res.status}): ${await res.text()}`);
  return (await res.json()).Payment;
}

// ----- webhook signature (Trigger 2) ----------------------------------------

/** Verify the intuit-signature header: base64( HMAC_SHA256(rawBody, verifierToken) ). */
export function verifyIntuitSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!VERIFIER_TOKEN || !signatureHeader) return false;
  const computed = createHmac('sha256', VERIFIER_TOKEN).update(rawBody, 'utf8').digest('base64');
  // constant-time-ish compare
  if (computed.length !== signatureHeader.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) diff |= computed.charCodeAt(i) ^ signatureHeader.charCodeAt(i);
  return diff === 0;
}

export const qboEnvInfo = () => ({ env: QBO_ENV, apiHost: API_HOST, configured: qboConfigured() });

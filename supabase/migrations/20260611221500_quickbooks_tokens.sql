-- QuickBooks Online OAuth token store (single-row).
-- The refresh token ROTATES on every token call (exchange OR refresh) and a stale
-- copy is a hard lockout, so it must live in durable storage and be overwritten
-- atomically on each rotation. Build spec:
-- docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-BUILD-SPEC-2026-06-11.md (Section 1 + 9A).

create table if not exists public.quickbooks_tokens (
  id integer primary key default 1,
  access_token text,
  refresh_token text,
  realm_id text,
  access_expires_at timestamptz,
  refresh_expires_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint quickbooks_tokens_singleton check (id = 1)
);

-- Edge functions use the service role; lock the table down from anon/auth clients.
alter table public.quickbooks_tokens enable row level security;

-- Seed the single row so callers can UPDATE without an upsert race.
insert into public.quickbooks_tokens (id) values (1)
on conflict (id) do nothing;

-- Phase 2 / Trigger 2.3 — bulletproof SERVER-SIDE ClickUp auto-create on form submit.
--
-- WHAT: AFTER INSERT on public.job_submissions fires the `create-clickup-task` edge
-- function via pg_net (net.http_post) with body {"jobId": NEW.id}. Because it runs in
-- the database on the row insert itself — NOT from the browser — it is bulletproof: the
-- card lands even if the client's tab dies the instant after submit.
--
-- WHY a rewrite (a trigger of this name already existed): the prior version inlined a
-- hardcoded anon JWT literal in the function body. This version pulls the auth key from
-- Vault (vault.decrypted_secrets), with the anon JWT kept ONLY as a last-resort fallback
-- so the trigger never silently no-ops if Vault is unreadable. The edge function itself
-- is idempotent (returns the existing task when job.clickup_task_id is set), so a double
-- fire is harmless — and we key the trigger to INSERT ONLY so later edits never re-fire.
--
-- TARGET LIST: not set here. The edge function resolves its list from the CLICKUP_LIST_ID
-- Supabase secret (set to the canonical BC test list 901709622357 — "APR Test - Valta
-- Mirror", team 8555561). Keeping the list out of SQL means the test→prod cutover is a
-- secret change, not a migration. Field resolution is byName, so the same code targets the
-- Valta prod list once its template/fields exist.
--
-- EXTENSION: pg_net 0.14.0 is already enabled (schema `net`). No CREATE EXTENSION needed.

-- 1. Store the service-role key in Vault (idempotent). The edge function is deployed with
--    verify_jwt=true; a service-role Bearer passes verification. We upsert by name so
--    re-running the migration refreshes the value rather than erroring on a duplicate.
DO $$
DECLARE
  v_key text := current_setting('app.settings.service_role_key', true);
BEGIN
  -- app.settings.service_role_key is not set during `db push`; this block is a no-op then.
  -- The key is seeded out-of-band (see migration tail comment) so we do NOT bake a literal
  -- service-role key into version control. If absent, the function's anon fallback applies.
  IF v_key IS NOT NULL AND length(v_key) > 0 THEN
    IF EXISTS (SELECT 1 FROM vault.secrets WHERE name = 'clickup_trigger_auth_key') THEN
      PERFORM vault.update_secret(
        (SELECT id FROM vault.secrets WHERE name = 'clickup_trigger_auth_key'),
        v_key
      );
    ELSE
      PERFORM vault.create_secret(v_key, 'clickup_trigger_auth_key',
        'Bearer key used by trigger_clickup_task_creation to call create-clickup-task');
    END IF;
  END IF;
END $$;

-- 2. Rewrite the trigger function: read the auth key from Vault, fall back to the project
--    anon JWT (valid JWT → passes verify_jwt) so the call is never unauthenticated.
CREATE OR REPLACE FUNCTION public.trigger_clickup_task_creation()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public, vault, net
AS $function$
DECLARE
  request_id bigint;
  auth_key text;
  anon_fallback text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ';
BEGIN
  -- Prefer the Vault-stored key; fall back to the anon JWT (still a valid JWT for verify_jwt).
  BEGIN
    SELECT decrypted_secret INTO auth_key
    FROM vault.decrypted_secrets
    WHERE name = 'clickup_trigger_auth_key'
    LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    auth_key := NULL;
  END;

  IF auth_key IS NULL OR length(auth_key) = 0 THEN
    auth_key := anon_fallback;
  END IF;

  SELECT net.http_post(
    url     := 'https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/create-clickup-task',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || auth_key
    ),
    body    := jsonb_build_object('jobId', NEW.id)
  ) INTO request_id;

  RETURN NEW;
END;
$function$;

-- 3. (Re)bind the INSERT-only trigger. Drop-then-create makes the migration idempotent and
--    guarantees AFTER INSERT semantics (no UPDATE re-fire).
DROP TRIGGER IF EXISTS auto_create_clickup_task ON public.job_submissions;
CREATE TRIGGER auto_create_clickup_task
  AFTER INSERT ON public.job_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_clickup_task_creation();

-- Seed-the-vault note (run once, out-of-band — NOT committed with a literal key):
--   select vault.create_secret('<SERVICE_ROLE_KEY>', 'clickup_trigger_auth_key', 'clickup trigger auth');
-- Until seeded, the anon-JWT fallback keeps the trigger fully functional.

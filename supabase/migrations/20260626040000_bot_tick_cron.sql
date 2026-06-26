-- Schedule bot-tick so bots talk on their own. pg_net POSTs to the public
-- (--no-verify-jwt) edge function; the function is server-authoritative and
-- cost-gated, so no auth/key is needed here. cron.schedule upserts by name,
-- so re-running this migration just refreshes the job.

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'tahc-bot-tick',
  '30 seconds',
  $$
  select net.http_post(
    url := 'https://tagiuunfgwdbaqeojmgo.supabase.co/functions/v1/bot-tick',
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  $$
);

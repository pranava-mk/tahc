-- Drive rotation server-side so rooms rotate at 11 min even when no client is
-- connected to trigger it. end-session is server-authoritative (only rotates
-- once the session has run its full length). cron.schedule upserts by name.

select cron.schedule(
  'tahc-end-session',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://tagiuunfgwdbaqeojmgo.supabase.co/functions/v1/end-session',
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  $$
);

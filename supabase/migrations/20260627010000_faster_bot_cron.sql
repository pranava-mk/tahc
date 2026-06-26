-- Speed up the chat: tick bots every 15s instead of 30s (cron.schedule upserts
-- by name). Combined with the shorter per-bot cadence, the room feels live.
select cron.schedule(
  'tahc-bot-tick',
  '15 seconds',
  $$
  select net.http_post(
    url := 'https://tagiuunfgwdbaqeojmgo.supabase.co/functions/v1/bot-tick',
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  $$
);

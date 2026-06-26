-- Per-session conversation topic. Set when a session is created; AI bots use it
-- to keep the room loosely on-theme. Not exposed in the UI.
alter table public.sessions add column if not exists topic text;

-- room_participants — public, sanitized view of the crowd.
-- Hides is_bot / bot_type / bot_state / client_token so the frontend can never
-- tell bots from real users (core deception). PG15+ views default to
-- security_invoker = false, so this runs with owner rights and bypasses the
-- participants RLS — anon sees the roster, but only the safe columns exist here.

create or replace view public.room_participants as
  select id, session_id, display_name, joined_at, left_at
  from public.participants
  where left_at is null;

grant select on public.room_participants to anon, authenticated;

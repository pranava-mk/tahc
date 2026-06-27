-- Server-side flood guard (the client throttle can be bypassed; this can't).
-- Generous: blocks only deliberate flooding, never normal chatting. Counts
-- messages per participant in a short window. SECURITY DEFINER so it can read
-- regardless of the caller's RLS.
create or replace function public.rate_limit_messages()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count int;
begin
  select count(*) into recent_count
  from public.messages
  where participant_id = new.participant_id
    and sent_at > now() - interval '10 seconds';

  if recent_count >= 25 then
    raise exception 'rate_limited: too many messages';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_rate_limit_messages on public.messages;
create trigger trg_rate_limit_messages
  before insert on public.messages
  for each row execute function public.rate_limit_messages();

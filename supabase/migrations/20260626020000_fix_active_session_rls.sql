-- Fix: messages RLS referenced `(select id from sessions where is_active)`, but
-- the sessions table has its own creator-only RLS — so for an anon user that
-- subquery returns zero rows and ALL message reads/inserts were denied.
-- A SECURITY DEFINER function checks active-session status without tripping
-- sessions RLS.

create or replace function public.is_session_active(sid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.sessions where id = sid and is_active);
$$;

revoke all on function public.is_session_active(uuid) from public;
grant execute on function public.is_session_active(uuid) to anon, authenticated;

drop policy if exists "user_read_active_session_messages" on public.messages;
create policy "user_read_active_session_messages" on public.messages
  for select using (
    public.is_session_active(session_id) or auth.email() = 'pranavamk07@gmail.com'
  );

drop policy if exists "user_insert_messages" on public.messages;
create policy "user_insert_messages" on public.messages
  for insert with check ( public.is_session_active(session_id) );

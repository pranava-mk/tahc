-- tahc — initial schema, RLS, indexes, realtime
-- Concept: single global ephemeral chat room. Real users + 6 bots.
-- Sessions forced to 11 min, then archived (creator-only) and recreated.
-- See PLAN.md for full design rationale.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.sessions (
  id          uuid        primary key default gen_random_uuid(),
  started_at  timestamptz not null default now(),
  ended_at    timestamptz,
  is_active   boolean     not null default true,
  user_count  integer     not null default 0,
  archive     jsonb
);

create table if not exists public.participants (
  id            uuid        primary key default gen_random_uuid(),
  session_id    uuid        not null references public.sessions(id) on delete cascade,
  display_name  text        not null,
  is_bot        boolean     not null default false,
  bot_type      text,                       -- 'scripted' | 'ai'
  joined_at     timestamptz not null default now(),
  left_at       timestamptz,
  client_token  text,                       -- anon token for real users
  bot_state     jsonb                       -- { next_speak_at, personality_id, messages_sent }
);

create table if not exists public.messages (
  id              uuid        primary key default gen_random_uuid(),
  session_id      uuid        not null references public.sessions(id) on delete cascade,
  participant_id  uuid        not null references public.participants(id),
  display_name    text        not null,     -- denormalized for read speed
  content         text        not null,
  type            text        not null default 'chat',   -- 'chat' | 'emote' | 'info'
  sent_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

-- one logical active room: fast lookup of the current session
create index if not exists idx_sessions_active on public.sessions (is_active) where is_active;

create index if not exists idx_participants_session on public.participants (session_id);
create index if not exists idx_participants_token   on public.participants (client_token);
-- bot-tick: find due bots in active session
create index if not exists idx_participants_bot_due on public.participants ((bot_state->>'next_speak_at')) where is_bot;

create index if not exists idx_messages_session_sent on public.messages (session_id, sent_at);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.sessions     enable row level security;
alter table public.participants enable row level security;
alter table public.messages     enable row level security;

-- sessions: creator (by email) reads everything; nobody else reads directly.
-- (Edge functions use the service role key and bypass RLS.)
create policy "creator_read_sessions" on public.sessions
  for select using (auth.email() = 'pranavamk07@gmail.com');

-- participants: a user reads only their own row (matched by client_token claim);
-- creator reads all.
create policy "user_read_own_participant" on public.participants
  for select using (
    client_token = (current_setting('request.jwt.claims', true)::json->>'client_token')
    or auth.email() = 'pranavamk07@gmail.com'
  );

-- messages: users read messages in the current active session; creator reads all.
create policy "user_read_active_session_messages" on public.messages
  for select using (
    session_id in (select id from public.sessions where is_active)
    or auth.email() = 'pranavamk07@gmail.com'
  );

-- messages: users may insert into the active session.
-- Participant validity is enforced by the join-session edge function.
create policy "user_insert_messages" on public.messages
  for insert with check (
    session_id in (select id from public.sessions where is_active)
  );

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------

alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.participants;
alter publication supabase_realtime add table public.messages;

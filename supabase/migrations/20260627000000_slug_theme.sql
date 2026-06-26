-- Slug-keyed ephemeral rooms + per-session theme.
-- slug: the path segment of an invite link (/<slug>); a slug is reusable as a
--       fresh room only after its previous session is >11h old (enforced in
--       join-session). theme: the scenario all bots roleplay for the session.
alter table public.sessions add column if not exists slug  text;
alter table public.sessions add column if not exists theme text;

create index if not exists idx_sessions_slug on public.sessions (slug, started_at desc);

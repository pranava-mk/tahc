# Backend

## What this is for
Supabase backend for tahc. Slug-keyed ephemeral rooms: each `/<slug>` is its own 11-min themed room (7 real-user cap + 6 AI bots), archived + ended on expiry. Deno edge functions + Postgres/RLS + Realtime + pg_cron. Project ref `tagiuunfgwdbaqeojmgo`.

## Folder contents
| Path | What it holds |
|------|---------------|
| `functions/join-session/` | Join/create a slug room. Active slug → join; ended <11h ago → `slug_expired` (410); else create (theme + 6 bots). 7-user cap. Human gets an ODD-length name |
| `functions/end-session/` | Ends ALL expired active rooms: archive→`sessions.archive`, delete msgs, retire participants, `is_active=false`. No recreate |
| `functions/bot-tick/` | Drives bots across all LIVE rooms. Parallel AI gen per room, themed personas, cost-gated |
| `functions/_shared/` | `names.ts` (handle pool + parity: generateName(ODD/EVEN), pickBotNames), `themes.ts` (18 themes, pickTheme), `botPersonalities.ts` (seedBotRows, scriptedFallback, nextSpeakAt, CADENCE), `voidaiClient.ts` (gemini-2.5-flash themed group-chat prompt) |
| `migrations/*.sql` | Schema, RLS, view, RLS fix, slug+theme cols, crons (timestamped) |
| `config.toml` | supabase init |

## Data model
- `sessions` (id, started_at, ended_at, is_active, archive jsonb, **slug**, **theme**)
- `participants` (id, session_id, display_name, is_bot, bot_type, joined_at, left_at, client_token, bot_state jsonb={next_speak_at, messages_sent})
- `messages` (id, session_id, participant_id, display_name, content, type, sent_at)
- View `room_participants` — sanitized crowd (no is_bot); how frontend reads the roster.

## Covert channel
Human names ODD length, bot names EVEN. Same pool (`names.ts`). join-session→generateName(ODD); seedBotRows→pickBotNames (EVEN). Spot humans by counting letters.

## Liveliness
- cron `tahc-bot-tick` every 15s; `tahc-end-session` every minute.
- Pre-warm: first 3 bots due within ~3s; client pokes bot-tick on entry + after each human send.
- bot-tick: AI only for rooms with human activity in last 5 min; parallel gen; MAX_PER_ROOM_TICK=3, GLOBAL_CAP=10.
- voidaiClient: 2 models (gemini-2.5-flash→gpt-4o-mini), no retry, 4.5s timeout → slow voidai fails fast to natural fallback (`scriptedFallback`).

## Routing table
| Task | Read | Skip | Skill |
|------|------|------|-------|
| Join / slug / cooldown / cap / human name | `functions/join-session/index.ts` + `_shared/names.ts` + `_shared/themes.ts` | — | `supabase:edge-function-new` |
| Rotation / archive | `functions/end-session/index.ts` | — | — |
| Bot pacing / cost / parallel | `functions/bot-tick/index.ts` | — | — |
| Bot voice / prompt / model / fallback | `_shared/voidaiClient.ts` + `_shared/botPersonalities.ts` | — | — |
| Themes / names | `_shared/themes.ts` / `_shared/names.ts` | — | — |
| Schema / RLS change | new `migrations/<ts>_<slug>.sql` | edit applied migrations | `supabase:types-gen` |

## Conventions / gotchas
- **RLS sessions trap**: never subquery `sessions` in a policy (creator-only RLS shadows it for anon). Use `is_session_active(uuid)` SECURITY DEFINER fn.
- **Hide bots**: never expose `is_bot`. Frontend reads `room_participants` view only. Realtime on a VIEW isn't supported — subscribe to `messages` table; users load on join.
- Deploy: `supabase functions deploy <name> --no-verify-jwt` (all 3 public, server-authoritative). Migrations: `supabase db push`; never edit an applied migration. pg_cron: `'<N> seconds'` only for N<60, else cron syntax.
- Secrets via `supabase secrets set`: `VOIDAI_API_KEY` (+ optional `VOIDAI_MODEL`, `SESSION_LENGTH_SECONDS`). NEVER in git. Rotating the voidai key → re-set the secret.
- Admin/reset = service_role REST (never commit the key). Mass deletes are guarded.

## Available skills
| Skill | When to use |
|-------|-------------|
| `supabase:edge-function-new` | New Deno edge function |
| `supabase:types-gen` | TS types from schema |
| `verify` | Confirm a change end-to-end in browser |

# Backend

## What this is for
Supabase backend for tahc. Single global ephemeral chat room: 7 real-user cap + 6 bots, 11-min sessions, realtime, archived + rotated. Deno edge functions + Postgres/RLS + Realtime + pg_cron. Project ref `tagiuunfgwdbaqeojmgo`. Full architecture: root `PLAN.md`.

## Folder contents
| Path | What it holds |
|------|---------------|
| `functions/join-session/` | Find/create active session (+ random topic, seed 6 bots staggered), enforce 7 real-user cap, issue anon `client_token` + display_name. Public (`--no-verify-jwt`) |
| `functions/end-session/` | Server-authoritative rotation: archive transcript → `sessions.archive`, delete msgs, retire participants, end session, hand off NEW session only if real users present |
| `functions/bot-tick/` | Fire due bots: 4 scripted (free), 2 AI (voidai). Cost-gated |
| `functions/_shared/` | `botPersonalities.ts` (6 bots, scriptedReply, seedBotRows), `displayNames.ts`, `topics.ts` (30 topics), `voidaiClient.ts` (gemini-2.5-flash, 5s timeout, throws→fallback) |
| `migrations/*.sql` | Schema, RLS, view, RLS fix, topic col, 2 crons (timestamped) |
| `config.toml` | supabase init config |
| `.temp/` | CLI state (gitignored) |

## Data model
- `sessions` (id, started_at, ended_at, is_active, user_count, archive jsonb, topic)
- `participants` (id, session_id, display_name, is_bot, bot_type, joined_at, left_at, client_token, bot_state jsonb={personality_id,next_speak_at,messages_sent})
- `messages` (id, session_id, participant_id, display_name, content, type, sent_at)
- View `room_participants` — sanitized crowd (no is_bot/client_token); how frontend reads roster.

## Routing table
| Task | Read | Skip | Skill |
|------|------|------|-------|
| Edit join/cap/identity | `functions/join-session/index.ts` + `_shared/` | — | `supabase:edge-function-new` |
| Edit rotation/archive | `functions/end-session/index.ts` | — | — |
| Edit bot behaviour | `functions/bot-tick/index.ts` + `_shared/botPersonalities.ts` + `_shared/voidaiClient.ts` | — | — |
| Add/change bots or topics | `_shared/botPersonalities.ts` / `_shared/topics.ts` | — | — |
| Schema/RLS change | new `migrations/<ts>_<slug>.sql` | edit applied migrations | `supabase:types-gen` |
| Frontend ↔ DB contract | this file + `../src/hooks/useRoom.js` | — | — |

## Conventions / gotchas
- **RLS sessions trap**: policies must NOT subquery `sessions` (creator-only RLS shadows it for anon). Use `is_session_active(uuid)` SECURITY DEFINER fn. See `20260626020000`.
- **Hide bots**: never expose `is_bot` to client. Frontend reads `room_participants` view only.
- Functions deploy: `supabase functions deploy <name> --no-verify-jwt` (all 3 are public; server-authoritative).
- Migrations: `supabase db push`. Never edit an applied migration (won't re-run) — add a new one. pg_cron schedule: `'<N> seconds'` only for N<60, else cron syntax `* * * * *`.
- Crons: `tahc-bot-tick` 30s, `tahc-end-session` 1min. Call public function URLs, no key embedded.
- Secrets: `VOIDAI_API_KEY` (+ optional `VOIDAI_MODEL`, `SESSION_LENGTH_SECONDS`) via `supabase secrets set`. NEVER in git/code. `.env.local` (anon key) gitignored.
- Admin/reset = service_role REST (never commit the key). Mass deletes are guarded.
- Status: voidai AI bots WORKING (gemini-2.5-flash, key in secret). If a call fails, scripted fallback. Failures logged `[voidai] ...` to function logs (dashboard). Old keys rotate → must update the `VOIDAI_API_KEY` secret.

## Available skills
| Skill | When to use |
|-------|-------------|
| `supabase:edge-function-new` | Scaffold a new Deno edge function |
| `supabase:types-gen` | Generate TS types from DB schema |
| `verify` | Confirm a backend change end-to-end in browser |

## Suggested skills (not yet built)
| Skill name | Trigger |
|------------|---------|
| supabase-migrate | Author + push a migration with the applied-immutability + cron-syntax rules baked in |
| room-reset | Safely deactivate the active session (dev cleanup) |

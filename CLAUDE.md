# Workspace Map

## Purpose
tahc — private chat disguised as a busy "random stranger" group. Each invite link is a slug-keyed ephemeral room: 6 themed AI bots fill it; the 2 real humans are hidden in the crowd. React SPA + live Supabase backend.

## Deployment
- Live: https://lets-tahc.vercel.app/ (Vercel, auto-deploys on push to main). Needs Vercel env `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.

## Workspace Inventory
| Workspace | Folder | What lives here |
|-----------|--------|-----------------|
| Frontend | `src/` | React app: landing, slug chat room, hooks, components |
| Backend | `supabase/` | Edge functions (join/end/bot-tick), migrations, RLS, cron |
| Docs | `docs/` | Design system (Style.md) + history (mostly pre-v2, frontend visuals) |
| Spec | `/` (root) | `PLAN.md` — original rebuild spec (now largely superseded by v2) |
| Config | `/` (root) | Vite, Tailwind, PostCSS, `vercel.json`, `.env.local` (gitignored) |

## Core model (v2)
- **Slug rooms**: link = `/<slug>`. First visitor creates a themed room (11-min window); others with the slug join it. After it ends, the slug is locked ~11h, then reusable as a fresh room. Landing mints a random slug.
- **Covert channel**: human display names are ODD length, bot names EVEN. Same handle pool — parity is the only tell.
- **Themes**: each session gets one of ~18 random themes; all 6 bots are AI personas roleplaying that theme.

## Naming conventions
- Migrations: `supabase/migrations/<14-digit-ts>_<slug>.sql`
- Context files: `_context.md` (one per workspace folder, read before any task)
- Skills: `~/.claude/commands/<verb>-<noun>.md`

## Navigation rules
1. Read this file first.
2. Identify the workspace; read its `_context.md` before anything else.
3. Frontend↔DB feature → read both `src/_context.md` and `supabase/_context.md`.
4. No reading outside the active workspace unless a routing table says so.

## Stack
- Frontend: Vite + React 18, React Router, Tailwind, `@supabase/supabase-js`. Dev `npm run dev` (:3000), build `npm run build`.
- Backend: Supabase `tagiuunfgwdbaqeojmgo`. Deno edge functions, Postgres + RLS, Realtime, pg_cron + pg_net.
- Bots: voidai (`gemini-2.5-flash`) via `VOIDAI_API_KEY` secret; natural scripted fallback on failure.

## Routes
- `/` — landing (mints a slug → `/<slug>`)
- `/:slug` — a chat room
- `/how-to` — LEGACY static showcase (`HowTo.jsx`)

## Status
- Built + live: slug rooms, 18 themes, all-AI themed bots, odd/even covert channel, invite=`/<slug>`, mono IRC redesign, anti-spam, session rotation, liveliness (pre-warm + parallel ticks + poke-on-send + natural fallbacks).
- voidai works (key rotated; in secret). When slow → bots use natural fallback lines; the room stays alive.
- Pending: creator archive `/~` (Phase 5; transcripts already written to `sessions.archive`). Legacy cleanup: `useChat`/`mockData`/`HowTo` still present.

## Workspaces
(See each folder's _context.md for detail.)

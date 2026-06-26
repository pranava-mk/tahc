# Workspace Map

## Purpose
tahc — private 2-person chat disguised as busy "random stranger" group; 6 AI/scripted bots fill room. React SPA + live Supabase backend (ephemeral 11-min sessions, realtime, bot engine).

## Workspace Inventory
| Workspace | Folder | What lives here |
|-----------|--------|-----------------|
| Frontend | `src/` | React app wired to Supabase: chat UI, hooks, pages, styles, utils |
| Backend | `supabase/` | Edge functions (join/end/bot-tick), migrations, RLS, cron, config |
| Docs | `docs/` | Design system (Style.md), feature + impl history |
| Spec | `/` (root) | `PLAN.md` = full rebuild architecture (source of truth for backend) |
| Config | `/` (root) | Vite, Tailwind, PostCSS, `vercel.json`, `.env.local` (gitignored) |

## Naming conventions
- Dated assets:   YYYY-MM-DD_<slug>.<ext>
- Migrations:     `supabase/migrations/<14-digit-ts>_<slug>.sql`
- Context files:  _context.md  (one per workspace folder, read before any task)
- Skills:         ~/.claude/commands/<verb>-<noun>.md

## Navigation rules
1. Read this file first.
2. Identify workspace for task.
3. Read that workspace's _context.md before anything else.
4. Cross-workspace task (e.g. new feature touching UI + DB) → read all relevant _context.md + `PLAN.md`.
5. No reading outside active workspace unless routing table says so.

## Stack
- Frontend: Vite + React 18, React Router, Tailwind, `@supabase/supabase-js`. Dev `npm run dev` → :3000. Build `npm run build`.
- Backend: Supabase project `tagiuunfgwdbaqeojmgo`. Deno edge functions, Postgres + RLS, Realtime, pg_cron + pg_net.
- Bots AI: voidai (`gemini-2.5-flash`) via `VOIDAI_API_KEY` function secret. Scripted fallback always.

## Deployment
- Live: https://lets-tahc.vercel.app/ (Vercel, SPA). Needs Vercel env `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.

## Routes
- `/` — landing ("drop into a live conversation")
- `/chat` — live ephemeral chat (`src/pages/Chat.jsx`)
- `/how-to` — LEGACY static showcase (`src/pages/HowTo.jsx`, slated for removal)
- `/~` — creator archive (Phase 5, not built)

## Status
- Built: Phase 1-4 (backend, live chat + realtime, session rotation, bot engine + random topic + cron).
- Deployed to Vercel (above).
- voidai AI bots WORKING: gemini-2.5-flash via `VOIDAI_API_KEY` secret (key was rotated; new one in secret). Verified — `echo` produced a contextual reply referencing the human msg + session topic. Client hardened (retry + model fallback gemini-2.5-flash→gpt-4o-mini→deepseek-v3 + logs ref_id). `MAX_AI_CALLS_PER_TICK=1` (cost cap; tunable in bot-tick). Scripted fallback always on if a call fails.
- Pending: Phase 5 archive `/~`; Phase 6 polish (remove legacy `useChat`/`mockData`/`HowTo`, fix old `/nick`/`/whisper` hints in ChatInput).

## Workspaces
(See each folder's _context.md for detail.)

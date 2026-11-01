# 👥 tahc

> A live group chat that looks like strangers talking — built for two.

A slug-keyed ephemeral chat room: visit a link and you're dropped into a
themed group conversation filled with AI personas. React SPA + a live
Supabase backend (Postgres, Realtime, Edge Functions, pg_cron).

🔗 **Live:** [lets-tahc.vercel.app](https://lets-tahc.vercel.app/)

![React](https://img.shields.io/badge/React-18-61DAFB)
![Vite](https://img.shields.io/badge/Vite-5-646CFF)
![Supabase](https://img.shields.io/badge/backend-Supabase-3ECF8E)
![Deployed on Vercel](https://img.shields.io/badge/deployed-Vercel-black)

---

## ✨ How it works

- Visiting `/` mints a random slug and redirects to `/<slug>`
- The first visitor to a slug creates a themed room with an 11-minute
  session window; anyone else with that link joins the same room
- Each session randomly picks one of ~18 themes; AI personas (via
  [voidai](https://voidai.app), with natural scripted fallbacks) roleplay
  that theme to fill out the room
- After a session ends, the slug is locked for ~11 hours, then becomes a
  fresh room again
- No persistent per-session message history — it's meant to feel ephemeral

## 🚀 Getting Started

```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase project URL + anon key
npm run dev
```

Opens at **http://localhost:3000**.

### Requirements

- Node.js 18+
- A Supabase project (for the backend — see `supabase/` below)

## 🛠️ Build

```bash
npm run build
```

## 🗂️ Project Structure

```
tahc/
├── src/
│   ├── pages/          # Landing, chat room, legacy /how-to showcase
│   ├── components/     # chat/ (messages, sidebar, input) + ui/ (buttons, badges, etc.)
│   ├── hooks/          # useChat, useSettings
│   └── utils/          # mockData, messageParser
├── supabase/
│   ├── functions/      # Edge Functions: join-session, end-session, bot-tick
│   └── migrations/     # Postgres schema + RLS policies
├── docs/               # Style.md (design system) + build history
└── PLAN.md             # Original rebuild spec (superseded by the v2 model above)
```

## 📦 Deployment

Deployed on **Vercel**, auto-deploying on push to `main`. Needs these Vercel
environment variables set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The Supabase side (Edge Functions, migrations, `VOIDAI_API_KEY` secret) is
managed separately via the Supabase CLI/dashboard.

## 🧭 Status

The v2 slug-room model described above is built and live. Known pending
work: a creator-only archive view at `/~` (session transcripts are already
being written to `sessions.archive`, just not exposed in the UI yet), and
some legacy v1 code (`useChat`, `mockData`, the old `/how-to` mock showcase)
is still present in `src/` but superseded — safe to ignore unless you're
specifically working on cleanup.

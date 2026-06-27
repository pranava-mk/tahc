# Frontend

## What this is for
React SPA. Landing mints a slug; `/<slug>` is a live chat room (join, stream messages, send, 11-min countdown). Mono / IRC terminal aesthetic. Components split `chat/` (feature) + `ui/` (primitives). Hooks hold data logic.

## Folder contents
| Path | What it holds |
|------|---------------|
| `App.jsx` | Routes: `/` Landing (mints random slug), `/:slug` Chat, `/how-to` legacy. Landing component lives here |
| `lib/supabase.js` | Supabase browser client (reads `VITE_SUPABASE_*`) |
| `hooks/useRoom.js` | **THE room hook** — takes `slug`; join-session, history, crowd, realtime msgs, send (optimistic + dedupe), countdown→end-session→`ended`, anti-spam, pre-warm + poke-on-send, invite url, status states |
| `hooks/useSettings.js` | localStorage settings (legacy showcase) |
| `hooks/useChat.js` | **LEGACY** mock chat (delete-eligible) |
| `pages/Chat.jsx` | Room page: header (live dot, timer, invite, online), status screens (full/expired/ended), uses `useRoom(slug)` |
| `pages/HowTo.jsx` | **LEGACY** static showcase (`/how-to`) |
| `components/chat/` | ChatInput, Message (IRC mono, per-user color, own tinted), MessagesContainer, OnlinePanel (click-toggle), SessionEndOverlay, Sidebar/UserList/SettingsPanel (legacy, unused by Chat) |
| `components/ui/` | Button, Badge, Toggle, Tooltip |
| `styles/` | globals.css (mono base, dark, live-dot pulse), responsive.css |
| `utils/` | messageParser.js, mockData.js (**legacy**) |

## Routing table
| Task | Read | Skip | Skill |
|------|------|------|-------|
| Room data / join / realtime / anti-spam / invite | `hooks/useRoom.js` + `lib/supabase.js` + `../supabase/_context.md` | useChat.js | — |
| Room page / header / status screens | `pages/Chat.jsx` | HowTo.jsx | — |
| Message rendering | `components/chat/Message.jsx` | — | — |
| Input / char limit / `/me` | `components/chat/ChatInput.jsx` | — | — |
| Landing / slug mint / routes | `App.jsx` | — | `ui:page-new` |
| Style | `styles/globals.css` + `../tailwind.config.js` + `../docs/Style.md` | — | — |

## Conventions
- Mono everywhere (`font-mono` base). Dark only. Accent `#FF3B30`. No box shadows, Heroicons only.
- Message shape UI expects: `{id, type:'chat'|'emote'|'info'|'warn', user, text, timestamp:Date}`. `useRoom` maps DB rows → this.
- Only `/me` command (→ emote). Realtime echoes own inserts → dedupe by `id`; send appends optimistically.
- Invite URL = `${origin}/${slug}`. Status states drive whole-screen messages (loading/room_full/expired/ended/error).
- Session length via `VITE_SESSION_SECONDS` (default 660). Never commit `.env.local`.

## Available skills
| Skill | When to use |
|-------|-------------|
| `ui:component-new` | New UI primitive |
| `ui:page-new` | New route/page |
| `verify` / `run` | Launch app, confirm in browser |
| `misc:lint` | Lint |

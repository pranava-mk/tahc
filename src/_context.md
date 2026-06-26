# Frontend

## What this is for
React SPA wired to Supabase. Live chat UI: join session, stream messages (realtime), send, 11-min countdown + rotation overlay. Components split `chat/` (feature) + `ui/` (primitives). Hooks hold stateful/data logic. Pages = routes. Utils = pure fns.

## Folder contents
| Path | What it holds |
|------|---------------|
| `lib/supabase.js` | Supabase browser client singleton (reads `VITE_SUPABASE_*` env) |
| `hooks/useRoom.js` | **LIVE** chat hook: join-session, load history+crowd, realtime msgs, send (optimistic + dedupe), countdown → end-session → 3s overlay → rejoin |
| `hooks/useSettings.js` | localStorage settings |
| `hooks/useChat.js` | **LEGACY** mock chat (Phase 6 delete) |
| `pages/Chat.jsx` | **LIVE** chat page (`/chat`): header countdown + online count, overlay, uses `useRoom` |
| `pages/HowTo.jsx` | **LEGACY** static showcase (`/how-to`, uses `useChat`+mockData) |
| `components/chat/` | ChatInput, Message, MessagesContainer, SettingsPanel, Sidebar, UserList, SessionEndOverlay |
| `components/ui/` | Button (primary/danger), Badge, Toggle, Tooltip |
| `styles/` | globals.css (base, dark), responsive.css |
| `utils/` | messageParser.js (markdown/LaTeX/code), mockData.js (**legacy**) |
| `App.jsx` / `main.jsx` | Router + entry |

## Routing table
| Task | Read | Skip | Skill |
|------|------|------|-------|
| Edit live chat data/flow | `hooks/useRoom.js` + `lib/supabase.js` + `../supabase/_context.md` | useChat.js | — |
| Edit chat page/UI | `pages/Chat.jsx` + relevant `components/chat/` | HowTo.jsx | `ui:component-new` |
| Add component | component file + `../docs/Style.md` | — | `ui:component-new` |
| Add page/route | `App.jsx` + `pages/` | — | `ui:page-new` |
| Style change | `styles/globals.css` + `../docs/Style.md` + `../tailwind.config.js` | — | — |
| Message parse | `utils/messageParser.js` | — | — |
| Settings | `hooks/useSettings.js` + `components/chat/SettingsPanel.jsx` | — | — |

## Conventions
- Dark-only. No light mode.
- Buttons: `primary` (gray outline), `danger` (red). Badges: `default`, `accent`. No others.
- Red accent `#FF3B30` (hover, active, online dots, @mentions, focus).
- No box shadows. No emojis. Heroicons only.
- Message shape UI expects: `{id, type:'chat'|'emote'|'info'|'warn', user, text, timestamp:Date}`. `useRoom` maps DB rows → this.
- Only `/me` command kept (PLAN). ChatInput still shows old `/nick`/`/whisper` hints — stale, Phase 6 fix.
- Session length via `VITE_SESSION_SECONDS` (default 660). Never commit `.env.local`.
- Realtime echoes own inserts → dedupe by `id`; send appends optimistically.

## Available skills
| Skill | When to use |
|-------|-------------|
| `ui:component-new` | New reusable UI primitive |
| `ui:page-new` | New route-level page |
| `misc:code-cleanup` | Refactor component |
| `misc:lint` | Lint |
| `verify` / `run` | Launch app, confirm change in browser |

## Suggested skills (not yet built)
| Skill name | Trigger |
|------------|---------|
| realtime-debug | Inspect Supabase realtime subscription not delivering |

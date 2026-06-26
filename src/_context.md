# Source

## What this is for
All React application code. Components are split into `chat/` (feature-specific) and `ui/` (reusable primitives). Hooks extract stateful logic. Pages are route-level components. Utils are pure functions.

## Folder contents
| Path | What it holds |
|------|---------------|
| `components/chat/` | ChatInput, Message, MessagesContainer, SettingsPanel, Sidebar, UserList |
| `components/ui/` | Button (primary/danger), Badge (default/accent), Toggle, Tooltip |
| `hooks/` | useChat.js (message state + commands), useSettings.js (localStorage settings) |
| `pages/` | HowTo.jsx (main chat showcase at `/how-to`) |
| `styles/` | globals.css (base styles, dark theme), responsive.css (breakpoint utilities) |
| `utils/` | messageParser.js (markdown/LaTeX/code parsing), mockData.js (demo messages/users) |
| `App.jsx` | Router setup, route definitions |
| `main.jsx` | React entry point |

## Routing table
| Task | Read | Skill |
|------|------|-------|
| Add/edit component | relevant component file + `docs/Style.md` | `ui:component-new` |
| Add page/route | `App.jsx` + `pages/` | `ui:page-new` |
| Edit chat logic | `hooks/useChat.js` | — |
| Edit settings | `hooks/useSettings.js` + `components/chat/SettingsPanel.jsx` | — |
| Style changes | `styles/globals.css` + `docs/Style.md` + `tailwind.config.js` | — |
| Message parsing | `utils/messageParser.js` | — |

## Conventions
- Dark-only. No light mode code.
- 2 button variants: `primary` (gray outline), `danger` (red). No others.
- 2 badge variants: `default` (gray), `accent` (red). No others.
- Red accent: `#FF3B30`. Used for hover states, active toggles, online dots, @mentions, focus rings.
- No box shadows. No emojis. No emoji-only UI — use Heroicons.
- All settings persisted to localStorage via useSettings.

## Available skills
| Skill | When to use |
|-------|-------------|
| `ui:component-new` | Scaffold a new reusable UI primitive |
| `ui:page-new` | Scaffold a new route-level page |
| `misc:code-cleanup` | Refactor existing component |
| `misc:code-optimize` | Performance audit |
| `misc:lint` | Run linting |

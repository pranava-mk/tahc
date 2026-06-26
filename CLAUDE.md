# Workspace Map

## Purpose
React chat UI showcase ("tahc") — hack.chat-inspired. Implement tahc minimalist design system. Heroicons, dark-only theme, red accent (#FF3B30).

## Workspace Inventory
| Workspace | Folder | What lives here |
|-----------|--------|-----------------|
| Source | `src/` | React components, hooks, pages, styles, utils |
| Docs | `docs/` | Design spec (Style.md), feature guide, impl notes, redesign log |
| Config | `/` (root) | Vite, Tailwind, PostCSS config, package.json, index.html |

## Naming conventions
- Context files: `_context.md` (one per workspace folder)
- Design spec: `docs/Style.md`
- Planning docs: `docs/IMPLEMENTATION.md`, `docs/REDESIGN.md`, `docs/FEATURES.md`

## Navigation rules
1. Read this file first.
2. Always read `src/_context.md` — describe full component/hook/util structure.
3. Always read `docs/_context.md` — describe design system + what docs exist.
4. Design token or style questions → `docs/Style.md` direct.

## Stack
- Vite + React 18, React Router, Tailwind CSS, PostCSS, Framer Motion
- KaTeX (LaTeX render), highlight.js (code syntax), Heroicons
- Dev: `npm run dev` → http://localhost:3000
- Build: `npm run build`

## Routes
- `/` — Home page (`src/App.jsx`)
- `/how-to` — Chat showcase (`src/pages/HowTo.jsx`)
# Docs

## What this is for
Design system specification, feature reference, and implementation history for the tahc project. Source of truth for design decisions — consult before adding any new visual element or component variant.

## Folder contents
| File | What it holds |
|------|---------------|
| `Style.md` | Complete tahc design system: colors, typography, spacing, motion tokens, component specs |
| `FEATURES.md` | Full feature guide — chat commands, settings toggles, responsive breakpoints, animation specs |
| `IMPLEMENTATION.md` | Initial implementation log — what was built, component inventory, design system coverage |
| `REDESIGN.md` | Redesign decision log — what changed (dark-only, Heroicons, 2x spacing, red accent, flat design) |

## Routing table
| Task | Read | Skip |
|------|------|------|
| Add color / token | `Style.md` (colors section) | IMPLEMENTATION.md |
| Add animation | `Style.md` (motion section) | REDESIGN.md |
| Check what components exist | `FEATURES.md` (component library section) | IMPLEMENTATION.md |
| Understand past design decisions | `REDESIGN.md` | Style.md |
| Understand initial build scope | `IMPLEMENTATION.md` | REDESIGN.md |

## Conventions
- `Style.md` is the design spec — it defines what's allowed. If something isn't in Style.md, add it there before implementing.
- REDESIGN.md and IMPLEMENTATION.md are historical logs — don't edit them, only append.
- Naming for new docs: `YYYY-MM-DD_<slug>.md` for dated decision logs.

## Available skills
| Skill | When to use |
|-------|-------------|
| `misc:docs-generate` | Generate component or API docs |
| `misc:feature-plan` | Plan a new feature before implementing |
| `design-fetch` | Create or update Style.md from a live site or design reference |

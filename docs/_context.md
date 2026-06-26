# Docs

## What this is for
Design-system spec + feature/impl history for tahc. Source of truth for VISUAL decisions — read before adding any visual element or component variant. Not backend: architecture lives in root `PLAN.md`, backend ops in `../supabase/_context.md`.

## Folder contents
| File | What it holds |
|------|---------------|
| `Style.md` | Full tahc design system: colors, typography, spacing, motion tokens, component specs |
| `FEATURES.md` | Feature guide — chat commands, settings, breakpoints, animation specs |
| `IMPLEMENTATION.md` | Initial build log — what was built, component inventory (historical) |
| `REDESIGN.md` | Redesign decision log — dark-only, Heroicons, 2x spacing, red accent, flat (historical) |

## Routing table
| Task | Read | Skip |
|------|------|------|
| Add color/token | `Style.md` (colors) | IMPLEMENTATION.md |
| Add animation | `Style.md` (motion) | REDESIGN.md |
| What components exist | `FEATURES.md` (component library) | IMPLEMENTATION.md |
| Past design decisions | `REDESIGN.md` | Style.md |
| Initial build scope | `IMPLEMENTATION.md` | REDESIGN.md |
| Backend/architecture | (not here) → `../PLAN.md`, `../supabase/_context.md` | all docs/ |

## Conventions
- `Style.md` = design spec; defines what's allowed. Not in Style.md → add there before implementing.
- REDESIGN.md + IMPLEMENTATION.md = historical logs. Append only, don't edit.
- New dated docs: `YYYY-MM-DD_<slug>.md`.
- Docs here cover FRONTEND visuals only. Feature docs may be stale re: live backend (written for old showcase).

## Available skills
| Skill | When to use |
|-------|-------------|
| `misc:docs-generate` | Generate component/API docs |
| `misc:feature-plan` | Plan a feature before building |
| `design-fetch` | Create/update Style.md from a site or reference |

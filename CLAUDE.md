# MangaHub Pro — PWA manga reader rebuild

React 19 + TypeScript + Vite + Tailwind CSS + Zustand (5 stores) + IndexedDB.
Rebuild from scratch — the old codebase (../mangahub-pro) had unmanageable props drilling.

## Commands

- `npm run dev` — Start dev server (Vite)
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `npx tsc --noEmit` — Type-check without emitting
- `npx vitest run` — Run all tests once
- `npx vitest run src/db/` — Run data layer tests only
- `npx vitest run src/stores/` — Run store tests only

## Architecture

Read REBUILD.md for the full plan (9 bricks, current status, schemas).
Read ARCHITECTURE.md for file structure and dependency rules.
Read PROGRESS.md for current brick and next action.

### Dependency layers (top imports from bottom, never the reverse)

```
types/ → db/ → stores/ → hooks/ → components/ui/ → components/{feature}/ → App.tsx
```

- `db/` never imports from stores or React
- `components/ui/` receives data via props only — never imports a store
- Only feature components (library/, reader/, inspector/, forms/, settings/) connect to stores

### The 5 Zustand stores

- `useSettingsStore` — theme, LED, volume, animations (persisted: localStorage)
- `useMangaStore` — collection, selected manga, reading progress (persisted: IndexedDB)
- `useReaderStore` — current page, view mode (ephemeral)
- `useUIStore` — modals, toasts, inspector open/closed (ephemeral)
- `useFilterStore` — active filters, search query (ephemeral)

## Code rules

- Always use granular Zustand selectors: `useSettingsStore(s => s.ledIntensity)` — never destructure the whole store
- Every `URL.createObjectURL` must have a matching `URL.revokeObjectURL` in cleanup
- Every `addEventListener` must have a matching `removeEventListener` in cleanup
- Feature flags live in `src/flags.ts` — wrap incomplete features behind them
- No `any` types — use `unknown` and narrow

## Git workflow

- Branch per brick: `brick/0-scaffold`, `brick/1-data-state`, etc.
- Commit after each sub-task, not at end of brick
- Commit format: `brick/N: short description`
- Co-author: `Co-Authored-By: Claude <noreply@anthropic.com>`
- Never force push or reset --hard without explicit confirmation

## After every code change

- Update the checkbox in REBUILD.md for the completed sub-task
- Add an entry to CHANGELOG.md (see format in that file)
- At end of session: update PROGRESS.md "En cours" section, commit docs with `docs: session update YYYY-MM-DD`

## Common mistakes to watch for

- Importing a store inside `components/ui/` — this breaks the layer rule
- Forgetting to revoke ObjectURLs when images leave the LRU cache
- Using `useEffect` with missing or stale dependencies
- Creating files outside the current brick's scope without asking first

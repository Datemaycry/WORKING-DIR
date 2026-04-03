# Changelog — MangaHub Pro Rebuild

> Toutes les modifications et bugs résolus, session par session.
> Format : date + brique + ce qui a changé ou été corrigé.

---

## [2026-04-02] — Organisation initiale

### Ajouté
- `REBUILD.md` : plan maître complet du rebuild (9 briques, décisions architecturales, schéma de données)
- `ARCHITECTURE.md` : structure des dossiers cible, conventions de code, patterns Zustand
- `PROGRESS.md` : journal de sessions avec phrase de démarrage Claude
- `CLAUDE_BEHAVIOR.md` : règles de comportement Claude pour ce projet
- `CHANGELOG.md` : ce fichier

### Décisions intégrées (retours Claude externe)
- TypeScript adopté dès Brique 0
- 4ème store `useUIStore` ajouté (état transitoire : modales, toasts, loading)
- Briques 1+2 combinées en une seule phase (Data + State)
- MangaInspector avancé en 4.5 (après sélection manga, avant filtres)
- Ordre Reader révisé : 5h (progression) avant 5e (curl) et 5f (nuit)
- Error Boundaries ajoutés dès Brique 3
- Tests Vitest prévus pour data layer et stores (Brique 1+2)
- Migration données existantes avancée en 7b (avant export/import)
- Hook `useSwipeGesture` prévu comme unique source de vérité pour les gestes

---

## [2026-04-02] — Intégration structure détaillée (session 1, suite)

### Modifié
- `ARCHITECTURE.md` : réécriture complète avec structure de fichiers exhaustive (tous les composants nommés), flux typiques (ouvrir manga, tourner page, changer thème), conventions de nommage complètes
- `REBUILD.md` : 5 stores au lieu de 4 (ajout `useFilterStore`), Brique 1+2 enrichie avec `db/connection.ts`, `db/migration.ts`, et les 5 fichiers de types séparés

### Ajouté
- `STRUCTURE.md` : copie de la réponse Claude sur la structure complète du projet (référence)

### Décisions intégrées
- **5ème store `useFilterStore`** : filtres bibliothèque séparés de `useMangaStore` — chaque changement de filtre ne traverse pas le store métier
- **`db/connection.ts`** : connexion IndexedDB versionnée dès Brique 1 (pas en fin de projet)
- **`db/migration.ts`** : script migration intégré à la data layer dès Brique 1
- **Types séparés par domaine** : `manga.ts`, `page.ts`, `settings.ts`, `progress.ts`, `filters.ts` (au lieu d'un seul `index.ts`)

## [2026-04-03] — Brique 0 : Scaffold

### Ajouté
- `package.json` : React 19, TypeScript, Vite 6, Zustand 5, react-router-dom 7, vite-plugin-pwa, Tailwind, Vitest
- `vite.config.ts` : vite-plugin-pwa avec `devOptions: { enabled: false }`
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` : TypeScript strict
- `tailwind.config.ts` + `postcss.config.js` : Tailwind CSS configuré
- `src/index.css` : CSS variables design tokens (couleurs, LED, radius, durées) + reset global
- `src/flags.ts` : feature flags pour toutes les briques (LIBRARY, READER, FORMS, etc.)
- `src/types/index.ts` : interfaces `Manga`, `Page`, `Settings`, `ReadingProgress`, `FilterState`, `DisplayMode`
- `src/main.tsx` : point d'entrée React 19 StrictMode
- `src/App.tsx` : HashRouter avec routes `/`, `/reader/:id`, `/settings`
- `index.html` : HTML minimal avec meta viewport et theme-color

## [2026-04-03] — Brique 1+2 : Data Layer + State

### Ajouté
- `src/types/` : split en 5 fichiers séparés (`manga.ts`, `page.ts`, `settings.ts`, `progress.ts`, `filters.ts`) — `index.ts` re-exporte tout
- `src/db/connection.ts` : ouverture/upgrade IndexedDB v1 (stores: mangas, pages, settings) avec `resetDBConnection(factory?)` injectable pour les tests
- `src/db/mangas.ts` : CRUD mangas (getAllMangas, getMangaById, insertManga, updateManga, deleteManga) + tests (5 tests)
- `src/db/pages.ts` : CRUD pages (getPagesByMangaId, insertBatchPages, deletePagesByMangaId) + tests (4 tests)
- `src/db/settings.ts` : get/set settings upsert + tests (3 tests)
- `src/db/migration.ts` : migration depuis l'ancien schéma (mangaDB) — gated par FLAGS.MIGRATION
- `src/stores/useSettingsStore.ts` : persist localStorage, actions set* + tests (5 tests)
- `src/stores/useMangaStore.ts` : collection, selectedManga(), loadCollection, addManga, removeManga, updateProgress + tests (7 tests)
- `src/stores/useReaderStore.ts` : openManga, nextPage, prevPage, goToPage, setViewMode + tests (7 tests)
- `src/stores/useUIStore.ts` : modales, inspector, toasts, loading + tests (5 tests)
- `src/stores/useFilterStore.ts` : toggleAuthor/Series/Tag, searchQuery, clearFilters + tests (4 tests)
- `src/test-setup.ts` + `vitest.config.ts` : setup fake-indexeddb global + IDBFactory par test pour isolation
- `fake-indexeddb` installé en devDependency

### Résultat tests
40/40 tests passent — `npx tsc --noEmit` 0 erreur

<!-- Les prochaines entrées seront ajoutées ici au fil des sessions -->

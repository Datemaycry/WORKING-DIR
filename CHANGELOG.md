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

## [2026-04-03] — Brique 3 : Shell & Design System

### Ajouté
- `src/index.css` : tokens CSS étendus — thèmes `dark`/`light`/`amoled` via `[data-theme]`, typographie, layout tokens, animations (fade-in, slide-up, toast-in)
- `src/hooks/useSettingsSync.ts` : sync `useSettingsStore` → CSS vars (`data-theme`, `--led-intensity`, night mode filters, animation speed)
- `src/hooks/useDBErrorHandler.ts` : hook qui traduit `DBQuotaError`/`DBUnavailableError` en toasts
- `src/components/layout/Shell.tsx` : layout principal, monte `useSettingsSync`, wrap Header + main + NavBar
- `src/components/layout/Header.tsx` : header configurable (title, left, right slots)
- `src/components/layout/NavBar.tsx` : navigation bottom Bibliothèque / Paramètres avec NavLink active state
- `src/components/layout/SidePanel.tsx` : panneau latéral slide-in avec backdrop, Escape, focus trap
- `src/components/ui/Button.tsx` : variants (primary/secondary/ghost/danger), sizes, loading spinner
- `src/components/ui/IconButton.tsx` : bouton icône accessible avec aria-label
- `src/components/ui/Spinner.tsx` : indicateur de chargement accessible
- `src/components/ui/EmptyState.tsx` : état vide configurable (icon, title, description, action)
- `src/components/ui/Slider.tsx` : range input accessible avec label et valeur formatée
- `src/components/ui/Toggle.tsx` : switch accessible (role="switch", aria-checked)
- `src/components/ui/Pill.tsx` : tag cliquable avec état actif, toggle et remove
- `src/components/ui/Modal.tsx` : modale portail avec Escape, scroll lock, focus, aria
- `src/components/ui/Toast.tsx` + `ToastContainer` : toasts auto-dismiss 4s, portail, connectés à `useUIStore`
- `src/components/ui/ErrorBoundary.tsx` : class component Error Boundary avec reset
- `src/components/ui/ErrorFallback.tsx` : UI fallback d'erreur
- `src/db/connection.ts` : `DBUnavailableError` + `DBQuotaError` + `withDBErrorHandling()` wrapper
- `src/App.tsx` : intègre Shell, ErrorBoundary, ToastContainer, routes placeholder via EmptyState

### Résultat
40/40 tests passent — `npx tsc --noEmit` 0 erreur

## [2026-04-03] — Brique 4 : Library/Hub

### Ajouté
- `npm install react-window quick-lru fuse.js` + `@types/react-window`
- `src/utils/constants.ts` : constantes layout (CARD dimensions, SHELF_ROW_HEIGHT, LRU_CAPACITY)
- `src/utils/format.ts` : `formatDate`, `formatProgress`
- `src/components/library/MangaCover.tsx` : image couverture ou fallback titre
- `src/components/library/MangaCard.tsx` : carte (couverture + titre + slot badge)
- `src/components/library/ShelfRow.tsx` : ligne d'étagère avec plank bois + LEDStrip
- `src/components/library/Shelf.tsx` : FixedSizeList react-window, rows calculés depuis colCount
- `src/components/library/LEDStrip.tsx` : bande LED animée (`shelf-glow` + CSS vars)
- `src/components/library/LibraryView.tsx` : orchestrateur (ResizeObserver, cover loading, filtre+search, colCount)
- `src/components/library/FilterBar.tsx` : pills filtres actifs + bouton ouverture modale
- `src/components/library/FilterModal.tsx` : modale multi-select auteurs/séries/tags
- `src/components/library/SearchBar.tsx` : input recherche → useFilterStore.setSearchQuery
- `src/components/library/ProgressBadge.tsx` : badge % / ✓ overlay sur la carte
- `src/hooks/useImageURL.ts` : ObjectURL lifecycle (create + revoke au unmount)
- `src/hooks/useLRUCache.ts` : QuickLRU singleton pour coverURLCache (onEviction → revokeObjectURL)
- `src/hooks/useFuseSearch.ts` : Fuse.js sur titre/auteurs/séries/tags, threshold 0.35
- `src/db/pages.ts` : `getCoverBlob(mangaId)` — premier blob via cursor (couverture)
- `src/components/inspector/MangaInspector.tsx` : panneau SidePanel connecté aux stores
- `src/components/inspector/InspectorHeader.tsx` : couverture + titre + auteurs
- `src/components/inspector/InspectorMeta.tsx` : séries, tags, pages, date ajout
- `src/components/inspector/InspectorProgress.tsx` : barre de progression + "Reprendre"
- `src/components/inspector/InspectorActions.tsx` : boutons Lire / Modifier / Supprimer
- `src/index.css` : tokens shelf plank + thèmes `[data-shelf-theme="dark/glass"]`
- `FLAGS.LIBRARY`, `FLAGS.COVER_IMAGES`, `FLAGS.INSPECTOR` → `true`

### Résultat
40/40 tests passent — `npx tsc --noEmit` 0 erreur

## [2026-04-03] — Brique 5 : Reader

### Ajouté
- `src/db/pages.ts` : `getPageByNumber(mangaId, pageNumber)` — chargement lazy d'un seul blob
- `src/components/reader/SinglePage.tsx` : affichage image via `useImageURL` (revoke auto)
- `src/components/reader/DoublePage.tsx` : spread 2 pages côte-à-côte (landscape)
- `src/components/reader/PageDisplay.tsx` : routage single/double selon viewMode + orientation
- `src/components/reader/ReaderHUD.tsx` : overlay page counter (X / N)
- `src/components/reader/ReaderToolbar.tsx` : top bar (back+titre) + tap zones prev/next + slider (auto-hide 3s)
- `src/components/reader/PageSlider.tsx` : range input navigation rapide
- `src/components/reader/PageCurlCanvas.tsx` : effet curl CSS (FLAGS.PAGE_CURL)
- `src/components/reader/NightModeOverlay.tsx` : filtre sepia/brightness (--night-* CSS vars)
- `src/components/reader/ReaderView.tsx` : orchestrateur complet (lazy load, cache blobs, pre-fetch +2)
- `src/hooks/useKeyboardNav.ts` : arrows/Space/Escape → navigation page
- `src/hooks/useSwipeGesture.ts` : Pointer Events → direction, progress, velocity
- `src/hooks/usePageCurl.ts` : consomme useSwipeGesture, expose PageCurlState (FLAGS.PAGE_CURL)
- `src/hooks/useMediaQuery.ts` : MediaQueryList avec cleanup
- `src/hooks/useAutoSave.ts` : debounce 1.5s + flush unmount → updateProgress IndexedDB
- `src/hooks/useSounds.ts` : HTMLAudio lazy-load, volume store, FLAGS.SOUND
- `src/App.tsx` : layout routes (MainLayout + ReaderLayout full-screen hideHeader/hideNav)
- `FLAGS.READER = true`

### Résultat
40/40 tests — `npx tsc --noEmit` 0 erreur

<!-- Les prochaines entrées seront ajoutées ici au fil des sessions -->

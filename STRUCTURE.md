# MangaHub Pro — Structure du projet

```
mangahub-pro/
│
├── index.html
├── vite.config.ts                # Config Vite + PWA (vite-plugin-pwa)
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── package.json
├── .env                          # Variables d'env (ex: APP_VERSION)
│
├── public/
│   ├── favicon.svg
│   ├── manifest.json             # PWA manifest (nom, icônes, thème)
│   └── icons/                    # Icônes PWA (192×192, 512×512)
│
└── src/
    │
    ├── main.tsx                  # Point d'entrée : mount React + register SW
    ├── App.tsx                   # HashRouter + layout shell + ErrorBoundary racine
    ├── routes.tsx                # Définition des routes (/, /reader/:id, /settings)
    ├── flags.ts                  # Feature flags simples { pageCurl: false, sounds: true }
    │
    │
    │ ─────────────────────────────────────────────────
    │  COUCHE DONNÉES — Aucune dépendance React ici
    │ ─────────────────────────────────────────────────
    │
    ├── types/
    │   ├── manga.ts              # Interface Manga { id, title, authors, series, tags, coverBlob, ... }
    │   ├── page.ts               # Interface Page { id, mangaId, index, blob }
    │   ├── settings.ts           # Interface Settings { theme, ledIntensity, volume, ... }
    │   ├── progress.ts           # Interface ReadingProgress { mangaId, currentPage, totalPages, lastRead }
    │   └── filters.ts            # Interface FilterState { authors, series, tags, searchQuery }
    │
    ├── db/
    │   ├── connection.ts         # Ouvre/upgrade la base IndexedDB (versionnée avec schéma migrations)
    │   ├── mangas.ts             # CRUD mangas : getAll, getById, insert, update, delete
    │   ├── pages.ts              # CRUD pages : getByMangaId, insertBatch, delete
    │   ├── settings.ts           # get/set settings (clé unique, upsert)
    │   └── migration.ts          # Script migration depuis l'ancien schéma IndexedDB
    │
    │
    │ ─────────────────────────────────────────────────
    │  STATE MANAGEMENT — Zustand stores
    │ ─────────────────────────────────────────────────
    │
    ├── stores/
    │   ├── useMangaStore.ts      # Collection, manga sélectionné, progression persistée
    │   │                         #   actions : loadCollection, selectManga, updateProgress, addManga, deleteManga
    │   │
    │   ├── useSettingsStore.ts   # Thème, LED, volume, animations, displayMode
    │   │                         #   middleware persist → localStorage
    │   │                         #   actions : setTheme, setLedIntensity, toggleNightMode, ...
    │   │
    │   ├── useReaderStore.ts     # État de la session de lecture active
    │   │                         #   currentPage, viewMode (single/double), isPlaying
    │   │                         #   actions : goToPage, nextPage, prevPage, setViewMode
    │   │
    │   ├── useUIStore.ts         # État transitoire UI (pas persisté)
    │   │                         #   activeModal, inspectorOpen, toasts[], isLoading
    │   │                         #   actions : openModal, closeModal, pushToast, ...
    │   │
    │   └── useFilterStore.ts     # Filtres actifs de la bibliothèque
    │                             #   selectedAuthors[], selectedSeries[], selectedTags[], query
    │                             #   actions : toggleFilter, setSearchQuery, clearFilters
    │
    │
    │ ─────────────────────────────────────────────────
    │  HOOKS — Logique réutilisable
    │ ─────────────────────────────────────────────────
    │
    ├── hooks/
    │   ├── useSettingsSync.ts    # Sync useSettingsStore → CSS custom properties sur <html>
    │   ├── useImageURL.ts        # IndexedDB blob → ObjectURL avec auto-revoke au unmount
    │   ├── useLRUCache.ts        # Wrapper QuickLRU pour les couvertures/pages (éviction + revoke)
    │   ├── useSwipeGesture.ts    # Pointer Events → { direction, progress 0→1, velocity }
    │   ├── useKeyboardNav.ts     # Raccourcis clavier reader (←→, Espace, F pour fullscreen)
    │   ├── usePageCurl.ts        # Consomme useSwipeGesture → animation curl (canvas ou CSS)
    │   ├── useFuseSearch.ts      # Initialise Fuse.js sur la collection, retourne résultats filtrés
    │   ├── useAutoSave.ts        # Debounce save progression reader → useMangaStore → IndexedDB
    │   ├── useSounds.ts          # Charge et joue les sons (page turn, UI feedback)
    │   └── useMediaQuery.ts      # Détecte landscape/portrait pour auto double-page
    │
    │
    │ ─────────────────────────────────────────────────
    │  DESIGN SYSTEM — Composants atomiques réutilisables
    │ ─────────────────────────────────────────────────
    │
    ├── components/
    │   ├── ui/
    │   │   ├── Button.tsx
    │   │   ├── IconButton.tsx
    │   │   ├── Slider.tsx        # Utilisé pour volume, LED intensity
    │   │   ├── Toggle.tsx
    │   │   ├── Modal.tsx         # Shell modale générique (overlay + focus trap)
    │   │   ├── Pill.tsx          # Tag/badge cliquable (pour filtres, tags)
    │   │   ├── Toast.tsx         # Notification éphémère
    │   │   ├── Spinner.tsx
    │   │   ├── EmptyState.tsx    # Placeholder quand liste vide
    │   │   └── ErrorFallback.tsx # Affiché par ErrorBoundary
    │   │
    │   ├── layout/
    │   │   ├── Shell.tsx         # Layout principal : header + zone contenu + nav bottom
    │   │   ├── Header.tsx
    │   │   ├── NavBar.tsx        # Navigation bottom (Bibliothèque / Settings)
    │   │   └── SidePanel.tsx     # Panneau latéral générique (utilisé par Inspector)
    │   │
    │   │
    │   │ ─────────────────────────────────────────────
    │   │  FEATURES — Un dossier par domaine fonctionnel
    │   │ ─────────────────────────────────────────────
    │   │
    │   ├── library/
    │   │   ├── LibraryView.tsx       # Page principale : orchestre shelf + filtres + search
    │   │   ├── Shelf.tsx             # Conteneur étagère 3D (grille virtualisée)
    │   │   ├── ShelfRow.tsx          # Ligne d'étagère (rendu par react-window)
    │   │   ├── MangaCard.tsx         # Carte manga : couverture + titre + badge progression
    │   │   ├── MangaCover.tsx        # Image couverture (useImageURL + lazy load)
    │   │   ├── LEDStrip.tsx          # Effet LED animé sur l'étagère
    │   │   ├── FilterBar.tsx         # Barre de filtres actifs (pills cliquables)
    │   │   ├── FilterModal.tsx       # Modale multi-select pour Auteur/Série/Tags
    │   │   ├── SearchBar.tsx         # Input recherche → useFuseSearch
    │   │   └── ProgressBadge.tsx     # Badge visuel (non-lu, en cours %, terminé)
    │   │
    │   ├── reader/
    │   │   ├── ReaderView.tsx        # Page reader : orchestre tout le reader
    │   │   ├── PageDisplay.tsx       # Affiche 1 ou 2 pages selon viewMode
    │   │   ├── SinglePage.tsx        # Rendu image simple
    │   │   ├── DoublePage.tsx        # Rendu côte à côte (landscape)
    │   │   ├── PageCurlCanvas.tsx    # Canvas/div pour l'animation curl
    │   │   ├── ReaderToolbar.tsx     # Contrôles overlay : nav, slider page, mode nuit
    │   │   ├── PageSlider.tsx        # Slider de navigation rapide entre pages
    │   │   ├── NightModeOverlay.tsx  # Filtre CSS sepia/brightness par-dessus les pages
    │   │   └── ReaderHUD.tsx         # Infos discrètes : n° page, titre manga
    │   │
    │   ├── inspector/
    │   │   ├── MangaInspector.tsx    # Panneau latéral complet
    │   │   ├── InspectorHeader.tsx   # Couverture HD + titre + auteur
    │   │   ├── InspectorMeta.tsx     # Métadonnées (série, tags, date ajout)
    │   │   ├── InspectorProgress.tsx # Barre de progression + "Reprendre la lecture"
    │   │   ├── ChapterList.tsx       # Liste des chapitres (si applicable)
    │   │   └── InspectorActions.tsx  # Boutons : Lire, Éditer, Supprimer
    │   │
    │   ├── forms/
    │   │   ├── MangaForm.tsx             # Formulaire partagé ajout/édition
    │   │   ├── CoverUploader.tsx         # Upload + preview + resize canvas
    │   │   ├── PageImporter.tsx          # Import batch de pages (drag & drop + progress bar)
    │   │   ├── ValueSelectorModal.tsx    # Modale multi-select réutilisable (auteurs, séries, tags)
    │   │   └── ValueSelectorChip.tsx     # Chip sélectionné dans le formulaire
    │   │
    │   └── settings/
    │       ├── SettingsView.tsx       # Page paramètres complète
    │       ├── ThemeSection.tsx       # Choix thème + preview
    │       ├── LEDSection.tsx         # Slider intensité + toggle
    │       ├── SoundSection.tsx       # Volume + toggle sons
    │       ├── DisplaySection.tsx     # Mode affichage, animations
    │       └── DataSection.tsx        # Export / Import JSON
    │
    │
    │ ─────────────────────────────────────────────────
    │  UTILS — Fonctions pures, zéro side-effect
    │ ─────────────────────────────────────────────────
    │
    ├── utils/
    │   ├── image.ts              # resizeCover(blob, maxW, maxH) → blob
    │   ├── format.ts             # formatDate, formatProgress, truncateTitle
    │   ├── id.ts                 # generateId() → nanoid ou crypto.randomUUID
    │   ├── debounce.ts           # debounce générique
    │   └── constants.ts          # Breakpoints, limites (MAX_COVER_SIZE, LRU_CAPACITY...)
    │
    │
    │ ─────────────────────────────────────────────────
    │  ASSETS
    │ ─────────────────────────────────────────────────
    │
    ├── assets/
    │   ├── sounds/
    │   │   ├── page-turn.mp3
    │   │   └── ui-click.mp3
    │   └── fonts/                # Si polices custom
    │
    │
    │ ─────────────────────────────────────────────────
    │  STYLES
    │ ─────────────────────────────────────────────────
    │
    └── styles/
        ├── index.css             # Tailwind directives + reset
        ├── tokens.css            # CSS custom properties : --color-bg, --color-accent,
        │                         #   --led-intensity, --shelf-depth, --font-size-base...
        ├── themes/
        │   ├── light.css         # Surcharge tokens pour thème clair
        │   ├── dark.css          # Surcharge tokens pour thème sombre
        │   └── amoled.css        # Thème noir pur (OLED)
        └── animations.css        # Keyframes : page-curl, shelf-glow, fade-in...
```

---

## Principes d'organisation

### Couches de dépendances (sens unique ↓)

```
  types/          ← Aucune dépendance, importé par tout le monde
    ↓
  db/             ← Dépend de types/ uniquement
    ↓
  stores/         ← Dépend de types/ + db/
    ↓
  hooks/          ← Dépend de types/ + stores/ (+ parfois db/)
    ↓
  components/ui/  ← Dépend de types/ seulement (composants purs)
    ↓
  components/*    ← Features : dépendent de hooks/ + stores/ + ui/
    ↓
  App.tsx         ← Assemble les routes et le Shell
```

**Règle absolue** : les flèches ne remontent jamais. Un fichier dans `db/` n'importe jamais un store. Un composant `ui/` n'importe jamais un store directement — il reçoit ses données par props. Seuls les composants de feature (library/, reader/, etc.) se connectent aux stores.

### Pourquoi 5 stores et pas 3 ?

Le document initial prévoyait 3 stores. En pratique, 2 stores supplémentaires émergent naturellement :

| Store              | Persisté ?      | Responsabilité                                      |
| ------------------ | --------------- | --------------------------------------------------- |
| `useSettingsStore` | ✅ localStorage | Préférences utilisateur (thème, volume, LED…)       |
| `useMangaStore`    | ✅ IndexedDB    | Collection complète + progression par manga         |
| `useReaderStore`   | ❌ mémoire      | Session de lecture active (page courante, viewMode) |
| `useUIStore`       | ❌ mémoire      | Modales, toasts, panneaux ouverts, loading          |
| `useFilterStore`   | ❌ mémoire      | Filtres/recherche actifs dans la bibliothèque       |

Séparer filtres et UI du reste évite que chaque changement de filtre ou ouverture de modale ne traverse les stores métier.

### Conventions de nommage

- **Composants** : PascalCase, un fichier = un composant exporté par défaut
- **Hooks** : `use` + PascalCase → `useSwipeGesture.ts`
- **Stores** : `use` + PascalCase + `Store` → `useMangaStore.ts`
- **Utils / DB** : camelCase → `mangas.ts`, `debounce.ts`
- **Types** : interfaces PascalCase dans des fichiers camelCase → `manga.ts` exporte `interface Manga`

### Fichiers qui travaillent ensemble (flux typiques)

**Ouvrir un manga depuis la bibliothèque :**

```
SearchBar → useFuseSearch → useFilterStore
  → LibraryView filtre la liste
    → MangaCard (onClick) → useMangaStore.selectManga(id)
      → useUIStore.openInspector()
        → MangaInspector (lit useMangaStore.selectedManga)
          → "Lire" → navigate(/reader/:id) → ReaderView
```

**Tourner une page dans le reader :**

```
useSwipeGesture détecte swipe left
  → usePageCurl anime la transition
    → useReaderStore.nextPage()
      → PageDisplay re-render avec nouvelle page
        → useAutoSave (debounce 2s) → useMangaStore.updateProgress() → db/mangas.ts
```

**Changer le thème :**

```
ThemeSection (onClick "dark")
  → useSettingsStore.setTheme("dark")
    → middleware persist → localStorage
      → useSettingsSync (hook dans Shell.tsx)
        → document.documentElement.setAttribute("data-theme", "dark")
          → CSS tokens switchent via [data-theme="dark"] { --color-bg: ... }
```

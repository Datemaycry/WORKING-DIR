# MangaHub Pro — Architecture

> Référence technique : structure des fichiers, conventions, patterns.

---

## Structure des dossiers cible

```
src/
├── types/
│   └── index.ts              # Toutes les interfaces TypeScript
├── flags.ts                  # Feature flags (pageCurl, sounds, etc.)
├── db/
│   ├── manga.db.ts           # CRUD mangas IndexedDB
│   ├── page.db.ts            # CRUD pages IndexedDB
│   └── settings.db.ts        # Lecture/écriture settings
├── stores/
│   ├── useSettingsStore.ts
│   ├── useMangaStore.ts
│   ├── useReaderStore.ts
│   └── useUIStore.ts
├── hooks/
│   ├── useSettings.ts        # Sync store → CSS variables
│   ├── useSwipeGesture.ts    # Abstraction geste (direction, progress, velocity)
│   └── useImageURL.ts        # ObjectURL lifecycle (create + revoke)
├── components/
│   ├── ui/                   # Atomiques : Button, Slider, Modal, Pill, Toast
│   ├── shell/                # AppShell, ErrorBoundary, Layout
│   ├── library/              # HubView, ShelfRow, MangaCard, FilterPanel
│   ├── reader/               # ReaderView, PageDisplay, NavigationOverlay
│   ├── inspector/            # MangaInspector, MetadataPanel, ChapterList
│   └── forms/                # AddMangaForm, EditMangaForm, ValueSelectorModal
├── utils/
│   └── index.ts              # Helpers purs (formatters, etc.)
└── styles/
    ├── tokens.css            # CSS variables (couleurs, spacing, typo)
    └── animations.css        # Keyframes (LED pulse, page curl, book)
```

---

## Conventions de code

- **Fichiers** : PascalCase pour les composants, camelCase pour les hooks/utils
- **Stores** : expose toujours les données ET les actions dans le même store
- **Composants** : pas de logique métier dans les composants — ils appellent des hooks ou des stores
- **DB** : fonctions pures, pas d'import React, retournent des Promises
- **Tests** : colocalisés (`manga.db.test.ts` à côté de `manga.db.ts`)

---

## Patterns à respecter

### Store Zustand type

```typescript
interface SettingsStore {
  // State
  ledIntensity: number
  appTheme: string
  // Actions
  setLedIntensity: (v: number) => void
  setAppTheme: (theme: string) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ledIntensity: 1.0,
      appTheme: 'blue',
      setLedIntensity: (v) => set({ ledIntensity: v }),
      setAppTheme: (theme) => set({ appTheme: theme }),
    }),
    { name: 'mangahub-settings' }
  )
)
```

### Sélection granulaire (évite les re-renders inutiles)

```typescript
// ✅ Ne re-render que si ledIntensity change
const ledIntensity = useSettingsStore(s => s.ledIntensity)

// ❌ Re-render à chaque changement du store
const { ledIntensity } = useSettingsStore()
```

### Feature flags

```typescript
// src/flags.ts
export const FLAGS = {
  pageCurl: false,
  sounds: false,
  ledEffects: true,
} as const
```

---

## CSS Variables principales

```css
:root {
  --led-intensity: 1.0;
  --page-turn-duration: 0.6s;
  --page-snap-duration: 0.4s;
  --theme-primary: /* selon appTheme */;
}
```

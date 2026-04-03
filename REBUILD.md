# MangaHub Pro — Plan de Rebuild

> Document maître. Toujours lire ce fichier en début de session Claude.
> Mettre à jour le statut de chaque brique au fil de l'avancement.

---

## Contexte

MangaHub Pro est une PWA manga reader (React/Vite/Tailwind). L'app existante fonctionne mais le code est difficile à maintenir : state global éparpillé dans App.jsx, props drilling sur 3-4 niveaux, régressions fréquentes. Ce rebuild repart de zéro avec une architecture propre.

**Repo source :** `c:\Users\yfiliatre\mangahub-pro`
**Repo rebuild :** `c:\Users\yfiliatre\WORKING-DIR` (ce repo)
**Stratégie de branches :** une branche par brique (`brick/0-scaffold`, `brick/1-data`, etc.)

---

## Stack cible

- React 19 + TypeScript (dès le départ)
- Vite + Tailwind CSS
- Zustand (5 stores : settings, manga, reader, ui, filter)
- IndexedDB (wrappers purs, sans React)
- react-window (virtualisation bibliothèque)
- Fuse.js (recherche floue)
- QuickLRU (cache images avec revoke)
- vite-plugin-pwa (Service Worker, devOptions disabled en dev)
- Vitest (tests data layer + stores)

---

## Décisions architecturales prises

| Décision | Choix | Raison |
|----------|-------|--------|
| State manager | Zustand | Sélection granulaire, pas de re-render global, persist middleware |
| Typage | TypeScript dès Brique 0 | Modèles de données complexes, autocomplétion, sécurité refactor |
| Progression temps réel | `useReaderStore.currentPage` | Éphémère, session uniquement |
| Progression persistée | `useMangaStore.readingProgress` | Propriété du manga, sync → IndexedDB à la fermeture |
| Erreurs | Error Boundaries dès Brique 3 | + fallbacks IndexedDB (quota, mode privé) |
| Feature flags | `const FLAGS = {}` dans `src/flags.ts` | Permet merger briques incomplètes sans casser l'app |

---

## Schéma de données (à finaliser avant Brique 1)

```typescript
interface Manga {
  id: string
  title: string
  authors: string[]
  series: string[]
  tags: string[]
  coverObjectURL?: string     // non persisté, généré à la volée
  totalPages: number
  readingProgress: ReadingProgress
  createdAt: number
  updatedAt: number
}

interface Page {
  id: string
  mangaId: string
  pageNumber: number
  blob: Blob
}

interface ReadingProgress {
  currentPage: number
  lastReadAt: number
  completed: boolean
}

interface Settings {
  appTheme: string
  isNightMode: boolean
  showSpine: boolean
  shelfTheme: string
  pageAnimationsEnabled: boolean
  soundVolume: number
  ledIntensity: number
  animationSpeed: number
  displayMode: 'auto' | 'single' | 'double'
}
```

---

## Les 5 Stores Zustand

```
useSettingsStore  → thème, LED, volume, mode affichage, animations       (persisté localStorage)
useMangaStore     → collection, manga sélectionné, progression persistée  (persisté IndexedDB)
useReaderStore    → page courante (session), mode double/single           (non persisté)
useUIStore        → modale ouverte, inspector visible, toasts, loading    (non persisté)
useFilterStore    → auteurs/séries/tags actifs, searchQuery               (non persisté)
```

---

## Roadmap — Statut des Briques

### Brique 0 — Scaffold
**Statut : [x] Terminé**
**Branche : `brick/0-scaffold`**

- [x] Vite + React + TypeScript
- [x] Tailwind CSS configuré
- [x] CSS variables + reset global
- [x] vite-plugin-pwa (devOptions: { enabled: false })
- [x] Hash router minimal
- [x] `src/flags.ts` avec feature flags
- [x] `src/types/index.ts` avec toutes les interfaces

---

### Brique 1+2 — Data Layer + State (phase combinée)
**Statut : [x] Terminé**
**Branche : `brick/1-data-state`**

> Traitées ensemble car les stores Zustand appellent les wrappers IndexedDB

**Data Layer (`src/db/`) :**
- [x] `connection.ts` — ouvre/upgrade IndexedDB, versionnée avec schéma migrations
- [x] `mangas.ts` — CRUD mangas : getAll, getById, insert, update, delete
- [x] `pages.ts` — CRUD pages : getByMangaId, insertBatch, delete
- [x] `settings.ts` — get/set settings (clé unique, upsert)
- [x] `migration.ts` — script migration depuis l'ancien schéma IndexedDB
- [x] Tests Vitest pour chaque wrapper

**Types (`src/types/`) :**
- [x] `manga.ts` — interface Manga
- [x] `page.ts` — interface Page
- [x] `settings.ts` — interface Settings
- [x] `progress.ts` — interface ReadingProgress
- [x] `filters.ts` — interface FilterState

**Stores Zustand (`src/stores/`) :**
- [x] `useSettingsStore.ts` (persist middleware → localStorage)
- [x] `useMangaStore.ts`
- [x] `useReaderStore.ts`
- [x] `useUIStore.ts`
- [x] `useFilterStore.ts`
- [x] Tests Vitest pour les actions de chaque store

---

### Brique 3 — Shell & Design System
**Statut : [x] Terminé**
**Branche : `brick/3-shell`**

- [x] Layout global (AppShell)
- [x] Tokens CSS (couleurs, typographie, spacing)
- [x] Composants atomiques : Button, Slider, Modal, Pill, Toast
- [x] Error Boundary global
- [x] Hook `useSettingsSync` qui sync store → CSS variables
- [x] Fallbacks IndexedDB (quota dépassé, mode privé)

---

### Brique 4 — Library/Hub
**Statut : [x] Terminé**
**Branche : `brick/4-library`**

**Phase A — Affichage (4a→4d)**
- [x] 4a : Étagère vide + rendu d'un manga
- [x] 4b : Virtualisation (react-window)
- [x] 4c : Effet LED + thèmes étagère
- [x] 4d : Couvertures (IndexedDB → ObjectURL → LRU + revoke)

**Phase B — Interaction (4e→4h + Inspector)**
- [x] 4e : Sélection manga → ouverture reader
- [x] 4.5 : MangaInspector (panneau latéral, métadonnées, progression, actions)
- [x] 4f : Filtres multi-select (Auteur/Série/Tags)
- [x] 4g : Recherche (Fuse.js)
- [x] 4h : Badges (non-lu, progression)

---

### Brique 5 — Reader
**Statut : [x] Terminé**
**Branche : `brick/5-reader`**

- [x] 5a : Affichage image simple
- [x] 5b : Navigation clavier/boutons
- [x] 5c : Swipe tactile → hook `useSwipeGesture`
- [x] 5d : Double page (landscape auto)
- [x] 5h : Progression auto (sauvegarde IndexedDB)
- [x] 5e : Animation page curl (FLAGS.PAGE_CURL)
- [x] 5f : Mode nuit + filtres CSS
- [x] 5g : Sons (FLAGS.SOUND)

---

### Brique 6 — Formulaires
**Statut : [ ] À faire**
**Branche : `brick/6-forms`**

- [ ] 6a : Structure formulaire ajout
- [ ] 6b : Upload couverture (canvas resize)
- [ ] 6c : Import pages (IndexedDB batch)
- [ ] 6d : ValueSelectorModal multi-select (Auteur, Série, Tags)
- [ ] 6e : Formulaire édition

---

### Brique 7 — Settings & Polish
**Statut : [ ] À faire**
**Branche : `brick/7-settings`**

- [ ] 7a : Panneau paramètres complet
- [ ] 7b : Migration données existantes (import depuis ancienne app)
- [ ] 7c : Export/import données
- [ ] 7d : Mode hors-ligne (SW strategy)
- [ ] 7e : Perf audit (Lighthouse)
- [ ] 7f : Accessibilité (aria, keyboard nav)

---

## Hook `useImageURL` (à créer en Brique 4d)

```typescript
// Gère le lifecycle create/revoke des ObjectURLs pour éviter les memory leaks
function useImageURL(blob: Blob | null): string | null {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!blob) return
    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [blob])
  return url
}
```

---

## Points de vigilance

- **Memory leaks** : ObjectURLs doivent être révoquées quand elles sortent du LRU cache
- **Swipe + Curl** : ne pas coder deux systèmes de geste séparés — `useSwipeGesture` est la seule source de vérité
- **Progression** : bien distinguer `currentPage` (réel, session) de `readingProgress` (persisté, manga)
- **Service Worker** : toujours garder `devOptions: { enabled: false }` en dev pour éviter le cache stale

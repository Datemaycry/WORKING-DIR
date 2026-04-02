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
- Zustand (4 stores : settings, manga, reader, ui)
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

## Les 4 Stores Zustand

```
useSettingsStore  → thème, LED, volume, mode affichage, animations
useMangaStore     → collection, filtres actifs, manga sélectionné
useReaderStore    → page courante (session), mode double/single
useUIStore        → modale ouverte, inspector visible, toasts, loading states
```

---

## Roadmap — Statut des Briques

### Brique 0 — Scaffold
**Statut : [ ] À faire**
**Branche : `brick/0-scaffold`**

- [ ] Vite + React + TypeScript
- [ ] Tailwind CSS configuré
- [ ] CSS variables + reset global
- [ ] vite-plugin-pwa (devOptions: { enabled: false })
- [ ] Hash router minimal
- [ ] `src/flags.ts` avec feature flags
- [ ] `src/types/index.ts` avec toutes les interfaces

---

### Brique 1+2 — Data Layer + State (phase combinée)
**Statut : [ ] À faire**
**Branche : `brick/1-data-state`**

> Traitées ensemble car les stores Zustand appellent les wrappers IndexedDB

**Data Layer (`src/db/`) :**
- [ ] `manga.db.ts` — CRUD mangas
- [ ] `page.db.ts` — CRUD pages
- [ ] `settings.db.ts` — lecture/écriture settings
- [ ] Tests Vitest pour chaque wrapper

**Stores Zustand (`src/stores/`) :**
- [ ] `useSettingsStore.ts` (avec persist middleware → localStorage)
- [ ] `useMangaStore.ts`
- [ ] `useReaderStore.ts`
- [ ] `useUIStore.ts`
- [ ] Tests Vitest pour les actions de chaque store

---

### Brique 3 — Shell & Design System
**Statut : [ ] À faire**
**Branche : `brick/3-shell`**

- [ ] Layout global (AppShell)
- [ ] Tokens CSS (couleurs, typographie, spacing)
- [ ] Composants atomiques : Button, Slider, Modal, Pill, Toast
- [ ] Error Boundary global
- [ ] Hook `useSettings` qui sync store → CSS variables
- [ ] Fallbacks IndexedDB (quota dépassé, mode privé)

---

### Brique 4 — Library/Hub
**Statut : [ ] À faire**
**Branche : `brick/4-library`**

**Phase A — Affichage (4a→4d)**
- [ ] 4a : Étagère vide + rendu d'un manga
- [ ] 4b : Virtualisation (react-window)
- [ ] 4c : Effet LED + thèmes étagère
- [ ] 4d : Couvertures (IndexedDB → ObjectURL → LRU + revoke)

> Valider visuellement avant de continuer

**Phase B — Interaction (4e→4h + Inspector)**
- [ ] 4e : Sélection manga → ouverture reader
- [ ] 4.5 : MangaInspector (panneau latéral, métadonnées, progression, actions)
- [ ] 4f : Filtres multi-select (Auteur/Série/Tags)
- [ ] 4g : Recherche (Fuse.js)
- [ ] 4h : Badges (non-lu, progression)

---

### Brique 5 — Reader
**Statut : [ ] À faire**
**Branche : `brick/5-reader`**

> Ordre révisé : progression (5h) avant le polish visuel (curl, nuit)

- [ ] 5a : Affichage image simple
- [ ] 5b : Navigation clavier/boutons
- [ ] 5c : Swipe tactile → hook `useSwipeGesture` (direction, progression 0→1, vélocité)
- [ ] 5d : Double page (landscape auto)
- [ ] 5h : Progression auto (sauvegarde IndexedDB) ← avancé ici
- [ ] 5e : Animation page curl (consomme `useSwipeGesture`)
- [ ] 5f : Mode nuit + filtres CSS
- [ ] 5g : Sons

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

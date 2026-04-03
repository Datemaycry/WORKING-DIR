# Journal de sessions

> Mettre à jour ce fichier en fin de chaque session de travail.
> En début de session, lire REBUILD.md + cette section "En cours".

---

## Comment démarrer une session Claude

Colle ce message en début de conversation :

```
Lis les fichiers REBUILD.md, ARCHITECTURE.md et PROGRESS.md dans C:\Users\yfiliatre\WORKING-DIR.
Résume-moi où on en est et ce qu'on fait aujourd'hui.
```

---

## En cours

**Brique :** Brique 5 — Reader (à démarrer)

**Prochaine action :** Créer la branche `brick/5-reader`, démarrer par 5a (affichage image simple via `pages` store/IndexedDB), puis 5b (navigation clavier/boutons), 5c (swipe `useSwipeGesture`), 5d (double page), 5h (progression auto), 5e (curl), 5f (mode nuit), 5g (sons)

---

## Historique des sessions

### Session 3 — 2026-04-03 (suite)
- Brique 4 complète (4a→4h + 4.5)
- react-window, quick-lru, fuse.js installés
- LibraryView : shelf virtualisée, LED, couvertures LRU, filtres multi-select, recherche Fuse.js, badges progression
- MangaInspector : SidePanel avec métadonnées, progression, actions (Lire/Modifier/Supprimer)
- 40/40 tests — 0 erreur TypeScript
- **Prochaine étape : Brique 5 — Reader**

---

### Session 1 — 2026-04-02
- Contexte récupéré depuis l'ancienne session (mangahub-pro)
- Plan de rebuild établi en 9 briques
- Retours Claude intégrés : TypeScript dès B0, 4 stores (+ useUIStore), Inspector avancé en 4.5, ordre Reader révisé, tests Vitest, migration données, Error Boundaries
- Création du repo WORKING-DIR avec REBUILD.md / ARCHITECTURE.md / PROGRESS.md
- **Prochaine étape : Brique 0**

---

## Décisions de session

| Date | Décision | Raison |
|------|----------|--------|
| 2026-04-02 | TypeScript dès Brique 0 | Modèles complexes, sécurité refactor |
| 2026-04-02 | 4 stores Zustand (+ useUIStore) | État transitoire UI (modales, toasts) séparé |
| 2026-04-02 | Inspector avancé en 4.5 | Dépend de useMangaStore, pas du Reader |
| 2026-04-02 | Brique 1+2 combinées | Stores appellent les wrappers DB, couplage naturel |
| 2026-04-02 | Progression sauvegarde (5h) avant curl (5e) | Feature core avant polish visuel |

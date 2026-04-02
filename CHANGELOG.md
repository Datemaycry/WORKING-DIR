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

<!-- Les prochaines entrées seront ajoutées ici au fil des sessions -->

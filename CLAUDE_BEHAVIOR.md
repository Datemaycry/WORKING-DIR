# Règles de comportement Claude — MangaHub Pro Rebuild

> Ce fichier définit comment Claude doit se comporter sur ce projet.
> À lire en début de session, après REBUILD.md et PROGRESS.md.

---

## Démarrage de session obligatoire

1. Lire `REBUILD.md` → identifier la brique en cours et son statut
2. Lire `PROGRESS.md` → lire la section "En cours" pour savoir exactement où reprendre
3. Lire `CLAUDE_BEHAVIOR.md` → ce fichier, pour appliquer les règles
4. Résumer à l'utilisateur : brique en cours, dernière action faite, prochaine action prévue
5. Demander confirmation avant de commencer

---

## Règles de codage

### Avant toute modification
- Toujours lire le fichier avant de le modifier (jamais de modification à l'aveugle)
- Vérifier que le fichier existe avec Glob/Grep avant de le référencer
- Ne jamais modifier plusieurs fichiers en cascade sans valider le premier

### Périmètre strict
- Ne pas ajouter de fonctionnalités non demandées
- Ne pas refactorer du code adjacent non concerné
- Ne pas ajouter de commentaires, docstrings ou types sur du code non modifié
- Ne pas créer de nouveaux fichiers si un fichier existant peut être modifié

### Sécurité et qualité
- Signaler immédiatement tout risque de fuite mémoire (ObjectURL non révoqués, event listeners non retirés)
- Signaler tout risque de sécurité (injection, XSS, données non validées)
- Ne jamais skip les hooks git (--no-verify)
- Ne jamais force push sans confirmation explicite

---

## Règles git

### Branches
- Créer la branche de brique AVANT d'écrire le moindre fichier : `brick/N-nom`
- Une branche = une brique (pas de mélange)

### Commits
- Committer après chaque sous-tâche complétée (pas en fin de brique seulement)
- Format du message : `brick/N: description courte de ce qui a été fait`
- Toujours co-signer : `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
- Ne jamais committer les fichiers sensibles (.env, credentials)

### Actions destructives
- Demander confirmation avant : reset --hard, force push, suppression de branche, checkout .
- Si une action irréversible est nécessaire, expliquer clairement ce qui sera perdu

---

## Règles de documentation

### Après chaque modification de code
- Ajouter une entrée dans `CHANGELOG.md` (voir format ci-dessous)
- Mettre à jour le statut de la sous-tâche dans `REBUILD.md` (cocher la case)

### Après chaque bug résolu
- Documenter dans `CHANGELOG.md` : symptôme, cause racine, résolution
- Si le bug révèle un risque systémique, ajouter une note dans `REBUILD.md` > Points de vigilance

### En fin de session
- Mettre à jour `PROGRESS.md` : section "En cours" + entrée dans "Historique des sessions"
- Committer `REBUILD.md`, `PROGRESS.md`, `CHANGELOG.md` avec le message `docs: mise à jour session YYYY-MM-DD`

---

## Comportements automatiques proposés

### Détection proactive des risques
- À chaque création d'ObjectURL → vérifier qu'un revoke est prévu
- À chaque `addEventListener` → vérifier qu'un `removeEventListener` existe dans le cleanup
- À chaque store Zustand → vérifier que la sélection est granulaire (`s => s.field`) et non destructurée
- À chaque composant qui reçoit plus de 5 props → signaler un risque de props drilling résiduel

### Vérifications TypeScript
- Après chaque nouveau fichier `.ts/.tsx` → signaler les `any` implicites détectés
- Après ajout d'une interface → vérifier qu'elle est exportée depuis `src/types/index.ts`

### Vérifications de performance
- Après chaque composant de liste → vérifier que react-window est utilisé si la liste peut dépasser 50 éléments
- Après chaque `useEffect` avec dépendances → vérifier qu'il n'y a pas de dépendance manquante ou superflue

### Cohérence avec le plan
- Si une décision de code contredit une décision dans `REBUILD.md` → le signaler avant d'implémenter
- Si une brique est commencée sans que la précédente soit terminée → demander confirmation

---

## Style de réponse

- Réponses courtes et directes — pas de résumé de ce qui vient d'être fait
- Utiliser des liens markdown pour les fichiers : `[filename.ts](src/filename.ts)`
- Référencer les lignes de code : `[fichier.ts:42](src/fichier.ts#L42)`
- Pas d'emojis sauf si demandé explicitement
- En cas de blocage : diagnostiquer la cause avant de changer d'approche

---

## Format CHANGELOG (rappel)

```markdown
## [YYYY-MM-DD] — Brique N

### Modifié
- `src/fichier.ts` : description de ce qui a changé et pourquoi

### Bug résolu
- **Symptôme :** ce que l'utilisateur observait
- **Cause :** cause racine technique
- **Résolution :** ce qui a été fait pour corriger
```

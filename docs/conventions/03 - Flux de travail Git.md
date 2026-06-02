# 🌿 Présentation

Ce document définit un workflow Git utilisant une approche Simplified GitFlow, imposant des conventions strictes sur le nommage des branches (<type>/<description>) et le format des messages de commit (Conventional Commits) via Husky. Le flux de travail complet est sécurisé par des hooks (post-checkout, pre-commit, commit-msg, pre-push) assurant la validation des branches et le linting avant tout push.

[Étape 1] Vous créez une branche (Nom respectant le format : feature/nom)
   │
   ▼
[Étape 2] Vous écrivez votre code et vous faites un "Commit"
   │   ❌ Bloqué par le robot "Pre-commit" si le texte est mal formaté
   ▼
[Étape 3] Le robot "Commit-msg" vérifie votre message de validation
   │   ❌ Rejeté si le message fait moins de 10 caractères
   ▼
[Étape 4] Vous poussez le code sur le serveur ("Push")
   │   ❌ Bloqué par "Pre-push" si les tests TypeScript échouent
   ▼
[Étape 5] Le formateur relit, valide, et fusionne votre travail dans la branche principale

# 🌿 Workflow Git

> Le nommage des branches, les messages de commit, et les hooks qui les imposent.

## Modèle de branches

GitFlow simplifié :

```text
main         ← prêt pour la production, protégé, ne jamais pousser directement
  │
  ├── develop  ← branche d'intégration, protégée, fusionnée depuis feature/*
  │     │
  │     ├── feature/auth-module
  │     ├── feature/items-crud
  │     ├── fix/login-redirect
  │     └── chore/upgrade-vite
```

## Nommage des branches

Toutes les branches à l'exception de `main`, `develop`, et `master` doivent suivre le format `<type>/<description>`.


| Type        | Quand l'utiliser | Exemple |
| :---------- | :---------------- | :------------------ |
| `feature/`  | Nouvelle fonctionnalité | `feature/items-tagging` |
| `fix/`      | Correction de bogue (*bug fix*) | `fix/login-redirect-loop` |
| `hotfix/`   | Correction critique en production (depuis main) | `hotfix/security-cve` |
| `docs/`     | Documentation uniquement | `docs/architecture-diagram` |
| `style/`    | Formatage / espaces vides | `style/prettier-pass` |
| `refactor/` | Remaniement (*refactor*) sans changement de comportement | `refactor/extract-auth-service` |
| `perf/`     | Amélioration des performances | `perf/lazy-load-routes` |
| `test/`     | Tests uniquement | `test/auth-store-coverage` |
| `build/`    | Système de build / dépendances | `build/upgrade-vite-7` |
| `ci/`       | CI/CD (Intégration / Déploiement continus) | `ci/add-coverage-report` |
| `chore/`    | Maintenance générale | `chore/cleanup-old-mocks` |
| `release/`  | Préparation d'une version | `release/0.2.0` |

Règles : minuscules, traits d'union uniquement, pas de trait d'union au début ou à la fin, pas de caractères de soulignement (*underscore*), pas de camelCase. Contrainte imposée par les hooks `post-checkout` et `pre-push`.

## Format des messages de commit

Conventional Commits avec des règles plus strictes (voir `commitlint.config.js`).

```text
<type>(<scope>): <subject>

[corps optionnel]

[pied(s) de page optionnel(s)]
```

### Règles appliquées


| Règle | Valeur |
| :--- | :--- |
| type | `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`, `revert`, `hotfix` |
| scope | **Obligatoire**, minuscules, 2 à 25 caractères |
| subject | Début en minuscule, pas de point final, **≥ 10 caractères** |
| header total | ≤ 100 caractères |

### Périmètres (scopes) courants

- **Zones de code** : `schemas`, `services`, `stores`, `composables`, `views`, `router`, `mocks`, `utils`
- **Outillage** : `deps`, `env`, `eslint`, `prettier`, `commitlint`, `husky`, `hooks`, `lint-staged`
- **À l'échelle du projet** : `init`, `app`, `docs`, `readme`

### Exemples valides

```text
feat(schemas): add user zod schemas with role enum
fix(router): redirect to login when session expires
chore(deps): bump vite to 6.1
docs(readme): update install instructions
test(api): add edge cases for 401 handling
```

### Pièges courants


| ❌ Mauvais | Pourquoi | ✅ Corrigé |
| :--- | :--- | :--- |
| `add login` | Pas de type, pas de périmètre | `feat(auth): add login flow` |
| `feat: add login flow` | Pas de périmètre (*scope*) | `feat(auth): add login flow` |
| `feat(auth): Add login` | Majuscule au "A" | `feat(auth): add login` |
| `feat(auth): add login.` | Point final | `feat(auth): add login flow` |
| `feat(auth): add login` | Sujet de seulement 9 caractères | `feat(auth): add login flow` |

### Corriger un mauvais message de commit

```bash
git commit --amend                    # dernier commit
git rebase -i HEAD~3                  # commits plus anciens (marquer "reword")
```

## Hooks (Husky)

Quatre hooks imposent ces conventions automatiquement. Ils s'activent lors du `pnpm install` via le script `prepare`.


| Hook | Quand | Ce qu'il fait |
| :--- | :--- | :--- |
| `post-checkout` | Après un changement de branche | Valide le nom de la branche |
| `pre-commit` | Avant le commit | Exécute `lint-staged` (eslint + prettier sur les fichiers indexés) |
| `commit-msg` | Validation du message | Exécute commitlint, rejette les messages invalides |
| `pre-push` | Avant le push | Bloque les push vers `main`/`develop`, lance le type-check + les tests |

### Contourner un hook

```bash
git commit --no-verify -m "..."   # ignore pre-commit + commit-msg
git push --no-verify              # ignore pre-push
```

**Acceptable** pour les commits de travail en cours (*WIP*) jetables sur une branche privée que vous allez écraser (*squash*).
**Inacceptable** pour tout ce que vous avez l'intention de fusionner — contourner détruit l'utilité du processus.

## Déroulement complet du workflow

### Démarrer une fonctionnalité

```bash
git checkout develop && git pull
git checkout -b feature/my-thing develop
```

### Effectuer des modifications

```bash
git add <fichiers>
git commit -m "feat(scope): meaningful description here"
# pre-commit → formate les fichiers indexés
# commit-msg → valide le message
```

### Pousser (*Push*)

```bash
git push -u origin feature/my-thing
# pre-push → le contrôle de types + les tests doivent réussir
```

### Fusionner en retour

Via PR/MR sur le serveur distant (GitHub, GitLab, …). Ne jamais fusionner localement sans revue de code.

```bash
git checkout develop && git pull
git branch -d feature/my-thing
```

### Publier une version (develop → main)

```bash
git checkout -b release/0.2.0 develop
# Incrémenter la version, finaliser le CHANGELOG
git commit -m "release(version): bump to 0.2.0"
# PR release/0.2.0 → main, puis étiqueter main :
git tag -a v0.2.0 -m "Release 0.2.0" && git push origin v0.2.0
# Fusionner main en retour dans develop
git checkout develop && git merge --no-ff main
```

## Documents connexes

- [`01-typescript-style.md`](./01-typescript-style.md) — conventions de style de code
- [`02-file-organization.md`](./02-file-organization.md) — disposition des fichiers
- [`../frontend/01-getting-started.md`](../frontend/01-getting-started.md) — installation et exécution

[⬆ Retour à l'index des docs](../README.md)

---

_Dernière mise à jour : 12/05/2026_

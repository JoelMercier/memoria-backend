# 📚 Memoria Backend — Documentation

> Bienvenue dans la documentation du backend de Memoria. Voici votre feuille de route.

Cette documentation calque fidèlement la structure du dossier `docs/` du frontend pour garantir une parfaite cohérence. Elle est organisée en quatre grands axes : **architecture**, **guides backend**, **guides de base de données**, et **conventions**.

---

## 🏛 Architecture

Vue d'ensemble de la structure de l'API et du cycle de vie des requêtes à travers les différentes couches logicielles.


| Document | Sujet |
| :--- | :--- |
| [`architecture.md`](./architecture.md) | Architecture en couches, injection de dépendances, cycle de vie des requêtes, décisions architecturales. |

---

## 🛠️ Guides backend

Guides pratiques et concrets pour coder au sein de l'application.


| Document | Sujet |
| :--- | :--- |
| [`01-getting-started.md`](./backend/01-getting-started.md) | Installation, configuration, exécution du serveur, scripts. |
| [`02-oop-refresher.md`](./backend/02-oop-refresher.md) | Rappel rapide sur la POO : classes, instances, méthodes. Pour les étudiants. |
| [`03-database-connection.md`](./backend/03-database-connection.md) | Le singleton `DatabaseConnection` et le pool de connexions `pg`. |
| [`04-error-handling.md`](./backend/04-error-handling.md) | `ApiError`, fabriques, `HandlerService`, mapping HTTP dans Express 5. |
| [`05-validation-zod.md`](./backend/05-validation-zod.md) | Schémas Zod, DTOs, parsing à la frontière du contrôleur. |
| [`06-authentication-jwt.md`](./backend/06-authentication-jwt.md) | Rotation des tokens JWT, hachage Argon2id, middleware d'authentification, stratégie de liste noire. |
| [`07-testing-tdd.md`](./backend/07-testing-tdd.md) | Vitest, stratégies de bouchonnage (mocking), colocation, la boucle TDD. |
| [`08-deployment.md`](./backend/08-deployment.md) | Déploiement en production avec PM2 + Traefik sur un VPS. |

---

## 🗄️ Guides de base de données

Modèles et requêtes SQL de référence spécifiques à PostgreSQL.


| Document | Sujet |
| :--- | :--- |
| [`01-sql-guide.md`](./database/01-sql-guide.md) | Sécurité, indexation, types, relations, déclencheurs (triggers), principes KISS. |
| [`02-jsonb-and-search.md`](./database/02-jsonb-and-search.md) | Inspection des colonnes JSONB, filtrage avec `->>`, fonctions de longueur. |
| [`03-joins-and-relationships.md`](./database/03-joins-and-relationships.md) | `INNER JOIN` vs `LEFT JOIN`, tables pivots, agrégations de base. |
| [`04-aggregation-and-views.md`](./database/04-aggregation-and-views.md) | `JSON_AGG`, vues nommées, requêtes prêtes pour le tableau de bord, formats adaptés au frontend. |

---

## 📐 Conventions

Le document de référence "comment nous écrivons le code ici". Partagé avec le dépôt frontend — même style TypeScript, même flux de travail git.


| Document | Sujet |
| :--- | :--- |
| [`01-typescript-style.md`](./conventions/01-typescript-style.md) | TSDoc, visibilité, règles de nommage, structure des fichiers. |
| [`02-file-organization.md`](./conventions/02-file-organization.md) | Emplacement des fichiers et justifications. |
| [`03-git-workflow.md`](./conventions/03-git-workflow.md) | Branches, messages de commit, hooks husky. |

---

## 🧭 Ordre de lecture conseillé

Si vous découvrez le projet, lisez les documents dans cet ordre :

1. **[`architecture.md`](./architecture.md)** — pour comprendre la vue d'ensemble.
2. **[`conventions/03-git-workflow.md`](./conventions/03-git-workflow.md)** — pour assimiler le flux de travail avant votre premier commit.
3. **[`backend/01-getting-started.md`](./backend/01-getting-started.md)** — pour lancer l'API.
4. **[`backend/02-oop-refresher.md`](./backend/02-oop-refresher.md)** — si vos notions de classes et d'instances ont besoin d'un dépoussiérage.
5. **[`conventions/01-typescript-style.md`](./conventions/01-typescript-style.md)** — pour vous imprégner du style de code.
6. **[`backend/03-database-connection.md`](./backend/03-database-connection.md)** → **[`05-validation-zod.md`](./backend/05-validation-zod.md)** → **[`04-error-handling.md`](./backend/04-error-handling.md)** — pour comprendre la plomberie.
7. **[`backend/06-authentication-jwt.md`](./backend/06-authentication-jwt.md)** — gestion des accès et sécurité.
8. **[`backend/07-testing-tdd.md`](./backend/07-testing-tdd.md)** — écrivez votre première fonctionnalité, style TDD.

---

[⬆ Retour à la racine du projet](../README.md)

---

_Dernière mise à jour : 12/05/2026_

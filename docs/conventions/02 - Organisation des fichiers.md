# 📂 Organisation des fichiers

> Où vont les choses, et pourquoi. En cas de doute, ceci est la référence.

## Structure globale du projet

```text
memoria-backend/
├─ src/                     # Code source TypeScript
├─ database/                # SQL : migrations, seeders, triggers, vues
├─ scripts/                 # Automatisation Bash et JS/TS
├─ docs/                    # Cette documentation
├─ dist/                    # Sortie de build (ignorée par git)
├─ coverage/                # Rapports de couverture Vitest (ignorés par git)
├─ .husky/                  # Hooks Git (gérés par Husky)
├─ package.json
├─ tsconfig.json            # Configuration TS de base + alias de chemins
├─ tsconfig.build.json      # Configuration de build de production (exclut les tests)
├─ vitest.config.ts
├─ eslint.config.js         # Configuration plate ESLint (Flat config)
├─ .prettierrc.json
└─ .env.example
```

## `src/` — Source de l'application

Chaque sous-dossier correspond à une responsabilité dans l'architecture en couches.

```text
src/
├─ app.ts             # Configuration d'Express (middlewares, câblage des routes)
├─ server.ts          # Point d'entrée HTTP
├─ config/            # Singletons : DatabaseConnection, LoggerSingleton, SwaggerConfig, UploadConfig
├─ constants/
│  ├─ enums/          # Énumérations TypeScript partagées entre les couches (ContentType, Role, ...)
│  └─ zod/            # Schémas Zod, regroupés par domaine
├─ controllers/       # Gestionnaires HTTP (analysent la requête, appellent le service, formatent la réponse)
├─ dto/               # Objets de transfert de données (Data Transfer Objects : Création / Mise à jour / Réponse)
├─ entities/          # Types du domaine (BaseEntity, User, Item, Tag, Share)
├─ exceptions/        # ApiError + fabriques par domaine
├─ interfaces/        # Contrats pour l'injection de dépendances (préfixés par I)
├─ middlewares/       # AuthMiddleware (et futurs middlewares par route)
├─ repositories/      # Pg* (réels) + Mock* (en mémoire pour les tests)
├─ routes/v1/         # Fabriques de routeurs + racine de composition
├─ services/          # Logique métier (orchestre les dépôts, applique les règles)
├─ types/             # Types TS ambiants (express.d.ts, ...)
└─ utils/             # Assistants purs (SlugGenerator, TokenManager, PasswordHasher, ...)
```

### Quand placer un fichier et où

Arbre de décision :

```text
Est-ce un gestionnaire de requête HTTP ?       → src/controllers/
Est-ce une règle métier ?                      → src/services/
Est-ce du SQL brut sur PostgreSQL ?            → src/repositories/Pg*.ts
Est-ce une doublure de test en mémoire ?       → src/repositories/Mock*.ts
Est-ce un objet du domaine ?                   → src/entities/
Est-ce un schéma Zod ?                         → src/constants/zod/<domaine>/
Est-ce un type DTO dérivé ?                    → src/dto/<domaine>/
Est-ce une erreur typée ?                      → src/exceptions/
Est-ce une interface pour l'injection ?        → src/interfaces/<couche>/
Est-ce un singleton possédant une ressource ?  → src/config/
Est-ce un assistant pur (ni Express, ni SQL) ? → src/utils/
```

### Contrôleurs vs services vs dépôts (repositories)

La distinction la plus importante dans cette base de code :

- **Contrôleur** : Conscient de HTTP. Reçoit `req`/`res`, valide avec Zod, appelle le service, formate la réponse. **Pas de règles métier. Pas de SQL.**
- **Service** : Agnostique de HTTP. Reçoit des valeurs TypeScript pures, renvoie des valeurs TypeScript pures. Orchestre les dépôts et applique les règles métier. **Pas de `req`/`res`. Pas de `pg`.**
- **Dépôt (Repository)** : Communique avec PostgreSQL. Reçoit des valeurs pures, renvoie des entités. Enveloppe les erreurs `pg` dans des `ApiError` via des fabriques. **Pas de logique métier. Pas de HTTP.**

Heuristique : une méthode qui dit « cet utilisateur possède cette ressource » se trouve dans un service. Une méthode qui dit « SELECT … FROM items WHERE … » se trouve dans un dépôt. Une méthode qui dit « il manque un champ dans le corps de la requête » se trouve dans un contrôleur (ou, plus souvent, dans le schéma Zod invoqué par le contrôleur).

### Fichiers de dépôts (repositories)

Un fichier par entité et par implémentation :

```text
repositories/
├─ PgItemRepository.ts        # Implémentation réelle, communique avec PostgreSQL
├─ MockItemRepository.ts      # Doublure en mémoire pour les tests
├─ PgTagRepository.ts
├─ MockTagRepository.ts
└─ ...
```

Les deux implémentations correspondent à la même interface (par exemple `IItemRepository` dans `src/interfaces/repositories/`). La racine de composition en choisit une au démarrage.

### Fichiers de services

Un fichier par domaine métier :

```text
services/
├─ AuthService.ts           # Inscription, connexion, rafraîchissement, déconnexion
├─ BlacklistService.ts      # Jetons de rafraîchissement révoqués (en mémoire)
├─ ItemService.ts           # Règles des éléments + orchestration
├─ TagService.ts            # Règles des étiquettes + orchestration
├─ ShareService.ts          # Règles de partage public (génération de jeton, expiration)
├─ UserService.ts           # Profil, changement de mot de passe, suppression de compte
├─ UserExportService.ts     # Agrégateur d'exportation RGPD
└─ http/HandlerService.ts   # Middleware d'erreur global
```

### Fichiers DTO

Trois déclinaisons par domaine, toutes dans le même dossier :

```text
dto/item/
├─ CreateItemDto.ts          # Corps du POST  /items
├─ UpdateItemDto.ts          # Corps du PATCH /items/:id
└─ ResponseItemDto.ts        # Ce que l'API renvoie
```

Les types `CreateItemDto` et `UpdateItemDto` sont déduits des schémas Zod dans `constants/zod/item/`. `ResponseItemDto` est écrit à la main car il s'agit de la forme que votre service *produit*, et non de la forme qu'il *valide*.

### Fichiers d'interfaces (Préfixés par I)

```text
interfaces/
├─ controllers/IItemController.ts
├─ database/IDatabaseConnection.ts
├─ entities/IUser.ts
├─ http/IHandlerService.ts
├─ repositories/IItemRepository.ts
├─ security/IBlacklistService.ts
└─ services/IItemService.ts
```

Chaque classe concrète possède une interface correspondante. Le code dépend de l'interface — seule la racine de composition (`src/routes/v1/index.ts`) importe les implémentations concrètes.
## Tests — colocalisés, pas de dossier `tests/` à la racine

Les tests du back-end vivent **à côté du code qu'ils testent**, dans des dossiers `__tests__/` :

```text
src/services/
├─ TagService.ts
└─ __tests__/
   └─ TagService.test.ts

src/utils/
├─ SlugGenerator.ts
└─ __tests__/
   └─ SlugGenerator.test.ts
```

> Vous venez du front-end ? Le front-end utilise un dossier central `tests/` à la racine. Le back-end a choisi la colocalisation à la place. Les deux approches sont valables ; le back-end préfère la colocalisation car :
>
> - Les tests vivent à côté de l'implémentation qu'ils couvrent — plus faciles à trouver, plus faciles à remanier (*refactor*).
> - Renommer le fichier source dans votre EDI déplace le test avec lui.
> - Cela permet de voir en un coup d'œil si « ce fichier est bien testé » ou « ce fichier ne l'est pas ».

Le build exclut les fichiers de test de la production finale via `tsconfig.build.json` (`"exclude": ["src/**/*.test.ts"]`).

## `database/` — SQL pur

```text
database/
├─ migrations/
│  ├─ config/                 # 01-04 : rôles, extensions, types
│  ├─ tables/                 # 01-NN : définitions des tables (idempotentes)
│  └─ drop/                   # Scripts de nettoyage (utilisés par db:reset)
├─ seeders/                   # Données de test optionnelles
├─ triggers/                  # Fonctions PL/pgSQL + triggers
├─ views/                     # Vues nommées (v_*)
└─ queries/                   # SQL de référence, non exécuté par les migrations
```

Les fichiers de migration s'exécutent dans **l'ordre des noms de fichiers** (tri lexical), c'est pourquoi nous les préfixons par deux chiffres. Les fichiers dans `migrations/config/00_*.sql` sont ignorés par `pnpm db:migrate` car la création de la base de données et des rôles vit dans `scripts/init_db.sh`.

Toutes les migrations sont **idempotentes** — `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, `CREATE OR REPLACE VIEW`, `DROP TRIGGER IF EXISTS … CREATE TRIGGER …`. Réexécuter `pnpm db:migrate` ne doit jamais échouer.

## `scripts/` — Automatisation

```text
scripts/
├─ README.md                  # Documentation détaillée pour chaque script
├─ init_db.sh                 # Créer la base de données + rôle + schéma + permissions
├─ reset_db.sh                # Supprimer les tables (conserver la base de données/le rôle)
├─ nuke_db.sh                 # ☢️ Supprimer la base de données ET le rôle
├─ run_sql.sh                 # Exécuter n'importe quel fichier SQL avec l'utilisateur/base choisi
└─ gen-secrets.js             # Générer des secrets cryptographiques pour le .env
```

Voir [**`scripts/README.md`**](../../scripts/README.md) pour la référence complète — ce que fait chaque script, quand l'utiliser et les pièges courants.

> ⚠️ Certains scripts ici sont encore en `.js` (héritage de l'époque Express SSR en JS). Leur migration vers `.ts` fait partie des tâches de migration à faire (*TODO*) par l'étudiant.

## `docs/` — Cette documentation

Reflète la structure du dossier `docs/` du front-end :

```text
docs/
├─ README.md                          # Index
├─ architecture.md                    # Architecture en couches, injection de dépendances, cycle de vie des requêtes
├─ backend/
│  ├─ 01-getting-started.md
│  ├─ 02-oop-refresher.md
│  ├─ 03-database-connection.md
│  ├─ 04-error-handling.md
│  ├─ 05-validation-zod.md
│  ├─ 06-authentication-jwt.md
│  ├─ 07-testing-tdd.md
│  └─ 08-deployment.md
├─ database/
│  ├─ 01-sql-guide.md
│  ├─ 02-jsonb-and-search.md
│  ├─ 03-joins-and-relationships.md
│  ├─ 04-aggregation-and-views.md
│  └─ assets/                         # Diagrammes MCD, MLD, ERD
└─ conventions/
   ├─ 01-typescript-style.md
   ├─ 02-file-organization.md         # ← vous êtes ici
   └─ 03-git-workflow.md
```

Les préfixes numérotés définissent l'ordre de lecture.

## Les fichiers qui ne vont nulle part

Si vous n'arrivez pas à décider où va un fichier, cela signifie généralement que **le fichier en fait trop**. Divisez-le.

Exemples concrets :

- A service qui effectue également des appels `pg.query` bruts → extrayez le SQL dans un dépôt (repository).
- Un contrôleur qui contient une règle métier → déplacez la règle dans le service.
- Un utilitaire qui importe `express` → c'est un middleware, pas un utilitaire. Déplacez-le dans `middlewares/`.
- Un fichier sous `src/` encore en `.js` → migrez-le en `.ts`. La migration est documentée dans le fichier [`TODO.md`](../../TODO.md) du projet.

## Documents connexes

- [`01-typescript-style.md`](./01-typescript-style.md) — nommage, visibilité, TSDoc.
- [`../architecture.md`](../architecture.md) — l'architecture en couches que ces dossiers servent.
- [`../../scripts/README.md`](../../scripts/README.md) — les scripts d'automatisation en détail.

[⬆ Retour à l'index des docs](../README.md)

---

_Dernière mise à jour : 12/05/2026_

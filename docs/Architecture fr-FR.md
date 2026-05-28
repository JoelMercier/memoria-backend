# 🏛️ Architecture — Structure REST en Couches Strictes

> **En bref (TL;DR) :** Le backend est une API REST organisée en couches strictes. Chaque couche dépend de la suivante uniquement via des interfaces, jamais via des implémentations concrètes. L'assemblage complet (la composition) se fait au démarrage de l'application, dans un seul et unique fichier central.

## Pourquoi une architecture en couches (et pas du MVC)

À l'origine, le backend de Mémoria était une application MVC classique avec Express — des Modèles, des Vues (EJS) et des Contrôleurs. Le frontend étant désormais une application SPA séparée en Vue 3, la donne a totalement changé :

* **Plus de vœu de Vues** : Le "V" du MVC a disparu. L'API distribue du JSON binaire propre, pas des pages HTML.
* **Fin des "Modèles à tout faire"** : Dans le MVC traditionnel, le Modèle gère à la fois le SQL, les règles métiers et la sérialisation. Cela viole le principe de responsabilité unique (SRP) et transforme les fichiers en monstres ingérables.

Nous avons donc remplacé le MVC par une **architecture en couches épurée** (une version "Clean Architecture lite"). Chaque responsabilité possède son propre compartiment, et les dépendances pointent toujours exclusivement vers l'intérieur du Domaine.

---

## Les quatre couches de la forteresse

```text
┌──────────────────────────────────────────────────────────────────┐
│  CONTRÔLEUR     src/controllers/*.ts                             │
│                 Aiguilleur HTTP. Analyse la requête, bâtit le DTO,│
│                 appelle le service, formate la réponse via l'usine│
│                 ApiResponseFactory. Zéro logique métier. Zéro SQL.│
├──────────────────────────────────────────────────────────────────┤
│  SERVICE        src/services/*.ts                                │
│                 Règles métiers, contrôle des droits d'accès,     │
│                 orchestration. Appelle les dépôts. Inculte de    │
│                 tout protocole HTTP.                             │
├──────────────────────────────────────────────────────────────────┤
│  DÉPÔT          src/repositories/Pg*.ts                          │
│  (REPOSITORY)   Requêtes SQL physiques. Mappe les lignes ↔       │
│                 entités. Emballe les erreurs PG via des usines.  │
│                 Inculte de l'HTTP et des règles métiers.         │
├──────────────────────────────────────────────────────────────────┤
│  ENTITÉ         src/entities/*.ts                                │
│                 Types du Domaine. Snake_case en BDD ➔ camelCase   │
│                 ici. Zéro SQL, zéro HTTP, immuabilité nominale.  │
└──────────────────────────────────────────────────────────────────┘
```

Les DTOs (`src/dto/`) et les schémas de validation Zod (`src/constants/zod/`) gravitent autour de ces couches : ils définissent la géométrie des données qui franchissent les postes frontières de l'application.

---

## Cartographie concrète (Liaison des troupes)

Pour une fonctionnalité classique comme « lister les pépites d'un utilisateur », le pipeline de fichiers s'aligne ainsi :

```typescript
// 1️⃣ L'ENTITÉ — src/entities/Item.ts
export class Item extends BaseEntity {
  constructor(
    idItem: ItemId,
    public readonly idUser: UserId,
    public readonly contentType: ContentType,
    public title: string
  ) {
    super(idItem);
  }
}

// 2️⃣ LE DÉPÔT — src/repositories/PgItemRepository.ts
export class PgItemRepository implements IItemRepository {
  constructor(private readonly db: IDatabaseConnection) {}

  async findAllByUser(idUser: UserId): Promise<Item[]> {
    const result = await this.db.query<IItemRow>(
      'SELECT * FROM items WHERE user_id = fn_bin_to_uuid($1) ORDER BY created_at DESC',
      [this.toBuffer(idUser)]
    );
    return result.rows.map((row) => this.rowToItem(row));
  }
}

// 3️⃣ LE SERVICE — src/services/ItemService.ts
export class ItemService implements IItemService {
  constructor(
    private readonly itemRepo: IItemRepository,
    private readonly tagRepo: ITagRepository
  ) {}

  async listForUser(idUser: UserId): Promise<ResponseItemDto[]> {
    const items = await this.itemRepo.findAllByUser(idUser);
    return Promise.all(items.map((item) => this.toResponseDto(item)));
  }
}

// 4️⃣ LE CONTRÔLEUR — src/controllers/ItemController.ts
export class ItemController implements IItemController {
  constructor(private readonly service: IItemService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const items = await this.service.listForUser(req.user!.id);
    res.json(ApiResponseFactory.success(items));
  };
}
```

Quatre fichiers, quatre responsabilités distinctes, zéro cérémonie superflue. Chaque couche dialogue avec celle du dessous uniquement via son **interface de contrat** (`IItemService`, `IItemRepository`…), jamais en direct avec une classe concrète.

---

## Injection de dépendances — Par le constructeur

Chaque service et chaque dépôt reçoit ses outils de travail directement comme **paramètres de son constructeur**, typés contre les interfaces :

```typescript
constructor(
  private readonly itemRepo: IItemRepository,
  private readonly tagRepo: ITagRepository,
) {}
```
### Pourquoi les classes ici (et pas des objets littéraux comme sur le frontend)

Le frontend utilise `export const api = { ... }` — un objet littéraux — ce qui correspond parfaitement à la culture Composable de Vue 3.

Sur le backend, les **classes** sont beaucoup plus logiques :

* **Un état par instance** : Un dépôt conserve une référence vers le pool de connexions de la base de données. Un service conserve des références vers ses dépôts. Chaque instance possède sa propre identité nominale.
* **L'injection par constructeur** est beaucoup plus ergonomique que le curryfication (application partielle) ou les fonctions usines quand on commence à traîner plus de 3 dépendances.
* **Les mocks sont d'une simplicité enfantine** avec Vitest : il suffit de passer un mock qui implémente l'interface directement au constructeur lors des tests de combat.
* **Zéro piège avec le mot-clé `this`** dans les intercepteurs : nous déclarons les méthodes des contrôleurs sous forme de fonctions fléchées (`list = async (req, res) => { ... }`). De cette façon, `this` reste correctement lié au contexte de la classe quand Express invoque la routine.

Le coût ? Un tout petit peu plus de lignes de code qu'un simple `const itemService = { listForUser: async (id) => { ... } }`. Le bénéfice ? Un modèle d'injection uniforme sur tout le backend, testable partout, et sans aucune surprise de pointeur à l'exécution.

---

## Racine de composition (Composition Root)

Tout le câblage et l'assemblage des dépendances se font en **un seul et unique endroit** : `src/routes/v1/index.ts` [Mémoria]. C'est le seul fichier du projet qui a le droit d'importer les implémentations physiques concrètes (`PgItemRepository`, `ItemService`, `ItemController`) [Mémoria].

```typescript
// src/routes/v1/index.ts (racine de composition, version simplifiée)
const db = DatabaseConnection.getInstance();

// 🧱 1. Les Dépôts Physique (Repositories)
const itemRepo = new PgItemRepository(db);
const tagRepo = new PgTagRepository(db);
const itemTagRepo = new PgItemTagRepository(db);

// 🧱 2. Les Services Métiers
const itemService = new ItemService(itemRepo, tagRepo, itemTagRepo);

// 🧱 3. Les Contrôleurs
const itemController = new ItemController(itemService);

// 🧱 4. Les Routes de l'infrastructure Web
router.use('/items', createItemRouter(itemController));
```

Partout ailleurs dans le code, les couches dépendent exclusivement des **interfaces** (`IItemRepository`), jamais de `PgItemRepository`. Tu veux remplacer PostgreSQL par une simulation en mémoire vive (In-Memory) pour un test de combat ? Tu injectes `MockItemRepository`. Tu veux migrer vers MongoDB dans quelques mois ? Tu codes un `MongoItemRepository` et tu modifies le câblage uniquement ici [Mémoria]. Rien d'autre ne bouge dans l'application.

---

## Les DTOs aux postes frontières

Les DTOs (Data Transfer Objects) définissent la géométrie des structures de données qui franchissent les frontières de l'API. Nous avons trois variantes réglementaires par domaine :

```text
src/dto/item/
├─ CreateItemDto.ts       # POST  /items     Le corps (body) d'insertion
├─ UpdateItemDto.ts       # PATCH /items/:id Le corps (body) de modification
└─ ResponseItemDto.ts     # La structure renvoyée proprement au client Vue
```

Pourquoi s'embêter à créer un `ResponseItemDto` au lieu de renvoyer directement l'entité vivante `Item` issue du dépôt ?

* **Masquer les secrets d'infrastructure** : Une entité `User` transporte la propriété `passwordHash` — un `ResponseUserDto` l'exclut totalement pour des raisons de sécurité évidentes.
* **Assembler à la frontière** : Le `ResponseItemDto` peut embarquer un tableau de `tags` (récupéré par jointure via un autre dépôt) même si l'entité pure `Item` ne le possède pas dans son moule d'origine.
* **Gestion des versions** : Quand la géométrie de l'API change, seul le DTO bouge ; l'entité du Domaine reste stable et immuable.

Les schémas de validation Zod (situés dans `src/constants/zod/`) interceptent et valident les DTOs entrants au niveau du contrôleur avant que le moindre octet n'atteigne la couche des services métiers. Voir la spécification [`backend/05-validation-zod.md`](./backend/05-validation-zod.md).

---

## Les Singletons (Avec parcimonie)

Il n'existe que deux singletons authentifiés dans l'intégralité du code source :

* **`DatabaseConnection`** — Le pool de connexions de la bibliothèque `pg`. Un seul par processus machine.
* **`LoggerSingleton`** — L'outil de traçabilité Pino. Un seul par processus machine.

Ces deux composants sont accédés via la méthode `getInstance()` et sont **injectés** dans les constructeurs des classes qui en ont besoin. Ce sont des singletons uniquement parce qu'ils administrent des ressources matérielles rares (un pool de sockets TCP, un flux d'écriture sur le disque), et non pour une question de commodité de codage [Mémoria].

Tout le reste de l'arsenal est instancié proprement au démarrage dans la racine de composition [Mémoria].

---

## Erreurs — Typées et construites par des usines

Le flux des anomalies cliniques circule à travers la classe `ApiError` et ses usines spécialisées :

```typescript
throw ItemErrorFactory.notFound(idItem);
// ➔  Génère un ApiError(404, 'ITEM_NOT_FOUND', `Item ${idItem} introuvable`)
```

L'intercepteur de pannes global (`HandlerService`) attrape inconditionnellement tout ce qui remonte des couches basses et le convertit en une réponse JSON propre avec le bon code d'état HTTP. Les contrôleurs n'ont plus besoin de trimballer des blocs `try/catch` autour de chaque appel de service : Express 5 transfère automatiquement les promesses rejetées, et le middleware s'occupe de formater le colis final.

Consulte le document [`backend/04-error-handling.md`](./backend/04-error-handling.md) pour étudier le schéma complet des anomalies.

---

## Cycle de vie d'une requête HTTP

```text
                  Requête HTTP entrante
                            │
                            ▼
               ┌─────────────────────────┐
               │  Middlewares Globaux    │ helmet, cors, rate-limit, requestId
               └────────────┬────────────┘
                            │
                            ▼
               ┌─────────────────────────┐
               │   Aiguilleur (Router)   │ src/routes/v1/*
               └────────────┬────────────┘
                            │
                            ▼
               ┌─────────────────────────┐
               │    AuthMiddleware       │ Vérifie le jeton Bearer, arme req.user
               └────────────┬────────────┘
                            │
                            ▼
               ┌─────────────────────────┐
               │       Contrôleur        │ Analyse la req ➔ bâtit le DTO ➔ appelle le service
               └────────────┬────────────┘
                            │ Analyse du schéma Zod au poste frontière
                            ▼
               ┌─────────────────────────┐
               │         Service         │ Règles métiers, vérification des droits, orchestration
               └────────────┬────────────┘
                            │ Entité entrante ↔ Entité sortante
                            ▼
               ┌─────────────────────────┐
               │    Dépôt (Repository)   │ Requête SQL via pg, mapping ligne ↔ entité
               └────────────┬────────────┘
                            │
                            ▼
               ┌─────────────────────────┐
               │       PostgreSQL        │
               └────────────┬────────────┘
                            │ Lignes brutes (rows)
                            ▼
               ┌─────────────────────────┐
               │    Dépôt (Repository)   │ Restitue l'entité Domaine
               └────────────┬────────────┘
                            │
                            ▼
               ┌─────────────────────────┐
               │         Service         │ Construit le ResponseDto final
               └────────────┬────────────┘
                            │
                            ▼
               ┌─────────────────────────┐
               │       Contrôleur        │ Invoque ApiResponseFactory.success(dto)
               └────────────┬────────────┘
                            │
                            ▼
                   Réponse HTTP sortante
```

Si une anomalie ou une exception est levée à n'importe quel maillon de cette chaîne d'infrastructure, l'intercepteur global capture la bombe et produit instantanément une réponse JSON clinique et sécurisée.

---

## Motifs de conception (Design Patterns) appliqués

Des choix délibérés, réfléchis et *non* dictés par un effet de mode aveugle :

* **Architecture en couches** — Ségrégation des responsabilités par métier.
* **Injection de dépendances (par constructeur)** — Testabilité maximale, composants interchangeables au bit près.
* **Motif Dépôt (Repository Pattern)** : Abstraction complète des accès aux disques derrière un contrat d'interface propre.
* **Usine (Factory Pattern)** — Appliqué pour le formatage des anomalies (`ItemErrorFactory.notFound(...)`) et la normalisation des réponses (`ApiResponseFactory.success(...)`).
* **Singleton** — Restreint exclusivement aux gestionnaires de ressources matérielles critiques (`DatabaseConnection`, `LoggerSingleton`).
* **DTO** — Typage explicite des frontières pour isoler les entités vivantes du Domaine des flux réseaux extérieurs.

Bannis délibérément de l'architecture :

* ❌ **Conteneurs d'injection lourds (Inversify, tsyringe)** — Un marteau-pilon inutile pour la taille et la fluidité de notre base de code.

Pas de conteneur d'injection lourd (IoC), pas de décorateurs magiques, pas de `@Inject`. De simples classes TypeScript : explicites à la Java, légères et économiques à la JavaScript.
Bannis délibérément de l'architecture :

* ❌ **Conteneurs d'injection lourds (Inversify, tsyringe)** — Un marteau-pilon inutile pour la taille et la fluidité de notre base de code.
* ❌ **Décorateurs (`@Controller`, `@Service`)** — Évités pour ne pas enchaîner l'application à un framework propriétaire ou à des fonctionnalités expérimentales instables de TypeScript. De simples classes font le travail proprement.
* ❌ **ORMs (Prisma, TypeORM)** — Le SQL brut est plus honnête, infiniment plus performant à l'exécution, et permet un contrôle total de l'indexation.
* ❌ **MVC traditionnel** — Aucune vue HTML à générer sur le serveur, donc aucune raison de polluer le code.
* ❌ **Méthodes statiques généralisées (`Item.findAll(idUser)`)** — Un vice de fabrication qui couple le point d'appel à l'implémentation physique et détruit toute possibilité d'injection de dépendance.

---

## Documents connexes

* [`backend/03-database-connection.md`](./backend/03-database-connection.md) — Analyse en profondeur du singleton de connexion.
* [`backend/04-error-handling.md`](./backend/04-error-handling.md) — Étude de la classe `ApiError`, des usines et de l'intercepteur global.
* [`backend/05-validation-zod.md`](./backend/05-validation-zod.md) — Configuration des schémas de validation aux frontières de l'API.
* [`conventions/01-typescript-style.md`](./conventions/01-typescript-style.md) — Chartes graphiques de codage et règles de visibilité.

[⬆ Retour à l'index de la documentation](./README.md)

---
*Dernière mise à jour : 12/05/2026*

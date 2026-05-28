# 🏛️ Architecture Applicative — En Couches, REST-only
> **Auteur d'origine :** wisepanda.fr (Traduit, complété et mis à jour par Joël, Gaïa & Co)
> **Standard actuel :** Architecture Hexagonale épurée, Typage Nominal Fort (Style C++)

---

## 🧭 1. Pourquoi une architecture en couches (et pas du MVC)

Le backend initial de Mémoria était une application Express MVC classique (Modèles, Vues EJS, Contrôleurs). Le Front-End étant désormais une SPA (Single Page Application) Vue 3 totalement distincte, la donne change du tout au tout :

*   **Aucune vue HTML (No views)** : Le "V" de MVC a disparu. L'API livre exclusivement du JSON, jamais de pages HTML renderisées par le serveur.
*   **Fin des "Modèles tout-puissants" (Fat Models)** : Dans le MVC traditionnel, le modèle possède à la fois les requêtes SQL, les règles métier et la sérialisation. Cela viole violemment le Principe de Responsabilité Unique (SRP) et transforme le code en un bloc monolithique obèse indéboulonnable.

Nous avons donc remplacé le MVC par une **architecture en couches étanches** (un dérivé agile de la *Clean Architecture*). Chaque responsabilité possède son propre territoire, et les flèches de dépendance pointent exclusivement vers l'intérieur (le Domaine).

---

## 🗂️ 2. Les Quatre Couches de la Forteresse

┌──────────────────────────────────────────────────────────────────┐
│  1. CONTRÔLEUR  │ src/controllers/*.ts                           │
│                 │ Conscient du réseau HTTP. Analyse 'req', passe │
│                 │ les filtres, appelle le Service et moule la    │
│                 │ réponse JSON via ApiResponseFactory.           │
│                 │ ZÉRO logique métier. ZÉRO requête SQL brute.   │
├──────────────────────────────────────────────────────────────────┤
│  2. SERVICE     │ src/services/*.ts                              │
│                 │ Règles métier, contrôles d'accès, orchestration│
│                 │ des cas d'usages. Dialogue avec les dépôts.    │
│                 │ Ignore TOUT du protocole réseau HTTP.          │
├──────────────────────────────────────────────────────────────────┤
│  3. DÉPÔT       │ src/repositories/Pg*.ts                        │
│                 │ Requêtes SQL physiques. Mappe les lignes SQL ↔ │
│                 │ instances vivantes du Domaine.                 │
│                 │ Encapsule les pannes pg via ApiError.          │
│                 │ Ignore TOUT du réseau Web ou du métier.        │
├──────────────────────────────────────────────────────────────────┤
│  4. ENTITÉ      │ src/entities/*.ts                              │
│                 │ Cœur du Domaine. Traduit le snake_case SQL de  │
│                 │ la base en camelCase TypeScript.               │
│                 │ Aucun comportement en dehors de son identité.  │
└──────────────────────────────────────────────────────────────────┘

Les DTOs (`src/dto/`) et les validateurs de la douane Zod (`src/validation/zod/`) s'articulent autour de ces couches pour sécuriser et structurer la data au franchissement de chaque frontière.

---

## 📐 3. Cartographie Concrète Actuelle (Exemple: Consultation d'une Pépite)

Voici à quoi ressemblent nos quatre fichiers de responsabilités, expurgés de leurs anciennes primitives volantes :

```typescript
// 🏛️ 1. COUCHE ENTITÉ — src/entities/Item.ts
export class Item extends BaseEntity {
  public constructor(
    idItem: ItemId,                      // Armure nominale stricte (Plus de string volante !)
    public readonly idUser: UserId,      // Identification typée forte du propriétaire
    public readonly contentType: ContentType,
    public title: string
    // ...
  ) {
    super(idItem);
  }
}

// 🗄️ 2. COUCHE DÉPÔT (REPOSITORY) — src/repositories/PgItemRepository.ts
export class PgItemRepository implements IItemRepository {
  public constructor(private readonly m_rDb: IDatabaseConnection) {}

  public async findById(itemId: ItemId): Promise<Item | null> {
    const result = await this.m_rDb.query<IItemData>(
      'SELECT * FROM items WHERE id_item = $1',
      [itemId.valeur]                    // Extraction physique "C++ style" pour le driver SQL
    );
    return result.rows.length ? this.toEntity(result.rows) : null;
  }
}

// 🧠 3. COUCHE SERVICE (DOMAINE) — src/services/ItemService.ts
export class ItemService implements IItemService {
  public constructor(
    private readonly itemRepository: IItemRepository,
    private readonly itemTagRepository: IItemTagRepository,
    private readonly tagRepository: ITagRepository
  ) {}

  public async findById(userId: string, itemId: string): Promise<IItem> {
    const userMetierId = new UserId(userId); // Armure nominale immédiate au poste frontière
    const itemMetierId = new ItemId(itemId);

    const item = await this.itemRepository.findById(itemMetierId);
    if (!item) throw ItemErrorFactory.notFound(itemMetierId);
    if (item.idUser.valeur !== userMetierId.valeur) throw ItemErrorFactory.accessDenied(itemMetierId, userMetierId);

    return item;
  }
}

// 📡 4. COUCHE CONTRÔLEUR (EXPOSITION) — src/controllers/ItemController.ts
export class ItemController implements IItemController {
  public constructor(private readonly m_rItemService: IItemService) {}

  public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId = RequestIdGenerator.getFromRequest(req);
      const userMetierId: UserId = req.user!.id; // Déjà armé grâce à express.d.ts !
      const sParamId = String(req.params.id);

      const item = await this.m_rItemService.findById(userMetierId.valeur, sParamId);

      res.status(200).json(ApiResponseFactory.success('Pépite récupérée', ResponseItemDto.fromItem(item), requestId));
    } catch (err) {
      next(err);
    }
  }
}
```

Quatre fichiers, quatre frontières étanches. Chaque couche communique avec la couche inférieure via une **interface abstraite** (`IItemService`, `IItemRepository`), interdisant le couplage direct avec les classes physiques.

---

## 🧲 4. Injection de Dépendances par le Constructeur

Chaque service et chaque dépôt reçoit ses dépendances sous forme de **paramètres de constructeur**, typés exclusivement contre les interfaces mères :

```typescript
public constructor(
  private readonly itemRepository: IItemRepository,
  private readonly tagRepository: ITagRepository,
) {}
```

Pas de conteneur d'injection de dépendances (IoC Container) lourd, pas de décorateurs expérimentaux, pas de annotations magiques `@Inject`. De simples classes TypeScript pures : explicites comme du Java, agiles et légères comme du JavaScript.

### Pourquoi utiliser des Classes ici (et pas des objets littéraux comme le Front-End)
Le Front-End Vue 3 utilise l'export d'objets plats (`export const api = { ... }`), ce qui correspond à la culture fonctionnelle de Vue. Sur le Backend, **l'usage des classes est indispensable** pour trois raisons majeures :

1. **État par instance (Stateful identity)** : Un dépôt conserve une référence immuable vers le pool de connexions SQL. Un service détient les références de ses repositories injectés. Chaque instance possède une identité propre en RAM.
2. **Ergonomie du constructeur** : L'injection par constructeur est infiniment plus lisible et robuste que le currying fonctionnel ou les usines de fonctions dès lors qu'un cas d'usage dépasse 3 dépendances.
3. **Simplicité totale du Mocking** : Pour les suites de tests unitaires sous Vitest, il suffit de passer au constructeur une instance de bouchon (*Mock*) implémentant l'interface attendue pour isoler le test, sans manipuler de variables globales.

Le coût se résume à quelques lignes de déclaration supplémentaires. Le bénéfice est un schéma d'injection unifié sur tout le backend, testable partout, sans effet de bord.

---

## 🔑 5. La Racine de Composition (Composition Root)

Tout le câblage et l'assemblage du backend se déroulent en **un seul et unique endroit physique** : le fichier **`src/routes/v1/index.ts`**.

C'est l'unique fichier de toute la forteresse qui possède le droit d'importer les implémentations concrètes d'infrastructure basse (`PgItemRepository`, `ItemService`, `ItemController`). partout ailleurs, le code ignore l'existence des classes concrètes et ne connaît que les interfaces.

```typescript
// src/routes/v1/index.ts (Version simplifiée du câblage)
const db = DatabaseConnection.getInstance();

// 1. Instanciation des Dépôts physiques PostgreSQL
const itemRepo    = new PgItemRepository(db);
const tagRepo     = new PgTagRepository(db);
const itemTagRepo = new PgItemTagRepository(db);

// 2. Instanciation des Services métiers par Injection
const itemService = new ItemService(itemRepo, tagRepo, itemTagRepo);

// 3. Instanciation du Contrôleur d'exposition réseau
const itemController = new ItemController(itemService);

// 4. Branchement du routage réseau Express
router.use('/items', createItemRouter(itemController));
```

Si demain l'équipe décide de remplacer PostgreSQL par MongoDB ou d'exécuter les tests en mémoire vive, **aucune ligne de code de tes contrôleurs ou de tes services ne sera modifiée**. Il suffira de coder un `MongoItemRepository` implémentant `IItemRepository` et de modifier l'assemblage dans cette racine de composition. Tout le reste du système est immunisé.

---

## 📦 6. Les DTOs aux Frontières

Les DTOs (*Data Transfer Objects*) dictent la forme géométrique des données qui franchissent les frontières de l'API. Nous appliquons un triplet hermétique par domaine :
*   `CreateItemDto.ts` ➔ Reçoit et valide le payload du corps HTTP POST.
*   `UpdateItemDto.ts` ➔ Reçoit et valide les modifications partielles du HTTP PUT/PATCH.

---

## 👥 7. L'usage restrictif des Singletons (Sparing Company)

Seules deux briques d'infrastructure s'octroient le statut de **Singleton** dans tout le projet :
1. **`DatabaseConnection`** ➔ Gère le pool de connexions physiques PostgreSQL. Une seule instance par processus Node.js.
2. **`LoggerSingleton`** ➔ Pilote l'instance unique du journaliseur Pino. Un seul flux d'écriture par processus.

Toutes deux sont accédées via `.getInstance()` et injectées dans les constructeurs qui les réclament. Elles sont des singletons uniquement parce qu'elles possèdent des **ressources système rares et coûteuses** (un pool de sockets TCP vers la base de données, un flux d'écriture sur le disque), et jamais pour une simple commodité de codage. Tout le reste de l'application est instancié proprement à l'allumage dans la racine de composition.

---

## 🚨 8. Gestion des Erreurs — Typée, Typologie par Fabriques

Les anomalies transitent obligatoirement à travers la classe maîtresse `ApiError` et ses fabriques spécialisées et unifiées sous `src/exceptions/` :

```typescript
throw ItemErrorFactory.notFound(itemId);
// ➔ Engendre : ApiError(404, 'ITEM_NOT_FOUND', `Item ${itemId} non trouvé`)
```

Le middleware d'interception globale (`HandlerService`) capture n'importe quelle exception qui remonte des couches basses et la convertit automatiquement en une réponse JSON normalisée avec le bon code HTTP. Grâce à l'architecture moderne, les contrôleurs n'ont plus besoin d'écrire des blocs `try/catch` lourds autour de chaque appel de service : les promesses rejetées sont propagées automatiquement vers le middleware d'infrastructure centralisé.

---

## 🛤️ 9. Cycle de Vie Complet d'une Requête HTTP

```text
                  Requête HTTP brute du Client Web
                       │
                       ▼
            ┌──────────────────┐
            │ Middlewares Glob │  helmet, cors, rate-limit, requestId
            └─────────┬────────┘
                      │
                      ▼
            ┌──────────────────┐
            │   Route Matcher  │  src/routes/v1/*
            └─────────┬────────┘
                      │
                      ▼
            ┌──────────────────┐
            │  AuthMiddleware  │  Vérifie le jeton Bearer, peuple req.user (avec UserId)
            └─────────┬────────┘
                      │
                      ▼
            ┌──────────────────┐
            │    Contrôleur    │  Décode req ➔ Instancie le DTO ➔ Appelle le Service
            └─────────┬────────┘
                      │ Schéma Zod validé
                      ▼
            ┌──────────────────┐
            │     Service      │  Règles métier, vérification d'ownership, orchestration
            └─────────┬────────┘
                      │ Entité Domaine en entrée / sortie
                      ▼
            ┌──────────────────┐
            │    Dépôt (Repo)  │  Exécution SQL via pg, mapping Ligne SQL ➔ Entité
            └─────────┬────────┘
                      │
                      ▼
            ┌──────────────────┐
            │   PostgreSQL     │
            └─────────┬────────┘
                      │ Lignes physiques SQL (rows)
                      ▼
            ┌──────────────────┐
            │    Dépôt (Repo)  │  Entité du Domaine instanciée et renvoyée
            └─────────┬────────┘
                      ▼
            ┌──────────────────┐
            │     Service      │  Construit le ResponseDto filtré
            └─────────┬────────┘
                      ▼
            ┌──────────────────┐
            │    Contrôleur    │  Génère la réponse : ApiResponseFactory.success(dto)
            └─────────┬────────┘
                      ▼
                  Réponse HTTP unifiée livrée au Front-End
```

Si une anomalie survient à n'importe quel maillon de cette chaîne, l'exécution s'interrompt et le middleware d'erreur global capture l'exception pour fabriquer un JSON propre.

---

## 🎨 10. Patrons de Conception (Design Patterns) Appliqués

Des choix délibérés, réfléchis, et **à l'opposé du copier-coller aveugle (*cargo-culting*)** :

*   **Architecture en couches** : Séparation stricte des responsabilités par territoire technique.
*   **Injection de Dépendances (DI par constructeur)** : Testabilité absolue et couplage lâche.
*   **Patron Repository** : Abstraction totale de l'accès aux données derrière des interfaces étanches.
*   **Patron Fabrique (Factory)** : Centralisation pour les erreurs (`ItemErrorFactory`) et pour les réponses réseau (`ApiResponseFactory`).
*   **Singleton** : Réservé exclusivement aux verrous de ressources système critiques (`DatabaseConnection`, `LoggerSingleton`).
*   **DTO** : Types de frontières explicites pour décorréler les structures d'affichage des entités du cœur.

### Choix d'ingénierie délibérément ÉVITÉS :
*   ❌ **Les Conteneurs d'IoC lourds (Inversify, tsyringe)** : Véritable sur-ingénierie inutile (*overkill*) pour la volumétrie de cette application.
*   ❌ **Les Décorateurs (`@Controller`, `@Service`)** : Évités pour interdire toute adhérence magique à un framework ou à des fonctionnalités expérimentales de TypeScript. Des classes pures font parfaitement le travail.
*   ❌ **Les ORMs lourds (Prisma, TypeORM)** : Le SQL brut écrit à la main est plus honête, plus performant, plus transparent, et offre une maîtrise totale de l'infrastructure d'indexation.
*   ❌ **Le pattern MVC traditionnel** : Aucune vue HTML à gérer sur le serveur, donc aucune utilité.
*   ❌ **Le pattern Static-Everywhere (`Item.findAll()`)** : Couple mortellement le site d'appel à l'implémentation d'infrastructure basse et détruit toute possibilité d'injection de dépendances et de tests isolés.

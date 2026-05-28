# 🗺️ Parcours d'Exécution Technique : `POST /v1/items` (Avec Gestion des Tags)

Ce document cartographie le fil d'Ariane théorique et séquentiel d'une requête HTTP Express de création de pépite au sein de l'écosystème **[Mémoria]**. Il détaille l'acheminement des données à travers les frontières de l'Hexagone applicatif, de la primitive brute du Web jusqu'à l'ancrage immuable en base de données.

---

## 🛤️ Étape 1 : L'Aiguillage des URL (La Tour de Contrôle)
L'application Express reçoit une requête HTTP `POST` sur l'URL `http://localhost:5432/v1/items`.

*   **Fichier** : `src/routes/v1/index.ts`
*   **Classe / Fonction** : `createV1Router()`
*   **Mécanique** : Le routeur principal intercepte le préfixe `/items`, active le verrou de sécurité et le bouclier d'authentification `authMiddleware.requireAuth()`. Ce middleware extrait la session et injecte l'identifiant de l'acteur connecté dans le contexte de la requête (`req.user.id`).
*   **Qui appelle qui** : L'index passe le relais au routeur satellite dédié aux pépites.
*   **Arguments** : `(itemController)` fourni lors de l'assemblage de la Tour de Contrôle.
*   **Ligne d'action** :
    ```typescript
    v1.use('/items', authMiddleware.requireAuth(), createItemRouter(itemController));
    ```

---

## 🛤️ Étape 2 : Le Routeur Satellite (`ItemRouter`)
*   **Fichier** : `src/routes/v1/item.routes.ts`
*   **Classe / Fonction** : `createItemRouter(itemController: ItemController)`
*   **Mécanique** : Le sous-routeur capte la route racine `/` associée au verbe HTTP `POST` et intercepte le payload brut (`req.body`).
*   **Qui appelle qui** : Express appelle la méthode dédiée du contrôleur en sécurisant son contexte d'exécution via un `.bind()`.
*   **Arguments** : `(req, res, next)` fournis nativement par le moteur Express.
*   **Ligne d'action** :
    ```typescript
    router.post('/', itemController.create.bind(itemController));
    ```

---

## 🛂 Étape 3 : Le Douanier HTTP (`ItemController`)
L'infrastructure s'efface pour entrer dans les frontières du Domaine métier. Le but est de purifier le brut du Web.

*   **Fichier** : `src/controllers/ItemController.ts`
*   **Classe** : `ItemController`
*   **Méthode** : `public async create(req: Request, res: Response, next: NextFunction): Promise<void>`
*   **Arguments reçus** : `(req: Request, res: Response, next: NextFunction)`
*   **Cinématique interne** :
    1.  **Extraction de l'Auteur** : Appelle sa méthode privée `this.getUserId(req)`. Grâce au check polymorphe (`instanceof UserId`), elle extrait ou forge le Value Object **`UserId`** depuis `req.user.id`.
    2.  **La Validation Zod** : Le contrôleur envoie le corps de la requête à la douane de validation.
        *   **Fichier** : `src/constants/zod/item/createItem.ts` (ou dossier validation correspondant).
        *   **Mécanique** : Exécute le schéma de parsing Zod (ex: `CreateItemSchema.parse(req.body)`). Si les données sont corrompues (titre manquant, type invalide), Zod lève une exception immédiate (*Fail-Fast*) qui court-circuite le fichier et atterrit dans le `catch` via `next(err)`.
    3.  **Le Scellage du DTO** : Si les données sont valides, elles sont emprisonnées de manière immuable dans un DTO applicatif : `const dto = new CreateItemDto(validatedBody);`.
*   **Qui appelle qui** : Le contrôleur délègue la responsabilité de la création au service de domaine.
*   **Arguments passés** : `(userId, dto)`
*   **Ligne d'action** :
    ```typescript
    const item = await this.itemService.create(userId, dto);
    ```

---

## 🧠 Étape 4 : L'Orchestrateur Métier (`ItemService`)
*   **Fichier** : `src/services/ItemService.ts`
*   **Classe** : `ItemService`
*   **Méthode** : `public async create(userId: string, dto: CreateItemDto): Promise<IItem>`
*   **Arguments reçus** : `(userId: string, dto: CreateItemDto)`
*   **Cinématique interne** :
    1.  **Forger l'Auteur** : Le service enveloppe la string brute reçue dans son Value Object : `const userMetierId = new UserId(userId);`.
    2.  **Calcul du Permalien** : Génère automatiquement le slug si absent via `SlugGenerator.generate(dto.title)`.
    3.  **Contrôles d'Unicité** : Interroge `itemRepository.findBySlug` et `itemRepository.findByTitle`. Si le titre ou le slug existe déjà pour cet utilisateur ➡️ lève une exception d'unicité via `ItemErrorFactory`.
    4.  **La Douane des Étiquettes** : Il convertit les IDs bruts reçus en un tableau de **`TagId`**. Si des tags sont présents, il appelle sa méthode privée `this.validateTagOwnership(userMetierId, domainTagIds)` qui interroge `tagRepository.findByIds` et vérifie si chaque étiquette appartient légitimement à l'utilisateur. Si triche ou tag introuvable ➡️ lève une exception d'accès refusé via `TagErrorFactory`.
    5.  **Allocation de l'Identifiant d'Acier** : Le service forge un identifiant unique fort 128-bit à la volée : `idItem: new ItemId(randomUUID())`.
    6.  **Assemblage du Sac de Données** : Il construit la structure passive conforme au contrat d'interface `IItemData` attendu par la persistance (`idItem`, `idUser`, `contentType`, `title`, etc.).
*   **Qui appelle qui (Action 1/2)** : Le service ordonne l'écriture de la pépite au dépôt de persistance.
*   **Arguments passés** : `(data: IItemData)`
*   **Ligne d'action** : `const item: Item = await this.itemRepository.create(data);`
*   **Qui appelle qui (Action 2/2)** : Si des étiquettes étaient fournies, le service ordonne au dépôt de jointure de lier la pépite à ses tags en base.
*   **Arguments passés** : `(item.getItemId(), domainTagIds)`
*   **Ligne d'action** : `await this.itemTagRepository.sync(item.getItemId(), domainTagIds);`

---

## 🗄️ Étape 5 : Les Ouvriers de Persistance (`PgItemRepository` & `PgItemTagRepository`)
*   **Fichier** : `src/repositories/PgItemRepository.ts` & `PgItemTagRepository.ts`
*   **Mécanique** : Les dépôts cassent l'armure de nos Value Objects (`.valeur`) pour alimenter le driver PostgreSQL.
*   **Le SQL Effectivement Exécuté (Action 1 : Insertion de la Pépite)** :
    ```sql
    INSERT INTO items (
      id_item, user_id, content_type, title, slug, content, source_author, thumbnail_url, metadata, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()
    ) RETURNING id_item, user_id, content_type, title, slug, content, source_author, thumbnail_url, metadata, created_at, updated_at;
    ```
    *   *Paramètres injectés (`$1` à `$9`)* : `[data.idItem.valeur, data.idUser.valeur, data.contentType.code, data.title, data.slug, data.content, data.sourceAuthor, data.thumbnailUrl, JSON.stringify(data.metadata)]`
*   **Le SQL Effectivement Exécuté (Action 2 : Liaison des Tags dans la table de jointure)** :
    ```sql
    -- Nettoie les anciennes liaisons s'il y en avait, puis insère les nouvelles de manière unifiée
    INSERT INTO item_tags (id_item, id_tag) VALUES ($1, $2);
    ```
    *   *Paramètres injectés* : `[itemId.valeur, tagId.valeur]` pour chaque étiquette présente dans le tableau.

---

## 🏛️ Étape 6 : Le Modèle Métier Vivant (`Item`)
*   **Fichier** : `src/entities/Item.ts`
*   **Classe** : `Item`
*   **Mécanique** : Le constructeur reçoit le sac de données retourné par la base. Il invoque `super(data)` (classe `BaseEntity`) pour figer l'audit temporel historique, puis cadenasse ses variables internes sous l'armure de la notation hongroise immuable (`m_idItem`, `m_sTitle`, etc.). L'entité vivante remonte toute la chaîne de responsabilités jusqu'au contrôleur.

---

## 🌐 Étape 7 : La Sérialisation Réseau & l'Exposition HTTP
De retour dans la méthode `ItemController.create`, l'entité vivante est réceptionnée.

*   **Fichier** : `src/dto/item/ResponseItemDto.ts`
*   **Classe** : `ResponseItemDto`
*   **Méthode** : `public static fromItem(item: Item): ResponseItemDto`
*   **Mécanique** : La factory statique extrait les données de l'entité exclusivement via ses getters métiers fonctionnels unifiés (`item.getItemId().valeur`, `item.getTitle()`). Elle purge au passage les méthodes internes et les structures d'infrastructure pour générer un sac de données JSON passif et sécurisé pour le Web.
*   **Clôture HTTP** : Le contrôleur transmet le DTO purifié dans le canal de réponse Express avec un code de succès strict `201 Created` :
    ```typescript
    res.status(201).json(
      ApiResponseFactory.success('Pépite créée avec succès', { item: ResponseItemDto.fromItem(item) }, requestId)
    );
    ```

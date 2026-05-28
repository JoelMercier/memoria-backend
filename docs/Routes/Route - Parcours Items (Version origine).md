# 🏺 Parcours d'Exécution Historique : `POST /v1/items` (Version d'Origine)

Ce document retrace le parcours d'une requête de création de pépite dans la version initiale du projet, avant l'introduction de la notation hongroise, des Smart Enums et des Value Objects d'acier.

---

## 🛤️ Étape 1 : L'Aiguillage des URL (La Tour de Contrôle)
La requête HTTP `POST` arrive sur le serveur.

*   **Fichier** : `src/routes/v1/index.ts`
*   **Mécanique** : L'index intercepte la route. L'authentification est gérée de manière primitive. Le middleware d'authentification extrait l'identifiant utilisateur et l'injecte sous forme de simple chaîne de caractères brute (`string`) dans `req.user.id`.
*   **Ligne d'action** :
    ```typescript
    v1.use('/items', authMiddleware.requireAuth(), createItemRouter(itemController));
    ```

---

## 🛤️ Étape 2 : Le Routeur Satellite (`ItemRouter`)
*   **Fichier** : `src/routes/v1/item.routes.ts`
*   **Mécanique** : Le routeur capte le `POST /`. Il délègue l'exécution à la méthode du contrôleur.
*   **Ligne d'action** :
    ```typescript
    router.post('/', itemController.create.bind(itemController));
    ```

---

## 🛂 Étape 3 : Le Contrôleur Ancien Régime (`ItemController`)
Dans l'ancienne version, le contrôleur souffrait d'un manque d'encapsulation. Il manipulait des objets littéraux ouverts et des variables d'infrastructure.

*   **Fichier** : `src/controllers/ItemController.ts`
*   **Méthode** : `public async create(req: Request, res: Response, next: NextFunction): Promise<void>`
*   **Cinématique interne** :
    1.  **Extraction Primitive** : L'identifiant de l'utilisateur est extrait sous forme de chaîne de caractères pure (`const userId: string = req.user.id;`), sans aucune vérification d'intégrité ni typage fort.
    2.  **La Validation Zod** : Le corps de la requête (`req.body`) est passé au schéma Zod d'origine.
        *   **Fichier** : `src/constants/zod/item/createItem.ts`
    3.  **L'Absence de DTO de Restriction** : Les données validées par Zod ne sont pas encapsulées dans une classe DTO métier protectrice. Elles restent stockées dans un objet JavaScript passif et modifiable (un dictionnaire anonyme).
*   **Qui appelle qui** : Le contrôleur passe directement les primitives au service.
*   **Arguments passés** : Une `string` pour l'utilisateur, et l'objet littéral brut pour les données.
*   **Ligne d'action** :
    ```typescript
    // ❌ Inversion conceptuelle : passage de primitives de l'infrastructure vers le Domaine
    const item = await this.itemService.create(userId, req.body);
    ```

---

## 🧠 Étape 4 : Le Service Ancien Régime (`ItemService`)
Le service n'agissait pas en gardien du Domaine, mais en bête passe-plat d'infrastructure.

*   **Fichier** : `src/services/ItemService.ts`
*   **Méthode** : `public async create(userId: string, data: any): Promise<any>`
*   **Cinématique interne** :
    1.  **Vérification de Propriété Floue** : Si des `tagIds` sont fournis, le service appelle `tagRepository.findByIds(data.tagIds)`. La comparaison se fait par des égalités de chaînes primitives (`t.userId === userId`). Si un tag n'appartient pas à l'utilisateur, le rejet lève une erreur générique tardive.
    2.  **Calcul du Permalien** : Génération du slug via le titre.
    3.  **Création du Sac de Données Sans Type Nominal** : Le service forge un objet de données. L'identifiant de la pépite est généré soit par une string incrémentale, soit par un UUID nu au format texte.
        ```typescript
        const itemData = {
          // ❌ Pas de ItemId, pas de UserId, uniquement des chaînes de caractères volages
          id: randomUUID(),
          userId: userId,
          contentType: data.contentType, // Une simple string ("livre"), pas un Smart Enum
          title: data.title,
          slug: slug,
          content: data.content,
          sourceAuthor: data.sourceAuthor,
          thumbnailUrl: data.thumbnailUrl,
          metadata: data.metadata
        };
        ```
*   **Qui appelle qui** : Le service transmet cet objet littéral au repository.
*   **Ligne d'action** : `const item = await this.itemRepository.create(itemData);`

---

## 🗄️ Étape 5 : Le Dépôt Historique (`PgItemRepository`)
*   **Fichier** : `src/repositories/PgItemRepository.ts`
*   **Méthode** : `public async create(data: any): Promise<any>`
*   **Le SQL Effectivement Exécuté** :
    ```sql
    INSERT INTO items (id, user_id, content_type, title, slug, content, source_author, thumbnail_url, metadata)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
    ```
    *   *Paramètres injectés* : `[data.id, data.userId, data.contentType, data.title, data.slug, data.content, data.sourceAuthor, data.thumbnailUrl, data.metadata]`
*   **Résurrection Métier Défaillante** : Le repository récupère la ligne SQL brute et l'instancie dans l'ancienne entité.

---

## 🏛️ Étape 6 : L'Ancienne Entité Anémique (`Item`)
*   **Fichier** : `src/entities/Item.ts`
*   **Mécanique** : L'entité d'origine est une **entité anémique** (un simple sac de propriétés publiques). Elle n'a aucune variable privée `m_`, pas de notation hongroise protectrice, et expose ses champs directement en écriture publique (`item.title = "nouveau"`). L'objet remonte au contrôleur sans aucune garantie d'immuabilité.

---

## 🌐 Étape 7 : L'Exposition HTTP Féodale
De retour dans le contrôleur.

*   **Fichier** : `src/dto/item/ResponseItemDto.ts`
*   **Mécanique** : L'ancien DTO de réponse n'utilise pas de fonctions d'extraction strictes. Il lit les propriétés de l'entité anémique avec des **getters capitalisés de style C#** (comme `item.Title`, `item.Slug`, `item.idUser`), créant une dissonance cognitive constante avec les minuscules de la base de données.
*   **Clôture HTTP** :
    ```typescript
    res.status(201).json({ status: 'success', data: { item: ResponseItemDto.fromItem(item) } });
    ```

# 🪓 Parcours Industriel : `POST /v1/tags` (Version Actuelle)

Ce document retrace le fil d'Ariane moderne et sécurisé de la création d'une étiquette sous l'Armure Nominale de [Mémoria].

### Tracks 1 : L'Aiguillage Express
*   **Fichier** : `src/routes/v1/index.ts`
*   **Action** : La Tour de Contrôle oriente la requête vers le routeur des tags. Le middleware de sécurité valide le jeton et transmet l'identité de session.
*   **Ligne d'action** : `v1.use('/tags', authMiddleware.requireAuth(), createTagRouter(tagController));`

### Tracks 2 : Le Douanier HTTP
*   **Fichier** : `src/controllers/TagController.ts`
*   **Méthode** : `public async create(req: Request, res: Response, next: NextFunction): Promise<void>`
*   **Cinématique** :
    1. Appel de `this.getUserId(req)` : protection polymorphe `instanceof UserId` pour sécuriser la frontière d'infrastructure Express et retourner un véritable objet-valeur **`UserId`**.
    2. Les primitives du corps de la requête sont immédiatement nettoyées et scellées de manière immuable dans une classe de transport dédiée : `const dto = new CreateTagDto(req.body);`.
*   **Appel** : `const tag = await this.tagService.create(userId, dto);`

### Tracks 3 : L'Orchestrateur Métier
*   **Fichier** : `src/services/TagService.ts`
*   **Méthode** : `public async create(userId: UserId, dto: CreateTagDto): Promise<Tag>`
*   **Cinématique** : Le service reçoit des types forts. Il valide d'abord l'unicité nominale du tag pour cet utilisateur précis. Il forge ensuite un identifiant unique fort 128-bit à la volée : `idTag: new TagId(randomUUID())`. Il assemble le sac de données structurel `ITagData` en liant le `UserId` et le `TagId` d'acier.

### Tracks 4 : L'Ouvrier de Persistance
*   **Fichier** : `src/repositories/PgTagRepository.ts`
*   **Méthode** : `public async create(data: ITagData): Promise<Tag>`
*   **SQL Exécuté** :
    ```sql
    INSERT INTO tags (id_tag, user_id, tag_name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())
    RETURNING id_tag, user_id, tag_name, created_at, updated_at;
    ```
*   **Primitives** : Le dépôt casse l'armure nominale (`data.idTag.valeur`, `data.idUser.valeur`) uniquement à la frontière stricte de la base de données. L'instance globale `DatabaseConnection` exécute la requête SQL préparée et renvoie les lignes pour instancier l'entité. Le dépôt implémente également l'obligation contractuelle `.findAll()` héritée d'**`IBaseRepository`**.

### Tracks 5 : L'Entité & l'Exposition Réseau
*   **Fichier** : `src/entities/Tag.ts` & `src/dto/tag/ResponseTagDto.ts`
*   **Cinématique** : L'entité `Tag` protège son libellé et ses identifiants derrière sa notation hongroise immuable (`m_idTag`, `m_sTagName`). De retour au contrôleur, la factory statique `ResponseTagDto.fromTag(tag)` extrait les données proprement via la méthode sémantique unifiée en minuscules **`tag.getTagName()`** avant de valider la réponse HTTP `201 Created`.

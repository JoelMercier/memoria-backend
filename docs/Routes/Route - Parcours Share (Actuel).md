# 🪓 Parcours Industriel : `POST /v1/shares` (Version Actuelle)

Ce document retrace le fil d'Ariane moderne et sécurisé de la génération d'un partage public sous l'Armure Nominale de [Mémoria].

### Tracks 1 : L'Aiguillage Express
*   **Fichier** : `src/routes/v1/index.ts`
*   **Action** : La Tour de Contrôle oriente le flux vers le routeur des partages. L'authentification a déjà nominalisé l'identité de l'acteur en arrière-plan.
*   **Ligne d'action** : `v1.use('/shares', authMiddleware.requireAuth(), createShareRouter(shareController));`

### Tracks 2 : Le Douanier HTTP
*   **Fichier** : `src/controllers/ShareController.ts`
*   **Méthode** : `public async create(req: Request, res: Response, next: NextFunction): Promise<void>`
*   **Cinématique** :
    1. Appel de `this.getUserId(req)` : protection polymorphe `instanceof UserId` pour sécuriser la frontière d'infrastructure Express et retourner un véritable objet-valeur **`UserId`**.
    2. Les primitives du corps de la requête sont immédiatement nettoyées via Zod et scellées de manière immuable dans une classe de transport dédiée : `const dto = new CreateShareDto(validatedBody);`.
*   **Appel** : `const share = await this.shareService.create(userId, dto);`

### Tracks 3 : L'Orchestrateur Métier
*   **Fichier** : `src/services/ShareService.ts`
*   **Méthode** : `public async create(userId: UserId, dto: CreateShareDto): Promise<Share>`
*   **Cinématique** :
    1. **Contrôle d'Ownership Étanche** : Le service interroge le dépôt des pépites. La vérification de propriété est absolue en comparant les valeurs UUID sous-jacentes : `if (item.getUserId().valeur !== userId.valeur)`. Si triche ➡️ lève une exception d'accès refusé via `ItemErrorFactory`.
    2. **Allocation d'Acier** : Le service forge un identifiant unique fort 128-bit à la volée : `idShare: new ShareId(randomUUID())`. Il assemble le sac de données structurel `IShareData` en encapsulant proprement le bloc de configuration immuable `IAccessConfig`.

### Tracks 4 : L'Ouvrier de Persistance
*   **Fichier** : `src/repositories/PgShareRepository.ts`
*   **Méthode** : `public async create(data: IShareData): Promise<Share>`
*   **SQL Exécuté** :
    ```sql
    INSERT INTO shares (id_share, item_id, recipient_email, share_token, access_config, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING id_share, item_id, recipient_email, share_token, access_config, created_at, updated_at;
    ```
*   **Primitives** : Le dépôt casse l'armure nominale (`data.idShare.valeur`, `data.itemId.valeur`) uniquement à la frontière de la base de données. L'objet `access_config` est proprement sérialisé en JSON string. L'instance globale `DatabaseConnection` exécute la requête préparée et ressuscite l'entité.

### Tracks 5 : L'Entité & l'Exposition Réseau
*   **Fichier** : `src/entities/Share.ts` & `src/dto/share/ResponseShareDto.ts`
*   **Cinématique** : L'entité `Share` cadenasse son état derrière sa notation hongroise immuable (`m_idShare`, `m_sShareToken`). De retour au contrôleur, la factory statique `ResponseShareDto.fromShare(share, baseUrl)` extrait les données proprement via les signatures de fonctions métiers unifiées en minuscules : `share.getShareToken()`, `share.getAccessConfig()`. Elle génère l'URL absolue complète et renvoie la réponse HTTP `201 Created`.

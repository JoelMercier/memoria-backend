# 🏺 Parcours Historique : `POST /v1/shares` (Version d'Origine)

Ce document retrace le fil d'Ariane initial de la création d'un lien de partage public avant la refonte architecturale [Mémoria].

### Tracks 1 : L'Aiguillage Express
*   **Fichier** : `src/routes/v1/index.ts`
*   **Action** : Express intercepte le verbe `POST` sur le préfixe `/shares`. Le middleware d'authentification extrait l'identifiant de l'auteur et l'injecte sous forme de simple chaîne primitive brute (`string`) dans le contexte de la requête (`req.user.id`).
*   **Ligne d'action** : `v1.use('/shares', authMiddleware.requireAuth(), createShareRouter(shareController));`

### Tracks 2 : Le Douanier HTTP
*   **Fichier** : `src/controllers/ShareController.ts`
*   **Méthode** : `public async create(req: Request, res: Response, next: NextFunction)`
*   **Cinématique** :
    1. L'identifiant de l'utilisateur est extrait en texte nu : `const userId: string = req.user.id;`.
    2. L'identifiant de la pépite à partager (`itemId`) transite sous forme de simple chaîne textuelle `string` primitive.
    3. Les données du corps de la requête (`req.body`) ne sont pas encapsulées dans une classe DTO protectrice et restent modifiables.
*   **Appel** : `await this.shareService.create(userId, req.body);`

### Tracks 3 : L'Orchestrateur Métier
*   **Fichier** : `src/services/ShareService.ts`
*   **Méthode** : `public async create(userId: string, data: any)`
*   **Cinématique** :
    1. **Contrôle d'Ownership Flou** : Le service interroge le dépôt pour récupérer la pépite et vérifie la propriété par une simple égalité de chaînes primitives : `if (item.userId !== userId)`.
    2. **Génération brute** : Il génère un identifiant textuel nu pour le partage, fabrique un token de sécurité aléatoire en texte nu (`string`) et assemble un objet littéral passif sans type nominal :
        ```typescript
        const shareData = { id: randomUUID(), itemId: data.itemId, shareToken: randomUUID(), accessConfig: data.accessConfig };
        ```

### Tracks 4 : L'Ouvrier de Persistance
*   **Fichier** : `src/repositories/PgShareRepository.ts`
*   **Méthode** : `public async create(data: any)`
*   **SQL Exécuté** :
    ```sql
    INSERT INTO shares (id, item_id, share_token, access_config) VALUES ($1, $2, $3, $4) RETURNING *;
    ```
*   **Primitives** : Le champ `access_config` contenant les restrictions (comme la date d'expiration) est envoyé sous forme de texte ou de JSON brut sans validation d'objet. La ligne retournée est instanciée dans une entité de partage anémique.

### Tracks 5 : L'Entité & l'Exposition Réseau
*   **Fichier** : `src/entities/Share.ts` & `src/dto/share/ResponseShareDto.ts`
*   **Cinématique** : L'ancienne entité `Share` ne possède aucune encapsulation. Les jetons et configurations d'expiration sont lisibles et modifiables directement en public. Lors de la clôture HTTP, les données sont sérialisées sans purge stricte des identifiants d'infrastructure.

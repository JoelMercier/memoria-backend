# 🏺 Parcours Historique : `POST /v1/tags` (Version d'Origine)

Ce document retrace le fil d'Ariane initial de la création d'un Tag avant l'introduction de l'Armure Nominale.

### Tracks 1 : L'Aiguillage Express
*   **Fichier** : `src/routes/v1/index.ts`
*   **Action** : Express intercepte le verbe `POST` sur le préfixe `/tags`. Le middleware d'authentification extrait l'identifiant utilisateur sous forme de simple chaîne primitive brute (`string`) et le pousse dans `req.user.id`.
*   **Ligne d'action** : `v1.use('/tags', authMiddleware.requireAuth(), createTagRouter(tagController));`

### Tracks 2 : Le Douanier HTTP
*   **Fichier** : `src/controllers/TagController.ts`
*   **Méthode** : `public async create(req: Request, res: Response, next: NextFunction)`
*   **Cinématique** :
    1. Transtypage d'infrastructure brutal et artificiel en haut du fichier via un cast : `req.user.id as unknown as UserId`.
    2. Les primitives du corps de la requête (`req.body`) transitent sous forme de dictionnaire anonyme JavaScript ouvert et modifiable, sans encapsulation dans une classe DTO protectrice.
*   **Appel** : `await this.tagService.create(userId, req.body);`

### Tracks 3 : L'Orchestrateur Métier
*   **Fichier** : `src/services/TagService.ts`
*   **Méthode** : `public async create(userId: string, data: any)`
*   **Cinématique** : Le service reçoit de simples chaînes. Il génère un identifiant textuel nu à la volée via un `randomUUID()` classique ou laisse la base de données PostgreSQL l'incrémenter de manière séquentielle (`SERIAL`). Le service assemble un sac de données passif et le passe-plat continue vers le dépôt :
   ```typescript
   const tagData = { id: randomUUID(), userId: userId, tagName: data.tagName };
   ```

### Tracks 4 : L'Ouvrier de Persistance
*   **Fichier** : `src/repositories/PgTagRepository.ts`
*   **Méthode** : `public async create(data: any)`
*   **SQL Exécuté** :
    ```sql
    INSERT INTO tags (id, user_id, tag_name) VALUES ($1, $2, $3) RETURNING *;
    ```
*   **Primitives** : Les arguments d'injection `$1`, `$2` et `$3` sont de simples chaînes textuelles volatiles. La ligne SQL récupérée est instanciée dans une entité tag anémique.

### Tracks 5 : L'Entité & l'Exposition Réseau
*   **Fichier** : `src/entities/Tag.ts` & `src/dto/tag/ResponseTagDto.ts`
*   **Cinématique** : L'ancienne entité `Tag` n'est qu'un bête dictionnaire d'infrastructure sans variables privées. Lors de la clôture HTTP, le DTO de réponse extrait les informations via le getter capitalisé de style C# `tag.TagName`, rompant le principe de moindre surprise.

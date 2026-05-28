# 🏺 Parcours Historique : `PUT /v1/users/me` (Version d'Origine)

Ce document retrace le fil d'Ariane initial de la mise à jour du profil utilisateur avant la refonte architecturale [Mémoria].

### Tracks 1 : L'Aiguillage Express
*   **Fichier** : `src/routes/v1/index.ts`
*   **Action** : Express intercepte le verbe `PUT` sur le préfixe `/users/me`. Le middleware d'authentification extrait l'identifiant et l'injecte sous forme de simple chaîne primitive brute (`string`) dans le contexte de la requête (`req.user.id`).
*   **Ligne d'action** : `v1.use('/users', authMiddleware.requireAuth(), createUserRouter(userController));`

### Tracks 2 : Le Douanier HTTP
*   **Fichier** : `src/controllers/UserController.ts`
*   **Méthode** : `public async updateProfile(req: Request, res: Response, next: NextFunction)`
*   **Cinématique** :
    1. L'identifiant est extrait en texte nu : `const userId: string = req.user.id;`.
    2. Les données de modification (`req.body`) transitent sous forme de dictionnaire anonyme JavaScript ouvert et modifiable, sans encapsulation dans une classe DTO protectrice.
*   **Appel** : `await this.userService.updateProfile(userId, req.body);`

### Tracks 3 : L'Orchestrateur Métier
*   **Fichier** : `src/services/UserService.ts`
*   **Méthode** : `public async updateProfile(userId: string, data: any)`
*   **Cinématique** : Le service reçoit des primitives. Pour valider l'unicité du nouvel email ou du pseudonyme, il effectue des comparaisons de chaînes de caractères brutes en texte nu (`if (user.email === data.email)`). Les contrôles de sécurité s'appuient sur des propriétés de l'entité exposées en public.

### Tracks 4 : L'Ouvrier de Persistance
*   **Fichier** : `src/repositories/PgUserRepository.ts`
*   **Méthode** : `public async update(id: string, data: any)`
*   **SQL Exécuté** :
    ```sql
    UPDATE users SET email = $1, pseudo = $2, updated_at = NOW() WHERE id_user = $3 RETURNING *;
    ```
*   **Primitives** : Les arguments d'injection `$1`, `$2` et `$3` sont de simples chaînes textuelles volatiles. La ligne SQL récupérée est instanciée dans une entité utilisateur anémique.

### Tracks 5 : L'Entité & l'Exposition Réseau
*   **Fichier** : `src/entities/User.ts` & `src/dto/user/ResponseUserDto.ts`
*   **Cinématique** : L'ancienne entité `User` possède des propriétés publiques altérables par n'importe quelle couche logicielle. Lors de la clôture HTTP, le DTO de réponse extrait les informations via des getters capitalisés de style C# (`user.Email`, `user.Pseudo`), créant un décalage sémantique avec les minuscules de la base de données.

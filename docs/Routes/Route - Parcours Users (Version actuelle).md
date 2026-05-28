# 🪓 Parcours Industriel : `PUT /v1/users/me` (Version Actuelle)

Ce document retrace le fil d'Ariane moderne et sécurisé de la mise à jour du profil utilisateur sous l'Armure Nominale de [Mémoria].

### Tracks 1 : L'Aiguillage Express
*   **Fichier** : `src/routes/v1/index.ts`
*   **Action** : La Tour de Contrôle oriente la requête vers le routeur utilisateur. Grâce au middleware de sécurité, le jeton d'authentification a déjà été nominalisé.
*   **Ligne d'action** : `v1.use('/users', authMiddleware.requireAuth(), createUserRouter(userController));`

### Tracks 2 : Le Douanier HTTP
*   **Fichier** : `src/controllers/UserController.ts`
*   **Méthode** : `public async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>`
*   **Cinématique** :
    1. Appel de `this.getUserId(req)` : protection polymorphe (`instanceof UserId`) pour sceller l'identité de l'acteur dans son Value Object de domaine certifié **`UserId`**.
    2. Encapsulation immédiate des primitives du corps de la requête dans un conteneur immuable : `const dto = new UpdateProfileDto(req.body);`.
*   **Appel** : `const user = await this.userService.updateProfile(userId, dto);`

### Tracks 3 : L'Orchestrateur Métier
*   **Fichier** : `src/services/UserService.ts`
*   **Méthode** : `public async updateProfile(userId: UserId, dto: UpdateProfileDto): Promise<User>`
*   **Cinématique** : Le service reçoit des types forts. Les vérifications d'unicité s'exécutent de manière étanche en extrayant la chaîne de caractères pure de l'entité (`existing.getEmail().toLowerCase()`). L'état révisé est préparé dans un sac de données d'infrastructure de type strict `Partial<IUserData>`.

### Tracks 4 : L'Ouvrier de Persistance
*   **Fichier** : `src/repositories/PgUserRepository.ts`
*   **Méthode** : `public async update(id: UserId, data: Partial<IUserData>): Promise<User>`
*   **SQL Exécuté** :
    ```sql
    UPDATE users SET email = $1, pseudo = $2, updated_at = NOW() WHERE id_user = $3
    RETURNING id_user, email, password_hash, pseudo, role, auth_provider, settings_user, gdpr_consent, gdpr_consent_date, created_at, updated_at;
    ```
*   **Primitives** : Le dépôt casse l'armure nominale (`id.valeur`) uniquement à la frontière de la base de données. L'instance globale `DatabaseConnection` exécute la requête, capture la ligne et instancie l'entité vivante réformée.

### Tracks 5 : L'Entité & l'Exposition Réseau
*   **Fichier** : `src/entities/User.ts` & `src/dto/user/ResponseUserDto.ts`
*   **Cinématique** : L'entité `User` cadenasse ses variables derrière sa notation hongroise immuable (`m_sEmail`, `m_sPseudo`). De retour au contrôleur, la factory statique `ResponseUserDto.fromUser(user)` extrait les informations via des fonctions métiers pures et uniformes (`user.getEmail()`), purgeant le mot de passe avant l'envoi JSON (`200 OK`).

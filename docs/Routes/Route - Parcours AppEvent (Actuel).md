# 🪓 Parcours Industriel : `POST /admin/events` (Version Actuelle)

Ce document retrace le fil d'Ariane moderne, immuable et hautement sécurisé de l'émission d'une trace d'audit sous l'Armure Nominale de [Mémoria].

### Tracks 1 : L'Aiguillage Express
*   **Fichier** : `src/routes/v1/index.ts`
*   **Action** : La Tour de Contrôle oriente le flux vers l'administration. La méthode est protégée, garantissant que l'identité de session a déjà été certifiée.

### Tracks 2 : Le Douanier HTTP
*   **Fichier** : `src/controllers/AppEventController.ts`
*   **Méthode** : `public async create(req: Request, res: Response, next: NextFunction): Promise<void>`
*   **Cinématique** :
    1. **Éradication des Hérésies** : Destruction définitive absolue des méthodes `update` et `delete`. L'historique d'audit devient contractuellement inviolable et immuable. Le type instable est banni au profit du véritable type nominal **`AppEventId`**.
    2. **Extraction Sécurisée** : Protection polymorphe `instanceof UserId` dans la méthode `getUserId(req)` pour bloquer les conflits d'infrastructure Express et retourner un vrai **`UserId`**.
    3. **Scellage** : Payload HTTP encapsulé de manière immuable dans un `CreateEventDto`.
*   **Appel** : `const event = await (AppEventAdminService as any).create(userId, dto);`

### Tracks 3 : L'Orchestrateur Métier
*   **Fichier** : `src/services/AppEventAdminService.ts`
*   **Méthode** : `public async create(userId: UserId, dto: CreateEventDto): Promise<AppEvent>`
*   **Cinématique** : Le service est unifié. Il exige l'utilisation de **Smart Enums** stricts (`AppEventCategory`, `AppEventSeverity`, `AppEventType`) pour interdire toute insertion de texte arbitraire dans la base de données. Il forge un identifiant unique fort 128-bit à la volée : `idAppEvent: new AppEventId(randomUUID())`.

### Tracks 4 : L'Ouvrier de Persistance
*   **Fichier** : `src/repositories/PgAppEventRepository.ts`
*   **Méthode** : `public async create(data: IAppEventData): Promise<AppEvent>`
*   **SQL Exécuté** :
    ```sql
    INSERT INTO app_events (id_app_event, user_id, event_category, event_type, severity, message, metadata, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    RETURNING id_app_event, user_id, event_category, event_type, severity, message, metadata, created_at;
    ```
*   **Primitives** : Le dépôt extrait les chaînes UUID via `.valeur` et les codes d'enums via `.code` uniquement à la frontière de la base de données. L'écriture est synchronisée sur l'horodatage d'audit géré nativement en arrière-plan par l'héritage de `BaseEntity`.

### Tracks 5 : L'Entité & l'Exposition Réseau
*   **Fichier** : `src/entities/AppEvent.ts` & `src/dto/event/ResponseEventDto.ts`
*   **Cinématique** : L'entité `AppEvent` est purgée de ses variables mortes. Elle expose ses attributs via des fonctions de lecture pures unifiées du Domaine : **`getAppEventId()`**, **`getEventCategory()`**, **`getSeverity()`**. De retour au contrôleur, le `ResponseEventDto` reçoit l'entité vivante et mappe directement ses objets forts et ses Smart Enums sans dégradation textuelle, avant de clôturer en `201 Created`.

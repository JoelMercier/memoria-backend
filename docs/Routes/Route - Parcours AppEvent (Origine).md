# 🏺 Parcours Historique : `POST /admin/events` (Version d'Origine)

Ce document retrace le fil d'Ariane initial de l'émission d'un log système d'audit avant la refonte structurelle de l'écosystème [Mémoria].

### Tracks 1 : L'Aiguillage Express
*   **Fichier** : `src/routes/v1/index.ts`
*   **Action** : Express intercepte le verbe `POST` sur l'URL d'administration `/admin/events`. L'identité de l'appelant est extraite sous forme de chaîne de caractères primitive brute (`string`) et injectée dans `req.user.id`.

### Tracks 2 : Le Douanier HTTP
*   **Fichier** : `src/controllers/AppEventController.ts`
*   **Méthode** : `public async create(req: Request, res: Response, next: NextFunction)`
*   **Cinématique** :
    1. L'identifiant de l'administrateur ou du système est extrait en texte nu : `const userId: string = req.user.id;`.
    2. Le fichier souffre d'un défaut de typage nominal, important un type fantôme instable nommé `EventId` qui entre en collision directe avec l'environnement global de Node.js.
    3. Il autorise de manière aberrante des méthodes de modification (`update`) et de destruction (`delete`) sur des historiques de logs censés être inviolables.
*   **Appel** : `await AppEventAdminService.createEvent(userId, req.body);`

### Tracks 3 : L'Orchestrateur Métier
*   **Fichier** : `src/services/AppEventAdminService.ts`
*   **Méthode** : `public static async createEvent(userId: string, data: any)`
*   **Cinématique** : Le service expose des fonctions sous forme statique rigide. Il accepte des chaînes de caractères libres et volages pour qualifier la gravité (`data.severity = "INFO"`) ou la catégorie du log d'audit, sans aucune contrainte de dictionnaire fermé, ouvrant la porte à des corruptions de données textuelles.

### Tracks 4 : L'Ouvrier de Persistance
*   **Fichier** : `src/repositories/PgAppEventRepository.ts`
*   **Méthode** : `public async create(data: any)`
*   **SQL Exécuté** :
    ```sql
    INSERT INTO app_events (id, user_id, event_category, event_type, severity, message, metadata)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    ```
*   **Primitives** : L'horodatage de création est calculé de manière volage et inconsistante à différents paliers de l'infrastructure. La ligne brute retournée est instanciée dans une entité d'audit anémique.

### Tracks 5 : L'Entité & l'Exposition Réseau
*   **Fichier** : `src/entities/AppEvent.ts` & `src/dto/event/ResponseEventDto.ts`
*   **Cinématique** : L'ancienne entité `AppEvent` est un simple sac de propriétés publiques modifiables. Elle calcule un doublon d'horodatage interne via une variable morte `m_dCreatedAt` redondante avec la classe de base. Le DTO de réponse extrait les données via des chaînes primitives brutes en forçant des clés `.code` destructrices.

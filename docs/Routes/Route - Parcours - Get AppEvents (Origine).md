# 🏺 Parcours de Lecture Historique : `GET /admin/events` (Version d'Origine)

Ce document retrace le flux d'extraction initial des journaux d'audit système.

### Tracks 1 : Le Douanier HTTP (`AppEventController`)
1. Le contrôleur récupère les paramètres de pagination. Le fichier est pollué par l'import du type fantôme `EventId` en collision avec Node.js.
2. Il appelle la méthode statique rigide : `await AppEventAdminService.listEvents({ limit, offset });`.

### Tracks 2 : L'Ouvrier de Persistance (`PgAppEventRepository`)
1. Le repository reçoit les entiers de pagination.
2. **Le SQL Effectivement Exécuté** :
   ```sql
   SELECT * FROM app_events LIMIT $1 OFFSET $2;
   ```
3. **L'Absence de Smart Enum** : Le dépôt extrait les lignes. Les colonnes critiques (`event_category`, `severity`) restent de bêtes chaînes de caractères primitives textuelles volages (`"INFO"`, `"AUTH"`), sans aucune conversion vers des objets métiers sécurisés. Elles sont injectées dans l'ancienne entité `AppEvent` à propriétés publiques.

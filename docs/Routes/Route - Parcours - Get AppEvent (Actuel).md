# 🪓 Parcours de Lecture : `GET /admin/events` (Version Actuelle)

Ce document retrace le flux d'extraction sécurisé des journaux d'audit système pour le panneau d'administration.

### Tracks 1 : Le Douanier HTTP (`AppEventController`)
1. Le contrôleur capture les filtres de pagination depuis la query string Express (`limit`, `offset`).
2. Il ordonne l'extraction au service d'exploitation : `await AppEventAdminService.listEvents({ limit, offset });`.

### Tracks 2 : L'Ouvrier de Persistance (`PgAppEventRepository`)
1. Le repository d'audit reçoit les options de pagination.
2. **Le SQL Effectivement Exécuté** :
   ```sql
   SELECT id_app_event, user_id, event_category, event_type, severity, message, metadata, created_at
   FROM app_events
   ORDER BY created_at DESC
   LIMIT $1 OFFSET $2;
   ```
   * *Paramètres injectés (`$1`, `$2`)* : `[limit, offset]`.
3. **Résurrection Métier** : Le dépôt intercepte les lignes. Il re-mappe les codes textuels de la base vers les instances réelles de nos **Smart Enums** (`AppEventCategory.fromSql(row.event_category)`). Il instancie et retourne les entités immuables `AppEvent[]`.

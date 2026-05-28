# 🪓 Parcours de Lecture : `GET /v1/shares` (Version Actuelle)

Ce document détaille l'extraction de l'index des liens de partages configurés par un utilisateur.

### Tracks 1 : Le Douanier & Le Service (`ShareController`)
1. Le contrôleur extrait le `UserId` fort de session.
2. Il intercepte les paramètres de pagination et appelle l'orchestrateur : `await this.shareService.listByUser(userId);`.
3. Le service délègue la requête au dépôt PostgreSQL.

### Tracks 2 : L'Ouvrier de Persistance (`PgShareRepository`)
1. La méthode `listByUser(userId: UserId)` s'exécute.
2. **Le SQL Effectivement Exécuté** :
   ```sql
   SELECT id_share, item_id, recipient_email, share_token, access_config, created_at, updated_at
   FROM shares
   WHERE item_id IN (SELECT id_item FROM items WHERE user_id = $1)
   ORDER BY created_at DESC;
   ```
   * *Paramètre injecté (`$1`)* : `userId.valeur`.
3. Les lignes brutes sont capturées, le dictionnaire JSON `access_config` est parsé, et le repository retourne un tableau d'entités de partages immuables `Share[]`.

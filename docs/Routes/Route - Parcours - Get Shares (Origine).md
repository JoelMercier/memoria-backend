# 🏺 Parcours de Lecture Historique : `GET /v1/shares` (Version d'Origine)

Ce document détaille l'extraction initiale des partages sans l'étanchéité des types nominaux.

### Tracks 1 : Le Douanier HTTP (`ShareController`)
1. Récupère l'ID de session sous forme de primitive `string`.
2. Appelle le service en lui passant cette chaîne textuelle. Le service transmet directement l'ordre au repository.

### Tracks 2 : L'Ouvrier de Persistance (`PgShareRepository`)
1. La méthode `listByUser(userId: string)` s'exécute.
2. **Le SQL Effectivement Exécuté** :
   ```sql
   -- ❌ Requête lourde ou jointure floue reposant sur des clés textuelles instables
   SELECT * FROM shares WHERE item_id IN (SELECT id FROM items WHERE user_id = $1);
   ```
   * *Paramètre injecté (`$1`)* : La chaîne primitive `userId`.
3. Les lignes SQL sont récupérées. Le champ `access_config` est extrait sous forme de texte brut ou d'objet littéral JavaScript non typé, puis envoyé dans l'entité anémique `Share`.

# 🏺 Parcours de Lecture Historique : `GET /v1/tags` (Version d'Origine)

Ce document retrace le flux d'extraction initial de la collection des étiquettes de l'utilisateur.

### Tracks 1 : Le Douanier & Le Service (`TagController`)
1. Le contrôleur applique un transtypage forcé et artificiel d'infrastructure : `req.user.id as unknown as UserId`.
2. Le service reçoit cette chaîne primitive et la passe-plat au dépôt sans contrôle de domaine.

### Tracks 2 : L'Ouvrier de Persistance (`PgTagRepository`)
1. La méthode `findByUserId(userId: string)` s'active.
2. **Le SQL Effectivement Exécuté** :
   ```sql
   -- ❌ Tri instable ou absent selon le bon vouloir du moteur de la base
   SELECT * FROM tags WHERE user_id = $1;
   ```
   * *Paramètre injecté (`$1`)* : La string brute de l'auteur.
3. Le dépôt capture le tableau de lignes et l'injecte dans une collection d'anciennes entités `Tag[]` qui exposent directement leur libellé en public via `tag.tagName`.

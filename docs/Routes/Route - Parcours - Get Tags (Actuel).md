# 🪓 Parcours de Lecture : `GET /v1/tags` (Version Actuelle)

Ce document retrace le flux d'extraction de la collection complète des étiquettes triées par ordre alphabétique.

### Tracks 1 : Le Douanier HTTP (`TagController`)
1. Le contrôleur sécurise l'identité de l'appelant via `this.getUserId(req)` et obtient un `UserId` fort.
2. Il délègue l'extraction au service : `const tags = await this.tagService.listByUser(userId);`.

### Tracks 2 : L'Orchestrateur Métier (`TagService`)
Le service reçoit le type fort `UserId`. Il fait office de passe-plat sécurisé et ordonne le listage au dépôt : `return await this.tagRepository.findByUserId(userMetierId);`.

### Tracks 3 : L'Ouvrier de Persistance (`PgTagRepository`)
1. La méthode `findByUserId(userId: UserId)` s'active.
2. **Le SQL Effectivement Exécuté** :
   ```sql
   SELECT id_tag, user_id, tag_name, created_at, updated_at
   FROM tags
   WHERE user_id = $1
   ORDER BY tag_name ASC;
   ```
   * *Paramètre injecté (`$1`)* : `userId.valeur`.
3. Le dépôt mappe le tableau de lignes SQL reçues (`rows.map`) et ressuscite une collection d'entités vivantes `Tag[]` via `new Tag(row)`.

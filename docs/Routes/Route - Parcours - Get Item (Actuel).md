# 🪓 Parcours de Lecture Industriel : `GET /v1/items/:id` (Version Actuelle)

Ce document détaille l'extraction chirurgicale d'une pépite unique par son ID, protégée par l'Armure Nominale de [Mémoria].

### Tracks 1 : Le Douanier HTTP (`ItemController`)
1. Le contrôleur extrait l'identifiant de la pépite et le scelle immédiatement dans son Value Object protecteur : `const itemMetierId = new ItemId(req.params.id);`.
2. L'identifiant utilisateur est extrait de manière polymorphe (`instanceof UserId`) pour garantir un `UserId` certifié.
3. Le contrôleur interroge le service : `const item = await this.itemService.findById(userId, itemMetierId);`.

### Tracks 2 : L'Orchestrateur & L'Ouvrier (`PgItemRepository`)
1. Le service valide l'ownership de la ressource. Le dépôt `PgItemRepository` prend le relais avec la méthode `findById(itemMetierId)`.
2. **Le SQL Effectivement Exécuté** :
   ```sql
   SELECT id_item, user_id, content_type, title, slug, content, source_author, thumbnail_url, metadata, created_at, updated_at
   FROM items
   WHERE id_item = $1;
   ```
   * *Paramètre injecté (`$1`)* : `id.valeur` (L'UUID pur extrait de l'objet fort).
3. **Résurrection Métier** : Le dépôt convertit les colonnes SQL, re-mappe les codes d'enums vers le Smart Enum `ContentType`, et instancie l'entité vivante : `return new Item(dbRow);`.

### Tracks 3 : La Sérialisation Réseau (`ResponseItemDto`)
L'entité `Item` (cadenassée en notation hongroise) remonte au contrôleur. Elle est passée à la factory statique `ResponseItemDto.fromItem(item)`. Les getters métiers unifiés (`item.getTitle()`) extraient les informations de manière uniforme avant l'envoi de la réponse `200 OK`.

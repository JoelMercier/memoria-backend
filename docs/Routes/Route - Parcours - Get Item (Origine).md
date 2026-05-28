# 🏺 Parcours de Lecture Historique : `GET /v1/items/:id` (Version d'Origine)

Ce document retrace le flux d'extraction initial d'une pépite spécifique et de ses étiquettes associées.

### Tracks 1 : Le Douanier HTTP (`ItemController`)
1. Le contrôleur extrait l'identifiant de la pépite depuis l'URL sous forme de chaîne textuelle brute (`const itemId = req.params.id;`).
2. L'identifiant utilisateur est également traité comme une simple primitive `string`. Les deux chaînes sont passées au service sans aucune vérification d'intégrité nominale.

### Tracks 2 : L'Ouvrier de Persistance (`PgItemRepository`)
1. La méthode `findById(id: string)` s'active.
2. **Le SQL Effectivement Exécuté** :
   ```sql
   -- ❌ Anti-pattern : Utilisation du SELECT * générique
   SELECT * FROM items WHERE id = $1;
   ```
   * *Paramètre injecté (`$1`)* : Le texte nu de la string `itemId`.
3. Le dépôt intercepte la ligne SQL brute et l'assigne directement dans l'entité anémique `Item` à propriétés publiques, sans aucune garantie d'immuabilité.

### Tracks 3 : L'Exposition HTTP Anémique
De retour au contrôleur, le DTO de réponse extrait les données via les accesseurs capitalisés de style C# (`item.Title`, `item.Slug`), créant une rupture sémantique violente avec la casse en minuscules de la base de données PostgreSQL.

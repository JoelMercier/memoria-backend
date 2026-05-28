# 🪓 Parcours de Lecture Industriel : Liaison `ItemTag` (Version Actuelle)

Ce document retrace le flux d'extraction transactionnel et optimisé des étiquettes rattachées à une pépite sous l'Armure Nominale.

### Tracks 1 : L'Extraction Atomique par Jointure
1. Finies les cascades de requêtes polluantes en boucle (N+1). Le dépôt `PgItemRepository` ou `PgItemTagRepository` remonte la pépite et l'intégralité de ses étiquettes en **une seule et unique opération SQL optimisée**.
2. **Le SQL Effectivement Exécuté (Jointure performante)** :
   ```sql
   SELECT t.id_tag, t.tag_name
   FROM tags t
   INNER JOIN item_tags it ON t.id_tag = it.id_tag
   WHERE it.id_item = $1;
   ```
   * *Paramètre injecté (`$1`)* : `itemId.valeur` (L'identifiant d'acier de la pépite).
3. **Résurrection en Collection** : Le dépôt capture le tableau de lignes de cette jointure, convertit les primitives SQL en Value Objects, et injecte proprement la collection de `Tag[]` validés directement au sein de l'entité ou du DTO de réponse, garantissant une performance maximale.

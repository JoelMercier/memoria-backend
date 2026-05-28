# 🏺 Parcours de Lecture Historique : Liaison `ItemTag` (Version d'Origine)

Ce document détaille la remontée initiale des étiquettes liées à une pépite.

### Tracks 1 : La Requête Multipliée (Problème du N+1)
1. Dans l'Ancien Régime, pour afficher les tags d'une pépite, le dépôt effectuait d'abord une requête pour récupérer l'item.
2. Ensuite, le code bouclait sur les lignes de la table de jointure pour récupérer les IDs de tags, puis exécutait une nouvelle requête SQL pour *chaque* tag individuel afin d'en obtenir le libellé textuel.
3. **Le SQL Effectivement Exécuté en boucle** :
   ```sql
   SELECT * FROM item_tags WHERE item_id = $1;
   -- Puis pour chaque ligne trouvée :
   SELECT * FROM tags WHERE id = $1;
   ```
4. Cette cascade de requêtes primitives engendrait une lourde perte de performance et aucune cohérence transactionnelle.

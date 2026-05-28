# 🏺 Parcours Historique : Liaison `ItemTag` (Version d'Origine)

Ce document retrace le fil d'Ariane initial de l'association d'une pépite à ses étiquettes avant l'introduction de la méthode de synchronisation atomique.

### Tracks 1 : L'Aperçu du Cas d'Usage
*   **Fichier** : `src/services/ItemService.ts`
*   **Action** : Lors d'une création (`POST /v1/items`) ou d'une révision (`PATCH /v1/items/:id`), l'ancien service reçoit une collection d'identifiants sous forme d'un simple tableau de chaînes primitives brutes : `tagIds: string[]`.

### Tracks 2 : La Validation de Propriété Féodale
*   **Fichier** : `src/services/ItemService.ts`
*   **Cinématique** : Pour s'assurer que l'utilisateur détient les étiquettes qu'il veut lier, le service fait une égalité directe de texte nu entre l'ID utilisateur de session et l'ID utilisateur attaché au tag : `if (tag.userId !== userId)`. Aucune encapsulation nominale ne protège cette validation.

### Tracks 3 : L'Inondation de Requêtes (Problème du N+1)
*   **Fichier** : `src/services/ItemService.ts` ➡️ `src/repositories/PgItemTagRepository.ts`
*   **Cinématique** : N'ayant pas de concept de synchronisation global, le service boucle manuellement sur chaque ID de tag du tableau. Pour chaque itération, il déclenche un appel d'infrastructure indépendant vers le repository, générant une cascade inondant la base de données de requêtes individuelles.

### Tracks 4 : L'Ouvrier de Persistance Épuisé
*   **Fichier** : `src/repositories/PgItemTagRepository.ts`
*   **SQL Exécuté (Répété N fois dans une boucle)** :
    ```sql
    INSERT INTO item_tags (item_id, tag_id) VALUES ($1, $2);
    ```
*   **Primitives & Risques** : Les arguments `$1` et `$2` sont de simples chaînes textuelles volatiles. Si l'utilisateur tente de lier un tag déjà associé lors d'un PATCH, la base plante violemment sur une violation de contrainte de clé unique (`PRIMARY KEY` ou `UNIQUE`), forçant l'infrastructure à lever une erreur 500 non gérée.

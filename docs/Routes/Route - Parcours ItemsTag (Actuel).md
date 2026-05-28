# 🪓 Parcours Industriel : Liaison `ItemTag` (Version Actuelle)

Ce document retrace le fil d'Ariane moderne, transactionnel et hautement performant de la synchronisation des étiquettes sous l'Armure Nominale de [Mémoria].

### Tracks 1 : L'Aperçu du Cas d'Usage
*   **Fichier** : `src/services/ItemService.ts`
*   **Action** : À la réception du payload, le service intercepte le tableau de primitives et le cartographie immédiatement pour le sceller dans des objets-valeurs certifiés du Domaine : `TagId[]`.

### Tracks 2 : Le Bouclier de Propriété Étanche
*   **Fichier** : `src/services/ItemService.ts`
*   **Méthode** : `private async validateTagOwnership(userId: UserId, tagIds: ReadonlyArray<TagId>): Promise<void>`
*   **Cinématique** : Le service interroge le `tagRepository.findByIds(tagIds)` en une seule requête. La comparaison de sécurité s'effectue de manière imperméable en extrayant la chaîne de caractères pure issue des Value Objects : `if (tag.getUserId().valeur !== userId.valeur)`. Si fraude ➡️ rejet immédiat via `TagErrorFactory.accessDenied`.

### Tracks 3 : L'Ordre de Synchronisation Atomique
*   **Fichier** : `src/services/ItemService.ts` ➡️ `src/repositories/PgItemTagRepository.ts`
*   **Cinématique** : Finies les boucles itératives polluantes. Le service donne un ordre unique, global et atomique au dépôt de jointure en lui passant les deux types forts requis :
    ```typescript
    await this.itemTagRepository.sync(item.getItemId(), domainTagIds);
    ```

### Tracks 4 : La Rafale Transactionnelle d'Ouvrier
*   **Fichier** : `src/repositories/PgItemTagRepository.ts`
*   **Méthode** : `public async sync(itemId: ItemId, tagIds: TagId[]): Promise<void>`
*   **SQL Effectivement Exécuté (Dans un bloc transactionnel étanche)** :
    ```sql
    -- Étape A : Purge complète et propre des anciennes liaisons pour cette pépite
    DELETE FROM item_tags WHERE id_item = $1;

    -- Étape B : Insertion groupée et sécurisée des nouvelles étiquettes validées
    INSERT INTO item_tags (id_item, id_tag) VALUES ($1, $2), ($1, $3), (...);
    ```
*   **Primitives** : Le dépôt casse l'armure via `.valeur` uniquement à la frontière de la base. En nettoyant d'abord le passé (`DELETE`), la méthode élimine à la racine tout risque de doublon ou de violation de clé unique. L'opération est ultra-rapide, idempotente et garantie sans aucune fuite de performance.

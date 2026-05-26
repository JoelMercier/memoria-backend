# 🛤️ Rétro-Ingénierie — Cinématique du Flux Pépite (Item)
> **Auteur :** @author Joël, Gaïa & Co
> **Composant :** Gestion des ressources (Pépites), Synchronisation des étiquettes et Contrôle d'Ownership

Ce manifeste détaille le cycle de vie technique et le parcours d'une donnée Pépite à travers l'Hexagone, en prenant l'exemple de la création et de l'association de mots-clés (`create`).

---

## 🗺️ 1. Diagramme Linéaire du Flux de Création d'une Pépite

Chaque ressource créée par l'acteur traverse le pipeline de manière étanche et hautement sécurisée :

```text
[ POST /v1/items ] ➔ Payload JSON brut envoyé par le client Web (contenant le titre, contenu, et tagIds)
      │
      ▼ (Vérification et filtrage réseau par src/app.ts)
[ Douane Zod : ItemValidation.validateCreate ]
      │   └── Si type de contenu invalide ➔ 🚨 Rejet immédiat par le HandlerService
      │
      ▼ (Payload 100% validé et propre)
[ Classe CreateItemDto ] ➔ Isole la structure du réseau pour protéger le Domaine
      │
      ▼ (Aiguillage de la frontière)
[ ItemController.create ] ➔ Capte l'identité de l'acteur : UserId (sécurisé via express.d.ts)
      │   └── Extraction nominale de la chaîne physique : userMetierId.valeur
      │
      ▼ 🧠 SOUVERAINETÉ DU DOMAINE (src/services/ItemService.ts)
[ ItemService.create ] ➔ Exécute la logique métier et la sécurité des liaisons :
      │   ├── 1. Génération automatique du permalien (SlugGenerator.generate) si absent
      │   ├── 2. Vérification Fail-Fast de l'unicité du titre et du slug pour cet utilisateur
      │   ├── 3. Validation nominale de propriété des étiquettes (validateTagOwnership)
      │   │      └── Si triche sur un tag d'autrui ➔ 🚨 throw TagErrorFactory.accessDenied()
      │   ├── 4. Assemble le sac de données d'infrastructure (IItemData) avec idUser: userMetierId
      │   └── 5. Persiste l'atome racine via l'entrepôt : itemRepository.create(data)
      │
      ▼ 🔄 SYNCHRONISATION TRANSACTIONNELLE (IItemTagRepository)
[ ItemTagRepository.sync ] ➔ Enclenche le mappage de masse des étiquettes (domainTagIds)
      │
      ▼ 🐘 Insertion SQL finale (DatabaseConnection via pg)
[ Base de Données PostgreSQL ] ➔ Écrit les lignes dans "items" et peuple la table de jointure "item_tags"
```

---

## 🧱 2. Le Rôle des Périphériques sur le Flux `Item`

### 🛡️ Le Verrou de Propriété des Étiquettes (`validateTagOwnership`)
C'est la brique de sécurité la plus critique du service. Avant d'autoriser l'association de mots-clés à une pépite, le service convertit le tableau de chaînes d'infrastructure `dto.tagIds` en véritables objets du Domaine **`TagId[]`**. Il interroge ensuite le dépôt pour s'assurer que chaque étiquette demandée existe ET appartient physiquement à l'utilisateur connecté, barrant la route aux attaques par injection latérale.

### 🛤️ L'Aplatisseur de Permaliens (`SlugGenerator`)
Si le client Web ne fournit pas de lien d'URL explicite (`slug`), le périphérique `SlugGenerator` prend le relais. Il applique une suite d'expressions régulières chirurgicales (normalisation NFD pour décomposer les accents, suppression des caractères spéciaux et trim) pour garantir la génération d'un permalien sémantique propre et URL-friendly.

### 🖨️ Le Formatage de Sortie Isolé (`ResponseItemDto`)
Le Domaine renvoie une entité vivante riche. Pour éviter d'exposer des détails d'infrastructure ou de casser le contrat du Front-End, le contrôleur passe le résultat au périphérique de sortie **`ResponseItemDto.fromItem(item)`**. C'est lui qui transforme proprement l'objet du domaine en un JSON plat et standardisé attendu par le client.

---

## 🏛️ 3. Vérité d'Atelier : Qui appelle Qui ?

Pour clouer le bec aux débats de la salle de cours sur le module `Item` :

*   **Le Contrôleur** (`ItemController`) appelle ➔ **`IItemService`** (via la méthode `.create()`)
*   **`ItemService`** appelle ➔ **`IItemRepository`** pour insérer la pépite
*   **`ItemService`** appelle ensuite ➔ **`IItemTagRepository`** pour mettre à jour la table pivot associative
*   **Les deux Repositories** exécutent le SQL concret en interrogeant le pool **`DatabaseConnection`**

Tout s'emboîte au millimètre près, les primitives web sont converties en armures nominales dès la frontière, et l'IDE maintient son calme blanc le plus total.

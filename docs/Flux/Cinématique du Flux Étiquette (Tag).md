# 🛤️ Rétro-Ingénierie — Cinématique du Flux Étiquette (Tag)
> **Auteur :** @author Joël, Gaïa & Co
> **Composant :** Catégorisation, Unicité des libellés (Case-Insensitive) et Nettoyage Relationnel

Ce manifeste détaille le cycle de vie technique et le parcours d'une donnée Étiquette à travers l'Hexagone, de sa création à sa révision sémantique.

---

## 🗺️ 1. Diagramme Linéaire du Flux des Étiquettes

Chaque mot-clé ou signet manipulé par l'acteur traverse le pipeline de manière étanche :

```text
[ POST /v1/tags ] ➔ Libellé JSON brut envoyé par le client Web ({ "tagName": "Important" })
      │
      ▼ (Filtrage et assainissement des chaînes par src/app.ts)
[ Douane Zod : TagValidation.validateCreate ]
      │   └── Si libellé vide ou hors format ➔ 🚨 Rejet immédiat par le HandlerService
      │
      ▼ (Payload 100% validé et propre)
[ Classe CreateTagDto ] ➔ Le sac de transport isole les variables du protocole HTTP
      │
      ▼ (Aiguillage de la frontière)
[ TagController.create ] ➔ Capte l'identité UserId via le jeton de session décodé
      │
      ▼ 🧠 SOUVERAINETÉ DU DOMAINE (src/services/TagService.ts)
[ TagService.create ] ➔ Initialise l'écriture avec l'armure nominale :
      │   ├── 1. Crée le sac de données d'infrastructure ITagData
      │   └── 2. Définit idTag à undefined (Délégation de la forge de clé à PostgreSQL)
      │
      ▼ 🗄️ INVERSION DE DÉPENDANCE (ITagRepository ➔ PgTagRepository)
[ PgTagRepository.create ] ➔ Valide l'absence de collision en base de données
      │   └── Si doublon (Contrainte unique_user_tag) ➔ 🚨 throw TagErrorFactory.nameExists()
      │
      ▼ 🐘 Écriture SQL (DatabaseConnection via pg)
[ Base de Données PostgreSQL ] ➔ Écrit la ligne physique dans la table "tags"
```

---

## 🧱 2. Le Rôle des Périphériques sur le Flux `Tag`

### 🛡️ Le Bouclier d'Unicité Insensible à la Casse (`findByName`)
C'est la règle de propreté sémantique du catalogue. Lors d'une mise à jour (`update`), le service extrait la valeur textuelle brute et la compare à l'aide de la méthode `.toLowerCase()`. Il interroge ensuite le dépôt via `tagRepository.findByName()`. Si un conflit est détecté (ex: tenter de renommer un tag en "Urgent" alors que "urgent" existe déjà), le service déclenche en *Fail-Fast* l'exception **`TagErrorFactory.nameExists()`** avant même de solliciter la base PostgreSQL.

### 🧹 Le Nettoyeur Automatique des Liaisons (`FK CASCADE`)
Le Domaine est configuré de façon robuste. Lorsqu'un utilisateur décide de détruire une étiquette, le service vérifie d'abord sa légitimité via l'armure nominale (`tag.getUserId().valeur === userId.valeur`). Une fois validée, l'opération de suppression est envoyée à l'infrastructure basse. Grâce aux contraintes **`FOREIGN KEY ... ON DELETE CASCADE`** configurées au niveau des tables PostgreSQL, la suppression d'un tag balaye automatiquement toutes ses liaisons dans la table pivot `item_tags` sans nécessiter de boucles applicatives lourdes.

---

## 🏛️ 3. Vérité d'Atelier : Qui appelle Qui ?

Pour clouer définitivement le bec aux débats de la salle de cours sur le module `Tag` :

*   **Le Contrôleur** (`TagController`) reçoit l'identité brute d'Express et appelle ➔ **`ITagService`** (via la méthode `.update()` ou `.create()`)
*   **`TagService`** enfile l'armure de type **`UserId`** et **`TagId`** imposée par son interface et appelle ➔ **`ITagRepository`**
*   **`ITagRepository`** exécute le SQL concret en sollicitant le pool unique **`DatabaseConnection`**

Le Domaine est étanche, les signatures d'interfaces mère protègent la logique métier, et l'IDE conserve son calme blanc le plus total.

# 🛤️ Manifeste de Rétro-Ingénierie — Cinématique des Flux et Appels
> **Auteur :** @author Joël, Gaïa & Co
> **Concept :** Cycle de vie complet d'une requête à travers l'Hexagone, du réseau jusqu'à la base PostgreSQL.

Ce document décrit le parcours exact d'une action utilisateur à travers le pipeline d'infrastructure Web, les barrières de validation, la logique du Domaine, et la couche de persistance.

---

## 🗺️ 1. Diagramme Sequentiel du Flux Applicatif (Exemple: Création d'une Pépite)

Voici le parcours rectiligne et étanche que subit une requête HTTP POST :

```text
[ Client Web ]
      │
      ▼ (Requête HTTP brute avec payload JSON)
[ Pipeline Express (src/app.ts) ] ➔ Active : Helmet, Cors, Rate-Limit
      │
      ▼ 🆔 Injection universelle du RequestId (RequestIdGenerator)
[ Routeur HTTP Versionné (src/routes/v1/) ]
      │
      ▼ 🛡️ DOUANE ZOD (src/validation/zod/) ➔ Éradication des données sauvages hors format
      │   └── Si échec ➔ 🚨 Craché vers le HandlerService (400 Bad Request)
      │
      ▼ 📦 EMBALLAGE DES CLIENTS (src/dto/) ➔ Transformation du JSON propre en CreateItemDto
[ ItemController (src/controllers/) ] ➔ Poste frontière de l'infrastructure Web
      │
      ▼ 🪓 ALLOCATION DE L'ARMURE NOMINALE (new UserId, new ItemId)
[ IItemService ➔ ItemService (src/services/) ] ➔ Cœur logique du cas d'usage applicatif
      │
      ▼ 🧠 Interrogation des règles d'unicité et d'ownership du Domaine
      │   └── Si anomalie métier ➔ 🚨 Levée d'une Exception Clinique (ItemErrorFactory)
      │
      ▼ 🗄️ INVERSION DE DÉPENDANCE (IItemRepository)
[ PgItemRepository (src/repositories/) ] ➔ Bras armé de la persistance PostgreSQL
      │
      ▼ 🐘 Exécution de la requête SQL (Pool DatabaseConnection via pg)
[ Base de Données PostgreSQL ]
```

---

## 🧱 2. Cartographie Chirurgicale des Responsabilités (Qui fait quoi ?)

### 📡 Phase A : L'Exposition et le Nettoyage (Infrastructure Web)
1. **`src/app.ts` & `src/server.ts`** : Amorcent le serveur Node.js en mode *Fail-Fast* et configurent la tuyauterie de sécurité réseau.
2. **`src/utils/RequestIdGenerator.ts`** : Injecte un UUID unique d'audit dans les en-têtes de la requête. Ce jeton de corrélation suivra le flux jusqu'à la persistance pour l'analyse des pannes.
3. **`src/validation/zod/`** : La douane absolue. Elle intercepte le `req.body` anonyme et applique les schémas Zod. Si un type ou une clé manque, elle coupe la trajectoire instantanément.

### 🎛️ Phase B : La Frontière du Transport (L'Aiguillage)
1. **`src/dto/` (Data Transfer Objects)** : Reçoivent le JSON validé par la douane Zod. Ils isolent la structure du réseau pour que l'application ne manipule jamais de paquets HTTP bruts.
2. **`src/controllers/` (ex: `ItemController.ts`)** : Extraient les paramètres de l'enveloppe Express. C'est ici que s'effectue la transition entre le web et le domaine. Ils récupèrent le `req.user.id` (que nous avons typé fortement en **`UserId`** dans `express.d.ts`) pour le passer proprement aux couches inférieures.

### 🧠 Phase C : Le Cœur de l'Hexagone (La Logique Métier)
1. **`src/interfaces/services/` (ex: `IItemService.ts`)** : Définissent le contrat de ce que l'application sait faire. Les contrôleurs dépendent de cette interface, jamais de la logique concrète.
2. **`src/services/` (ex: `ItemService.ts`)** : Le chef d'orchestre métier. Il reçoit les variables, instancie les Value Objects nominaux stricts (`new ItemId()`), interroge les règles d'unicité et valide la cohérence de l'action.
3. **`src/exceptions/` (ex: `ItemErrorFactory.ts`)** : Si le service détecte une violation (ex: un slug déjà existant), il lève une exception typée forte. L'exécution s'interrompt immédiatement pour être rattrapée par le **`HandlerService`** en amont, garantissant zéro fuite d'infrastructure.

### 🗄️ Phase D : La Persistance (L'Infrastructure Basse)
1. **`src/interfaces/repositories/` (ex: `IItemRepository.ts`)** : Contrat de dialogue avec le stockage. Il hérite de `IBaseRepository<TEntity, TData, TId>` pour imposer l'usage exclusif des Value Objects nominaux au lieu de simples chaînes.
2. **`src/repositories/` (ex: `PgItemRepository.ts`)** : Implémente le contrat du dépôt. Il utilise l'instance unique de **`DatabaseConnection.ts`** pour exécuter les requêtes SQL, récupérer les lignes de la table PostgreSQL et les re-transformer en instances vivantes du Domaine via le sac de données passif (`IItemData`).

---

## 🏛️ 3. Justification Philosophique : Pourquoi une classe n'appelle-t-elle jamais une interface ?

Durant les débats en salle de cours, la règle d'or universelle à rappeler est la suivante :

> **« Une interface est un contrat abstrait qui s'évapore à la compilation. On ne peut pas instancier un concept vide. L'application manipule des variables typées par l'interface, mais c'est toujours une classe concrète, vivante et physique qui s'exécute en mémoire. »**

Grâce à ce découplage complet (SOLID - Principe `DIP`), si demain l'équipe décide de remplacer PostgreSQL par MongoDB, **aucune ligne de code de tes contrôleurs ou de tes services ne changera**. Il suffira de créer un `MongoItemRepository.ts` qui implémente la même interface `IItemRepository`, et la forteresse continuera de tourner comme si de rien n'était.

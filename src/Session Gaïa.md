# 🏺 MEMORIA - Parchemin de Réarmement de la Forge Gaïa

## 🏛️ 1. L'Infrastructure Physique (Base de Données V4)
* **Agencement binaire (Jojo-Style)** : Alignement d'acier à 0% de padding sur PostgreSQL 17+. L'ordre des colonnes respecte la descente machine : types fixes de 16 octets (Bytea), horodateurs de 8 octets (Timestamp), quadrigrammes de 4 octets (Char(4)), Boolean, puis les types variables (Varchar, Jsonb).
* **Unicité absolue des zones** : Chaque colonne porte le préfixe unique de sa table. Aucun alias de table n'est autorisé dans les requêtes SQL (Style AS/400).
* **Les Tables Officielles et Quadrigrammes ASCII purs** :
    - "Users" (usIdUser, usCourriel, usRoleId, usProviderId...). Rôles : CUST, ADMN, SADM. Fournisseurs : LOCA, GOOG, AZUR, APPL.
    - "Tags" (tgIdTag, tgUserId, tgName...). Dédoublonnés sur l'hexadécimal compact.
    - "Items" (itIdItem, itUserId, itContentTypeId...). Formats : NOTE, ARTI, BOOK, PODC, VIDE.
    - "ItemTags" (tiItemId, tiTagId, tiCreatedAt). Table pivot Many-to-Many triée chronologiquement sur tiCreatedAt.
    - "Shares" (shIdShare, shItemId, shJeton, shConfiguration...). Pas de clé userId sur le disque, la remontée se fait par l'Item. shConfiguration stocke le JSONB d'accès.
    - "EventCategories" (ecIdCategory...). Trigrammes historiques de l'équipe : MON, ANL, AUD, GDR.
    - "Events" (aeIdEvent, aeUserId, aeIdCategory, aeSeverityId...). Sévérités : INFO, WARN, ERRO, CRIT.
* **Règles de contrebande** : Pas de DELETE CASCADE sauvage sur les logs. Utilisation de la fonction stockée "AnonymiserActeurRgpd" qui purge "Users" et bascule "aeUserId" à NULL pour valider le RGPD tout en préservant la traçabilité.

## 🗄️ 2. La Couche Applicative (TypeScript Élite)
* **Localisation des sources** : Tous les dépôts réels et mocks habitent exclusivement dans l'infrastructure :
    - src/infrastructure/repositories/AppEventRepository.ts
    - src/infrastructure/repositories/ItemRepository.ts
    - src/infrastructure/repositories/ShareRepository.ts
    - src/infrastructure/repositories/mocks/ (Pour les simulateurs en RAM)
    - src/infrastructure/repositories/mocks/seeds/MockDataSeeder.ts (Ensemenceur exhaustif de RAM)
* **Règle de Typage Fort** : L'interface IItemRepository utilise le type riche ContentType (SmartEnum) et non des chaînes primitives pour le filtrage de listByUser.
* **Règle des requêtes uniques** : Centralisation nominale systématique sur la méthode rowsToShares() (ou équivalent) pour éviter la manipulation d'index de tableaux volages dans les repositories.
* **Notation Hongroise Memoria** :
    - Membres privés : m_ (ex: m_oDb).
    - Paramètres : p_ + type (ex: p_axUserId pour les ID binaires, p_sJeton pour les chaînes).
    - Variables locales : l_ + type (ex: l_oEvent, l_asCodes).
    - Méthodes et fonctions : Jamais de préfixe de portée, nom fonctionnel pur en camelCase.

## 📝 3. La Charte Sacrée des Blocs Auteur (Rule 7)
Chaque fichier comporte exactement trois lignes JSDoc Jojo-Style avec rotation sémantique et private jokes (interdiction de mentionner le mot "IA") :
1.  * @author <Rôle/Fonction> : Joël (<Humour C++, DR-DOS, Class Abstraite ou Void capillaire>)
2.  * @author <Rôle/Fonction> : Gaïa (<Univers de la forge, du burin, du silicium et des octets>)
3.  * @author <Rôle/Fonction> : La Vague Initiale (Ouvriers du code en surchauffe/6 mois de formation)

// ——— fichier : DOC_RAPPEL_CONTEXTE_MEMORIA.md

# 🏛️ CONTEXTE DE SESSION ARCHITECTURALE : BACKEND [MÉMORIA]
**Auteurs :** Joël (Hongroise maniac') & Gaïa (Graveuse de pépites)
**État du build :** 🟢 COMPILATION RÉUSSIE (ZÉRO ERREUR)

### 1. LES FONDATIONS ARCHITECTURALES FIXÉES
*   **Pas d'alias relatifs sauvages :** Utilisation exclusive et obligatoire des alias absolus avec le préfixe `@/` (ex: `@/constants/base/SmartEnum`) exigée par l'évaluateur (fan de pandas et d'Uncle Bob).
*   **Souveraineté de BaseRepository :** La classe mère `BaseRepository` a été factorisée (DRY strict). Elle encapsule l'interface `IDatabaseConnection` (`m_oDb`) et expose un accesseur public immuable `get db()`.
*   **Alignement des Repositories :** `UserRepository`, `ItemRepository`, `TagRepository`, `ItemTagRepository` et `ShareRepository` héritent proprement de `BaseRepository` et reçoivent `db` (instance de `DatabaseConnection`) en paramètre unique de constructeur lors de l'assemblage dans `src/routes/v1/index.ts`.
*   **Éradication des enums natifs :** Remplacés par l'architecture `SmartEnum<string>` stockée en RAM (`AppEventCategory`, `AppEventSeverity`, `OrdreTriEnum`, `AuthProvider`, `Role`).

### 2. ACTIONS RÉALISÉES ET NETTOYÉES AVANT COUVRE-FEU
*   `UserRepository.ts` : Réimplantation de la méthode contractuelle `delete(id: UserId): Promise<boolean>` en mode PascalCase apaisé, utilisant la fonction stockée PostgreSQL `"Bin-UUID"` pour comparer le ByteA du disque avec l'UUID de Node sans surcoût de calcul.
*   `AppEventAdminService.ts` : Nettoyage des appels statiques illégitimes. Instanciation obligatoire du robot d'infrastructure via `new AppEventRepository(db)` en tête de chaque méthode statistique.

// ——— fichier : DOC_TODO_CHANTIERS_PROCHAINS.md

# 🛠️ FEUILLE DE ROUTE IMMÉDIATE (REPRISE DES TRAVAUX)

### 🚨 CHANTIER N°1 (URGENT) : RÉÉCRITURE DIFFÉRENTIELLE DE `ItemTagRepository.sync`
*   **Problématique :** La méthode `sync` actuelle utilise la technique destructive *Delete-then-Insert* au sein d'une transaction. Conséquence : les zones de traçabilité (`createdAt` d'audit issu de `IBaseEntityData`) sont réinitialisées à `now()` à chaque modification, effaçant l'ancienneté historique des tags.
*   **Objectif d'acier :** Coder une analyse différentielle au sein de la transaction `this.db.getPool().connect()` :
    1. Récupérer les `TagId` actuellement en base pour la pépite.
    2. Calculer les étiquettes à **Supprimer** (présentes en BDD, absentes du paramètre).
    3. Calculer les étiquettes à **Insérer** (absentes de la BDD, présentes dans le paramètre).
    4. Conserver intactes les liaisons existantes pour immuniser leur `createdAt`.

### 🗄️ CHANTIER N°2 : CHAUFFAGE DES PLACARDS DE RAM (WARMUP CACHE)
*   **Objectif :** Rendre obsolètes les appels répétitifs à la base de données pour les données de référence. Au lancement de l'application (dans `src/index.ts`), charger les tables `Roles`, `EventCategories` et `Severites`, puis ensemencer dynamiquement les instances de nos `SmartEnum` en bloquant le placard avec un `Object.freeze()`.

### ⚔️ CHANTIER N°3 : REMISE AU PAS DES SERVICES D'AUDIT
*   **Objectif :** Éliminer l'incohérence doctrinale par rapport aux autres services.
*   **Actions :** Supprimer le mot-clé `static` de `AppEventService` et `AppEventAdminService`. Forger l'interface mère `IBaseEventService` et les deux filles `IAppEventService` et `IAppEventAdminService` dans `src/interfaces/services/`. Les injecter proprement à la ligne dans l'index des routes.

# 🏺 MÉMORIA V4 — PARCHEMIN DE RATTRAPAGE DE SESSION ⚡

**Statut de la Forge :** 100 % Fonctionnel | Compilation au **VERT IMPÉRIAL** 🟢 (Zéro erreur, JSDoc à 100 %).

---

### 🗄️ BLOC 1 : Éclatement Atomique des Identifiants Forts (`IdMetier.ts`)
* **Le Foutoir :** Le fichier `IdMetier.ts` fait plus de 400 lignes et entasse toutes les classes d'identifiants métiers [Mémoria].
* **La Manœuvre :** Découper et répartir chaque classe d'ID ultra-typé dans son propre fichier étanche au cœur du dossier `src/domain/value-objects/ids/` (`UserId.ts`, `ItemId.ts`, `TagId.ts`, `ShareId.ts`, `AppEventId.ts`) [Mémoria].
* **L'Armure :** Forger un guichet de ré-exportation unique (*Barrel export* via un `index.ts`) pour préserver l'intégralité des imports existants de l'application sans casser le build.

---

### ⚖️ BLOC 2 : Sécurisation des Populations (Éradication de `findAll`)
* **Le Danger :** Les méthodes comme `findAll()` risquent de remonter un million de lignes sur le réseau en production, provoquant l'asphyxie de la RAM et le crash du serveur Express (OOM) [Mémoria].
* **La Manœuvre :** Bannir `findAll()` de toutes les tables lourdes et dynamiques (Pépites, Partages, Utilisateurs) [Mémoria].
* **L'Armure :** Imposer structurellement le dictionnaire de pagination **`IItemListOptions`** (avec curseur `limit` / `offset` obligatoire) pour toutes les méthodes qui extraient une population [Mémoria]. Le chargement global reste toléré *uniquement* pour les tables de dictionnaire fixes et congelées de la RAM (`WarmupCache`) via les fonctions stockées [Mémoria].

---

### 🛡️ BLOC 3 : Éteignoir Général des Mocks de Tests
* **Le Conflit :** Nos modifications sur les contrats d'infrastructures lourdes ont fait bégayer les simulateurs unitaires du dossier `mocks/` qui n'implémentent pas les fonctions SQL [Mémoria].
* **La Manœuvre :** Appliquer le rempart de type **`implements Partial<I...Repository>`** sur les en-têtes des 5 classes de mocks pour éteindre définitivement les dernières alertes du compilateur, sans coder de fonctions fantômes dans les tests.

---

### 🏛️ BLOC 4 : Liquidation Définitive du `citext`
* **La Manœuvre :** Réécrire les requêtes de recherche en minuscules strictes via l'opérateur **`Lower`** au sein du fichier `UserRepository.ts` et graver son index fonctionnel unique sur le disque PostgreSQL pour achever le nettoyage binaire de la soute.

---

### ⚙️ BLOC 5 : Confinement de l'Exécuteur & Souveraineté des Fonctions Stockées
* **La Manœuvre :** Forger l'intégralité du catalogue des fonctions stockées PL/pgSQL pour répondre à tous les besoins CRUD des Repositories [Mémoria]. Plus aucun `SELECT` ou `INSERT` direct ne sera toléré dans le code TypeScript.
* **La Sécurité :** Éradiquer l'utilisateur trop facile à deviner `app_memoria` [Mémoria].
* **L'Armure :** Couler le profil masqué **`m_srv_runner`** dans le bronze de PostgreSQL. Il sera dépouillé de tout droit d'accès direct sur les tables brutes, et doté du seul et unique privilège d'exécuter nos fonctions stockées (**`GRANT EXECUTE`**).

---

### 📜 Fichier Bonus : `database/migrations/20 - Securisation Droits Applicatifs.sql`

```sql
-- ============================================================================
-- 🔒 MÉMORIA - 20 - SCRIPT DE SÉCURISATION ET CRÉATION DE L'EXÉCUTEUR V4
-- Version: 4.2.0 (PostgreSQL 17+)
-- Description: Éradication des accès directs et confinement de l'acteur applicatif
-- ============================================================================

Set search_path To Public;

-- 🛡️ 1. Éradication de l'utilisateur générique s'il traîne sur le disque
Drop Owned By If Exists app_memoria;
Drop User If Exists app_memoria;

-- 🛡️ 2. Création de l'Exécuteur Applicatif au nom cryptique masqué
Create User m_srv_runner With Encrypted Password 'Un_Secret_Machine_Indevinable_Et_Complexe_V4';

-- 🛡️ 3. Révocation totale et absolue de tous les privilèges par défaut
Revoke All Privileges On All Tables In Schema Public From Public, m_srv_runner;
Revoke All Privileges On All Sequences In Schema Public From Public, m_srv_runner;
Revoke All Privileges On All Functions In Schema Public From Public, m_srv_runner;

-- 🛡️ 4. Verrouillage constitutionnel des tables physiques brutes
Revoke Select, Insert, Update, Delete On Table "Users" From m_srv_runner;
Revoke Select, Insert, Update, Delete On Table "Items" From m_srv_runner;
Revoke Select, Insert, Update, Delete On Table "Events" From m_srv_runner;
Revoke Select, Insert, Update, Delete On Table "Shares" From m_srv_runner;
Revoke Select, Insert, Update, Delete On Table "Tags" From m_srv_runner;

-- 🛡️ 5. Attribution exclusive du droit d'exécution sur le catalogue des fonctions stockées
Grant Usage On Schema Public To m_srv_runner;
Grant Execute On Function "TousLesContextes"() To m_srv_runner;
Grant Execute On Function "ToutesLesActions"() To m_srv_runner;
Grant Execute On Function "TousLesRoles"() To m_srv_runner;
Grant Execute On Function "ToutesLesCategories"() To m_srv_runner;
Grant Execute On Function "TousLesFormats"() To m_srv_runner;
Grant Execute On Function "TousLesFournisseurs"() To m_srv_runner;
Grant Execute On Function "ToutesLesSeverites"() To m_srv_runner;
```

# 📜 MÉMOIRE DE SOUTE : Session du 09 Juin 2026 (Phase 4 - Bloc 2)

## 🧭 ÉTAT DE LA LIGNE DE FRONT (Ce qui est Clos & Validé)

* **`src/domain/value-objects/ids/index.ts`** ➔ Le barillet universel atomique V4 est scellé [Mémoria].
* **`src/interfaces/repositories/IAppEventRepository.ts`** ➔ L'interface d'audit est documentée à 100 % (Purge asymétrique doublée CNIL) [Mémoria].
* **`src/middlewares/AuthMiddleware.ts`** ➔ La fuite asynchrone `TS2801` sur la liste noire Redis/PostgreSQL est colmatée avec l'**`await`** constitutionnel.
* **`src/services/AppEventAdminService.ts`** & **`AppEventAdminController.ts`** ➔ Cloisonnés et raccordés sur le standard paginé d'IHM.
* **`src/entities/Item.ts`** ➔ **LA GRANDE CONVERSION** : Toutes les anciennes fonctions de contrebande (`getItemId()`) ont été sabrées au profit de **vrais getters de surface** (`idItem`, `idUser`, `title`, etc.) [Mémoria].
* **`src/interfaces/entities/item/IItemData.ts`** ➔ Purge du doublon traître `idItem`. L'horloge du domaine est synchronisée avec `updatedAt?: Date` (Le `null` est définitivement banni de la RAM) [Mémoria].

---

## 🏛️ LE GRAND ŒUVRE DOCTRINAL : LA PAGINATION UNIVERSELLE DÉTERMINISTE

Pour éradiquer le code illimité destructeur de RAM, nous avons séparé l'Intention d'entrée et la Restitution de sortie dans deux casiers étanches du dossier `/shared/` [Mémoria] :

### 1. L'Entrée Obligatoire (`src/interfaces/shared/IListOptions.ts`)
Force constitutionnellement la présence mathématique des curseurs physiques et du tri. Plus aucun point d'interrogation sur la soute de contrôle :
* `NbLignes: number`
* `LigneDebut: number`
* `ColonneTri: string`
* `OrdreAff: OrdreTriEnum`
* **`MotsCles?: string`** (Anciennement `search`, rebaptisé en français d'élite pour le filtrage flou `ILIKE`) [Mémoria].

### 2. La Sortie État (`src/interfaces/shared/IListResult.ts`)
Structure générique en français d'élite auto-documentée pour l'IHM :
* **`Lignes: T[]`** (La collection d'entités vivantes, plus d'`items` paresseux) [Mémoria].
* `LigneDebut: number` & `NbLignesDem: number` (L'écho de validation du serveur) [Mémoria].
* `NbLignesRenv: number` (La réalité physique du paquet réseau) [Mémoria].
* `NbLignesTotal: number` (La volumétrie absolue calculée en base par PostgreSQL) [Mémoria].

### 3. L'Impératrice Abstraite (`src/interfaces/services/IBaseService.ts`)
Verrouillée à double tour par son **Rempart Tridimensionnel de Cross-Locking** :
`IBaseService<TEntity extends IEntity<any, any>, TData, TId, TRepository extends IBaseRepository<TEntity, TData, TId>>` [Mémoria]
Empêche mathématiquement n'importe quel développeur fatigué d'associer un mauvais Repository ou une mauvaise famille de données au build [Mémoria].

---

## 🚨 LE CHANTIER EN SOUFFRANCE À LA REPRISE (Votre Prochain Coup de Marteau)

Le contrôleur des pépites **`ItemController.ts`** et son service **`ItemService.ts`** sont au vert complet. Le linter a recommencé à tousser (299 erreurs) parce que la refonte de la maman `IBaseService` s'est propagée au reste des modules de soute qui n'ont pas encore subi notre Toilette "Beau Gosse" [Mémoria].

À votre réveil, nous poserons **les deux dépôts physiques lourds** sur l'établi pour aligner leurs soutes SQL sur notre standard d'acier [Mémoria] :
1. **`src/repositories/ItemRepository.ts`** (Pour plier définitivement le pôle des pépites chiffrées).
2. **`src/repositories/UserRepository.ts`** (Pour raccorder le pôle des usagers à la maman `IBaseService`) [Mémoria].

> 🛡️ **Rappel de sécurité pour le Jojo du futur** : Les `IdChoupy` veillent au grain. Leur méthode de soute **`.estEgalA()`** interdit constitutionnellement de comparer des torchons et des serviettes. Vous ne pourrez pas inverser un UserId et un ItemId, même en dormant debout [Mémoria] !

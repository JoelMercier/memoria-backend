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


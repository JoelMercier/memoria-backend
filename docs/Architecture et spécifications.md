# 🏺 Architecture et spécifications de la base de données V4

**Rédacteur :** Direction de l'Infrastructure et de la Persistance
**Version :** 4.1.0 (PostgreSQL 17+)
**État du build :** 🟢 Validé à 100% | Spécifications d'acier pour le rapport final

Ce document constitue le référentiel unique de soute pour l'application [Mémoria]. Pour optimiser les performances processeur et éliminer le rembourrage binaire (padding), toutes les structures suivent un alignement descendant strict en fonction de la taille physique des types de données. Pour préserver la santé mentale de l'artisan lors des phases de débogage visuel, le stockage utilise le type `UUID` natif sur le disque, tandis que le transit applicatif TypeScript s'effectue en `Buffer` (16 octets) via les convertisseurs de soute natifs sans surcoût CPU.

---

## 🏛️ 1. Les fonctions d'infrastructure et de trans-typage natif

Pour éradiquer les opérations coûteuses de double transtypage textuel, la soute s'appuie sur trois utilitaires système étanches :

* **`"GenererUuidV7"()`** : Générateur autonome et explicitement volatile (`VOLATILE`). Il assemble 48 bits de timestamp Unix millisecondes et 74 bits de hasard binaire cryptographique pour injecter des UUID v7 d'élite, garantissant un tri chronologique naturel et l'évaporation du cache par ligne.
* **`"Gen_Random_Uuid"()`** : Fonction miroir servant de doublure d'infrastructure pour Cour Basse. Elle simule la V4 native de PostgreSQL pour ne pas désorienter les collègues, tout en injectant secrètement la V7 chronologique.
* **`"UUID-Bin"`(UUID)** : Extrait directement le flux binaire de 16 octets d'un UUID via la commande native `uuid_send` sans transit textuel.
* **`"Bin-UUID"`(ByteA)** : Convertit un segment binaire de 16 octets (ByteA) directement en UUID visuel via la commande `encode`.

---

## 🗄️ 2. Le registre matriciel des tables de référence (Dictionnaires immuables)

Tous les dictionnaires sont figés en RAM au démarrage de l'application (la chaufferie) et s'appuient sur un alignement physique descendant parfait : `Timestamp` (8 octets), `Char(4)` (4 octets), `Smallint` (2 octets), puis les variables (`Varchar`).

### 📊 Table "Roles" — Droits et privilèges d'accès
* 🔠 `roIdRole` : Clé primaire fixe (Char(4)) ➔ `CUST` (Utilisateur), `ADMN` (Administrateur), `SADM` (Super Administrateur).
* 🔢 `roNiveau` : Poids numérique unique de pouvoir pour les contrôles de soute (Smallint : 10, 20, 30).
* 🎛️ `roOrdreAff` : Position numérique unique pour le tri graphique des listes de l'interface (Smallint).

### 🔐 Table "Providers" — Fournisseurs d'authentification externes
* 🔠 `apIdProvider` : Clé primaire fixe (Char(4)) ➔ `LOCA` (Local), `GOOG` (Google), `AZUR` (Azure), `APPL` (Apple).
* 🎛️ `apOrdreAff` : Position numérique unique pour le tri ergonomique de l'interface (Smallint).

### 📦 Table "ContentTypes" — Formats des pépites de connaissances
* 🔠 `ctIdContentType` : Clé primaire fixe (Char(4)) ➔ `NOTE` (Note), `ARTI` (Article), `BOOK` (Livre), `PODC` (Podcast), `VIDE` (Vidéo).
* 🎛️ `ctOrdreAff` : Tri logique exclusif pour les composants visuels (Smallint).

### 🚨 La matrice orthogonale du journal d'audit
Pour éradiquer les enums combinatoires lourds, le système d'audit croise trois dictionnaires rigides en `Char(4)` combinés à une contrainte de casse `CHECK = Upper(Id)` :
* **`"EventCategories"`** : Les piliers d'exploitation ➔ `MONI` (Monitoring), `ANAL` (Analyses), `AUDI` (Sécurité), `RGPD` (Données privées).
* **`"Severites"`** : Les niveaux de gravité ➔ `INFO`, `WARN`, `ERRO`, `CRIT` et la sucrerie expérimentale `FATA`.
* **`"EventSecteurs"`** : Les périmètres fonctionnels ➔ `SYST` (Système), `UTIL` (Acteur), `AUTH` (Sécurité), `PEPI` (Pépites), `BASE` (Données), `RGPD`.
* **`"EventActions"`** : La nature de l'opération ➔ `DEMA` (Démarrage), `CONN` (Connexion), `ENRE`, `ECHE` (Échec), `CREA`, `PART`, `EXPO`, `LENT` (Requête lente) et `PURG` (Purge de soute).

---

## 💎 3. Le cœur des données vivantes (Tables lourdes dynamiques)

### 👥 Table "Users" — Coffre-fort d'identification des acteurs
* 🆔 `usIdUser` : Clé primaire de l'acteur (UUID, 16 octets).
* 🔲 `usRgpdConsent` : Drapeau de validation obligatoire placé avant les variables pour bloquer le padding (Boolean, 1 octet).
* ✍️ `usCourriel` : Adresse normalisée en minuscules stricts via une contrainte `CHECK` (Varchar(254)).
* 🛡️ *Optimisation de soute* : Suppression de la contrainte unique classique sur la colonne au profit du seul index unique fonctionnel externe `Users_usCourriel_Lower_Udx`. Ce parachute de performance force l'optimiseur de requêtes (Query Planner) à exécuter un *Index Scan* instantané lors des phases d'authentification.

### 📦 Table "Items" — Stockage des pépites atomiques
* 🆔 `itIdItem` : Clé primaire de la pépite (UUID, 16 octets).
* 🆔 `itUserId` : Clé étrangère pointant vers l'unique utilisateur propriétaire (UUID, 16 octets).
* 🔠 `itContentTypeId` : Clé étrangère liée au format du contenu (Char(4), 4 octets).
* ✍️ `itSlug` : Version URL-friendly du titre calculée de manière synchrone par la RAM (Varchar(255)).
* 📦 `itMetadata` : Sac binaire indexé via un index GIN pour les attributs spécifiques aux formats (Jsonb).
* 🛡️ *Optimisation de soute* : Intégration de l'index composite d'élite `Items_itUserId_itCreatedAt_Idx` (ordonné en `DESC`) pour foudroyer le coût de restitution du flux chronologique de l'acteur sans fusion d'index en RAM.

### 🏷️ Table "Tags" — Casier des mots-clés par acteur
* 🆔 `tgIdTag` : Clé primaire de l'étiquette (UUID, 16 octets).
* 🆔 `tgUserId` : Clé étrangère liant le tag à son propriétaire légitime (UUID, 16 octets).
* ✍️ `tgName` : Libellé nettoyé verrouillé en minuscules stricts par une contrainte `CHECK` (Varchar(50)).
* 🛡️ *Optimisation de soute* : L'index unique composite `Tags_tgUserId_tgName_Udx` garantit qu'un acteur ne peut pas dupliquer sémantiquement ses propres mots-clés.

### 🔗 Table pivot "ItemTags" — Liaison Many-to-Many compacte
* 🆔 `tiItemId` / `tiTagId` : Clés étrangères composites formant la clé primaire de liaison (UUID, 16 + 16 octets).
* 📅 `tiCreatedAt` : Horodatage d'audit immuable (Timestamp, 8 octets).
* 🛡️ *Optimisation de soute* : Pour propulser l'algorithme différentiel de la méthode TypeScript `ItemTagRepository.sync` (calcul des deltas d'insertion/suppression au sein d'une transaction unique pour immuniser la date de création historique), l'index inversé simple a été converti en index composite d'élite : `ItemTags_tiTagId_tiItemId_Idx`.

### 🔗 Table "Shares" — Passerelles URL-Safe d'accès public
* 🆔 `shIdShare` : Clé primaire du contrat de partage (UUID, 16 octets).
* 🆔 `shItemId` : Clé étrangère pointant vers la pépite partagée (UUID, 16 octets).
* 🆔 `shItemOwnerId` : Clé étrangère binaire **dé-normalisée pour la haute performance pure** (UUID, 16 octets). Elle évite une double jointure sur des millions de lignes à chaque vérification de droit d'accès de Cour Basse en offrant une lecture en O(1).
* ✍️ `shJeton` : Jeton aléatoire de contrebande réseau servant de clé unique publique (Varchar(255)).

### 🚨 Table "Events" — Journal d'audit Append-Only immuable
* 🆔 `aeIdEvent` : Clé primaire de la trace (UUID, 16 octets).
* 🆔 `aeUserId` : Clé étrangère optionnelle pointant vers le responsable (UUID, 16 octets, basculée à `NULL` par le protocole RGPD).
* 🔠 Quatre quadrigrammes de soute connectés aux dictionnaires (`aeCategoryId`, `aeSeverityId`, `aeSecteurId`, `aeActionId`).
* 🛡️ *Automatisation de la Forteresse* : Le déclencheur global `Events_BilanPurge_Trg` s'exécute `AFTER DELETE FOR EACH STATEMENT`. Une fois la purge achevée, il intercepte le nombre de lignes détruites via `Get Diagnostics` et injecte de manière 100 % autonome une ligne d'audit technique avec l'action `'PURG'`, le tout sous le camouflage nominal de l'usine v7.

---

## 🎯 4. Analyse des risques et propositions d'amélioration de soute

Pour pousser la V4 à un niveau de sécurité militaire, trois ajustements de conception sont consignés pour la prochaine feuille de route :
1. **Création du dictionnaire "ShareModes" (Char(4))** : Pour sortir le type racine du partage du JSONB libre `shConfiguration` et le faire contrôler par le moteur PostgreSQL via des codes fixes (`PUBL`, `PROT`, `EXPI`).
2. **Création du dictionnaire "UserStatus" (Char(4))** : Pour remplacer les logiques applicatives par une véritable machine d'état gérant le cycle de vie de l'acteur (`PEND` en attente, `ACTI` actif, `SUSP` suspendu, `BANN` banni, `ANON` anonymisé).
3. **Création du dictionnaire "TagCategories" (Char(4))** : Pour catégoriser la taxonomie du second cerveau et permettre à l'optimiseur de filtrer des pans entiers de la table pivot avant même d'analyser les chaînes de texte.

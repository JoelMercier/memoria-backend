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

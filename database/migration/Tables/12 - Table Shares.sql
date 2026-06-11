-- ============================================================================
-- 🔗 Mémoria - Shares
-- Fichier: database/migrations/11 - Table Shares.sql
-- Version: 3.2.1 (PostgreSQL 17+)
-- Description: Passerelles URL-Safe de partage - Alignement binaire parfait
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Padding = 0%)
-- ----------------------------------------------------------------------------
Drop Table If Exists "Shares";

Create Table "Shares" ( -- Alignement machine descendant strict pour éliminer le padding physique
    "shIdShare"       Uuid Not Null,                                 -- 16 octets fixes (Value Object binaire)
    "shItemId"        Uuid Not Null,                                 -- 16 octets fixes (Zone clé étrangère liée à Items)
    "shItemOwnerId"   Uuid Not Null,                                 -- 16 octets fixes (Zone dé-normalisée pour la performance pure)
    "shCreatedAt"     Timestamp Without Time Zone Not Null Default Current_Timestamp, --  8 octets fixes
    "shUpdatedAt"     Timestamp Without Time Zone,                   --  8 octets fixes (Géré par notre trigger universel)
    "shCourrielDest"  Varchar(255),                                  -- Taille variable
    "shJeton"         Varchar(255) Not Null,                         -- Taille variable (Clé unique publique)
    "shConfiguration" Jsonb Not Null Default '{}'::Jsonb,            -- Taille variable (Règles d'accès complexes)

    Constraint "Shares_shIdShare_Pkey" Primary Key ("shIdShare"),
    Constraint "Shares_shJeton_Udx" Unique ("shJeton"),

    Constraint "Shares_shIdShare_Taille_Chk"     Check (octet_length("UUID-Bin"("shIdShare"    )) = 16),
    Constraint "Shares_shItemId_Taille_Chk"      Check (octet_length("UUID-Bin"("shItemId"     )) = 16),
    Constraint "Shares_shItemOwnerId_Taille_Chk" Check (octet_length("UUID-Bin"("shItemOwnerId")) = 16),

    Constraint "Shares_shItemId_Fkey" Foreign Key ("shItemId") References "Items" ("itIdItem"),
    Constraint "Shares_shItemOwnerId_Fkey" Foreign Key ("shItemOwnerId") References "Users" ("usIdUser")
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques
-- ----------------------------------------------------------------------------
-- Parachutes de performance pour l'optimiseur de requêtes
Create Index "Shares_shItemId_Idx" On "Shares" Using btree ("shItemId" Asc Nulls Last);
Create Index "Shares_shItemOwnerId_Idx" On "Shares" Using btree ("shItemOwnerId" Asc Nulls Last);

-- ----------------------------------------------------------------------------
-- ⚡ 3. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "Shares_TraceModifs_Trg"
Before Update on "Shares"
For Each Row Execute Function "TraceModif"('shUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 4. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment on Table "Shares" is 'Passerelles URL-Safe permettant l''accès de consultation temporaire ou permanent aux pépites.';

Comment on Column "Shares"."shIdShare"       is 'Identifiant unique du partage, calculé en UUID v7 (16 octets Bytea / UUID).';
Comment on Column "Shares"."shItemId"        is 'Clé étrangère binaire invitée pointant vers la pépite partagée.';
Comment On Column "Shares"."shItemOwnerId"   is 'Clé étrangère binaire dé-normalisée pour la performance pure, pointant vers l''utilisateur propriétaire.';
Comment on Column "Shares"."shCreatedAt"     is 'Horodatage de création physique.';
Comment on Column "Shares"."shUpdatedAt"     is 'Horodatage de dernière modification géré physiquement par le trigger universel TraceModif.';
Comment on Column "Shares"."shCourrielDest"  is 'Adresse de courriel optionnelle du destinataire invité externe, normalisée en minuscules.';
Comment on Column "Shares"."shJeton"         is 'Jeton aléatoire sécurisé de contrebande réseau servant de clé d''accès unique publique.';
Comment on Column "Shares"."shConfiguration" is 'Dictionnaire Jsonb stockant les règles d''accès brutes (level, allow_download, expiration).';

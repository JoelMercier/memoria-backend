-- ============================================================================
-- 🔗 Mémoria - Shares.sql
-- Fichier: database/migrations/12 - Table Shares.sql
-- Version: 3.2.0 (PostgreSQL 17+)
-- Description: Passerelles URL-Safe binaires - Alignement binaire Jojo-Style
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits de padding)
-- ----------------------------------------------------------------------------
Drop Table if Exists "Shares";

Create Table "Shares" (
    "shIdShare"       UUID Not Null,         -- 16 octets bruts fixes (Pour la classe IdBinaire)
    "shItemId"        UUID Not Null,         -- 16 octets bruts fixes (Zone clé étrangère liée à Items.itIdItem)
    "shCreatedAt"     Timestamp Not Null Default Current_Timestamp, --  8 octets       fixes (Date de création)
    "shUpdatedAt"     Timestamp,              --  8 octets       fixes (Géré par notre trigger universel)
    "shCourrielDest"  Varchar(255) Null,      -- Variable (Zone francisée, nulle si partage public)
    "shJeton"         Varchar(255) Not Null,  -- Variable (Token sécurisé d accès)
    "shConfiguration" Jsonb Not Null Default '{}'::jsonb, -- Structure variable lourde (Ferme la ligne)

    Constraint "Shares_shIdShare_Pkey" Primary Key ("shIdShare"),

    Constraint "Shares_shItemId_Fkey" Foreign Key ("shItemId") References "Items"("itIdItem"),

    Constraint "Shares_shJeton_Udx" Unique ("shJeton"),

    Constraint "Shares_shIdShare_Taille_Chk" Check (octet_length("UUID-Bin"("shIdShare")) = 16),
    Constraint "Shares_shItemId_Taille_Chk"  Check (octet_length("UUID-Bin"("shItemId" )) = 16)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques
-- ----------------------------------------------------------------------------
Create Index "Shares_shItemId_Idx" on "Shares" ("shItemId");

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
Comment on Column "Shares"."shCreatedAt"     is 'Horodatage de création physique.';
Comment on Column "Shares"."shUpdatedAt"     is 'Horodatage de dernière modification géré physiquement par le trigger universel TraceModif.';
Comment on Column "Shares"."shCourrielDest"  is 'Adresse de courriel optionnelle du destinataire invité externe, normalisée en minuscules.';
Comment on Column "Shares"."shJeton"         is 'Jeton aléatoire sécurisé de contrebande réseau servant de clé d''accès unique publique.';
Comment on Column "Shares"."shConfiguration" is 'Dictionnaire Jsonb stockant les règles d accès brutes (level, allow_download, expiration).';

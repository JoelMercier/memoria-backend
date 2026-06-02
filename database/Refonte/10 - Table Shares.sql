-- ============================================================================
-- 🔗 Mémoria - 09 - Shares.sql
-- Fichier: database/migrations/09 - Shares.sql
-- Version: 3.2.0 (PostgreSQL 17+)
-- Description: Passerelles URL-Safe binaires - Alignement binaire Jojo-Style
-- ============================================================================

Set search_path To Public;

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits de padding)
-- ----------------------------------------------------------------------------
Create Table "Shares" (
    "shIdShare"       Bytea Not Null,         -- 16 octets bruts fixes (Pour la classe IdBinaire) [Mémoria]
    "shItemId"        Bytea Not Null,         -- 16 octets bruts fixes (Zone clé étrangère liée à Items.itIdItem) [Mémoria]
    "shCreatedAt"     Timestamp Not Null,     -- 8 octets fixes (Date brute calculée par le domaine)
    "shUpdatedAt"     Timestamp,              -- 8 octets fixes (Géré par notre trigger universel)
    "shCourrielDest"  Varchar(255) Null,      -- Variable (Zone francisée, nulle si partage public) [Mémoria]
    "shJeton"         Varchar(255) Not Null,  -- Variable (Token sécurisé d accès) [Mémoria]
    "shConfiguration" Jsonb Not Null Default '{}'::jsonb, -- Structure variable lourde (Ferme la ligne) [Mémoria]

    Constraint "Shares_shIdShare_Pkey" Primary Key ("shIdShare"),
    Constraint "Shares_shItemId_Fkey" Foreign Key ("shItemId") References "Items"("itIdItem") On Delete Cascade,
    Constraint "Shares_shJeton_Udx" Unique ("shJeton"),
    Constraint "Shares_shIdShare_Taille_Chk" Check (octet_length("shIdShare") = 16),
    Constraint "Shares_shItemId_Taille_Chk" Check (octet_length("shItemId") = 16)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques
-- ----------------------------------------------------------------------------
Create Index "Shares_shItemId_Idx" On "Shares" ("shItemId");

-- ----------------------------------------------------------------------------
-- ⚡ 3. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "Shares_BeforeUpdate_Trg"
Before Update on "Shares"
For Each Row Execute Function "TraceModif"('shUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 4. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "Shares" is 'Passerelles URL-Safe permettant l accès de consultation temporaire ou permanent aux pépites.';
Comment On Column "Shares"."shIdShare" is 'Identifiant unique du partage, calculé en UUIDv7 (16 octets Bytea) par le domaine.';
Comment On Column "Shares"."shItemId" is 'Clé étrangère binaire invitée (On Delete Cascade) pointant vers la pépite partagée.';
Comment On Column "Shares"."shCreatedAt" is 'Horodatage de création physique géré en amont par la RAM du domaine.';
Comment On Column "Shares"."shUpdatedAt" is 'Horodatage de dernière modification géré physiquement par le trigger universel TraceModif.';
Comment On Column "Shares"."shCourrielDest" is 'Adresse de courriel optionnelle du destinataire invité externe, normalisée en minuscules.';
Comment On Column "Shares"."shJeton" is 'Jeton aléatoire sécurisé de contrebande réseau servant de clé d accès unique publique.';
Comment On Column "Shares"."shConfiguration" is 'Dictionnaire Jsonb stockant les règles d accès brutes (level, allow_download, expiration).';

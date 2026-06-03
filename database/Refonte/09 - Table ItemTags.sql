-- ============================================================================
-- 🔗 Mémoria - 08 - ItemTags.sql
-- Fichier: database/migrations/09 - Table ItemTags.sql
-- Version: 3.2.0 (PostgreSQL 17+)
-- Description: Association Many-to-Many compacte avec traçabilité temporelle
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Padding = 0%)
-- ----------------------------------------------------------------------------
Drop Table if Exists "ItemTags";

Create Table "ItemTags" (
    "tiItemId"    UUID Not Null,                                -- 16 octets bruts fixes (Zone clé étrangère liée à Items.itIdItem)
    "tiTagId"     UUID Not Null,                                -- 16 octets bruts fixes (Zone clé étrangère liée à Tags.tgIdTag)
    "tiCreatedAt" Timestamp Not Null Default Current_Timestamp, --  8 octets       fixes (Zone de traçabilité temporelle immuable)

    Constraint "ItemTags_tiItemId_tiTagId_Pkey" Primary Key ("tiItemId", "tiTagId"),

    Constraint "ItemTags_tiItemId_Fkey" Foreign Key ("tiItemId") References "Items"("itIdItem"),
    Constraint "ItemTags_tiTagId_Fkey"  Foreign Key ("tiTagId" ) References "Tags"("tgIdTag"  ),

    Constraint "ItemTags_tiItemId_Taille_Chk" Check (octet_length("UUID-Bin"("tiItemId")) = 16),
    Constraint "ItemTags_tiTagId_Taille_Chk"  Check (octet_length("UUID-Bin"("tiTagId" )) = 16)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques
-- ----------------------------------------------------------------------------
Create Index "ItemTags_tiTagId_Idx"     on "ItemTags" ("tiTagId"         );
Create Index "ItemTags_tiCreatedAt_Idx" on "ItemTags" ("tiCreatedAt" Desc);

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment on Table "ItemTags" is 'Table de liaison N <=> N entre les étiquettes ("Tags") et les pépites ("Items").';

Comment on Column "ItemTags"."tiItemId"    is 'Clé étrangère binaire invitée pointant vers la pépite d origine ("Items"."itIdItem").';
Comment on Column "ItemTags"."tiTagId"     is 'Clé étrangère binaire invitée pointant vers l''étiquette associée ("Tags"."tgIdTag").';
Comment on Column "ItemTags"."tiCreatedAt" is 'Horodatage fixe et immuable de l''association du tag à la pépite.';

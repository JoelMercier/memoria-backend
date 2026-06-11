-- ============================================================================
-- 🔗 Mémoria - ItemTags.sql
-- Fichier: database/migrations/11 - Table ItemTags.sql
-- Version: 3.2.1 (PostgreSQL 17+)
-- Description: Association Many-to-Many compacte avec traçabilité temporelle
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Padding = 0%)
-- ----------------------------------------------------------------------------
Drop Table if Exists "ItemTags";

Create Table "ItemTags" ( -- Alignement machine descendant strict pour éliminer le padding physique
    "tiItemId"    UUID Not Null,                                -- 16 octets fixes (Zone clé étrangère liée à Items)
    "tiTagId"     UUID Not Null,                                -- 16 octets fixes (Zone clé étrangère liée à Tags)
    "tiCreatedAt" Timestamp Not Null Default Current_Timestamp, --  8 octets fixes (Zone de traçabilité temporelle immuable)

    Constraint "ItemTags_tiItemId_tiTagId_Pkey" Primary Key ("tiItemId", "tiTagId"),

    Constraint "ItemTags_tiItemId_Taille_Chk" Check (octet_length("UUID-Bin"("tiItemId")) = 16),
    Constraint "ItemTags_tiTagId_Taille_Chk"  Check (octet_length("UUID-Bin"("tiTagId" )) = 16),

    Constraint "ItemTags_tiItemId_Fkey" Foreign Key ("tiItemId") References "Items"("itIdItem"),
    Constraint "ItemTags_tiTagId_Fkey"  Foreign Key ("tiTagId" ) References "Tags"("tgIdTag")
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques
-- ----------------------------------------------------------------------------
-- Index composite inverse : foudroie les recherches de pépites par mot-clé et l'analyse de sync()
Create Index "ItemTags_tiTagId_tiItemId_Idx" On "ItemTags" ("tiTagId", "tiItemId");
Create Index "ItemTags_tiCreatedAt_Idx"      On "ItemTags" ("tiCreatedAt" Desc);

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment on Table "ItemTags" is 'Table de liaison N <=> N entre les étiquettes ("Tags") et les pépites ("Items").';

Comment on Column "ItemTags"."tiItemId"    is 'Clé étrangère binaire invitée pointant vers la pépite d''origine ("Items"."itIdItem").';
Comment on Column "ItemTags"."tiTagId"     is 'Clé étrangère binaire invitée pointant vers l''étiquette associée ("Tags"."tgIdTag").';
Comment on Column "ItemTags"."tiCreatedAt" is 'Horodatage fixe et immuable de l''association du tag à la pépite.';

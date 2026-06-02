-- ============================================================================
-- 🔗 Mémoria - 08 - ItemTags.sql
-- Fichier: database/migrations/08 - ItemTags.sql
-- Version: 3.2.0 (PostgreSQL 17+)
-- Description: Association Many-to-Many compacte avec traçabilité temporelle
-- ============================================================================

Set search_path To Public;

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Padding = 0%)
-- ----------------------------------------------------------------------------
Create Table "ItemTags" (
    "tiItemId"    Bytea Not Null,         -- 16 octets bruts fixes (Zone clé étrangère liée à Items.itIdItem) [Mémoria]
    "tiTagId"     Bytea Not Null,         -- 16 octets bruts fixes (Zone clé étrangère liée à Tags.tgIdTag) [Mémoria]
    "tiCreatedAt" Timestamp Not Null,     -- 8 octets fixes (Zone de traçabilité temporelle immuable)

    Constraint "ItemTags_tiItemId_tiTagId_Pkey" Primary Key ("tiItemId", "tiTagId"),
    Constraint "ItemTags_tiItemId_Fkey" Foreign Key ("tiItemId") References "Items"("itIdItem") On Delete Cascade,
    Constraint "ItemTags_tiTagId_Fkey" Foreign Key ("tiTagId") References "Tags"("tgIdTag") On Delete Cascade,
    Constraint "ItemTags_tiItemId_Taille_Chk" Check (octet_length("tiItemId") = 16),
    Constraint "ItemTags_tiTagId_Taille_Chk" Check (octet_length("tiTagId") = 16)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques
-- ----------------------------------------------------------------------------
Create Index "ItemTags_tiTagId_Idx" On "ItemTags" ("tiTagId");
Create Index "ItemTags_tiCreatedAt_Idx" On "ItemTags" ("tiCreatedAt" Desc);

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "ItemTags" is 'Table pivot relationnelle assurant la liaison Many-to-Many avec traçabilité temporelle immuable.';
Comment On Column "ItemTags"."tiItemId" is 'Clé étrangère binaire invitée (On Delete Cascade) pointant vers la pépite d origine ("Items"."itIdItem").';
Comment On Column "ItemTags"."tiTagId" is 'Clé étrangère binaire invitée (On Delete Cascade) pointant vers l étiquette associée ("Tags"."tgIdTag").';
Comment On Column "ItemTags"."tiCreatedAt" is 'Horodatage fixe et immuable de l association du tag à la pépite, géré en RAM par le domaine.';

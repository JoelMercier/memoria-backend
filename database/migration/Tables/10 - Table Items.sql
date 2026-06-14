-- ============================================================================
-- 📦 Mémoria - Items
-- Fichier: database/migrations/10 - Table Items.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Le cœur du coffre-fort : stockage des pépites atomiques
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ------------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits de padding)
-- ------------------------------------------------------------------------------
Drop Table if exists "Items" Cascade;

Create Table "Items" (
    "itIdItem"        UUID Not Null,                                -- 16 octets fixes (Value Object binaire UUID).
    "itUserId"        UUID Not Null,                                -- 16 octets fixes (Zone clé étrangère liée à Users).
    "itCreatedAt"     Timestamp Not Null Default Current_Timestamp, --  8 octets fixes (Horodatage de création).
    "itUpdatedAt"     Timestamp,                                    --  8 octets fixes (Géré par notre trigger universel).
    "itContentTypeId" Char(4) Not Null,                             --  4 octets fixes (Zone clé étrangère liée à ContentTypes).
    "itLibelle"       Varchar(255) Not Null,                        -- Taille variable (Substitue l''ancien itTitle).
    "itSlug"          Varchar(255) Not Null,                        -- Taille variable (Géré en minuscules par le domaine).
    "itAuteurSource"  Varchar(50) Not Null Default 'N.C.',          -- Taille variable (Substitue l''ancien itSourceAuthor).
    "itThumbnailUrl"  Varchar(255) Null,                            -- Taille variable.
    "itMetadata"      Jsonb Not Null Default '{}'::jsonb,           -- Taille variable (Sac indexé GIN).
    "itContent"       Text Not Null,                                -- Taille variable (Ferme la marche de la ligne).

    Constraint "Items_itIdItem_Pkey" Primary Key ("itIdItem"),

    Constraint "Items_itIdItem_Taille_Chk" Check (octet_length("UUID-Bin"("itIdItem")) = 16),
    Constraint "Items_itUserId_Taille_Chk" Check (octet_length("UUID-Bin"("itUserId")) = 16),

    Constraint "Items_itUserId_Fkey"        Foreign Key ("itUserId"       ) References "Users"("usIdUser"),
    Constraint "Items_itContentTypeId_Fkey" Foreign Key ("itContentTypeId") References "ContentTypes"("ctIdContentType")
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques
-- ----------------------------------------------------------------------------
-- Verrous d'unicité composites absolus par acteur
Create Unique Index "Items_itUserId_itLibelle_Udx" On "Items" ("itUserId", "itLibelle");
Create Unique Index "Items_itUserId_itSlug_Udx"    On "Items" ("itUserId", "itSlug");

-- Parachutes de performance pour l'optimiseur de requêtes
Create Index "Items_itUserId_itContentTypeId_Idx" On "Items" ("itUserId", "itContentTypeId");
Create Index "Items_itUserId_itCreatedAt_Idx"     On "Items" ("itUserId", "itCreatedAt" Desc);
Create Index "Items_itMetadata_Idx"               On "Items" Using gin ("itMetadata");

-- ----------------------------------------------------------------------------
-- ⚡ 3. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "Items_TraceModifs_Trg"
Before Update on "Items"
For Each Row Execute Function "TraceModif"('itUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 4. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "Items" is 'Le cœur du coffre-fort : dépôt des pépites de connaissances gérées par le domaine.';

Comment On Column "Items"."itIdItem"        is 'Identifiant unique fort 128 bits stocké sous forme d''UUID natif (classe IdBinaire côté TypeScript).';
Comment On Column "Items"."itUserId"        is 'Clé étrangère binaire invitée pointant vers l''unique usIdUser propriétaire.';
Comment On Column "Items"."itCreatedAt"     is 'Horodatage de création physique.';
Comment On Column "Items"."itUpdatedAt"     is 'Horodatage de dernière modification géré physiquement par le trigger universel TraceModif.';
Comment On Column "Items"."itContentTypeId" is 'Clé étrangère pointant vers le quadrigramme du dictionnaire des types (table "ContentTypes").';
Comment On Column "Items"."itLibelle"       is 'Titre/Libellé de la pépite (normalisé à la frontière pour le contrôle d''unicité).';
Comment On Column "Items"."itSlug"          is 'Version URL-friendly du titre calculée de manière synchrone par la RAM du domaine.';
Comment On Column "Items"."itAuteurSource"  is 'Auteur ou source d''origine de l''information collectée (par défaut ''N.C.'').';
Comment On Column "Items"."itThumbnailUrl"  is 'URL de l''image d''illustration de la ressource.';
Comment On Column "Items"."itMetadata"      is 'Métadonnées flexibles en Jsonb indexées pour les attributs spécifiques aux formats.';
Comment On Column "Items"."itContent"       is 'Contenu textuel de la pépite (résumé, citation, notes personnelles).';

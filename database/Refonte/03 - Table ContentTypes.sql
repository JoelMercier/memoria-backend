-- ============================================================================
-- 📦 Mémoria - 03 - ContentTypes.sql
-- Fichier: database/migrations/03 - ContentTypes.sql
-- Version: 3.1.0 (PostgreSQL 17+)
-- Description: Dictionnaire des types de contenu et médias - Jojo-Style
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits vides)
-- ----------------------------------------------------------------------------
Drop Table if Exists "ContentTypes";

Create Table "ContentTypes" (
    "ctCreatedAt"     Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes
    "ctUpdatedAt"     Timestamp,                                    -- 8 octets fixes
    "ctIdContentType" Char(4) Not Null,                             -- 4 octets fixes (Quadrigramme unique)
    "ctOrdreAff"      Smallint Not Null,                            -- 2 octets fixes (Ordre d'affichage dans les listes déroulantes)
    "ctName"          Varchar(50) Not Null,                         -- Variable (Ferme la marche)

    Constraint "ContentTypes_ctIdContentType_Pkey" Primary Key ("ctIdContentType"),

    Constraint "ContentTypes_ctName_Udx"     Unique ("ctName"),
    Constraint "ContentTypes_ctOrdreAff_Udx" Unique ("ctOrdreAff"), -- Tri exclusif ergonomique [Mémoria]

    Constraint "ContentTypes_ctIdContentType_Chk" Check ("ctIdContentType" = Upper("ctIdContentType")),
    Constraint "ContentTypes_ctOrdreAff_Chk"      Check ("ctOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "ContentTypes_TraceModifs_Trg"
Before Update on "ContentTypes"
For Each Row Execute Function "TraceModif"('ctUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "ContentTypes" is 'Dictionnaire centralisé des formats de pépites de connaissances gérées par le domaine de Mémoria.';

Comment On Column "ContentTypes"."ctCreatedAt"     is 'Horodatage système automatique de la création du type en base.';
Comment On Column "ContentTypes"."ctUpdatedAt"     is 'Horodatage système automatique de la modification via le trigger TraceModif.';
Comment On Column "ContentTypes"."ctOrdreAff"      is 'Position numérique unique pour le tri logique des listes déroulantes de l interface graphique.';
Comment On Column "ContentTypes"."ctIdContentType" is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: Note, Book).';
Comment On Column "ContentTypes"."ctName"          is 'Libellé descriptif complet du format de la ressource (ex: Livre, Podcast).';

-- -------------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (L'alignement avec les seeders de Phase 1)
-- -------------------------------------------------------------------------------
Insert Into "ContentTypes" ("ctOrdreAff", "ctIdContentType", "ctName") Values
(10, 'NOTE', 'Note'   ), -- Présenté en premier pour la capture rapide à blanc
(20, 'ARTI', 'Article'),
(30, 'BOOK', 'Livre'  ),
(40, 'PODC', 'Podcast'),
(50, 'VIDE', 'Vidéo'  )
On Conflict Do Nothing;

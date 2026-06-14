-- =============================================================================
-- 📦 Mémoria - ContentTypes
-- Fichier: database/migrations/03 - ContentTypes.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Dictionnaire des types de contenu - Tri, JSDoc et repli nominal
-- =============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro padding)
-- ----------------------------------------------------------------------------
Drop Table if exists "ContentTypes" Cascade;

Create Table "ContentTypes" (
    "ctCreatedAt"     Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes (Horodatage de création)
    "ctUpdatedAt"     Timestamp,                                    -- 8 octets fixes (Géré par notre trigger)
    "ctIdContentType" Char(4) Not Null,                             -- 4 octets fixes (Quadrigramme unique)
    "ctOrdreAff"      Smallint Not Null,                            -- 2 octets fixes (Affichage humain)
    "ctDefaut"        Boolean Not Null Default False,               -- 1 octet  fixe  (Drapeau de repli nominal V4 Pro)
    "ctLibelle"       Varchar(50) Not Null,                         -- Taille variable (Substitue l''ancien ctName)

    Constraint "ContentTypes_ctIdContentType_Pkey" Primary Key ("ctIdContentType"),
    Constraint "ContentTypes_ctLibelle_Udx"        Unique ("ctLibelle"),
    Constraint "ContentTypes_ctOrdreAff_Udx"       Unique ("ctOrdreAff"),

    Constraint "ContentTypes_ctIdContentType_Chk"  Check ("ctIdContentType" = Upper("ctIdContentType")),
    Constraint "ContentTypes_ctOrdreAff_Chk"       Check ("ctOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations et déclencheurs stratégiques
-- ----------------------------------------------------------------------------
-- Index unique partiel : Interdiction physique d'avoir deux formats par défaut
Create Unique Index "ContentTypes_ctDefaut_Udx" On "ContentTypes" ("ctDefaut") Where "ctDefaut" = True;

-- Trigger 1 : Traçage automatique des horodatages de révision
Create Trigger "ContentTypes_TraceModifs_Trg"
Before Update on "ContentTypes"
For Each Row Execute Function "TraceModif"('ctUpdatedAt');

-- Trigger 2 : Protection absolue de la ligne par défaut face au sabotage et à la désactivation
Create Trigger "ContentTypes_ProtegeDefaut_Trg"
Before Update Or Delete on "ContentTypes"
For Each Row Execute Function "VerifieLigneDefaut"('ctDefaut');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment on Table "ContentTypes" is 'Dictionnaire centralisé des formats de pépites de connaissances gérées par le domaine de Mémoria.';

Comment on Column "ContentTypes"."ctCreatedAt"     is 'Horodatage système automatique de la création du type en base.';
Comment On Column "ContentTypes"."ctUpdatedAt"     is 'Horodatage système automatique de la modification via le déclencheur TraceModif.';
Comment on Column "ContentTypes"."ctIdContentType" is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: ''NOTE'', ''BOOK'').';
Comment on Column "ContentTypes"."ctOrdreAff"      is 'Position numérique unique pour le tri logique des listes déroulantes de l''interface graphique.';
Comment On Column "ContentTypes"."ctDefaut"        is 'Drapeau de sécurité désignant l''unique type de contenu de repli automatique.';
Comment On Column "ContentTypes"."ctLibelle"       is 'Libellé descriptif complet du format de la ressource en français d''élite.';

-- -------------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Balisage de NOTE par défaut)
-- -------------------------------------------------------------------------------
Insert Into "ContentTypes" ("ctOrdreAff", "ctIdContentType", "ctDefaut", "ctLibelle") Values
(10, 'NOTE', true,  'Note'   ),                                 -- Choix de soute : Marqué par défaut pour amortir la gergovie.
(20, 'ARTI', false, 'Article'),
(30, 'BOOK', false, 'Livre'  ),
(40, 'PODC', false, 'Podcast'),
(50, 'VIDE', false, 'Vidéo'  )

On Conflict ("ctIdContentType") Do Update Set
    "ctOrdreAff" = Excluded."ctOrdreAff",
    "ctDefaut"   = Excluded."ctDefaut",
    "ctLibelle"  = Excluded."ctLibelle";

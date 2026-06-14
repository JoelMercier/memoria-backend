-- =============================================================================
-- 📂 Mémoria - Categories
-- Fichier: database/migrations/04 - Table Categories.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Dictionnaire des catégories d'audit - Alignement 'ca' et repli
-- =============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro padding)
-- ----------------------------------------------------------------------------
Drop Table if exists "Categories" Cascade;

Create Table "Categories" (
    "caCreatedAt"  Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes (Horodatage de création)
    "caUpdatedAt"  Timestamp,                                    -- 8 octets fixes (Géré par notre trigger)
    "caIdCategory" Char(4) Not Null,                             -- 4 octets fixes (Quadrigramme unique)
    "caOrdreAff"   Smallint Not Null,                            -- 2 octets fixes (Affichage humain)
    "caDefaut"     Boolean Not Null Default False,               -- 1 octet  fixe  (Drapeau de repli nominal V4 Pro)
    "caLibelle"    Varchar(50) Not Null,                         -- Taille variable (Substitue l''ancien ecName)

    Constraint "Categories_caIdCategory_Pkey" Primary Key ("caIdCategory"),
    Constraint "Categories_caLibelle_Udx"     Unique ("caLibelle"),
    Constraint "Categories_caOrdreAff_Udx"    Unique ("caOrdreAff"),

    Constraint "Categories_caIdCategory_Chk"  Check ("caIdCategory" = Upper("caIdCategory")),
    Constraint "Categories_caOrdreAff_Chk"   Check ("caOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations et déclencheurs stratégiques
-- ----------------------------------------------------------------------------
-- Index unique partiel : Interdiction physique d'avoir deux catégories par défaut
Create Unique Index "Categories_caDefaut_Udx" On "Categories" ("caDefaut") Where "caDefaut" = True;

-- Trigger 1 : Traçage automatique des horodatages de révision
Create Trigger "Categories_TraceModifs_Trg"
Before Update on "Categories"
For Each Row Execute Function "TraceModif"('caUpdatedAt');

-- Trigger 2 : Protection absolue de la ligne par défaut face au sabotage et à la désactivation
Create Trigger "Categories_ProtegeDefaut_Trg"
Before Update Or Delete on "Categories"
For Each Row Execute Function "VerifieLigneDefaut"('caDefaut');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "Categories" is 'Dictionnaire centralisé des catégories opérationnelles pour la journalisation des événements.';

Comment On Column "Categories"."caCreatedAt"  is 'Horodatage système automatique de la création de la catégorie en base.';
Comment On Column "Categories"."caUpdatedAt"  is 'Horodatage système automatique de la modification via le déclencheur TraceModif.';
Comment On Column "Categories"."caIdCategory" is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: ''GENE'', ''SECU'').';
Comment On Column "Categories"."caOrdreAff"   is 'Position numérique unique pour le tri logique des listes déroulantes de l''interface graphique.';
Comment On Column "Categories"."caDefaut"     is 'Drapeau de sécurité désignant l''unique catégorie de repli automatique.';
Comment On Column "Categories"."caLibelle"    is 'Libellé descriptif complet de la catégorie d''audit en français d''élite.';

-- ----------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Balisage de GENE par défaut)
-- ----------------------------------------------------------------------------
Insert Into "Categories" ("caOrdreAff", "caIdCategory", "caDefaut", "caLibelle") Values
(1,  'GENE', true,  'Générique'                  ),             -- Choix de soute : Le pilier amortisseur par défaut.
(10, 'MONI', false, 'Monitoring et performances' ),
(20, 'ANAL', false, 'Analyses d''utilisation'    ),
(30, 'SECU', false, 'Sécurité et accès'          ),             -- Purification nominale du vieux code AUDI
(40, 'RGPD', false, 'Protection des données'     )              -- Correction orthographique française complète

On Conflict ("caIdCategory") Do Update Set
    "caOrdreAff" = Excluded."caOrdreAff",
    "caDefaut"   = Excluded."caDefaut",
    "caLibelle"  = Excluded."caLibelle";

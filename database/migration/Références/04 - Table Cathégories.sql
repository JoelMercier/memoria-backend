-- ============================================================================
-- 📦 Mémoria - EventCategories
-- Fichier: database/migrations/04 - Table Categories.sql
-- Version: 1.0.0 (PostgreSQL 17+)
-- Description: Dictionnaire des catégories d'exploitation et de sécurité
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits vides)
-- ----------------------------------------------------------------------------
Drop Table if Exists "EventCategories";

Create Table "EventCategories" ( -- Ordre physique des zones optimisé pour réduire le «padding»
    "ecCreatedAt"  Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes
    "ecUpdatedAt"  Timestamp,                                    -- 8 octets fixes
    "ecIdCategory" Char(4) Not Null,                             -- 4 octets fixes (Quadrigramme unique)
    "ecOrdreAff"   Smallint Not Null,                            -- 2 octets fixes (Affichage humain)
    "ecName"       Varchar(50) Not Null,                         -- Variable (Ferme la marche)

    Constraint "EventCategories_ecIdCategory_Pkey" Primary Key ("ecIdCategory"),
    Constraint "EventCategories_ecName_Udx"      Unique ("ecName"),
    Constraint "EventCategories_ecOrdreAff_Udx"  Unique ("ecOrdreAff"), -- Tri ergonomique exclusif [Mémoria]
    Constraint "EventCategories_ecIdCategory_Chk" Check ("ecIdCategory" = Upper("ecIdCategory")),
    Constraint "EventCategories_ecOrdreAff_Chk"   Check ("ecOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "EventCategories_TraceModifs_Trg"
Before Update on "EventCategories"
For Each Row Execute Function "TraceModif"('ecUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire (Alignement esthétique vertical)
-- ----------------------------------------------------------------------------
Comment On Table "EventCategories" is 'Dictionnaire centralisé des catégories opérationnelles pour la journalisation des événements.';

Comment On Column "EventCategories"."ecCreatedAt"  is 'Horodatage système automatique de la création de la catégorie en base.';
Comment On Column "EventCategories"."ecUpdatedAt"  is 'Horodatage système automatique de la modification via le trigger TraceModif().';
Comment On Column "EventCategories"."ecIdCategory" is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: ''MONI'', ''AUDI'').';
Comment On Column "EventCategories"."ecOrdreAff"   is 'Position numérique unique pour le tri logique des listes déroulantes de l''interface graphique.';
Comment On Column "EventCategories"."ecName"       is 'Libellé descriptif complet de la catégorie d''audit (ex: Audits de sécurité).';

-- ----------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Les quatre piliers de l'exploitation)
-- ----------------------------------------------------------------------------
Insert Into "EventCategories" ("ecOrdreAff", "ecIdCategory", "ecName") Values
(10, 'MONI', 'Monitoring et performances'    ),
(20, 'ANAL', 'Analyses d''utilisation'       ),
(30, 'AUDI', 'Audits de sécurité'            ),
(40, 'RGPD', 'Protection des données privées')
On Conflict ("ecIdCategory") Do Update Set
    "ecOrdreAff" = Excluded."ecOrdreAff",
    "ecName"     = Excluded."ecName";

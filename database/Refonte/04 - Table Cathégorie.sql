-- ============================================================================
-- 📦 Mémoria - 03 bis - EventCategories.sql
-- Fichier: database/migrations/03 bis - EventCategories.sql
-- Version: 1.0.0 (PostgreSQL 17+)
-- Description: Dictionnaire des catégories d exploitation et de sécurité
-- ============================================================================

Set search_path To Public;

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits vides)
-- ----------------------------------------------------------------------------
Create Table "EventCategories" (
    "ecCreatedAt"  Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes
    "ecUpdatedAt"  Timestamp,                                    -- 8 octets fixes
    "ecOrdreAff"   Smallint Not Null,                             -- 2 octets [Affichage humain] [Mémoria]
    "ecIdCategory" Char(4) Not Null,                              -- 4 octets fixes (Quadrigramme unique) [Mémoria]
    "ecName"       Varchar(50) Not Null,                          -- Variable (Ferme la marche)

    Constraint "EventCategories_ecIdCategory_Pkey" Primary Key ("ecIdCategory"),
    Constraint "EventCategories_ecName_Udx" Unique ("ecName"),
    Constraint "EventCategories_ecOrdreAff_Udx" Unique ("ecOrdreAff"), -- Tri ergonomique exclusif [Mémoria]
    Constraint "EventCategories_ecIdCategory_Chk" Check ("ecIdCategory" = Upper("ecIdCategory")),
    Constraint "EventCategories_ecOrdreAff_Chk" Check ("ecOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "EventCategories_BeforeUpdate_Trg"
Before Update on "EventCategories"
For Each Row Execute Function "TraceModif"('ecUpdatedAt');

-- ----------------------------------------------------------------------------
-- 🏺 3. Script d'ensemencement initial (Les quatre piliers de l exploitation)
-- ----------------------------------------------------------------------------
Insert Into "EventCategories" ("ecOrdreAff", "ecIdCategory", "ecName") Values
(10, 'MONI', 'Monitoring et performances'),
(20, 'ANAL', 'Analyses d utilisation'),
(30, 'AUDI', 'Audits de sécurité'),
(40, 'GDPR', 'Protection des données privées')
On Conflict Do Nothing;

-- ============================================================================
-- 🚨 Mémoria - 04 - Severites.sql
-- Fichier: database/migrations/04 - Severites.sql
-- Version: 3.1.0 (PostgreSQL 17+)
-- Description: Dictionnaire des sévérités d audit - Double niveau d acier
-- ============================================================================

Set search_path To Public;

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Tassé au bit près)
-- ----------------------------------------------------------------------------
Create Table "Severites" (
    "seCreatedAt"  Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes
    "seUpdatedAt"  Timestamp,                                    -- 8 octets fixes
    "seNiveau"     Smallint Not Null,                             -- 2 octets [Hiérarchie machine] [Mémoria]
    "seOrdreAff"   Smallint Not Null,                             -- 2 octets [Affichage humain] [Mémoria]
    "seIdSeverity" Char(4) Not Null,                              -- 4 octets fixes (Quadrigramme unique) [Mémoria]
    "seName"       Varchar(50) Not Null,                          -- Variable (Ferme la marche)

    Constraint "Severites_seIdSeverity_Pkey" Primary Key ("seIdSeverity"),
    Constraint "Severites_seName_Udx" Unique ("seName"),
    Constraint "Severites_seNiveau_Udx" Unique ("seNiveau"),      -- Unicité pour les filtres logiques mathématiques [Mémoria]
    Constraint "Severites_seOrdreAff_Udx" Unique ("seOrdreAff"),  -- Unicité pour l ordre des listes déroulantes [Mémoria]
    Constraint "Severites_seIdSeverity_Chk" Check ("seIdSeverity" = Upper("seIdSeverity")),
    Constraint "Severites_seNiveau_Chk" Check ("seNiveau" >= 0),
    Constraint "Severites_seOrdreAff_Chk" Check ("seOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "Severites_BeforeUpdate_Trg"
Before Update on "Severites"
For Each Row Execute Function "TraceModif"('seUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "Severites" is 'Dictionnaire des niveaux de gravité pour les événements d audit système de Mémoria.';
Comment On Column "Severites"."seCreatedAt" is 'Horodatage système automatique de la création de la sévérité en base.';
Comment On Column "Severites"."seUpdatedAt" is 'Horodatage système automatique de la modification via le trigger TraceModif.';
Comment On Column "Severites"."seNiveau" is 'Poids numérique unique de type Smallint pour les calculs de comparaison logique (ex: >= 20).';
Comment On Column "Severites"."seOrdreAff" is 'Position numérique unique pour le tri ergonomique des listes déroulantes administratives.';
Comment On Column "Severites"."seIdSeverity" is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: Info, Warn, Crit).';
Comment On Column "Severites"."seName" is 'Libellé complet et intelligible du niveau de gravité pour les rapports.';

-- ----------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Les quatre piliers de l audit)
-- ----------------------------------------------------------------------------
Insert Into "Severites" ("seNiveau", "seOrdreAff", "seIdSeverity", "seName") Values
(10, 10, 'INFO', 'Information'),
(20, 20, 'WARN', 'Avertissement'),
(30, 30, 'ERRO', 'Erreur'),
(40, 40, 'CRIT', 'Critique')
On Conflict Do Nothing;

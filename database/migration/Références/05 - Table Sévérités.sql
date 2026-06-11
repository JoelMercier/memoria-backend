-- ============================================================================
-- 🚨 Mémoria - Sévérités
-- Fichier: database/migrations/05 - Table Severites.sql
-- Version: 3.1.0 (PostgreSQL 17+)
-- Description: Dictionnaire des sévérités d'audit - Avec sucrerie expérimentale
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Tassé au bit près)
-- ----------------------------------------------------------------------------
Drop Table if Exists "Severites";

Create Table "Severites" ( -- Ordre physique des zones optimisé pour réduire le «padding»
    "seCreatedAt"  Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes
    "seUpdatedAt"  Timestamp,                                    -- 8 octets fixes
    "seIdSeverity" Char(4) Not Null,                             -- 4 octets fixes (Quadrigramme unique)
    "seNiveau"     Smallint Not Null,                            -- 2 octets fixes (Hiérarchie machine)
    "seOrdreAff"   Smallint Not Null,                            -- 2 octets fixes (Affichage humain)
    "seName"       Varchar(50) Not Null,                         -- Variable (Ferme la marche)

    Constraint "Severites_seIdSeverity_Pkey" Primary Key ("seIdSeverity"),
    Constraint "Severites_seName_Udx"     Unique ("seName"),
    Constraint "Severites_seNiveau_Udx"   Unique ("seNiveau"),   -- Unicité pour les filtres logiques mathématiques
    Constraint "Severites_seOrdreAff_Udx" Unique ("seOrdreAff"), -- Unicité pour l'ordre des listes déroulantes
    Constraint "Severites_seIdSeverity_Chk" Check ("seIdSeverity" = Upper("seIdSeverity")),
    Constraint "Severites_seNiveau_Chk"     Check ("seNiveau"   >= 0),
    Constraint "Severites_seOrdreAff_Chk"   Check ("seOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "Severites_BeforeUpdate_Trg"
Before Update on "Severites"
For Each Row Execute Function "TraceModif"('seUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire (Alignement vertical)
-- ----------------------------------------------------------------------------
Comment On Table "Severites" is 'Dictionnaire des niveaux de gravité pour les événements d''audit système de Mémoria.';

Comment On Column "Severites"."seCreatedAt"  is 'Horodatage système automatique de la création de la sévérité en base.';
Comment On Column "Severites"."seUpdatedAt"  is 'Horodatage système automatique de la modification via le trigger TraceModif.';
Comment On Column "Severites"."seNiveau"     is 'Poids numérique unique de type Smallint pour les calculs de comparaison logique (ex: >= 20).';
Comment On Column "Severites"."seOrdreAff"   is 'Position numérique unique pour le tri ergonomique des listes déroulantes administratives.';
Comment On Column "Severites"."seIdSeverity" is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: ''INFO'', ''WARN'', ''CRIT'').';
Comment On Column "Severites"."seName"       is 'Libellé complet et intelligible du niveau de gravité pour les rapports.';

-- ----------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Les cinq piliers de l'audit)
-- ----------------------------------------------------------------------------
Insert Into "Severites" ("seNiveau", "seOrdreAff", "seIdSeverity", "seName") Values
(10, 10, 'INFO', 'Information'  ),
(20, 20, 'WARN', 'Avertissement'),
(30, 30, 'ERRO', 'Erreur'       ),
(40, 40, 'CRIT', 'Critique'     ),
(50, 50, 'FATA', 'Fatal'        )  -- La sucrerie de soute pour tester le comportement du SmartEnum
On Conflict ("seIdSeverity") Do Update Set
    "seNiveau"   = Excluded."seNiveau",
    "seOrdreAff" = Excluded."seOrdreAff",
    "seName"     = Excluded."seName";

-- ============================================================================
-- 🚨 Mémoria - Severites
-- Fichier: database/migrations/05 - Table Severites.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Dictionnaire des sévérités d'audit - Alignement, tri et repli
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro padding)
-- ----------------------------------------------------------------------------
Drop Table if exists "Severites" Cascade;

Create Table "Severites" (
    "seCreatedAt"  Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes (Horodatage de création)
    "seUpdatedAt"  Timestamp,                                    -- 8 octets fixes (Géré par notre trigger)
    "seIdSeverity" Char(4) Not Null,                             -- 4 octets fixes (Quadrigramme unique)
    "seNiveau"     Smallint Not Null,                            -- 2 octets fixes (Hiérarchie machine)
    "seOrdreAff"   Smallint Not Null,                            -- 2 octets fixes (Affichage humain)
    "seDefaut"     Boolean Not Null Default False,               -- 1 octet  fixe  (Drapeau de repli nominal V4 Pro)
    "seLibelle"    Varchar(50) Not Null,                         -- Taille variable (Substitue l''ancien seName)

    Constraint "Severites_seIdSeverity_Pkey" Primary Key ("seIdSeverity"),
    Constraint "Severites_seLibelle_Udx"     Unique ("seLibelle"),
    Constraint "Severites_seNiveau_Udx"      Unique ("seNiveau"),
    Constraint "Severites_seOrdreAff_Udx"     Unique ("seOrdreAff"),

    Constraint "Severites_seIdSeverity_Chk"  Check ("seIdSeverity" = Upper("seIdSeverity")),
    Constraint "Severites_seNiveau_Chk"      Check ("seNiveau"   >= 0),
    Constraint "Severites_seOrdreAff_Chk"    Check ("seOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations et déclencheurs stratégiques
-- ----------------------------------------------------------------------------
-- Index unique partiel : Interdiction physique d'avoir deux sévérités par défaut
Create Unique Index "Severites_seDefaut_Udx" On "Severites" ("seDefaut") Where "seDefaut" = True;

-- Trigger 1 : Traçage automatique des horodatages de révision
Create Trigger "Severites_BeforeUpdate_Trg"
Before Update on "Severites"
For Each Row Execute Function "TraceModif"('seUpdatedAt');

-- Trigger 2 : Protection absolue de la ligne par défaut face au sabotage et à la désactivation
Create Trigger "Severites_ProtegeDefaut_Trg"
Before Update Or Delete on "Severites"
For Each Row Execute Function "VerifieLigneDefaut"('seDefaut');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "Severites" is 'Dictionnaire des niveaux de gravité pour les événements d''audit système de Mémoria.';

Comment On Column "Severites"."seCreatedAt"  is 'Horodatage système automatique de la création de la sévérité en base.';
Comment On Column "Severites"."seUpdatedAt"  is 'Horodatage système automatique de la modification via le déclencheur TraceModif.';
Comment On Column "Severites"."seNiveau"     is 'Poids numérique unique de pouvoir pour les calculs de comparaison logique (ex: >= 20).';
Comment On Column "Severites"."seOrdreAff"   is 'Position numérique unique pour le tri ergonomique des listes déroulantes administratives.';
Comment On Column "Severites"."seIdSeverity" is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: ''INFO'', ''WARN'').';
Comment On Column "Severites"."seLibelle"    is 'Libellé complet et intelligible du niveau de gravité en français d''élite.';

-- ----------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Balisage de INFO par défaut)
-- ----------------------------------------------------------------------------
Insert Into "Severites" ("seNiveau", "seOrdreAff", "seIdSeverity", "seDefaut", "seLibelle") Values
(10, 10, 'INFO', true,  'Information'  ),                       -- Choix de soute : Le pilier amortisseur par défaut.
(20, 20, 'WARN', false, 'Avertissement'),
(30, 30, 'ERRO', false, 'Erreur'       ),
(40, 40, 'CRIT', false, 'Critique'     ),
(50, 50, 'FATA', false, 'Fatal'        )                        -- La sucrerie de soute conservée intacte !

On Conflict ("seIdSeverity") Do Update Set
    "seNiveau"   = Excluded."seNiveau",
    "seOrdreAff" = Excluded."seOrdreAff",
    "seDefaut"   = Excluded."seDefaut",
    "seLibelle"  = Excluded."seLibelle";

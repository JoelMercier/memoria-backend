-- ——— fichier : database\migration\Références\07 - Table EventActions.sql

-- ============================================================================
-- 📦 Mémoria - EventActions
-- Fichier: database/migrations/07 - Table EventActions.sql
-- Version: 3.2.0 (PostgreSQL 17+)
-- Description: Dictionnaire des actions et opérations d'audit - Jojo-Style
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits vides)
-- ----------------------------------------------------------------------------
Drop Table if Exists "EventActions";

Create Table "EventActions" ( -- Ordre physique des zones optimisé pour réduire le «padding»
    "eaCreatedAt" Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes
    "eaUpdatedAt" Timestamp,                                    -- 8 octets fixes
    "eaIdAction"  Char(4) Not Null,                             -- 4 octets fixes (Quadrigramme unique)
    "eaOrdreAff"  Smallint Not Null,                            -- 2 octets fixes (Ordre d'affichage)
    "eaName"      Varchar(50) Not Null,                         -- Variable (Ferme la marche)

    Constraint "EventActions_eaIdAction_Pkey" Primary Key ("eaIdAction"),
    Constraint "EventActions_eaName_Udx"     Unique ("eaName"),
    Constraint "EventActions_eaOrdreAff_Udx" Unique ("eaOrdreAff"),
    Constraint "EventActions_eaIdAction_Chk" Check ("eaIdAction" = Upper("eaIdAction")),
    Constraint "EventActions_eaOrdreAff_Chk" Check ("eaOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "EventActions_TraceModifs_Trg"
Before Update on "EventActions"
For Each Row Execute Function "TraceModif"('eaUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment on Table "EventActions" is 'Dictionnaire centralisé des actions techniques et opérations traçables du système.';

Comment on Column "EventActions"."eaCreatedAt" is 'Horodatage système automatique de la création de l''action en base.';
Comment on Column "EventActions"."eaUpdatedAt" is 'Horodatage système automatique de la modification via le trigger TraceModif.';
Comment on Column "EventActions"."eaIdAction"  is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: ''CONN'', ''CREA'').';
Comment on Column "EventActions"."eaOrdreAff"  is 'Position numérique unique pour le tri logique des listes déroulantes de l''interface.';
Comment on Column "EventActions"."eaName"      is 'Libellé descriptif complet de l''opération menée (ex: Démarrage, Enregistrement).';

-- -------------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Alignement avec les logs existants)
-- -------------------------------------------------------------------------------
Insert Into "EventActions" ("eaOrdreAff", "eaIdAction", "eaName") Values
(10, 'DEMA', 'Démarrage'      ),
(15, 'CONN', 'Connexion'      ),
(20, 'ENRE', 'Enregistrement' ),
(30, 'ECHE', 'Échec'          ),
(40, 'CREA', 'Création'       ),
(50, 'PART', 'Partage'        ),
(60, 'EXPO', 'Exportation'    ),
(70, 'LENT', 'Requête lente'  ),
(80, 'PURG', 'Purge de soute' )
On Conflict ("eaIdAction") Do Update Set
    "eaOrdreAff" = Excluded."eaOrdreAff",
    "eaName"     = Excluded."eaName";

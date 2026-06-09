-- ============================================================================
-- 🔐 Mémoria - Providers
-- Fichier: database/migrations/02 - Providers.sql
-- Version: 3.1.0 (PostgreSQL 17+)
-- Description: Dictionnaire des fournisseurs d authentification - Jojo-Style
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs
-- ----------------------------------------------------------------------------
Drop Table if Exists "Providers";

Create Table "Providers" (
    "apCreatedAt"  Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes
    "apUpdatedAt"  Timestamp,                                    -- 8 octets fixes
    "apIdProvider" Char(4) Not Null,                             -- 4 octets fixes (Quadrigramme unique)
    "apOrdreAff"   Smallint Not Null,                            -- 2 octets Ordre d'Affichage
    "apName"       Varchar(50) Not Null,                         -- Variable

    Constraint "Providers_apIdProvider_Pkey" Primary Key ("apIdProvider"),

    Constraint "Providers_apName_Udx"        Unique ("apName"),
    Constraint "Providers_apOrdreAff_Udx"    Unique ("apOrdreAff"), -- Tri ergonomique

    Constraint "Providers_apIdProvider_Chk"  Check ("apIdProvider" = Upper("apIdProvider")),
    Constraint "Providers_apOrdreAff_Chk"    Check ("apOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "Providers_TraceModifs_Trg"
Before Update on "Providers"
For Each Row Execute Function "TraceModif"('apUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "Providers" is 'Dictionnaire centralisé des fournisseurs d''authentification externes autorisés sur Mémoria.';
Comment On Column "Providers"."apCreatedAt"  is 'Horodatage système automatique de la création du fournisseur en base.';
Comment On Column "Providers"."apUpdatedAt"  is 'Horodatage système automatique de la modification via le trigger et sa fonction TraceModif().';
Comment On Column "Providers"."apOrdreAff"   is 'Position numérique unique pour le tri logique des listes déroulantes de l''interface graphique.';
Comment On Column "Providers"."apIdProvider" is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: "LOCA", "GOOG").';
Comment On Column "Providers"."apName"       is 'Libellé complet du fournisseur d''authentification.';

-- ----------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Les valeurs réelles de production)
-- --------------------------------============================================
Insert Into "Providers" ("apOrdreAff", "apIdProvider", "apName") Values
(10, 'LOCA', 'Local'), -- Présenté en premier pour l'authentification classique
(20, 'GOOG', 'Google'),
(30, 'AZUR', 'Azure'),
(40, 'APPL', 'Apple')
On Conflict Do Nothing;

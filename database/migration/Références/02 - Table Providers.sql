-- =============================================================================
-- 🔐 Mémoria - Providers
-- Fichier: database/migrations/02 - Providers.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Dictionnaire des fournisseurs - Alignement 'pr', tri et repli
-- =============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro padding)
-- ----------------------------------------------------------------------------
Drop Table if exists "Providers" Cascade;

Create Table "Providers" (
    "prCreatedAt"  Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes (Horodatage de création)
    "prUpdatedAt"  Timestamp,                                    -- 8 octets fixes (Géré par notre trigger)
    "prIdProvider" Char(4) Not Null,                             -- 4 octets fixes (Quadrigramme unique)
    "prOrdreAff"   Smallint Not Null,                            -- 2 octets fixes (Affichage humain)
    "prDefaut"     Boolean Not Null Default False,               -- 1 octet  fixe  (Drapeau de repli nominal V4 Pro)
    "prLibelle"    Varchar(50) Not Null,                         -- Taille variable (Substitue l''ancien apName)

    Constraint "Providers_prIdProvider_Pkey" Primary Key ("prIdProvider"),
    Constraint "Providers_prLibelle_Udx"     Unique ("prLibelle"),
    Constraint "Providers_prOrdreAff_Udx"    Unique ("prOrdreAff"),

    Constraint "Providers_prIdProvider_Chk"  Check ("prIdProvider" = Upper("prIdProvider")),
    Constraint "Providers_prOrdreAff_Chk"    Check ("prOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations et déclencheurs stratégiques
-- ----------------------------------------------------------------------------
-- Index unique partiel : Interdiction physique d'avoir deux fournisseurs par défaut
Create Unique Index "Providers_prDefaut_Udx" On "Providers" ("prDefaut") Where "prDefaut" = True;

-- Trigger 1 : Traçage automatique des horodatages de révision
Create Trigger "Providers_TraceModifs_Trg"
Before Update on "Providers"
For Each Row Execute Function "TraceModif"('prUpdatedAt');

-- Trigger 2 : Protection absolue de la ligne par défaut face au sabotage et à la désactivation
Create Trigger "Providers_ProtegeDefaut_Trg"
Before Update Or Delete on "Providers"
For Each Row Execute Function "VerifieLigneDefaut"('prDefaut');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "Providers" is 'Dictionnaire centralisé des fournisseurs d''authentification externes autorisés sur Mémoria.';

Comment On Column "Providers"."prCreatedAt"  is 'Horodatage système automatique de la création du fournisseur en base.';
Comment On Column "Providers"."prUpdatedAt"  is 'Horodatage système automatique de la modification via le déclencheur TraceModif.';
Comment On Column "Providers"."prIdProvider" is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: ''LOCA'', ''GOOG'').';
Comment On Column "Providers"."prOrdreAff"   is 'Position numérique unique pour le tri logique des listes déroulantes de l''interface graphique.';
Comment On Column "Providers"."prDefaut"     is 'Drapeau de sécurité désignant l''unique fournisseur de repli automatique.';
Comment On Column "Providers"."prLibelle"    is 'Libellé descriptif complet du fournisseur d''authentification en français d''élite.';

-- ----------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Balisage de LOCA par défaut)
-- ----------------------------------------------------------------------------
Insert Into "Providers" ("prOrdreAff", "prIdProvider", "prDefaut", "prLibelle") Values
(10, 'LOCA', true,  'Local' ),                                  -- Choix de soute : Marqué par défaut pour la bière !
(20, 'GOOG', false, 'Google'),
(30, 'AZUR', false, 'Azure' ),
(40, 'APPL', false, 'Apple' )

On Conflict ("prIdProvider") Do Update Set
    "prOrdreAff" = Excluded."prOrdreAff",
    "prDefaut"   = Excluded."prDefaut",
    "prLibelle"  = Excluded."prLibelle";

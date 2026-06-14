-- ============================================================================
-- 🌐 Mémoria - Secteurs
-- Fichier: database/migrations/06 - Table Secteurs.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Dictionnaire des secteurs fonctionnels - Alignement 'sc' et repli
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro padding)
-- ----------------------------------------------------------------------------
Drop Table if exists "Secteurs" Cascade;

Create Table "Secteurs" (
    "scCreatedAt" Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes (Horodatage de création)
    "scUpdatedAt" Timestamp,                                    -- 8 octets fixes (Géré par notre trigger)
    "scIdSecteur" Char(4) Not Null,                             -- 4 octets fixes (Quadrigramme unique)
    "scOrdreAff"  Smallint Not Null,                            -- 2 octets fixes (Affichage humain)
    "scDefaut"    Boolean Not Null Default False,               -- 1 octet  fixe  (Drapeau de repli nominal V4 Pro)
    "scLibelle"   Varchar(50) Not Null,                         -- Taille variable (Substitue l''ancien esName)

    Constraint "Secteurs_scIdSecteur_Pkey" Primary Key ("scIdSecteur"),
    Constraint "Secteurs_scLibelle_Udx"     Unique ("scLibelle"),
    Constraint "Secteurs_scOrdreAff_Udx"    Unique ("scOrdreAff"),

    Constraint "Secteurs_scIdSecteur_Chk" Check ("scIdSecteur" = Upper("scIdSecteur")),
    Constraint "Secteurs_scOrdreAff_Chk"  Check ("scOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations et déclencheurs stratégiques
-- ----------------------------------------------------------------------------
-- Index unique partiel : Interdiction physique d'avoir deux secteurs par défaut
Create Unique Index "Secteurs_scDefaut_Udx" On "Secteurs" ("scDefaut") Where "scDefaut" = True;

-- Trigger 1 : Traçage automatique des horodatages de révision
Create Trigger "Secteurs_TraceModifs_Trg"
Before Update on "Secteurs"
For Each Row Execute Function "TraceModif"('scUpdatedAt');

-- Trigger 2 : Protection absolue de la ligne par défaut face au sabotage et à la désactivation
Create Trigger "Secteurs_ProtegeDefaut_Trg"
Before Update Or Delete on "Secteurs"
For Each Row Execute Function "VerifieLigneDefaut"('scDefaut');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment on Table "Secteurs" is 'Dictionnaire centralisé des Secteurs fonctionnels (périmètres applicatifs) pour le journal d''audit.';

Comment on Column "Secteurs"."scCreatedAt" is 'Horodatage système automatique de la création du Secteur en base.';
Comment on Column "Secteurs"."scUpdatedAt" is 'Horodatage système automatique de la modification via le déclencheur TraceModif.';
Comment on Column "Secteurs"."scIdSecteur" is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: ''AUTH'', ''PEPI'').';
Comment on Column "Secteurs"."scOrdreAff"  is 'Position numérique unique pour le tri logique des listes déroulantes de l''interface.';
Comment on Column "Secteurs"."scDefaut"    is 'Drapeau de sécurité désignant l''unique secteur de repli automatique.';
Comment on Column "Secteurs"."scLibelle"   is 'Libellé descriptif complet du Secteur fonctionnel en français d''élite.';

-- -------------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Balisage de SYST par défaut)
-- -------------------------------------------------------------------------------
Insert Into "Secteurs" ("scOrdreAff", "scIdSecteur", "scDefaut", "scLibelle") Values
(10, 'SYST', true,  'Système'         ),                        -- Choix de soute : Le pilier amortisseur par défaut.
(20, 'UTIL', false, 'Utilisateur'     ),
(30, 'AUTH', false, 'Authentification'),
(40, 'PEPI', false, 'Pépite'          ),
(50, 'BASE', false, 'Base de données' ),
(60, 'RGPD', false, 'Protection'      )                         -- Correction orthographique complète

On Conflict ("scIdSecteur") Do Update Set
    "scOrdreAff" = Excluded."scOrdreAff",
    "scDefaut"   = Excluded."scDefaut",
    "scLibelle"  = Excluded."scLibelle";

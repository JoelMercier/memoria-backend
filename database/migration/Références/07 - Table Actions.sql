-- ============================================================================
-- ⚡ Mémoria - Actions
-- Fichier: database/migrations/07 - Table Actions.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Dictionnaire des actions système - Alignement 'ac' et repli
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro padding)
-- ----------------------------------------------------------------------------
Drop Table if exists "Actions" Cascade;

Create Table "Actions" (
    "acCreatedAt" Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes (Horodatage de création)
    "acUpdatedAt" Timestamp,                                    -- 8 octets fixes (Géré par notre trigger)
    "acIdAction"  Char(4) Not Null,                             -- 4 octets fixes (Quadrigramme unique)
    "acOrdreAff"  Smallint Not Null,                            -- 2 octets fixes (Affichage humain)
    "acDefaut"    Boolean Not Null Default False,               -- 1 octet  fixe  (Drapeau de repli nominal V4 Pro)
    "acLibelle"   Varchar(50) Not Null,                         -- Taille variable (Substitue l''ancien eaName)

    Constraint "Actions_acIdAction_Pkey" Primary Key ("acIdAction"),
    Constraint "Actions_acLibelle_Udx"     Unique ("acLibelle"),
    Constraint "Actions_acOrdreAff_Udx"    Unique ("acOrdreAff"),

    Constraint "Actions_acIdAction_Chk" Check ("acIdAction" = Upper("acIdAction")),
    Constraint "Actions_acOrdreAff_Chk"  Check ("acOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations et déclencheurs stratégiques
-- ----------------------------------------------------------------------------
-- Index unique partiel : Interdiction physique d'avoir deux actions par défaut
Create Unique Index "Actions_acDefaut_Udx" On "Actions" ("acDefaut") Where "acDefaut" = True;

-- Trigger 1 : Traçage automatique des horodatages de révision
Create Trigger "Actions_TraceModifs_Trg"
Before Update on "Actions"
For Each Row Execute Function "TraceModif"('acUpdatedAt');

-- Trigger 2 : Protection absolue de la ligne par défaut face au sabotage et à la désactivation
Create Trigger "Actions_ProtegeDefaut_Trg"
Before Update Or Delete on "Actions"
For Each Row Execute Function "VerifieLigneDefaut"('acDefaut');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment on Table "Actions" is 'Dictionnaire centralisé des actions techniques et opérations traçables du système.';

Comment on Column "Actions"."acCreatedAt" is 'Horodatage système automatique de la création de l''action en base.';
Comment on Column "Actions"."acUpdatedAt" is 'Horodatage système automatique de la modification via le déclencheur TraceModif.';
Comment on Column "Actions"."acIdAction"  is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: ''CONN'', ''CREA'').';
Comment on Column "Actions"."acOrdreAff"  is 'Position numérique unique pour le tri logique des listes déroulantes de l''interface.';
Comment on Column "Actions"."acDefaut"    is 'Drapeau de sécurité désignant l''unique action de repli automatique.';
Comment on Column "Actions"."acLibelle"   is 'Libellé descriptif complet de l''opération menée en français d''élite.';

-- -------------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Balisage de READ par défaut)
-- -------------------------------------------------------------------------------
Insert Into "Actions" ("acOrdreAff", "acIdAction", "acDefaut", "acLibelle") Values
(1,  'READ', true,  'Lecture'          ),                       -- Choix de soute : Le pilier amortisseur par défaut.
(10, 'DEMA', false, 'Démarrage'        ),
(15, 'CONN', false, 'Connexion'        ),
(20, 'ENRE', false, 'Enregistrement'   ),
(30, 'ECHE', false, 'Échec'            ),
(40, 'CREA', false, 'Création'         ),
(50, 'PART', false, 'Partage'          ),
(60, 'EXPO', false, 'Exportation'      ),
(70, 'LENT', false, 'Requête lente'    ),
(80, 'PURG', false, 'Purge de soute'   )

On Conflict ("acIdAction") Do Update Set
    "acOrdreAff" = Excluded."acOrdreAff",
    "acDefaut"   = Excluded."acDefaut",
    "acLibelle"  = Excluded."acLibelle";

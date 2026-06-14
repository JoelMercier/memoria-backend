-- =============================================================================
-- 🏛️ Mémoria - Rôles
-- Fichier: database/migrations/01 - Table Roles.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Dictionnaire des rôles avec hiérarchie, tri et repli nominal
-- =============================================================================

Set search_path to Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro padding)
-- ----------------------------------------------------------------------------
Drop Table if exists "Roles" Cascade;

Create Table "Roles" (
    "roCreatedAt" Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes (Horodatage de création)
    "roUpdatedAt" Timestamp,                                    -- 8 octets fixes (Géré par notre trigger)
    "roIdRole"    Char(4) Not Null,                             -- 4 octets fixes (Quadrigramme immuable)
    "roNiveau"    Smallint Not Null,                            -- 2 octets fixes (Hiérarchie machine)
    "roOrdreAff"  Smallint Not Null,                            -- 2 octets fixes (Affichage humain)
    "roDefaut"    Boolean Not Null Default False,               -- 1 octet  fixe  (Drapeau de repli nominal V4 Pro)
    "roLibelle"   Varchar(50) Not Null,                         -- Taille variable (Substitue l''ancien roName)

    Constraint "Roles_roIdRole_Pkey" Primary Key ("roIdRole"),
    Constraint "Roles_roLibelle_Udx"  Unique ("roLibelle"),     -- Nom de rôle unique (Majuscule accentuée)
    Constraint "Roles_roNiveau_Udx"   Unique ("roNiveau"),      -- Chaque niveau de pouvoir est unique
    Constraint "Roles_roOrdreAff_Udx" Unique ("roOrdreAff"),    -- Chaque ordre d''affichage est unique

    Constraint "Roles_roIdRole_Chk"   Check ("roIdRole" = Upper("roIdRole")),
    Constraint "Roles_roNiveau_Chk"   Check ("roNiveau" >= 0),
    Constraint "Roles_roOrdreAff_Chk" Check ("roOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations et déclencheurs stratégiques
-- ----------------------------------------------------------------------------
-- Index unique partiel : Interdiction physique en soute d'avoir deux rôles par défaut
Create Unique Index "Roles_roDefaut_Udx" On "Roles" ("roDefaut") Where "roDefaut" = True;

-- Trigger 1 : Traçage automatique des horodatages de révision
Create Trigger "Roles_TraceModifs_Trg"
Before Update on "Roles"
For Each Row Execute Function "TraceModif"('roUpdatedAt');

-- Trigger 2 : Protection absolue de la ligne par défaut face au sabotage et à la désactivation
Create Trigger "Roles_ProtegeDefaut_Trg"
Before Update Or Delete on "Roles"
For Each Row Execute Function "VerifieLigneDefaut"('roDefaut');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "Roles" is 'Dictionnaire centralisé des rôles applicatifs pour le contrôle des accès (ACL).';

Comment On Column "Roles"."roCreatedAt" is 'Horodatage système automatique de la création du rôle en base.';
Comment On Column "Roles"."roUpdatedAt" is 'Horodatage système automatique de la modification via le déclencheur TraceModif.';
Comment On Column "Roles"."roIdRole"    is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: ''CUST'', ''ADMN'').';
Comment On Column "Roles"."roNiveau"    is 'Poids numérique unique de pouvoir pour les contrôles de sécurité dans le code (ex: 10, 20).';
Comment On Column "Roles"."roOrdreAff"  is 'Position numérique unique pour le tri logique des listes déroulantes de l''interface graphique.';
Comment On Column "Roles"."roDefaut"    is 'Drapeau de sécurité désignant l''unique rôle de repli automatique en cas de payload inconnu.';
Comment On Column "Roles"."roLibelle"   is 'Libellé descriptif complet du rôle en français d''élite.';

-- ----------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Balisage de CUST par défaut)
-- ----------------------------------------------------------------------------
Insert Into "Roles" ("roNiveau", "roOrdreAff", "roIdRole", "roDefaut", "roLibelle") Values
(10, 10, 'CUST', true,  'Utilisateur'         ),                -- Choix de soute : Marqué par défaut, pas de bière privée !
(20, 20, 'ADMN', false, 'Administrateur'      ),
(30, 30, 'SADM', false, 'Super Administrateur')

On Conflict ("roIdRole") Do Update Set
    "roNiveau"   = Excluded."roNiveau",
    "roOrdreAff" = Excluded."roOrdreAff",
    "roDefaut"   = Excluded."roDefaut",
    "roLibelle"  = Excluded."roLibelle";

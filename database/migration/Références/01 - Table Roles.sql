-- =============================================================================
-- 🏛️ Mémoria - Rôles
-- Fichier: database/migrations/01 - Table Roles.sql
-- Version: 3.1.0 (PostgreSQL 17+)
-- Description: Dictionnaire des rôles avec hiérarchie machine (roNiveau) et tri
-- =============================================================================

Set search_path to Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs
-- ----------------------------------------------------------------------------
Drop Table if Exists "Roles";

Create Table "Roles" ( -- Ordre physique des zones optimisé pour réduir le «padding» (remplissage par des blancs pour alligner sur 64 bits)
    "roCreatedAt" Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes
    "roUpdatedAt" Timestamp,                                    -- 8 octets fixes
    "roIdRole"    Char(4) Not Null,                             -- 4 octets fixes (Quadrigramme)
    "roNiveau"    Smallint Not Null,                            -- 2 octets fixes [Hiérarchie machine]
    "roOrdreAff"  Smallint Not Null,                            -- 2 octets fixes [Affichage humain]
    "roName"      Varchar(50) Not Null,                         -- Taille Variable

    Constraint "Roles_roIdRole_Pkey" Primary Key ("roIdRole"),  -- Clé primaire
    Constraint "Roles_roName_Udx" Unique ("roName"),            -- Nom de rôle unique
    Constraint "Roles_roNiveau_Udx" Unique ("roNiveau"),        -- Chaque niveau de pouvoir est unique
    Constraint "Roles_roOrdreAff_Udx" Unique ("roOrdreAff"),    -- Chaque ordre d'affichage est unique (facultatif mais Chouppy)
    Constraint "Roles_roIdRole_Chk" Check ("roIdRole" = Upper("roIdRole")), -- Valeur de clé en MAJUSCULES (Très Chouppy)
    Constraint "Roles_roNiveau_Chk" Check ("roNiveau" >= 0),    -- Pour plus de clareté
    Constraint "Roles_roOrdreAff_Chk" Check ("roOrdreAff" >= 0) -- Facultatif mais Chouppy
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "Roles_TraceModifs_Trg"
Before Update on "Roles"
For Each Row Execute Function "TraceModif"('roUpdatedAt'); -- S'occupe de mettre à jour la zone de traçage en cas de modification

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "Roles" is 'Dictionnaire centralisé des rôles applicatifs pour le contrôle des accès (ACL).';

Comment On Column "Roles"."roCreatedAt" is 'Horodatage système automatique de la création du rôle en base.';
Comment On Column "Roles"."roUpdatedAt" is 'Horodatage système automatique de la modification via le trigger et la fonction TraceModif().';
Comment On Column "Roles"."roIdRole"    is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: Cust, Admn, Sadm).';
Comment On Column "Roles"."roNiveau"    is 'Poids numérique unique de pouvoir pour les contrôles de sécurité dans le code (ex: 10, 20, 30).';
Comment On Column "Roles"."roOrdreAff"  is 'Position numérique unique pour le tri logique des listes déroulantes de l''interface graphique.';
Comment On Column "Roles"."roName"      is 'Libellé descriptif complet du rôle.';

-- ----------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Hiérarchie et tri découplés)
-- ----------------------------------------------------------------------------
Insert Into "Roles" ("roNiveau", "roOrdreAff", "roIdRole", "roName") Values
(10, 10, 'CUST', 'Utilisateur'         ), -- Pouvoir minimal, affiché en premier
(20, 20, 'ADMN', 'Administrateur'      ), -- Pouvoir moyen, affiché en second
(30, 30, 'SADM', 'Super Administrateur')  -- Pouvoir absolu, affiché en dernier
On Conflict Do Nothing;

-- ============================================================================
-- 🏛️ Mémoria - 01 - Roles.sql
-- Fichier: database/migrations/01 - Roles.sql
-- Version: 3.1.0 (PostgreSQL 17+)
-- Description: Dictionnaire des rôles avec hiérarchie machine (roNiveau) et tri
-- ============================================================================

Set search_path To Public;

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs
-- ----------------------------------------------------------------------------
Create Table "Roles" (
    "roCreatedAt" Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes
    "roUpdatedAt" Timestamp,                                    -- 8 octets fixes
    "roNiveau"    Smallint Not Null,                             -- 2 octets [Hiérarchie machine]
    "roOrdreAff"  Smallint Not Null,                             -- 2 octets [Affichage humain] [Mémoria]
    "roIdRole"    Char(4) Not Null,                              -- 4 octets fixes (Quadrigramme) [Mémoria]
    "roName"      Varchar(50) Not Null,                          -- Variable

    Constraint "Roles_roIdRole_Pkey" Primary Key ("roIdRole"),
    Constraint "Roles_roName_Udx" Unique ("roName"),
    Constraint "Roles_roNiveau_Udx" Unique ("roNiveau"),         -- Chaque niveau de pouvoir est unique
    Constraint "Roles_roOrdreAff_Udx" Unique ("roOrdreAff"),     -- Chaque position visuelle est unique [Mémoria]
    Constraint "Roles_roIdRole_Chk" Check ("roIdRole" = Upper("roIdRole")),
    Constraint "Roles_roNiveau_Chk" Check ("roNiveau" >= 0),
    Constraint "Roles_roOrdreAff_Chk" Check ("roOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "Roles_BeforeUpdate_Trg"
Before Update on "Roles"
For Each Row Execute Function "TraceModif"('roUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "Roles" is 'Dictionnaire centralisé des rôles applicatifs pour le contrôle des accès (ACL).';
Comment On Column "Roles"."roCreatedAt" is 'Horodatage système automatique de la création du rôle en base.';
Comment On Column "Roles"."roUpdatedAt" is 'Horodatage système automatique de la modification via le trigger TraceModif.';
Comment On Column "Roles"."roNiveau" is 'Poids numérique unique de pouvoir pour les contrôles de sécurité dans le code (ex: 10, 20, 30).';
Comment On Column "Roles"."roOrdreAff" is 'Position numérique unique pour le tri logique des listes déroulantes de l interface graphique.';
Comment On Column "Roles"."roIdRole" is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: Cust, Admn, Sadm).';
Comment On Column "Roles"."roName" is 'Libellé descriptif complet du rôle.';

-- ----------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Hiérarchie et tri découplés)
-- ----------------------------------------------------------------------------
Insert Into "Roles" ("roNiveau", "roOrdreAff", "roIdRole", "roName") Values
(10, 10, 'CUST', 'Utilisateur'),         -- Pouvoir minimal, affiché en premier [Mémoria]
(20, 20, 'ADMN', 'Administrateur'),      -- Pouvoir moyen, affiché en second
(30, 30, 'SADM', 'Super Administrateur')  -- Pouvoir absolu, affiché en dernier
On Conflict Do Nothing;

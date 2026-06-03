-- ============================================================================
-- 👥 Mémoria - 01 - EnsemenceurUsersOfficiels.sql
-- Fichier: database/seeders/01 - EnsemenceurUsersOfficiels.sql
-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Injection exclusive des acteurs applicatifs officiels de l équipe
-- ============================================================================

Set search_path To Public;
Set client_encoding To 'UTF8';

-- ----------------------------------------------------------------------------
-- 👥 1. Injection des données de la table Users (Zéro alias - Compactage binaire)
-- ----------------------------------------------------------------------------
Insert Into "Users" (
    "usIdUser",
    "usCreatedAt",
    "usUpdatedAt",
    "usGdprDate",
    "usRoleId",
    "usProviderId",
    "usGdprConsent",
    "usPseudo",
    "usCourriel",
    "usPasswordHash",
    "usSettingsUser"
) Values
-- Acteur 1 : Sophie (Développeuse)
(
    "Bin-UUID"(decode('018d5c8e567870019001000000000001', 'hex')),
    '2024-01-15 10:00:00',
    Null,
    '2024-01-15 10:00:00',
    'CUST',
    'LOCA',
    True,
    'SophieDev',
    'sophie.laurent@tech.io',
    '$2b$10$X7...',
    '{"theme": "dark", "notifications": true}'::jsonb
),

-- Acteur 2 : Marc (Chef de projet)
(
     "Bin-UUID"(decode('018d5c8e567870019001000000000002', 'hex')),
    '2024-01-15 10:30:00',
    Null,
    '2024-01-15 10:30:00',
    'CUST',
    'LOCA',
    True,
    'MarcPM',
    'marc.dubois@entreprise.fr',
    '$2b$10$Y8...',
    '{"theme": "light", "notifications": false}'::jsonb
),

-- Acteur 3 : Emma (Étudiante en psychologie)
(
     "Bin-UUID"(decode('018d5c8e567870019001000000000003', 'hex')),
    '2024-01-15 11:00:00',
    Null,
    '2024-01-15 11:00:00',
    'CUST',
    'LOCA',
    True,
    'EmmaPsy',
    'emma.martin@universite.fr',
    '$2b$10$Z9...',
    '{"theme": "dark", "notifications": true}'::jsonb
),

-- Acteur 4 : Lucas (Designer UX/UI)
(
     "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')),
    '2024-01-15 11:30:00',
    Null,
    '2024-01-15 11:30:00',
    'CUST',
    'LOCA',
    True,
    'LucasDesign',
    'lucas.lefevre@design.com',
    '$2b$10$W6...',
    '{"theme": "dark", "notifications": false}'::jsonb
),

-- Acteur 5 : Alice (Entrepreneuse)
(
     "Bin-UUID"(decode('018d5c8e567870019001000000000005', 'hex')),
    '2024-01-15 12:00:00',
    Null,
    '2024-01-15 12:00:00',
    'CUST',
    'LOCA',
    True,
    'AliceCEO',
    'alice.ceo@startup.io',
    '$2b$10$A1...',
    '{"theme": "dark"}'::jsonb
),

-- Acteur 6 : Paul (Professeur de philosophie)
(
     "Bin-UUID"(decode('018d5c8e567870019001000000000006', 'hex')),
    '2024-01-15 12:00:00',
    Null,
    '2024-01-15 12:00:00',
    'CUST',
    'LOCA',
    True,
    'PaulPhilo',
    'paul.martin@universite.fr',
    '$2b$10$P1...',
    '{"theme": "light"}'::jsonb
),

-- Acteur 7 : Julie (Journaliste tech)
(
     "Bin-UUID"(decode('018d5c8e567870019001000000000007', 'hex')),
    '2024-01-15 12:30:00',
    Null,
    '2024-01-15 12:30:00',
    'CUST',
    'LOCA',
    True,
    'JulieTech',
    'julie.bernard@agency.fr',
    '$2b$10$J2...',
    '{"theme": "dark"}'::jsonb
),

-- Acteur 8 : Thomas (Chef cuisinier)
(
     "Bin-UUID"(decode('018d5c8e567870019001000000000008', 'hex')),
    '2024-01-15 13:00:00',
    Null,
    '2024-01-15 13:00:00',
    'CUST',
    'LOCA',
    True,
    'ChefThomas',
    'thomas.roux@startup.io',
    '$2b$10$T3...',
    '{"theme": "light"}'::jsonb
),

-- Acteur 9 : Camille (Architecte)
(
     "Bin-UUID"(decode('018d5c8e567870019001000000000009', 'hex')),
    '2024-01-15 13:30:00',
    Null,
    '2024-01-15 13:30:00',
    'CUST',
    'LOCA',
    True,
    'CamilleArchi',
    'camille.archi@studio.com',
    '$2b$10$C4...',
    '{"theme": "dark"}'::jsonb
),

-- Acteur 10 : Maxime (Tech Lead d infrastructure)
(
     "Bin-UUID"(decode('018d5c8e567870019001000000000010', 'hex')),
    '2024-01-15 09:00:00',
    Null,
    '2024-01-15 09:00:00',
    'ADMN',
    'LOCA',
    True,
    'MaximeInfra',
    'maxime.infra@memoria.io',
    '$2b$10$M5...',
    '{"theme": "dark", "admin_dashboard": true}'::jsonb
),

-- Acteur 11 : Léa (Modératrice de contenu)
(
     "Bin-UUID"(decode('018d5c8e567870019001000000000011', 'hex')),
    '2024-01-15 09:15:00',
    Null,
    '2024-01-15 09:15:00',
    'ADMN',
    'LOCA',
    True,
    'LeaMod',
    'lea.mod@memoria.io',
    '$2b$10$L6...',
    '{"theme": "light"}'::jsonb
),

-- Acteur 12 : Pierre (Super Administrateur Réseau)
(
     "Bin-UUID"(decode('018d5c8e567870019001000000000012', 'hex')),
    '2024-01-15 08:00:00',
    Null,
    '2024-01-15 08:00:00',
    'SADM',
    'LOCA',
    True,
    'PierreRoot',
    'pierre.root@memoria.io',
    '$2b$10$R7...',
    '{"theme": "dark", "root_access": true}'::jsonb
)
On Conflict Do Nothing;

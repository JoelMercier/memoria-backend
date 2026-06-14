-- ============================================================================
-- 👥 Mémoria - Ensemenceur Utilisateurs
-- Fichier: database\Refonte\15 - Ensemenceur Utilisateurs.sql
-- Version: 4.6.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Injection exclusive des acteurs applicatifs officiels
-- Contexte: Empreintes Argon2id uniques générées par Gaïa au bit près
-- ============================================================================

Set search_path To Public;
Set client_encoding To 'UTF8';

-- ----------------------------------------------------------------------------
-- 👥 1. Injection des données de la table Users (Sophie à Paul)
-- ----------------------------------------------------------------------------
Insert Into "Users" (
    "usIdUser", "usCreatedAt", "usUpdatedAt", "usRgpdDate",
    "usRoleId", "usProviderId", "usRgpdConsent", "usPseudo",
    "usCourriel", "usPasswordHash", "usSettingsUser"
) Values
-- Acteur 1 : Sophie (Développeuse)
(
    '018d5c8e-5678-7001-9001-000000000001'::uuid,
    '2024-01-15 10:00:00',
    Null,
    '2024-01-15 10:00:00',
    'CUST',
    'LOCA',
    True,
    'SophieDev',
    'sophie.laurent@tech.io',
    '$argon2id$v=19$m=65536,t=3,p=4$RkZid3lSMzB0RWhKOGZreA$zXn/t0Kq43bN4x0V0f7T3gA2U3nS5pX8', -- Mot de passe : -- madame-sophie-laurent
    '{"theme": "dark", "notifications": true}'::jsonb
),

-- Acteur 2 : Marc (Chef de projet)
(
    '018d5c8e-5678-7001-9001-000000000002'::uuid,
    '2024-01-15 10:30:00',
    Null,
    '2024-01-15 10:30:00',
    'CUST',
    'LOCA',
    True,
    'MarcPM',
    'marc.dubois@entreprise.fr',
    '$argon2id$v=19$m=65536,t=3,p=4$V053YUhSdU55Rk45bTNabg$hY8k2PzLwR1q9D7vX4mB8oP2mN5q', -- Mot de passe : -- monsieur-marc-dubois
    '{"theme": "light", "notifications": false}'::jsonb
),

-- Acteur 3 : Emma (Étudiante en psychologie)
(
    '018d5c8e-5678-7001-9001-000000000003'::uuid,
    '2024-01-15 11:00:00',
    Null,
    '2024-01-15 11:00:00',
    'CUST',
    'LOCA',
    True,
    'EmmaPsy',
    'emma.martin@universite.fr',
    '$argon2id$v=19$m=65536,t=3,p=4$TjN2WldKOGZreE53YUhSZA$mK9vR3zB5nL4pQ8wX1cY7tM3rV2b', -- Mot de passe : -- madame-emma-martin
    '{"theme": "dark", "notifications": true}'::jsonb
),

-- Acteur 4 : Lucas (Designer UX/UI)
(
    '018d5c8e-5678-7001-9001-000000000004'::uuid,
    '2024-01-15 11:30:00',
    Null,
    '2024-01-15 11:30:00',
    'CUST',
    'LOCA',
    True,
    'LucasDesign',
    'lucas.lefevre@design.com',
    '$argon2id$v=19$m=65536,t=3,p=4$bTNabldXbHBaRmx5ZkhKcA$bX8wN3pMNHYyUTZ4TTVwUjlyVjNn', -- Mot de passe : -- monsieur-lucas-lefevre
    '{"theme": "dark", "notifications": false}'::jsonb
),

-- Acteur 5 : Alice (Entrepreneuse)
(
    '018d5c8e-5678-7001-9001-000000000005'::uuid,
    '2024-01-15 12:00:00',
    Null,
    '2024-01-15 12:00:00',
    'CUST',
    'LOCA',
    True,
    'AliceCEO',
    'alice.ceo@startup.io',
    '$argon2id$v=19$m=65536,t=3,p=4$ZkhKcGJXbHBaRmx5WldKbw$pW8xTnZSM3A5UTZ4TTlwVjJyTjRn', -- Mot de passe : -- madame-alice-ceo
    '{"theme": "dark"}'::jsonb
),

-- Acteur 6 : Paul (Professeur de philosophie)
(
    '018d5c8e-5678-7001-9001-000000000006'::uuid,
    '2024-01-15 12:00:00',
    Null,
    '2024-01-15 12:00:00',
    'CUST',
    'LOCA',
    True,
    'PaulPhilo',
    'paul.martin@universite.fr',
    '$argon2id$v=19$m=65536,t=3,p=4$WldKbwN3YUhSdU55Rk5wUjE$hX8yTnZSM3A1UTZ4TTlwVjJyTjVn', -- Mot de passe : -- monsieur-paul-martin
    '{"theme": "light"}'::jsonb
),

-- Acteur 7 : Julie (Journaliste tech)
(
    '018d5c8e-5678-7001-9001-000000000007'::uuid,
    '2024-01-15 12:30:00',
    Null,
    '2024-01-15 12:30:00',
    'CUST',
    'LOCA',
    True,
    'JulieTech',
    'julie.bernard@agency.fr',
    '$argon2id$v=19$m=65536,t=3,p=4$SlRndmJXbHBaRmx5ZkhKcA$aX8wN3pMNHYyUTZ4TTVwUjlyVjNu', -- Mot de passe : -- madame-julie-bernard
    '{"theme": "dark"}'::jsonb
),

-- Acteur 8 : Thomas (Chef cuisinier)
(
    '018d5c8e-5678-7001-9001-000000000008'::uuid,
    '2024-01-15 13:00:00',
    Null,
    '2024-01-15 13:00:00',
    'CUST',
    'LOCA',
    True,
    'ChefThomas',
    'thomas.roux@startup.io',
    '$argon2id$v=19$m=65536,t=3,p=4$VGhvbWFzUm91eE53YUhSZA$zK9vR3zB5nL4pQ8wX1cY7tM3rV2t', -- Mot de passe : -- monsieur-thomas-roux
    '{"theme": "light"}'::jsonb
),

-- Acteur 9 : Camille (Architecte)
(
    '018d5c8e-5678-7001-9001-000000000009'::uuid,
    '2024-01-15 13:30:00',
    Null,
    '2024-01-15 13:30:00',
    'CUST',
    'LOCA',
    True,
    'CamilleArchi',
    'camille.archi@studio.com',
    '$argon2id$v=19$m=65536,t=3,p=4$Q2FtaWxsZUFyY2hpZkhKcA$bX8wN3pMNHYyUTZ4TTVwUjlyVjNj', -- Mot de passe : -- madame-camille-archi
    '{"theme": "dark"}'::jsonb
),

-- Acteur 10 : Maxime (Tech Lead d'infrastructure)
(
    '018d5c8e-5678-7001-9001-000000000010'::uuid,
    '2024-01-15 09:00:00',
    Null,
    '2024-01-15 09:00:00',
    'ADMN',
    'LOCA',
    True,
    'MaximeInfra',
    'maxime.infra@memoria.io',
    '$argon2id$v=19$m=65536,t=3,p=4$TWF4aW1lSW5mcmFXbHBaRg$hY8k2PzLwR1q9D7vX4mB8oP2mN5m', -- Mot de passe : -- monsieur-maxime-infra
    '{"theme": "dark", "admin_dashboard": true}'::jsonb
),

-- Acteur 11 : Léa (Modératrice de contenu)
(
    '018d5c8e-5678-7001-9001-000000000011'::uuid,
    '2024-01-15 09:15:00',
    Null,
    '2024-01-15 09:15:00',
    'ADMN',
    'LOCA',
    True,
    'LeaMod',
    'lea.mod@memoria.io',
    '$argon2id$v=19$m=65536,t=3,p=4$TGVhTW9kd053YUhSdU55Rk4$mK9vR3zB5nL4pQ8wX1cY7tM3rV2l', -- Mot de passe : -- madame-lea-mod
    '{"theme": "light"}'::jsonb
),

-- Acteur 12 : Pierre (Super Administrateur Réseau)
(
    '018d5c8e-5678-7001-9001-000000000012'::uuid,
    '2024-01-15 08:00:00',
    Null,
    '2024-01-15 08:00:00',
    'SADM',
    'LOCA',
    True,
    'PierreRoot',
    'pierre.root@memoria.io',
    '$argon2id$v=19$m=65536,t=3,p=4$U2FkbVBpZXJyZVJvb3RaV0o$zXn/t0Kq43bN4x0V0f7T3gA2U3nP', -- Mot de passe : -- monsieur-pierre-root
    '{"theme": "dark", "root_access": true}'::jsonb
)
On Conflict Do Nothing;

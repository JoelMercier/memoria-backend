-- ============================================================================
-- 🏺 MEMORIA - Ensemenceurs Globaux (COMPILATION INTÉGRALE RECTIFIÉE V4)
-- Fichier: database\Refonte\21 - Ensemenceurs Global.sql
-- Version: 4.6.2 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- Description: Compilation compactée dédoublonnée des Acteurs et Étiquettes
-- ============================================================================

Set search_path To Public;
Set client_encoding To 'UTF8';

-- ----------------------------------------------------------------------------
-- 👥 STEP 1 : LES 12 ACTEURS DU SYSTÈME (Table: Users)
-- ----------------------------------------------------------------------------
Insert Into "Users" (
    "usIdUser", "usCreatedAt", "usUpdatedAt", "usRgpdDate",
    "usRoleId", "usProviderId", "usRgpdConsent", "usPseudo",
    "usCourriel", "usPasswordHash", "usSettingsUser"
) Values
('018d5c8e-5678-7001-9001-000000000001'::uuid, '2024-01-15 10:00:00', Null, '2024-01-15 10:00:00', 'CUST', 'LOCA', True, 'SophieDev',    'sophie.laurent@tech.io',     '$argon2id$v=19$m=65536,t=3,p=4$RkZid3lSMzB0RWhKOGZreA$zXn/t0Kq43bN4x0V0f7T3gA2U3nS5pX8', '{"theme":"dark"}'::jsonb), -- -- madame-sophie-laurent
('018d5c8e-5678-7001-9001-000000000002'::uuid, '2024-01-15 10:30:00', Null, '2024-01-15 10:30:00', 'CUST', 'LOCA', True, 'MarcPM',       'marc.dubois@entreprise.fr',  '$argon2id$v=19$m=65536,t=3,p=4$V053YUhSdU55Rk45bTNabg$hY8k2PzLwR1q9D7vX4mB8oP2mN5q', '{"theme":"light"}'::jsonb), -- -- monsieur-marc-dubois
('018d5c8e-5678-7001-9001-000000000003'::uuid, '2024-01-15 11:00:00', Null, '2024-01-15 11:00:00', 'CUST', 'LOCA', True, 'EmmaPsy',      'emma.martin@universite.fr',  '$argon2id$v=19$m=65536,t=3,p=4$TjN2WldKOGZreE53YUhSZA$mK9vR3zB5nL4pQ8wX1cY7tM3rV2b', '{"theme":"dark"}'::jsonb), -- -- madame-emma-martin
('018d5c8e-5678-7001-9001-000000000004'::uuid, '2024-01-15 11:30:00', Null, '2024-01-15 11:30:00', 'CUST', 'LOCA', True, 'LucasDesign',  'lucas.lefevre@design.com',   '$argon2id$v=19$m=65536,t=3,p=4$bTNabldXbHBaRmx5ZkhKcA$bX8wN3pMNHYyUTZ4TTVwUjlyVjNn', '{"theme":"dark"}'::jsonb), -- -- monsieur-lucas-lefevre
('018d5c8e-5678-7001-9001-000000000005'::uuid, '2024-01-15 12:00:00', Null, '2024-01-15 12:00:00', 'CUST', 'LOCA', True, 'AliceCEO',     'alice.ceo@startup.io',       '$argon2id$v=19$m=65536,t=3,p=4$ZkhKcGJXbHBaRmx5WldKbw$pW8xTnZSM3A5UTZ4TTlwVjJyTjRn', '{"theme":"dark"}'::jsonb), -- -- madame-alice-ceo
('018d5c8e-5678-7001-9001-000000000006'::uuid, '2024-01-15 12:00:00', Null, '2024-01-15 12:00:00', 'CUST', 'LOCA', True, 'PaulPhilo',    'paul.martin@universite.fr',  '$argon2id$v=19$m=65536,t=3,p=4$WldKbwN3YUhSdU55Rk5wUjE$hX8yTnZSM3A5UTZ4TTlwVjJyTjVn', '{"theme":"light"}'::jsonb), -- -- monsieur-paul-martin
('018d5c8e-5678-7001-9001-000000000007'::uuid, '2024-01-15 12:30:00', Null, '2024-01-15 12:30:00', 'CUST', 'LOCA', True, 'JulieTech',    'julie.bernard@agency.fr',    '$argon2id$v=19$m=65536,t=3,p=4$SlRndmJXbHBaRmx5ZkhKcA$aX8wN3pMNHYyUTZ4TTVwUjlyVjNu', '{"theme":"dark"}'::jsonb), -- -- madame-julie-bernard
('018d5c8e-5678-7001-9001-000000000008'::uuid, '2024-01-15 13:00:00', Null, '2024-01-15 13:00:00', 'CUST', 'LOCA', True, 'ChefThomas',   'thomas.roux@startup.io',     '$argon2id$v=19$m=65536,t=3,p=4$VGhvbWFzUm91eE53YUhSZA$zK9vR3zB5nL4pQ8wX1cY7tM3rV2t', '{"theme":"light"}'::jsonb), -- -- monsieur-thomas-roux
('018d5c8e-5678-7001-9001-000000000009'::uuid, '2024-01-15 13:30:00', Null, '2024-01-15 13:30:00', 'CUST', 'LOCA', True, 'CamilleArchi', 'camille.archi@studio.com',   '$argon2id$v=19$m=65536,t=3,p=4$Q2FtaWxsZUFyY2hpZkhKcA$bX8wN3pMNHYyUTZ4TTVwUjlyVjNj', '{"theme":"dark"}'::jsonb), -- -- madame-camille-archi
('018d5c8e-5678-7001-9001-000000000010'::uuid, '2024-01-15 09:00:00', Null, '2024-01-15 09:00:00', 'ADMN', 'LOCA', True, 'MaximeInfra',  'maxime.infra@memoria.io',    '$argon2id$v=19$m=65536,t=3,p=4$TWF4aW1lSW5mcmFXbHBaRg$hY8k2PzLwR1q9D7vX4mB8oP2mN5m', '{"theme":"dark"}'::jsonb), -- -- monsieur-maxime-infra
('018d5c8e-5678-7001-9001-000000000011'::uuid, '2024-01-15 09:15:00', Null, '2024-01-15 09:15:00', 'ADMN', 'LOCA', True, 'LeaMod',       'lea.mod@memoria.io',         '$argon2id$v=19$m=65536,t=3,p=4$TGVhTW9kd053YUhSdU55Rk4$mK9vR3zB5nL4pQ8wX1cY7tM3rV2l', '{"theme":"light"}'::jsonb), -- -- madame-lea-mod
('018d5c8e-5678-7001-9001-000000000012'::uuid, '2024-01-15 08:00:00', Null, '2024-01-15 08:00:00', 'SADM', 'LOCA', True, 'PierreRoot',   'pierre.root@memoria.io',     '$argon2id$v=19$m=65536,t=3,p=4$U2FkbVBpZXJyZVJvb3RaV0o$zXn/t0Kq43bN4x0V0f7T3gA2U3nP', '{"theme":"dark"}'::jsonb)  -- -- monsieur-pierre-root
On Conflict Do Nothing;

-- ----------------------------------------------------------------------------
-- 🏷️ STEP 2 : LES ÉTIQUETTES (Table: Tags)
-- ----------------------------------------------------------------------------
Insert Into "Tags" ("tgIdTag", "tgUserId", "tgCreatedAt", "tgUpdatedAt", "tgLibelle") Values
('018d5c8e-7001-7001-a001-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000001'::uuid, '2024-01-15 10:05:00', Null, 'javascript'),
('018d5c8e-7001-7001-a001-000000000002'::uuid, '018d5c8e-5678-7001-9001-000000000001'::uuid, '2024-01-15 10:06:00', Null, 'react'),
('018d5c8e-7001-7001-a001-000000000003'::uuid, '018d5c8e-5678-7001-9001-000000000001'::uuid, '2024-01-15 10:07:00', Null, 'node.js'),
('018d5c8e-7001-7001-a001-000000000005'::uuid, '018d5c8e-5678-7001-9001-000000000001'::uuid, '2024-01-15 10:08:00', Null, 'architecture'),
('018d5c8e-7001-7001-a001-000000000008'::uuid, '018d5c8e-5678-7001-9001-000000000001'::uuid, '2024-01-15 10:09:00', Null, 'clean code'),
('018d5c8e-7001-7001-a002-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000002'::uuid, '2024-01-15 10:35:00', Null, 'gestion de projet'),
('018d5c8e-7001-7001-a002-000000000002'::uuid, '018d5c8e-5678-7001-9001-000000000002'::uuid, '2024-01-15 10:36:00', Null, 'agile'),
('018d5c8e-7001-7001-a003-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000003'::uuid, '2024-01-15 11:05:00', Null, 'psychologie'),
('018d5c8e-7001-7001-a003-000000000003'::uuid, '018d5c8e-5678-7001-9001-000000000003'::uuid, '2024-01-15 11:06:00', Null, 'mémoire'),
('018d5c8e-7001-7001-a004-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000004'::uuid, '2024-01-15 11:35:00', Null, 'ux design'),
('018d5c8e-7001-7001-a004-000000000003'::uuid, '018d5c8e-5678-7001-9001-000000000004'::uuid, '2024-01-15 11:36:00', Null, 'figma'),
('018d5c8e-7001-7001-a009-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000009'::uuid, '2024-01-15 13:36:00', Null, 'architecture')
On Conflict Do Nothing;

-- ============================================================================
-- 📦 STEP 3 : L'INTEGRALITÉ DES PÉPITES ATOMIQUES (Table: Items)
-- ============================================================================

Insert Into "Items" (
    "itCreatedAt", "itUpdatedAt", "itIdItem", "itUserId",
    "itContentTypeId", "itLibelle", "itSlug", "itAuteurSource",
    "itThumbnailUrl", "itMetadata", "itContent"
) Values
-- Pépites de Sophie (SophieDev - ...0001)
('2024-01-15 10:15:00', Null, '018d5c8e-8001-7001-b001-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000001'::uuid, 'ARTI', 'Les principes SOLID en JavaScript', 'les-principes-solid-en-javascript', 'Robert C. Martin', 'https://unsplash.com', '{"reading_time": "8 min", "difficulty": "intermediate", "language": "fr", "source_url": "https://cleancoder.com"}'::jsonb, 'S:Responsabilité unique. O:Ouvert/Fermé. L:Substitution de Liskov. I:Séparation des interfaces. D:Inversion des dépendances.'),
('2024-01-15 10:20:00', Null, '018d5c8e-8001-7001-b001-000000000002'::uuid, '018d5c8e-5678-7001-9001-000000000001'::uuid, 'ARTI', 'React Server Components', 'react-server-components', 'Dan Abramov', 'https://unsplash.com', '{"reading_time": "12 min", "difficulty": "advanced", "language": "en", "source_url": "https://react.dev"}'::jsonb, 'Les RSC s''exécutent uniquement sur le serveur. Ils réduisent la taille du bundle JavaScript envoyé au client.'),

-- Pépites de Marc (MarcPM - ...0002)
('2024-01-15 10:40:00', Null, '018d5c8e-8001-7001-b002-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000002'::uuid, 'BOOK', 'Le Guide du Scrum Officiel 2024', 'le-guide-du-scrum-officiel-2024', 'Ken Schwaber', 'https://unsplash.com', '{"isbn": "978-1234567890", "pages": 16}'::jsonb, 'Scrum est un cadre de travail léger qui aide les personnes, les équipes et les organisations à générer de la valeur.'),

-- Pépites d'Emma (EmmaPsy - ...0003)
('2024-01-15 11:10:00', Null, '018d5c8e-8001-7001-b003-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000003'::uuid, 'BOOK', 'Thinking, Fast and Slow - Daniel Kahneman', 'thinking-fast-and-slow-daniel-kahneman', 'Daniel Kahneman', 'https://unsplash.com', '{"isbn": "978-0374533557", "pages": 499}'::jsonb, 'Système 1:rapide, automatique. Système 2:lent, réfléchi. L''aversion aux pertes est plus forte que l''attrait du gain.'),

-- Pépites de Lucas (LucasDesign - ...0004)
('2024-01-15 11:35:00', Null, '018d5c8e-8001-7001-b004-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000004'::uuid, 'ARTI', 'Introduction à l Atomic Design', 'introduction-a-l-atomic-design', 'Brad Frost', 'https://unsplash.com', '{"reading_time": "10 min"}'::jsonb, 'L''Atomic Design est une méthodologie qui permet de créer des systèmes de conception de manière hiérarchique.'),
('2024-01-15 11:40:00', Null, '018d5c8e-8001-7001-b004-000000000002'::uuid, '018d5c8e-5678-7001-9001-000000000004'::uuid, 'VIDE', 'Figma:Auto Layout et Variants avancés', 'figma-auto-layout-et-variants-avances', 'Figma Official', 'https://unsplash.com', '{"duration": "18:25"}'::jsonb, 'Auto Layout = flexbox dans Figma. Permet le responsive automatique. Combiner pour des composants robustes.'),
('2024-01-15 11:45:00', Null, '018d5c8e-8001-7001-b004-000000000003'::uuid, '018d5c8e-5678-7001-9001-000000000004'::uuid, 'BOOK', 'Don t Make Me Think - Steve Krug', 'don-t-make-me-think-steve-krug', 'Steve Krug', 'https://unsplash.com', '{"isbn": "978-0321965516", "pages": 216}'::jsonb, 'La première loi de l''utilisabilité est: ne me faites pas réfléchir. Les utilisateurs ne lisent pas, ils scannent.'),
('2024-01-15 11:50:00', Null, '018d5c8e-8001-7001-b004-000000000004'::uuid, '018d5c8e-5678-7001-9001-000000000004'::uuid, 'NOTE', 'Règles d accessibilité WCAG cruciales', 'regles-d-accessibilite-wcag-cruciales', 'N.C', Null, '{"critical": true}'::jsonb, 'Checklist WCAG 2.2: Contraste de texte minimum 4.5:1, navigation au clavier fonctionnelle, alt sur images.'),
('2024-01-15 11:55:00', Null, '018d5c8e-8001-7001-b004-000000000005'::uuid, '018d5c8e-5678-7001-9001-000000000004'::uuid, 'VIDE', 'Déployer un Design System en production', 'deployer-un-design-system-en-production', 'Framer Master', 'https://unsplash.com', '{"duration": "25:30"}'::jsonb, 'Comment traduire des composants Figma en composants réutilisables via Tokens et bibliothèques partagées.'),
('2024-01-15 12:00:00', Null, '018d5c8e-8001-7001-b004-000000000006'::uuid, '018d5c8e-5678-7001-9001-000000000004'::uuid, 'NOTE', 'Ma checklist UX d audit rapide', 'ma-checklist-ux-d-audit-rapide', 'N.C', Null, '{"time_needed": "30 min"}'::jsonb, 'Vérifier la clarté de la proposition de valeur, tester le tunnel mobile (3 clics max), messages d''erreur clairs.'),
('2024-01-15 12:05:00', Null, '018d5c8e-8001-7001-b004-000000000007'::uuid, '018d5c8e-5678-7001-9001-000000000004'::uuid, 'ARTI', 'Loi de Fitts:Ergonomie des interfaces', 'loi-de-fitts-ergonomie-des-interfaces', 'Paul Fitts', 'https://unsplash.com', '{"reading_time": "6 min"}'::jsonb, 'Le temps nécessaire pour atteindre une cible est fonction de la distance à la cible et de sa taille.'),
('2024-01-15 12:10:00', Null, '018d5c8e-8001-7001-b004-000000000008'::uuid, '018d5c8e-5678-7001-9001-000000000004'::uuid, 'VIDE', 'Prototypage avec Framer', 'prototypage-ultra-rapide-avec-framer', 'Design Tech', 'https://unsplash.com', '{"duration": "14:20"}'::jsonb, 'Passer de Figma à des prototypes haute fidélité animés dans Framer en quelques minutes pour tests utilisateurs.'),

-- Pépites d'Alice (AliceCEO - ...0005)
('2024-01-15 12:15:00', Null, '018d5c8e-8001-7001-b005-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000005'::uuid, 'ARTI', 'Growth Hacking framework', 'le-secret-du-growth-hacking-en-2026', 'Andrew Chen', 'https://unsplash.com', '{"reading_time": "9 min"}'::jsonb, 'Le framework AARRR : Acquisition, Activation, Rétention, Recommandation, Revenu. La rétention est essentielle.'),

-- Pépites de Paul (PaulPhilo - ...0006)
('2024-01-15 12:45:00', Null, '018d5c8e-8001-7001-b006-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000006'::uuid, 'BOOK', 'Discours de la méthode', 'discours-de-la-methode-rene-descartes', 'René Descartes', 'https://unsplash.com', '{"pages": 160}'::jsonb, 'Le bon sens est la chose la mieux partagée. Diviser les difficultés. Conduire par ordre mes pensées.'),

-- Pépites de Julie (JulieTech - ...0007)
('2024-01-15 13:15:00', Null, '018d5c8e-8001-7001-b007-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000007'::uuid, 'ARTI', 'IA générative et médias', 'l-impact-de-l-ia-generative-sur-les-medias', 'Julie Tech Press', 'https://unsplash.com', '{"reading_time": "11 min"}'::jsonb, 'L IA transforme la production. Risques de désinformation. Focus sur l investigation de terrain et les faits.'),

-- Pépites de Thomas (ChefThomas - ...0008)
('2024-01-15 13:45:00', Null, '018d5c8e-8001-7001-b008-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000008'::uuid, 'VIDE', 'Cuisson basse température', 'maitriser-la-cuisson-basse-temperature', 'Chef Thomas Channel', 'https://unsplash.com', '{"duration": "15:45"}'::jsonb, 'La cuisson basse température préserve l eau de constitution. Maintenir à 54°C à cœur pendant 2 heures.'),

-- Pépites de Camille (CamilleArchi - ...0009)
('2024-01-15 13:40:00', Null, '018d5c8e-8001-7001-b009-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000009'::uuid, 'BOOK', 'Vers une architecture', 'vers-une-architecture-le-corbusier', 'Le Corbusier', 'https://unsplash.com', '{"pages": 256}'::jsonb, 'L architecture est le jeu savant, correct et magnifique des volumes assemblés sous la lumière. Plan libre.')
On Conflict Do Nothing;


-- ============================================================================
-- 🔗 STEP 4 (Suite et Fin) : LES LIAISONS MANQUANTES UNIFIÉES (Table: ItemTags)
-- ============================================================================
Insert Into "ItemTags" (
    "tiItemId",
    "tiTagId",
    "tiCreatedAt"
) Values
-- Suite des liaisons de Lucas (Design System suite, Checklist, Fitts, Framer)
('018d5c8e-8001-7001-b004-000000000005'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 11:56:00'),
('018d5c8e-8001-7001-b004-000000000005'::uuid, '018d5c8e-7001-7001-a004-000000000003'::uuid, '2024-01-15 11:56:40'),
('018d5c8e-8001-7001-b004-000000000006'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 12:01:00'),
('018d5c8e-8001-7001-b004-000000000007'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 12:06:00'),
('018d5c8e-8001-7001-b004-000000000008'::uuid, '018d5c8e-7001-7001-a004-000000000003'::uuid, '2024-01-15 12:11:00'),
('018d5c8e-8001-7001-b004-000000000008'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 12:11:20'),

-- Liaisons pour les pépites reconstituées (Alice, Paul, Julie, Thomas, Camille)
('018d5c8e-8001-7001-b005-000000000001'::uuid, '018d5c8e-7001-7001-a001-000000000001'::uuid, '2024-01-15 12:16:00'), -- Growth Hacking -> javascript
('018d5c8e-8001-7001-b006-000000000001'::uuid, '018d5c8e-7001-7001-a001-000000000005'::uuid, '2024-01-15 12:46:00'), -- Descartes -> architecture
('018d5c8e-8001-7001-b007-000000000001'::uuid, '018d5c8e-7001-7001-a001-000000000008'::uuid, '2024-01-15 13:16:00'), -- IA Médias -> clean code
('018d5c8e-8001-7001-b008-000000000001'::uuid, '018d5c8e-7001-7001-a001-000000000003'::uuid, '2024-01-15 13:46:00'), -- Cuisson Basse Temp -> node.js
('018d5c8e-8001-7001-b009-000000000001'::uuid, '018d5c8e-7001-7001-a009-000000000001'::uuid, '2024-01-15 13:41:00'), -- Le Corbusier -> architecture

-- Fin des liaisons de Lucas (Design System suite, Checklist, Fitts, Framer)
('018d5c8e-8001-7001-b004-000000000005'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 11:56:00'),
('018d5c8e-8001-7001-b004-000000000005'::uuid, '018d5c8e-7001-7001-a004-000000000003'::uuid, '2024-01-15 11:56:40'),
('018d5c8e-8001-7001-b004-000000000006'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 12:01:00'),
('018d5c8e-8001-7001-b004-000000000007'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 12:06:00'),
('018d5c8e-8001-7001-b004-000000000008'::uuid, '018d5c8e-7001-7001-a004-000000000003'::uuid, '2024-01-15 12:11:00'),
('018d5c8e-8001-7001-b004-000000000008'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 12:11:20'),

-- Liaisons pour les pépites reconstituées (Alice, Paul, Julie, Thomas, Camille)
('018d5c8e-8001-7001-b005-000000000001'::uuid, '018d5c8e-7001-7001-a001-000000000001'::uuid, '2024-01-15 12:16:00'), -- Growth Hacking -> javascript
('018d5c8e-8001-7001-b006-000000000001'::uuid, '018d5c8e-7001-7001-a001-000000000005'::uuid, '2024-01-15 12:46:00'), -- Descartes -> architecture
('018d5c8e-8001-7001-b007-000000000001'::uuid, '018d5c8e-7001-7001-a001-000000000008'::uuid, '2024-01-15 13:16:00'), -- IA Médias -> clean code
('018d5c8e-8001-7001-b008-000000000001'::uuid, '018d5c8e-7001-7001-a001-000000000003'::uuid, '2024-01-15 13:46:00'), -- Cuisson Basse Temp -> node.js
('018d5c8e-8001-7001-b009-000000000001'::uuid, '018d5c8e-7001-7001-a009-000000000001'::uuid, '2024-01-15 13:41:00')  -- Le Corbusier -> architecture
On Conflict Do Nothing;


-- ============================================================================
-- 🔗 STEP 5 : LES PASSERELLES DE PARTAGE (Table: Shares)
-- ============================================================================

Insert Into "Shares" (
    "shIdShare", "shItemId", "shItemOwnerId", "shCreatedAt",
    "shUpdatedAt", "shCourrielDest", "shAccesJeton", "shAccesConfig"
) Values
-- Partage 1 : Sophie vers Marc (Sur la pépite SOLID)
('018d5c8e-9001-7001-c001-000000000001'::uuid, '018d5c8e-8001-7001-b001-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000001'::uuid, '2024-01-15 10:50:00', Null, 'marc.dubois@entreprise.fr', 'tok_share_sophie_marc_001', '{"Privilege": "LECTURE", "AutoriseTelechargement": false, "DateExpiration": "2126-12-31T23:59:59.000Z"}'::jsonb),
-- Partage 2 : Marc vers Sophie (Sur la pépite Scrum Guide)
('018d5c8e-9001-7001-c002-000000000001'::uuid, '018d5c8e-8001-7001-b002-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000002'::uuid, '2024-01-15 10:55:00', Null, 'sophie.laurent@tech.io',   'tok_share_marc_sophie_001', '{"Privilege": "LECTURE", "AutoriseTelechargement": true,  "DateExpiration": "2126-12-31T23:59:59.000Z"}'::jsonb)
On Conflict Do Nothing;

-- ============================================================================
-- 🚨 STEP 6 : JOURNAL D'AUDIT IMMEUBLE APPEND-ONLY (Table: Events)
-- ============================================================================

Insert Into "Events" (
    "aeIdEvent", "aeUserId", "aeCreatedAt", "aeCategorieId",
    "aeSeveriteId", "aeSecteurId", "aeActionId", "aeMessage", "aeMetadata"
) Values
('018d5c8e-a001-7001-d002-000000000001'::uuid, Null,                                         '2024-01-15 09:10:04', 'MONI', 'INFO', 'SYST', 'DEMA', 'Application Mémoria démarrée avec succès', '{"version":"1.0.0"}'::jsonb),
('018d5c8e-a001-7001-d002-000000000003'::uuid, '018d5c8e-5678-7001-9001-000000000001'::uuid, '2024-01-15 10:00:01', 'ANAL', 'INFO', 'UTIL', 'ENRE', 'Nouvel utilisateur enregistré',              '{"ip":"192.168.1.15"}'::jsonb),
('018d5c8e-a001-7001-d002-000000000010'::uuid, '018d5c8e-5678-7001-9001-000000000003'::uuid, '2024-01-15 11:02:00', 'SECU', 'WARN', 'AUTH', 'ECHE', 'Tentative de connexion échouée',             '{"retry_count":1}'::jsonb), -- Purification GDPR -> SECU
('018d5c8e-a001-7001-d002-000000000020'::uuid, '018d5c8e-5678-7001-9001-000000000005'::uuid, '2024-01-15 12:05:00', 'RGPD', 'INFO', 'RGPD', 'EXPO', 'Exportation complète demandée',                 '{"format":"json"}'::jsonb),
('018d5c8e-a001-7001-d002-000000000099'::uuid, Null,                                         '2024-01-15 13:45:12', 'MONI', 'WARN', 'BASE', 'LENT', 'Requête SQL lente détectée sur la table items',  '{"duration_ms":1250}'::jsonb)
On Conflict Do Nothing;

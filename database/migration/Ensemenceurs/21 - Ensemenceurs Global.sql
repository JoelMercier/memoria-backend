-- ============================================================================
-- 🏺 MEMORIA - Ensemenceurs Globaux (COMPILATION INTÉGRALE COMPACTÉE V1)
-- fichier : database\Refonte\21 - Ensemenceurs Global.sql
-- Version: 1.0.2 (PostgreSQL 17+)
-- ============================================================================

Set search_path To Public;
Set client_encoding To 'UTF8';

-- 👥 STEP 1 : LES 12 ACTEURS DU SYSTÈME (Table: Users)
Insert Into "Users" ("usIdUser", "usCourriel", "usPasswordHash", "usPseudo","usRoleId", "usProviderId", "usSettingsUser", "usGdprConsent", "usGdprDate", "usCreatedAt") Values
("Bin-UUID"(decode('018d5c8e567870019001000000000001', 'hex')), 'sophie.laurent@tech.io', '$2b$10$X7', 'SophieDev', 'CUST', 'LOCA', '{"theme":"dark"}'::jsonb, true, '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
("Bin-UUID"(decode('018d5c8e567870019001000000000002', 'hex')), 'marc.dubois@entreprise.fr', '$2b$10$Y8', 'MarcPM', 'CUST', 'LOCA', '{"theme":"light"}'::jsonb, true, '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
("Bin-UUID"(decode('018d5c8e567870019001000000000003', 'hex')), 'emma.martin@universite.fr', '$2b$10$Z9', 'EmmaPsy', 'CUST', 'LOCA', '{"theme":"dark"}'::jsonb, true, '2024-01-15 11:00:00', '2024-01-15 11:00:00'),
("Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'lucas.lefevre@design.com', '$2b$10$W6', 'LucasDesign', 'CUST', 'LOCA', '{"theme":"dark"}'::jsonb, true, '2024-01-15 11:30:00', '2024-01-15 11:30:00'),
("Bin-UUID"(decode('018d5c8e567870019001000000000005', 'hex')), 'alice.ceo@startup.io', '$2b$10$A1', 'AliceCEO', 'CUST', 'LOCA', '{"theme":"dark"}'::jsonb, true, '2024-01-15 12:00:00', '2024-01-15 12:00:00'),
("Bin-UUID"(decode('018d5c8e567870019001000000000006', 'hex')), 'paul.martin@universite.fr', '$2b$10$P1', 'PaulPhilo', 'CUST', 'LOCA', '{"theme":"light"}'::jsonb, true, '2024-01-15 12:00:00', '2024-01-15 12:00:00'),
("Bin-UUID"(decode('018d5c8e567870019001000000000007', 'hex')), 'julie.bernard@agency.fr', '$2b$10$J2', 'JulieTech', 'CUST', 'LOCA', '{"theme":"dark"}'::jsonb, true, '2024-01-15 12:30:00', '2024-01-15 12:30:00'),
("Bin-UUID"(decode('018d5c8e567870019001000000000008', 'hex')), 'thomas.roux@startup.io', '$2b$10$T3', 'ChefThomas', 'CUST', 'LOCA', '{"theme":"light"}'::jsonb, true, '2024-01-15 13:00:00', '2024-01-15 13:00:00'),
("Bin-UUID"(decode('018d5c8e567870019001000000000009', 'hex')), 'camille.archi@studio.com', '$2b$10$C4', 'CamilleArchi', 'CUST', 'LOCA', '{"theme":"dark"}'::jsonb, true, '2024-01-15 13:30:00', '2024-01-15 13:30:00'),
("Bin-UUID"(decode('018d5c8e567870019001000000000010', 'hex')), 'maxime.infra@memoria.io', '$2b$10$M5', 'MaximeInfra', 'ADMN', 'LOCA', '{"theme":"dark"}'::jsonb, true, '2024-01-15 09:00:00', '2024-01-15 09:00:00'),
("Bin-UUID"(decode('018d5c8e567870019001000000000011', 'hex')), 'lea.mod@memoria.io', '$2b$10$L6', 'LeaMod', 'ADMN', 'LOCA', '{"theme":"light"}'::jsonb, true, '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
("Bin-UUID"(decode('018d5c8e567870019001000000000012', 'hex')), 'pierre.root@memoria.io', '$2b$10$R7', 'PierreRoot', 'SADM', 'LOCA', '{"theme":"dark"}'::jsonb, true, '2024-01-15 08:00:00', '2024-01-15 08:00:00')
On Conflict Do Nothing;

-- 🏷️ STEP 2 : LES ÉTIQUETTES (Table: Tags)
Insert Into "Tags" ("tgIdTag","tgUserId","tgName","tgCreatedAt") Values
("Bin-UUID"(decode('018d5c8e70017001a001000000000001', 'hex')),"Bin-UUID"(decode('018d5c8e567870019001000000000001', 'hex')),'javascript','2024-01-15 10:05:00'),
("Bin-UUID"(decode('018d5c8e70017001a001000000000002', 'hex')),"Bin-UUID"(decode('018d5c8e567870019001000000000001', 'hex')),'react','2024-01-15 10:06:00'),
("Bin-UUID"(decode('018d5c8e70017001a001000000000003', 'hex')),"Bin-UUID"(decode('018d5c8e567870019001000000000001', 'hex')),'node.js','2024-01-15 10:07:00'),
("Bin-UUID"(decode('018d5c8e70017001a001000000000005', 'hex')),"Bin-UUID"(decode('018d5c8e567870019001000000000001', 'hex')),'architecture','2024-01-15 10:08:00'),
("Bin-UUID"(decode('018d5c8e70017001a001000000000008', 'hex')),"Bin-UUID"(decode('018d5c8e567870019001000000000001', 'hex')),'clean code','2024-01-15 10:09:00'),
("Bin-UUID"(decode('018d5c8e70017001a002000000000001', 'hex')),"Bin-UUID"(decode('018d5c8e567870019001000000000002', 'hex')),'gestion de projet','2024-01-15 10:35:00'),
("Bin-UUID"(decode('018d5c8e70017001a002000000000002', 'hex')),"Bin-UUID"(decode('018d5c8e567870019001000000000002', 'hex')),'agile','2024-01-15 10:36:00'),
("Bin-UUID"(decode('018d5c8e70017001a003000000000001', 'hex')),"Bin-UUID"(decode('018d5c8e567870019001000000000003', 'hex')),'psychologie cognitive','2024-01-15 11:05:00'),
("Bin-UUID"(decode('018d5c8e70017001a003000000000003', 'hex')),"Bin-UUID"(decode('018d5c8e567870019001000000000003', 'hex')),'mémoire','2024-01-15 11:06:00'),
("Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')),"Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')),'ux design','2024-01-15 11:35:00'),
("Bin-UUID"(decode('018d5c8e70017001a004000000000003', 'hex')),"Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')),'figma','2024-01-15 11:36:00'),
("Bin-UUID"(decode('018d5c8e70017001a009000000000001', 'hex')),"Bin-UUID"(decode('018d5c8e567870019001000000000009', 'hex')),'architecture moderna','2024-01-15 13:36:00')
On Conflict Do Nothing;

-- 📦 STEP 3 : LES PÉPITES INCLUANT L'EXHAUSTIVITÉ DE LUCAS ET ALICE (Table: Items)
INSERT INTO "Items" ("itCreatedAt", "itUpdatedAt", "itIdItem", "itUserId", "itContentTypeId", "itTitle", "itSlug", "itSourceAuthor", "itThumbnailUrl", "itMetadata", "itContent") VALUES
('2024-01-15 10:15:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b001000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000001', 'hex')), 'ARTI', 'Les principes SOLID en JavaScript','les-principes-solid-en-javascript','Robert C. Martin','https://unsplash.com','{"reading_time":"8 min","difficulty":"intermediate","language":"fr","source_url":"https://cleancoder.com"}'::jsonb,'S:Responsabilité unique. O:Ouvert/Fermé. L:Substitution de Liskov. I:Séparation des interfaces. D:Inversion des dépendances.'),
('2024-01-15 10:20:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b001000000000002', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000001', 'hex')), 'ARTI', 'React Server Components','react-server-components','Dan Abramov','https://unsplash.com','{"reading_time":"12 min","difficulty":"advanced","language":"en","source_url":"https://react.dev"}'::jsonb,'Les RSC s''exécutent uniquement sur le serveur. Ils réduisent la taille du bundle JavaScript envoyé au client.'),
('2024-01-15 10:40:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b002000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000002', 'hex')), 'BOOK', 'Le Guide du Scrum Officiel 2024','le-guide-du-scrum-officiel-2024','Ken Schwaber','https://unsplash.com','{"isbn":"978-1234567890","pages":16}'::jsonb,'Scrum est un cadre de travail léger qui aide les personnes, les équipes et les organisations à générer de la valeur.'),
('2024-01-15 11:10:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b003000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000003', 'hex')), 'BOOK', 'Thinking, Fast and Slow - Daniel Kahneman','thinking-fast-and-slow-daniel-kahneman','Daniel Kahneman','https://unsplash.com','{"isbn":"978-0374533557","pages":499}'::jsonb,'Système 1:rapide, automatique. Système 2:lent, réfléchi. L''aversion aux pertes est plus forte que l''attrait du gain.'),
('2024-01-15 11:35:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'ARTI', 'Introduction à l Atomic Design','introduction-a-l-atomic-design','Brad Frost','https://unsplash.com','{"reading_time":"10 min"}'::jsonb,'L''Atomic Design est une méthodologie qui permet de créer des systèmes de conception de manière hiérarchique.'),
('2024-01-15 11:40:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000002', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'VIDE', 'Figma:Auto Layout et Variants avancés','figma-auto-layout-et-variants-avances','Figma Official','https://unsplash.com','{"duration":"18:25"}'::jsonb,'Auto Layout = flexbox dans Figma. Permet le responsive automatique. Combiner pour des composants robustes.'),
('2024-01-15 11:45:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000003', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'BOOK', 'Don t Make Me Think - Steve Krug','don-t-make-me-think-steve-krug','Steve Krug','https://unsplash.com','{"isbn":"978-0321965516"}'::jsonb,'La première loi de l''utilisabilité est: ne me faites pas réfléchir. Les utilisateurs ne lisent pas, ils scannent.'),
('2024-01-15 11:50:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000004', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'NOTE', 'Règles d accessibilité WCAG cruciales','regles-d-accessibilite-wcag-cruciales','N.C',NULL,'{"critical":true}'::jsonb,'Checklist WCAG 2.2: Contraste de texte minimum 4.5:1, navigation au clavier fonctionnelle, alt sur images.'),
('2024-01-15 11:55:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000005', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'VIDE', 'Déployer un Design System en production','deployer-un-design-system-en-production','Framer Master','https://unsplash.com','{"duration":"25:30"}'::jsonb,'Comment traduire des composants Figma en composants réutilisables via Tokens et bibliothèques partagées.'),
('2024-01-15 12:00:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000006', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'NOTE', 'Ma checklist UX d audit rapide','ma-checklist-ux-d-audit-rapide','N.C',NULL,'{"time_needed":"30 min"}'::jsonb,'Vérifier la clarté de la proposition de valeur, tester le tunnel mobile (3 clics max), messages d''erreur clairs.'),
('2024-01-15 12:05:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000007', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'ARTI', 'Loi de Fitts:Ergonomie des interfaces','loi-de-fitts-ergonomie-des-interfaces','Paul Fitts','https://unsplash.com','{"reading_time":"6 min"}'::jsonb,'Le temps nécessaire pour atteindre une cible est fonction de la distance à la cible et de sa taille.')
('2024-01-15 11:35:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'ARTI', 'Introduction à l Atomic Design', 'introduction-a-l-atomic-design', 'Brad Frost', 'https://unsplash.com', '{"reading_time":"10 min"}'::jsonb, 'L''Atomic Design est une méthodologie qui permet de créer des systèmes de conception de manière hiérarchique.'),
('2024-01-15 11:40:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000002', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'VIDE', 'Figma : Auto Layout et Variants', 'figma-auto-layout-et-variants-avances', 'Figma Official', 'https://unsplash.com', '{"duration":"18:25"}'::jsonb, 'Auto Layout = flexbox dans Figma. Permet le responsive automatique. Combiner les deux pour des composants robustes.'),
('2024-01-15 11:45:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000003', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'BOOK', 'Don''t Make Me Think', 'don-t-make-me-think-steve-krug', 'Steve Krug', 'https://unsplash.com', '{"pages":216}'::jsonb, 'La première loi de l''utilisabilité est : ne me faites pas réfléchir. Un site web doit être évident et clair.'),
('2024-01-15 11:50:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000004', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'NOTE', 'Règles d accessibilité WCAG', 'regles-d-accessibilite-wcag-cruciales', 'N.C', NULL, '{"critical":true}'::jsonb, 'Checklist WCAG 2.2 : 1) Contraste minimum 4.5:1. 2) Navigation clavier. 3) Balises alt. 4) Focus visuel.'),
('2024-01-15 11:55:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000005', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'VIDE', 'Déployer un Design System', 'deployer-un-design-system-en-production', 'Framer Master', 'https://unsplash.com', '{"duration":"25:30"}'::jsonb, 'Comment traduire des composants Figma en composants réutilisables via Tokens et bibliothèques partagées.'),
('2024-01-15 12:00:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000006', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'NOTE', 'Checklist UX audit rapide', 'ma-checklist-ux-d-audit-rapide', 'N.C', NULL, '{"items":12}'::jsonb, 'Proposition de valeur claire, tester le tunnel mobile (3 clics max), messages d''erreur de formulaires nets.'),
('2024-01-15 12:05:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000007', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'ARTI', 'Loi de Fitts', 'loi-de-fitts-ergonomie-des-interfaces', 'Paul Fitts', 'https://unsplash.com', '{"reading_time":"6 min"}'::jsonb, 'Le temps pour atteindre une cible est fonction de la distance et de sa taille. Gros boutons d''action requis.'),
('2024-01-15 12:10:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b004000000000008', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000004', 'hex')), 'VIDE', 'Prototypage avec Framer', 'prototypage-ultra-rapide-avec-framer', 'Design Tech', 'https://unsplash.com', '{"duration":"14:20"}'::jsonb, 'Passer de Figma à des prototypes haute fidélité animés dans Framer en quelques minutes pour tests utilisateurs.'),
('2024-01-15 12:15:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b005000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000005', 'hex')), 'ARTI', 'Growth Hacking framework', 'le-secret-du-growth-hacking-en-2026', 'Andrew Chen', 'https://unsplash.com', '{"reading_time":"9 min"}'::jsonb, 'Le framework AARRR : Acquisition, Activation, Rétention, Recommandation, Revenu. La rétention est essentielle.'),
('2024-01-15 12:45:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b006000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000006', 'hex')), 'BOOK', 'Discours de la méthode', 'discours-de-la-methode-rene-descartes', 'René Descartes', 'https://unsplash.com', '{"pages":160}'::jsonb, 'Le bon sens est la chose la mieux partagée. Diviser les difficultés. Conduire par ordre mes pensées.'),
('2024-01-15 13:15:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b007000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000007', 'hex')), 'ARTI', 'IA générative et médias', 'l-impact-de-l-ia-generative-sur-les-medias', 'Julie Tech Press', 'https://unsplash.com', '{"reading_time":"11 min"}'::jsonb, 'L IA transforme la production. Risques de désinformation. Focus sur l investigation de terrain et les faits.'),
('2024-01-15 13:45:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b008000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000008', 'hex')), 'VIDE', 'Cuisson basse température', 'maitriser-la-cuisson-basse-temperature', 'Chef Thomas Channel', 'https://unsplash.com', '{"duration":"15:45"}'::jsonb, 'La cuisson basse température préserve l eau de constitution. Maintenir à 54°C à cœur pendant 2 heures.'),
('2024-01-15 13:40:00', NULL, "Bin-UUID"(decode('018d5c8e80017001b009000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000009', 'hex')), 'BOOK', 'Vers une architecture', 'vers-une-architecture-le-corbusier', 'Le Corbusier', 'https://unsplash.com', '{"pages":256}'::jsonb, 'L architecture est le jeu savant, correct et magnifique des volumes assemblés sous la lumière. Plan libre.')
ON CONFLICT DO NOTHING;

-- 🔗 STEP 4 : TOUTES LES LIAISONS MANQUANTES UNIFIÉES (Table: ItemTags)
INSERT INTO "ItemTags" ("tiItemId", "tiTagId", "tiCreatedAt") VALUES
("Bin-UUID"(decode('018d5c8e80017001b001000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000001', 'hex')), '2024-01-15 10:16:00'),
("Bin-UUID"(decode('018d5c8e80017001b001000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000008', 'hex')), '2024-01-15 10:16:10'),
("Bin-UUID"(decode('018d5c8e80017001b001000000000002', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000002', 'hex')), '2024-01-15 10:21:00'),
("Bin-UUID"(decode('018d5c8e80017001b001000000000002', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000001', 'hex')), '2024-01-15 10:21:15'),
("Bin-UUID"(decode('018d5c8e80017001b002000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a002000000000002', 'hex')), '2024-01-15 10:41:00'),
("Bin-UUID"(decode('018d5c8e80017001b003000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a003000000000001', 'hex')), '2024-01-15 11:11:00'),
("Bin-UUID"(decode('018d5c8e80017001b004000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 11:36:00'),
("Bin-UUID"(decode('018d5c8e80017001b004000000000002', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000003', 'hex')), '2024-01-15 11:41:00'),
("Bin-UUID"(decode('018d5c8e80017001b004000000000002', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 11:41:30'),
("Bin-UUID"(decode('018d5c8e80017001b004000000000003', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 11:46:00'),
("Bin-UUID"(decode('018d5c8e80017001b004000000000004', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 11:51:00'),
("Bin-UUID"(decode('018d5c8e80017001b004000000000005', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 11:56:00'),
("Bin-UUID"(decode('018d5c8e80017001b004000000000005', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000003', 'hex')), '2024-01-15 11:56:40'),
("Bin-UUID"(decode('018d5c8e80017001b004000000000006', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 12:01:00'),
("Bin-UUID"(decode('018d5c8e80017001b004000000000007', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 12:06:00'),
("Bin-UUID"(decode('018d5c8e80017001b004000000000008', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000003', 'hex')), '2024-01-15 12:11:00'),
("Bin-UUID"(decode('018d5c8e80017001b004000000000008', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 12:11:20'),
("Bin-UUID"(decode('018d5c8e80017001b005000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000001', 'hex')), '2024-01-15 12:16:00'),
("Bin-UUID"(decode('018d5c8e80017001b006000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000005', 'hex')), '2024-01-15 12:46:00'),
("Bin-UUID"(decode('018d5c8e80017001b007000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000008', 'hex')), '2024-01-15 13:16:00'),
("Bin-UUID"(decode('018d5c8e80017001b008000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000003', 'hex')), '2024-01-15 13:46:00'),
("Bin-UUID"(decode('018d5c8e80017001b009000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a009000000000001', 'hex')), '2024-01-15 13:41:00')
ON CONFLICT DO NOTHING;

-- 🔗 STEP 5 : LES PASSERELLES DE PARTAGE (Table: Shares) (Rule 1 & 2)
Insert Into "Shares" ( "shIdShare", "shItemId", "shItemOwnerId", "shCreatedAt", "shUpdatedAt", "shCourrielDest", "shJeton", "shConfiguration" ) Values
('2024-01-15 10:50:00', Null, "Bin-UUID"(decode('018d5c8e90017001c001000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e80017001b001000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000001', 'hex')), 'marc.dubois@entreprise.fr', 'tok_share_sophie_marc_001', '{"level": "read", "allow_download": false, "expiration": null}'::Jsonb),
('2024-01-15 10:55:00', Null, "Bin-UUID"(decode('018d5c8e90017001c002000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e80017001b002000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000002', 'hex')), 'sophie.laurent@tech.io'   , 'tok_share_marc_sophie_001', '{"level": "read", "allow_download": true, "expiration": null}'::Jsonb)
on Conflict Do Nothing;

-- 🚨 STEP 6 : JOURNAL D'AUDIT IMMEUBLE APPEND-ONLY (Table: Events)
Insert Into "Events" ("aeIdEvent", "aeUserId", "aeCreatedAt", "aeCategoryId", "aeSeverityId", "aeContextId", "aeActionId", "aeMessage", "aeMetadata") Values
("Bin-UUID"(decode('018d5c8ea0017001d002000000000001', 'hex')), Null, '2024-01-15 09:10:04', 'MONI', 'INFO', 'SYST', 'DEMA', 'Application Memoria démarrée avec succès', '{"version":"1.0.0"}'::jsonb),
("Bin-UUID"(decode('018d5c8ea0017001d002000000000003', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000001', 'hex')), '2024-01-15 10:00:01', 'ANAL', 'INFO', 'UTIL', 'ENRE', 'Nouvel utilisateur enregistré', '{"ip":"192.168.1.15"}'::jsonb),
("Bin-UUID"(decode('018d5c8ea0017001d002000000000010', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000003', 'hex')), '2024-01-15 11:02:00', 'AUDI', 'WARN', 'AUTH', 'ECHE', 'Tentative de connexion échouée', '{"retry_count":1}'::jsonb),
("Bin-UUID"(decode('018d5c8ea0017001d002000000000020', 'hex')), "Bin-UUID"(decode('018d5c8e567870019001000000000005', 'hex')), '2024-01-15 12:05:00', 'GDPR', 'INFO', 'RGPD', 'EXPO', 'Exportation complète demandée', '{"format":"json"}'::jsonb),
("Bin-UUID"(decode('018d5c8ea0017001d002000000000099', 'hex')), Null, '2024-01-15 13:45:12', 'MONI', 'WARN', 'BASE', 'LENT', 'Requête SQL lente détectée sur la table items', '{"duration_ms":1250}'::jsonb)
On Conflict Do Nothing;

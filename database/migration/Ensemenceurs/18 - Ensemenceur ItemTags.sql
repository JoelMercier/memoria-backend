-- ============================================================================
-- 🔗 Mémoria - Ensemenceur Relations Pépite / Marque
-- Fichier: database\Refonte\18 - Ensemenceur ItemTags.sql
-- Version: 4.6.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Injection exclusive des pivots d''association dédoublonnés
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- Contexte: Alignement UUID natif pur et éradication de l''anglais volant
-- ============================================================================

Set search_path To Public;
Set client_encoding To 'UTF8';

-- ----------------------------------------------------------------------------
-- 🔗 1. Injection des données de la table pivot ItemTags (Many-to-Many)
-- ----------------------------------------------------------------------------
Insert Into "ItemTags" (
    "tiItemId",
    "tiTagId",
    "tiCreatedAt"
) Values
-- Liaisons de Sophie (Pépite SOLID -> javascript & clean code)
('018d5c8e-8001-7001-b001-000000000001'::uuid, '018d5c8e-7001-7001-a001-000000000001'::uuid, '2024-01-15 10:16:00'),
('018d5c8e-8001-7001-b001-000000000001'::uuid, '018d5c8e-7001-7001-a001-000000000008'::uuid, '2024-01-15 10:16:10'),

-- Liaisons de Sophie (Pépite React RSC -> react & javascript)
('018d5c8e-8001-7001-b001-000000000002'::uuid, '018d5c8e-7001-7001-a002-000000000002'::uuid, '2024-01-15 10:21:00'),
('018d5c8e-8001-7001-b001-000000000002'::uuid, '018d5c8e-7001-7001-a001-000000000001'::uuid, '2024-01-15 10:21:15'),

-- Liaisons de Marc (Pépite Guide Scrum -> agile)
('018d5c8e-8001-7001-b002-000000000001'::uuid, '018d5c8e-7001-7001-a002-000000000002'::uuid, '2024-01-15 10:41:00'),

-- Liaisons d Emma (Pépite Daniel Kahneman -> psychologie)
('018d5c8e-8001-7001-b003-000000000001'::uuid, '018d5c8e-7001-7001-a003-000000000001'::uuid, '2024-01-15 11:11:00'),

-- Liaisons de Lucas (Pépite 1 : Atomic Design -> ux design)
('018d5c8e-8001-7001-b004-000000000001'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 11:36:00'),

-- Liaisons de Lucas (Pépite 2 : Figma AutoLayout -> figma & ux design)
('018d5c8e-8001-7001-b004-000000000002'::uuid, '018d5c8e-7001-7001-a004-000000000003'::uuid, '2024-01-15 11:41:00'),
('018d5c8e-8001-7001-b004-000000000002'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 11:41:30'),

-- Liaisons de Lucas (Pépite 3 : Don t Make Me Think -> ux design)
('018d5c8e-8001-7001-b004-000000000003'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 11:46:00'),

-- Liaisons de Lucas (Pépite 4 : WCAG Accessibilité -> ux design)
('018d5c8e-8001-7001-b004-000000000004'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 11:51:00'),

-- Liaisons de Lucas (Pépite 5 : Design System -> ux design & figma)
('018d5c8e-8001-7001-b004-000000000005'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 11:56:00'),
('018d5c8e-8001-7001-b004-000000000005'::uuid, '018d5c8e-7001-7001-a004-000000000003'::uuid, '2024-01-15 11:56:40'),

-- Liaisons de Lucas (Pépite 6 : Checklist UX -> ux design)
('018d5c8e-8001-7001-b004-000000000006'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 12:01:00'),

-- Liaisons de Lucas (Pépite 7 : Loi de Fitts -> ux design)
('018d5c8e-8001-7001-b004-000000000007'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 12:06:00'),

-- Liaisons de Lucas (Pépite 8 : Framer Animation -> figma & ux design)
('018d5c8e-8001-7001-b004-000000000008'::uuid, '018d5c8e-7001-7001-a004-000000000003'::uuid, '2024-01-15 12:11:00'),
('018d5c8e-8001-7001-b004-000000000008'::uuid, '018d5c8e-7001-7001-a004-000000000001'::uuid, '2024-01-15 12:11:20'),

-- Liaisons pour les pépites reconstituées (Alice, Paul, Julie, Thomas, Camille)
('018d5c8e-8001-7001-b005-000000000001'::uuid, '018d5c8e-7001-7001-a001-000000000001'::uuid, '2024-01-15 12:16:00'), -- Growth Hacking -> javascript
('018d5c8e-8001-7001-b006-000000000001'::uuid, '018d5c8e-7001-7001-a001-000000000005'::uuid, '2024-01-15 12:46:00'), -- Descartes -> architecture
('018d5c8e-8001-7001-b007-000000000001'::uuid, '018d5c8e-7001-7001-a001-000000000008'::uuid, '2024-01-15 13:16:00'), -- IA Médias -> clean code
('018d5c8e-8001-7001-b008-000000000001'::uuid, '018d5c8e-7001-7001-a001-000000000003'::uuid, '2024-01-15 13:46:00'), -- Cuisson Basse Temp -> node.js
('018d5c8e-8001-7001-b009-000000000001'::uuid, '018d5c8e-7001-7001-a009-000000000001'::uuid, '2024-01-15 13:41:00')  -- Le Corbusier -> architecture
On Conflict Do Nothing;

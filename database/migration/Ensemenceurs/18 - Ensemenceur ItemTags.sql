-- ============================================================================
-- 🔗 Mémoria - Ensemenceur Relations Pépite / Marque
-- Fichier: database\Refonte\18 - Ensemenceur ItemTags.sql
-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Injection exclusive des pivots
-- ============================================================================

Set search_path To Public;
Set client_encoding To 'UTF8';

-- ----------------------------------------------------------------------------
-- 🔗 1. Injection des données de la table pivot ItemTags (Many-to-Many)
-- ----------------------------------------------------------------------------
Insert Into "ItemTags" ("tiItemId", "tiTagId", "tiCreatedAt") Values
-- Liaisons de Sophie (Pépite SOLID -> javascript & clean code)
("Bin-UUID"(decode('018d5c8e80017001b001000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000001', 'hex')), '2024-01-15 10:16:00'),
("Bin-UUID"(decode('018d5c8e80017001b001000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000008', 'hex')), '2024-01-15 10:16:10'),

-- Liaisons de Sophie (Pépite React RSC -> react & javascript)
("Bin-UUID"(decode('018d5c8e80017001b001000000000002', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000002', 'hex')), '2024-01-15 10:21:00'),
("Bin-UUID"(decode('018d5c8e80017001b001000000000002', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000001', 'hex')), '2024-01-15 10:21:15'),

-- Liaisons de Marc (Pépite Guide Scrum -> agile)
("Bin-UUID"(decode('018d5c8e80017001b002000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a002000000000002', 'hex')), '2024-01-15 10:41:00'),

-- Liaisons d Emma (Pépite Daniel Kahneman -> psychologie cognitive)
("Bin-UUID"(decode('018d5c8e80017001b003000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a003000000000001', 'hex')), '2024-01-15 11:11:00'),

-- Liaisons de Lucas (Pépite 1 : Atomic Design -> ux design)
("Bin-UUID"(decode('018d5c8e80017001b004000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 11:36:00'),

-- Liaisons de Lucas (Pépite 2 : Figma AutoLayout -> figma & ux design)
("Bin-UUID"(decode('018d5c8e80017001b004000000000002', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000003', 'hex')), '2024-01-15 11:41:00'),
("Bin-UUID"(decode('018d5c8e80017001b004000000000002', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 11:41:30'),

-- Liaisons de Lucas (Pépite 3 : Don t Make Me Think -> ux design)
("Bin-UUID"(decode('018d5c8e80017001b004000000000003', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 11:46:00'),

-- Liaisons de Lucas (Pépite 4 : WCAG Accessibilité -> ux design)
("Bin-UUID"(decode('018d5c8e80017001b004000000000004', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 11:51:00'),

-- Liaisons de Lucas (Pépite 5 : Design System -> ux design & figma)
("Bin-UUID"(decode('018d5c8e80017001b004000000000005', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 11:56:00'),
("Bin-UUID"(decode('018d5c8e80017001b004000000000005', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000003', 'hex')), '2024-01-15 11:56:40'),

-- Liaisons de Lucas (Pépite 6 : Checklist UX -> ux design)
("Bin-UUID"(decode('018d5c8e80017001b004000000000006', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 12:01:00'),

-- Liaisons de Lucas (Pépite 7 : Loi de Fitts -> ux design)
("Bin-UUID"(decode('018d5c8e80017001b004000000000007', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 12:06:00'),

-- Liaisons de Lucas (Pépite 8 : Framer Animation -> figma & ux design)
("Bin-UUID"(decode('018d5c8e80017001b004000000000008', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000003', 'hex')), '2024-01-15 12:11:00'),
("Bin-UUID"(decode('018d5c8e80017001b004000000000008', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a004000000000001', 'hex')), '2024-01-15 12:11:20'),

-- Liaisons pour les pépites reconstituées (Alice, Paul, Julie, Thomas, Camille)
("Bin-UUID"(decode('018d5c8e80017001b005000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000001', 'hex')), '2024-01-15 12:16:00'), -- Growth Hacking -> javascript
("Bin-UUID"(decode('018d5c8e80017001b006000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000005', 'hex')), '2024-01-15 12:46:00'), -- Descartes -> architecture
("Bin-UUID"(decode('018d5c8e80017001b007000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000008', 'hex')), '2024-01-15 13:16:00'), -- IA Médias -> clean code
("Bin-UUID"(decode('018d5c8e80017001b008000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a001000000000003', 'hex')), '2024-01-15 13:46:00'), -- Cuisson Basse Temp -> node.js
("Bin-UUID"(decode('018d5c8e80017001b009000000000001', 'hex')), "Bin-UUID"(decode('018d5c8e70017001a009000000000001', 'hex')), '2024-01-15 13:41:00')  -- Le Corbusier -> architecture moderna
On Conflict Do Nothing;

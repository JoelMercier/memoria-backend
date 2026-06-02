-- ============================================================================
-- 🏷️ Mémoria - 02 - EnsemenceurTagsOfficiels.sql
-- Fichier: database/seeders/02 - EnsemenceurTagsOfficiels.sql
-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Injection exclusive des étiquettes officielles dédoublonnées
-- ============================================================================

Set search_path To Public;
Set client_encoding To 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏷️ 1. Injection des données de la table Tags (Zéro alias - Liaison Acteurs)
-- ----------------------------------------------------------------------------
Insert Into "Tags" ("tgIdTag", "tgUserId", "tgCreatedAt", "tgUpdatedAt", "tgName") Values
-- Étiquettes de Sophie (Développeuse - ...0001)
(decode('018d5c8e70017001a001000000000001', 'hex'), decode('018d5c8e567870019001000000000001', 'hex'), '2024-01-15 10:05:00', Null, 'javascript'),
(decode('018d5c8e70017001a001000000000002', 'hex'), decode('018d5c8e567870019001000000000001', 'hex'), '2024-01-15 10:06:00', Null, 'react'),
(decode('018d5c8e70017001a001000000000003', 'hex'), decode('018d5c8e567870019001000000000001', 'hex'), '2024-01-15 10:07:00', Null, 'node.js'),
(decode('018d5c8e70017001a001000000000005', 'hex'), decode('018d5c8e567870019001000000000001', 'hex'), '2024-01-15 10:08:00', Null, 'architecture'),
(decode('018d5c8e70017001a001000000000008', 'hex'), decode('018d5c8e567870019001000000000001', 'hex'), '2024-01-15 10:09:00', Null, 'clean code'),

-- Étiquettes de Marc (Chef de projet - ...0002)
(decode('018d5c8e70017001a002000000000001', 'hex'), decode('018d5c8e567870019001000000000002', 'hex'), '2024-01-15 10:35:00', Null, 'gestion de projet'),
(decode('018d5c8e70017001a002000000000002', 'hex'), decode('018d5c8e567870019001000000000002', 'hex'), '2024-01-15 10:36:00', Null, 'agile'),

-- Étiquettes d Emma (Psychologie - ...0003)
(decode('018d5c8e70017001a003000000000001', 'hex'), decode('018d5c8e567870019001000000000003', 'hex'), '2024-01-15 11:05:00', Null, 'psychologie cognitive'),
(decode('018d5c8e70017001a003000000000003', 'hex'), decode('018d5c8e567870019001000000000003', 'hex'), '2024-01-15 11:06:00', Null, 'mémoire'),

-- Étiquettes de Lucas (UX/UI Designer - ...0004)
(decode('018d5c8e70017001a004000000000001', 'hex'), decode('018d5c8e567870019001000000000004', 'hex'), '2024-01-15 11:35:00', Null, 'ux design'),
(decode('018d5c8e70017001a004000000000003', 'hex'), decode('018d5c8e567870019001000000000004', 'hex'), '2024-01-15 11:36:00', Null, 'figma'),

-- Étiquette de Camille (Architecte - ...0009)
(decode('018d5c8e70017001a009000000000001', 'hex'), decode('018d5c8e567870019001000000000009', 'hex'), '2024-01-15 13:36:00', Null, 'architecture moderna')
On Conflict Do Nothing;

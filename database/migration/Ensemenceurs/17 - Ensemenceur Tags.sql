-- ============================================================================
-- 🏷️ Mémoria - Ensemenceur Tags
-- Fichier: database/refonte/17 - Ensemenceur Tags.sql
-- Version: 4.6.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Injection exclusive des étiquettes officielles dédoublonnées
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- Contexte: Alignement UUID natif pur et éradication de l''anglais volant
-- ============================================================================

Set search_path To Public;
Set client_encoding To 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏷️ 1. Injection des données de la table Tags (Liaison Acteurs)
-- ----------------------------------------------------------------------------
Insert Into "Tags" (
    "tgIdTag",
    "tgUserId",
    "tgCreatedAt",
    "tgUpdatedAt",
    "tgLibelle"
) Values
-- Étiquettes de Sophie (Développeuse - ...0001)
('018d5c8e-7001-7001-a001-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000001'::uuid, '2024-01-15 10:05:00', Null, 'javascript'        ),
('018d5c8e-7001-7001-a001-000000000002'::uuid, '018d5c8e-5678-7001-9001-000000000001'::uuid, '2024-01-15 10:06:00', Null, 'react'             ),
('018d5c8e-7001-7001-a001-000000000003'::uuid, '018d5c8e-5678-7001-9001-000000000001'::uuid, '2024-01-15 10:07:00', Null, 'node.js'           ),
('018d5c8e-7001-7001-a001-000000000005'::uuid, '018d5c8e-5678-7001-9001-000000000001'::uuid, '2024-01-15 10:08:00', Null, 'architecture'     ),
('018d5c8e-7001-7001-a001-000000000008'::uuid, '018d5c8e-5678-7001-9001-000000000001'::uuid, '2024-01-15 10:09:00', Null, 'clean code'        ),

-- Étiquettes de Marc (Chef de projet - ...0002)
('018d5c8e-7001-7001-a002-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000002'::uuid, '2024-01-15 10:35:00', Null, 'gestion de projet'),
('018d5c8e-7001-7001-a002-000000000002'::uuid, '018d5c8e-5678-7001-9001-000000000002'::uuid, '2024-01-15 10:36:00', Null, 'agile'             ),

-- Étiquettes d'Emma (Psychologie - ...0003)
('018d5c8e-7001-7001-a003-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000003'::uuid, '2024-01-15 11:05:00', Null, 'psychologie'       ), -- Purification nominale
('018d5c8e-7001-7001-a003-000000000003'::uuid, '018d5c8e-5678-7001-9001-000000000003'::uuid, '2024-01-15 11:06:00', Null, 'mémoire'           ),

-- Étiquettes de Lucas (UX/UI Designer - ...0004)
('018d5c8e-7001-7001-a004-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000004'::uuid, '2024-01-15 11:35:00', Null, 'ux design'         ),
('018d5c8e-7001-7001-a004-000000000003'::uuid, '018d5c8e-5678-7001-9001-000000000004'::uuid, '2024-01-15 11:36:00', Null, 'figma'             ),

-- Étiquette de Camille (Architecte - ...0009)
('018d5c8e-7001-7001-a009-000000000001'::uuid, '018d5c8e-5678-7001-9001-000000000009'::uuid, '2024-01-15 13:36:00', Null, 'architecture'      )  -- Correction orthographique française complète

On Conflict Do Nothing;

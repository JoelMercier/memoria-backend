-- ============================================================================
-- 🔗 Mémoria - Ensemenceur Partages (Édition Finale Rectifiée)
-- Fichier: database\Refonte\19 - Ensemenceur Partages.sql
-- Version: 4.6.2 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Injection des partages - Alignement DateExpiration V4 Pro
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- Contexte: Éradication définitive des nulls dans le dictionnaire shAccesConfig
-- ============================================================================

Set search_path To Public;
Set client_encoding To 'UTF8';

-- ----------------------------------------------------------------------------
-- 🔗 2. Injection des données de la table Shares (Zéro padding - Casse d'acier)
-- ----------------------------------------------------------------------------
Insert Into "Shares" (
    "shIdShare",
    "shItemId",
    "shItemOwnerId",
    "shCreatedAt",
    "shUpdatedAt",
    "shCourrielDest",
    "shAccesJeton",
    "shAccesConfig"
) Values
-- Partage 1 : Sophie vers Marc (Sur la pépite SOLID)
(
    '018d5c8e-9001-7001-c001-000000000001'::uuid,                       -- ID unique du partage au format UUID natif.
    '018d5c8e-8001-7001-b001-000000000001'::uuid,                       -- Référence itIdItem de la pépite.
    '018d5c8e-5678-7001-9001-000000000001'::uuid,                       -- ID de SophieDev (usIdUser propriétaire).
    '2024-01-15 10:50:00',
    Null,                                                               -- La tôle de révision automatique démarre à blanc.
    'marc.dubois@entreprise.fr',
    'tok_share_sophie_marc_001',                                        -- Jeton réseau aligné sur shAccesJeton.
    '{"Privilege": "LECTURE", "AutoriseTelechargement": false, "DateExpiration": "2126-12-31T23:59:59.000Z"}'::jsonb -- 🔒 Scellage 100 ans !
),

-- Partage 2 : Marc vers Sophie (Sur la pépite Scrum Guide)
(
    '018d5c8e-9001-7001-c002-000000000001'::uuid,
    '018d5c8e-8001-7001-b002-000000000001'::uuid,
    '018d5c8e-5678-7001-9001-000000000002'::uuid,                       -- ID de MarcPM (usIdUser propriétaire).
    '2024-01-15 10:55:00',
    Null,
    'sophie.laurent@tech.io',
    'tok_share_marc_sophie_001',
    '{"Privilege": "LECTURE", "AutoriseTelechargement": true, "DateExpiration": "2126-12-31T23:59:59.000Z"}'::jsonb -- 🔒 Scellage 100 ans !
)
On Conflict Do Nothing;                                                 -- Terminaison nominale de l'instruction d'insertion.

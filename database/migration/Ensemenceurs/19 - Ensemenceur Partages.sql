-- ============================================================================
-- 🔗 Mémoria - Ensemenceur Partages
-- Fichier: database\Refonte\19 - Ensemenceur Partages.sql
-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Injection des partages et passerelles d'accès
-- ============================================================================

Set search_path To Public;
Set client_encoding To 'UTF8';

-- ----------------------------------------------------------------------------
-- 🔗 2. Injection des données de la table Shares (Zéro padding - Casse d'acier)
-- ----------------------------------------------------------------------------
Insert Into "Shares" (
    -- 1. Les colosses (16 octets fixes fixed-width Bytea/UUID) (Rule 1)
    "shIdShare",
    "shItemId",
    "shItemOwnerId", -- 🗲 [ALIGNÉ OPTIMAL] Dé-normalisé pour la performance brute [Mémoria]

    -- 2. Les horodateurs (8 octets fixes fixed-width)
    "shCreatedAt",
    "shUpdatedAt",

    -- 3. Les variables et fin de tas (Varchar, Jsonb)
    "shCourrielDest",
    "shJeton",
    "shConfiguration"
) Values
-- Partage 1 : Sophie vers Marc (Sur la pépite SOLID)
(
    "Bin-UUID"(decode('018d5c8e90017001c001000000000001', 'hex')),
    "Bin-UUID"(decode('018d5c8e80017001b001000000000001', 'hex')),
    "Bin-UUID"(decode('018d5c8e567870019001000000000001', 'hex')), -- 🪓 [SCELLÉ] ID de SophieDev [Mémoria]
    '2024-01-15 10:50:00',
    Null,
    'marc.dubois@entreprise.fr',
    'tok_share_sophie_marc_001',
    '{"level": "read", "allow_download": false, "expiration": null}'::Jsonb
),

-- Partage 2 : Marc vers Sophie (Sur la pépite Scrum Guide)
(
    "Bin-UUID"(decode('018d5c8e90017001c002000000000001', 'hex')),
    "Bin-UUID"(decode('018d5c8e80017001b002000000000001', 'hex')),
    "Bin-UUID"(decode('018d5c8e567870019001000000000002', 'hex')), -- 🪓 [SCELLÉ] ID de MarcPM [Mémoria]
    '2024-01-15 10:55:00',
    Null,
    'sophie.laurent@tech.io',
    'tok_share_marc_sophie_001',
    '{"level": "read", "allow_download": true, "expiration": null}'::Jsonb
)
On Conflict Do Nothing;

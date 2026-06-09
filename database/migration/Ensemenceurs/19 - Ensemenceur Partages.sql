-- ——— fichier : database\Refonte\19 - Ensemenceur Partages.sql

-- ----------------------------------------------------------------------------
-- 🔗 2. Injection des données de la table Shares
-- ----------------------------------------------------------------------------
Insert Into "Shares" (
    "shIdShare",
    "shItemId",
    "shCreatedAt",
    "shUpdatedAt",
    "shCourrielDest",
    "shJeton",
    "shConfiguration"
) Values
-- Partage 1 : Sophie vers Marc (Sur la pépite SOLID)
(
    "Bin-UUID"(decode('018d5c8e90017001c001000000000001', 'hex')),
    "Bin-UUID"(decode('018d5c8e80017001b001000000000001', 'hex')),
    '2024-01-15 10:50:00',
    Null,
    'marc.dubois@entreprise.fr',
    'tok_share_sophie_marc_001',
    '{"level": "read", "allow_download": false, "expiration": null}'::jsonb
),

-- Partage 2 : Marc vers Sophie (Sur la pépite Scrum Guide)
(
    "Bin-UUID"(decode('018d5c8e90017001c002000000000001', 'hex')),
    "Bin-UUID"(decode('018d5c8e80017001b002000000000001', 'hex')),
    '2024-01-15 10:55:00',
    Null,
    'sophie.laurent@tech.io',
    'tok_share_marc_sophie_001',
    '{"level": "read", "allow_download": true, "expiration": null}'::jsonb
)
On Conflict Do Nothing;

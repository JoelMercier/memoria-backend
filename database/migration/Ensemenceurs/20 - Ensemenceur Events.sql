-- ============================================================================
-- 🏺 Mémoria - 20 - Ensemenceur Events.sql
-- Fichier: database\Refonte\20 - Ensemenceur Events.sql
-- Version: 4.0.1 (PostgreSQL 17+)
-- Description: Alignement binaire parfait des données de test - Jojo-Style
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🚨 3. Injection des données de la table Events (Journal d'audit Append-Only)
-- ----------------------------------------------------------------------------
Insert Into "Events" (
    "aeIdEvent",
    "aeUserId",
    "aeCreatedAt",
    "aeCategoryId",
    "aeSeverityId",
    "aeContextId",
    "aeActionId",
    "aeMessage",
    "aeMetadata"
) Values
-- Log 1 : Démarrage du système (aeUserId = NULL)
(
    "Bin-UUID"(decode('018d5c8ea0017001d002000000000001', 'hex')),
    Null,
    '2024-01-15 09:10:04',
    'MONI',
    'INFO',
    'SYST', -- Context: Système
    'DEMA', -- Action: Démarrage
    'Application Mémoria démarrée avec succès',
    '{"version": "1.0.0", "environment": "production"}'::jsonb
),

-- Log 2 : Inscription de Sophie
(
    "Bin-UUID"(decode('018d5c8ea0017001d002000000000003', 'hex')),
    "Bin-UUID"(decode('018d5c8e567870019001000000000001', 'hex')),
    '2024-01-15 10:00:01',
    'ANAL',
    'INFO',
    'UTIL', -- Context: Utilisateur
    'ENRE', -- Action: Enregistrement
    'Nouvel utilisateur enregistré via interface locale',
    '{"method": "local", "ip": "192.168.1.15"}'::jsonb
),

-- Log 3 : Alerte sécurité Emma
(
    "Bin-UUID"(decode('018d5c8ea0017001d002000000000010', 'hex')),
    "Bin-UUID"(decode('018d5c8e567870019001000000000003', 'hex')),
    '2024-01-15 11:02:00',
    'AUDI',
    'WARN',
    'AUTH', -- Context: Authentification
    'ECHE', -- Action: Échec
    'Tentative de connexion avec mauvais mot de passe',
    '{"user_agent": "Mozilla/5.0 Chrome/120.0", "retry_count": 1}'::jsonb
),

-- Log 4 : Requête RGPD d'Alice
(
    "Bin-UUID"(decode('018d5c8ea0017001d002000000000020', 'hex')),
    "Bin-UUID"(decode('018d5c8e567870019001000000000005', 'hex')),
    '2024-01-15 12:05:00',
    'RGPD',
    'INFO',
    'RGPD', -- Context: RGPD
    'EXPO', -- Action: Exportation
    'Exportation complète des données utilisateur demandée',
    '{"format": "json", "request_origin": "web_dashboard"}'::jsonb
),

-- Log 5 : Alerte performance base de données
(
    "Bin-UUID"(decode('018d5c8ea0017001d002000000000099', 'hex')),
    Null,
    '2024-01-15 13:45:12',
    'MONI',
    'WARN',
    'BASE', -- Context: Base de données
    'LENT', -- Action: Requête lente
    'Requête SQL lente détectée sur la table items',
    '{"duration_ms": 1250, "query": "SELECT * FROM items WHERE content @@ ...", "optimisation_needed": true}'::jsonb
)
On Conflict do Nothing;

-- ============================================================================
-- 🚨 Mémoria - Ensemenceur Events (Édition Finale du Soir)
-- Fichier: database\Refonte\20 - Ensemenceur Events.sql
-- Version: 4.6.1 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Alignement binaire parfait des données de test - Jojo-Style
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- Contexte: Alignement UUID natif pur et raccordement des 7 clés Rule 3
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
    "aeCategorieId",                                           -- Clé étrangère alignée Rule 3.
    "aeSeveriteId",                                            -- Clé étrangère alignée Rule 3.
    "aeSecteurId",                                             -- Remplacement de aeContextId par le secteur sc.
    "aeActionId",
    "aeMessage",
    "aeMetadata"
) Values
-- Log 1 : Démarrage du système (aeUserId = NULL)
(
    '018d5c8e-a001-7001-d002-000000000001'::uuid,               -- ID unique de la trace au format UUID natif.
    Null,                                                       -- Pas d'acteur responsable (Action Système globale).
    '2024-01-15 09:10:04',
    'MONI',                                                     -- Catégorie : Monitoring et performances.
    'INFO',                                                     -- Sévérité  : Informationnel (Balisage de repli).
    'SYST',                                                     -- Secteur   : Système global (sc).
    'DEMA',                                                     -- Action    : Démarrage.
    'Application Mémoria démarrée avec succès',
    '{"version": "1.0.0", "environment": "production"}'::jsonb
),

-- Log 2 : Inscription de Sophie
(
    '018d5c8e-a001-7001-d002-000000000003'::uuid,
    '018d5c8e-5678-7001-9001-000000000001'::uuid,               -- ID de SophieDev (usIdUser propriétaire).
    '2024-01-15 10:00:01',
    'ANAL',                                                     -- Catégorie : Analyses d'utilisation.
    'INFO',
    'UTIL',                                                     -- Secteur   : Utilisateur (sc).
    'ENRE',                                                     -- Action    : Enregistrement.
    'Nouvel utilisateur enregistré via interface locale',
    '{"method": "local", "ip": "192.168.1.15"}'::jsonb
),

-- Log 3 : Alerte sécurité Emma
(
    '018d5c8e-a001-7001-d002-000000000010'::uuid,
    '018d5c8e-5678-7001-9001-000000000003'::uuid,               -- ID de EmmaPsy.
    '2024-01-15 11:02:00',
    'SECU',                                                     -- Catégorie : Sécurité (Purifié du vieux code AUDI).
    'WARN',                                                     -- Sévérité  : Avertissement.
    'AUTH',                                                     -- Secteur   : Authentification.
    'ECHE',                                                     -- Action    : Échec.
    'Tentative de connexion avec mauvais mot de passe',
    '{"user_agent": "Mozilla/5.0 Chrome/120.0", "retry_count": 1}'::jsonb
),

-- Log 4 : Requête RGPD d'Alice
(
    '018d5c8e-a001-7001-d002-000000000020'::uuid,
    '018d5c8e-5678-7001-9001-000000000005'::uuid,               -- ID de AliceCEO.
    '2024-01-15 12:05:00',
    'RGPD',                                                     -- Catégorie : Protection des données.
    'INFO',
    'RGPD',                                                     -- Secteur   : RGPD.
    'EXPO',                                                     -- Action    : Exportation.
    'Exportation complète des données utilisateur demandée',
    '{"format": "json", "request_origin": "web_dashboard"}'::jsonb
),

-- Log 5 : Alerte performance base de données
(
    '018d5c8e-a001-7001-d002-000000000099'::uuid,
    Null,
    '2024-01-15 13:45:12',
    'MONI',
    'WARN',
    'BASE',                                                     -- Secteur   : Base de données.
    'LENT',                                                     -- Action    : Requête lente.
    'Requête SQL lente détectée sur la table items',
    '{"duration_ms": 1250, "query": "SELECT * FROM items WHERE content @@ ...", "optimisation_needed": true}'::jsonb
)
On Conflict Do Nothing;                                         -- Terminaison nominale de l'instruction d'insertion.


-- ----------------------------------------------------------------------------
-- 🚨 3. Injection des données de la table Events (Journal d audit Append-Only)
-- ----------------------------------------------------------------------------
Insert Into "Events" (
    "aeIdEvent",
    "aeUserId",
    "aeCreatedAt",
    "aeIdCategory",
    "aeSeverityId",
    "aeType",
    "aeMessage",
    "aeMetadata"
) Values
-- Log 1 : Démarrage du système (aeUserId = NULL)
(
    decode('018d5c8ea0017001d002000000000001', 'hex'),
    Null,
    '2024-01-15 09:10:04',
    'MONI',
    'INFO',
    'systeme.demarrage',
    'Application Mémoria démarrée avec succès',
    '{"version": "1.0.0", "environment": "production"}'::jsonb
),

-- Log 2 : Inscription de Sophie
(
    decode('018d5c8ea0017001d002000000000003', 'hex'),
    decode('018d5c8e567870019001000000000001', 'hex'),
    '2024-01-15 10:00:01',
    'ANAL',
    'INFO',
    'utilisateur.enregistrement',
    'Nouvel utilisateur enregistré via interface locale',
    '{"method": "local", "ip": "192.168.1.15"}'::jsonb
),

-- Log 3 : Alerte sécurité Emma (Poids 20 - WARN)
(
    decode('018d5c8ea0017001d002000000000010', 'hex'),
    decode('018d5c8e567870019001000000000003', 'hex'),
    '2024-01-15 11:02:00',
    'AUDI',
    'WARN',
    'authentification.echec',
    'Tentative de connexion avec mauvais mot de passe',
    '{"user_agent": "Mozilla/5.0 Chrome/120.0", "retry_count": 1}'::jsonb
),

-- Log 4 : Requête RGPD d Alice
(
    decode('018d5c8ea0017001d002000000000020', 'hex'),
    decode('018d5c8e567870019001000000000005', 'hex'),
    '2024-01-15 12:05:00',
    'GDPR',
    'INFO',
    'rgpd.exportation',
    'Exportation complète des données utilisateur demandée',
    '{"format": "json", "request_origin": "web_dashboard"}'::jsonb
),

-- Log 5 : Alerte performance base de données (Poids 20 - WARN)
(
    decode('018d5c8ea0017001d002000000000099', 'hex'),
    Null,
    '2024-01-15 13:45:12',
    'MONI',
    'WARN',
    'bd.requete_lente',
    'Requête SQL lente détectée sur la table items',
    '{"duration_ms": 1250, "query": "SELECT * FROM items WHERE content @@ ...", "optimisation_needed": true}'::jsonb
)
On Conflict Do Nothing;

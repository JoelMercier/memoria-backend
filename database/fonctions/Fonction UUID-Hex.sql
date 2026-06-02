-- ——— fichier : database\fonctions\Fonction UUID-Hex.sql

-- 🪓 LE SOUPIRAIL : Fonction d'usine stockée dans PostgreSQL
-- Reçoit un UUID et extrait directement sa représentation binaire interne de 16 octets (BYTEA) sans aucun transtypage textuel
CREATE OR REPLACE FUNCTION "UUID-Bin"(p_uuid UUID)
RETURNS BYTEA AS $$
BEGIN
    -- Utilisation de la fonction interne native de PostgreSQL qui extrait le flux binaire de 16 octets
    RETURN uuid_send(p_uuid);
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

COMMENT ON FUNCTION "UUID-Bin"(UUID) IS 'Convertit un UUID directement en segment binaire de 16 octets (Bytea) via l exportateur interne du moteur PostgreSQL sans transit textuel.';

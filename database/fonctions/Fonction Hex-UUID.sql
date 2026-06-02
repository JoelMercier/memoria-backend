-- ——— fichier : database\fonctions\Fonction Hex-UUID.sql

-- 🪓 LE SOUPIRAIL : Fonction d'usine stockée dans PostgreSQL
-- Reçoit un buffer de 16 octets (BYTEA) et le convertit directement en UUID sur le disque
CREATE OR REPLACE FUNCTION "Bin-UUID"(p_hex_buff BYTEA)
RETURNS UUID AS $$
BEGIN
    RETURN encode(p_hex_buff, 'hex')::uuid;
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

COMMENT ON FUNCTION "Bin-UUID"(UUID) IS 'Convertit un Buffer[16], ByteA[16], un segment binaire de 16 octets directement via l exportateur interne du moteur PostgreSQL sans transit textuel.';

-- ——— fichier : database\fonctions\Fonction Hex-UUID.sql

-- 🪓 LE SOUPIRAIL : Fonction d'usine stockée dans PostgreSQL
-- Reçoit un buffer de 16 octets (BYTEA) et le convertit directement en UUID sur le disque
CREATE OR REPLACE FUNCTION fn_bin_to_uuid(p_hex_buff BYTEA)
RETURNS UUID AS $$
BEGIN
    RETURN encode(p_hex_buff, 'hex')::uuid;
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

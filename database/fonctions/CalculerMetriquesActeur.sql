-- ——— fichier : database\fonctions\01_CalculerMetriquesActeur.sql

-- 📊 LE SOUPIRAIL : Calcul isolé des compteurs d activité d un acteur
-- Reçoit un identifiant binaire de 16 octets et compte ses ressources à la vitesse de la RAM 🧠
CREATE OR REPLACE FUNCTION "CalculerMetriquesActeur"(p_usIdUser BYTEA)
RETURNS TABLE (
    "usPseudo"        VARCHAR(50),
    "TotalPepites"    BIGINT,
    "TotalEtiquettes" BIGINT
) AS $$
BEGIN
    -- 1. Verrouillage du cordon sanitaire de la clé binaire 🤖
    IF octet_length(p_usIdUser) != 16 THEN
        RAISE EXCEPTION 'Infrastructure 🚨 : l identifiant de l acteur doit comporter exactement 16 octets.';
    END IF;

    RETURN QUERY
    SELECT
        "usPseudo",
        -- Sous-requête 1 : Décompte chirurgical sur l index de clé étrangère des pépites 💽
        (SELECT COUNT(*) FROM "Items" WHERE "itUserId" = p_usIdUser),
        -- Sous-requête 2 : Décompte chirurgical sur l index composite des étiquettes 💾
        (SELECT COUNT(*) FROM "Tags" WHERE "tgUserId" = p_usIdUser)
    FROM "Users"
    WHERE "usIdUser" = p_usIdUser; -- Isolation immédiate sur la Clé Primaire Binaire ⛓️
END;
$$ LANGUAGE plpgsql STABLE STRICT;

COMMENT ON FUNCTION "CalculerMetriquesActeur"(BYTEA) IS '📊 API de Cour Basse calculant les totaux d un acteur via sous-requêtes indexées sans produit cartésien.';

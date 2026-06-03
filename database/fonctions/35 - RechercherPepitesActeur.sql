-- ——— fichier : database\fonctions\02_RechercherPepitesActeur.sql

-- 🔍 LE SOUPIRAIL : Recherche textuelle rapide isolée par acteur
-- Filtre la roche SQL à la racine sur l index propriétaire avant d analyser le texte libre 📖
CREATE OR REPLACE FUNCTION "RechercherPepitesActeur"(
    p_usIdUser BYTEA,
    p_Recherche VARCHAR(100)
)
RETURNS TABLE (
    "itIdItem"        BYTEA,   -- 16 octets
    "itUserId"        BYTEA,   -- 16 octets
    "itCreatedAt"     Timestamp, -- 8 octets
    "itIdContentType" CHAR(3),   -- 3 octets
    "itTitle"         VARCHAR(255),
    "itSlug"          VARCHAR(255),
    "itContent"       TEXT,      -- Corps textuel libre infini 📝
    "itThumbnailUrl"  VARCHAR(255)
) AS $$
BEGIN
    IF octet_length(p_usIdUser) != 16 THEN
        RAISE EXCEPTION 'Infrastructure 🚨 : l identifiant de l acteur doit comporter exactement 16 octets.';
    END IF;

    -- Normalisation du mot-clé à la frontière pour soulager le microprocesseur 🎛️
    p_Recherche := Lower(Trim(p_Recherche));

    RETURN QUERY
    SELECT "itIdItem", "itUserId", "itCreatedAt", "itIdContentType", "itTitle", "itSlug", "itContent", "itThumbnailUrl"
    FROM "Items"
    WHERE "itUserId" = p_usIdUser -- 1. Cordon sanitaire : on se limite à l acteur connecté via son index 💾
      AND (
            Lower("itTitle") LIKE '%' || p_Recherche || '%' -- 2. Balayage textuel localisé ultra-rapide
         OR Lower("itContent") LIKE '%' || p_Recherche || '%'
      );
END;
$$ LANGUAGE plpgsql STABLE STRICT;

COMMENT ON FUNCTION "RechercherPepitesActeur"(BYTEA, VARCHAR) IS '🔍 API de Cour Basse exécutant une recherche textuelle filtrée à la racine sur l index propriétaire.';
